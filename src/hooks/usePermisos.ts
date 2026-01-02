import { useMemo } from 'react';
import { useAuth } from '@context/AuthContext';
import type { PermisoModulo } from '@models/Permisos/Permisos.types';

export const usePermisos = (codigoModulo: string) => {
    const { permisos: permisosUsuario } = useAuth();
    
    const permisos = useMemo((): PermisoModulo => {
        if (!permisosUsuario || !permisosUsuario[codigoModulo]) {
            return {
                lectura: false,
                escritura: false,
                eliminacion: false,
                administracion: false
            };
        }
        return permisosUsuario[codigoModulo];
    }, [permisosUsuario, codigoModulo]);

    const puedeVer = permisos.lectura;
    const puedeCrear = permisos.escritura;
    const puedeEditar = permisos.escritura;
    const puedeEliminar = permisos.eliminacion;
    const puedeAdministrar = permisos.administracion;

    const puedeAprobar = permisos.administracion;
    const puedeRechazar = permisos.administracion;
    const puedeMarcarRecibido = permisos.escritura || permisos.administracion;

    const tieneAlgunPermiso = (...tipos: Array<keyof PermisoModulo>): boolean => {
        return tipos.some(tipo => permisos[tipo]);
    };

    const tieneTodosPermisos = (...tipos: Array<keyof PermisoModulo>): boolean => {
        return tipos.every(tipo => permisos[tipo]);
    };

    const alertaSinPermisos = (accion: string = 'realizar esta acción') => {
        alert(`⚠️ No tienes permisos para ${accion}`);
    };

    const verificarYEjecutar = (
        tipoPermiso: keyof PermisoModulo,
        callback: () => void,
        mensajeError?: string
    ) => {
        if (permisos[tipoPermiso]) {
            callback();
        } else {
            alertaSinPermisos(mensajeError);
        }
    };

    return {
        permisos,
        puedeVer,
        puedeCrear,
        puedeEditar,
        puedeEliminar,
        puedeAdministrar,

        puedeAprobar,
        puedeRechazar,
        puedeMarcarRecibido,

        tieneAlgunPermiso,
        tieneTodosPermisos,
        alertaSinPermisos,
        verificarYEjecutar
    };
};