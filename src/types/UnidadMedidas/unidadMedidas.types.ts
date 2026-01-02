export interface Unidad {
    iidunidad: number;
    vnombreunidad: string;
    vabreviatura: string | null;
    bactivo: boolean;
}

export interface UnidadForm {
    vnombreunidad: string;
    vabreviatura?: string | null;
    bactivo?: boolean;
}

export interface CreateUnidadData {
    vnombreunidad: string;
    vabreviatura?: string | null;
    bactivo?: boolean;
}

export interface UpdateUnidadData {
    vnombreunidad?: string;
    vabreviatura?: string | null;
    bactivo?: boolean;
}

export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data?: T;
}