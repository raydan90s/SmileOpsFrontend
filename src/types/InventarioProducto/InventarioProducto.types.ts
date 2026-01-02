export interface InventarioProducto {
  iid_inventario: number;
  codigo_producto: string;
  iid_subclasificacion: number;
  iid_nombre: number;
  iid_caracteristica: number;
  iid_marca: number;
  unidad_compra: number;
  unidad_consumo: number;
  cantidad_minima: number;
  estado: boolean;
  es_de_conteo: boolean;
  iid_iva?: number;
  vnombre_producto?: string;
  vnombre_caracteristica?: string;
  vnombre_marca?: string;
  unidad_compra_nombre?: string;
  unidad_consumo_nombre?: string;
  iva_porcentaje?: number;
  iva_vigencia_desde?: string;
  iva_vigencia_hasta?: string;
  iva_activo?: boolean;
}

export interface CreateInventarioProductoData {
  codigo_producto: string;
  iid_subclasificacion: number;
  iid_nombre: number;
  iid_caracteristica: number;
  iid_marca: number;
  unidad_compra: number;
  unidad_consumo: number;
  cantidad_minima: number;
  estado: boolean;
  es_de_conteo: boolean;
  iid_iva?: number;
}

export interface UpdateInventarioProductoData {
  codigo_producto?: string;
  iid_subclasificacion?: number;
  iid_nombre?: number;
  iid_caracteristica?: number;
  iid_marca?: number;
  unidad_compra?: number;
  unidad_consumo?: number;
  cantidad_minima?: number;
  estado?: boolean;
  es_de_conteo?: boolean;
  iid_iva?: number;
}