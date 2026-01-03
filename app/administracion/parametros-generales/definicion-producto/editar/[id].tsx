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
  ActivityIndicator,
  Modal,
  FlatList,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { FileText, Save, ChevronDown, Check } from 'lucide-react-native';

import BackButton from '@components/shared/BackButton';
import SuccessModal from '@components/shared/SuccessModal';
import LoadingSpinner from '@components/shared/LoadingSpinner';

import { getAllProductosNombre } from '@services/ProductoNombre/ProductoNombre.service';
import { getCaracteristicasActivas } from '@services/Caracteristicas/caracteristicas.service';
import { getMarcasActivas } from '@services/Marcas/marcas.service';
import { getUnidadesActivas } from '@services/unidadMedidas/unidadMedidas.service';
import {
  getInventarioProductoById,
  actualizarInventarioProducto,
} from '@services/InventarioProductos/inventarioProductos.service';
import { getClasificacionById } from '@services/ClasificacionProducto/clasificacion.service';
import { getSubclasificacionById } from '@services/SubclasificacionProducto/subclasificacion.service';

import type { ProductoNombre } from '@models/ProductoNombre/ProductoNombre.types';
import type { Caracteristica } from '@models/Caracteristicas/caracteristicas.types';
import type { Marca } from '@models/Marca/marcas.type';
import type { Unidad } from '@models/UnidadMedidas/unidadMedidas.types';
import type { Clasificacion } from '@models/ClasificacionProducto/Clasificacion.types';
import type { Subclasificacion } from '@models/SubclasificacionProducto/Subclasificacion.types';

import { Colors, Spacing, FontSizes, BorderRadius } from '@constants/theme';

export default function EditarDefinicionProducto() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [formData, setFormData] = useState({
    codigo: '',
    iid_subclasificacion: '',
    iid_nombre: '',
    iid_caracteristica: '',
    iid_marca: '',
    estado: true,
    esDeConteo: false,
    unidadCompra: '',
    unidadConsumo: '',
    cantMinimaStock: '0',
  });

  const [clasificacion, setClasificacion] = useState<Clasificacion | null>(null);
  const [subclasificacion, setSubclasificacion] = useState<Subclasificacion | null>(null);
  const [nombres, setNombres] = useState<ProductoNombre[]>([]);
  const [caracteristicas, setCaracteristicas] = useState<Caracteristica[]>([]);
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [unidades, setUnidades] = useState<Unidad[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalExito, setModalExito] = useState({
    visible: false,
    mensaje: '',
    titulo: '',
  });

  // Estados para modales
  const [showNombreModal, setShowNombreModal] = useState(false);
  const [showCaracteristicaModal, setShowCaracteristicaModal] = useState(false);
  const [showMarcaModal, setShowMarcaModal] = useState(false);
  const [showUnidadCompraModal, setShowUnidadCompraModal] = useState(false);
  const [showUnidadConsumoModal, setShowUnidadConsumoModal] = useState(false);

  useEffect(() => {
    if (id) {
      cargarDatos();
    }
  }, [id]);

  const cargarDatos = async () => {
    try {
      setLoading(true);

      const producto = await getInventarioProductoById(Number(id));

      const [
        nombresData,
        caracteristicasData,
        marcasData,
        unidadesData,
        subclasData,
      ] = await Promise.all([
        getAllProductosNombre(),
        getCaracteristicasActivas(),
        getMarcasActivas(),
        getUnidadesActivas(),
        getSubclasificacionById(producto.iid_subclasificacion),
      ]);

      setNombres(nombresData);
      setCaracteristicas(caracteristicasData);
      setMarcas(marcasData);
      setUnidades(unidadesData);
      setSubclasificacion(subclasData);

      const clasifData = await getClasificacionById(subclasData.iid_clasificacion);
      setClasificacion(clasifData);

      setFormData({
        codigo: producto.codigo_producto,
        iid_subclasificacion: producto.iid_subclasificacion.toString(),
        iid_nombre: producto.iid_nombre.toString(),
        iid_caracteristica: producto.iid_caracteristica.toString(),
        iid_marca: producto.iid_marca.toString(),
        estado: producto.estado,
        esDeConteo: producto.es_de_conteo,
        unidadCompra: producto.unidad_compra.toString(),
        unidadConsumo: producto.unidad_consumo.toString(),
        cantMinimaStock: producto.cantidad_minima?.toString() || '0',
      });
    } catch (error) {
      Alert.alert('Error', 'No se pudo cargar el producto');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (name: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.iid_nombre) {
      Alert.alert('Error', 'El nombre del producto es requerido');
      return;
    }
    if (!formData.iid_caracteristica) {
      Alert.alert('Error', 'La característica es requerida');
      return;
    }
    if (!formData.iid_marca) {
      Alert.alert('Error', 'La marca es requerida');
      return;
    }
    if (!formData.unidadCompra) {
      Alert.alert('Error', 'La unidad de compra es requerida');
      return;
    }
    if (!formData.unidadConsumo) {
      Alert.alert('Error', 'La unidad de consumo es requerida');
      return;
    }

    try {
      setSaving(true);
      const productoData = {
        codigo_producto: formData.codigo,
        iid_subclasificacion: Number(formData.iid_subclasificacion),
        iid_nombre: Number(formData.iid_nombre),
        iid_caracteristica: Number(formData.iid_caracteristica),
        iid_marca: Number(formData.iid_marca),
        unidad_compra: Number(formData.unidadCompra),
        unidad_consumo: Number(formData.unidadConsumo),
        cantidad_minima: parseFloat(formData.cantMinimaStock) || 0,
        estado: formData.estado,
        es_de_conteo: formData.esDeConteo,
      };

      await actualizarInventarioProducto(Number(id), productoData);
      setModalExito({
        visible: true,
        titulo: '¡Actualización Exitosa!',
        mensaje: 'El producto ha sido actualizado correctamente',
      });
    } catch (error: any) {
      Alert.alert('Error', error.message || 'No se pudo actualizar el producto');
    } finally {
      setSaving(false);
    }
  };

  const handleModalClose = () => {
    setModalExito({ visible: false, mensaje: '', titulo: '' });
    router.back();
  };

  if (loading) {
    return <LoadingSpinner message="Cargando producto..." />;
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
              <FileText size={24} color={Colors.textInverse} />
            </View>
            <View style={styles.headerText}>
              <Text style={styles.title}>Editar Producto</Text>
              <Text style={styles.subtitle}>Modifique los datos del producto</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.topActions}>
            <TouchableOpacity
              style={[styles.saveButton, saving && styles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={saving}
              activeOpacity={0.8}
            >
              {saving ? (
                <ActivityIndicator size="small" color={Colors.textInverse} />
              ) : (
                <>
                  <Save size={20} color={Colors.textInverse} />
                  <Text style={styles.saveButtonText}>Actualizar</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.formGrid}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Clasificación</Text>
              <View style={styles.inputDisabled}>
                <Text style={styles.inputDisabledText}>
                  {clasificacion
                    ? `${clasificacion.iid_clasificacion.toString().padStart(2, '0')} ${clasificacion.v_descripcion}`
                    : 'Cargando...'}
                </Text>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Sub Clasificación</Text>
              <View style={styles.inputDisabled}>
                <Text style={styles.inputDisabledText}>
                  {subclasificacion
                    ? `${subclasificacion.v_codigo} ${subclasificacion.v_descripcion}`
                    : 'Cargando...'}
                </Text>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Código</Text>
              <View style={[styles.inputDisabled, styles.inputCode]}>
                <Text style={styles.inputCodeText}>{formData.codigo}</Text>
              </View>
            </View>

            {/* Nombre */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Nombre <Text style={styles.required}>*</Text>
              </Text>
              <TouchableOpacity
                style={styles.selectButton}
                onPress={() => setShowNombreModal(true)}
                disabled={saving}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.selectButtonText,
                  !formData.iid_nombre && styles.placeholderText
                ]}>
                  {formData.iid_nombre
                    ? nombres.find(n => n.iid_nombre.toString() === formData.iid_nombre)?.vnombre_producto
                    : 'Seleccione un nombre'}
                </Text>
                <ChevronDown size={20} color={Colors.placeholder} />
              </TouchableOpacity>
            </View>

            {/* Característica */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Nombre Comercial <Text style={styles.required}>*</Text>
              </Text>
              <TouchableOpacity
                style={styles.selectButton}
                onPress={() => setShowCaracteristicaModal(true)}
                disabled={saving}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.selectButtonText,
                  !formData.iid_caracteristica && styles.placeholderText
                ]}>
                  {formData.iid_caracteristica
                    ? caracteristicas.find(c => c.iid_caracteristica.toString() === formData.iid_caracteristica)?.vnombre_caracteristica
                    : 'Seleccione'}
                </Text>
                <ChevronDown size={20} color={Colors.placeholder} />
              </TouchableOpacity>
            </View>

            {/* Marca */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Marca <Text style={styles.required}>*</Text>
              </Text>
              <TouchableOpacity
                style={styles.selectButton}
                onPress={() => setShowMarcaModal(true)}
                disabled={saving}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.selectButtonText,
                  !formData.iid_marca && styles.placeholderText
                ]}>
                  {formData.iid_marca
                    ? marcas.find(m => m.iid_marca.toString() === formData.iid_marca)?.vnombre_marca
                    : 'Seleccione'}
                </Text>
                <ChevronDown size={20} color={Colors.placeholder} />
              </TouchableOpacity>
            </View>

            <View style={styles.checkboxGroup}>
              <View style={styles.checkboxItem}>
                <Text style={styles.label}>Estado</Text>
                <Switch
                  value={formData.estado}
                  onValueChange={(value) => handleChange('estado', value)}
                  trackColor={{ false: Colors.border, true: Colors.primary }}
                  thumbColor={Colors.surface}
                  disabled={saving}
                />
              </View>
              <View style={styles.checkboxItem}>
                <Text style={styles.label}>Es de Conteo</Text>
                <Switch
                  value={formData.esDeConteo}
                  onValueChange={(value) => handleChange('esDeConteo', value)}
                  trackColor={{ false: Colors.border, true: Colors.primary }}
                  thumbColor={Colors.surface}
                  disabled={saving}
                />
              </View>
            </View>

            {/* Unidad de Compra */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Unidad de Compra <Text style={styles.required}>*</Text>
              </Text>
              <TouchableOpacity
                style={styles.selectButton}
                onPress={() => setShowUnidadCompraModal(true)}
                disabled={saving}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.selectButtonText,
                  !formData.unidadCompra && styles.placeholderText
                ]}>
                  {formData.unidadCompra
                    ? (() => {
                        const unidad = unidades.find(u => u.iidunidad.toString() === formData.unidadCompra);
                        return unidad ? `${unidad.vnombreunidad}${unidad.vabreviatura ? ` (${unidad.vabreviatura})` : ''}` : 'Seleccione';
                      })()
                    : 'Seleccione'}
                </Text>
                <ChevronDown size={20} color={Colors.placeholder} />
              </TouchableOpacity>
            </View>

            {/* Unidad de Consumo */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Unidad de Consumo <Text style={styles.required}>*</Text>
              </Text>
              <TouchableOpacity
                style={styles.selectButton}
                onPress={() => setShowUnidadConsumoModal(true)}
                disabled={saving}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.selectButtonText,
                  !formData.unidadConsumo && styles.placeholderText
                ]}>
                  {formData.unidadConsumo
                    ? (() => {
                        const unidad = unidades.find(u => u.iidunidad.toString() === formData.unidadConsumo);
                        return unidad ? `${unidad.vnombreunidad}${unidad.vabreviatura ? ` (${unidad.vabreviatura})` : ''}` : 'Seleccione';
                      })()
                    : 'Seleccione'}
                </Text>
                <ChevronDown size={20} color={Colors.placeholder} />
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Cant. Mínima en Stock</Text>
              <TextInput
                style={styles.input}
                value={formData.cantMinimaStock}
                onChangeText={(value) => handleChange('cantMinimaStock', value)}
                keyboardType="decimal-pad"
                placeholder="0.00"
                placeholderTextColor={Colors.placeholder}
                editable={!saving}
              />
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Modal Nombre */}
      <Modal
        visible={showNombreModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowNombreModal(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setShowNombreModal(false)}>
          <Pressable onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Seleccionar Nombre</Text>
              </View>
              <FlatList
                data={nombres}
                keyExtractor={(item) => item.iid_nombre.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.modalItem}
                    onPress={() => {
                      handleChange('iid_nombre', item.iid_nombre.toString());
                      setShowNombreModal(false);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.modalItemText}>{item.vnombre_producto}</Text>
                    {formData.iid_nombre === item.iid_nombre.toString() && (
                      <Check size={20} color={Colors.primary} />
                    )}
                  </TouchableOpacity>
                )}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                style={styles.modalList}
              />
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setShowNombreModal(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.modalCloseButtonText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Modal Característica */}
      <Modal
        visible={showCaracteristicaModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCaracteristicaModal(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setShowCaracteristicaModal(false)}>
          <Pressable onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Seleccionar Nombre Comercial</Text>
              </View>
              <FlatList
                data={caracteristicas}
                keyExtractor={(item) => item.iid_caracteristica.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.modalItem}
                    onPress={() => {
                      handleChange('iid_caracteristica', item.iid_caracteristica.toString());
                      setShowCaracteristicaModal(false);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.modalItemText}>{item.vnombre_caracteristica}</Text>
                    {formData.iid_caracteristica === item.iid_caracteristica.toString() && (
                      <Check size={20} color={Colors.primary} />
                    )}
                  </TouchableOpacity>
                )}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                style={styles.modalList}
              />
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setShowCaracteristicaModal(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.modalCloseButtonText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Modal Marca */}
      <Modal
        visible={showMarcaModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowMarcaModal(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setShowMarcaModal(false)}>
          <Pressable onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Seleccionar Marca</Text>
              </View>
              <FlatList
                data={marcas}
                keyExtractor={(item) => item.iid_marca.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.modalItem}
                    onPress={() => {
                      handleChange('iid_marca', item.iid_marca.toString());
                      setShowMarcaModal(false);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.modalItemText}>{item.vnombre_marca}</Text>
                    {formData.iid_marca === item.iid_marca.toString() && (
                      <Check size={20} color={Colors.primary} />
                    )}
                  </TouchableOpacity>
                )}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                style={styles.modalList}
              />
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setShowMarcaModal(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.modalCloseButtonText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Modal Unidad Compra */}
      <Modal
        visible={showUnidadCompraModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowUnidadCompraModal(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setShowUnidadCompraModal(false)}>
          <Pressable onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Seleccionar Unidad de Compra</Text>
              </View>
              <FlatList
                data={unidades}
                keyExtractor={(item) => item.iidunidad.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.modalItem}
                    onPress={() => {
                      handleChange('unidadCompra', item.iidunidad.toString());
                      setShowUnidadCompraModal(false);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.modalItemText}>
                      {`${item.vnombreunidad}${item.vabreviatura ? ` (${item.vabreviatura})` : ''}`}
                    </Text>
                    {formData.unidadCompra === item.iidunidad.toString() && (
                      <Check size={20} color={Colors.primary} />
                    )}
                  </TouchableOpacity>
                )}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                style={styles.modalList}
              />
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setShowUnidadCompraModal(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.modalCloseButtonText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Modal Unidad Consumo */}
      <Modal
        visible={showUnidadConsumoModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowUnidadConsumoModal(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setShowUnidadConsumoModal(false)}>
          <Pressable onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Seleccionar Unidad de Consumo</Text>
              </View>
              <FlatList
                data={unidades}
                keyExtractor={(item) => item.iidunidad.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.modalItem}
                    onPress={() => {
                      handleChange('unidadConsumo', item.iidunidad.toString());
                      setShowUnidadConsumoModal(false);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.modalItemText}>
                      {`${item.vnombreunidad}${item.vabreviatura ? ` (${item.vabreviatura})` : ''}`}
                    </Text>
                    {formData.unidadConsumo === item.iidunidad.toString() && (
                      <Check size={20} color={Colors.primary} />
                    )}
                  </TouchableOpacity>
                )}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                style={styles.modalList}
              />
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setShowUnidadConsumoModal(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.modalCloseButtonText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      <SuccessModal
        visible={modalExito.visible}
        onClose={handleModalClose}
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
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    gap: Spacing.md,
  },
  topActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: Spacing.sm,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    gap: Spacing.xs,
  },
  saveButtonText: {
    color: Colors.textInverse,
    fontSize: FontSizes.md,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  formGrid: {
    gap: Spacing.md,
  },
  inputGroup: {
    gap: Spacing.xs,
  },
  label: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
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
  inputDisabled: {
    backgroundColor: Colors.backgroundLight,
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  inputDisabledText: {
    fontSize: FontSizes.md,
    color: Colors.secondary,
  },
  inputCode: {
    backgroundColor: Colors.backgroundLight,
  },
  inputCodeText: {
    fontSize: FontSizes.md,
    color: Colors.secondary,
    fontFamily: 'monospace',
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
  checkboxGroup: {
    flexDirection: 'row',
    gap: Spacing.lg,
    paddingTop: Spacing.sm,
  },
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
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