import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Save } from 'lucide-react-native';
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
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>INFORMACIÓN ADICIONAL</Text>
      </View>

      <View style={styles.sectionContent}>
        {/* Tipo de Proveedor */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Tipo de Proveedor <Text style={styles.required}>*</Text>
          </Text>
          <View style={[styles.pickerContainer, errors.itipo_proveedor && styles.inputError]}>
            <Picker
              selectedValue={formData.itipo_proveedor.toString()}
              onValueChange={(value) =>
                onChange('itipo_proveedor', value ? Number(value) : '')
              }
              style={styles.picker}
            >
              <Picker.Item label="Seleccionar tipo" value="" />
              {tiposProveedor.map((tipo) => (
                <Picker.Item
                  key={tipo.iid_tipo_proveedor}
                  label={tipo.vnombre}
                  value={tipo.iid_tipo_proveedor.toString()}
                />
              ))}
            </Picker>
          </View>
          {errors.itipo_proveedor && (
            <Text style={styles.errorText}>{errors.itipo_proveedor}</Text>
          )}
        </View>

        {/* Teléfono */}
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

        {/* Email */}
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

        {/* Activo */}
        <View style={styles.switchContainer}>
          <Text style={styles.label}>Proveedor activo</Text>
          <Switch
            value={formData.bactivo}
            onValueChange={(value) => onChange('bactivo', value)}
            trackColor={{ false: Colors.border, true: Colors.primary }}
            thumbColor={Colors.surface}
          />
        </View>

        {/* Botón Guardar */}
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
});