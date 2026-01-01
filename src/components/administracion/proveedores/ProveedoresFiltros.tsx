import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Search } from 'lucide-react-native';
import { Picker } from '@react-native-picker/picker';
import type { TipoProveedor } from '@models/administracion/Proveedores/TipoProveedor.types';
import { Colors, Spacing, FontSizes, BorderRadius } from '@constants/theme';

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
  return (
    <View style={styles.container}>
      {/* Search Input */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Buscar</Text>
        <View style={styles.searchContainer}>
          <Search 
            size={20} 
            color={Colors.textLight} 
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por nombre o RUC..."
            placeholderTextColor={Colors.placeholder}
            value={searchTerm}
            onChangeText={onSearchChange}
          />
        </View>
      </View>

      {/* Tipo Filter */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Tipo de Proveedor</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={tipoFiltro?.toString() || ''}
            onValueChange={(itemValue) => 
              onTipoChange(itemValue ? Number(itemValue) : undefined)
            }
            style={styles.picker}
          >
            <Picker.Item label="Todos los tipos" value="" />
            {tiposProveedor.map(tipo => (
              <Picker.Item
                key={tipo.iid_tipo_proveedor}
                label={tipo.vnombre}
                value={tipo.iid_tipo_proveedor.toString()}
              />
            ))}
          </Picker>
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
  inputGroup: {
    gap: Spacing.xs,
  },
  label: {
    fontSize: FontSizes.sm,
    fontWeight: '500',
    color: Colors.text,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.sm,
  },
  searchIcon: {
    marginRight: Spacing.xs,
  },
  searchInput: {
    flex: 1,
    paddingVertical: Spacing.sm,
    fontSize: FontSizes.md,
    color: Colors.text,
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
});