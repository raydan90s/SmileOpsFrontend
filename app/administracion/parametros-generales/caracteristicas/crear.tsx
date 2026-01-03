import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Zap } from 'lucide-react-native';

import BackButton from '@components/shared/BackButton';
import SuccessModal from '@components/shared/SuccessModal';
import LoadingSpinner from '@components/shared/LoadingSpinner';

import { crearCaracteristica } from '@services/Caracteristicas/caracteristicas.service';
import type { CaracteristicaForm } from '@models/Caracteristicas/caracteristicas.types';

import { Colors, Spacing, FontSizes, BorderRadius } from '@constants/theme';

export default function CrearCaracteristica() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [modalExito, setModalExito] = useState({
    visible: false,
    mensaje: '',
    titulo: '',
  });
  const [formData, setFormData] = useState<CaracteristicaForm>({
    vnombre_caracteristica: '',
    bactivo: true,
  });

  const handleSubmit = async () => {
    if (!formData.vnombre_caracteristica.trim()) {
      Alert.alert('Error', 'El nombre de la característica es obligatorio');
      return;
    }

    try {
      setLoading(true);
      await crearCaracteristica(formData);
      setModalExito({
        visible: true,
        titulo: '¡Registro Exitoso!',
        mensaje: 'La característica ha sido creada exitosamente.',
      });
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al guardar la característica');
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setModalExito({ visible: false, mensaje: '', titulo: '' });
    router.back();
  };

  const handleCancel = () => {
    router.back();
  };

  if (loading) {
    return <LoadingSpinner message="Guardando característica..." />;
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <BackButton />
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.pageHeaderContainer}>
          <View style={styles.pageHeader}>
            <View style={styles.iconContainer}>
              <Zap size={24} color={Colors.textInverse} />
            </View>
            <View style={styles.headerText}>
              <Text style={styles.title}>Nueva Característica</Text>
              <Text style={styles.subtitle}>
                Complete la información de la nueva característica
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>DATOS DE LA CARACTERÍSTICA</Text>
          </View>

          <View style={styles.sectionContent}>
            <View style={styles.formContent}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  Nombre de la Característica <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  value={formData.vnombre_caracteristica}
                  onChangeText={(value) =>
                    setFormData({ ...formData, vnombre_caracteristica: value })
                  }
                  placeholder="Ej: Bluetooth, USB-C, Resistente al agua"
                  placeholderTextColor={Colors.placeholder}
                  editable={!loading}
                />
              </View>

              <View style={styles.switchContainer}>
                <Text style={styles.label}>Activo</Text>
                <Switch
                  value={formData.bactivo}
                  onValueChange={(value) =>
                    setFormData({ ...formData, bactivo: value })
                  }
                  trackColor={{ false: Colors.border, true: Colors.primary }}
                  thumbColor={Colors.surface}
                  disabled={loading}
                />
              </View>
            </View>

            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                style={[styles.cancelButton, loading && styles.buttonDisabled]}
                onPress={handleCancel}
                activeOpacity={0.7}
                disabled={loading}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.saveButton, loading && styles.buttonDisabled]}
                onPress={handleSubmit}
                activeOpacity={0.8}
                disabled={loading}
              >
                <Text style={styles.saveButtonText}>
                  {loading ? 'Guardando...' : 'Guardar'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      <SuccessModal
        visible={modalExito.visible}
        onClose={handleCloseModal}
        message={modalExito.mensaje}
        title={modalExito.titulo}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: Spacing.md,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  pageHeaderContainer: {
    marginBottom: Spacing.md,
  },
  pageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
  },
  iconContainer: {
    backgroundColor: Colors.primary,
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
    color: Colors.text,
  },
  subtitle: {
    fontSize: FontSizes.sm,
    color: Colors.secondary,
    marginTop: 2,
  },
  section: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  sectionHeader: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.textInverse,
  },
  sectionContent: {
    padding: Spacing.md,
  },
  formContent: {
    gap: Spacing.md,
  },
  inputGroup: {
    gap: Spacing.xs,
  },
  label: {
    fontSize: FontSizes.sm,
    fontWeight: '500',
    color: Colors.text,
  },
  required: {
    color: Colors.error,
  },
  input: {
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: FontSizes.md,
    color: Colors.text,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.xl,
    paddingTop: Spacing.md,
    borderTopWidth: 2,
    borderTopColor: Colors.border,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.text,
  },
  saveButton: {
    flex: 1,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.textInverse,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});