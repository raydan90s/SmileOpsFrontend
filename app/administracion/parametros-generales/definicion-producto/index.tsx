import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  FlatList,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Layers, ChevronDown, Check } from 'lucide-react-native';

import ModuleHeader from '@components/shared/ModuleHeader';
import LoadingSpinner from '@components/shared/LoadingSpinner';

import { getClasificacionesActivas } from '@services/ClasificacionProducto/clasificacion.service';
import { getSubclasificacionesByClasificacion } from '@services/SubclasificacionProducto/subclasificacion.service';

import type { Clasificacion } from '@models/ClasificacionProducto/Clasificacion.types';
import type { Subclasificacion } from '@models/SubclasificacionProducto/Subclasificacion.types';

import Theme from '@constants/theme';
import BackButton from '@components/shared/BackButton';

export default function DefinicionProductoPage() {
  const router = useRouter();

  const [clasificaciones, setClasificaciones] = useState<Clasificacion[]>([]);
  const [subclasificaciones, setSubclasificaciones] = useState<Subclasificacion[]>([]);
  const [selectedClasificacion, setSelectedClasificacion] = useState<number | ''>('');
  const [selectedSubclasificacion, setSelectedSubclasificacion] = useState<number | ''>('');
  const [loading, setLoading] = useState(true);
  const [loadingSubclasificaciones, setLoadingSubclasificaciones] = useState(false);

  const [showClasificacionModal, setShowClasificacionModal] = useState(false);
  const [showSubclasificacionModal, setShowSubclasificacionModal] = useState(false);

  useEffect(() => {
    cargarClasificaciones();
  }, []);

  const cargarClasificaciones = async () => {
    try {
      setLoading(true);
      const data = await getClasificacionesActivas();
      setClasificaciones(
        data.sort((a, b) => a.iid_clasificacion - b.iid_clasificacion)
      );
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar las clasificaciones');
    } finally {
      setLoading(false);
    }
  };

  const cargarSubclasificaciones = async (idClasificacion: number) => {
    try {
      setLoadingSubclasificaciones(true);
      const data = await getSubclasificacionesByClasificacion(idClasificacion);
      setSubclasificaciones(data);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar las subclasificaciones');
      setSubclasificaciones([]);
    } finally {
      setLoadingSubclasificaciones(false);
    }
  };

  const handleClasificacionChange = (value: number | '') => {
    setSelectedClasificacion(value);
    setSelectedSubclasificacion('');
    setSubclasificaciones([]);
    setShowClasificacionModal(false);

    if (value !== '') {
      cargarSubclasificaciones(value);
    }
  };

  const handleSubclasificacionChange = (value: number | '') => {
    setSelectedSubclasificacion(value);
    setShowSubclasificacionModal(false);
  };

  const handleAgregarDefinicion = () => {
    if (!selectedClasificacion || !selectedSubclasificacion) {
      Alert.alert(
        'Información incompleta',
        'Por favor seleccione una clasificación y subclasificación primero'
      );
      return;
    }

    const clasificacionSeleccionada = clasificaciones.find(
      (c) => c.iid_clasificacion === selectedClasificacion
    );

    const subclasificacionSeleccionada = subclasificaciones.find(
      (s) => s.iid_subclasificacion === selectedSubclasificacion
    );

    router.push({
      pathname: '/administracion/parametros-generales/definicion-producto/crear',
      params: {
        clasificacionId: selectedClasificacion.toString(),
        clasificacionDesc: clasificacionSeleccionada?.v_descripcion || '',
        subclasificacionId: selectedSubclasificacion.toString(),
        subclasificacionCodigo: subclasificacionSeleccionada?.v_codigo || '',
        subclasificacionDesc: subclasificacionSeleccionada?.v_descripcion || '',
      },
    });
  };

  const clasificacionSeleccionada = clasificaciones.find(
    (c) => c.iid_clasificacion === selectedClasificacion
  );

  const subclasificacionSeleccionada = subclasificaciones.find(
    (s) => s.iid_subclasificacion === selectedSubclasificacion
  );

  if (loading) {
    return <LoadingSpinner message="Cargando datos..." />;
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
        <ModuleHeader
          icon={Layers}
          title="Consulta Clasificaciones de Productos"
          addButtonText="Nuevo"
          subtitle="Consulte y gestione las clasificaciones de productos"
          onAddClick={handleAgregarDefinicion}
        />

        <View style={styles.content}>
          <View style={styles.card}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Clasificación</Text>
              <TouchableOpacity
                style={styles.selectButton}
                onPress={() => setShowClasificacionModal(true)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.selectButtonText,
                    !clasificacionSeleccionada && styles.selectButtonPlaceholder,
                  ]}
                >
                  {clasificacionSeleccionada
                    ? `${clasificacionSeleccionada.iid_clasificacion
                      .toString()
                      .padStart(2, '0')} - ${clasificacionSeleccionada.v_descripcion}`
                    : 'Seleccione una clasificación'}
                </Text>
                <ChevronDown size={20} color={Theme.colors.placeholder} />
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Sub Clasificación</Text>
              <TouchableOpacity
                style={[
                  styles.selectButton,
                  (!selectedClasificacion || loadingSubclasificaciones) &&
                  styles.selectButtonDisabled,
                ]}
                onPress={() =>
                  selectedClasificacion &&
                  !loadingSubclasificaciones &&
                  setShowSubclasificacionModal(true)
                }
                disabled={!selectedClasificacion || loadingSubclasificaciones}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.selectButtonText,
                    !subclasificacionSeleccionada && styles.selectButtonPlaceholder,
                  ]}
                >
                  {loadingSubclasificaciones
                    ? 'Cargando...'
                    : subclasificacionSeleccionada
                      ? `${subclasificacionSeleccionada.v_codigo} - ${subclasificacionSeleccionada.v_descripcion}`
                      : selectedClasificacion
                        ? 'Seleccione una subclasificación'
                        : 'Primero seleccione una clasificación'}
                </Text>
                <ChevronDown size={20} color={Theme.colors.placeholder} />
              </TouchableOpacity>

              {loadingSubclasificaciones && (
                <ActivityIndicator
                  size="small"
                  color={Theme.colors.primary}
                  style={styles.loader}
                />
              )}
            </View>

            {selectedClasificacion &&
              subclasificaciones.length === 0 &&
              !loadingSubclasificaciones && (
                <View style={styles.warningBox}>
                  <Text style={styles.warningText}>
                    No hay subclasificaciones disponibles para esta clasificación.
                  </Text>
                </View>
              )}
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={showClasificacionModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowClasificacionModal(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowClasificacionModal(false)}
        >
          <Pressable onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Seleccionar Clasificación</Text>
              </View>

              <FlatList
                data={clasificaciones}
                keyExtractor={(item) => item.iid_clasificacion.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.modalItem}
                    onPress={() => handleClasificacionChange(item.iid_clasificacion)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.modalItemText}>
                      {item.iid_clasificacion.toString().padStart(2, '0')} -{' '}
                      {item.v_descripcion}
                    </Text>
                    {selectedClasificacion === item.iid_clasificacion && (
                      <Check size={20} color={Theme.colors.primary} />
                    )}
                  </TouchableOpacity>
                )}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                style={styles.modalList} 
              />

              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setShowClasificacionModal(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.modalCloseButtonText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      <Modal
        visible={showSubclasificacionModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSubclasificacionModal(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowSubclasificacionModal(false)}
        >
          <Pressable onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Seleccionar Subclasificación</Text>
              </View>

              <FlatList
                data={subclasificaciones}
                keyExtractor={(item) => item.iid_subclasificacion.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.modalItem}
                    onPress={() =>
                      handleSubclasificacionChange(item.iid_subclasificacion)
                    }
                    activeOpacity={0.7}
                  >
                    <Text style={styles.modalItemText}>
                      {item.v_codigo} - {item.v_descripcion}
                    </Text>
                    {selectedSubclasificacion === item.iid_subclasificacion && (
                      <Check size={20} color={Theme.colors.primary} />
                    )}
                  </TouchableOpacity>
                )}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                ListEmptyComponent={
                  <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>
                      No hay subclasificaciones disponibles
                    </Text>
                  </View>
                }
                style={styles.modalList}
              />

              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setShowSubclasificacionModal(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.modalCloseButtonText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Theme.spacing.xxl,
  },
  content: {
    padding: Theme.spacing.md,
  },
  card: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.lg,
    gap: Theme.spacing.lg,
  },
  inputGroup: {
    gap: Theme.spacing.xs,
  },
  label: {
    fontSize: Theme.fontSizes.sm,
    fontWeight: Theme.fontWeights.semibold,
    color: Theme.colors.text,
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
  loader: {
    marginTop: Theme.spacing.xs,
  },
  header: {
    padding: Theme.spacing.md,
  },
  infoBox: {
    marginTop: Theme.spacing.sm,
    padding: Theme.spacing.md,
    backgroundColor: Theme.colors.backgroundLight,
    borderRadius: Theme.borderRadius.md,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    gap: Theme.spacing.xs,
  },
  infoText: {
    fontSize: Theme.fontSizes.sm,
    color: Theme.colors.text,
  },
  infoBold: {
    fontWeight: Theme.fontWeights.semibold,
  },
  warningBox: {
    padding: Theme.spacing.md,
    backgroundColor: '#FEF3C7',
    borderRadius: Theme.borderRadius.md,
    borderWidth: 1,
    borderColor: '#FCD34D',
  },
  warningText: {
    fontSize: Theme.fontSizes.sm,
    color: '#92400E',
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
  emptyContainer: {
    padding: Theme.spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: Theme.fontSizes.sm,
    color: Theme.colors.placeholder,
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