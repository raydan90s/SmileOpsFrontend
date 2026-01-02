import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Package } from 'lucide-react-native';

import ModuleHeader from '@components/shared/ModuleHeader';
import LoadingSpinner from '@components/shared/LoadingSpinner';
import ProveedoresFiltros from '@components/administracion/Proveedores/ProveedoresFiltros';
import ProveedoresList from '@components/administracion/Proveedores/ProveedoresTabla';
import Paginacion from '@components/shared/Paginacion';

import { fetchAllProveedores, deleteProveedor } from '@services/Administracion/proveedores.service';
import { fetchAllTiposProveedor } from '@services/Administracion/tiposProveedor.service';
import type { TipoProveedor } from '@models/administracion/Proveedores/TipoProveedor.types';
import type { Proveedor } from '@models/administracion/Proveedores/Proveedor.types';

import { Colors, Spacing } from '@constants/theme';
import BackButton from '@components/shared/BackButton';

export default function ProveedoresPage() {
  const router = useRouter();

  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [tiposProveedor, setTiposProveedor] = useState<TipoProveedor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [tipoFiltro, setTipoFiltro] = useState<number | undefined>(undefined);
  const [paginaActual, setPaginaActual] = useState(1);
  const itemsPorPagina = 10;

  useEffect(() => {
    cargarDatos();
  }, [tipoFiltro]);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [proveedoresData, tiposData] = await Promise.all([
        fetchAllProveedores(tipoFiltro),
        fetchAllTiposProveedor()
      ]);
      setProveedores(proveedoresData);
      setTiposProveedor(tiposData);
      setPaginaActual(1);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      Alert.alert('Error', 'No se pudieron cargar los proveedores');
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (id: number) => {
    Alert.alert(
      'Confirmar eliminación',
      '¿Está seguro de eliminar este proveedor?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteProveedor(id);
              Alert.alert('Éxito', 'Proveedor eliminado exitosamente');
              cargarDatos();
            } catch (error) {
              console.error('Error al eliminar:', error);
              Alert.alert('Error', 'No se pudo eliminar el proveedor');
            }
          }
        }
      ]
    );
  };

  const getTipoNombre = (idTipo: number) => {
    const tipo = tiposProveedor.find(t => t.iid_tipo_proveedor === idTipo);
    return tipo?.vnombre || 'N/A';
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setPaginaActual(1);
  };

  const proveedoresFiltrados = proveedores.filter(p =>
    (p.vnombre?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (p.vruc || '').includes(searchTerm)
  );

  const totalPaginas = Math.ceil(proveedoresFiltrados.length / itemsPorPagina);
  const indiceInicio = (paginaActual - 1) * itemsPorPagina;
  const indiceFin = indiceInicio + itemsPorPagina;
  const proveedoresPaginados = proveedoresFiltrados.slice(indiceInicio, indiceFin);

  if (loading) {
    return <LoadingSpinner message="Cargando proveedores..." />;
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <BackButton />
      </View>
      <View style={styles.container}>
        <ModuleHeader
          icon={Package}
          title="Gestión de Proveedores"
          subtitle="Administre sus proveedores"
          addButtonText="Nuevo"
          onAddClick={() => router.push('/administracion/proveedores/crear')}
        />

        <View style={styles.filterContainer}>
          <ProveedoresFiltros
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            tipoFiltro={tipoFiltro}
            onTipoChange={setTipoFiltro}
            tiposProveedor={tiposProveedor}
          />
        </View>

        <View style={styles.listContainer}>
          <ProveedoresList
            proveedores={proveedoresPaginados}
            onEditar={(id) => router.push(`/administracion/proveedores/editar/${id}`)}
            onEliminar={handleEliminar}
            getTipoNombre={getTipoNombre}
          />
        </View>

        {proveedoresFiltrados.length > 0 && (
          <View style={styles.paginationContainer}>
            <Paginacion
              paginaActual={paginaActual}
              totalPaginas={totalPaginas}
              indiceInicio={indiceInicio}
              indiceFin={indiceFin}
              totalItems={proveedoresFiltrados.length}
              onCambiarPagina={setPaginaActual}
              nombreEntidad="proveedores"
            />
          </View>
        )}
      </View>
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
  filterContainer: {
    padding: Spacing.md,
    backgroundColor: Colors.surface,
  },
  listContainer: {
    flex: 1,
  },
  paginationContainer: {
    padding: Spacing.md,
    backgroundColor: Colors.surface,
  },
  header: {
    padding: Spacing.md,
  },
});