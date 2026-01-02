export interface Tratamiento {
  clasificacion: string;
  subclasificacion: string;
  servicio: string | null;
  precio: string;
}

export interface TratamientoDetalle {
  iidespecialidad: number;
  sitratamiento: number;
  iidtratamientodetalle: number;
  vcodigo: string;
  vdescripcion: string | null;
  dvalortratamiento: number;
  bestado: boolean;
  precio_unitario?: number;
}

export interface ProductoTratamiento {
  id: string;
  codigo: string;
  nombre: string;
  cantidad: number;
  unidad: string;
  
  consultorio?: string;
  bodegaSolicita?: string;      
  bodegaOrigen?: string;       
  proveedor?: string;
  tipoOrden?: string;
  valorUnitario?: number;
  
  iidConsultorio?: string;
  iidBodegaSolicita?: string;    
  iidBodegaOrigen?: string;     
  iidProveedor?: string;
  iidTipoOrden?: string;
  
  iid_inventario?: number;

  bodega?: string;               
  iidBodega?: string;
  precio_unitario?: number;
  
  iid_iva?: number | null;
  iva_porcentaje?: number | null;
  iva_vigencia_desde?: string | null;
  iva_vigencia_hasta?: string | null;
  iva_activo?: boolean | null;

  cantidad_recibida?: number;
}