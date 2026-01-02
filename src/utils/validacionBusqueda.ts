import type { TipoBusqueda } from '@models/Busqueda/BusquedaPaciente.types';

export const detectarTipoBusqueda = (valor: string): TipoBusqueda => {
  const valorLimpio = valor.trim();

  if (!valorLimpio) return '';

  if (/^\d{1,7}$/.test(valorLimpio)) {
    return 'codigo';
  }

  if (/^\d{10}$/.test(valorLimpio)) {
    return 'cedula';
  }

  if (/[a-zA-ZáéíóúÁÉÍÓÚñÑ]/.test(valorLimpio)) {
    return 'nombre';
  }

  return 'codigo';
};

export const validarTerminoBusqueda = (
  termino: string
): { valido: boolean; error?: string } => {
  const valorLimpio = termino.trim();

  if (!valorLimpio) {
    return {
      valido: false,
      error: 'Por favor ingrese un término de búsqueda'
    };
  }

  return { valido: true };
};

export const obtenerMensajeError = (tipo: TipoBusqueda): string => {
  switch (tipo) {
    case 'codigo':
      return 'No se encontró ningún paciente con ese código';
    case 'cedula':
      return 'No se encontró ningún paciente con esa cédula';
    case 'nombre':
      return 'No se encontró ningún paciente con ese nombre';
    default:
      return 'No se encontró ningún paciente';
  }
};

export const formatearCedula = (cedula: string): string => {
  const limpia = cedula.replace(/\D/g, '');
  
  if (limpia.length !== 10) return cedula;
  
  return `${limpia.slice(0, 3)}-${limpia.slice(3, 6)}-${limpia.slice(6)}`;
};

export const normalizarTerminoBusqueda = (
  termino: string,
  tipo: TipoBusqueda
): string => {
  const valorLimpio = termino.trim();

  switch (tipo) {
    case 'codigo':
    case 'cedula':
      return valorLimpio.replace(/\D/g, '');
    
    case 'nombre':
      return valorLimpio.replace(/\s+/g, ' ');
    
    default:
      return valorLimpio;
  }
};

export const validarCedulaEcuatoriana = (cedula: string): boolean => {
  const limpia = cedula.replace(/\D/g, '');
  
  if (limpia.length !== 10) return false;
  
  const provincia = parseInt(limpia.substring(0, 2), 10);
  if (provincia < 1 || provincia > 24) return false;
  
  const coeficientes = [2, 1, 2, 1, 2, 1, 2, 1, 2];
  const digitoVerificador = parseInt(limpia[9], 10);
  let suma = 0;
  
  for (let i = 0; i < 9; i++) {
    let valor = parseInt(limpia[i], 10) * coeficientes[i];
    if (valor >= 10) valor -= 9;
    suma += valor;
  }
  
  const resultado = suma % 10 === 0 ? 0 : 10 - (suma % 10);
  
  return resultado === digitoVerificador;
};