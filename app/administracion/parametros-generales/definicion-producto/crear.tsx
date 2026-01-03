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
import { useRouter } from 'expo-router';
import { FileText, Save, ChevronDown, Check, Calendar, Layers } from 'lucide-react-native';

import BackButton from '@components/shared/BackButton';
import SuccessModal from '@components/shared/SuccessModal';
import LoadingSpinner from '@components/shared/LoadingSpinner';

import { getAllProductosNombre } from '@services/ProductoNombre/ProductoNombre.service';
import { getCaracteristicasActivas } from '@services/Caracteristicas/caracteristicas.service';
import { getMarcasActivas } from '@services/Marcas/marcas.service';
import { getUnidadesActivas } from '@services/unidadMedidas/unidadMedidas.service';
import { getNextCodigoProducto, crearInventarioProducto } from '@services/InventarioProductos/inventarioProductos.service';
import { getClasificacionesActivas } from '@services/ClasificacionProducto/clasificacion.service';
import { getSubclasificacionesByClasificacion } from '@services/SubclasificacionProducto/subclasificacion.service';

import type { ProductoNombre } from '@models/ProductoNombre/ProductoNombre.types';
import type { Caracteristica } from '@models/Caracteristicas/caracteristicas.types';
import type { Marca } from '@models/Marca/marcas.type';
import type { Unidad } from '@models/UnidadMedidas/unidadMedidas.types';
import type { Clasificacion } from '@models/ClasificacionProducto/Clasificacion.types';
import type { Subclasificacion } from '@models/SubclasificacionProducto/Subclasificacion.types';

import Theme from '@constants/theme';

export default function FormularioDefinicionProducto() {
  const router = useRouter();

  const [clasificaciones, setClasificaciones] = useState<Clasificacion[]>([]);
  const [subclasificaciones, setSubclasificaciones] = useState<Subclasificacion[]>([]);
  const [selectedClasificacion, setSelectedClasificacion] = useState<Clasificacion | null>(null);
  const [selectedSubclasificacion, setSelectedSubclasificacion] = useState<Subclasificacion | null>(null);

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
  const [loadingSubclasificaciones, setLoadingSubclasificaciones] = useState(false);
  const [loadingCodigo, setLoadingCodigo] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [showClasificacionModal, setShowClasificacionModal] = useState(false);
  const [showSubclasificacionModal, setShowSubclasificacionModal] = useState(false);
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
  }, []);

  const cargarDatosIniciales = async () => {
    try {
      setLoading(true);
      const [nombresData, caracteristicasData, marcasData, unidadesData, clasificacionesData] =
        await Promise.all([
          getAllProductosNombre(),
          getCaracteristicasActivas(),
          getMarcasActivas(),
          getUnidadesActivas(),
          getClasificacionesActivas(),
        ]);

      setNombres(nombresData);
      setCaracteristicas(caracteristicasData);
      setMarcas(marcasData);
      setUnidades(unidadesData);
      setClasificaciones(clasificacionesData.sort((a, b) => a.iid_clasificacion - b.iid_clasificacion));
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los catálogos');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectClasificacion = async (clasificacion: Clasificacion) => {
    setSelectedClasificacion(clasificacion);
    setSelectedSubclasificacion(null);
    setFormData(prev => ({ ...prev, codigo: '' })); 
    setSubclasificaciones([]);
    setShowClasificacionModal(false);

    try {
      setLoadingSubclasificaciones(true);
      const subs = await getSubclasificacionesByClasificacion(clasificacion.iid_clasificacion);
      setSubclasificaciones(subs);
    } catch (error) {
      Alert.alert('Error', 'Error al cargar subclasificaciones');
    } finally {
      setLoadingSubclasificaciones(false);
    }
  };

  const handleSelectSubclasificacion = async (sub: Subclasificacion) => {
    setSelectedSubclasificacion(sub);
    setShowSubclasificacionModal(false);
    
    try {
      setLoadingCodigo(true);
      const nuevoCodigo = await getNextCodigoProducto(sub.iid_subclasificacion);
      setFormData(prev => ({ ...prev, codigo: nuevoCodigo }));
    } catch (error) {
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

  const handleSelectNombre = (id: string) => { handleChange('iid_nombre', id); setShowNombreModal(false); };
  const handleSelectCaracteristica = (id: string) => { handleChange('iid_caracteristica', id); setShowCaracteristicaModal(false); };
  const handleSelectMarca = (id: string) => { handleChange('iid_marca', id); setShowMarcaModal(false); };
  const handleSelectUnidadCompra = (id: string) => { handleChange('unidadCompra', id); setShowUnidadCompraModal(false); };
  const handleSelectUnidadConsumo = (id: string) => { handleChange('unidadConsumo', id); setShowUnidadConsumoModal(false); };

  const handleSubmit = async () => {
    if (!selectedSubclasificacion) { Alert.alert('Error', 'Debe seleccionar una subclasificación'); return; }
    if (!formData.iid_nombre) { Alert.alert('Error', 'El nombre del producto es requerido'); return; }
    if (!formData.iid_caracteristica) { Alert.alert('Error', 'La característica es requerida'); return; }
    if (!formData.iid_marca) { Alert.alert('Error', 'La marca es requerida'); return; }
    if (!formData.unidadCompra) { Alert.alert('Error', 'La unidad de compra es requerida'); return; }
    if (!formData.unidadConsumo) { Alert.alert('Error', 'La unidad de consumo es requerida'); return; }

    try {
      setSaving(true);
      const productoData = {
        codigo_producto: formData.codigo,
        iid_subclasificacion: selectedSubclasificacion.iid_subclasificacion,
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
    return <LoadingSpinner message="Cargando catálogos..." />;
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
              <Text style={styles.title}>Nuevo Producto</Text>
              <Text style={styles.subtitle}>Defina la jerarquía y detalles del producto</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          
          <View style={styles.sectionHeader}>
            <Layers size={18} color={Theme.colors.primary} />
            <Text style={styles.sectionTitle}>JERARQUÍA DEL PRODUCTO</Text>
          </View>

          <View style={styles.formGrid}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Clasificación <Text style={styles.required}>*</Text></Text>
              <TouchableOpacity
                style={styles.selectButton}
                onPress={() => setShowClasificacionModal(true)}
                activeOpacity={0.7}
              >
                <Text style={[styles.selectButtonText, !selectedClasificacion && styles.selectButtonPlaceholder]}>
                  {selectedClasificacion 
                    ? `${selectedClasificacion.iid_clasificacion.toString().padStart(2, '0')} - ${selectedClasificacion.v_descripcion}`
                    : 'Seleccione Clasificación'}
                </Text>
                <ChevronDown size={20} color={Theme.colors.placeholder} />
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Sub Clasificación <Text style={styles.required}>*</Text></Text>
              <TouchableOpacity
                style={[
                    styles.selectButton, 
                    (!selectedClasificacion || loadingSubclasificaciones) && styles.selectButtonDisabled
                ]}
                onPress={() => selectedClasificacion && !loadingSubclasificaciones && setShowSubclasificacionModal(true)}
                disabled={!selectedClasificacion || loadingSubclasificaciones}
                activeOpacity={0.7}
              >
                <Text style={[styles.selectButtonText, !selectedSubclasificacion && styles.selectButtonPlaceholder]}>
                  {loadingSubclasificaciones ? 'Cargando...' : 
                    selectedSubclasificacion
                      ? `${selectedSubclasificacion.v_codigo} - ${selectedSubclasificacion.v_descripcion}`
                      : 'Seleccione Subclasificación'}
                </Text>
                <ChevronDown size={20} color={Theme.colors.placeholder} />
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Código {loadingCodigo && <Text style={styles.labelSmall}>(Generando...)</Text>}
              </Text>
              <View style={[styles.inputDisabled, styles.inputCode]}>
                <Text style={styles.inputCodeText}>{formData.codigo || '---'}</Text>
              </View>
            </View>
          </View>

          <View style={styles.separator} />

          {selectedSubclasificacion ? (
            <>
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
                      <Text style={styles.saveButtonText}>Guardar Producto</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>

              <View style={styles.formGrid}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Nombre <Text style={styles.required}>*</Text></Text>
                  <TouchableOpacity
                    style={styles.selectButton}
                    onPress={() => setShowNombreModal(true)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.selectButtonText, !nombreSeleccionado && styles.selectButtonPlaceholder]}>
                      {nombreSeleccionado?.vnombre_producto || 'Seleccione un nombre'}
                    </Text>
                    <ChevronDown size={20} color={Theme.colors.placeholder} />
                  </TouchableOpacity>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Característica <Text style={styles.required}>*</Text></Text>
                  <TouchableOpacity
                    style={styles.selectButton}
                    onPress={() => setShowCaracteristicaModal(true)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.selectButtonText, !caracteristicaSeleccionada && styles.selectButtonPlaceholder]}>
                      {caracteristicaSeleccionada?.vnombre_caracteristica || 'Seleccione'}
                    </Text>
                    <ChevronDown size={20} color={Theme.colors.placeholder} />
                  </TouchableOpacity>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Marca <Text style={styles.required}>*</Text></Text>
                  <TouchableOpacity
                    style={styles.selectButton}
                    onPress={() => setShowMarcaModal(true)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.selectButtonText, !marcaSeleccionada && styles.selectButtonPlaceholder]}>
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
                    />
                  </View>
                  <View style={styles.checkboxItem}>
                    <Text style={styles.label}>Es de Conteo</Text>
                    <Switch
                      value={formData.esDeConteo}
                      onValueChange={(value) => handleChange('esDeConteo', value)}
                      trackColor={{ false: Theme.colors.border, true: Theme.colors.primary }}
                      thumbColor={Theme.colors.surface}
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Unidad de Compra <Text style={styles.required}>*</Text></Text>
                  <TouchableOpacity
                    style={styles.selectButton}
                    onPress={() => setShowUnidadCompraModal(true)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.selectButtonText, !unidadCompraSeleccionada && styles.selectButtonPlaceholder]}>
                      {unidadCompraSeleccionada 
                        ? `${unidadCompraSeleccionada.vnombreunidad}${unidadCompraSeleccionada.vabreviatura ? ` (${unidadCompraSeleccionada.vabreviatura})` : ''}`
                        : 'Seleccione'}
                    </Text>
                    <ChevronDown size={20} color={Theme.colors.placeholder} />
                  </TouchableOpacity>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Unidad de Consumo <Text style={styles.required}>*</Text></Text>
                  <TouchableOpacity
                    style={styles.selectButton}
                    onPress={() => setShowUnidadConsumoModal(true)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.selectButtonText, !unidadConsumoSeleccionada && styles.selectButtonPlaceholder]}>
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
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Fecha de Creación</Text>
                  <TouchableOpacity
                    style={styles.dateButton}
                    onPress={() => setShowFechaModal(true)}
                    activeOpacity={0.7}
                  >
                    <Calendar size={20} color={Theme.colors.textLight} />
                    <Text style={styles.dateButtonText}>{formData.fechaCreacion}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                Seleccione una Clasificación y Subclasificación para continuar.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      <SelectionModal
        visible={showClasificacionModal}
        title="Seleccionar Clasificación"
        data={clasificaciones}
        keyExtractor={(item: any) => item.iid_clasificacion.toString()}
        renderItem={(item: any) => (
          <Text style={styles.modalItemText}>
            {item.iid_clasificacion.toString().padStart(2, '0')} - {item.v_descripcion}
          </Text>
        )}
        onSelect={handleSelectClasificacion}
        onClose={() => setShowClasificacionModal(false)}
        selectedId={selectedClasificacion?.iid_clasificacion}
        idKey="iid_clasificacion"
      />

      <SelectionModal
        visible={showSubclasificacionModal}
        title="Seleccionar Subclasificación"
        data={subclasificaciones}
        keyExtractor={(item: any) => item.iid_subclasificacion.toString()}
        renderItem={(item: any) => (
          <Text style={styles.modalItemText}>
            {item.v_codigo} - {item.v_descripcion}
          </Text>
        )}
        onSelect={handleSelectSubclasificacion}
        onClose={() => setShowSubclasificacionModal(false)}
        selectedId={selectedSubclasificacion?.iid_subclasificacion}
        idKey="iid_subclasificacion"
        emptyMessage="No hay subclasificaciones disponibles"
      />

      <SelectionModal
        visible={showNombreModal}
        title="Seleccionar Nombre"
        data={nombres}
        keyExtractor={(item: any) => item.iid_nombre.toString()}
        renderItem={(item: any) => <Text style={styles.modalItemText}>{item.vnombre_producto}</Text>}
        onSelect={(item: any) => handleSelectNombre(item.iid_nombre.toString())}
        onClose={() => setShowNombreModal(false)}
        selectedId={Number(formData.iid_nombre)}
        idKey="iid_nombre"
      />

      <SelectionModal
        visible={showCaracteristicaModal}
        title="Seleccionar Característica"
        data={caracteristicas}
        keyExtractor={(item: any) => item.iid_caracteristica.toString()}
        renderItem={(item: any) => <Text style={styles.modalItemText}>{item.vnombre_caracteristica}</Text>}
        onSelect={(item: any) => handleSelectCaracteristica(item.iid_caracteristica.toString())}
        onClose={() => setShowCaracteristicaModal(false)}
        selectedId={Number(formData.iid_caracteristica)}
        idKey="iid_caracteristica"
      />

      <SelectionModal
        visible={showMarcaModal}
        title="Seleccionar Marca"
        data={marcas}
        keyExtractor={(item: any) => item.iid_marca.toString()}
        renderItem={(item: any) => <Text style={styles.modalItemText}>{item.vnombre_marca}</Text>}
        onSelect={(item: any) => handleSelectMarca(item.iid_marca.toString())}
        onClose={() => setShowMarcaModal(false)}
        selectedId={Number(formData.iid_marca)}
        idKey="iid_marca"
      />

      <SelectionModal
        visible={showUnidadCompraModal}
        title="Unidad de Compra"
        data={unidades}
        keyExtractor={(item: any) => item.iidunidad.toString()}
        renderItem={(item: any) => <Text style={styles.modalItemText}>{item.vnombreunidad}</Text>}
        onSelect={(item: any) => handleSelectUnidadCompra(item.iidunidad.toString())}
        onClose={() => setShowUnidadCompraModal(false)}
        selectedId={Number(formData.unidadCompra)}
        idKey="iidunidad"
      />

       <SelectionModal
        visible={showUnidadConsumoModal}
        title="Unidad de Consumo"
        data={unidades}
        keyExtractor={(item: any) => item.iidunidad.toString()}
        renderItem={(item: any) => <Text style={styles.modalItemText}>{item.vnombreunidad}</Text>}
        onSelect={(item: any) => handleSelectUnidadConsumo(item.iidunidad.toString())}
        onClose={() => setShowUnidadConsumoModal(false)}
        selectedId={Number(formData.unidadConsumo)}
        idKey="iidunidad"
      />

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
              <View style={{ padding: 20, alignItems: 'center', gap: 10 }}>
                <Text style={{ color: Theme.colors.text }}>La fecha se establece automáticamente.</Text>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: Theme.colors.primary }}>
                  {formData.fechaCreacion}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setShowFechaModal(false)}
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

const SelectionModal = ({ visible, title, data, keyExtractor, renderItem, onSelect, onClose, selectedId, idKey, emptyMessage = 'No hay datos' }: any) => (
  <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
    <Pressable style={styles.modalOverlay} onPress={onClose}>
      <Pressable onPress={(e) => e.stopPropagation()}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
          </View>
          <FlatList
            data={data}
            keyExtractor={keyExtractor}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.modalItem}
                onPress={() => onSelect(item)}
              >
                {renderItem(item)}
                {selectedId === item[idKey] && <Check size={20} color={Theme.colors.primary} />}
              </TouchableOpacity>
            )}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            ListEmptyComponent={<View style={{ padding: 20, alignItems: 'center' }}><Text style={{ color: Theme.colors.placeholder }}>{emptyMessage}</Text></View>}
            style={styles.modalList}
          />
          <TouchableOpacity style={styles.modalCloseButton} onPress={onClose}>
            <Text style={styles.modalCloseButtonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    </Pressable>
  </Modal>
);

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Theme.colors.background },
  header: {
      padding: Theme.spacing.md,
    },
  container: { flex: 1 },
  scrollContent: { padding: Theme.spacing.md, paddingBottom: Theme.spacing.xxl },
  pageHeaderContainer: { marginBottom: Theme.spacing.md },
  pageHeader: { flexDirection: 'row', alignItems: 'center', backgroundColor: Theme.colors.surface, padding: Theme.spacing.md, borderRadius: Theme.borderRadius.lg, gap: Theme.spacing.sm },
  iconContainer: { backgroundColor: Theme.colors.primary, padding: Theme.spacing.sm, borderRadius: Theme.borderRadius.md },
  headerText: { flex: 1 },
  title: { fontSize: Theme.fontSizes.xl, fontWeight: Theme.fontWeights.bold, color: Theme.colors.text },
  subtitle: { fontSize: Theme.fontSizes.sm, color: Theme.colors.secondary, marginTop: 2 },
  card: { backgroundColor: Theme.colors.surface, borderRadius: Theme.borderRadius.lg, padding: Theme.spacing.md, gap: Theme.spacing.md },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: Theme.spacing.sm, paddingBottom: Theme.spacing.xs, borderBottomWidth: 1, borderBottomColor: Theme.colors.border },
  sectionTitle: { fontSize: Theme.fontSizes.sm, fontWeight: Theme.fontWeights.bold, color: Theme.colors.primary, letterSpacing: 0.5 },
  topActions: { flexDirection: 'row', justifyContent: 'flex-end', marginBottom: Theme.spacing.sm },
  saveButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: Theme.colors.primary, paddingHorizontal: Theme.spacing.lg, paddingVertical: Theme.spacing.sm, borderRadius: Theme.borderRadius.md, gap: Theme.spacing.xs },
  saveButtonText: { color: Theme.colors.textInverse, fontSize: Theme.fontSizes.md, fontWeight: Theme.fontWeights.semibold },
  buttonDisabled: { opacity: Theme.opacity.disabled },
  formGrid: { gap: Theme.spacing.md },
  inputGroup: { gap: Theme.spacing.xs },
  label: { fontSize: Theme.fontSizes.sm, fontWeight: Theme.fontWeights.semibold, color: Theme.colors.text },
  labelSmall: { fontSize: Theme.fontSizes.xs, color: Theme.colors.secondary, fontWeight: Theme.fontWeights.regular },
  required: { color: Theme.colors.error },
  input: { backgroundColor: Theme.colors.surface, borderWidth: 2, borderColor: Theme.colors.border, borderRadius: Theme.borderRadius.md, paddingHorizontal: Theme.spacing.md, paddingVertical: Theme.spacing.sm, fontSize: Theme.fontSizes.md, color: Theme.colors.text },
  inputDisabled: { backgroundColor: Theme.colors.backgroundLight, borderWidth: 2, borderColor: Theme.colors.border, borderRadius: Theme.borderRadius.md, paddingHorizontal: Theme.spacing.md, paddingVertical: Theme.spacing.sm },
  inputCode: { backgroundColor: Theme.colors.backgroundLight },
  inputCodeText: { fontSize: Theme.fontSizes.md, color: Theme.colors.textLight, fontFamily: 'monospace' },
  selectButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: Theme.colors.surface, borderWidth: 2, borderColor: Theme.colors.border, borderRadius: Theme.borderRadius.md, paddingHorizontal: Theme.spacing.md, paddingVertical: Theme.spacing.sm },
  selectButtonDisabled: { backgroundColor: Theme.colors.backgroundLight, opacity: 0.7 },
  selectButtonText: { fontSize: Theme.fontSizes.md, color: Theme.colors.text, flex: 1 },
  selectButtonPlaceholder: { color: Theme.colors.placeholder },
  checkboxGroup: { flexDirection: 'row', gap: Theme.spacing.lg, paddingTop: Theme.spacing.sm },
  checkboxItem: { flexDirection: 'row', alignItems: 'center', gap: Theme.spacing.sm },
  dateButton: { flexDirection: 'row', alignItems: 'center', gap: Theme.spacing.sm, backgroundColor: Theme.colors.backgroundLight, borderWidth: 2, borderColor: Theme.colors.border, borderRadius: Theme.borderRadius.md, paddingHorizontal: Theme.spacing.md, paddingVertical: Theme.spacing.sm },
  dateButtonText: { fontSize: Theme.fontSizes.md, color: Theme.colors.textLight, fontFamily: 'monospace' },
  separator: { height: 1, backgroundColor: Theme.colors.border, marginVertical: Theme.spacing.xs },
  emptyState: { padding: Theme.spacing.xl, alignItems: 'center', justifyContent: 'center' },
  emptyStateText: { color: Theme.colors.placeholder, textAlign: 'center' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center', padding: Theme.spacing.md },
  modalContent: { backgroundColor: Theme.colors.surface, borderRadius: Theme.borderRadius.lg, width: '100%', maxWidth: 400, maxHeight: '70%', overflow: 'hidden', ...Theme.shadows.xl },
  modalHeader: { padding: Theme.spacing.lg, borderBottomWidth: 1, borderBottomColor: Theme.colors.border },
  modalTitle: { fontSize: Theme.fontSizes.lg, fontWeight: Theme.fontWeights.bold, color: Theme.colors.text },
  modalList: { maxHeight: 400 },
  modalItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: Theme.spacing.md },
  modalItemText: { fontSize: Theme.fontSizes.md, color: Theme.colors.text, flex: 1 },
  modalCloseButton: { backgroundColor: Theme.colors.primary, padding: Theme.spacing.md, alignItems: 'center', borderTopWidth: 1, borderTopColor: Theme.colors.border },
  modalCloseButtonText: { color: Theme.colors.textInverse, fontSize: Theme.fontSizes.md, fontWeight: Theme.fontWeights.semibold },
});