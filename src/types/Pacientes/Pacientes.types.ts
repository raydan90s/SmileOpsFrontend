export interface FormularioPacienteData {
    ficha: string;
    fechaActual: string;
    ci: string;
    nombres: string;
    primerApellido: string;
    segundoApellido: string;
    otros: string;
    fechaNacimiento: string;
    nacionalidad: string;
    estadoCivil: string;
    edad: string;
    sexo: string;
    direccionDomicilio: string;
    idPais: string;
    pais: string;
    idProvincia: string;
    provincia: string;
    idCiudad: string;
    ciudad: string;
    celular: string;
    empresa: string;
    ocupacion: string;
    direccionTrabajo: string;
    idPaisTrabajo: string;
    paisTrabajo: string;
    idProvinciaTrabajo: string;
    provinciaTrabajo: string;
    idCiudadTrabajo: string;
    ciudadTrabajo: string;
    telefonoTrabajo: string;
    email: string;
    recomendadoPor: string;
    vrutafoto?: string;
}

export interface FormularioPacienteProps {
    onCancel?: () => void;
}

export interface PacienteDB {
  iidpaciente?: number;  
  vcedula: string;
  vnombres: string;
  vprimerapellido: string;
  vsegundoapellido?: string;
  votrosapellidos?: string;
  dfechanacimiento: string;
  csexo: string;
  iedad: number;
  vdireccion: string;
  iidciudad: number;
  iidpais: number;
  vtelefonocasa?: string;
  vtelefonotrabajo?: string;
  vcelular: string;
  vfax?: string;  
  vemail?: string;
  vestadocivil?: string;
  vocupacion?: string;
  vlugartrabajo?: string;
  vdirecciontrabajo?: string;
  iidciudadtrabajo?: number;
  iidnacionalidad?: number;
  vrecomendadopor?: string;
  vrutafoto?: string;
  cestado?: boolean;
}