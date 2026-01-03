import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ShoppingCart } from 'lucide-react-native';
import { getProductoByCodigo } from '@services/InventarioProductos/inventarioProductos.service';
import { createPedido, fetchTiposPedido, fetchNextPedidoId } from '@services/Pedidos/Pedidos.service';
import { fetchBodegasPrincipales } from '@services/Bodegas/bodegas.service';
import type { ProductoTratamiento } from '@models/Tratamiento/Tratamiento.types';
import type { TipoPedido } from '@models/Pedidos/Pedidos.types';
import type { Bodega } from '@models/Bodegas/Bodegas.types';
import ModalExito from '@components/shared/ModalExito';
import ModalError from '@components/shared/ModalError';
import FormularioProducto from '@components/Inventario/Pedidos/FormularioProducto';
import TablaProductosTratamiento from '@components/Inventario/Pedidos/TablaProductosTratamiento';
import FormularioEncabezadoPedido from '@components/Inventario/Pedidos/FormularioEncabezadoPedido';
import SelectorTipoBodega from '@components/Inventario/Pedidos/SelectorTipoBodega';
import CampoObservaciones from '@components/shared/CampoObservaciones';
import { Colors, Spacing, BorderRadius, Shadows, FontSizes, FontWeights } from '@constants/theme';
import BackButton from '@components/shared/BackButton';

const SolicitarOrdenPedidoPage: React.FC = () => {
  const [productos, setProductos] = useState<ProductoTratamiento[]>([]);
  const [modalExitoAbierto, setModalExitoAbierto] = useState(false);
  const [modalErrorAbierto, setModalErrorAbierto] = useState(false);
  const [mensajeError, setMensajeError] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [tiposPedido, setTiposPedido] = useState<TipoPedido[]>([]);
  const [tipoPedidoSeleccionado, setTipoPedidoSeleccionado] = useState<string>('');
  const [nextPedidoId, setNextPedidoId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [_error, setError] = useState<string | null>(null);
  const [bodegas, setBodegas] = useState<Bodega[]>([]);
  const [bodegaSeleccionada, setBodegaSeleccionada] = useState<string>('');
  const [observaciones, setObservaciones] = useState<string>('');

  const formatearIdPedido = (id: number): string => {
    return `#${id.toString().padStart(5, '0')}`;
  };

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);

        const [tipos, bodegasData, nextId] = await Promise.all([
          fetchTiposPedido(),
          fetchBodegasPrincipales(),
          fetchNextPedidoId()
        ]);

        setTiposPedido(tipos);
        setBodegas(bodegasData);
        setNextPedidoId(nextId);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar datos');
      } finally {
        setLoading(false);
      }
    };
    cargarDatos();
  }, []);

  useEffect(() => {
    if (tiposPedido.length > 0 && !tipoPedidoSeleccionado) {
      setTipoPedidoSeleccionado(tiposPedido[0].iid_tipo_pedido.toString());
    }
    if (bodegas.length > 0 && !bodegaSeleccionada) {
      setBodegaSeleccionada(bodegas[0].iid_bodega.toString());
    }
  }, [tiposPedido, bodegas]);

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
        detalles: productosConIds
      };

      await createPedido(pedidoData);

      setProductos([]);
      setObservaciones('');
      setModalExitoAbierto(true);

      const nuevoId = await fetchNextPedidoId();
      setNextPedidoId(nuevoId);

    } catch (error: any) {
      setMensajeError(error.message || 'Error al guardar el pedido');
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

  if (loading && !nextPedidoId) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Cargando formulario...</Text>
      </View>
    );
  }

  const isFormValid = tipoPedidoSeleccionado && bodegaSeleccionada;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <BackButton />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <FormularioEncabezadoPedido
            icon={ShoppingCart}
            titulo="Orden de Pedido"
            subtitulo="Gestión de pedidos de productos"
            nextId={nextPedidoId}
            formatearId={formatearIdPedido}
            labelNextId="Próximo Pedido"
          >
            <SelectorTipoBodega
              tipoOptions={tiposAdaptados}
              tipoValue={tipoPedidoSeleccionado}
              tipoOnChange={setTipoPedidoSeleccionado}
              tipoLabel="Tipo de Pedido"

              bodegaOptions={bodegasAdaptadas}
              bodegaValue={bodegaSeleccionada}
              bodegaOnChange={setBodegaSeleccionada}
              bodegaLabel="Bodega Destino"

              loading={loading}
            />
          </FormularioEncabezadoPedido>

          <View style={styles.formContent}>
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
                    <ActivityIndicator color={Colors.textInverse} size="small" />
                  ) : (
                    <View style={styles.buttonContent}>
                      <ShoppingCart color={Colors.textInverse} size={20} />
                      <Text style={styles.submitButtonText}>Crear Pedido</Text>
                    </View>
                  )}
                </TouchableOpacity>

                {(!isFormValid) && (
                  <Text style={styles.warningText}>
                    ⚠ Debe seleccionar un tipo de pedido y una bodega para continuar
                  </Text>
                )}
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      <ModalExito
        isOpen={modalExitoAbierto}
        onClose={() => setModalExitoAbierto(false)}
        mensaje="El pedido ha sido creado correctamente"
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
    paddingBottom: Spacing.xxl,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    padding: Spacing.md,
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
  formContent: {
    marginTop: Spacing.md,
    gap: Spacing.md,
  },
  footerContainer: {
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
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
    fontWeight: FontWeights.semibold,
  },
  warningText: {
    fontSize: FontSizes.sm,
    color: Colors.error,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
});
export default SolicitarOrdenPedidoPage;