export type Permisos = Record<string, PermisoModulo>; 

export type PermisoModulo = {
  lectura: boolean;
  escritura: boolean;
  eliminacion: boolean;
  administracion: boolean;
};

export interface PermisosAcciones {
  puedeVer: boolean;
  puedeEditar: boolean;
  puedeAprobar: boolean;
  puedeRechazar: boolean;
  puedeMarcarRecibido: boolean;
}