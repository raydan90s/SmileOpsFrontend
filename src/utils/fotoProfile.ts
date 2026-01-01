import type { Usuario } from '@models/Login/usuario.types';

export const getInitials = (usuario: Usuario | null): string => {
  if (!usuario) return 'U';
  
  const nombres = usuario.vNombres?.trim() || '';
  const apellidos = usuario.vApellidos?.trim() || '';
  
  const primeraLetraNombre = nombres.charAt(0).toUpperCase();
  const primeraLetraApellido = apellidos.charAt(0).toUpperCase();
  
  return `${primeraLetraNombre}${primeraLetraApellido}` || 'U';
};