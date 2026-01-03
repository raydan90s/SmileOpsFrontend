import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, FontSizes, BorderRadius } from '@constants/theme';
import CardList from '@components/shared/CardList';
import ItemCard from '@components/shared/ItemCard';

interface Column<T> {
  key: string;
  label: string;
  render?: (item: T) => React.ReactNode;
  width?: number;
}

interface DataTableProps<T> {
  title: string;
  columns: Column<T>[];
  data: T[];
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  getItemId: (item: T) => number | string;
  emptyMessage?: string;
  showActions?: boolean;
  getTitleField: (item: T) => string;
  getBadge?: (item: T) => { text: string; color: string; backgroundColor: string } | undefined;
  getSecondaryBadge?: (item: T) => { text: string; color: string; backgroundColor: string } | undefined;
  getIsActive?: (item: T) => boolean;
  onActivate?: (item: T) => void;
}

export default function DataTable<T>({
  title,
  columns,
  data,
  onEdit,
  onDelete,
  getItemId,
  emptyMessage = 'No se encontraron registros',
  getTitleField,
  getBadge,
  getSecondaryBadge,
  getIsActive,
  onActivate,
}: DataTableProps<T>) {
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
      </View>

      <View style={styles.content}>
        <CardList
          data={data}
          keyExtractor={(item) => String(getItemId(item))}
          emptyTitle={emptyMessage}
          emptySubtitle="No hay datos para mostrar"
          renderItem={(item) => {
            const infoFields = columns
              .filter((col) => col.key !== getTitleField(item))
              .map((col) => {
                if (col.render) {
                  return null;
                }
                return {
                  label: `${col.label}:`,
                  value: String((item as any)[col.key] || '-'),
                };
              })
              .filter(Boolean) as Array<{ label?: string; value: string; icon?: React.ReactNode }>;

            return (
              <ItemCard
                title={getTitleField(item)}
                badge={getBadge?.(item)}
                secondaryBadge={getSecondaryBadge?.(item)}
                infoFields={infoFields}
                isActive={getIsActive?.(item) ?? true}
                onEdit={() => onEdit?.(item)}
                onDelete={onDelete ? () => onDelete(item) : undefined}
                onActivate={onActivate ? () => onActivate(item) : undefined}
                showActivate={!!onActivate}
              />
            );
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    borderColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    marginBottom: Spacing.md,
  },
  titleContainer: {
    backgroundColor: Colors.primary,
    padding: Spacing.md,
  },
  title: {
    fontSize: FontSizes.md,
    fontWeight: 'bold',
    color: Colors.textInverse,
  },
  content: {
    backgroundColor: Colors.surface,
  },
});