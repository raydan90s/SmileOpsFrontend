import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator, 
  Alert 
} from 'react-native';
import { useRouter } from 'expo-router';
import { User, Briefcase, MapPin, Save, X } from 'lucide-react-native';

import { usePaises } from '@context/PaisesContext';
import { useFormularioPaciente } from '@hooks/useFormularioPaciente';
import { createFormHandlers } from '@utils/form.handlers';
import { cloudinaryService } from '@services/Cloudinary/Cloudinary.service';
import { validateFormularioPaciente, formatValidationErrors } from '@utils/formValidation.utils';

import FormSection from '@components/shared/FormSection';
import DatosPersonales from '@components/administracion/Pacientes/DatosPersonales';
import DatosDomicilio from '@components/administracion/Pacientes/DatosDomicilio';
import DatosTrabajo from '@components/administracion/Pacientes/DatosTrabajo';

import { crearPaciente, actualizarPaciente } from '@services/Pacientes/Pacientes.service';
import type { PacienteDB, FormularioPacienteData } from '@models/Pacientes/Pacientes.types';
import { Colors, Spacing, BorderRadius, FontSizes, Shadows } from '@constants/theme';

interface FormularioPacienteProps {
  onCancel?: () => void;
  pacienteId?: string; 
}

export default function FormularioPaciente({ onCancel, pacienteId }: FormularioPacienteProps) {
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);
  
  const { paises, loading: cargandoPaises } = usePaises();
  
  const {
    formData,
    updateFormData,
    resetFormData,
    ubicacionDomicilio,
    ubicacionTrabajo,
    isLoadingPaciente,
    resetCounter,
    cargarPaciente
  } = useFormularioPaciente(paises);

  const [selectedImage, setSelectedImage] = useState<any | null>(null); 
  const [existingImageUrl, setExistingImageUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const modoEdicion = !!pacienteId;

  useEffect(() => {
    if (pacienteId) {
      cargarPaciente(pacienteId)
        .then((paciente) => {
          if (paciente?.vrutafoto) {
            setExistingImageUrl(paciente.vrutafoto);
          }
        })
        .catch(() => {
          Alert.alert('Error', 'Error al cargar los datos del paciente');
          router.replace('/odontologia/pacientes'); 
        });
    }
  }, [pacienteId]);

  const handlers = createFormHandlers({
    paises,
    provincias: ubicacionDomicilio.provincias,
    ciudades: ubicacionDomicilio.ciudades,
    provinciasTrabajo: ubicacionTrabajo.provincias,
    ciudadesTrabajo: ubicacionTrabajo.ciudades,
    updateFormData,
    resetProvinciasDomicilio: ubicacionDomicilio.resetProvincias,
    resetCiudadesDomicilio: ubicacionDomicilio.resetCiudades,
    resetProvinciasTrabajo: ubicacionTrabajo.resetProvincias,
    resetCiudadesTrabajo: ubicacionTrabajo.resetCiudades
  });

  const handleChange = (name: keyof FormularioPacienteData, value: string) => {
    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }

    const handlerMap: Record<string, () => void> = {
      idPais: () => handlers.handlePaisChange(value),
      idProvincia: () => handlers.handleProvinciaChange(value),
      idCiudad: () => handlers.handleCiudadChange(value),
      idPaisTrabajo: () => handlers.handlePaisTrabajoChange(value),
      idProvinciaTrabajo: () => handlers.handleProvinciaTrabajoChange(value),
      idCiudadTrabajo: () => handlers.handleCiudadTrabajoChange(value)
    };

    if (handlerMap[name]) {
      handlerMap[name]();
    } else {
      handlers.handleFieldChange(name as string, value);
    }
  };

  const handleImageSelect = (file: any) => {
    setSelectedImage(file);
    if (file && validationErrors.includes('imagen')) {
      setValidationErrors(prev => prev.filter(err => err !== 'imagen'));
    }
  };

  const handleResetForm = () => {
    resetFormData();
    setSelectedImage(null);
    setExistingImageUrl("");
    setValidationErrors([]);
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  const handleSubmit = async () => {
    if (!modoEdicion && !selectedImage) {
      Alert.alert('Atención', "La imagen del paciente es obligatoria");
      return;
    }

    const validation = validateFormularioPaciente(
      formData, 
      modoEdicion ? (selectedImage !== null || existingImageUrl !== "") : (selectedImage !== null)
    );

    if (!validation.isValid) {
      const errorMessage = formatValidationErrors(validation.errors);
      Alert.alert('Errores de validación', errorMessage);
      setValidationErrors(validation.errors.map(err => err.field));

      if (validation.errors.some(err => err.field === 'imagen')) {
        scrollRef.current?.scrollTo({ y: 0, animated: true });
      }
      return;
    }

    setIsUploading(true);

    try {
      let imageUrl = existingImageUrl;

      if (selectedImage) {
        const response = await cloudinaryService.uploadImage(selectedImage, {
          folder: 'clientes'
        });
        imageUrl = response.secure_url;
      }

      const pacienteDB: PacienteDB = {
        vcedula: formData.ci,
        vnombres: formData.nombres,
        vprimerapellido: formData.primerApellido,
        vsegundoapellido: formData.segundoApellido || undefined,
        votrosapellidos: formData.otros || undefined,
        dfechanacimiento: formData.fechaNacimiento,
        csexo: formData.sexo === "Masculino" ? "M" :
          formData.sexo === "Femenino" ? "F" : "O",
        iedad: Number(formData.edad),
        vdireccion: formData.direccionDomicilio,
        iidciudad: Number(formData.idCiudad),
        iidpais: Number(formData.idPais),
        vcelular: formData.celular,
        vlugartrabajo: formData.empresa || undefined,
        vocupacion: formData.ocupacion || undefined,
        vdirecciontrabajo: formData.direccionTrabajo || undefined,
        iidciudadtrabajo: formData.idCiudadTrabajo ? Number(formData.idCiudadTrabajo) : undefined,
        iidnacionalidad: Number(formData.nacionalidad),
        vtelefonotrabajo: formData.telefonoTrabajo || undefined,
        vemail: formData.email || undefined,
        vestadocivil: formData.estadoCivil || undefined,
        vrecomendadopor: formData.recomendadoPor || undefined,
        vrutafoto: imageUrl || undefined
      };

      if (modoEdicion && pacienteId) {
        await actualizarPaciente(parseInt(pacienteId), pacienteDB);
        Alert.alert(
          '¡Éxito!', 
          'Paciente actualizado exitosamente',
          [{ text: 'OK', onPress: () => router.back() }]
        );
      } else {
        await crearPaciente(pacienteDB);
        Alert.alert('¡Éxito!', 'Paciente creado exitosamente');
        handleResetForm();
      }

    } catch (error) {
      console.error('Error al procesar el formulario:', error);
      Alert.alert('Error', error instanceof Error ? error.message : `Error al ${modoEdicion ? 'actualizar' : 'guardar'} el paciente`);
    } finally {
      setIsUploading(false);
    }
  };

  const isSubmitDisabled = isUploading || cargandoPaises || isLoadingPaciente;

  if (isLoadingPaciente) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Cargando datos del paciente...</Text>
      </View>
    );
  }

  return (
    
    <ScrollView 
      ref={scrollRef}
      style={styles.container} 
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled"
    >

      {validationErrors.length > 0 && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorBannerText}>
            ⚠️ Por favor complete todos los campos obligatorios marcados
          </Text>
        </View>
      )}

      <FormSection
        icon={<User size={24} color={Colors.primary} />}
        title="Datos Personales"
      >
        <DatosPersonales
          formData={formData}
          onChange={handleChange}
          onImageSelect={handleImageSelect}
          paises={paises}
          cargandoPaises={cargandoPaises}
          resetKey={resetCounter}
          hasImageError={validationErrors.includes('imagen')}
          existingImageUrl={existingImageUrl}
        />
      </FormSection>

      <FormSection
        icon={<MapPin size={24} color={Colors.success} />} 
        title="Datos de Domicilio"
      >
        <DatosDomicilio
          formData={formData}
          onChange={handleChange}
          paises={paises}
          provincias={ubicacionDomicilio.provincias}
          ciudades={ubicacionDomicilio.ciudades}
          cargandoPaises={cargandoPaises}
          cargandoProvincias={ubicacionDomicilio.cargandoProvincias}
          cargandoCiudades={ubicacionDomicilio.cargandoCiudades}
        />
      </FormSection>

      <FormSection
        icon={<Briefcase size={24} color={Colors.secondary} />}
        title="Datos de Lugar de Trabajo"
      >
        <DatosTrabajo
          formData={formData}
          onChange={handleChange}
          paises={paises}
          provincias={ubicacionTrabajo.provincias}
          ciudades={ubicacionTrabajo.ciudades}
          cargandoPaises={cargandoPaises}
          cargandoProvincias={ubicacionTrabajo.cargandoProvincias}
          cargandoCiudades={ubicacionTrabajo.cargandoCiudades}
        />
      </FormSection>

      <View style={styles.actionButtons}>
        {onCancel && (
          <TouchableOpacity
            onPress={onCancel}
            disabled={isUploading}
            style={[styles.button, styles.cancelButton]}
          >
            <X size={20} color={Colors.text} />
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={isSubmitDisabled}
          style={[
            styles.button, 
            styles.submitButton,
            isSubmitDisabled && styles.buttonDisabled
          ]}
        >
          {isUploading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <>
              <Save size={20} color="#FFFFFF" />
              <Text style={styles.submitButtonText}>
                {modoEdicion ? 'Actualizar' : 'Guardar'}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {isUploading && (
        <View style={styles.uploadingContainer}>
          <Text style={styles.uploadingText}>
            {selectedImage ? 'Subiendo imagen y guardando datos...' : 'Guardando datos...'}
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentContainer: {
    paddingBottom: Spacing.xxl,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 300,
  },
  loadingText: {
    marginTop: Spacing.md,
    fontSize: FontSizes.md,
    color: Colors.textLight,
  },
  headerTitle: {
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  errorBanner: {
    backgroundColor: '#FEE2E2', 
    borderColor: '#FECaca',
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  errorBannerText: {
    color: '#DC2626', 
    fontWeight: '500',
    fontSize: FontSizes.sm,
    textAlign: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.lg,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: Spacing.md,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: 8,
    ...Shadows.sm,
  },
  cancelButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cancelButtonText: {
    color: Colors.text,
    fontWeight: '600',
    fontSize: FontSizes.md,
  },
  submitButton: {
    backgroundColor: Colors.primary, 
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: FontSizes.md,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  uploadingContainer: {
    marginTop: Spacing.md,
    alignItems: 'center',
  },
  uploadingText: {
    fontSize: FontSizes.sm,
    color: Colors.textLight,
  },
});