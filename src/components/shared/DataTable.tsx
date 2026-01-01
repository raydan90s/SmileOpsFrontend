import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { Edit, Trash2 } from 'lucide-react-native';
import { Colors, Spacing, FontSizes, BorderRadius } from '@constants/theme';

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
}

export default function DataTable<T>({
  title,
  columns,
  data,
  onEdit,
  onDelete,
  getItemId,
  emptyMessage = 'No se encontraron registros',
  showActions = true,
}: DataTableProps<T>) {
  const renderHeader = () => (
    <View style={styles.tableHeader}>
      {columns.map((column) => (
        <View key={column.key} style={[styles.headerCell, { flex: column.width || 1 }]}>
          <Text style={styles.headerText}>{column.label}</Text>
        </View>
      ))}
      {showActions && (
        <View style={[styles.headerCell, styles.actionsCell]}>
          <Text style={styles.headerText}>Acciones</Text>
        </View>
      )}
    </View>
  );

  const renderRow = ({ item }: { item: T }) => (
    <View style={styles.row}>
      {columns.map((column) => (
        <View key={column.key} style={[styles.cell, { flex: column.width || 1 }]}>
          {column.render ? (
            column.render(item)
          ) : (
            <Text style={styles.cellText}>{(item as any)[column.key]}</Text>
          )}
        </View>
      ))}
      {showActions && (
        <View style={[styles.cell, styles.actionsCell]}>
          <View style={styles.actionsContainer}>
            {onEdit && (
              <TouchableOpacity
                style={[styles.actionButton, styles.editButton]}
                onPress={() => onEdit(item)}
                activeOpacity={0.7}
              >
                <Edit size={18} color="#1E40AF" />
              </TouchableOpacity>
            )}
            {onDelete && (
              <TouchableOpacity
                style={[styles.actionButton, styles.deleteButton]}
                onPress={() => onDelete(item)}
                activeOpacity={0.7}
              >
                <Trash2 size={18} color="#B91C1C" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>{emptyMessage}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
      </View>

      {renderHeader()}

      <FlatList
        data={data}
        renderItem={renderRow}
        keyExtractor={(item) => String(getItemId(item))}
        ListEmptyComponent={renderEmpty}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        scrollEnabled={false}
      />
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
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: Colors.backgroundLight,
    borderBottomWidth: 2,
    borderBottomColor: Colors.border,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  headerCell: {
    justifyContent: 'center',
  },
  headerText: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: Colors.text,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.surface,
  },
  cell: {
    justifyContent: 'center',
  },
  cellText: {
    fontSize: FontSizes.sm,
    color: Colors.text,
  },
  actionsCell: {
    width: 100,
    alignItems: 'center',
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  actionButton: {
    padding: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  editButton: {
    backgroundColor: '#DBEAFE',
  },
  deleteButton: {
    backgroundColor: '#FEE2E2',
  },
  separator: {
    height: 1,
    backgroundColor: Colors.border,
  },
  emptyContainer: {
    paddingVertical: Spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: FontSizes.sm,
    color: Colors.textLight,
  },
});