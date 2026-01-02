export interface Bodega {
  iid_bodega: number;
  vnombre_bodega: string;
  iid_tipo_bodega: number;
  bactivo: boolean;
  iid_creado_por?: number;
  dfecha_creacion?: string;
  iid_modificado_por?: number;
  dfecha_modificacion?: string;
}