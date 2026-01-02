export interface ProductoNombre {
  iid_nombre: number;
  vnombre_producto: string;
  bactivo: boolean;
}

export interface CreateProductoNombreData {
  vnombre_producto: string;
  bactivo?: boolean;
}

export interface UpdateProductoNombreData {
  vnombre_producto?: string;
  bactivo?: boolean;
}

export interface ProductoNombreResponse {
  success: boolean;
  data?: ProductoNombre;
  message?: string;
}

export interface ProductosNombreResponse {
  success: boolean;
  data?: ProductoNombre[];
  message?: string;
}