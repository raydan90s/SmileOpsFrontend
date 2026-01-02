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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import { FileText, Save } from 'lucide-react-native';

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
      console.error('Error al cargar datos:', error);
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
      console.error('Error al actualizar producto:', error);
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

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Nombre <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.iid_nombre}
                  onValueChange={(value) => handleChange('iid_nombre', value)}
                  style={styles.picker}
                  enabled={!saving}
                >
                  <Picker.Item label="Seleccione un nombre" value="" />
                  {nombres.map((nombre) => (
                    <Picker.Item
                      key={nombre.iid_nombre}
                      label={nombre.vnombre_producto}
                      value={nombre.iid_nombre.toString()}
                    />
                  ))}
                </Picker>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Nombre Comercial <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.iid_caracteristica}
                  onValueChange={(value) =>
                    handleChange('iid_caracteristica', value)
                  }
                  style={styles.picker}
                  enabled={!saving}
                >
                  <Picker.Item label="Seleccione" value="" />
                  {caracteristicas.map((caracteristica) => (
                    <Picker.Item
                      key={caracteristica.iid_caracteristica}
                      label={caracteristica.vnombre_caracteristica}
                      value={caracteristica.iid_caracteristica.toString()}
                    />
                  ))}
                </Picker>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Marca <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.iid_marca}
                  onValueChange={(value) => handleChange('iid_marca', value)}
                  style={styles.picker}
                  enabled={!saving}
                >
                  <Picker.Item label="Seleccione" value="" />
                  {marcas.map((marca) => (
                    <Picker.Item
                      key={marca.iid_marca}
                      label={marca.vnombre_marca}
                      value={marca.iid_marca.toString()}
                    />
                  ))}
                </Picker>
              </View>
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

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Unidad de Compra <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.unidadCompra}
                  onValueChange={(value) => handleChange('unidadCompra', value)}
                  style={styles.picker}
                  enabled={!saving}
                >
                  <Picker.Item label="Seleccione" value="" />
                  {unidades.map((unidad) => (
                    <Picker.Item
                      key={unidad.iidunidad}
                      label={`${unidad.vnombreunidad}${
                        unidad.vabreviatura ? ` (${unidad.vabreviatura})` : ''
                      }`}
                      value={unidad.iidunidad.toString()}
                    />
                  ))}
                </Picker>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Unidad de Consumo <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.unidadConsumo}
                  onValueChange={(value) => handleChange('unidadConsumo', value)}
                  style={styles.picker}
                  enabled={!saving}
                >
                  <Picker.Item label="Seleccione" value="" />
                  {unidades.map((unidad) => (
                    <Picker.Item
                      key={unidad.iidunidad}
                      label={`${unidad.vnombreunidad}${
                        unidad.vabreviatura ? ` (${unidad.vabreviatura})` : ''
                      }`}
                      value={unidad.iidunidad.toString()}
                    />
                  ))}
                </Picker>
              </View>
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
    color: Colors.textLight,
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
    backgroundColor: '#16A34A',
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
    color: Colors.textLight,
  },
  inputCode: {
    backgroundColor: Colors.backgroundLight,
  },
  inputCodeText: {
    fontSize: FontSizes.md,
    color: Colors.textLight,
    fontFamily: 'monospace',
  },
  pickerContainer: {
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
  },
  picker: {
    color: Colors.text,
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
});