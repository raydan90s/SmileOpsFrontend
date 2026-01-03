import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Alert, ScrollView, ActivityIndicator, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { Pedido } from '@models/Pedidos/Pedidos.types';
import type { RangoFecha } from '@models/Fechas/Fechas.types';
import { fetchAllPedidos } from '@services/Pedidos/Pedidos.service';
import { useFiltrosFecha } from '@hooks/useFiltrosFecha';
import { usePedidosActions } from '@hooks/usePedidosActions';
import { useModalAprobacion } from '@hooks/useModalAprobacion';
import { useModalDetalle } from '@hooks/useModalDetalle';
import { useModalRechazo } from '@hooks/useModalRechazo';
import { useEstadosPedido } from '@hooks/useEstadosPedido';
import { HeaderGestionPedidos } from '@components/administracion/Pedidos/HeaderGestion';
import { ContenedorPedidos } from '@components/administracion/Pedidos/ContenedorPedidos';
import { ModalAprobacion } from '@components/shared/ModalAprobacion';
import { ModalRechazo } from '@components/shared/ModalRechazo';
import { ModalDetalle } from '@components/shared/ModalDetalle';
import ModalExito from '@components/shared/ModalExito';
import { Colors, Spacing, Theme } from '@constants/theme';
import BackButton from '@components/shared/BackButton';

export default function InventarioScreen() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [estadoActivo, setEstadoActivo] = useState<number>(1);
  const [busqueda, setBusqueda] = useState('');
  const [modalExitoVisible, setModalExitoVisible] = useState(false);
  const [mensajeExito, setMensajeExito] = useState('');
  const [paginaActual, setPaginaActual] = useState(1);
  const [itemsPorPagina] = useState(10);

  const { estados, loading: loadingEstados, error: errorEstados } = useEstadosPedido();

  const {
    modalState: modalAprobacion,
    abrirModal: abrirModalAprobacion,
    cerrarModal: cerrarModalAprobacion
  } = useModalAprobacion<Pedido>();

  const {
    modalState: modalDetalle,
    abrirModal: abrirModalDetalle,
    cerrarModal: cerrarModalDetalle
  } = useModalDetalle<Pedido>();

  const {
    modalState: modalRechazo,
    abrirModal: abrirModalRechazo,
    cerrarModal: cerrarModalRechazo
  } = useModalRechazo<Pedido>();

  const {
    rangoFecha,
    fechaDesde,
    fechaHasta,
    calcularFechas,
    handleFiltroFechaChange: handleFiltroChange
  } = useFiltrosFecha();

  const cargarPedidos = useCallback(async (desde?: string, hasta?: string) => {
    setLoading(true);
    try {
      const fechaDesdeConHora = desde ? `${desde}T00:00:00.000Z` : undefined;
      const fechaHastaConHora = hasta ? `${hasta}T23:59:59.999Z` : undefined;

      const filters = {
        iid_estado_pedido: estadoActivo,
        ...(fechaDesdeConHora && { fecha_desde: fechaDesdeConHora }),
        ...(fechaHastaConHora && { fecha_hasta: fechaHastaConHora })
      };

      const data = await fetchAllPedidos(filters);
      setPedidos(data);
    } catch (error) {
      Alert.alert('Error', 'Error al cargar los pedidos. Por favor intente nuevamente.');
    } finally {
      setLoading(false);
    }
  }, [estadoActivo]);

  useEffect(() => {
    const { desde, hasta } = calcularFechas(rangoFecha, fechaDesde, fechaHasta);
    cargarPedidos(desde, hasta);
  }, [estadoActivo, cargarPedidos]);

  const handleFiltroFechaChange = (rango: RangoFecha, desde?: string, hasta?: string) => {
    const { fechaDesde: fechaDesdeCalculada, fechaHasta: fechaHastaCalculada } =
      handleFiltroChange(rango, desde, hasta);
    setPaginaActual(1);
    cargarPedidos(fechaDesdeCalculada, fechaHastaCalculada);
  };

  const handleRefrescar = () => {
    const { desde, hasta } = calcularFechas(rangoFecha, fechaDesde, fechaHasta);
    cargarPedidos(desde, hasta);
  };

  const handleBusquedaChange = (nuevaBusqueda: string) => {
    setBusqueda(nuevaBusqueda);
    setPaginaActual(1);
  };

  const handleCambiarPagina = (nuevaPagina: number) => {
    setPaginaActual(nuevaPagina);
  };

  const pedidosFiltrados = pedidos.filter(p => {
    const textoBusqueda = busqueda.toLowerCase();
    return busqueda === '' ||
      p.iid_pedido.toString().includes(busqueda) ||
      (p.bodega_destino_nombre && p.bodega_destino_nombre.toLowerCase().includes(textoBusqueda)) ||
      (p.proveedor_nombre && p.proveedor_nombre.toLowerCase().includes(textoBusqueda)) ||
      (p.usuario_solicita_nombre && p.usuario_solicita_nombre.toLowerCase().includes(textoBusqueda));
  });

  const indiceInicio = (paginaActual - 1) * itemsPorPagina;
  const indiceFin = indiceInicio + itemsPorPagina;
  const pedidosPaginados = pedidosFiltrados.slice(indiceInicio, indiceFin);

  const pedidosActions = usePedidosActions({
    rangoFecha,
    fechaDesde,
    fechaHasta,
    calcularFechas,
    cargarPedidos,
    abrirModalAprobacion,
    abrirModalRechazo,
    abrirModalDetalle
  });

  const actionsInventario = {
    ...pedidosActions,
    permisos: {
      puedeVer: true,
      puedeEditar: estadoActivo === 2,
      puedeAprobar: false,
      puedeRechazar: false,
      puedeMarcarRecibido: estadoActivo === 3
    }
  };

  const handleConfirmarAprobacion = async (observaciones: string) => {
    if (modalAprobacion.pedido) {
      try {
        await pedidosActions.ejecutarAprobacion(modalAprobacion.pedido, observaciones);
        setMensajeExito('El pedido ha sido aprobado exitosamente');
        cerrarModalAprobacion();
        setModalExitoVisible(true);
      } catch (error) {
        Alert.alert('Error', 'Error al aprobar el pedido.');
      }
    }
  };

  const handleConfirmarRechazo = async (motivoRechazo: string) => {
    if (modalRechazo.item) {
      try {
        await pedidosActions.ejecutarRechazo(modalRechazo.item, motivoRechazo);
        setMensajeExito('El pedido ha sido rechazado exitosamente');
        cerrarModalRechazo();
        setModalExitoVisible(true);
      } catch (error) {
        Alert.alert('Error', 'Error al rechazar el pedido.');
      }
    }
  };

  const handleEstadoChange = (nuevoEstado: number) => {
    setLoading(true);
    setEstadoActivo(nuevoEstado);
    setPaginaActual(1);
  };

  if (errorEstados) {
    return (
      <View style={styles.centerContainer}>
        <View style={styles.errorBox}>
          <Text style={styles.errorTitle}>Error</Text>
          <Text style={styles.errorText}>{errorEstados}</Text>
        </View>
      </View>
    );
  }

  if (loading || loadingEstados) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Cargando pedidos...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <BackButton />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <HeaderGestionPedidos
          estadoActivo={estadoActivo}
          onEstadoChange={handleEstadoChange}
          onRefrescar={handleRefrescar}
          estados={estados}
          loadingEstados={loadingEstados}
        />

        <ContenedorPedidos
          items={pedidosPaginados}
          totalItems={pedidosFiltrados.length}
          estadoActivo={estadoActivo}
          busqueda={busqueda}
          rangoFecha={rangoFecha}
          paginaActual={paginaActual}
          itemsPorPagina={itemsPorPagina}
          indiceInicio={indiceInicio}
          indiceFin={indiceFin}
          onBusquedaChange={handleBusquedaChange}
          onFiltroFechaChange={handleFiltroFechaChange}
          onCambiarPagina={handleCambiarPagina}
          actions={actionsInventario as any}
        />
      </ScrollView>

      <ModalAprobacion
        pedido={modalAprobacion.pedido}
        visible={modalAprobacion.visible}
        onConfirm={handleConfirmarAprobacion}
        onCancel={cerrarModalAprobacion}
      />

      <ModalRechazo
        item={modalRechazo.item}
        visible={modalRechazo.visible}
        onConfirm={handleConfirmarRechazo}
        onCancel={cerrarModalRechazo}
      />

      <ModalDetalle
        item={modalDetalle.item}
        visible={modalDetalle.visible}
        onClose={cerrarModalDetalle}
        mostrarCotizado={estadoActivo >= 2}
        mostrarRecibido={estadoActivo >= 5}
        mostrarPrecioUnitario={estadoActivo >= 2}
        mostrarSubtotal={estadoActivo >= 2}
      />

      <ModalExito
        isOpen={modalExitoVisible}
        onClose={() => {
          setModalExitoVisible(false);
          setMensajeExito('');
        }}
        mensaje={mensajeExito}
        titulo="¡Éxito!"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  centerContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.md,
  },
  loadingText: {
    marginTop: Spacing.md,
    fontSize: Theme.fontSizes.md,
    color: Colors.text,
  },
  errorBox: {
    backgroundColor: '#FEF2F2',
    borderColor: Colors.error,
    borderWidth: 1,
    borderRadius: Theme.borderRadius.md,
    padding: Spacing.md,
    width: '100%',
    alignItems: 'center',
  },
  errorTitle: {
    fontWeight: Theme.fontWeights.bold,
    color: Colors.error,
    fontSize: Theme.fontSizes.lg,
    marginBottom: Spacing.sm,
  },
  errorText: {
    color: Colors.error,
    fontSize: Theme.fontSizes.md,
    textAlign: 'center',
  },
  header: {
    padding: Spacing.md,
  },
});