import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  TouchableOpacity
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { Users, Plus, ChevronLeft, ChevronRight } from 'lucide-react-native';

import PacientesFiltros from '@components/administracion/Pacientes/PacientesFiltros';
import PacientesTabla from '@components/administracion/Pacientes/PacientesTabla';
import ModalExito from '@components/shared/ModalExito';

import {
  obtenerTodosPacientes,
  desactivarPaciente,
  activarPaciente
} from '@services/Pacientes/Pacientes.service';
import type { PacienteDB } from '@models/Pacientes/Pacientes.types';

import Theme, { Colors, Spacing, BorderRadius, FontSizes, Shadows } from '@constants/theme';
import BackButton from '@components/shared/BackButton';

const PacientesScreen: React.FC = () => {
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);

  const [pacientes, setPacientes] = useState<PacienteDB[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [paginaActual, setPaginaActual] = useState(1);
  const [modalExito, setModalExito] = useState({
    isOpen: false,
    mensaje: '',
    titulo: '¡Éxito!'
  });

  const itemsPorPagina = 10;

  useFocusEffect(
    useCallback(() => {
      cargarDatos();
    }, [])
  );

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const pacientesData = await obtenerTodosPacientes();
      setPacientes(pacientesData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      Alert.alert('Error', 'No se pudieron cargar los pacientes');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleEstado = (paciente: PacienteDB) => {
    if (!paciente.iidpaciente) return;

    const accion = paciente.cestado ? 'desactivar' : 'activar';

    Alert.alert(
      `Confirmar ${accion}`,
      `¿Está seguro de ${accion} este paciente?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sí, confirmar',
          style: paciente.cestado ? 'destructive' : 'default',
          onPress: async () => {
            try {
              if (paciente.cestado) {
                await desactivarPaciente(paciente.iidpaciente!);
                setModalExito({
                  isOpen: true,
                  mensaje: 'El paciente ha sido desactivado exitosamente',
                  titulo: '¡Paciente Desactivado!'
                });
              } else {
                await activarPaciente(paciente.iidpaciente!);
                setModalExito({
                  isOpen: true,
                  mensaje: 'El paciente ha sido activado exitosamente',
                  titulo: '¡Paciente Activado!'
                });
              }
              cargarDatos(); 
            } catch (error) {
              console.error(`Error al ${accion} paciente:`, error);
              Alert.alert('Error', `Ocurrió un error al ${accion} el paciente.`);
            }
          }
        }
      ]
    );
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setPaginaActual(1);
  };

  const obtenerNombreCompleto = (paciente: PacienteDB) => {
    const partes = [
      paciente.vprimerapellido,
      paciente.vsegundoapellido,
      paciente.votrosapellidos,
      paciente.vnombres
    ].filter(Boolean);
    return partes.join(' ');
  };

  const pacientesFiltrados = pacientes.filter(p => {
    const nombreCompleto = obtenerNombreCompleto(p).toLowerCase();
    const searchLower = searchTerm.toLowerCase();
    return (
      nombreCompleto.includes(searchLower) ||
      (p.vcedula || '').includes(searchTerm) ||
      (p.iidpaciente?.toString() || '').includes(searchTerm)
    );
  });

  const totalPaginas = Math.ceil(pacientesFiltrados.length / itemsPorPagina);
  const indiceInicio = (paginaActual - 1) * itemsPorPagina;
  const indiceFin = indiceInicio + itemsPorPagina;
  const pacientesPaginados = pacientesFiltrados.slice(indiceInicio, indiceFin);

  const handleCambiarPagina = (nuevaPagina: number) => {
    if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
      setPaginaActual(nuevaPagina);
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Cargando pacientes...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerButton}>
        <BackButton />
      </View>
      <View style={styles.header}>
        <View style={styles.headerTitleContainer}>
          <Users size={28} color={Colors.primary} />
          <View style={{ marginLeft: Spacing.sm }}>
            <Text style={styles.title}>Gestión de Pacientes</Text>
            <Text style={styles.subtitle}>Administre sus pacientes</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/odontologia/pacientes/crear')}
        >
          <Plus size={20} color="#FFF" />
          <Text style={styles.addButtonText}>Nuevo</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <PacientesFiltros
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
        />

        <View style={styles.listSection}>
          <View style={styles.listHeader}>
            <Text style={styles.listTitle}>LISTA DE PACIENTES</Text>
            <Text style={styles.listCount}>{pacientesFiltrados.length} Total</Text>
          </View>

          <PacientesTabla
            pacientes={pacientesPaginados}
            onEditar={(id) => router.push(`/administracion/pacientes/editar/${id}`)}
            onToggleEstado={handleToggleEstado}
            obtenerNombreCompleto={obtenerNombreCompleto}
          />
        </View>

        {pacientesFiltrados.length > 0 && (
          <View style={styles.paginationContainer}>
            <TouchableOpacity
              style={[styles.pageButton, paginaActual === 1 && styles.pageButtonDisabled]}
              onPress={() => handleCambiarPagina(paginaActual - 1)}
              disabled={paginaActual === 1}
            >
              <ChevronLeft size={20} color={paginaActual === 1 ? Colors.placeholder : Colors.text} />
            </TouchableOpacity>

            <Text style={styles.pageInfo}>
              Página {paginaActual} de {totalPaginas}
            </Text>

            <TouchableOpacity
              style={[styles.pageButton, paginaActual === totalPaginas && styles.pageButtonDisabled]}
              onPress={() => handleCambiarPagina(paginaActual + 1)}
              disabled={paginaActual === totalPaginas}
            >
              <ChevronRight size={20} color={paginaActual === totalPaginas ? Colors.placeholder : Colors.text} />
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      <ModalExito
        isOpen={modalExito.isOpen}
        onClose={() => setModalExito({ ...modalExito, isOpen: false })}
        mensaje={modalExito.mensaje}
        titulo={modalExito.titulo}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  loadingText: {
    marginTop: Spacing.md,
    fontSize: FontSizes.md,
    color: Colors.textLight,
  },
  headerButton: {
    padding: Theme.spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    color: Colors.text,
  },
  subtitle: {
    fontSize: FontSizes.xs,
    color: Colors.secondary,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    gap: 4,
    ...Shadows.sm,
  },
  addButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: FontSizes.sm,
  },
  content: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  listSection: {
    marginTop: Spacing.sm,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    padding: Spacing.md,
    borderTopLeftRadius: BorderRadius.lg,
    borderTopRightRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
  },
  listTitle: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: FontSizes.sm,
  },
  listCount: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: FontSizes.xs,
  },

  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.lg,
    gap: Spacing.md,
  },
  pageButton: {
    padding: Spacing.sm,
    backgroundColor: '#FFF',
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  pageButtonDisabled: {
    backgroundColor: '#F3F4F6',
    borderColor: '#E5E7EB',
  },
  pageInfo: {
    fontSize: FontSizes.sm,
    color: Colors.text,
    fontWeight: '500',
  },
});

export default PacientesScreen;