import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
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
    onChange: (val: string) => void
  ) => {
    const selectedOption = options.find(opt => String(opt[idKey]) === value);
    const displayText = selectedOption ? String(selectedOption[descKey]) : placeholder;

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
        >
           <Text style={[
             styles.valueText, 
             !selectedOption && { color: Colors.placeholder }
           ]}>
             {loading ? 'Cargando...' : displayText}
           </Text>
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
              tipoOptions, 
              tipoIdKey, 
              tipoDescKey, 
              tipoOnChange
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
              bodegaOnChange
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
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md, 
    paddingVertical: Spacing.sm + 2,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
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
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surface,
  }
});

export default SelectorTipoBodega;