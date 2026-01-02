import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Colors, Spacing, BorderRadius, FontSizes } from '@constants/theme';
import type { Consultorio } from '@models/Consultorios/Consultorios.types';

interface CamposProductoProps {
  mostrarConsultorio: boolean;
  consultorioProducto: string;
  setConsultorioProducto: (value: string) => void;
  consultorios: Consultorio[];
  codigoProducto: string;
  setCodigoProducto: (value: string) => void;
  nombreProducto: string;
  setNombreProducto: (value: string) => void;
  cantidadProducto: string;
  setCantidadProducto: (value: string) => void;
  unidadProducto: string;
  mostrarValorUnitario: boolean;
  valorUnitarioProducto: string;
  handleValorUnitarioChange: (value: string) => void;
}

const CamposProducto: React.FC<CamposProductoProps> = ({
  mostrarConsultorio,
  consultorioProducto,
  setConsultorioProducto,
  consultorios,
  codigoProducto,
  setCodigoProducto,
  nombreProducto,
  setNombreProducto,
  cantidadProducto,
  setCantidadProducto,
  unidadProducto,
  mostrarValorUnitario,
  valorUnitarioProducto,
  handleValorUnitarioChange,
}) => {

  return (
    <View style={styles.container}>
      
      {mostrarConsultorio && (
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Consultorio</Text>
          <View style={[styles.input, styles.disabledInput]}>
             <Text style={{ color: Colors.text }}>
               {consultorios.find(c => c.iidconsultorio.toString() === consultorioProducto)?.vnombre || "Seleccionar (Implementar Picker)"}
             </Text>
          </View>
        </View>
      )}

      <View style={styles.row}>
        <View style={[styles.inputGroup, { flex: 1, marginRight: Spacing.sm }]}>
          <Text style={styles.label}>Código</Text>
          <TextInput
            value={codigoProducto}
            onChangeText={setCodigoProducto}
            placeholder="Código"
            style={[styles.input, styles.readOnlyInput]}
            editable={false}
            placeholderTextColor={Colors.placeholder}
          />
        </View>

        <View style={[styles.inputGroup, { flex: 2 }]}>
          <Text style={styles.label}>Nombre</Text>
          <TextInput
            value={nombreProducto}
            onChangeText={setNombreProducto}
            placeholder="Nombre del producto"
            style={[styles.input, styles.readOnlyInput]}
            editable={false}
            placeholderTextColor={Colors.placeholder}
          />
        </View>
      </View>

      <View style={styles.row}>
        <View style={[styles.inputGroup, { flex: 1, marginRight: Spacing.sm }]}>
          <Text style={styles.label}>Cantidad</Text>
          <TextInput
            value={cantidadProducto}
            onChangeText={setCantidadProducto}
            placeholder="0"
            keyboardType="numeric"
            style={styles.input}
            placeholderTextColor={Colors.placeholder}
          />
        </View>

        <View style={[styles.inputGroup, { flex: 1 }]}>
          <Text style={styles.label}>Unidad</Text>
          <TextInput
            value={unidadProducto}
            placeholder="Unidad"
            style={[styles.input, styles.disabledInput]}
            editable={false}
            placeholderTextColor={Colors.placeholder}
          />
        </View>
      </View>

      {mostrarValorUnitario && (
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Valor Unitario</Text>
          <TextInput
            value={valorUnitarioProducto}
            onChangeText={handleValorUnitarioChange}
            placeholder="0.00"
            keyboardType="numeric"
            style={styles.input}
            placeholderTextColor={Colors.placeholder}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputGroup: {
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: FontSizes.sm,
    fontWeight: '500',
    color: Colors.text, 
    marginBottom: Spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    fontSize: FontSizes.sm,
    color: Colors.text,
    backgroundColor: Colors.surface,
  },
  readOnlyInput: {
    backgroundColor: '#F9FAFB', 
  },
  disabledInput: {
    backgroundColor: '#F3F4F6', 
    color: '#9CA3AF', 
  },
});

export default CamposProducto;