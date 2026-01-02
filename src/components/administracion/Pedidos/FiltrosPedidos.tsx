import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Calendar, Search } from 'lucide-react-native';
import type { RangoFecha } from '@models/Fechas/Fechas.types';
import Theme from '@constants/theme';

interface FiltrosPedidosProps {
  busqueda: string;
  rangoSeleccionado: RangoFecha;
  onBusquedaChange: (busqueda: string) => void;
  onFiltroFechaChange?: (rangoFecha: RangoFecha, fechaDesde?: string, fechaHasta?: string) => void;
}

export const FiltrosPedidos: React.FC<FiltrosPedidosProps> = ({
  busqueda,
  rangoSeleccionado,
  onBusquedaChange,
  onFiltroFechaChange
}) => {
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');

  const rangos: { value: RangoFecha; label: string }[] = [
    { value: 'hoy', label: 'Hoy' },
    { value: 'semana', label: 'Esta Semana' },
    { value: 'mes', label: 'Este Mes' },
    { value: 'todo', label: 'Todo' },
    { value: 'personalizado', label: 'Personalizado' },
  ];

  const handleRangoChange = (rango: RangoFecha) => {
    if (rango !== 'personalizado') {
      setFechaDesde('');
      setFechaHasta('');
    }
    if (onFiltroFechaChange) {
      onFiltroFechaChange(rango);
    }
  };

  const handleFechaPersonalizadaChange = () => {
    if (onFiltroFechaChange && fechaDesde && fechaHasta) {
      onFiltroFechaChange('personalizado', fechaDesde, fechaHasta);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por número de pedido, bodega o proveedor..."
          placeholderTextColor={Theme.colors.placeholder}
          value={busqueda}
          onChangeText={onBusquedaChange}
        />
      </View>

      <View style={styles.rangoSection}>
        <View style={styles.rangoHeader}>
          <Calendar size={20} color={Theme.colors.text} />
          <Text style={styles.rangoLabel}>Período:</Text>
        </View>

        <View style={styles.rangosContainer}>
          {rangos.map((rango) => (
            <TouchableOpacity
              key={rango.value}
              onPress={() => handleRangoChange(rango.value)}
              style={[
                styles.rangoButton,
                rangoSeleccionado === rango.value && styles.rangoButtonActive,
              ]}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.rangoButtonText,
                  rangoSeleccionado === rango.value && styles.rangoButtonTextActive,
                ]}
              >
                {rango.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {rangoSeleccionado === 'personalizado' && (
        <View style={styles.customDateContainer}>
          <View style={styles.dateInputsRow}>
            <View style={styles.dateInputContainer}>
              <Text style={styles.dateLabel}>Desde</Text>
              <TextInput
                style={styles.dateInput}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={Theme.colors.placeholder}
                value={fechaDesde}
                onChangeText={setFechaDesde}
              />
            </View>
            <View style={styles.dateInputContainer}>
              <Text style={styles.dateLabel}>Hasta</Text>
              <TextInput
                style={styles.dateInput}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={Theme.colors.placeholder}
                value={fechaHasta}
                onChangeText={setFechaHasta}
              />
            </View>
          </View>
          <TouchableOpacity
            onPress={handleFechaPersonalizadaChange}
            disabled={!fechaDesde || !fechaHasta}
            style={[
              styles.applyButton,
              (!fechaDesde || !fechaHasta) && styles.applyButtonDisabled,
            ]}
            activeOpacity={0.8}
          >
            <Text style={styles.applyButtonText}>Aplicar</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Theme.colors.surfaceLight,
    padding: Theme.spacing.md,
    borderRadius: Theme.borderRadius.md,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    gap: Theme.spacing.md,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.surface,
    borderWidth: 1,
    borderColor: Theme.colors.borderDark,
    borderRadius: Theme.borderRadius.md,
    paddingHorizontal: Theme.spacing.md,
  },
  searchInput: {
    flex: 1,
    paddingVertical: Theme.spacing.sm,
    fontSize: Theme.fontSizes.sm,
    color: Theme.colors.text,
    backgroundColor: 'transparent',  
    borderWidth: 0, 
  },
  rangoSection: {
    gap: Theme.spacing.sm,
  },
  rangoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.sm,
  },
  rangoLabel: {
    fontSize: Theme.fontSizes.sm,
    fontWeight: Theme.fontWeights.semibold,
    color: Theme.colors.text,
  },
  rangosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Theme.spacing.sm,
  },
  rangoButton: {
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm - 2,
    borderRadius: Theme.borderRadius.md,
    backgroundColor: Theme.colors.surface,
    borderWidth: 1,
    borderColor: Theme.colors.borderDark,
  },
  rangoButtonActive: {
    backgroundColor: Theme.colors.primary,
    borderColor: Theme.colors.primary,
  },
  rangoButtonText: {
    fontSize: Theme.fontSizes.sm,
    fontWeight: Theme.fontWeights.medium,
    color: Theme.colors.text,
  },
  rangoButtonTextActive: {
    color: Theme.colors.textInverse,
  },
  customDateContainer: {
    paddingTop: Theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.borderDark,
    gap: Theme.spacing.md,
  },
  dateInputsRow: {
    flexDirection: 'row',
    gap: Theme.spacing.md,
  },
  dateInputContainer: {
    flex: 1,
  },
  dateLabel: {
    fontSize: Theme.fontSizes.xs,
    fontWeight: Theme.fontWeights.semibold,
    color: Theme.colors.text,
    marginBottom: Theme.spacing.xs,
  },
  dateInput: {
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    borderWidth: 1,
    borderColor: Theme.colors.borderDark,
    borderRadius: Theme.borderRadius.md,
    backgroundColor: Theme.colors.surface,
    fontSize: Theme.fontSizes.sm,
    color: Theme.colors.text,
  },
  applyButton: {
    backgroundColor: Theme.colors.primary,
    paddingVertical: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.md,
    alignItems: 'center',
  },
  applyButtonDisabled: {
    backgroundColor: Theme.colors.placeholder,
    opacity: Theme.opacity.disabled,
  },
  applyButtonText: {
    color: Theme.colors.textInverse,
    fontSize: Theme.fontSizes.sm,
    fontWeight: Theme.fontWeights.semibold,
  },
});