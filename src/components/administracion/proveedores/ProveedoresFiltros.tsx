import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity,
  Modal,
  FlatList,
  Pressable
} from 'react-native';
import { Search, ChevronDown, Check } from 'lucide-react-native';
import type { TipoProveedor } from '@models/administracion/Proveedores/TipoProveedor.types';
import Theme from '@constants/theme';

interface ProveedoresFiltrosProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  tipoFiltro: number | undefined;
  onTipoChange: (value: number | undefined) => void;
  tiposProveedor: TipoProveedor[];
}

export default function ProveedoresFiltros({
  searchTerm,
  onSearchChange,
  tipoFiltro,
  onTipoChange,
  tiposProveedor
}: ProveedoresFiltrosProps) {
  const [showTipoModal, setShowTipoModal] = useState(false);

  const tipoSeleccionado = tiposProveedor.find(
    t => t.iid_tipo_proveedor === tipoFiltro
  );

  const handleSelectTipo = (id: number | undefined) => {
    onTipoChange(id);
    setShowTipoModal(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Buscar</Text>
        <View style={styles.searchContainer}>
          <Search 
            size={20} 
            color={Theme.colors.textLight} 
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por nombre o RUC..."
            placeholderTextColor={Theme.colors.placeholder}
            value={searchTerm}
            onChangeText={onSearchChange}
          />
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Tipo de Proveedor</Text>
        <TouchableOpacity
          style={styles.selectButton}
          onPress={() => setShowTipoModal(true)}
          activeOpacity={0.7}
        >
          <Text style={[
            styles.selectButtonText,
            !tipoSeleccionado && styles.selectButtonPlaceholder
          ]}>
            {tipoSeleccionado?.vnombre || 'Todos los tipos'}
          </Text>
          <ChevronDown size={20} color={Theme.colors.placeholder} />
        </TouchableOpacity>
      </View>

      <Modal
        visible={showTipoModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowTipoModal(false)}
      >
        <Pressable 
          style={styles.modalOverlay}
          onPress={() => setShowTipoModal(false)}
        >
          <Pressable onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Seleccionar Tipo</Text>
              </View>

              <FlatList
                data={[
                  { iid_tipo_proveedor: undefined, vnombre: 'Todos los tipos' },
                  ...tiposProveedor
                ]}
                keyExtractor={(item) => 
                  item.iid_tipo_proveedor?.toString() || 'todos'
                }
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.modalItem}
                    onPress={() => handleSelectTipo(item.iid_tipo_proveedor)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.modalItemText}>{item.vnombre}</Text>
                    {tipoFiltro === item.iid_tipo_proveedor && (
                      <Check size={20} color={Theme.colors.primary} />
                    )}
                  </TouchableOpacity>
                )}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
              />

              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setShowTipoModal(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.modalCloseButtonText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
  },
  inputGroup: {
    gap: Theme.spacing.xs,
  },
  label: {
    fontSize: Theme.fontSizes.sm,
    fontWeight: Theme.fontWeights.medium,
    color: Theme.colors.text,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.surface,
    borderWidth: 2,
    borderColor: Theme.colors.border,
    borderRadius: Theme.borderRadius.md,
    paddingHorizontal: Theme.spacing.sm,
  },
  searchIcon: {
    marginRight: Theme.spacing.xs,
  },
  searchInput: {
    flex: 1,
    paddingVertical: Theme.spacing.sm,
    fontSize: Theme.fontSizes.md,
    color: Theme.colors.text,
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Theme.colors.surface,
    borderWidth: 2,
    borderColor: Theme.colors.border,
    borderRadius: Theme.borderRadius.md,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
  },
  selectButtonText: {
    fontSize: Theme.fontSizes.md,
    color: Theme.colors.text,
  },
  selectButtonPlaceholder: {
    color: Theme.colors.placeholder,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Theme.spacing.md,
  },
  modalContent: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.lg,
    width: '100%',
    maxWidth: 400,
    maxHeight: '70%',
    overflow: 'hidden',
    ...Theme.shadows.xl,
  },
  modalHeader: {
    padding: Theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
  },
  modalTitle: {
    fontSize: Theme.fontSizes.lg,
    fontWeight: Theme.fontWeights.bold,
    color: Theme.colors.text,
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Theme.spacing.md,
  },
  modalItemText: {
    fontSize: Theme.fontSizes.md,
    color: Theme.colors.text,
  },
  separator: {
    height: 1,
    backgroundColor: Theme.colors.border,
  },
  modalCloseButton: {
    backgroundColor: Theme.colors.primary,
    padding: Theme.spacing.md,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Theme.colors.border,
  },
  modalCloseButtonText: {
    color: Theme.colors.textInverse,
    fontSize: Theme.fontSizes.md,
    fontWeight: Theme.fontWeights.semibold,
  },
});