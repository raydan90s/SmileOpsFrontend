export interface NuevaCita {
  iIdPaciente: number;
  iIdDoctor: number;
  iIdConsultorio: number;
  iIdEspecialidad: number;
  dFechaCita: string; 
  cHoraCita: string;  
  iTiempo: number;    
  cEstado: string;  
  vUsuarioIng?: string;
}

export type EstadoCita = 'pendiente' | 'atendida' | 'cancelada';

export interface Cita {
  id: string;
  codigo: string;
  cedula: string;
  nombre: string;
  consultorio: string;
  tratamiento: string;
  horaCita: string;
  tiempoEstimado: string;
  dia: number;
  mes: number;
  año: number;
  doctor: string;
  estado: EstadoCita;
}
