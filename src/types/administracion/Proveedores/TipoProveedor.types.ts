export interface TipoProveedor {
  iid_tipo_proveedor: number;
  vnombre: string;
  vdescripcion: string | null;
  bactivo: boolean;
  dfecha_creacion: string;
}

export interface CreateTipoProveedorDTO {
  vnombre: string;
  vdescripcion?: string;
}

export interface UpdateTipoProveedorDTO {
  vnombre?: string;
  vdescripcion?: string;
  bactivo?: boolean;
}