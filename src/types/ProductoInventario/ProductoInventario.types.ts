export interface ProductoInventario {
  iid_inventario: number;
  codigo_producto: string;
  iid_subclasificacion: number;
  iid_nombre: number;
  iid_caracteristica: number;
  iid_marca: number;
  unidad_compra: number;
  unidad_consumo: number;
  cantidad_minima: string;
  estado: boolean;
  es_de_conteo: boolean;
  iid_iva: number | null;
  vnombre_producto?: string; 
  vnombre_caracteristica?: string; 
  vnombre_marca?: string; 
  unidad_compra_nombre?: string; 
  unidad_consumo_nombre?: string;
  
  iva_porcentaje?: string | null;  
  iva_vigencia_desde?: string | null;  
  iva_vigencia_hasta?: string | null; 
  iva_activo?: boolean | null; 
}

export interface ProductoConNombre extends ProductoInventario {}

export interface CreateProductoData {
  codigo_producto: string;
  iid_subclasificacion: number;
  iid_nombre: number;
  iid_caracteristica: number;
  iid_marca: number;
  unidad_compra: number;
  unidad_consumo: number;
  cantidad_minima: number;
  estado?: boolean;
  es_de_conteo?: boolean;
  iid_iva?: number | null;
}

export interface UpdateProductoData extends Partial<CreateProductoData> {}