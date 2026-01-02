import type { FormularioPacienteData } from '@models/Pacientes/Pacientes.types';

export interface ValidationError {
    field: string;
    message: string;
}

export interface ValidationResult {
    isValid: boolean;
    errors: ValidationError[];
}

export const validateFormularioPaciente = (
formData: FormularioPacienteData, p0: boolean): ValidationResult => {
    const errors: ValidationError[] = [];

    if (!formData.ci || formData.ci.trim() === '') {
        errors.push({ field: 'ci', message: 'La cédula de identidad es obligatoria' });
    } else if (formData.ci.length < 10) {
        errors.push({ field: 'ci', message: 'La cédula debe tener 10 dígitos' });
    }

    if (!formData.nombres || formData.nombres.trim() === '') {
        errors.push({ field: 'nombres', message: 'Los nombres son obligatorios' });
    }

    if (!formData.primerApellido || formData.primerApellido.trim() === '') {
        errors.push({ field: 'primerApellido', message: 'El primer apellido es obligatorio' });
    }

    if (!formData.fechaNacimiento) {
        errors.push({ field: 'fechaNacimiento', message: 'La fecha de nacimiento es obligatoria' });
    }

    if (!formData.sexo || formData.sexo === '') {
        errors.push({ field: 'sexo', message: 'El sexo es obligatorio' });
    }

    if (!formData.estadoCivil || formData.estadoCivil === '') {
        errors.push({ field: 'estadoCivil', message: 'El estado civil es obligatorio' });
    }

    if (!formData.direccionDomicilio || formData.direccionDomicilio.trim() === '') {
        errors.push({ field: 'direccionDomicilio', message: 'La dirección de domicilio es obligatoria' });
    }

    if (!formData.idPais || formData.idPais === '') {
        errors.push({ field: 'idPais', message: 'El país es obligatorio' });
    }

    if (!formData.idProvincia || formData.idProvincia === '') {
        errors.push({ field: 'idProvincia', message: 'La provincia es obligatoria' });
    }

    if (!formData.idCiudad || formData.idCiudad === '') {
        errors.push({ field: 'idCiudad', message: 'La ciudad es obligatoria' });
    }

    if (!formData.celular || formData.celular.trim() === '') {
        errors.push({ field: 'celular', message: 'El celular es obligatorio' });
    } else if (formData.celular.length < 10) {
        errors.push({ field: 'celular', message: 'El celular debe tener al menos 10 dígitos' });
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};


export const formatValidationErrors = (errors: ValidationError[]): string => {
    if (errors.length === 0) return '';
    
    const errorMessages = errors.map(error => `• ${error.message}`).join('\n');
    return `Por favor corrija los siguientes errores:\n\n${errorMessages}`;
};

export const hasFieldError = (errors: ValidationError[], fieldName: string): boolean => {
    return errors.some(error => error.field === fieldName);
};


export const getFieldError = (errors: ValidationError[], fieldName: string): string | null => {
    const error = errors.find(error => error.field === fieldName);
    return error ? error.message : null;
};