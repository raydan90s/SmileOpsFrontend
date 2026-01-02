export interface DatosFactura {
  iid_entidad_facturadora: number | null;
  v_numero_factura: string;
  v_clave_acceso: string;
  v_numero_autorizacion: string;
  d_fecha_factura: string;
  d_fecha_autorizacion: string;
  n_subtotal_0: number;
  n_subtotal_iva: number;
  n_subtotal: number;     
  n_iva: number;          
  n_total: number;
  v_observaciones: string;        
  n_descuento: number | null;
  archivo_xml: File | null;
  archivo_pdf: File | null;
}

export interface FacturaPedido {
  iid_factura_pedido: number;
  iid_pedido: number;
  iid_entidad_facturadora: number;
  v_numero_factura: string;
  v_clave_acceso?: string;
  v_numero_autorizacion?: string;
  d_fecha_factura: string;
  d_fecha_autorizacion?: string;
  n_subtotal_0: number;
  n_subtotal_iva: number;
  n_subtotal: number;
  n_iva: number;
  n_descuento: number;
  n_total: number;
  d_fecha_registro?: string;
  iid_usuario_registra: number;
  v_ruta_xml?: string;
  v_ruta_pdf?: string;
  
  entidad_facturadora?: EntidadFacturadora;
  usuario_registra_nombre?: string;
}

export interface EntidadFacturadora {
  iid_entidad_facturadora: number;
  v_ruc: string;
  v_razon_social: string;
  v_nombre_comercial?: string;
  v_direccion?: string;
  v_telefono?: string;
  v_email?: string;
  b_activo: boolean;
  d_fecha_registro?: string;
}

export interface CreateFacturaPedidoDTO {
  iid_entidad_facturadora: number;
  v_numero_factura: string;
  v_clave_acceso?: string;
  v_numero_autorizacion?: string;
  d_fecha_factura: string;
  d_fecha_autorizacion?: string;
  n_subtotal_0: number;
  n_subtotal_iva: number;
  n_subtotal: number;     
  n_iva: number;          
  n_total: number;         
  n_descuento?: number;
  v_observaciones?: string;
  archivo_xml?: File;
  archivo_pdf?: File;
}

export interface UpdateFacturaPedidoDTO {
  v_numero_factura?: string;
  v_clave_acceso?: string;
  v_numero_autorizacion?: string;
  d_fecha_factura?: string;
  d_fecha_autorizacion?: string;
  n_subtotal_0?: number;
  n_subtotal_iva?: number;
  n_descuento?: number;
  archivo_xml?: File;
  archivo_pdf?: File;
}