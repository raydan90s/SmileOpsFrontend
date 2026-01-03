import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList, Pressable } from 'react-native';
import { Filter, X, ChevronDown, Check } from 'lucide-react-native';
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
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [showConsultorioModal, setShowConsultorioModal] = useState(false);
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
          <TouchableOpacity
            style={styles.selectButton}
            onPress={() => setShowDoctorModal(true)}
            activeOpacity={0.7}
          >
            <Text style={[
              styles.selectButtonText,
              !doctorSeleccionado && styles.selectButtonPlaceholder
            ]}>
              {doctorSeleccionado
                ? doctores.find(d => d.iiddoctor.toString() === doctorSeleccionado)?.nombreCompleto
                : 'Todos los Doctores'}
            </Text>
            <ChevronDown size={16} color={Theme.colors.placeholder} />
          </TouchableOpacity>
        </View>

        <View style={styles.filterItem}>
          <Text style={styles.label}>Filtrar por Consultorio:</Text>
          <TouchableOpacity
            style={styles.selectButton}
            onPress={() => setShowConsultorioModal(true)}
            activeOpacity={0.7}
          >
            <Text style={[
              styles.selectButtonText,
              !consultorioSeleccionado && styles.selectButtonPlaceholder
            ]}>
              {consultorioSeleccionado
                ? consultorios.find(c => c.iidconsultorio.toString() === consultorioSeleccionado)?.vnombre
                : 'Todos los Consultorios'}
            </Text>
            <ChevronDown size={16} color={Theme.colors.placeholder} />
          </TouchableOpacity>
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

      <Modal visible={showDoctorModal} transparent animationType="fade" onRequestClose={() => setShowDoctorModal(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setShowDoctorModal(false)}>
          <Pressable onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Filtrar por Doctor</Text>
              </View>
              <FlatList
                data={[{ iiddoctor: 0, nombreCompleto: 'Todos los Doctores' }, ...doctores]}
                keyExtractor={(item) => item.iiddoctor.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.modalItem}
                    onPress={() => {
                      onDoctorChange(item.iiddoctor === 0 ? '' : item.iiddoctor.toString());
                      setShowDoctorModal(false);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.modalItemText}>{item.nombreCompleto}</Text>
                    {(doctorSeleccionado === item.iiddoctor.toString() || (!doctorSeleccionado && item.iiddoctor === 0)) && (
                      <Check size={20} color={Theme.colors.primary} />
                    )}
                  </TouchableOpacity>
                )}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                style={styles.modalList}
              />
              <TouchableOpacity style={styles.modalCloseButton} onPress={() => setShowDoctorModal(false)} activeOpacity={0.8}>
                <Text style={styles.modalCloseButtonText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      <Modal visible={showConsultorioModal} transparent animationType="fade" onRequestClose={() => setShowConsultorioModal(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setShowConsultorioModal(false)}>
          <Pressable onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Filtrar por Consultorio</Text>
              </View>
              <FlatList
                data={[{ iidconsultorio: 0, vnombre: 'Todos los Consultorios' }, ...consultorios]}
                keyExtractor={(item) => item.iidconsultorio.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.modalItem}
                    onPress={() => {
                      onConsultorioChange(item.iidconsultorio === 0 ? '' : item.iidconsultorio.toString());
                      setShowConsultorioModal(false);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.modalItemText}>{item.vnombre}</Text>
                    {(consultorioSeleccionado === item.iidconsultorio.toString() || (!consultorioSeleccionado && item.iidconsultorio === 0)) && (
                      <Check size={20} color={Theme.colors.primary} />
                    )}
                  </TouchableOpacity>
                )}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                style={styles.modalList}
              />
              <TouchableOpacity style={styles.modalCloseButton} onPress={() => setShowConsultorioModal(false)} activeOpacity={0.8}>
                <Text style={styles.modalCloseButtonText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
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
  selectButton: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  backgroundColor: Theme.colors.surface,
  borderWidth: 1,
  borderColor: Theme.colors.primary,
  borderRadius: Theme.borderRadius.md,
  paddingHorizontal: Theme.spacing.sm,
  paddingVertical: Theme.spacing.sm - 2,
},
selectButtonText: {
  fontSize: Theme.fontSizes.sm,
  color: Theme.colors.text,
  flex: 1,
},
selectButtonPlaceholder: {
  color: Theme.colors.placeholder,
},
modalOverlay: {
  flex: 1,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  justifyContent: 'center',
  alignItems: 'center',
  padding: Theme.spacing.md,
},
modalContent: {
  backgroundColor: Theme.colors.surface,
  borderRadius: Theme.borderRadius.lg,
  width: '100%',
  maxWidth: 400,
  maxHeight: '70%',
  overflow: 'hidden',
  ...Theme.shadows.xl,
},
modalHeader: {
  padding: Theme.spacing.md,
  borderBottomWidth: 1,
  borderBottomColor: Theme.colors.border,
},
modalTitle: {
  fontSize: Theme.fontSizes.md,
  fontWeight: Theme.fontWeights.bold,
  color: Theme.colors.text,
},
modalList: {
  maxHeight: 400,
},
modalItem: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: Theme.spacing.md,
},
modalItemText: {
  fontSize: Theme.fontSizes.sm,
  color: Theme.colors.text,
  flex: 1,
},
separator: {
  height: 1,
  backgroundColor: Theme.colors.border,
},
modalCloseButton: {
  backgroundColor: Theme.colors.primary,
  padding: Theme.spacing.md,
  alignItems: 'center',
  borderTopWidth: 1,
  borderTopColor: Theme.colors.border,
},
modalCloseButtonText: {
  color: Theme.colors.textInverse,
  fontSize: Theme.fontSizes.sm,
  fontWeight: Theme.fontWeights.semibold,
},
});

export default FiltrosCalendario;