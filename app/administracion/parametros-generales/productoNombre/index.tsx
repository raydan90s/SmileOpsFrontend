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
import { Package } from 'lucide-react-native';
import ModuleHeader from '@components/shared/ModuleHeader';
import SearchInput from '@components/shared/SearchInput';
import DataTable from '@components/shared/DataTable';
import Paginacion from '@components/shared/Paginacion';
import LoadingSpinner from '@components/shared/LoadingSpinner';
import {
  getAllProductosNombre,
  eliminarProductoNombre,
} from '@services/ProductoNombre/ProductoNombre.service';
import type { ProductoNombre } from '@models/ProductoNombre/ProductoNombre.types';
import { Colors, Spacing, FontSizes, BorderRadius } from '@constants/theme';
import BackButton from '@components/shared/BackButton';

export default function ProductosPage() {
  const router = useRouter();

  const [productosNombre, setProductosNombre] = useState<ProductoNombre[]>([]);
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
      const data = await getAllProductosNombre();
      setProductosNombre(data);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      Alert.alert('Error', 'No se pudieron cargar los nombres de productos');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setPaginaActual(1);
  };

  const handleNuevo = () => {
    router.push('/administracion/parametros-generales/productoNombre/crear');
  };

  const handleEditar = (producto: ProductoNombre) => {
    router.push(
      `/administracion/parametros-generales/productoNombre/editar/${producto.iid_nombre}`
    );
  };

  const handleEliminar = async (producto: ProductoNombre) => {
    Alert.alert(
      'Confirmar eliminación',
      '¿Está seguro de eliminar este nombre de producto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await eliminarProductoNombre(producto.iid_nombre);
              Alert.alert('Éxito', 'Nombre de producto eliminado exitosamente');
              cargarDatos();
            } catch (error) {
              console.error('Error al eliminar:', error);
              Alert.alert('Error', 'No se pudo eliminar el nombre de producto');
            }
          },
        },
      ]
    );
  };

  const productosFiltrados = productosNombre.filter((p) =>
    p.vnombre_producto.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPaginas = Math.ceil(productosFiltrados.length / itemsPorPagina);
  const indiceInicio = (paginaActual - 1) * itemsPorPagina;
  const indiceFin = Math.min(
    indiceInicio + itemsPorPagina,
    productosFiltrados.length
  );
  const productosPaginados = productosFiltrados.slice(indiceInicio, indiceFin);

  const handleCambiarPagina = (nuevaPagina: number) => {
    setPaginaActual(nuevaPagina);
  };

  if (loading) {
    return <LoadingSpinner message="Cargando nombres de productos..." />;
  }

  const columns = [
    {
      key: 'iid_nombre',
      label: 'ID',
      width: 0.5,
    },
    {
      key: 'vnombre_producto',
      label: 'Nombre del Producto',
      width: 2,
      render: (producto: ProductoNombre) => (
        <Text style={styles.nombreText}>{producto.vnombre_producto}</Text>
      ),
    },
    {
      key: 'bactivo',
      label: 'Estado',
      width: 1,
      render: (producto: ProductoNombre) => (
        <View
          style={[
            styles.badge,
            producto.bactivo ? styles.badgeActive : styles.badgeInactive,
          ]}
        >
          <Text
            style={[
              styles.badgeText,
              producto.bactivo ? styles.badgeTextActive : styles.badgeTextInactive,
            ]}
          >
            {producto.bactivo ? 'Activo' : 'Inactivo'}
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
          icon={Package}
          title="Gestión de Nombres de Productos"
          subtitle="Administre los nombres de productos"
          addButtonText="Nuevo"
          onAddClick={handleNuevo}
        />

        <View style={styles.content}>
          <SearchInput
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Buscar por nombre..."
          />

          <DataTable
            title="LISTA DE NOMBRES DE PRODUCTOS"
            columns={columns}
            data={productosPaginados}
            onEdit={handleEditar}
            onDelete={handleEliminar}
            getItemId={(producto) => producto.iid_nombre}
            emptyMessage="No se encontraron nombres de productos"
          />

          {productosFiltrados.length > 0 && (
            <Paginacion
              paginaActual={paginaActual}
              totalPaginas={totalPaginas}
              indiceInicio={indiceInicio}
              indiceFin={indiceFin}
              totalItems={productosFiltrados.length}
              onCambiarPagina={handleCambiarPagina}
              nombreEntidad="nombres de productos"
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
  header: {
    padding: Spacing.md,
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
});