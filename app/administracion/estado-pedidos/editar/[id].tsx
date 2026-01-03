import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ShoppingCart, User, Warehouse } from 'lucide-react-native';
import FormularioProducto from '@components/Inventario/Pedidos/FormularioProducto';
import TablaProductosTratamiento from '@components/Inventario/Pedidos/TablaProductosTratamiento';
import type { ProductoTratamiento } from '@models/Tratamiento/Tratamiento.types';
import ModalExito from '@components/shared/ModalExito';
import ModalError from '@components/shared/ModalError';
import { getProductoByCodigo } from '@services/InventarioProductos/inventarioProductos.service';
import {
  createPedido,
  fetchTiposPedido,
  fetchNextPedidoId,
  getPedidoById,
  updatePedido,
  aprobarPedido,
  rechazarPedido,
} from '@services/Pedidos/Pedidos.service';
import type { TipoPedido, Pedido } from '@models/Pedidos/Pedidos.types';
import BackButton from '@components/shared/BackButton';
import FormularioEncabezadoPedido from '@components/Inventario/Pedidos/FormularioEncabezadoPedido';
import SelectorTipoBodega from '@components/Inventario/Pedidos/SelectorTipoBodega';
import { fetchBodegasPrincipales } from '@services/Bodegas/bodegas.service';
import type { Bodega } from '@models/Bodegas/Bodegas.types';
import { ModalAprobacion } from '@components/shared/ModalAprobacion';
import { ModalRechazo } from '@components/shared/ModalRechazo';
import { useAuth } from '@context/AuthContext';
import CampoObservaciones from '@components/shared/CampoObservaciones';
import { Colors, Spacing, FontSizes, BorderRadius, Shadows } from '@constants/theme';

export default function EditarPedidoAdmin() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const isEditMode = Boolean(id);
  const { usuario } = useAuth();

  const [productos, setProductos] = useState<ProductoTratamiento[]>([]);
  const [modalExitoAbierto, setModalExitoAbierto] = useState(false);
  const [modalErrorAbierto, setModalErrorAbierto] = useState(false);
  const [mensajeError, setMensajeError] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [tiposPedido, setTiposPedido] = useState<TipoPedido[]>([]);
  const [tipoPedidoSeleccionado, setTipoPedidoSeleccionado] = useState<string>('');
  const [bodegas, setBodegas] = useState<Bodega[]>([]);
  const [bodegaSeleccionada, setBodegaSeleccionada] = useState<string>('');
  const [nextPedidoId, setNextPedidoId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [pedidoActual, setPedidoActual] = useState<Pedido | null>(null);
  const [pedidoOriginal, setPedidoOriginal] = useState<Pedido | null>(null);
  const [modalAprobacionVisible, setModalAprobacionVisible] = useState(false);
  const [modalRechazoVisible, setModalRechazoVisible] = useState(false);
  const [observaciones, setObservaciones] = useState<string>('');

  const formatearIdPedido = (id: number): string => {
    return `#${id.toString().padStart(5, '0')}`;
  };

  const hayCambiosPendientes = useMemo(() => {
    if (!pedidoOriginal || !isEditMode) return false;

    if (pedidoOriginal.iid_tipo_pedido?.toString() !== tipoPedidoSeleccionado) {
      return true;
    }

    if (pedidoOriginal.iid_bodega_destino?.toString() !== bodegaSeleccionada) {
      return true;
    }

    const obsOriginal = (pedidoOriginal.v_observaciones || '').trim();
    const obsActual = observaciones.trim();
    if (obsOriginal !== obsActual) {
      return true;
    }

    if (!pedidoOriginal.detalles || pedidoOriginal.detalles.length !== productos.length) {
      return true;
    }

    for (const productoActual of productos) {
      const productoOriginal = pedidoOriginal.detalles.find(
        (d: any) => d.codigo_producto === productoActual.codigo
      );
      if (!productoOriginal) {
        return true;
      }
      if (productoOriginal.cantidad_solicitada !== productoActual.cantidad) {
        return true;
      }
    }

    for (const detalleOriginal of pedidoOriginal.detalles) {
      const productoActual = productos.find(
        (p: any) => p.codigo === detalleOriginal.codigo_producto
      );
      if (!productoActual) {
        return true;
      }
    }

    return false;
  }, [pedidoOriginal, isEditMode, tipoPedidoSeleccionado, bodegaSeleccionada, productos, observaciones]);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);

        const [tipos, bodegasData] = await Promise.all([
          fetchTiposPedido(),
          fetchBodegasPrincipales(),
        ]);

        setTiposPedido(tipos);
        setBodegas(bodegasData);

        if (isEditMode && id) {
          const pedido = await getPedidoById(parseInt(id));
          setPedidoActual(pedido);
          setPedidoOriginal(pedido);
          setTipoPedidoSeleccionado(pedido.iid_tipo_pedido.toString());
          setObservaciones(pedido.v_observaciones || '');

          if (pedido.iid_bodega_destino) {
            setBodegaSeleccionada(pedido.iid_bodega_destino.toString());
          } else {
            if (bodegasData.length > 0) {
              setBodegaSeleccionada(bodegasData[0].iid_bodega.toString());
            }
          }

          if (pedido.detalles && pedido.detalles.length > 0) {
            const productosFormateados: ProductoTratamiento[] = pedido.detalles.map(
              (detalle, index) => ({
                id: `${detalle.iid_pedido_det || index}`,
                codigo: detalle.codigo_producto || '',
                nombre: detalle.producto?.vnombre_producto || 'Producto sin nombre',
                cantidad: detalle.cantidad_solicitada,
                unidad: detalle.producto?.unidad_compra?.vabreviatura || 'UND',
                unidad_medida: detalle.producto?.unidad_compra?.vabreviatura || 'UND',
              })
            );
            setProductos(productosFormateados);
          }
        } else {
          const nextId = await fetchNextPedidoId();
          setNextPedidoId(nextId);
        }
      } catch (err) {
        console.error('Error cargando datos:', err);
        setMensajeError(err instanceof Error ? err.message : 'Error al cargar datos');
        setModalErrorAbierto(true);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [id, isEditMode]);

  useEffect(() => {
    if (!isEditMode && tiposPedido.length > 0 && !tipoPedidoSeleccionado) {
      setTipoPedidoSeleccionado(tiposPedido[0].iid_tipo_pedido.toString());
    }
    if (!isEditMode && bodegas.length > 0 && !bodegaSeleccionada) {
      setBodegaSeleccionada(bodegas[0].iid_bodega.toString());
    }
  }, [tiposPedido, bodegas, isEditMode, tipoPedidoSeleccionado, bodegaSeleccionada]);

  const handleAgregarProducto = (producto: Omit<ProductoTratamiento, 'id'>) => {
    const nuevoProducto: ProductoTratamiento = {
      id: Date.now().toString(),
      ...producto,
    };
    setProductos((prev) => [...prev, nuevoProducto]);
  };

  const handleEliminarProducto = (id: string) => {
    setProductos((prev) => prev.filter((p) => p.id !== id));
  };

  const handleEditarCantidad = (id: string, nuevaCantidad: number) => {
    setProductos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, cantidad: nuevaCantidad } : p))
    );
  };

  const handleGuardarPedido = async () => {
    if (!tipoPedidoSeleccionado) {
      setMensajeError('Debe seleccionar un tipo de pedido');
      setModalErrorAbierto(true);
      return;
    }

    if (!bodegaSeleccionada) {
      setMensajeError('Debe seleccionar una bodega de destino');
      setModalErrorAbierto(true);
      return;
    }

    if (productos.length === 0) {
      setMensajeError('Debe agregar al menos un producto');
      setModalErrorAbierto(true);
      return;
    }

    setGuardando(true);

    try {
      const productosConIds = await Promise.all(
        productos.map(async (prod) => {
          const productoDB = await getProductoByCodigo(prod.codigo);
          if (!productoDB) {
            throw new Error(`No se encontró el producto con código: ${prod.codigo}`);
          }
          return {
            iid_inventario: productoDB.iid_inventario,
            cantidad_solicitada: prod.cantidad,
          };
        })
      );

      const pedidoData = {
        iid_tipo_pedido: parseInt(tipoPedidoSeleccionado),
        iid_bodega_destino: parseInt(bodegaSeleccionada),
        v_observaciones: observaciones.trim() || undefined,
        detalles: productosConIds,
      };

      if (isEditMode && id) {
        await updatePedido(parseInt(id), pedidoData);

        const pedidoActualizado = await getPedidoById(parseInt(id));
        setPedidoActual(pedidoActualizado);
        setPedidoOriginal(pedidoActualizado);

        setTipoPedidoSeleccionado(pedidoActualizado.iid_tipo_pedido.toString());
        setBodegaSeleccionada(pedidoActualizado.iid_bodega_destino?.toString() || '');
        setObservaciones(pedidoActualizado.v_observaciones || '');

        if (pedidoActualizado.detalles && pedidoActualizado.detalles.length > 0) {
          const productosFormateados: ProductoTratamiento[] = pedidoActualizado.detalles.map(
            (detalle, index) => ({
              id: `${detalle.iid_pedido_det || index}`,
              codigo: detalle.codigo_producto || '',
              nombre: detalle.producto?.vnombre_producto || 'Producto sin nombre',
              cantidad: detalle.cantidad_solicitada,
              unidad: detalle.producto?.unidad_compra?.vabreviatura || 'UND',
              unidad_medida: detalle.producto?.unidad_compra?.vabreviatura || 'UND',
            })
          );
          setProductos(productosFormateados);
        }

        setMensajeExito('El pedido ha sido actualizado correctamente');
        setModalExitoAbierto(true);
      } else {
        await createPedido(pedidoData);
        setProductos([]);
        setTipoPedidoSeleccionado('');
        setBodegaSeleccionada('');
        setObservaciones('');
        setMensajeExito('El pedido ha sido creado correctamente');
        setModalExitoAbierto(true);

        const nuevoId = await fetchNextPedidoId();
        setNextPedidoId(nuevoId);
      }
    } catch (error: any) {
      console.error('❌ Error al guardar pedido:', error);
      setMensajeError(error.message || 'Error al guardar el pedido');
      setModalErrorAbierto(true);
    } finally {
      setGuardando(false);
    }
  };

  const handleAprobar = async (observacionesAprobacion: string) => {
    if (!pedidoActual) return;

    if (!usuario?.iid) {
      setMensajeError(
        'No se pudo identificar al usuario que aprueba. Por favor, inicie sesión nuevamente.'
      );
      setModalErrorAbierto(true);
      return;
    }

    setGuardando(true);

    try {
      if (hayCambiosPendientes) {
        const productosConIds = await Promise.all(
          productos.map(async (prod) => {
            const productoDB = await getProductoByCodigo(prod.codigo);
            if (!productoDB) {
              throw new Error(`No se encontró el producto con código: ${prod.codigo}`);
            }
            return {
              iid_inventario: productoDB.iid_inventario,
              cantidad_solicitada: prod.cantidad,
            };
          })
        );

        const pedidoData = {
          iid_tipo_pedido: parseInt(tipoPedidoSeleccionado),
          iid_bodega_destino: parseInt(bodegaSeleccionada),
          v_observaciones: observaciones.trim() || undefined,
          detalles: productosConIds,
        };

        await updatePedido(pedidoActual.iid_pedido, pedidoData);
      }

      const observacionesCombinadas = [observaciones.trim(), observacionesAprobacion.trim()]
        .filter(Boolean)
        .join(' | ');

      await aprobarPedido(pedidoActual.iid_pedido, {
        iid_usuario_aprueba: usuario.iid,
        v_observaciones: observacionesCombinadas || undefined,
      });

      setMensajeExito('El pedido ha sido aprobado exitosamente');
      setModalAprobacionVisible(false);
      setModalExitoAbierto(true);
    } catch (error: any) {
      setMensajeError(error.message || 'Error al aprobar el pedido');
      setModalErrorAbierto(true);
    } finally {
      setGuardando(false);
    }
  };

  const handleRechazar = async (motivoRechazo: string) => {
    if (!pedidoActual) return;

    if (!usuario?.iid) {
      setMensajeError(
        'No se pudo identificar al usuario que rechaza. Por favor, inicie sesión nuevamente.'
      );
      setModalErrorAbierto(true);
      return;
    }

    try {
      await rechazarPedido(pedidoActual.iid_pedido, {
        v_motivo_rechazo: motivoRechazo,
      });
      setMensajeExito('El pedido ha sido rechazado');
      setModalRechazoVisible(false);
      setModalExitoAbierto(true);
    } catch (error: any) {
      setMensajeError(error.message || 'Error al rechazar el pedido');
      setModalErrorAbierto(true);
    }
  };

  const handleModalExitoClose = () => {
    setModalExitoAbierto(false);

    if (isEditMode && (mensajeExito.includes('aprobado') || mensajeExito.includes('rechazado'))) {
      router.push('/administracion/estado-pedidos');
    }
  };

  const tiposAdaptados = tiposPedido.map((tipo) => ({
    id: tipo.iid_tipo_pedido,
    descripcion: tipo.v_descripcion,
  }));

  const bodegasAdaptadas = bodegas.map((bodega) => ({
    id: bodega.iid_bodega,
    descripcion: bodega.vnombre_bodega,
  }));

  const puedeAprobarRechazar =
    isEditMode && pedidoActual && pedidoActual.iid_estado_pedido === 1;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>
          {isEditMode ? 'Cargando pedido...' : 'Cargando datos...'}
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <BackButton />
        {puedeAprobarRechazar && (
          <View style={styles.headerButtons}>
            <TouchableOpacity
              style={styles.aprobarButton}
              onPress={() => setModalAprobacionVisible(true)}
              disabled={guardando}
              activeOpacity={0.7}
            >
              <Text style={styles.aprobarButtonText}>Aprobar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.rechazarButton}
              onPress={() => setModalRechazoVisible(true)}
              disabled={guardando}
              activeOpacity={0.7}
            >
              <Text style={styles.rechazarButtonText}>Rechazar</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <FormularioEncabezadoPedido
            icon={ShoppingCart}
            titulo={isEditMode ? 'Editar Pedido' : 'Orden de Pedido'}
            subtitulo={
              isEditMode
                ? 'Modificar pedido existente'
                : 'Gestión de pedidos de productos'
            }
            nextId={isEditMode && pedidoActual ? pedidoActual.iid_pedido : nextPedidoId}
            formatearId={formatearIdPedido}
            labelNextId={isEditMode ? 'Pedido' : 'Próximo Pedido'}
          >
            {isEditMode && pedidoActual && (
              <View style={styles.infoPedido}>
                {pedidoActual.usuario_solicita_nombre && (
                  <View style={styles.infoRow}>
                    <User size={16} color={Colors.secondary} />
                    <Text style={styles.infoLabel}>Solicitado por:</Text>
                    <Text style={styles.infoValue}>
                      {pedidoActual.usuario_solicita_nombre}
                    </Text>
                    {pedidoActual.d_fecha_solicitud && (
                      <Text style={styles.infoFecha}>
                        {' • '}
                        {new Date(pedidoActual.d_fecha_solicitud).toLocaleDateString('es-EC', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </Text>
                    )}
                  </View>
                )}

                {pedidoActual.bodega_destino_nombre && (
                  <View style={styles.infoRow}>
                    <Warehouse size={16} color={Colors.secondary} />
                    <Text style={styles.infoLabel}>Bodega solicitada:</Text>
                    <Text style={styles.infoValue}>{pedidoActual.bodega_destino_nombre}</Text>
                  </View>
                )}

                {!pedidoActual.iid_bodega_destino && (
                  <View style={styles.warningBox}>
                    <Text style={styles.warningText}>
                      ⚠️ Este pedido no tenía bodega asignada. Debe seleccionar una bodega de
                      destino.
                    </Text>
                  </View>
                )}
              </View>
            )}

            <SelectorTipoBodega
              tipoOptions={tiposAdaptados}
              tipoValue={tipoPedidoSeleccionado}
              tipoOnChange={setTipoPedidoSeleccionado}
              tipoLabel="Tipo de Pedido"
              bodegaOptions={bodegasAdaptadas}
              bodegaValue={bodegaSeleccionada}
              bodegaOnChange={setBodegaSeleccionada}
              bodegaLabel={isEditMode ? 'Nueva Bodega Destino' : 'Bodega Destino'}
              loading={loading}
            />
          </FormularioEncabezadoPedido>

          <View style={styles.detalleSection}>
            <View style={styles.detalleTitulo}>
              <Text style={styles.detalleTituloText}>DETALLE DE PEDIDO</Text>
            </View>

            <View style={styles.detalleContent}>
              <FormularioProducto
                onAgregarProducto={handleAgregarProducto}
                mostrarConsultorio={false}
              />

              <TablaProductosTratamiento
                productos={productos}
                onEliminarProducto={handleEliminarProducto}
                onEditarCantidad={handleEditarCantidad}
                mostrarConsultorio={false}
                mostrarValorUnitario={false}
                mostrarBodega={false}
                mostrarTotal={false}
                permitirEditarCantidad={true}
              />

              <CampoObservaciones
                value={observaciones}
                onChange={setObservaciones}
                placeholder="Agregue observaciones o comentarios sobre este pedido..."
                label="Observaciones del Pedido"
                required={false}
                maxLength={500}
              />

              {productos.length > 0 && !puedeAprobarRechazar && (
                <View style={styles.footerContainer}>
                  <TouchableOpacity
                    onPress={handleGuardarPedido}
                    disabled={
                      guardando ||
                      !tipoPedidoSeleccionado ||
                      !bodegaSeleccionada ||
                      (isEditMode && !hayCambiosPendientes)
                    }
                    style={[
                      styles.submitButton,
                      (guardando ||
                        !tipoPedidoSeleccionado ||
                        !bodegaSeleccionada ||
                        (isEditMode && !hayCambiosPendientes)) &&
                        styles.submitButtonDisabled,
                    ]}
                    activeOpacity={0.8}
                  >
                    {guardando ? (
                      <ActivityIndicator color={Colors.textInverse} size="small" />
                    ) : (
                      <View style={styles.buttonContent}>
                        <ShoppingCart color={Colors.textInverse} size={20} />
                        <Text style={styles.submitButtonText}>
                          {isEditMode ? 'Actualizar Pedido' : 'Crear Pedido'}
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>

                  {isEditMode && !hayCambiosPendientes && (
                    <Text style={styles.noCambiosText}>
                      No hay cambios pendientes por guardar
                    </Text>
                  )}

                  {(!tipoPedidoSeleccionado || !bodegaSeleccionada) && productos.length > 0 && (
                    <Text style={styles.warningTextFooter}>
                      ⚠ Debe seleccionar un tipo de pedido y una bodega para continuar
                    </Text>
                  )}
                </View>
              )}
            </View>
          </View>
        </View>
      </ScrollView>

      <ModalAprobacion
        pedido={pedidoActual}
        visible={modalAprobacionVisible}
        onConfirm={handleAprobar}
        onCancel={() => setModalAprobacionVisible(false)}
        mostrarCampoObservaciones={false}
      />

      <ModalRechazo
        item={pedidoActual}
        visible={modalRechazoVisible}
        onConfirm={handleRechazar}
        onCancel={() => setModalRechazoVisible(false)}
      />

      <ModalExito
        isOpen={modalExitoAbierto}
        onClose={handleModalExitoClose}
        mensaje={mensajeExito}
        titulo="¡Éxito!"
      />

      <ModalError
        isOpen={modalErrorAbierto}
        onClose={() => setModalErrorAbierto(false)}
        mensaje={mensajeError}
        titulo="¡Atención!"
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  aprobarButton: {
    backgroundColor: Colors.success,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  aprobarButtonText: {
    color: Colors.textInverse,
    fontSize: FontSizes.sm,
    fontWeight: '600',
  },
  rechazarButton: {
    backgroundColor: Colors.error,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  rechazarButtonText: {
    color: Colors.textInverse,
    fontSize: FontSizes.sm,
    fontWeight: '600',
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  loadingText: {
    marginTop: Spacing.md,
    color: Colors.text,
    fontSize: FontSizes.md,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    ...Shadows.md,
  },
  infoPedido: {
    backgroundColor: Colors.backgroundLight,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    flexWrap: 'wrap',
  },
  infoLabel: {
    fontSize: FontSizes.sm,
    fontWeight: '500',
    color: Colors.secondary,
  },
  infoValue: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: Colors.text,
  },
  infoFecha: {
    fontSize: FontSizes.xs,
    color: Colors.placeholder,
  },
  warningBox: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#F59E0B',
    borderRadius: BorderRadius.sm,
    padding: Spacing.sm,
  },
  warningText: {
    fontSize: FontSizes.xs,
    color: '#92400E',
  },
  detalleSection: {
    borderWidth: 2,
    borderColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    marginTop: Spacing.md,
  },
  detalleTitulo: {
    backgroundColor: Colors.primary,
    padding: Spacing.md,
  },
  detalleTituloText: {
    fontSize: FontSizes.md,
    fontWeight: 'bold',
    color: Colors.textInverse,
  },
  detalleContent: {
    padding: Spacing.md,
    gap: Spacing.md,
  },
  footerContainer: {
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 2,
    borderTopColor: Colors.border,
    gap: Spacing.sm,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.sm,
  },
  submitButtonDisabled: {
    backgroundColor: Colors.borderDark,
    opacity: 0.7,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  submitButtonText: {
    color: Colors.textInverse,
    fontSize: FontSizes.md,
    fontWeight: '600',
  },
  noCambiosText: {
    fontSize: FontSizes.sm,
    color: Colors.placeholder,
    textAlign: 'center',
  },
  warningTextFooter: {
    fontSize: FontSizes.sm,
    color: Colors.error,
    textAlign: 'center',
  },
});