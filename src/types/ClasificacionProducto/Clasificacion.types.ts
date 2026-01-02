export interface Clasificacion {
  iid_clasificacion: number;
  v_descripcion: string;
  b_activo: boolean;
}

export interface CreateClasificacionData {
  v_descripcion: string;
  b_activo?: boolean;
}

export interface UpdateClasificacionData {
  v_descripcion?: string;
  b_activo?: boolean;
}