import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Package } from 'lucide-react-native';
import ProveedorCard from './ProveedorCard';
import type { Proveedor } from '@models/administracion/Proveedores/Proveedor.types';
import { Colors, Spacing, FontSizes } from '@constants/theme';

interface ProveedoresListProps {
  proveedores: Proveedor[];
  onEditar: (id: number) => void;
  onActivar: (id: number) => void;
  onEliminar: (id: number) => void;
  getTipoNombre: (idTipo: number) => string;
}

export default function ProveedoresList({
  proveedores,
  onEditar,
  onEliminar,
  onActivar,
  getTipoNombre
}: ProveedoresListProps) {
  if (proveedores.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Package size={64} color={Colors.borderLight} />
        <Text style={styles.emptyTitle}>No hay proveedores registrados</Text>
        <Text style={styles.emptySubtitle}>
          Comience agregando un nuevo proveedor
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={proveedores}
      keyExtractor={(item) => item.iid_proveedor.toString()}
      renderItem={({ item }) => (
        <ProveedorCard
          proveedor={item}
          onEditar={onEditar}
          onEliminar={onEliminar}
          getTipoNombre={getTipoNombre}
          onActivar={onActivar}
        />
      )}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  emptyTitle: {
    fontSize: FontSizes.lg,
    color: Colors.textLight,
    marginTop: Spacing.md,
    marginBottom: Spacing.xs,
  },
  emptySubtitle: {
    fontSize: FontSizes.sm,
    color: Colors.placeholder,
  },
  listContent: {
    padding: Spacing.md,
  },
});