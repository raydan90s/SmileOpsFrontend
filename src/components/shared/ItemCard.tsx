import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Edit, Trash2, CheckCircle } from 'lucide-react-native';
import { Colors, Spacing, FontSizes, BorderRadius, Shadows } from '@constants/theme';

interface InfoField {
  label?: string;
  value: string;
  icon?: React.ReactNode;
}

interface Badge {
  text: string;
  color: string;
  backgroundColor: string;
}

interface ItemCardProps {
  title: string;
  badge?: Badge;
  secondaryBadge?: Badge;
  infoFields: InfoField[];
  isActive?: boolean;
  onEdit: () => void;
  onDelete?: () => void;
  onActivate?: () => void;
  showActivate?: boolean;
}

export default function ItemCard({
  title,
  badge,
  secondaryBadge,
  infoFields,
  isActive = true,
  onEdit,
  onDelete,
  onActivate,
  showActivate = false,
}: ItemCardProps) {
  const [mainTitle, subtitle] = title.includes('\n') ? title.split('\n') : [title, null];

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.title} numberOfLines={2}>
            {mainTitle}
          </Text>
          
          {subtitle && (
            <Text style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          )}

          {badge && (
            <View style={[styles.badge, { backgroundColor: badge.backgroundColor }]}>
              <Text style={[styles.badgeText, { color: badge.color }]}>
                {badge.text}
              </Text>
            </View>
          )}
        </View>

        {secondaryBadge && (
          <View style={[styles.secondaryBadge, { backgroundColor: secondaryBadge.backgroundColor }]}>
            <Text style={[styles.badgeText, { color: secondaryBadge.color }]}>
              {secondaryBadge.text}
            </Text>
          </View>
        )}
      </View>

      {infoFields && infoFields.length > 0 && (
        <View style={styles.infoSection}>
          {infoFields.map((field, index) => (
            <View key={index} style={styles.infoRow}>
              {field.icon}
              {field.label && <Text style={styles.infoLabel}>{field.label}</Text>}
              <Text style={styles.infoValue} numberOfLines={1}>
                {field.value}
              </Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={onEdit}
          activeOpacity={0.7}
        >
          <Edit size={18} color={Colors.primary} />
          <Text style={styles.editButtonText}>Editar</Text>
        </TouchableOpacity>

        {showActivate && !isActive && onActivate ? (
          <TouchableOpacity
            style={[styles.actionButton, styles.activateButton]}
            onPress={onActivate}
            activeOpacity={0.7}
          >
            <CheckCircle size={18} color={Colors.success} />
            <Text style={styles.activateButtonText}>Activar</Text>
          </TouchableOpacity>
        ) : onDelete ? (
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={onDelete}
            activeOpacity={0.7}
          >
            <Trash2 size={18} color={Colors.error} />
            <Text style={styles.deleteButtonText}>Eliminar</Text>
          </TouchableOpacity>
        ) : null}
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
    gap: 4, 
  },
  title: {
    fontSize: FontSizes.md,
    fontWeight: 'bold',
    color: Colors.text,
  },
  subtitle: {
    fontSize: FontSizes.sm,
    color: Colors.primary, 
    fontWeight: '500',
    fontFamily: 'monospace', 
    marginBottom: 2,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.xs,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    marginTop: 2,
  },
  secondaryBadge: {
    paddingHorizontal: Spacing.xs,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  badgeText: {
    fontSize: FontSizes.xs,
    fontWeight: '600',
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
  activateButton: {
    backgroundColor: `${Colors.success}10`,
    borderColor: Colors.success,
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
  activateButtonText: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: Colors.success,
  },
});