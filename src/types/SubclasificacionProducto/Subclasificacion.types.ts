export interface Subclasificacion {
  iid_subclasificacion: number;
  iid_clasificacion: number;
  v_codigo: string;
  v_descripcion: string;
  b_activo: boolean;
  clasificacion_nombre?: string;
}

export interface CreateSubclasificacionData {
  iid_clasificacion: number;
  v_codigo: string;
  v_descripcion: string;
  b_activo?: boolean;
}

export interface UpdateSubclasificacionData {
  iid_clasificacion?: number;
  v_codigo?: string;
  v_descripcion?: string;
  b_activo?: boolean;
}