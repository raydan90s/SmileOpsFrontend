export interface EntidadFacturadora {
  iid_entidad_facturadora: number;
  v_ruc: string;
  v_razon_social: string;
  v_nombre_comercial?: string | null;
  v_direccion?: string | null;
  v_telefono?: string | null;
  v_email?: string | null;
  b_activo: boolean;
  d_fecha_registro?: string;
}

export interface CreateEntidadFacturadoraDTO {
  v_ruc: string;
  v_razon_social: string;
  v_nombre_comercial?: string;
  v_direccion?: string;
  v_telefono?: string;
  v_email?: string;
}

export interface UpdateEntidadFacturadoraDTO extends Partial<CreateEntidadFacturadoraDTO> {
  b_activo?: boolean;
}