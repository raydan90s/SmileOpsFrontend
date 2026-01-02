import type { FormularioPacienteData } from "@models/Pacientes/Pacientes.types";
export const ESTADOS_CIVILES = [
    'Soltero/a',
    'Casado/a',
    'Divorciado/a',
    'Viudo/a',
    'Unión Libre'
] as const;

export const SEXOS = ['Masculino', 'Femenino'] as const;

export const NACIONALIDADES_MAP: Record<string, string> = {
    'Ecuador': 'Ecuatoriana',
    'Colombia': 'Colombiana',
    'Perú': 'Peruana',
    'Venezuela': 'Venezolana',
    'Argentina': 'Argentina',
    'Chile': 'Chilena',
    'México': 'Mexicana',
    'España': 'Española',
    'Estados Unidos': 'Estadounidense'
};

export const FORM_INITIAL_STATE: FormularioPacienteData = {
    ficha: "",
    fechaActual: new Date().toISOString().split('T')[0],
    ci: "",
    nombres: "",
    primerApellido: "",
    segundoApellido: "",
    otros: "",
    fechaNacimiento: "",
    nacionalidad: "",
    estadoCivil: "Soltero/a",
    edad: "",
    sexo: "",
    direccionDomicilio: "",
    idPais: "",
    pais: "",
    idProvincia: "",
    provincia: "",
    idCiudad: "",
    ciudad: "",
    celular: "",
    empresa: "",
    ocupacion: "",
    direccionTrabajo: "",
    idPaisTrabajo: "",
    paisTrabajo: "",
    idProvinciaTrabajo: "",
    provinciaTrabajo: "",
    idCiudadTrabajo: "",
    ciudadTrabajo: "",
    telefonoTrabajo: "",
    email: "",
    recomendadoPor: ""
};
