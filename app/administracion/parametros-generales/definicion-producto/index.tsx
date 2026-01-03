import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { FileText } from 'lucide-react-native';

import ModuleHeader from '@components/shared/ModuleHeader';
import SearchInput from '@components/shared/SearchInput';
import DataTable from '@components/shared/DataTable';
import Paginacion from '@components/shared/Paginacion';
import LoadingSpinner from '@components/shared/LoadingSpinner';
import BackButton from '@components/shared/BackButton';

import {
  getAllProductos,
  eliminarProducto,
  activarProducto,
} from '@services/ProductoInventario/ProductoInventario.service';

import type { ProductoInventario } from '@models/ProductoInventario/ProductoInventario.types';
import { Colors, Spacing, FontSizes, BorderRadius } from '@constants/theme';

export default function DefinicionProductoPage() {
  const router = useRouter();

  const [productos, setProductos] = useState<ProductoInventario[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [paginaActual, setPaginaActual] = useState(1);

  const itemsPorPagina = 10;

  useFocusEffect(
    useCallback(() => {
      cargarDatos();
    }, [])
  );

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const data = await getAllProductos();
      setProductos(data);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los productos');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setPaginaActual(1);
  };

  const handleNuevo = () => {
    router.push('/administracion/parametros-generales/definicion-producto/crear');
  };

  const handleEditar = (producto: ProductoInventario) => {
    router.push(
      `/administracion/parametros-generales/definicion-producto/editar/${producto.iid_inventario}`
    );
  };

  const handleEliminar = async (producto: ProductoInventario) => {
    Alert.alert(
      'Confirmar eliminación',
      '¿Está seguro de eliminar este producto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await eliminarProducto(producto.iid_inventario);
              Alert.alert('Éxito', 'Producto eliminado exitosamente');
              cargarDatos();
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar el producto');
            }
          },
        },
      ]
    );
  };

  const handleActivar = async (producto: ProductoInventario) => {
    Alert.alert(
      'Confirmar activación',
      '¿Está seguro de activar este producto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Activar',
          style: 'default',
          onPress: async () => {
            try {
              setLoading(true);
              await activarProducto(producto.iid_inventario);
              Alert.alert('Éxito', 'Producto activado exitosamente');
              cargarDatos();
            } catch (error) {
              Alert.alert('Error', 'No se pudo activar el producto');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const productosFiltrados = productos.filter((p) => {
    const searchLower = searchTerm.toLowerCase();
    const nombreMatch = p.vnombre_producto?.toLowerCase().includes(searchLower) || false;
    const codigoMatch = p.codigo_producto?.toLowerCase().includes(searchLower) || false;
    const marcaMatch = p.vnombre_marca?.toLowerCase().includes(searchLower) || false;
    return nombreMatch || codigoMatch || marcaMatch;
  });

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

  const getNombreCompleto = (item: ProductoInventario) => {
    return [
      item.vnombre_producto,
      item.vnombre_caracteristica,
      item.vnombre_marca
    ].filter(Boolean).join(' - ');
  };

  if (loading) {
    return <LoadingSpinner message="Cargando productos..." />;
  }

  const columns = [
    {
      key: 'vnombre_producto',
      label: 'Producto / Detalle',
      width: 3,
      render: (item: ProductoInventario) => (
        <View style={styles.cellContainer}>
          <Text style={styles.nombreText}>
            {getNombreCompleto(item)}
          </Text>
          <Text style={styles.codigoText}>
            {item.codigo_producto}
          </Text>
        </View>
      ),
    },
    {
      key: 'estado',
      label: 'Estado',
      width: 1,
      render: (item: ProductoInventario) => (
        <View
          style={[
            styles.badge,
            item.estado ? styles.badgeActive : styles.badgeInactive,
          ]}
        >
          <Text
            style={[
              styles.badgeText,
              item.estado ? styles.badgeTextActive : styles.badgeTextInactive,
            ]}
          >
            {item.estado ? 'Activo' : 'Inactivo'}
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
          icon={FileText}
          addButtonText="Nuevo"
          title="Definición de Productos"
          subtitle="Administre el inventario de productos"
          onAddClick={handleNuevo}
        />

        <View style={styles.content}>
          <SearchInput
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Buscar por nombre, código o marca..."
          />

          <DataTable
            title="LISTA DE PRODUCTOS"
            columns={columns}
            data={productosPaginados}
            onEdit={handleEditar}
            onDelete={handleEliminar}
            onActivate={handleActivar}
            getItemId={(item) => item.iid_inventario}
            emptyMessage="No se encontraron productos"
            
            getTitleField={(item) => {
              const linea1 = getNombreCompleto(item);
              const linea2 = item.codigo_producto || '';
              return `${linea1}\n${linea2}`;
            }}
            
            getBadge={(item) => ({
              text: item.estado ? 'Activo' : 'Inactivo',
              color: item.estado ? '#065F46' : '#991B1B',
              backgroundColor: item.estado ? '#D1FAE5' : '#FEE2E2',
            })}
            getIsActive={(item) => item.estado}
          />

          {productosFiltrados.length > 0 && (
            <Paginacion
              paginaActual={paginaActual}
              totalPaginas={totalPaginas}
              indiceInicio={indiceInicio}
              indiceFin={indiceFin}
              totalItems={productosFiltrados.length}
              onCambiarPagina={handleCambiarPagina}
              nombreEntidad="productos"
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
  cellContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  nombreText: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  codigoText: {
    fontSize: FontSizes.xs,
    color: Colors.textLight,
    fontFamily: 'monospace',
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