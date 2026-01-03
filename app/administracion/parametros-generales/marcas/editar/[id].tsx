import React, { useState, useEffect } from 'react';
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
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Tag } from 'lucide-react-native';

import BackButton from '@components/shared/BackButton';
import SuccessModal from '@components/shared/SuccessModal';
import LoadingSpinner from '@components/shared/LoadingSpinner';

import { getMarcaById, actualizarMarca } from '@services/Marcas/marcas.service';
import type { MarcaForm } from '@models/Marca/marcas.type';

import { Colors, Spacing, FontSizes, BorderRadius } from '@constants/theme';

export default function EditarMarca() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState<MarcaForm>({
    vnombre_marca: '',
    bactivo: true,
  });

  useEffect(() => {
    if (id) {
      cargarMarca(Number(id));
    }
  }, [id]);

  const cargarMarca = async (marcaId: number) => {
    try {
      setLoading(true);
      const data = await getMarcaById(marcaId);

      setFormData({
        vnombre_marca: data.vnombre_marca,
        bactivo: data.bactivo,
      });
    } catch (error) {
      Alert.alert('Error', 'No se pudo cargar la marca');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.vnombre_marca.trim()) {
      Alert.alert('Error', 'El nombre de la marca es obligatorio');
      return;
    }

    try {
      setSaving(true);
      await actualizarMarca(Number(id), formData);
      setModalVisible(true);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al actualizar la marca');
    } finally {
      setSaving(false);
    }
  };

  const handleModalClose = () => {
    setModalVisible(false);
    router.back();
  };

  if (loading) {
    return <LoadingSpinner message="Cargando marca..." />;
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
        <View style={styles.pageHeader}>
          <View style={styles.iconContainer}>
            <Tag size={24} color={Colors.textInverse} />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.title}>Editar Marca</Text>
            <Text style={styles.subtitle}>
              Modifique la información de la marca
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>DATOS DE LA MARCA</Text>
          </View>

          <View style={styles.sectionContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Nombre de la Marca <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                value={formData.vnombre_marca}
                onChangeText={(value) =>
                  setFormData({ ...formData, vnombre_marca: value })
                }
                placeholder="Ej: Samsung, Apple, Sony"
                placeholderTextColor={Colors.placeholder}
                editable={!saving}
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
                disabled={saving}
              />
            </View>
          </View>
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[styles.cancelButton, saving && styles.buttonDisabled]}
            onPress={() => router.back()}
            activeOpacity={0.7}
            disabled={saving}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.saveButton, saving && styles.buttonDisabled]}
            onPress={handleSubmit}
            activeOpacity={0.8}
            disabled={saving}
          >
            <Text style={styles.saveButtonText}>
              {saving ? 'Guardando...' : 'Actualizar'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <SuccessModal
        visible={modalVisible}
        onClose={handleModalClose}
        message="La marca ha sido actualizada correctamente"
        title="¡Actualización Exitosa!"
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
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  pageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
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
    color: Colors.textLight,
    marginTop: 2,
  },
  section: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    marginBottom: Spacing.md,
  },
  sectionHeader: {
    backgroundColor: Colors.primary,
    padding: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSizes.md,
    fontWeight: 'bold',
    color: Colors.textInverse,
  },
  sectionContent: {
    padding: Spacing.md,
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