import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Filter, X } from 'lucide-react-native';
import type { Consultorio } from '@models/Consultorios/Consultorios.types';
import type { Doctor } from '@models/Doctor/Doctor.types';
import Theme from '@constants/theme';
interface FiltrosCalendarioProps {
  doctores: Doctor[];
  consultorios: Consultorio[];
  doctorSeleccionado: string;
  consultorioSeleccionado: string;
  onDoctorChange: (doctorId: string) => void;
  onConsultorioChange: (consultorioId: string) => void;
  onLimpiarFiltros: () => void;
}

const FiltrosCalendario: React.FC<FiltrosCalendarioProps> = ({
  doctores,
  consultorios,
  doctorSeleccionado,
  consultorioSeleccionado,
  onDoctorChange,
  onConsultorioChange,
  onLimpiarFiltros,
}) => {
  const hayFiltrosActivos = doctorSeleccionado !== '' || consultorioSeleccionado !== '';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <View style={styles.iconContainer}>
            <Filter size={14} color="white" />
          </View>
          <Text style={styles.title}>Filtros</Text>
        </View>
        {hayFiltrosActivos && (
          <TouchableOpacity
            onPress={onLimpiarFiltros}
            style={styles.clearButton}
            activeOpacity={0.8}
          >
            <X size={12} color="white" />
            <Text style={styles.clearButtonText}>Limpiar</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.filtersGrid}>
        <View style={styles.filterItem}>
          <Text style={styles.label}>Filtrar por Doctor:</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={doctorSeleccionado}
              onValueChange={(value) => onDoctorChange(value)}
              style={styles.picker}
            >
              <Picker.Item label="Todos los Doctores" value="" />
              {doctores.map((doctor) => (
                <Picker.Item
                  key={doctor.iiddoctor}
                  label={doctor.nombreCompleto}
                  value={doctor.iiddoctor.toString()}
                />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.filterItem}>
          <Text style={styles.label}>Filtrar por Consultorio:</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={consultorioSeleccionado}
              onValueChange={(value) => onConsultorioChange(value)}
              style={styles.picker}
            >
              <Picker.Item label="Todos los Consultorios" value="" />
              {consultorios.map((consultorio) => (
                <Picker.Item
                  key={consultorio.iidconsultorio}
                  label={consultorio.vnombre}
                  value={consultorio.iidconsultorio.toString()}
                />
              ))}
            </Picker>
          </View>
        </View>
      </View>

      {hayFiltrosActivos && (
        <View style={styles.tagsContainer}>
          {doctorSeleccionado && (
            <View style={styles.tag}>
              <Text style={styles.tagText}>
                {doctores.find((d) => d.iiddoctor.toString() === doctorSeleccionado)
                  ?.nombreCompleto}
              </Text>
            </View>
          )}
          {consultorioSeleccionado && (
            <View style={styles.tag}>
              <Text style={styles.tagText}>
                {consultorios.find(
                  (c) => c.iidconsultorio.toString() === consultorioSeleccionado
                )?.vnombre}
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Theme.colors.surface,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
    ...Theme.shadows.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Theme.spacing.sm,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.sm,
  },
  iconContainer: {
    width: 28,
    height: 28,
    backgroundColor: Theme.colors.primary,
    borderRadius: Theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: Theme.fontSizes.lg,
    fontWeight: Theme.fontWeights.semibold,
    color: Theme.colors.primary,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.xs,
    backgroundColor: Theme.colors.error,
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: Theme.spacing.xs,
    borderRadius: Theme.borderRadius.sm + 2,
  },
  clearButtonText: {
    color: Theme.colors.textInverse,
    fontSize: Theme.fontSizes.xs,
    fontWeight: Theme.fontWeights.medium,
  },
  filtersGrid: {
    gap: Theme.spacing.md,
  },
  filterItem: {
    marginBottom: Theme.spacing.sm,
  },
  label: {
    fontSize: Theme.fontSizes.xs,
    fontWeight: Theme.fontWeights.semibold,
    color: Theme.colors.primary,
    marginBottom: Theme.spacing.xs,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: Theme.colors.primary,
    borderRadius: Theme.borderRadius.md,
    backgroundColor: Theme.colors.surface,
    overflow: 'hidden',
  },
  picker: {
    height: 45,
  },
  tagsContainer: {
    marginTop: Theme.spacing.sm,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Theme.spacing.sm - 2,
  },
  tag: {
    backgroundColor: Theme.colors.accentLight,
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: Theme.borderRadius.lg,
  },
  tagText: {
    color: Theme.colors.primary,
    fontSize: Theme.fontSizes.xs,
    fontWeight: Theme.fontWeights.medium,
  },
});

export default FiltrosCalendario;