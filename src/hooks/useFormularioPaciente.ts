import React from "react";
import type { Pais } from "@models/Paises/Paises.types";
import type { FormularioPacienteData, PacienteDB } from "@models/Pacientes/Pacientes.types";
import { FORM_INITIAL_STATE } from "@data/constants";
import { encontrarEcuador } from "@utils/pais.utils";
import { calcularEdad } from "@utils/edad.utils";
import { obtenerSiguienteFicha } from "@services/Ficha/ficha.service";
import { obtenerPacienteCompleto } from "@services/Pacientes/Pacientes.service";
import { useUbicacion } from "@hooks/useUbicacion";

export const useFormularioPaciente = (paises: Pais[]) => {
    const [formData, setFormData] = React.useState<FormularioPacienteData>(FORM_INITIAL_STATE);
    const [resetCounter, setResetCounter] = React.useState(0);
    const [isLoadingPaciente, setIsLoadingPaciente] = React.useState(false);

    const ubicacionDomicilio = useUbicacion(formData.idPais, formData.idProvincia, { autoLoad: true });

    const ubicacionTrabajo = useUbicacion(formData.idPaisTrabajo, formData.idProvinciaTrabajo, { autoLoad: true });

    React.useEffect(() => {
        if (paises.length > 0 && !formData.idPais) {
            const ecuador = encontrarEcuador(paises);
            if (ecuador) {
                setFormData(prev => ({
                    ...prev,
                    idPais: ecuador.iidpais.toString(),
                    pais: ecuador.vnombre,
                    idPaisTrabajo: ecuador.iidpais.toString(),
                    paisTrabajo: ecuador.vnombre,
                    nacionalidad: ecuador.iidpais.toString()
                }));
            }
        }
    }, [paises, formData.idPais]);

    React.useEffect(() => {
        if (formData.fechaNacimiento) {
            const edad = calcularEdad(formData.fechaNacimiento);
            setFormData(prev => ({ ...prev, edad: edad.toString() }));
        }
    }, [formData.fechaNacimiento]);

    React.useEffect(() => {
        const cargarFicha = async () => {
            try {
                const siguienteFicha = await obtenerSiguienteFicha();
                setFormData(prev => ({ ...prev, ficha: siguienteFicha.toString() }));
            } catch (error) {
                console.error('Error al cargar la ficha:', error);
            }
        };
        cargarFicha();
    }, [resetCounter]);

    const updateFormData = React.useCallback((updates: Partial<FormularioPacienteData>) => {
        setFormData(prev => ({ ...prev, ...updates }));
    }, []);

    const mapearPacienteAFormulario = React.useCallback((paciente: PacienteDB): FormularioPacienteData => {
        const fechaNac = new Date(paciente.dfechanacimiento);
        const hoy = new Date();
        let edad = hoy.getFullYear() - fechaNac.getFullYear();
        const mesActual = hoy.getMonth();
        const mesNacimiento = fechaNac.getMonth();
        if (mesActual < mesNacimiento || (mesActual === mesNacimiento && hoy.getDate() < fechaNac.getDate())) {
            edad--;
        }

        const fechaNacimientoFormatted = paciente.dfechanacimiento
            ? new Date(paciente.dfechanacimiento).toISOString().split('T')[0]
            : '';

        return {
            ficha: paciente.iidpaciente?.toString() || '',
            ci: paciente.vcedula || '',
            nombres: paciente.vnombres || '',
            primerApellido: paciente.vprimerapellido || '',
            segundoApellido: paciente.vsegundoapellido || '',
            otros: paciente.votrosapellidos || '',
            fechaNacimiento: fechaNacimientoFormatted,
            nacionalidad: paciente.iidnacionalidad?.toString() || '',
            estadoCivil: paciente.vestadocivil || '',
            edad: edad.toString(),
            sexo: paciente.csexo === 'M' ? 'Masculino' :
                paciente.csexo === 'F' ? 'Femenino' : 'Otro',
            direccionDomicilio: paciente.vdireccion || '',
            idPais: paciente.iidpais?.toString() || '',
            idCiudad: paciente.iidciudad?.toString() || '',
            celular: paciente.vcelular || '',
            empresa: paciente.vlugartrabajo || '',
            ocupacion: paciente.vocupacion || '',
            direccionTrabajo: paciente.vdirecciontrabajo || '',
            idCiudadTrabajo: paciente.iidciudadtrabajo?.toString() || '',
            telefonoTrabajo: paciente.vtelefonotrabajo || '',
            email: paciente.vemail || '',
            recomendadoPor: paciente.vrecomendadopor || '',
            fechaActual: new Date().toISOString().split('T')[0],
            pais: '',
            idProvincia: '',
            provincia: '',
            ciudad: '',
            idPaisTrabajo: '',
            paisTrabajo: '',
            idProvinciaTrabajo: '',
            provinciaTrabajo: '',
            ciudadTrabajo: ''
        };
    }, []);

    const cargarPaciente = React.useCallback(async (pacienteId: string) => {
        try {
            setIsLoadingPaciente(true);
            const paciente = await obtenerPacienteCompleto(pacienteId);

            if (!paciente) {
                throw new Error('Paciente no encontrado');
            }

            const datosFormulario = mapearPacienteAFormulario(paciente);
            updateFormData(datosFormulario);

            if (paciente.iidciudad) {
                const infoDomicilio = await ubicacionDomicilio.cargarUbicacionPorCiudad(paciente.iidciudad);
                if (infoDomicilio) {
                    updateFormData({
                        ...datosFormulario,
                        idProvincia: infoDomicilio.provinciaId?.toString() || ''
                    });
                }
            }

            if (paciente.iidciudadtrabajo) {
                const infoTrabajo = await ubicacionTrabajo.cargarUbicacionPorCiudad(paciente.iidciudadtrabajo);
                if (infoTrabajo) {
                    updateFormData({
                        idPaisTrabajo: infoTrabajo.paisId?.toString() || '',
                        idProvinciaTrabajo: infoTrabajo.provinciaId?.toString() || ''
                    });
                }
            }

            return paciente;
        } catch (error) {
            console.error('Error al cargar paciente:', error);
            throw error;
        } finally {
            setIsLoadingPaciente(false);
        }
    }, [mapearPacienteAFormulario, updateFormData, ubicacionDomicilio, ubicacionTrabajo]);

    const resetFormData = React.useCallback(async () => {
        try {
            ubicacionDomicilio.resetTodo();
            ubicacionTrabajo.resetTodo();

            const siguienteFicha = await obtenerSiguienteFicha();

            const initialData: FormularioPacienteData = {
                ...FORM_INITIAL_STATE,
                ficha: siguienteFicha.toString(),
                fechaActual: new Date().toISOString().split('T')[0]
            };

            if (paises.length > 0) {
                const ecuador = encontrarEcuador(paises);
                if (ecuador) {
                    initialData.idPais = ecuador.iidpais.toString();
                    initialData.pais = ecuador.vnombre;
                    initialData.idPaisTrabajo = ecuador.iidpais.toString();
                    initialData.paisTrabajo = ecuador.vnombre;
                    initialData.nacionalidad = ecuador.iidpais.toString();
                }
            }

            setFormData(initialData);
            setResetCounter(prev => prev + 1);

        } catch (error) {
            console.error('Error al reiniciar el formulario:', error);
            setFormData({
                ...FORM_INITIAL_STATE,
                fechaActual: new Date().toISOString().split('T')[0]
            });
            setResetCounter(prev => prev + 1);
        }
    }, [paises, ubicacionDomicilio, ubicacionTrabajo]);

    return {
        formData,
        isLoadingPaciente,
        resetCounter,

        ubicacionDomicilio,
        ubicacionTrabajo,

        updateFormData,
        resetFormData,
        cargarPaciente,
        mapearPacienteAFormulario
    };
};