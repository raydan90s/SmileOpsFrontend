import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Zap } from 'lucide-react-native';

import ModuleHeader from '@components/shared/ModuleHeader';
import SearchInput from '@components/shared/SearchInput';
import DataTable from '@components/shared/DataTable';
import Paginacion from '@components/shared/Paginacion';
import LoadingSpinner from '@components/shared/LoadingSpinner';

import {
  getAllCaracteristicas,
  eliminarCaracteristica,
} from '@services/Caracteristicas/caracteristicas.service';
import type { Caracteristica } from '@models/Caracteristicas/caracteristicas.types';

import { Colors, Spacing, FontSizes, BorderRadius } from '@constants/theme';
import BackButton from '@components/shared/BackButton';

export default function CaracteristicasPage() {
  const router = useRouter();

  const [caracteristicas, setCaracteristicas] = useState<Caracteristica[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [paginaActual, setPaginaActual] = useState(1);

  const itemsPorPagina = 10;

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const data = await getAllCaracteristicas();
      setCaracteristicas(data);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      Alert.alert('Error', 'No se pudieron cargar las características');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setPaginaActual(1);
  };

  const handleNuevo = () => {
    router.push('/administracion/parametros-generales/caracteristicas/crear');
  };

  const handleEditar = (caracteristica: Caracteristica) => {
    router.push(
      `/administracion/parametros-generales/caracteristicas/editar/${caracteristica.iid_caracteristica}`
    );
  };

  const handleEliminar = async (caracteristica: Caracteristica) => {
    Alert.alert(
      'Confirmar eliminación',
      '¿Está seguro de eliminar esta característica?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await eliminarCaracteristica(caracteristica.iid_caracteristica);
              Alert.alert('Éxito', 'Característica eliminada exitosamente');
              cargarDatos();
            } catch (error) {
              console.error('Error al eliminar:', error);
              Alert.alert('Error', 'No se pudo eliminar la característica');
            }
          },
        },
      ]
    );
  };

  const caracteristicasFiltradas = caracteristicas.filter((c) =>
    c.vnombre_caracteristica.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPaginas = Math.ceil(caracteristicasFiltradas.length / itemsPorPagina);
  const indiceInicio = (paginaActual - 1) * itemsPorPagina;
  const indiceFin = Math.min(
    indiceInicio + itemsPorPagina,
    caracteristicasFiltradas.length
  );
  const caracteristicasPaginadas = caracteristicasFiltradas.slice(
    indiceInicio,
    indiceFin
  );

  const handleCambiarPagina = (nuevaPagina: number) => {
    setPaginaActual(nuevaPagina);
  };

  if (loading) {
    return <LoadingSpinner message="Cargando características..." />;
  }

  const columns = [
    {
      key: 'iid_caracteristica',
      label: 'ID',
      width: 0.5,
    },
    {
      key: 'vnombre_caracteristica',
      label: 'Nombre',
      width: 2,
      render: (caracteristica: Caracteristica) => (
        <Text style={styles.nombreText}>
          {caracteristica.vnombre_caracteristica}
        </Text>
      ),
    },
    {
      key: 'bactivo',
      label: 'Estado',
      width: 1,
      render: (caracteristica: Caracteristica) => (
        <View
          style={[
            styles.badge,
            caracteristica.bactivo ? styles.badgeActive : styles.badgeInactive,
          ]}
        >
          <Text
            style={[
              styles.badgeText,
              caracteristica.bactivo
                ? styles.badgeTextActive
                : styles.badgeTextInactive,
            ]}
          >
            {caracteristica.bactivo ? 'Activo' : 'Inactivo'}
          </Text>
        </View>
      ),
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <BackButton />
      </View>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ModuleHeader
          icon={Zap}
          addButtonText="Nuevo"
          title="Gestión de Características"
          subtitle="Administre las características de productos"
          onAddClick={handleNuevo}
        />

        <View style={styles.content}>
          <SearchInput
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Buscar por nombre..."
          />

          <DataTable
            title="LISTA DE CARACTERÍSTICAS"
            columns={columns}
            data={caracteristicasPaginadas}
            onEdit={handleEditar}
            onDelete={handleEliminar}
            getItemId={(caracteristica) => caracteristica.iid_caracteristica}
            emptyMessage="No se encontraron características"
          />

          {caracteristicasFiltradas.length > 0 && (
            <Paginacion
              paginaActual={paginaActual}
              totalPaginas={totalPaginas}
              indiceInicio={indiceInicio}
              indiceFin={indiceFin}
              totalItems={caracteristicasFiltradas.length}
              onCambiarPagina={handleCambiarPagina}
              nombreEntidad="características"
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing.xxl,
  },
  content: {
    padding: Spacing.md,
  },
  header: {
    padding: Spacing.md,
  },
  nombreText: {
    fontSize: FontSizes.sm,
    fontWeight: '500',
    color: Colors.text,
  },
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    alignSelf: 'flex-start',
  },
  badgeActive: {
    backgroundColor: '#D1FAE5',
  },
  badgeInactive: {
    backgroundColor: '#FEE2E2',
  },
  badgeText: {
    fontSize: FontSizes.xs,
    fontWeight: '600',
  },
  badgeTextActive: {
    color: '#065F46',
  },
  badgeTextInactive: {
    color: '#991B1B',
  },
});