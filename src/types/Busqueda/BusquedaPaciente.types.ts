import type { PacienteForm } from '@models/Busqueda/PacienteForm.types';

export type TipoBusqueda = 'codigo' | 'cedula' | 'nombre' | '';

export interface BusquedaPacienteProps {
  onPacienteSeleccionado?: (paciente: PacienteForm) => void;
  valoresIniciales?: PacienteForm;
  mostrarMensajeAyuda?: boolean;
   mostrarBotonHistorial?: boolean;
   resetear?: boolean;
}

export interface BusquedaPacienteState {
  terminoBusqueda: string;
  pacienteEncontrado: PacienteForm | PacienteForm[] | null;
  buscando: boolean;
  error: string;
  tipoBusqueda: TipoBusqueda;
}

export interface IconoTipoInfo {
  icon: React.ReactNode;
  texto: string;
  color: string;
}