import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList, Pressable, TextInput } from 'react-native';
import { ChevronDown, Check, Search, X } from 'lucide-react-native';
import { Colors, Spacing, BorderRadius, FontSizes } from '@constants/theme';

interface OpcionGeneral {
  id: number | string;
  descripcion: string;
  [key: string]: any;
}

interface SelectorTipoBodegaProps<T extends OpcionGeneral, B extends OpcionGeneral> {
  tipoOptions: T[];
  tipoValue: string;
  tipoOnChange: (value: string) => void;
  tipoLabel?: string;
  tipoPlaceholder?: string;
  tipoIdKey?: keyof T;
  tipoDescKey?: keyof T;

  bodegaOptions: B[];
  bodegaValue: string;
  bodegaOnChange: (value: string) => void;
  bodegaLabel?: string;
  bodegaPlaceholder?: string;
  bodegaIdKey?: keyof B;
  bodegaDescKey?: keyof B;

  loading?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  showTipo?: boolean;
  showBodega?: boolean;
}

const SelectorTipoBodega = <T extends OpcionGeneral, B extends OpcionGeneral>({
  tipoOptions,
  tipoValue,
  tipoOnChange,
  tipoLabel = 'Tipo de Pedido',
  tipoPlaceholder = 'Seleccione un tipo',
  tipoIdKey = 'id' as keyof T,
  tipoDescKey = 'descripcion' as keyof T,

  bodegaOptions,
  bodegaValue,
  bodegaOnChange,
  bodegaLabel = 'Bodega Destino',
  bodegaPlaceholder = 'Seleccione una bodega',
  bodegaIdKey = 'id' as keyof B,
  bodegaDescKey = 'descripcion' as keyof B,

  loading = false,
  disabled = false,
  readOnly = false,
  showTipo = true,
  showBodega = true,
}: SelectorTipoBodegaProps<T, B>) => {

  const [showTipoModal, setShowTipoModal] = useState(false);
  const [showBodegaModal, setShowBodegaModal] = useState(false);
  const [searchTipo, setSearchTipo] = useState('');
  const [searchBodega, setSearchBodega] = useState('');

  const getTipoDescripcion = () => {
    const selected = tipoOptions.find(opt => String(opt[tipoIdKey]) === tipoValue);
    return selected ? String(selected[tipoDescKey]) : '';
  };

  const getBodegaDescripcion = () => {
    const selected = bodegaOptions.find(opt => String(opt[bodegaIdKey]) === bodegaValue);
    return selected ? String(selected[bodegaDescKey]) : '';
  };

  const tiposFiltrados = tipoOptions.filter(opt =>
    String(opt[tipoDescKey]).toLowerCase().includes(searchTipo.toLowerCase())
  );

  const bodegasFiltradas = bodegaOptions.filter(opt =>
    String(opt[bodegaDescKey]).toLowerCase().includes(searchBodega.toLowerCase())
  );

  const handleCloseTipoModal = () => {
    setShowTipoModal(false);
    setSearchTipo('');
  };

  const handleCloseBodegaModal = () => {
    setShowBodegaModal(false);
    setSearchBodega('');
  };

  const renderReadOnlyField = (label: string, value: string) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputContainer, styles.readOnlyContainer]}>
        <Text style={styles.valueText}>{value || '-'}</Text>
      </View>
    </View>
  );

  const renderSelectField = (
    label: string,
    value: string,
    placeholder: string,
    getDescripcion: () => string,
    onPress: () => void
  ) => {
    const displayText = getDescripcion() || placeholder;
    const isPlaceholder = !getDescripcion();

    return (
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>
          {label} <Text style={styles.required}>*</Text>
        </Text>

        <TouchableOpacity
          style={[
            styles.inputContainer,
            (disabled || loading) && styles.disabledContainer
          ]}
          disabled={disabled || loading}
          onPress={onPress}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.valueText,
              isPlaceholder && { color: Colors.placeholder }
            ]}
            numberOfLines={1}
          >
            {loading ? 'Cargando...' : displayText}
          </Text>
          <ChevronDown size={20} color={Colors.placeholder} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {showTipo && (
        readOnly
          ? renderReadOnlyField(tipoLabel, getTipoDescripcion())
          : renderSelectField(
              tipoLabel,
              tipoValue,
              tipoPlaceholder,
              getTipoDescripcion,
              () => setShowTipoModal(true)
            )
      )}

      {showBodega && (
        readOnly
          ? renderReadOnlyField(bodegaLabel, getBodegaDescripcion())
          : renderSelectField(
              bodegaLabel,
              bodegaValue,
              bodegaPlaceholder,
              getBodegaDescripcion,
              () => setShowBodegaModal(true)
            )
      )}

      <Modal
        visible={showTipoModal}
        transparent
        animationType="fade"
        onRequestClose={handleCloseTipoModal}
      >
        <Pressable style={styles.modalOverlay} onPress={handleCloseTipoModal}>
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{tipoLabel}</Text>
              <TouchableOpacity onPress={handleCloseTipoModal}>
                <X size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
              <Search size={18} color={Colors.placeholder} />
              <TextInput
                style={styles.searchInput}
                placeholder="Buscar..."
                value={searchTipo}
                onChangeText={setSearchTipo}
                placeholderTextColor={Colors.placeholder}
              />
              {searchTipo.length > 0 && (
                <TouchableOpacity onPress={() => setSearchTipo('')}>
                  <X size={18} color={Colors.placeholder} />
                </TouchableOpacity>
              )}
            </View>

            <FlatList
              data={tiposFiltrados}
              keyExtractor={(item) => String(item[tipoIdKey])}
              renderItem={({ item }) => {
                const isSelected = String(item[tipoIdKey]) === tipoValue;
                return (
                  <TouchableOpacity
                    style={[styles.modalItem, isSelected && styles.modalItemSelected]}
                    onPress={() => {
                      tipoOnChange(String(item[tipoIdKey]));
                      handleCloseTipoModal();
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.modalItemText, isSelected && styles.modalItemTextSelected]}>
                      {String(item[tipoDescKey])}
                    </Text>
                    {isSelected && <Check size={20} color={Colors.primary} />}
                  </TouchableOpacity>
                );
              }}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No se encontraron resultados</Text>
                </View>
              }
              style={styles.modalList}
            />
          </Pressable>
        </Pressable>
      </Modal>

      <Modal
        visible={showBodegaModal}
        transparent
        animationType="fade"
        onRequestClose={handleCloseBodegaModal}
      >
        <Pressable style={styles.modalOverlay} onPress={handleCloseBodegaModal}>
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{bodegaLabel}</Text>
              <TouchableOpacity onPress={handleCloseBodegaModal}>
                <X size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
              <Search size={18} color={Colors.placeholder} />
              <TextInput
                style={styles.searchInput}
                placeholder="Buscar..."
                value={searchBodega}
                onChangeText={setSearchBodega}
                placeholderTextColor={Colors.placeholder}
              />
              {searchBodega.length > 0 && (
                <TouchableOpacity onPress={() => setSearchBodega('')}>
                  <X size={18} color={Colors.placeholder} />
                </TouchableOpacity>
              )}
            </View>

            <FlatList
              data={bodegasFiltradas}
              keyExtractor={(item) => String(item[bodegaIdKey])}
              renderItem={({ item }) => {
                const isSelected = String(item[bodegaIdKey]) === bodegaValue;
                return (
                  <TouchableOpacity
                    style={[styles.modalItem, isSelected && styles.modalItemSelected]}
                    onPress={() => {
                      bodegaOnChange(String(item[bodegaIdKey]));
                      handleCloseBodegaModal();
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.modalItemText, isSelected && styles.modalItemTextSelected]}>
                      {String(item[bodegaDescKey])}
                    </Text>
                    {isSelected && <Check size={20} color={Colors.primary} />}
                  </TouchableOpacity>
                );
              }}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No se encontraron resultados</Text>
                </View>
              }
              style={styles.modalList}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.md,
    flexWrap: 'wrap',
  },
  fieldContainer: {
    flex: 1,
    minWidth: 150,
  },
  label: {
    fontSize: FontSizes.sm,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 6,
  },
  required: {
    color: '#EF4444',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.surface,
    minHeight: 48,
  },
  readOnlyContainer: {
    backgroundColor: '#F9FAFB',
    borderColor: Colors.border,
  },
  disabledContainer: {
    backgroundColor: '#F3F4F6',
    opacity: 0.7,
  },
  valueText: {
    fontSize: FontSizes.sm,
    color: Colors.text,
    flex: 1,
    marginRight: Spacing.sm,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.md,
  },
  modalContent: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    width: '90%',
    maxWidth: 500,
    maxHeight: '70%',
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.primary,
  },
  modalTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    color: Colors.textInverse,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    margin: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    height: 44,
  },
  searchInput: {
    flex: 1,
    fontSize: FontSizes.sm,
    color: Colors.text,
    marginLeft: Spacing.sm,
    height: '100%',
  },
  modalList: {
    maxHeight: 400,
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    minHeight: 60,
  },
  modalItemSelected: {
    backgroundColor: `${Colors.primary}15`,
  },
  modalItemText: {
    fontSize: FontSizes.md,
    color: Colors.text,
    flex: 1,
    lineHeight: 20,
    paddingRight: Spacing.sm,
  },
  modalItemTextSelected: {
    fontWeight: '600',
    color: Colors.primary,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.border,
    marginHorizontal: Spacing.md,
  },
  emptyContainer: {
    padding: Spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    color: Colors.textLight,
    fontSize: FontSizes.sm,
  },
});

export default SelectorTipoBodega;