import { useState, useEffect, useCallback } from "react";
import type { Provincia } from "@models/Ubicacion/Provincia.types";
import type { Ciudad } from "@models/Ubicacion/Ciudad.types";
import { obtenerProvincias, obtenerCiudades, obtenerCiudadPorId } from "@services/Ubicacion/Ubicacion.service";

interface UseUbicacionOptions {
    autoLoad?: boolean; 
}

export const useUbicacion = (idPais?: string, idProvincia?: string, options: UseUbicacionOptions = { autoLoad: true }) => {
    const [provincias, setProvincias] = useState<Provincia[]>([]);
    const [ciudades, setCiudades] = useState<Ciudad[]>([]);
    const [cargandoProvincias, setCargandoProvincias] = useState(false);
    const [cargandoCiudades, setCargandoCiudades] = useState(false);

    const cargarProvincias = useCallback(async (paisId: string | number) => {
        if (!paisId) {
            setProvincias([]);
            return [];
        }

        try {
            setCargandoProvincias(true);
            const data = await obtenerProvincias(Number(paisId));
            setProvincias(data || []);
            return data || [];
        } catch (error) {
            console.error('Error al cargar provincias:', error);
            setProvincias([]);
            return [];
        } finally {
            setCargandoProvincias(false);
        }
    }, []);

    const cargarCiudades = useCallback(async (provinciaId?: string | number, paisId?: string | number) => {
        if (!provinciaId && !paisId) {
            setCiudades([]);
            return [];
        }

        try {
            setCargandoCiudades(true);
            const data = await obtenerCiudades(
                provinciaId ? Number(provinciaId) : undefined,
                paisId ? Number(paisId) : undefined
            );
            setCiudades(data || []);
            return data || [];
        } catch (error) {
            console.error('Error al cargar ciudades:', error);
            setCiudades([]);
            return [];
        } finally {
            setCargandoCiudades(false);
        }
    }, []);

    const obtenerInfoCiudad = useCallback(async (ciudadId: number) => {
        try {
            const ciudad = await obtenerCiudadPorId(ciudadId);
            return ciudad;
        } catch (error) {
            console.error('Error al obtener información de ciudad:', error);
            return null;
        }
    }, []);

    const cargarUbicacionPorCiudad = useCallback(async (ciudadId: number) => {
        try {
            const ciudad = await obtenerCiudadPorId(ciudadId);
            if (!ciudad) return null;

            const resultados = {
                ciudad,
                paisId: ciudad.iidpais,
                provinciaId: ciudad.iidprovincia
            };

            if (ciudad.iidpais) {
                await cargarProvincias(ciudad.iidpais);
            }

            if (ciudad.iidprovincia) {
                await cargarCiudades(ciudad.iidprovincia);
            }

            return resultados;
        } catch (error) {
            console.error('Error al cargar ubicación por ciudad:', error);
            return null;
        }
    }, [cargarProvincias, cargarCiudades]);

    useEffect(() => {
        if (options.autoLoad && idPais) {
            cargarProvincias(idPais);
        } else if (!idPais) {
            setProvincias([]);
            setCiudades([]);
        }
    }, [idPais, cargarProvincias, options.autoLoad]);

    useEffect(() => {
        if (options.autoLoad && idProvincia) {
            cargarCiudades(idProvincia);
        } else if (!idProvincia) {
            setCiudades([]);
        }
    }, [idProvincia, cargarCiudades, options.autoLoad]);

    const resetProvincias = useCallback(() => {
        setProvincias([]);
        setCiudades([]);
    }, []);

    const resetCiudades = useCallback(() => {
        setCiudades([]);
    }, []);

    const resetTodo = useCallback(() => {
        setProvincias([]);
        setCiudades([]);
    }, []);

    return {
        provincias,
        ciudades,
        cargandoProvincias,
        cargandoCiudades,
        
        cargarProvincias,
        cargarCiudades,
        obtenerInfoCiudad,
        cargarUbicacionPorCiudad,
        
        resetProvincias,
        resetCiudades,
        resetTodo
    };
};