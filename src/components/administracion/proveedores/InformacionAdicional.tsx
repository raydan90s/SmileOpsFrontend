import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Switch, Modal, FlatList, Pressable } from 'react-native';
import { Save, ChevronDown, Check } from 'lucide-react-native';
import type { TipoProveedor } from '@models/administracion/Proveedores/TipoProveedor.types';
import { Colors, Spacing, FontSizes, BorderRadius } from '@constants/theme';

interface InformacionAdicionalProps {
  formData: {
    itipo_proveedor: number | '';
    vtelefono: string;
    vemail: string;
    bactivo: boolean;
  };
  tiposProveedor: TipoProveedor[];
  errors: {
    itipo_proveedor?: string;
    vemail?: string;
  };
  onChange: <K extends keyof InformacionAdicionalProps['formData']>(
    name: K,
    value: InformacionAdicionalProps['formData'][K]
  ) => void;
  onSubmit: () => void;
  loading: boolean;
}

export default function InformacionAdicional({
  formData,
  tiposProveedor,
  errors,
  onChange,
  onSubmit,
  loading,
}: InformacionAdicionalProps) {
  const [showTipoModal, setShowTipoModal] = useState(false);

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>INFORMACIÓN ADICIONAL</Text>
      </View>

      <View style={styles.sectionContent}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Tipo de Proveedor <Text style={styles.required}>*</Text>
          </Text>
          <TouchableOpacity
            style={[
              styles.selectButton,
              errors.itipo_proveedor && styles.inputError,
            ]}
            onPress={() => setShowTipoModal(true)}
            activeOpacity={0.7}
          >
            <Text style={[
              styles.selectButtonText,
              !formData.itipo_proveedor && styles.placeholderText
            ]}>
              {formData.itipo_proveedor
                ? tiposProveedor.find(t => t.iid_tipo_proveedor === formData.itipo_proveedor)?.vnombre
                : 'Seleccionar tipo'}
            </Text>
            <ChevronDown size={20} color={Colors.placeholder} />
          </TouchableOpacity>
          {errors.itipo_proveedor && (
            <Text style={styles.errorText}>{errors.itipo_proveedor}</Text>
          )}
        </View>

        <Modal
          visible={showTipoModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowTipoModal(false)}
        >
          <Pressable style={styles.modalOverlay} onPress={() => setShowTipoModal(false)}>
            <Pressable onPress={(e) => e.stopPropagation()}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Seleccionar Tipo de Proveedor</Text>
                </View>
                <FlatList
                  data={tiposProveedor}
                  keyExtractor={(item) => item.iid_tipo_proveedor.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.modalItem}
                      onPress={() => {
                        onChange('itipo_proveedor', item.iid_tipo_proveedor);
                        setShowTipoModal(false);
                      }}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.modalItemText}>{item.vnombre}</Text>
                      {formData.itipo_proveedor === item.iid_tipo_proveedor && (
                        <Check size={20} color={Colors.primary} />
                      )}
                    </TouchableOpacity>
                  )}
                  ItemSeparatorComponent={() => <View style={styles.separator} />}
                  style={styles.modalList}
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

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Teléfono</Text>
          <TextInput
            style={styles.input}
            value={formData.vtelefono}
            onChangeText={(value) => onChange('vtelefono', value)}
            placeholder="0999999999"
            placeholderTextColor={Colors.placeholder}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.input, errors.vemail && styles.inputError]}
            value={formData.vemail}
            onChangeText={(value) => onChange('vemail', value)}
            placeholder="ejemplo@correo.com"
            placeholderTextColor={Colors.placeholder}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {errors.vemail && <Text style={styles.errorText}>{errors.vemail}</Text>}
        </View>

        <View style={styles.switchContainer}>
          <Text style={styles.label}>Proveedor activo</Text>
          <Switch
            value={formData.bactivo}
            onValueChange={(value) => onChange('bactivo', value)}
            trackColor={{ false: Colors.border, true: Colors.primary }}
            thumbColor={Colors.surface}
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.saveButton, loading && styles.saveButtonDisabled]}
            onPress={onSubmit}
            disabled={loading}
            activeOpacity={0.8}
          >
            <Save size={24} color={Colors.textInverse} />
            <Text style={styles.saveButtonText}>
              {loading ? 'Guardando...' : 'Crear Proveedor'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    borderColor: Colors.primary,
    overflow: 'hidden',
    marginBottom: Spacing.md,
  },
  sectionHeader: {
    backgroundColor: Colors.primary,
    padding: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSizes.md,
    fontWeight: 'bold',
    color: Colors.textInverse,
  },
  sectionContent: {
    padding: Spacing.md,
    gap: Spacing.md,
  },
  inputGroup: {
    gap: Spacing.xs,
  },
  label: {
    fontSize: FontSizes.sm,
    fontWeight: '500',
    color: Colors.text,
  },
  required: {
    color: Colors.error,
  },
  input: {
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: FontSizes.md,
    color: Colors.text,
  },
  inputError: {
    borderColor: Colors.error,
  },
  pickerContainer: {
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
  },
  picker: {
    color: Colors.text,
  },
  errorText: {
    fontSize: FontSizes.xs,
    color: Colors.error,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonContainer: {
    paddingTop: Spacing.md,
    borderTopWidth: 2,
    borderTopColor: Colors.border,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.xs,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    color: Colors.textInverse,
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  selectButtonText: {
    fontSize: FontSizes.md,
    color: Colors.text,
    flex: 1,
  },
  placeholderText: {
    color: Colors.placeholder,
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
    maxHeight: '90%',
    overflow: 'hidden',
  },
  modalHeader: {
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.text,
  },
  modalList: {
    maxHeight: 600,
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.lg,
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