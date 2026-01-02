import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Modal, 
  FlatList, 
  ActivityIndicator,
  TouchableWithoutFeedback 
} from 'react-native';
import { ChevronDown, X, Check } from 'lucide-react-native';
import { Colors, Spacing, BorderRadius, FontSizes, Shadows } from '@constants/theme';

interface SelectUbicacionProps {
  tipo: 'pais' | 'provincia' | 'ciudad';
  value: string;
  onChange: (value: string) => void; 
  opciones: any[];
  cargando?: boolean;
  deshabilitado?: boolean;
  required?: boolean;
  mensajeDeshabilitado?: string;
  label?: string; 
}

const SelectUbicacion: React.FC<SelectUbicacionProps> = ({
  tipo,
  value,
  onChange,
  opciones,
  cargando,
  deshabilitado,
  required,
  mensajeDeshabilitado,
  label
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const nombres = {
    pais: { singular: 'país', plural: 'países' },
    provincia: { singular: 'provincia', plural: 'provincias' },
    ciudad: { singular: 'ciudad', plural: 'ciudades' }
  };

  const getKeyField = () => {
    switch (tipo) {
      case 'pais': return 'iidpais';
      case 'provincia': return 'iidprovincia';
      case 'ciudad': return 'iidciudad';
    }
  };

  const keyField = getKeyField();

  const selectedOption = opciones.find(opcion => String(opcion[keyField]) === String(value));
  const displayText = selectedOption ? selectedOption.vnombre : `Seleccione una ${nombres[tipo].singular}`;

  const handleSelect = (id: string) => {
    onChange(id);
    setModalVisible(false);
  };

  const getPlaceholder = () => {
    if (cargando) return 'Cargando...';
    if (deshabilitado) return mensajeDeshabilitado || 'No disponible';
    return displayText;
  };

  return (
    <View style={styles.container}>
      {label && (
        <Text style={styles.label}>
          {label} {required && <Text style={styles.required}>*</Text>}
        </Text>
      )}

      <TouchableOpacity
        style={[
          styles.selector,
          (deshabilitado || cargando) && styles.selectorDisabled
        ]}
        onPress={() => !deshabilitado && !cargando && setModalVisible(true)}
        disabled={deshabilitado || cargando}
        activeOpacity={0.7}
      >
        <Text style={[
          styles.valueText, 
          !selectedOption && styles.placeholderText,
          (deshabilitado || cargando) && styles.textDisabled
        ]}>
          {getPlaceholder()}
        </Text>
        
        {cargando ? (
          <ActivityIndicator size="small" color={Colors.primary} />
        ) : (
          <ChevronDown size={20} color={Colors.textLight} />
        )}
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
            <View style={styles.modalBackdrop} />
          </TouchableWithoutFeedback>

          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Seleccione {nombres[tipo].singular}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>

            <FlatList
              data={opciones}
              keyExtractor={(item) => String(item[keyField])}
              style={styles.list}
              renderItem={({ item }) => {
                const isSelected = String(item[keyField]) === String(value);
                return (
                  <TouchableOpacity
                    style={[styles.optionItem, isSelected && styles.optionSelected]}
                    onPress={() => handleSelect(String(item[keyField]))}
                  >
                    <Text style={[
                      styles.optionText, 
                      isSelected && styles.optionTextSelected
                    ]}>
                      {item.vnombre}
                    </Text>
                    {isSelected && <Check size={20} color={Colors.primary} />}
                  </TouchableOpacity>
                );
              }}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No hay opciones disponibles</Text>
                </View>
              }
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: FontSizes.sm,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 4,
  },
  required: {
    color: Colors.error,
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2, 
    backgroundColor: '#FFFFFF',
  },
  selectorDisabled: {
    backgroundColor: '#F3F4F6',
    borderColor: '#E5E7EB', 
  },
  valueText: {
    fontSize: FontSizes.sm,
    color: Colors.text,
  },
  placeholderText: {
    color: Colors.textLight, 
  },
  textDisabled: {
    color: '#9CA3AF', 
  },
  
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalBackdrop: {
    flex: 1,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: BorderRadius.lg,
    borderTopRightRadius: BorderRadius.lg,
    maxHeight: '70%', 
    ...Shadows.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    color: Colors.text,
    textTransform: 'capitalize',
  },
  list: {
    paddingBottom: Spacing.xl, 
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  optionSelected: {
    backgroundColor: '#EFF6FF', 
  },
  optionText: {
    fontSize: FontSizes.md,
    color: Colors.text,
  },
  optionTextSelected: {
    color: Colors.primary,
    fontWeight: '600',
  },
  emptyContainer: {
    padding: Spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    color: Colors.textLight,
    fontSize: FontSizes.sm,
  },
});

export default SelectUbicacion;