import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Edit, Trash2, Phone, Mail } from 'lucide-react-native';
import type { Proveedor } from '@models/administracion/Proveedores/Proveedor.types';
import { Colors, Spacing, FontSizes, BorderRadius, Shadows } from '@constants/theme';

interface ProveedorCardProps {
  proveedor: Proveedor;
  onEditar: (id: number) => void;
  onEliminar: (id: number) => void;
  getTipoNombre: (idTipo: number) => string;
}

export default function ProveedorCard({
  proveedor,
  onEditar,
  onEliminar,
  getTipoNombre
}: ProveedorCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.nombre} numberOfLines={1}>
            {proveedor.vnombre}
          </Text>
          <View style={[
            styles.estadoBadge,
            proveedor.bactivo ? styles.estadoActivo : styles.estadoInactivo
          ]}>
            <Text style={[
              styles.estadoText,
              proveedor.bactivo ? styles.estadoTextoActivo : styles.estadoTextoInactivo
            ]}>
              {proveedor.bactivo ? 'Activo' : 'Inactivo'}
            </Text>
          </View>
        </View>

        <View style={styles.tipoBadge}>
          <Text style={styles.tipoText}>
            {proveedor.itipo_proveedor !== undefined
              ? getTipoNombre(proveedor.itipo_proveedor)
              : 'Sin Tipo'}
          </Text>
        </View>
      </View>

      <View style={styles.infoSection}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>RUC:</Text>
          <Text style={styles.infoValue}>{proveedor.vruc}</Text>
        </View>

        {proveedor.vemail && (
          <View style={styles.infoRow}>
            <Mail size={16} color={Colors.textLight} />
            <Text style={styles.infoValue} numberOfLines={1}>
              {proveedor.vemail}
            </Text>
          </View>
        )}

        {proveedor.vtelefono && (
          <View style={styles.infoRow}>
            <Phone size={16} color={Colors.primary} />
            <Text style={styles.infoValue}>{proveedor.vtelefono}</Text>
          </View>
        )}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => onEditar(proveedor.iid_proveedor)}
          activeOpacity={0.7}
        >
          <Edit size={18} color={Colors.primary} />
          <Text style={styles.editButtonText}>Editar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => onEliminar(proveedor.iid_proveedor)}
          activeOpacity={0.7}
        >
          <Trash2 size={18} color={Colors.error} />
          <Text style={styles.deleteButtonText}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  headerLeft: {
    flex: 1,
    gap: Spacing.xs,
  },
  nombre: {
    fontSize: FontSizes.md,
    fontWeight: 'bold',
    color: Colors.text,
  },
  estadoBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.xs,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  estadoActivo: {
    backgroundColor: '#D1FAE5',
  },
  estadoInactivo: {
    backgroundColor: '#FEE2E2',
  },
  estadoText: {
    fontSize: FontSizes.xs,
    fontWeight: '600',
  },
  estadoTextoActivo: {
    color: '#065F46',
  },
  estadoTextoInactivo: {
    color: '#991B1B',
  },
  tipoBadge: {
    backgroundColor: `${Colors.primary}15`,
    paddingHorizontal: Spacing.xs,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  tipoText: {
    fontSize: FontSizes.xs,
    fontWeight: '600',
    color: Colors.primary,
  },
  infoSection: {
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
    paddingTop: Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  infoLabel: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: Colors.primary,
  },
  infoValue: {
    fontSize: FontSizes.sm,
    color: Colors.text,
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
  },
  editButton: {
    backgroundColor: `${Colors.primary}10`,
    borderColor: Colors.primary,
  },
  deleteButton: {
    backgroundColor: `${Colors.error}10`,
    borderColor: Colors.error,
  },
  editButtonText: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: Colors.primary,
  },
  deleteButtonText: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: Colors.error,
  },
});