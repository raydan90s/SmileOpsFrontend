export interface Proveedor {
  iid_proveedor: number;
  vnombre: string;
  vruc: string;
  vemail?: string;
  vtelefono?: string;
  itipo_proveedor?: number;
  bactivo: boolean;
}

export interface Direccion {
  iid_direccion: number;
  iid_proveedor: number;
  vdireccion: string;
  vciudad?: string;
  vprovincia?: string;
  vpais?: string;
  bactivo: boolean;
}

export interface CreateProveedorDTO {
  vnombre: string;
  vruc: string;
  vemail?: string;
  vtelefono?: string;
  itipo_proveedor?: number;
  bactivo?: boolean;
}

export interface UpdateProveedorDTO extends Partial<CreateProveedorDTO> {}

export interface CreateDireccionDTO {
  iid_proveedor: number;
  vdireccion: string;
  vciudad?: string;
  vprovincia?: string;
  vpais?: string;
  bactivo?: boolean;
}

export interface UpdateDireccionDTO extends Partial<CreateDireccionDTO> {}