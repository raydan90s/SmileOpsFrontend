import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { ShoppingCart } from 'lucide-react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import FormularioProducto from '@components/Inventario/Pedidos/FormularioProducto';
import TablaProductosTratamiento from '@components/Inventario/Pedidos/TablaProductosTratamiento';
import ModalExito from '@components/shared/ModalExito';
import ModalError from '@components/shared/ModalError';
import FormularioEncabezadoPedido from '@components/Inventario/Pedidos/FormularioEncabezadoPedido';
import SelectorTipoBodega from '@components/Inventario/Pedidos/SelectorTipoBodega';
import CampoObservaciones from '@components/shared/CampoObservaciones';
import { getProductoByCodigo } from '@services/InventarioProductos/inventarioProductos.service';
import {
  createPedido,
  fetchTiposPedido,
  fetchNextPedidoId,
  getPedidoById,
  cotizarPedido,
  aprobarCotizacionFinal
} from '@services/Pedidos/Pedidos.service';
import { fetchBodegasPrincipales } from '@services/Bodegas/bodegas.service';
import { fetchAllProveedores } from '@services/Proveedores/Proveedores.service';
import type { ProductoTratamiento } from '@models/Tratamiento/Tratamiento.types';
import type { TipoPedido } from '@models/Pedidos/Pedidos.types';
import type { Bodega } from '@models/Bodegas/Bodegas.types';
import type { Proveedor } from '@models/Proveedores/Proveedores.types';
import { Colors, Spacing, BorderRadius, FontSizes, Shadows } from '@constants/theme';
import BackButton from '@components/shared/BackButton';
import { useAuth } from '@context/AuthContext';

const CotizarOrdenPedidoPage: React.FC = () => {
  const { usuario } = useAuth();
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const pedidoId = Array.isArray(id) ? id[0] : id;
  const modoEdicion = !!pedidoId;

  const [productos, setProductos] = useState<ProductoTratamiento[]>([]);
  const [pedidoOriginal, setPedidoOriginal] = useState<any>(null);
  const [modalExitoAbierto, setModalExitoAbierto] = useState(false);
  const [modalErrorAbierto, setModalErrorAbierto] = useState(false);
  const [mensajeError, setMensajeError] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [tiposPedido, setTiposPedido] = useState<TipoPedido[]>([]);
  const [tipoPedidoSeleccionado, setTipoPedidoSeleccionado] = useState<string>('');
  const [nextPedidoId, setNextPedidoId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bodegas, setBodegas] = useState<Bodega[]>([]);
  const [bodegaSeleccionada, setBodegaSeleccionada] = useState<string>('');
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState<string>('');
  const [observaciones, setObservaciones] = useState<string>('');

  const formatearIdPedido = (id: number): string => {
    return `#${id.toString().padStart(5, '0')}`;
  };

  useEffect(() => {
    if (modoEdicion && pedidoId) {
      const cargarPedido = async () => {
        try {
          setLoading(true);
          const pedido = await getPedidoById(parseInt(pedidoId));
          setPedidoOriginal(pedido);

          setNextPedidoId(pedido.iid_pedido);
          setTipoPedidoSeleccionado(pedido.iid_tipo_pedido?.toString() || '');
          setBodegaSeleccionada(pedido.iid_bodega_destino?.toString() || '');
          setProveedorSeleccionado(pedido.iid_proveedor?.toString() || '');

          if (!pedido.detalles || pedido.detalles.length === 0) {
            setProductos([]);
            return;
          }

          const productosConDetalles = await Promise.all(
            pedido.detalles.map(async (detalle: any) => {
              const producto = await getProductoByCodigo(detalle.codigo_producto);

              return {
                id: detalle.iid_pedido_det.toString(),
                iid_inventario: detalle.iid_inventario,
                codigo: detalle.codigo_producto,
                nombre: detalle.producto?.nombre_completo || producto?.vnombre_producto || detalle.nombre_producto || '',
                cantidad: detalle.cantidad_cotizada || detalle.cantidad_solicitada,
                precio_unitario: Number(detalle.n_precio_unitario || 0),
                proveedor: pedido.proveedor_nombre || '',
                proveedor_id: pedido.iid_proveedor || undefined,
                unidad: detalle.producto?.unidad_compra?.vabreviatura || producto?.unidad_compra_nombre || '',
                iid_iva: detalle.iid_iva ?? detalle.producto?.iid_iva ?? null,
                iva_porcentaje: Number(detalle.producto?.iva_porcentaje || 0),
                iva_vigencia_desde: detalle.producto?.iva_vigencia_desde || null,
                iva_vigencia_hasta: detalle.producto?.iva_vigencia_hasta || null,
                iva_activo: detalle.producto?.iva_activo ?? null,
              };
            })
          );

          setProductos(productosConDetalles);
        } catch (err) {
          setMensajeError('Error al cargar el pedido');
          setModalErrorAbierto(true);
        } finally {
          setLoading(false);
        }
      };

      cargarPedido();
    }
  }, [modoEdicion, pedidoId]);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);

        const [tipos, bodegasData, proveedoresData, nextId] = await Promise.all([
          fetchTiposPedido(),
          fetchBodegasPrincipales(),
          fetchAllProveedores(),
          !modoEdicion ? fetchNextPedidoId() : Promise.resolve(null)
        ]);

        setTiposPedido(tipos);
        setBodegas(bodegasData);
        setProveedores(proveedoresData);

        if (!modoEdicion && nextId) {
          setNextPedidoId(nextId);
        }

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar datos');
      } finally {
        if (!modoEdicion) {
          setLoading(false);
        }
      }
    };
    cargarDatos();
  }, [modoEdicion]);

  useEffect(() => {
    if (tiposPedido.length > 0 && !tipoPedidoSeleccionado && !modoEdicion) {
      setTipoPedidoSeleccionado(tiposPedido[0].iid_tipo_pedido.toString());
    }
    if (bodegas.length > 0 && !bodegaSeleccionada && !modoEdicion) {
      setBodegaSeleccionada(bodegas[0].iid_bodega.toString());
    }
  }, [tiposPedido, bodegas, modoEdicion, tipoPedidoSeleccionado, bodegaSeleccionada]);

  const handleAgregarProducto = (producto: Omit<ProductoTratamiento, 'id'>) => {
    const nuevoProducto: ProductoTratamiento = {
      id: Date.now().toString(),
      ...producto,
    };
    setProductos(prev => [...prev, nuevoProducto]);
  };

  const handleEliminarProducto = (id: string) => {
    setProductos(prev => prev.filter(p => p.id !== id));
  };

  const handleEditarCantidad = (id: string, nuevaCantidad: number) => {
    setProductos(prev =>
      prev.map(p => (p.id === id ? { ...p, cantidad: nuevaCantidad } : p))
    );
  };

  const handleEditarPrecio = (id: string, nuevoPrecio: number) => {
    setProductos(prev =>
      prev.map(p => (p.id === id ? { ...p, precio_unitario: nuevoPrecio } : p))
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

    if (modoEdicion && !proveedorSeleccionado) {
      setMensajeError('Debe seleccionar un proveedor para la cotización');
      setModalErrorAbierto(true);
      return;
    }

    if (productos.length === 0) {
      setMensajeError('Debe agregar al menos un producto');
      setModalErrorAbierto(true);
      return;
    }

    if (modoEdicion) {
      const productosSinPrecio = productos.filter(p => !p.precio_unitario || p.precio_unitario <= 0);
      if (productosSinPrecio.length > 0) {
        setMensajeError('Todos los productos deben tener un precio unitario mayor a 0');
        setModalErrorAbierto(true);
        return;
      }
    }

    if (modoEdicion && !usuario?.iid) {
      setMensajeError('No se identificó al usuario. Inicie sesión nuevamente.');
      setModalErrorAbierto(true);
      return;
    }

    setGuardando(true);

    try {
      if (modoEdicion && pedidoId && pedidoOriginal) {
        const detallesCotizacion = productos.map((prod: any) => ({
          iid_inventario: prod.iid_inventario,
          cantidad_cotizada: prod.cantidad,
          n_precio_unitario: prod.precio_unitario,
        }));

        await cotizarPedido(parseInt(pedidoId), {
          detalles: detallesCotizacion,
          iid_proveedor: parseInt(proveedorSeleccionado),
          v_observaciones: observaciones.trim() || undefined,
        });

        await aprobarCotizacionFinal(parseInt(pedidoId), {
          v_observaciones: observaciones.trim() || undefined
        });

        setModalExitoAbierto(true);

      } else {
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
          detalles: productosConIds
        };

        await createPedido(pedidoData);
        setProductos([]);
        setModalExitoAbierto(true);

        const nuevoId = await fetchNextPedidoId();
        setNextPedidoId(nuevoId);
      }

    } catch (error: any) {
      console.error('❌ Error en handleGuardarPedido:', error);
      setMensajeError(error.message || 'Ocurrió un error al procesar la solicitud');
      setModalErrorAbierto(true);
    } finally {
      setGuardando(false);
    }
  };

  const tiposAdaptados = tiposPedido.map(tipo => ({
    id: tipo.iid_tipo_pedido,
    descripcion: tipo.v_descripcion
  }));

  const bodegasAdaptadas = bodegas.map(bodega => ({
    id: bodega.iid_bodega,
    descripcion: bodega.vnombre_bodega
  }));

  const proveedoresAdaptados = proveedores.map(prov => ({
    id: prov.iid_proveedor,
    descripcion: prov.vnombre
  }));

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Cargando datos del pedido...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  const isFormValid = tipoPedidoSeleccionado && bodegaSeleccionada && (!modoEdicion || proveedorSeleccionado);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <BackButton />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <FormularioEncabezadoPedido
          icon={ShoppingCart}
          titulo={modoEdicion ? "Editar Cotización de Pedido" : "Orden de Pedido"}
          subtitulo={modoEdicion ? "Actualizar precios y cantidades" : "Gestión de pedidos de productos"}
          nextId={nextPedidoId}
          formatearId={formatearIdPedido}
          labelNextId={modoEdicion ? "Pedido" : "Próximo Pedido"}
        >
          <SelectorTipoBodega
            tipoOptions={tiposAdaptados}
            tipoValue={tipoPedidoSeleccionado}
            tipoOnChange={setTipoPedidoSeleccionado}
            tipoLabel="Tipo de Pedido"
            disabled={modoEdicion}

            bodegaOptions={bodegasAdaptadas}
            bodegaValue={bodegaSeleccionada}
            bodegaOnChange={setBodegaSeleccionada}
            bodegaLabel="Bodega Destino"

            loading={loading}
          />

          {modoEdicion && (
            <View style={styles.proveedorContainer}>
              <SelectorTipoBodega
                showTipo={false}
                showBodega={true}

                tipoOptions={[]}
                tipoValue=""
                tipoOnChange={() => { }}

                bodegaLabel="Proveedor"
                bodegaPlaceholder="Seleccione un proveedor"
                bodegaOptions={proveedoresAdaptados}
                bodegaValue={proveedorSeleccionado}
                bodegaOnChange={setProveedorSeleccionado}
              />
            </View>
          )}
        </FormularioEncabezadoPedido>

        <View style={styles.contentContainer}>
          {!modoEdicion && (
            <FormularioProducto
              onAgregarProducto={handleAgregarProducto}
              mostrarConsultorio={false}
            />
          )}

          <TablaProductosTratamiento
            productos={productos}
            onEliminarProducto={!modoEdicion ? handleEliminarProducto : undefined}
            onEditarCantidad={modoEdicion ? undefined : handleEditarCantidad}
            onEditarPrecio={modoEdicion ? handleEditarPrecio : undefined}
            mostrarConsultorio={false}
            mostrarValorUnitario={modoEdicion}
            mostrarBodega={false}
            mostrarTotal={modoEdicion}
            permitirEditarCantidad={!modoEdicion}
            permitirEditarPrecio={modoEdicion}
          />

          <CampoObservaciones
            value={observaciones}
            onChange={setObservaciones}
            placeholder="Agregue observaciones o comentarios sobre este pedido..."
            label="Observaciones del Pedido"
            required={false}
            maxLength={500}
          />

          {productos.length > 0 && (
            <View style={styles.footerContainer}>
              <TouchableOpacity
                onPress={handleGuardarPedido}
                disabled={guardando || !isFormValid}
                style={[
                  styles.submitButton,
                  (guardando || !isFormValid) && styles.submitButtonDisabled
                ]}
              >
                {guardando ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <View style={styles.buttonContent}>
                    <ShoppingCart color="#FFFFFF" size={20} />
                    <Text style={styles.submitButtonText}>
                      {modoEdicion ? 'Actualizar Cotización' : 'Crear Pedido'}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      <ModalExito
        isOpen={modalExitoAbierto}
        onClose={() => {
          setModalExitoAbierto(false);
          router.push('/inventario/pedidos/estado');
        }}
        mensaje={modoEdicion ? "La cotización ha sido actualizada correctamente" : "El pedido ha sido creado correctamente"}
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
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: Spacing.md,
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl * 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  loadingText: {
    marginTop: Spacing.md,
    fontSize: FontSizes.md,
    color: Colors.text,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  errorText: {
    fontSize: FontSizes.md,
    color: Colors.error,
    textAlign: 'center',
    fontWeight: '600',
  },
  proveedorContainer: {
    marginTop: Spacing.sm,
  },
  contentContainer: {
    gap: Spacing.lg,
  },
  footerContainer: {
    marginTop: Spacing.xl,
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.md,
  },
  submitButtonDisabled: {
    backgroundColor: Colors.border,
    opacity: 0.7,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: FontSizes.md,
    fontWeight: 'bold',
  },
});

export default CotizarOrdenPedidoPage;