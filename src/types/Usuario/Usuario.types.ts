import type { PermisoModulo } from '@models/Permisos/Permisos.types';

export type Permisos = Record<string, PermisoModulo>; 

export type Usuario = {
  iid: number;
  vUsuario: string;
  vNombres?: string;
  vApellidos?: string;
  idDoctor?: number;
  vDireccionfoto?: string;
};
