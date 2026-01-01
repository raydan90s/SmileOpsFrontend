export type Usuario = {
  iid: number;
  vUsuario: string;
  vNombres?: string;
  vApellidos?: string;
  idDoctor?: number;
  vDireccionfoto?:string;
};

export type PermisoModulo = {
  lectura: boolean;
  escritura: boolean;
  eliminacion: boolean;
  administracion: boolean;
};