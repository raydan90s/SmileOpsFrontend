import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import type { Pedido } from '@models/Pedidos/Pedidos.types';
import type { RangoFecha } from '@models/Fechas/Fechas.types';
import { aprobarPedido, rechazarPedido, aprobarCotizacionFinal, registrarFacturaPedido } from '@services/Pedidos/Pedidos.service';
import { usePermisos } from '@hooks/usePermisos';
import { useAuth } from '@context/AuthContext';
import type { DatosFactura } from '@models/FacturaPedido/FacturaPedido.types';

interface UsePedidosActionsParams {
    rangoFecha: RangoFecha;
    fechaDesde?: string;
    fechaHasta?: string;
    calcularFechas: (rango: RangoFecha, desde?: string, hasta?: string) => { desde?: string; hasta?: string };
    cargarPedidos: (desde?: string, hasta?: string) => Promise<void>;
    abrirModalAprobacion: (pedido: Pedido) => void;
    abrirModalRechazo: (pedido: Pedido) => void;
    abrirModalDetalle: (pedido: Pedido) => void;
    estadoActivo?: number;
}

export const usePedidosActions = ({
    rangoFecha,
    fechaDesde,
    fechaHasta,
    calcularFechas,
    cargarPedidos,
    abrirModalAprobacion,
    abrirModalRechazo,
    abrirModalDetalle,
    estadoActivo
}: UsePedidosActionsParams) => {

    const router = useRouter();
    const { usuario } = useAuth();

    const {
        puedeVer,
        puedeEditar,
        puedeAprobar,
        puedeRechazar,
        puedeMarcarRecibido,
        alertaSinPermisos
    } = usePermisos('ADM');

    const recargarConFechas = async () => {
        const { desde, hasta } = calcularFechas(rangoFecha, fechaDesde, fechaHasta);
        await cargarPedidos(desde, hasta);
    };

    const handleVerDetalle = (pedido: Pedido) => {
        if (!puedeVer) {
            alertaSinPermisos('ver detalles de pedidos');
            return;
        }
        abrirModalDetalle(pedido);
    };

    const handleEditar = (pedido: Pedido) => {
        if (!puedeEditar) {
            alertaSinPermisos('editar pedidos');
            return;
        }
        router.push(`/administracion/estado-pedidos/editar/${pedido.iid_pedido}`);
    };

    const handleAprobar = (pedido: Pedido) => {
        if (!usuario?.iid) {
            Alert.alert('Error', '⚠️ No se puede identificar el usuario');
            return;
        }

        if (!puedeAprobar) {
            alertaSinPermisos('aprobar pedidos');
            return;
        }

        abrirModalAprobacion(pedido);
    };

    const ejecutarAprobacion = async (pedido: Pedido, observaciones: string) => {
        if (!usuario?.iid) throw new Error('No se puede identificar el usuario');
        if (!puedeAprobar) throw new Error('No tienes permisos para aprobar pedidos');

        const observacionesPrevias = pedido.v_observaciones?.trim() || '';
        const observacionesNuevas = observaciones.trim();

        const observacionesCombinadas = [observacionesPrevias, observacionesNuevas]
            .filter(Boolean)
            .join(' | ');

        await aprobarPedido(pedido.iid_pedido, {
            iid_usuario_aprueba: usuario.iid,
            v_observaciones: observacionesCombinadas || undefined
        });

        await recargarConFechas();
    };

    const handleMarcarRecibido = async (pedido: Pedido) => {
        if (!usuario?.iid) {
            throw new Error('No se puede identificar el usuario');
        }
        router.push(`/inventario/pedidos/recibir/${pedido.iid_pedido}`);
    };

    const handleRechazar = (pedido: Pedido) => {
        if (!usuario?.iid) {
            Alert.alert('Error', '⚠️ No se puede identificar el usuario');
            return;
        }

        if (!puedeRechazar) {
            alertaSinPermisos('rechazar pedidos');
            return;
        }

        abrirModalRechazo(pedido);
    };

    const ejecutarRechazo = async (pedido: Pedido, motivoRechazo: string) => {
        if (!usuario?.iid) throw new Error('No se puede identificar el usuario');
        if (!puedeRechazar) throw new Error('No tienes permisos para rechazar pedidos');

        await rechazarPedido(pedido.iid_pedido, {
            v_motivo_rechazo: motivoRechazo,
        });

        await recargarConFechas();
    };

    const handleAprobarCotizacion = (pedido: Pedido) => {
        if (!usuario?.iid) {
            Alert.alert('Error', '⚠️ No se puede identificar el usuario');
            return;
        }
        if (!puedeAprobar) {
            alertaSinPermisos('aprobar cotizaciones');
            return;
        }
        abrirModalAprobacion(pedido);
    };

    const ejecutarAprobacionCotizacion = async (pedido: Pedido, observaciones: string) => {
        if (!usuario?.iid) throw new Error('No se puede identificar el usuario');
        if (!puedeAprobar) throw new Error('No tienes permisos para aprobar');

        await aprobarCotizacionFinal(pedido.iid_pedido, {
            v_observaciones: observaciones.trim() || undefined
        });

        await recargarConFechas();
    };

    const handleEditarCotizacion = (pedido: Pedido) => {
        router.push(`/inventario/pedidos/cotizar/${pedido.iid_pedido}`);
    };

    const handleEditarCotizado = (pedido: Pedido) => {
        router.push(`/inventario/pedidos/cotizar/${pedido.iid_pedido}`);
    };

    const handleRegistrarFactura = async (pedido: Pedido, datosFactura: DatosFactura) => {
        if (!usuario?.iid) throw new Error('No se puede identificar el usuario');
        if (!puedeEditar) throw new Error('No tienes permisos para registrar facturas');

        const facturaDTO = {
            iid_entidad_facturadora: datosFactura.iid_entidad_facturadora!,
            v_numero_factura: datosFactura.v_numero_factura,
            v_clave_acceso: datosFactura.v_clave_acceso || undefined,
            v_numero_autorizacion: datosFactura.v_numero_autorizacion || undefined,
            d_fecha_factura: datosFactura.d_fecha_factura,
            d_fecha_autorizacion: datosFactura.d_fecha_autorizacion || undefined,
            n_subtotal_0: datosFactura.n_subtotal_0,
            n_subtotal_iva: datosFactura.n_subtotal_iva,
            n_subtotal: datosFactura.n_subtotal,
            n_iva: datosFactura.n_iva,
            n_total: datosFactura.n_total,
            n_descuento: datosFactura.n_descuento ?? undefined,
        };

        await registrarFacturaPedido(pedido.iid_pedido, facturaDTO);
        await recargarConFechas();
    };

    return {
        permisos: {
            puedeVer,
            puedeEditar: puedeEditar && (estadoActivo === 1 || estadoActivo === 6),
            puedeAprobar: puedeAprobar && (estadoActivo === 1 || estadoActivo === 6),
            puedeRechazar: puedeRechazar && (estadoActivo === 1 || estadoActivo === 6),
            puedeMarcarRecibido: puedeMarcarRecibido && estadoActivo === 3
        },
        handleVerDetalle,
        handleEditar,
        handleAprobar,
        handleRechazar,
        handleMarcarRecibido,
        ejecutarAprobacion,
        ejecutarRechazo,
        handleEditarCotizacion,
        handleAprobarCotizacion,
        handleRegistrarFactura,
        ejecutarAprobacionCotizacion,
        handleEditarCotizado
    };
};