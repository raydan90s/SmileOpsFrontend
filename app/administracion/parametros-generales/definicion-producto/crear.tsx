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
import { FileText, Save, ChevronDown, Check, Calendar } from 'lucide-react-native';

import BackButton from '@components/shared/BackButton';
import SuccessModal from '@components/shared/SuccessModal';
import LoadingSpinner from '@components/shared/LoadingSpinner';

import { getAllProductosNombre } from '@services/ProductoNombre/ProductoNombre.service';
import { getCaracteristicasActivas } from '@services/Caracteristicas/caracteristicas.service';
import { getMarcasActivas } from '@services/Marcas/marcas.service';
import { getUnidadesActivas } from '@services/unidadMedidas/unidadMedidas.service';
import {
  getNextCodigoProducto,
  crearInventarioProducto,
} from '@services/InventarioProductos/inventarioProductos.service';

import type { ProductoNombre } from '@models/ProductoNombre/ProductoNombre.types';
import type { Caracteristica } from '@models/Caracteristicas/caracteristicas.types';
import type { Marca } from '@models/Marca/marcas.type';
import type { Unidad } from '@models/UnidadMedidas/unidadMedidas.types';

import Theme from '@constants/theme';

export default function FormularioDefinicionProducto() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    clasificacionId: string;
    clasificacionDesc: string;
    subclasificacionId: string;
    subclasificacionCodigo: string;
    subclasificacionDesc: string;
  }>();

  const [formData, setFormData] = useState({
    codigo: '',
    iid_nombre: '',
    iid_caracteristica: '',
    iid_marca: '',
    estado: true,
    esDeConteo: false,
    unidadCompra: '',
    unidadConsumo: '',
    cantMinimaStock: '0',
    fechaCreacion: new Date().toISOString().split('T')[0],
  });

  const [nombres, setNombres] = useState<ProductoNombre[]>([]);
  const [caracteristicas, setCaracteristicas] = useState<Caracteristica[]>([]);
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [unidades, setUnidades] = useState<Unidad[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingCodigo, setLoadingCodigo] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [showNombreModal, setShowNombreModal] = useState(false);
  const [showCaracteristicaModal, setShowCaracteristicaModal] = useState(false);
  const [showMarcaModal, setShowMarcaModal] = useState(false);
  const [showUnidadCompraModal, setShowUnidadCompraModal] = useState(false);
  const [showUnidadConsumoModal, setShowUnidadConsumoModal] = useState(false);
  const [showFechaModal, setShowFechaModal] = useState(false);
  
  const [modalExito, setModalExito] = useState({
    visible: false,
    mensaje: '',
    titulo: '',
  });

  useEffect(() => {
    cargarDatosIniciales();
    cargarCodigoAutomatico();
  }, [params.subclasificacionId]);

  const cargarDatosIniciales = async () => {
    try {
      setLoading(true);
      const [nombresData, caracteristicasData, marcasData, unidadesData] =
        await Promise.all([
          getAllProductosNombre(),
          getCaracteristicasActivas(),
          getMarcasActivas(),
          getUnidadesActivas(),
        ]);

      setNombres(nombresData);
      setCaracteristicas(caracteristicasData);
      setMarcas(marcasData);
      setUnidades(unidadesData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      Alert.alert('Error', 'No se pudieron cargar los datos del formulario');
    } finally {
      setLoading(false);
    }
  };

  const cargarCodigoAutomatico = async () => {
    try {
      setLoadingCodigo(true);
      const nuevoCodigo = await getNextCodigoProducto(
        Number(params.subclasificacionId)
      );
      setFormData((prev) => ({
        ...prev,
        codigo: nuevoCodigo,
      }));
    } catch (error) {
      console.error('Error al generar código:', error);
      Alert.alert('Error', 'No se pudo generar el código del producto');
    } finally {
      setLoadingCodigo(false);
    }
  };

  const handleChange = (name: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectNombre = (id: string) => {
    handleChange('iid_nombre', id);
    setShowNombreModal(false);
  };

  const handleSelectCaracteristica = (id: string) => {
    handleChange('iid_caracteristica', id);
    setShowCaracteristicaModal(false);
  };

  const handleSelectMarca = (id: string) => {
    handleChange('iid_marca', id);
    setShowMarcaModal(false);
  };

  const handleSelectUnidadCompra = (id: string) => {
    handleChange('unidadCompra', id);
    setShowUnidadCompraModal(false);
  };

  const handleSelectUnidadConsumo = (id: string) => {
    handleChange('unidadConsumo', id);
    setShowUnidadConsumoModal(false);
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
        iid_subclasificacion: Number(params.subclasificacionId),
        iid_nombre: Number(formData.iid_nombre),
        iid_caracteristica: Number(formData.iid_caracteristica),
        iid_marca: Number(formData.iid_marca),
        unidad_compra: Number(formData.unidadCompra),
        unidad_consumo: Number(formData.unidadConsumo),
        cantidad_minima: parseFloat(formData.cantMinimaStock) || 0,
        estado: formData.estado,
        es_de_conteo: formData.esDeConteo,
      };

      await crearInventarioProducto(productoData);
      setModalExito({
        visible: true,
        titulo: '¡Éxito!',
        mensaje: 'Producto creado exitosamente',
      });
    } catch (error: any) {
      console.error('Error al guardar producto:', error);
      Alert.alert('Error', error.message || 'No se pudo guardar el producto');
    } finally {
      setSaving(false);
    }
  };

  const handleModalClose = () => {
    setModalExito({ visible: false, mensaje: '', titulo: '' });
    router.back();
  };

  const nombreSeleccionado = nombres.find(n => n.iid_nombre.toString() === formData.iid_nombre);
  const caracteristicaSeleccionada = caracteristicas.find(c => c.iid_caracteristica.toString() === formData.iid_caracteristica);
  const marcaSeleccionada = marcas.find(m => m.iid_marca.toString() === formData.iid_marca);
  const unidadCompraSeleccionada = unidades.find(u => u.iidunidad.toString() === formData.unidadCompra);
  const unidadConsumoSeleccionada = unidades.find(u => u.iidunidad.toString() === formData.unidadConsumo);

  if (loading) {
    return <LoadingSpinner message="Cargando formulario..." />;
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
              <FileText size={24} color={Theme.colors.textInverse} />
            </View>
            <View style={styles.headerText}>
              <Text style={styles.title}>Definición del Producto</Text>
              <Text style={styles.subtitle}>Complete los datos del producto</Text>
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
                <ActivityIndicator size="small" color={Theme.colors.textInverse} />
              ) : (
                <>
                  <Save size={20} color={Theme.colors.textInverse} />
                  <Text style={styles.saveButtonText}>Guardar</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.formGrid}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Clasificación</Text>
              <View style={styles.inputDisabled}>
                <Text style={styles.inputDisabledText}>
                  {Number(params.clasificacionId).toString().padStart(2, '0')}{' '}
                  {params.clasificacionDesc}
                </Text>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Sub Clasificación</Text>
              <View style={styles.inputDisabled}>
                <Text style={styles.inputDisabledText}>
                  {params.subclasificacionCodigo} {params.subclasificacionDesc}
                </Text>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Código{' '}
                {loadingCodigo && (
                  <Text style={styles.labelSmall}>(Generando...)</Text>
                )}
              </Text>
              <View style={[styles.inputDisabled, styles.inputCode]}>
                <Text style={styles.inputCodeText}>{formData.codigo}</Text>
              </View>
            </View>

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
                  !nombreSeleccionado && styles.selectButtonPlaceholder
                ]}>
                  {nombreSeleccionado?.vnombre_producto || 'Seleccione un nombre'}
                </Text>
                <ChevronDown size={20} color={Theme.colors.placeholder} />
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Característica <Text style={styles.required}>*</Text>
              </Text>
              <TouchableOpacity
                style={styles.selectButton}
                onPress={() => setShowCaracteristicaModal(true)}
                disabled={saving}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.selectButtonText,
                  !caracteristicaSeleccionada && styles.selectButtonPlaceholder
                ]}>
                  {caracteristicaSeleccionada?.vnombre_caracteristica || 'Seleccione'}
                </Text>
                <ChevronDown size={20} color={Theme.colors.placeholder} />
              </TouchableOpacity>
            </View>

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
                  !marcaSeleccionada && styles.selectButtonPlaceholder
                ]}>
                  {marcaSeleccionada?.vnombre_marca || 'Seleccione'}
                </Text>
                <ChevronDown size={20} color={Theme.colors.placeholder} />
              </TouchableOpacity>
            </View>

            <View style={styles.checkboxGroup}>
              <View style={styles.checkboxItem}>
                <Text style={styles.label}>Estado</Text>
                <Switch
                  value={formData.estado}
                  onValueChange={(value) => handleChange('estado', value)}
                  trackColor={{ false: Theme.colors.border, true: Theme.colors.primary }}
                  thumbColor={Theme.colors.surface}
                  disabled={saving}
                />
              </View>
              <View style={styles.checkboxItem}>
                <Text style={styles.label}>Es de Conteo</Text>
                <Switch
                  value={formData.esDeConteo}
                  onValueChange={(value) => handleChange('esDeConteo', value)}
                  trackColor={{ false: Theme.colors.border, true: Theme.colors.primary }}
                  thumbColor={Theme.colors.surface}
                  disabled={saving}
                />
              </View>
            </View>

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
                  !unidadCompraSeleccionada && styles.selectButtonPlaceholder
                ]}>
                  {unidadCompraSeleccionada 
                    ? `${unidadCompraSeleccionada.vnombreunidad}${unidadCompraSeleccionada.vabreviatura ? ` (${unidadCompraSeleccionada.vabreviatura})` : ''}`
                    : 'Seleccione'}
                </Text>
                <ChevronDown size={20} color={Theme.colors.placeholder} />
              </TouchableOpacity>
            </View>

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
                  !unidadConsumoSeleccionada && styles.selectButtonPlaceholder
                ]}>
                  {unidadConsumoSeleccionada 
                    ? `${unidadConsumoSeleccionada.vnombreunidad}${unidadConsumoSeleccionada.vabreviatura ? ` (${unidadConsumoSeleccionada.vabreviatura})` : ''}`
                    : 'Seleccione'}
                </Text>
                <ChevronDown size={20} color={Theme.colors.placeholder} />
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
                placeholderTextColor={Theme.colors.placeholder}
                editable={!saving}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Fecha de Creación</Text>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowFechaModal(true)}
                disabled={saving}
                activeOpacity={0.7}
              >
                <Calendar size={20} color={Theme.colors.textLight} />
                <Text style={styles.dateButtonText}>
                  {formData.fechaCreacion}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

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
                    onPress={() => handleSelectNombre(item.iid_nombre.toString())}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.modalItemText}>{item.vnombre_producto}</Text>
                    {formData.iid_nombre === item.iid_nombre.toString() && (
                      <Check size={20} color={Theme.colors.primary} />
                    )}
                  </TouchableOpacity>
                )}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
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
                <Text style={styles.modalTitle}>Seleccionar Característica</Text>
              </View>
              <FlatList
                data={caracteristicas}
                keyExtractor={(item) => item.iid_caracteristica.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.modalItem}
                    onPress={() => handleSelectCaracteristica(item.iid_caracteristica.toString())}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.modalItemText}>{item.vnombre_caracteristica}</Text>
                    {formData.iid_caracteristica === item.iid_caracteristica.toString() && (
                      <Check size={20} color={Theme.colors.primary} />
                    )}
                  </TouchableOpacity>
                )}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
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
                    onPress={() => handleSelectMarca(item.iid_marca.toString())}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.modalItemText}>{item.vnombre_marca}</Text>
                    {formData.iid_marca === item.iid_marca.toString() && (
                      <Check size={20} color={Theme.colors.primary} />
                    )}
                  </TouchableOpacity>
                )}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
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
                    onPress={() => handleSelectUnidadCompra(item.iidunidad.toString())}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.modalItemText}>
                      {item.vnombreunidad}{item.vabreviatura ? ` (${item.vabreviatura})` : ''}
                    </Text>
                    {formData.unidadCompra === item.iidunidad.toString() && (
                      <Check size={20} color={Theme.colors.primary} />
                    )}
                  </TouchableOpacity>
                )}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
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
                    onPress={() => handleSelectUnidadConsumo(item.iidunidad.toString())}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.modalItemText}>
                      {item.vnombreunidad}{item.vabreviatura ? ` (${item.vabreviatura})` : ''}
                    </Text>
                    {formData.unidadConsumo === item.iidunidad.toString() && (
                      <Check size={20} color={Theme.colors.primary} />
                    )}
                  </TouchableOpacity>
                )}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
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

      <Modal
        visible={showFechaModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowFechaModal(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setShowFechaModal(false)}>
          <Pressable onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Fecha de Creación</Text>
              </View>
              <View style={styles.fechaContent}>
                <Text style={styles.fechaText}>
                  La fecha de creación se establece automáticamente al momento de guardar el producto.
                </Text>
                <View style={styles.fechaDisplay}>
                  <Calendar size={24} color={Theme.colors.primary} />
                  <Text style={styles.fechaDisplayText}>{formData.fechaCreacion}</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setShowFechaModal(false)}
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
    backgroundColor: Theme.colors.background,
  },
  header: {
    padding: Theme.spacing.md,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: Theme.spacing.md,
    paddingBottom: Theme.spacing.xxl,
  },
  pageHeaderContainer: {
    marginBottom: Theme.spacing.md,
  },
  pageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.surface,
    padding: Theme.spacing.md,
    borderRadius: Theme.borderRadius.lg,
    gap: Theme.spacing.sm,
  },
  iconContainer: {
    backgroundColor: Theme.colors.primary,
    padding: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.md,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: Theme.fontSizes.xl,
    fontWeight: Theme.fontWeights.bold,
    color: Theme.colors.text,
  },
  subtitle: {
    fontSize: Theme.fontSizes.sm,
    color: Theme.colors.secondary,
    marginTop: 2,
  },
  card: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.md,
    gap: Theme.spacing.md,
  },
  topActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: Theme.spacing.sm,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.primary, 
    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.md,
    gap: Theme.spacing.xs,
  },
  saveButtonText: {
    color: Theme.colors.textInverse,
    fontSize: Theme.fontSizes.md,
    fontWeight: Theme.fontWeights.semibold,
  },
  buttonDisabled: {
    opacity: Theme.opacity.disabled,
  },
  formGrid: {
    gap: Theme.spacing.md,
  },
  inputGroup: {
    gap: Theme.spacing.xs,
  },
  label: {
    fontSize: Theme.fontSizes.sm,
    fontWeight: Theme.fontWeights.semibold,
    color: Theme.colors.text,
  },
  labelSmall: {
    fontSize: Theme.fontSizes.xs,
    color: Theme.colors.secondary,
    fontWeight: Theme.fontWeights.regular,
  },
  required: {
    color: Theme.colors.error,
  },
  input: {
    backgroundColor: Theme.colors.surface,
    borderWidth: 2,
    borderColor: Theme.colors.border,
    borderRadius: Theme.borderRadius.md,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    fontSize: Theme.fontSizes.md,
    color: Theme.colors.text,
  },
  inputDisabled: {
    backgroundColor: Theme.colors.backgroundLight,
    borderWidth: 2,
    borderColor: Theme.colors.border,
    borderRadius: Theme.borderRadius.md,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
  },
  inputDisabledText: {
    fontSize: Theme.fontSizes.md,
    color: Theme.colors.textLight,
  },
  inputCode: {
    backgroundColor: Theme.colors.backgroundLight,
  },
  inputCodeText: {
    fontSize: Theme.fontSizes.md,
    color: Theme.colors.textLight,
    fontFamily: 'monospace',
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Theme.colors.surface,
    borderWidth: 2,
    borderColor: Theme.colors.border,
    borderRadius: Theme.borderRadius.md,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
  },
  selectButtonText: {
    fontSize: Theme.fontSizes.md,
    color: Theme.colors.text,
    flex: 1,
  },
  selectButtonPlaceholder: {
    color: Theme.colors.placeholder,
  },
  checkboxGroup: {
    flexDirection: 'row',
    gap: Theme.spacing.lg,
    paddingTop: Theme.spacing.sm,
  },
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.sm,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.sm,
    backgroundColor: Theme.colors.backgroundLight,
    borderWidth: 2,
    borderColor: Theme.colors.border,
    borderRadius: Theme.borderRadius.md,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
  },
  dateButtonText: {
    fontSize: Theme.fontSizes.md,
    color: Theme.colors.textLight,
    fontFamily: 'monospace',
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
  fechaContent: {
    padding: Theme.spacing.lg,
    gap: Theme.spacing.md,
  },
  fechaText: {
    fontSize: Theme.fontSizes.sm,
    color: Theme.colors.textLight,
    textAlign: 'center',
  },
  fechaDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Theme.spacing.sm,
    backgroundColor: Theme.colors.backgroundLight,
    padding: Theme.spacing.md,
    borderRadius: Theme.borderRadius.md,
  },
  fechaDisplayText: {
    fontSize: Theme.fontSizes.lg,
    fontWeight: Theme.fontWeights.semibold,
    color: Theme.colors.text,
    fontFamily: 'monospace',
  },
});