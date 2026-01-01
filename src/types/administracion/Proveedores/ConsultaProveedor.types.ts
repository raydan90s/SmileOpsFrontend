export type InformacionFechasContribuyente = {
  fechaInicioActividades: string; 
  fechaCese: string | null;     
  fechaReinicioActividades: string | null; 
  fechaActualizacion: string;  
};

export type EstablecimientoSRI = {
  nombreFantasiaComercial: string | null;
  tipoEstablecimiento: string; 
  direccionCompleta: string;   
  estado: string;             
  numeroEstablecimiento: string;
  matriz: 'SI' | 'NO';
};

export type ContribuyenteSRI = {
  numeroRuc: string;
  razonSocial: string;
  estadoContribuyenteRuc: string; 
  actividadEconomicaPrincipal: string;
  tipoContribuyente: string; 
  regimen: string; 
  categoria: string | null;
  obligadoLlevarContabilidad: 'SI' | 'NO';
  agenteRetencion: 'SI' | 'NO';
  contribuyenteEspecial: 'SI' | 'NO';
  contribuyenteFantasma: 'SI' | 'NO';
  transaccionesInexistente: 'SI' | 'NO';
  
  informacionFechasContribuyente: InformacionFechasContribuyente;
  
  representantesLegales: any[] | null;
  motivoCancelacionSuspension: string | null;
};

export type RucRequestDTO = {
  ruc: string;
};


export type SriData = {
  ruc: string;
  data: ContribuyenteSRI & {
    establecimientos: EstablecimientoSRI[]; 
  };
};


export type SriResponse = SriData | { error: string };