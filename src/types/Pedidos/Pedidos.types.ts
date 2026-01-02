import type { FacturaPedido } from "@models/FacturaPedido/FacturaPedido.types";
import type { Producto } from "@models/Producto/Producto.type";

export interface TipoPedido {
  iid_tipo_pedido: number;
  v_descripcion: string;
  b_activo: boolean;
}

export interface EstadoPedido {
  iid_estado_pedido: number;
  v_descripcion: string;
  b_activo: boolean;
}

export interface Usuario {
  iid: number;
  vnombres: string;
  vapellidos: string;
  vusuario: string;
}

export interface TipoIVA {
  iid_iva: number;
  v_descripcion: string;
  n_porcentaje: number;
  d_fecha_vigencia_desde: string;
  d_fecha_vigencia_hasta?: string;
  b_activo: boolean;
}

export interface HistorialPedido {
  iid_historial: number;
  iid_usuario: number;
  usuario_nombre: string;
  d_fecha_cambio: string;
  v_observaciones?: string;
  v_accion: string;
}

export interface DetallePedido {
  iid_pedido_det: number;
  iid_inventario: number;
  codigo_producto: string;
  cantidad_solicitada: number;
  cantidad_cotizada?: number;
  cantidad_recibida?: number;
  n_precio_unitario?: number;
  n_subtotal_linea?: number;
  iid_iva?: number;
  n_porcentaje_iva_aplicado?: number;
  n_iva_linea?: number;
  n_total_linea?: number;
  producto: Producto;
}

export interface CreateDetallePedidoDTO {
  iid_inventario: number;
  cantidad_solicitada: number;
}

export interface UpdateDetalleCotizacionDTO {
  iid_inventario: number;
  cantidad_cotizada: number;
  n_precio_unitario: number;
}

export interface UpdateDetalleRecepcionDTO {
  iid_inventario: number;
  cantidad_recibida: number;
}

export interface Pedido {
  iid_pedido: number;
  iid_tipo_pedido: number;
  iid_bodega_destino: number;
  iid_proveedor: number;
  iid_estado_pedido: number;
  d_fecha_solicitud: string;
  iid_usuario_solicita: number;
  v_motivo_rechazo?: string;
  tipo: TipoPedido;
  estado: EstadoPedido;
  bodega_destino_nombre: string;
  proveedor_nombre: string;
  proveedor_ruc?: string;
  proveedor_email?: string;
  proveedor_telefono?: string;
  usuario_solicita_nombre?: string;

  detalles?: DetallePedido[];
  facturas?: FacturaPedido[];
  historial?: HistorialPedido[];

  v_observaciones: string;
}

export interface CreatePedidoDTO {
  iid_tipo_pedido?: number;
  iid_bodega_destino?: number;
  iid_proveedor?: number;
  v_observaciones?: string;
  detalles: CreateDetallePedidoDTO[];
}

export interface UpdatePedidoDTO {
  iid_tipo_pedido?: number;
  iid_bodega_destino?: number;
  iid_proveedor?: number;
}

export interface AprobarPedidoDTO {
  v_observaciones?: string;
}

export interface CotizarPedidoDTO {
  iid_proveedor?: number;
  v_observaciones?: string;
  detalles: UpdateDetalleCotizacionDTO[];
}

export interface RechazarPedidoDTO {
  v_motivo_rechazo: string;
}

export interface RecibirPedidoDTO {
  v_observaciones?: string; 
  detalles: UpdateDetalleRecepcionDTO[];
  iid_usuario_recibe: number;
  d_fecha_recepcion: string;
}

export interface PedidoFilters {
  iid_estado_pedido?: number;
  iid_tipo_pedido?: number;
  iid_bodega_destino?: number;
  iid_proveedor?: number;
  fecha_desde?: string;
  fecha_hasta?: string;
}

export interface ActualizarPedidoCotizadoDTO {
  detalles: Array<{
    iid_inventario: number;
    cantidad_cotizada: number;
    n_precio_unitario: number;
  }>;
  iid_proveedor: number;
  v_observaciones?: string;
}