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
  Modal,
  FlatList,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Package, Save, Plus, ChevronDown, Check } from 'lucide-react-native';
import BackButton from '@components/shared/BackButton';
import LoadingSpinner from '@components/shared/LoadingSpinner';
import SuccessModal from '@components/shared/SuccessModal';
import DireccionItem from '@components/administracion/Proveedores/DireccionItem';

import {
  getProveedorById,
  updateProveedor,
  getDireccionesByProveedor,
  createDireccion,
  updateDireccion,
  deleteDireccion,
} from '@services/Administracion/proveedores.service';
import { fetchAllTiposProveedor } from '@services/Administracion/tiposProveedor.service';

import type { TipoProveedor } from '@models/administracion/Proveedores/TipoProveedor.types';

import { Colors, Spacing, FontSizes, BorderRadius } from '@constants/theme';

interface FormData {
  vnombre: string;
  vruc: string;
  vtelefono: string;
  vemail: string;
  itipo_proveedor: number | '';
  bactivo: boolean;
}

interface DireccionForm {
  iid_direccion?: number;
  vdireccion: string;
  vciudad: string;
  vprovincia: string;
  vpais: string;
  isNew?: boolean;
  isDeleted?: boolean;
}

export default function EditarProveedor() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [tiposProveedor, setTiposProveedor] = useState<TipoProveedor[]>([]);
  const [direcciones, setDirecciones] = useState<DireccionForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    vnombre: '',
    vruc: '',
    vtelefono: '',
    vemail: '',
    itipo_proveedor: '',
    bactivo: true,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [showTipoModal, setShowTipoModal] = useState(false);


  useEffect(() => {
    if (id) {
      cargarDatos(Number(id));
    }
  }, [id]);

  const cargarDatos = async (idProveedor: number) => {
    try {
      setLoading(true);
      const [proveedor, tipos, direccionesData] = await Promise.all([
        getProveedorById(idProveedor),
        fetchAllTiposProveedor(),
        getDireccionesByProveedor(idProveedor),
      ]);

      setFormData({
        vnombre: proveedor.vnombre,
        vruc: proveedor.vruc || '',
        vtelefono: proveedor.vtelefono || '',
        vemail: proveedor.vemail || '',
        itipo_proveedor: proveedor.itipo_proveedor ?? '',
        bactivo: proveedor.bactivo ?? true,
      });

      setDirecciones(
        direccionesData.map((d) => ({
          iid_direccion: d.iid_direccion,
          vdireccion: d.vdireccion,
          vciudad: d.vciudad || '',
          vprovincia: d.vprovincia || '',
          vpais: d.vpais || '',
          isNew: false,
          isDeleted: false,
        }))
      );

      setTiposProveedor(tipos);
    } catch (error) {
      Alert.alert('Error', 'No se pudo cargar el proveedor');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (name: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const agregarDireccion = () => {
    setDirecciones((prev) => [
      ...prev,
      {
        vdireccion: '',
        vciudad: '',
        vprovincia: '',
        vpais: '',
        isNew: true,
        isDeleted: false,
      },
    ]);
  };

  const actualizarDireccion = (
    index: number,
    field: keyof DireccionForm,
    value: string
  ) => {
    setDirecciones((prev) =>
      prev.map((dir, i) => (i === index ? { ...dir, [field]: value } : dir))
    );
  };

  const eliminarDireccion = (index: number) => {
    setDirecciones((prev) =>
      prev.map((dir, i) => (i === index ? { ...dir, isDeleted: true } : dir))
    );
  };

  const validarFormulario = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.vnombre.trim()) {
      newErrors.vnombre = 'El nombre es requerido';
    }

    if (!formData.vruc.trim()) {
      newErrors.vruc = 'El RUC es requerido';
    } else if (formData.vruc.length !== 13) {
      newErrors.vruc = 'El RUC debe tener 13 dígitos';
    }

    if (formData.itipo_proveedor === '') {
      newErrors.itipo_proveedor = 'Debe seleccionar un tipo de proveedor';
    }

    if (formData.vemail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.vemail)) {
      newErrors.vemail = 'Email inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validarFormulario() || !id) return;

    try {
      setSaving(true);

      const proveedorData = {
        vnombre: formData.vnombre.trim(),
        vruc: formData.vruc.trim(),
        vtelefono: formData.vtelefono.trim() || undefined,
        vemail: formData.vemail.trim() || undefined,
        itipo_proveedor: formData.itipo_proveedor as number,
        bactivo: formData.bactivo,
      };

      await updateProveedor(Number(id), proveedorData);

      for (const direccion of direcciones) {
        if (direccion.isDeleted && direccion.iid_direccion) {
          await deleteDireccion(direccion.iid_direccion);
        } else if (
          direccion.isNew &&
          !direccion.isDeleted &&
          direccion.vdireccion.trim()
        ) {
          await createDireccion({
            iid_proveedor: Number(id),
            vdireccion: direccion.vdireccion.trim(),
            vciudad: direccion.vciudad.trim() || undefined,
            vprovincia: direccion.vprovincia.trim() || undefined,
            vpais: direccion.vpais.trim() || undefined,
          });
        } else if (
          direccion.iid_direccion &&
          !direccion.isNew &&
          !direccion.isDeleted
        ) {
          await updateDireccion(direccion.iid_direccion, {
            vdireccion: direccion.vdireccion.trim(),
            vciudad: direccion.vciudad.trim() || undefined,
            vprovincia: direccion.vprovincia.trim() || undefined,
            vpais: direccion.vpais.trim() || undefined,
          });
        }
      }

      setModalVisible(true);
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar el proveedor');
    } finally {
      setSaving(false);
    }
  };

  const handleModalClose = () => {
    setModalVisible(false);
    router.back();
  };

  if (loading) {
    return <LoadingSpinner message="Cargando proveedor..." />;
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
            <Package size={24} color={Colors.textInverse} />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.title}>Editar Proveedor</Text>
            <Text style={styles.subtitle}>Actualice la información del proveedor</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>INFORMACIÓN GENERAL</Text>
          </View>

          <View style={styles.sectionContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Nombre <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, errors.vnombre && styles.inputError]}
                value={formData.vnombre}
                onChangeText={(value) => handleChange('vnombre', value)}
                placeholder="Nombre del proveedor"
                placeholderTextColor={Colors.placeholder}
              />
              {errors.vnombre && (
                <Text style={styles.errorText}>{errors.vnombre}</Text>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                RUC <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, errors.vruc && styles.inputError]}
                value={formData.vruc}
                onChangeText={(value) => handleChange('vruc', value)}
                placeholder="1234567890001"
                placeholderTextColor={Colors.placeholder}
                keyboardType="numeric"
                maxLength={13}
              />
              {errors.vruc && <Text style={styles.errorText}>{errors.vruc}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Tipo de Proveedor <Text style={styles.required}>*</Text>
              </Text>
              <TouchableOpacity
                style={[
                  styles.selectButton,
                  errors.itipo_proveedor && styles.inputError,
                ]}
                onPress={() => setShowTipoModal(true)}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.selectButtonText,
                  !formData.itipo_proveedor && styles.placeholderText
                ]}>
                  {formData.itipo_proveedor
                    ? tiposProveedor.find(t => t.iid_tipo_proveedor === formData.itipo_proveedor)?.vnombre
                    : 'Seleccionar tipo'}
                </Text>
                <ChevronDown size={20} color={Colors.placeholder} />
              </TouchableOpacity>
              {errors.itipo_proveedor && (
                <Text style={styles.errorText}>{errors.itipo_proveedor}</Text>
              )}
            </View>

            {/* Modal Tipo Proveedor */}
            <Modal
              visible={showTipoModal}
              transparent
              animationType="fade"
              onRequestClose={() => setShowTipoModal(false)}
            >
              <Pressable style={styles.modalOverlay} onPress={() => setShowTipoModal(false)}>
                <Pressable onPress={(e) => e.stopPropagation()}>
                  <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                      <Text style={styles.modalTitle}>Seleccionar Tipo de Proveedor</Text>
                    </View>
                    <FlatList
                      data={tiposProveedor}
                      keyExtractor={(item) => item.iid_tipo_proveedor.toString()}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          style={styles.modalItem}
                          onPress={() => {
                            handleChange('itipo_proveedor', item.iid_tipo_proveedor);
                            setShowTipoModal(false);
                          }}
                          activeOpacity={0.7}
                        >
                          <Text style={styles.modalItemText}>{item.vnombre}</Text>
                          {formData.itipo_proveedor === item.iid_tipo_proveedor && (
                            <Check size={20} color={Colors.primary} />
                          )}
                        </TouchableOpacity>
                      )}
                      ItemSeparatorComponent={() => <View style={styles.separator} />}
                      style={styles.modalList}
                    />
                    <TouchableOpacity
                      style={styles.modalCloseButton}
                      onPress={() => setShowTipoModal(false)}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.modalCloseButtonText}>Cerrar</Text>
                    </TouchableOpacity>
                  </View>
                </Pressable>
              </Pressable>
            </Modal>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Teléfono</Text>
              <TextInput
                style={styles.input}
                value={formData.vtelefono}
                onChangeText={(value) => handleChange('vtelefono', value)}
                placeholder="0999999999"
                placeholderTextColor={Colors.placeholder}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={[styles.input, errors.vemail && styles.inputError]}
                value={formData.vemail}
                onChangeText={(value) => handleChange('vemail', value)}
                placeholder="ejemplo@correo.com"
                placeholderTextColor={Colors.placeholder}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {errors.vemail && (
                <Text style={styles.errorText}>{errors.vemail}</Text>
              )}
            </View>

            <View style={styles.switchContainer}>
              <Text style={styles.label}>Proveedor activo</Text>
              <Switch
                value={formData.bactivo}
                onValueChange={(value) => handleChange('bactivo', value)}
                trackColor={{ false: Colors.border, true: Colors.primary }}
                thumbColor={Colors.surface}
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeaderWithButton}>
            <Text style={styles.sectionTitle}>DIRECCIONES</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={agregarDireccion}
              activeOpacity={0.7}
            >
              <Plus size={16} color={Colors.primary} />
              <Text style={styles.addButtonText}>Agregar</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.sectionContent}>
            {direcciones.filter((d) => !d.isDeleted).length === 0 ? (
              <Text style={styles.emptyText}>No hay direcciones registradas</Text>
            ) : (
              <View style={styles.direccionesList}>
                {direcciones.map(
                  (dir, index) =>
                    !dir.isDeleted && (
                      <DireccionItem
                        key={index}
                        direccion={dir.vdireccion}
                        ciudad={dir.vciudad}
                        provincia={dir.vprovincia}
                        pais={dir.vpais}
                        onChangeDireccion={(value) =>
                          actualizarDireccion(index, 'vdireccion', value)
                        }
                        onChangeCiudad={(value) =>
                          actualizarDireccion(index, 'vciudad', value)
                        }
                        onChangeProvincia={(value) =>
                          actualizarDireccion(index, 'vprovincia', value)
                        }
                        onChangePais={(value) =>
                          actualizarDireccion(index, 'vpais', value)
                        }
                        onDelete={() => eliminarDireccion(index)}
                      />
                    )
                )}
              </View>
            )}
          </View>
        </View>

        <TouchableOpacity
          style={[styles.saveButton, saving && styles.saveButtonDisabled]}
          onPress={handleSubmit}
          disabled={saving}
          activeOpacity={0.8}
        >
          <Save size={24} color={Colors.textInverse} />
          <Text style={styles.saveButtonText}>
            {saving ? 'Guardando...' : 'Actualizar Proveedor'}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <SuccessModal
        visible={modalVisible}
        onClose={handleModalClose}
        message="El proveedor ha sido actualizado exitosamente"
        title="¡Éxito!"
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
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary,
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
  },
  section: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    borderWidth: 2,
    borderColor: Colors.primary,
    overflow: 'hidden',
  },
  sectionHeader: {
    backgroundColor: Colors.primary,
    padding: Spacing.md,
  },
  sectionHeaderWithButton: {
    backgroundColor: Colors.primary,
    padding: Spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: FontSizes.md,
    fontWeight: 'bold',
    color: Colors.textInverse,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    gap: Spacing.xs,
  },
  addButtonText: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: Colors.primary,
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
  inputError: {
    borderColor: Colors.error,
  },
  errorText: {
    fontSize: FontSizes.xs,
    color: Colors.error,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing.xs,
  },
  emptyText: {
    textAlign: 'center',
    color: Colors.textLight,
    fontSize: FontSizes.sm,
    paddingVertical: Spacing.md,
  },
  direccionesList: {
    gap: Spacing.sm,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.xs,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    color: Colors.textInverse,
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
  },
  selectButton: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  backgroundColor: Colors.surface,
  borderWidth: 2,
  borderColor: Colors.border,
  borderRadius: BorderRadius.md,
  paddingHorizontal: Spacing.md,
  paddingVertical: Spacing.sm,
},
selectButtonText: {
  fontSize: FontSizes.md,
  color: Colors.text,
  flex: 1,
},
placeholderText: {
  color: Colors.placeholder,
},
modalOverlay: {
  flex: 1,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  justifyContent: 'center',
  alignItems: 'center',
  padding: Spacing.md,
},
modalContent: {
  backgroundColor: Colors.surface,
  borderRadius: BorderRadius.lg,
  width: '90%',
  maxWidth: 500,
  maxHeight: '90%',
  overflow: 'hidden',
},
modalHeader: {
  padding: Spacing.lg,
  borderBottomWidth: 1,
  borderBottomColor: Colors.border,
},
modalTitle: {
  fontSize: FontSizes.lg,
  fontWeight: '600',
  color: Colors.text,
},
modalList: {
  maxHeight: 600,
},
modalItem: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: Spacing.lg,
  minHeight: 56,
},
modalItemText: {
  fontSize: FontSizes.md,
  color: Colors.text,
  flex: 1,
},
separator: {
  height: 1,
  backgroundColor: Colors.border,
},
modalCloseButton: {
  backgroundColor: Colors.primary,
  padding: Spacing.md,
  alignItems: 'center',
  borderTopWidth: 1,
  borderTopColor: Colors.border,
},
modalCloseButtonText: {
  color: Colors.textInverse,
  fontSize: FontSizes.sm,
  fontWeight: '600',
},
});