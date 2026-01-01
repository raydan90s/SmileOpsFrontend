import { useAuth } from '@context/AuthContext';
import { allModules } from '@data/Modulos/modulos';
import type { Module } from '@data/Modulos/modulos';
import { moduleKeyMap } from '@utils/mapPermisos';

export const useModules = (): Module[] => {
  const { permisos } = useAuth();
  
  if (!permisos) return [];
  
  return allModules.filter(m => {
    const codigoBackend = Object.keys(moduleKeyMap).find(
      code => moduleKeyMap[code] === m.key
    );
    return codigoBackend && Object.values(permisos[codigoBackend]).some(v => v === true);
  });
};