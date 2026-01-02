import type { FormularioPacienteData } from '@models/Pacientes/Pacientes.types';
import type { Pais } from '@models/Paises/Paises.types';
import type { Provincia} from '@models/Ubicacion/Provincia.types';
import type { Ciudad } from '@models/Ubicacion/Ciudad.types';

interface HandlersConfig {
    paises: Pais[];
    provincias: Provincia[];
    ciudades: Ciudad[];
    provinciasTrabajo: Provincia[];
    ciudadesTrabajo: Ciudad[];
    updateFormData: (updates: Partial<FormularioPacienteData>) => void;
    resetProvinciasDomicilio: () => void;
    resetCiudadesDomicilio: () => void;
    resetProvinciasTrabajo: () => void;
    resetCiudadesTrabajo: () => void;
}

export const createFormHandlers = (config: HandlersConfig) => {
    const {
        paises,
        provincias,
        ciudades,
        provinciasTrabajo,
        ciudadesTrabajo,
        updateFormData,
        resetProvinciasDomicilio,
        resetCiudadesDomicilio,
        resetProvinciasTrabajo,
        resetCiudadesTrabajo
    } = config;

    return {
        handlePaisChange: (value: string) => {
            const pais = paises.find(p => p.iidpais.toString() === value);
            updateFormData({
                idPais: value,
                pais: pais?.vnombre || "",
                idProvincia: "",
                provincia: "",
                idCiudad: "",
                ciudad: ""
            });
            resetProvinciasDomicilio();
        },

        handleProvinciaChange: (value: string) => {
            const provincia = provincias.find(p => p.iidprovincia.toString() === value);
            updateFormData({
                idProvincia: value,
                provincia: provincia?.vnombre || "",
                idCiudad: "",
                ciudad: ""
            });
            resetCiudadesDomicilio();
        },

        handleCiudadChange: (value: string) => {
            const ciudad = ciudades.find(c => c.iidciudad.toString() === value);
            updateFormData({
                idCiudad: value,
                ciudad: ciudad?.vnombre || ""
            });
        },

        handlePaisTrabajoChange: (value: string) => {
            const pais = paises.find(p => p.iidpais.toString() === value);
            updateFormData({
                idPaisTrabajo: value,
                paisTrabajo: pais?.vnombre || "",
                idProvinciaTrabajo: "",
                provinciaTrabajo: "",
                idCiudadTrabajo: "",
                ciudadTrabajo: ""
            });
            resetProvinciasTrabajo();
        },

        handleProvinciaTrabajoChange: (value: string) => {
            const provincia = provinciasTrabajo.find(p => p.iidprovincia.toString() === value);
            updateFormData({
                idProvinciaTrabajo: value,
                provinciaTrabajo: provincia?.vnombre || "",
                idCiudadTrabajo: "",
                ciudadTrabajo: ""
            });
            resetCiudadesTrabajo();
        },

        handleCiudadTrabajoChange: (value: string) => {
            const ciudad = ciudadesTrabajo.find(c => c.iidciudad.toString() === value);
            updateFormData({
                idCiudadTrabajo: value,
                ciudadTrabajo: ciudad?.vnombre || ""
            });
        },

        handleFieldChange: (name: string, value: string) => {
            updateFormData({ [name]: value });
        }
    };
};