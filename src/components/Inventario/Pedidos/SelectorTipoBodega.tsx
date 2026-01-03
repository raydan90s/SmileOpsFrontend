import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList, Pressable } from 'react-native';
import { ChevronDown, Check } from 'lucide-react-native';
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
  
  const getTipoDescripcion = () => {
    const selected = tipoOptions.find(opt => String(opt[tipoIdKey]) === tipoValue);
    return selected ? String(selected[tipoDescKey]) : '';
  };

  const getBodegaDescripcion = () => {
    const selected = bodegaOptions.find(opt => String(opt[bodegaIdKey]) === bodegaValue);
    return selected ? String(selected[bodegaDescKey]) : '';
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
    options: any[],
    idKey: any,
    descKey: any,
    onChange: (val: string) => void,
    showModal: boolean,
    setShowModal: (show: boolean) => void
  ) => {
    const selectedOption = options.find(opt => String(opt[idKey]) === value);
    const displayText = selectedOption ? String(selectedOption[descKey]) : placeholder;

    return (
      <>
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
            onPress={() => !disabled && !loading && setShowModal(true)}
            activeOpacity={0.7}
          >
            <Text style={[
              styles.valueText,
              !selectedOption && { color: Colors.placeholder }
            ]}>
              {loading ? 'Cargando...' : displayText}
            </Text>
            <ChevronDown size={20} color={Colors.placeholder} />
          </TouchableOpacity>
        </View>

        {/* Modal */}
        <Modal
          visible={showModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowModal(false)}
        >
          <Pressable style={styles.modalOverlay} onPress={() => setShowModal(false)}>
            <Pressable onPress={(e) => e.stopPropagation()}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>{label}</Text>
                </View>
                <FlatList
                  data={options}
                  keyExtractor={(item) => String(item[idKey])}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.modalItem}
                      onPress={() => {
                        onChange(String(item[idKey]));
                        setShowModal(false);
                      }}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.modalItemText}>
                        {String(item[descKey])}
                      </Text>
                      {String(item[idKey]) === value && (
                        <Check size={20} color={Colors.primary} />
                      )}
                    </TouchableOpacity>
                  )}
                  ItemSeparatorComponent={() => <View style={styles.separator} />}
                  style={styles.modalList}
                />
                <TouchableOpacity
                  style={styles.modalCloseButton}
                  onPress={() => setShowModal(false)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.modalCloseButtonText}>Cerrar</Text>
                </TouchableOpacity>
              </View>
            </Pressable>
          </Pressable>
        </Modal>
      </>
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
              tipoOptions, 
              tipoIdKey, 
              tipoDescKey, 
              tipoOnChange,
              showTipoModal,
              setShowTipoModal
            )
      )}

      {showBodega && (
        readOnly 
          ? renderReadOnlyField(bodegaLabel, getBodegaDescripcion())
          : renderSelectField(
              bodegaLabel, 
              bodegaValue, 
              bodegaPlaceholder, 
              bodegaOptions, 
              bodegaIdKey, 
              bodegaDescKey, 
              bodegaOnChange,
              showBodegaModal,
              setShowBodegaModal
            )
      )}
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
    paddingVertical: Spacing.sm + 2,
    backgroundColor: Colors.surface,
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
    maxHeight: '100%',
    overflow: 'hidden',
  },
  modalHeader: {
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.text,
  },
  modalList: {
    maxHeight: 900,
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
    minHeight: 56,
  },
  modalItemText: {
    fontSize: FontSizes.md,
    color: Colors.text,
    flex: 1,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.border,
  },
  modalCloseButton: {
    backgroundColor: Colors.primary,
    padding: Spacing.md,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  modalCloseButtonText: {
    color: Colors.textInverse,
    fontSize: FontSizes.sm,
    fontWeight: '600',
  },
});

export default SelectorTipoBodega;