import type { UnidadMedida } from "@models/UnidadMedida/UnidadMedida.types";

export interface Producto {
  iid_nombre: number;
  vnombre_producto: string;
  codigo_producto: string;
  iid_inventario: number;
  nombre_completo: string;
  caracteristica?: string;
  marca?: string;
  unidad_compra?: UnidadMedida;

  n_porcentaje?: number | null;
  iva_vigencia_desde?: string | null;
  iva_vigencia_hasta?: string | null;
  iva_activo?: boolean | null;

}