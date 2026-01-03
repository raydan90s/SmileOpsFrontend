import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  Pressable,
  Platform,
} from 'react-native';
import { ChevronDown, Check, Calendar as CalendarIcon } from 'lucide-react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { ESTADOS_CIVILES, SEXOS } from '@data/constants';
import FormField from '@components/shared/FormField';
import FotoCircular from '@components/shared/FotoCircular';
import type { FormularioPacienteData } from '@models/Pacientes/Pacientes.types';
import type { Pais } from '@models/Paises/Paises.types';
import Theme from '@constants/theme';

interface DatosPersonalesProps {
  formData: FormularioPacienteData;
  onChange: (name: keyof FormularioPacienteData, value: string) => void;
  onImageSelect?: (file: any | null) => void;
  paises: Pais[];
  cargandoPaises: boolean;
  resetKey?: number;
  hasImageError?: boolean;
  existingImageUrl?: string;
}

const DatosPersonales: React.FC<DatosPersonalesProps> = ({
  formData,
  onChange,
  onImageSelect,
  paises,
  cargandoPaises,
  resetKey = 0,
  hasImageError = false,
  existingImageUrl,
}) => {
  const [hasNewImage, setHasNewImage] = useState(false);
  const [showNacionalidadModal, setShowNacionalidadModal] = useState(false);
  const [showEstadoCivilModal, setShowEstadoCivilModal] = useState(false);
  const [showSexoModal, setShowSexoModal] = useState(false);
  const [tempDate, setTempDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleImageSelect = (file: any | null) => {
    setHasNewImage(file !== null);
    if (onImageSelect) {
      onImageSelect(file);
    }
  };

  const formatearFechaParaDB = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const paisSeleccionado = paises.find(p => p.iidpais.toString() === formData.nacionalidad);

  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }

    if (event.type === 'set' && selectedDate) {
      setTempDate(selectedDate);
      const fechaFormateada = formatearFechaParaDB(selectedDate);
      onChange('fechaNacimiento', fechaFormateada);
    } else if (event.type === 'dismissed') {
      setShowDatePicker(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.mainSection}>
        <View style={styles.fotoContainer}>
          <FotoCircular
            onImageSelect={handleImageSelect}
            resetKey={resetKey}
            hasImageError={hasImageError}
            size="lg"
            showLabel={true}
            existingImageUrl={!hasNewImage ? existingImageUrl : undefined}
          />

          {existingImageUrl && !hasNewImage && (
            <Text style={styles.imageHint}>
              Seleccione una nueva imagen para reemplazarla
            </Text>
          )}
        </View>

        <View style={styles.fieldsGrid}>
          <FormField label="N° Ficha" required>
            <TextInput
              style={[styles.input, styles.inputReadonly]}
              value={formData.ficha}
              editable={false}
              placeholder="Cargando..."
              placeholderTextColor={Theme.colors.placeholder}
            />
          </FormField>

          <FormField label="Fecha Actual">
            <TextInput
              style={[styles.input, styles.inputReadonly]}
              value={formData.fechaActual}
              editable={false}
              placeholderTextColor={Theme.colors.placeholder}
            />
          </FormField>

          <FormField label="Cédula de Identidad" required>
            <TextInput
              style={styles.input}
              value={formData.ci}
              onChangeText={(value) => onChange('ci', value)}
              placeholder="1234567890"
              maxLength={10}
              keyboardType="numeric"
              placeholderTextColor={Theme.colors.placeholder}
            />
          </FormField>

          <FormField label="Nombres" required>
            <TextInput
              style={styles.input}
              value={formData.nombres}
              onChangeText={(value) => onChange('nombres', value)}
              placeholder="Juan Carlos"
              placeholderTextColor={Theme.colors.placeholder}
            />
          </FormField>

          <FormField label="Primer Apellido" required>
            <TextInput
              style={styles.input}
              value={formData.primerApellido}
              onChangeText={(value) => onChange('primerApellido', value)}
              placeholder="Pérez"
              placeholderTextColor={Theme.colors.placeholder}
            />
          </FormField>

          <FormField label="Segundo Apellido">
            <TextInput
              style={styles.input}
              value={formData.segundoApellido}
              onChangeText={(value) => onChange('segundoApellido', value)}
              placeholder="García"
              placeholderTextColor={Theme.colors.placeholder}
            />
          </FormField>

          <FormField label="Otros Nombres">
            <TextInput
              style={styles.input}
              value={formData.otros}
              onChangeText={(value) => onChange('otros', value)}
              placeholder="Nombres adicionales"
              placeholderTextColor={Theme.colors.placeholder}
            />
          </FormField>

          <FormField label="Fecha de Nacimiento" required>
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              style={styles.datePickerButton}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.dateText,
                !formData.fechaNacimiento && styles.placeholderText
              ]}>
                {formData.fechaNacimiento || "Seleccione una fecha"}
              </Text>
              <CalendarIcon size={20} color={Theme.colors.placeholder} />
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={tempDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={onDateChange}
                maximumDate={new Date()}
              />
            )}
          </FormField>

          <FormField label="Edad">
            <TextInput
              style={[styles.input, styles.inputReadonly]}
              value={formData.edad}
              editable={false}
              placeholder="Se calcula automáticamente"
              placeholderTextColor={Theme.colors.placeholder}
            />
          </FormField>
        </View>
      </View>

      <View style={styles.additionalSection}>
        <FormField label="Nacionalidad">
          <TouchableOpacity
            style={[
              styles.selectButton,
              cargandoPaises && styles.selectButtonDisabled
            ]}
            onPress={() => !cargandoPaises && setShowNacionalidadModal(true)}
            disabled={cargandoPaises}
            activeOpacity={0.7}
          >
            <Text style={[
              styles.selectButtonText,
              !paisSeleccionado && styles.selectButtonPlaceholder
            ]}>
              {cargandoPaises
                ? 'Cargando...'
                : paisSeleccionado?.vnombre || 'Seleccione...'}
            </Text>
            <ChevronDown size={20} color={Theme.colors.placeholder} />
          </TouchableOpacity>
        </FormField>

        <FormField label="Estado Civil" required>
          <TouchableOpacity
            style={styles.selectButton}
            onPress={() => setShowEstadoCivilModal(true)}
            activeOpacity={0.7}
          >
            <Text style={[
              styles.selectButtonText,
              !formData.estadoCivil && styles.selectButtonPlaceholder
            ]}>
              {formData.estadoCivil || 'Seleccione...'}
            </Text>
            <ChevronDown size={20} color={Theme.colors.placeholder} />
          </TouchableOpacity>
        </FormField>

        <FormField label="Sexo" required>
          <TouchableOpacity
            style={styles.selectButton}
            onPress={() => setShowSexoModal(true)}
            activeOpacity={0.7}
          >
            <Text style={[
              styles.selectButtonText,
              !formData.sexo && styles.selectButtonPlaceholder
            ]}>
              {formData.sexo || 'Seleccione...'}
            </Text>
            <ChevronDown size={20} color={Theme.colors.placeholder} />
          </TouchableOpacity>
        </FormField>
      </View>
      <Modal
        visible={showNacionalidadModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowNacionalidadModal(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowNacionalidadModal(false)}
        >
          <Pressable onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Seleccionar Nacionalidad</Text>
              </View>
              <FlatList
                data={paises}
                keyExtractor={(item) => item.iidpais.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.modalItem}
                    onPress={() => {
                      onChange('nacionalidad', item.iidpais.toString());
                      setShowNacionalidadModal(false);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.modalItemText}>{item.vnombre}</Text>
                    {formData.nacionalidad === item.iidpais.toString() && (
                      <Check size={20} color={Theme.colors.primary} />
                    )}
                  </TouchableOpacity>
                )}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                style={styles.modalList}
              />
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setShowNacionalidadModal(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.modalCloseButtonText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      <Modal
        visible={showEstadoCivilModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowEstadoCivilModal(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowEstadoCivilModal(false)}
        >
          <Pressable onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Seleccionar Estado Civil</Text>
              </View>
              <FlatList
                data={ESTADOS_CIVILES}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.modalItem}
                    onPress={() => {
                      onChange('estadoCivil', item);
                      setShowEstadoCivilModal(false);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.modalItemText}>{item}</Text>
                    {formData.estadoCivil === item && (
                      <Check size={20} color={Theme.colors.primary} />
                    )}
                  </TouchableOpacity>
                )}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                style={styles.modalList}
              />
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setShowEstadoCivilModal(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.modalCloseButtonText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      <Modal
        visible={showSexoModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSexoModal(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowSexoModal(false)}
        >
          <Pressable onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Seleccionar Sexo</Text>
              </View>
              <FlatList
                data={SEXOS}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.modalItem}
                    onPress={() => {
                      onChange('sexo', item);
                      setShowSexoModal(false);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.modalItemText}>{item}</Text>
                    {formData.sexo === item && (
                      <Check size={20} color={Theme.colors.primary} />
                    )}
                  </TouchableOpacity>
                )}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                style={styles.modalList}
              />
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setShowSexoModal(false)}
                activeOpacity={0.8}
              >
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
    gap: Theme.spacing.lg,
  },
  mainSection: {
    gap: Theme.spacing.md,
  },
  fotoContainer: {
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
  },
  imageHint: {
    fontSize: Theme.fontSizes.xs,
    color: Theme.colors.placeholder,
    marginTop: Theme.spacing.md,
    textAlign: 'center',
  },
  fieldsGrid: {
    gap: Theme.spacing.md,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: Theme.colors.borderDark,
    borderRadius: Theme.borderRadius.md,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    fontSize: Theme.fontSizes.md,
    color: Theme.colors.text,
    backgroundColor: Theme.colors.surface,
  },
  inputReadonly: {
    backgroundColor: Theme.colors.surfaceLight,
    color: Theme.colors.placeholder,
  },

  datePickerButton: {
    width: '100%',
    borderWidth: 1,
    borderColor: Theme.colors.borderDark,
    borderRadius: Theme.borderRadius.md,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    backgroundColor: Theme.colors.surface,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    fontSize: Theme.fontSizes.md,
    color: Theme.colors.text,
  },
  placeholderText: {
    color: Theme.colors.placeholder,
  },

  additionalSection: {
    gap: Theme.spacing.md,
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Theme.colors.surface,
    borderWidth: 1,
    borderColor: Theme.colors.borderDark,
    borderRadius: Theme.borderRadius.md,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
  },
  selectButtonDisabled: {
    backgroundColor: Theme.colors.backgroundLight,
    opacity: Theme.opacity.disabled,
  },
  selectButtonText: {
    fontSize: Theme.fontSizes.md,
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
    padding: Theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
  },
  modalTitle: {
    fontSize: Theme.fontSizes.lg,
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
    fontSize: Theme.fontSizes.md,
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
    fontSize: Theme.fontSizes.md,
    fontWeight: Theme.fontWeights.semibold,
  },
});

export default DatosPersonales;