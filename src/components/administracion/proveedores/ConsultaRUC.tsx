import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Search, AlertCircle } from 'lucide-react-native';
import { Colors, Spacing, FontSizes, BorderRadius } from '@constants/theme';

interface ConsultaRUCProps {
  vruc: string;
  onRucChange: (value: string) => void;
  onConsultar: () => void;
  consultandoSRI: boolean;
  datosConsultados: boolean;
  error?: string;
}

export default function ConsultaRUC({
  vruc,
  onRucChange,
  onConsultar,
  consultandoSRI,
  datosConsultados,
  error,
}: ConsultaRUCProps) {
  return (
    <View style={styles.container}>
      {/* Alert */}
      <View style={styles.alert}>
        <AlertCircle size={20} color="#D97706" style={styles.alertIcon} />
        <View style={styles.alertTextContainer}>
          <Text style={styles.alertText}>
            <Text style={styles.alertBold}>Importante:</Text> Debe consultar primero el RUC
            en el SRI para obtener la razón social y establecimientos del proveedor.
          </Text>
        </View>
      </View>

      {/* Consulta Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>CONSULTA RUC - SRI</Text>
        </View>

        <View style={styles.sectionContent}>
          <Text style={styles.label}>
            RUC <Text style={styles.required}>*</Text>
          </Text>

          <View style={styles.inputRow}>
            <TextInput
              style={[
                styles.input,
                error && styles.inputError,
                datosConsultados && styles.inputDisabled,
              ]}
              value={vruc}
              onChangeText={onRucChange}
              placeholder="1234567890001"
              placeholderTextColor={Colors.placeholder}
              keyboardType="numeric"
              maxLength={13}
              editable={!datosConsultados}
            />

            <TouchableOpacity
              style={[
                styles.button,
                (consultandoSRI || datosConsultados) && styles.buttonDisabled,
              ]}
              onPress={onConsultar}
              disabled={consultandoSRI || datosConsultados}
              activeOpacity={0.8}
            >
              <Search size={20} color={Colors.textInverse} />
              <Text style={styles.buttonText}>
                {consultandoSRI ? 'Consultando...' : 'Consultar SRI'}
              </Text>
            </TouchableOpacity>
          </View>

          {error && <Text style={styles.errorText}>{error}</Text>}

          {datosConsultados && (
            <Text style={styles.successText}>✓ Datos consultados correctamente</Text>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  alert: {
    flexDirection: 'row',
    backgroundColor: '#FEF3C7',
    borderWidth: 2,
    borderColor: '#FCD34D',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  alertIcon: {
    marginTop: 2,
  },
  alertTextContainer: {
    flex: 1,
  },
  alertText: {
    fontSize: FontSizes.sm,
    color: '#92400E',
    lineHeight: 20,
  },
  alertBold: {
    fontWeight: 'bold',
  },
  section: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    borderColor: Colors.primary,
    overflow: 'hidden',
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
    gap: Spacing.sm,
  },
  label: {
    fontSize: FontSizes.sm,
    fontWeight: '500',
    color: Colors.text,
  },
  required: {
    color: Colors.error,
  },
  inputRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  input: {
    flex: 1,
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
  inputDisabled: {
    backgroundColor: Colors.backgroundLight,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    gap: Spacing.xs,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: Colors.textInverse,
    fontSize: FontSizes.sm,
    fontWeight: '600',
  },
  errorText: {
    fontSize: FontSizes.xs,
    color: Colors.error,
  },
  successText: {
    fontSize: FontSizes.xs,
    color: Colors.success,
  },
});