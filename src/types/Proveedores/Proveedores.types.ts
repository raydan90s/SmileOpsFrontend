export interface Direccion {
  iid_direccion: number;
  iid_proveedor: number;
  v_direccion: string;
  v_tipo_direccion: string; 
  b_activo: boolean;
}

export interface Proveedor {
  iid_proveedor: number;
  vnombre: string;
  vruc?: string;
  vtelefono?: string;
  vfax?: string;
  vemail?: string;
  itipo_proveedor?: number;
  iid_pais?: number;
  bactivo?: boolean;
  nombre_tipo_proveedor?: string;
  nombre_pais?: string;
  total_direcciones?: number;
}

export interface Establecimiento {
  tipo: 'Matriz' | 'Sucursal';
  direccion: string;
  numeroEstablecimiento: string;
}

export interface CreateProveedorDTO {
  vnombre: string;
  vruc?: string;
  vtelefono?: string;
  vfax?: string;
  vemail?: string;
  itipo_proveedor: number;
  iid_pais: number;
  bactivo?: boolean;
  establecimientos?: Establecimiento[];
}

export interface UpdateProveedorDTO {
  vnombre?: string;
  vruc?: string;
  vtelefono?: string;
  vfax?: string;
  vemail?: string;
  itipo_proveedor?: number;
  iid_pais?: number;
  bactivo?: boolean;
}

export interface CreateDireccionDTO {
  iid_proveedor: number;
  v_direccion: string;
  v_tipo_direccion: string;
  b_activo?: boolean;
}

export interface UpdateDireccionDTO {
  v_direccion?: string;
  v_tipo_direccion?: string;
  b_activo?: boolean;
}

export interface ProveedorResponse {
  success: boolean;
  data?: Proveedor | Proveedor[];
  message?: string;
}

export interface DireccionResponse {
  success: boolean;
  data?: Direccion | Direccion[];
  message?: string;
}