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
import { Tag } from 'lucide-react-native';
import ModuleHeader from '@components/shared/ModuleHeader';
import SearchInput from '@components/shared/SearchInput';
import DataTable from '@components/shared/DataTable';
import Paginacion from '@components/shared/Paginacion';
import LoadingSpinner from '@components/shared/LoadingSpinner';
import { getAllMarcas, eliminarMarca } from '@services/Marcas/marcas.service';
import type { Marca } from '@models/Marca/marcas.type';
import { Colors, Spacing, FontSizes, BorderRadius } from '@constants/theme';
import BackButton from '@components/shared/BackButton';

export default function MarcasPage() {
  const router = useRouter();

  const [marcas, setMarcas] = useState<Marca[]>([]);
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
      const data = await getAllMarcas();
      setMarcas(data);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar las marcas');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setPaginaActual(1);
  };

  const handleNuevo = () => {
    router.push('/administracion/parametros-generales/marcas/crear');
  };

  const handleEditar = (marca: Marca) => {
    router.push(`/administracion/parametros-generales/marcas/editar/${marca.iid_marca}`);
  };

  const handleEliminar = async (marca: Marca) => {
    Alert.alert(
      'Confirmar eliminación',
      '¿Está seguro de eliminar esta marca?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await eliminarMarca(marca.iid_marca);
              Alert.alert('Éxito', 'Marca eliminada exitosamente');
              cargarDatos();
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar la marca');
            }
          },
        },
      ]
    );
  };

  const marcasFiltradas = marcas.filter((m) =>
    m.vnombre_marca.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPaginas = Math.ceil(marcasFiltradas.length / itemsPorPagina);
  const indiceInicio = (paginaActual - 1) * itemsPorPagina;
  const indiceFin = Math.min(indiceInicio + itemsPorPagina, marcasFiltradas.length);
  const marcasPaginadas = marcasFiltradas.slice(indiceInicio, indiceFin);

  const handleCambiarPagina = (nuevaPagina: number) => {
    setPaginaActual(nuevaPagina);
  };

  if (loading) {
    return <LoadingSpinner message="Cargando marcas..." />;
  }

  const columns = [
    {
      key: 'iid_marca',
      label: 'ID',
      width: 0.5,
    },
    {
      key: 'vnombre_marca',
      label: 'Nombre',
      width: 2,
      render: (marca: Marca) => (
        <Text style={styles.nombreText}>{marca.vnombre_marca}</Text>
      ),
    },
    {
      key: 'bactivo',
      label: 'Estado',
      width: 1,
      render: (marca: Marca) => (
        <View
          style={[
            styles.badge,
            marca.bactivo ? styles.badgeActive : styles.badgeInactive,
          ]}
        >
          <Text
            style={[
              styles.badgeText,
              marca.bactivo ? styles.badgeTextActive : styles.badgeTextInactive,
            ]}
          >
            {marca.bactivo ? 'Activo' : 'Inactivo'}
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
          icon={Tag}
          addButtonText="Nuevo"
          title="Gestión de Marcas"
          subtitle="Administre las marcas de productos"
          onAddClick={handleNuevo}
        />

        <View style={styles.content}>
          <SearchInput
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Buscar por nombre..."
          />

          <DataTable
            title="LISTA DE MARCAS"
            columns={columns}
            data={marcasPaginadas}
            onEdit={handleEditar}
            onDelete={handleEliminar}
            getItemId={(marca) => marca.iid_marca}
            emptyMessage="No se encontraron marcas"
          />

          {marcasFiltradas.length > 0 && (
            <Paginacion
              paginaActual={paginaActual}
              totalPaginas={totalPaginas}
              indiceInicio={indiceInicio}
              indiceFin={indiceFin}
              totalItems={marcasFiltradas.length}
              onCambiarPagina={handleCambiarPagina}
              nombreEntidad="marcas"
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
  header: {
    padding: Spacing.md,
  },
});