
export interface Caracteristica {
    iid_caracteristica: number;
    vnombre_caracteristica: string;
    bactivo: boolean;
}


export interface CaracteristicaForm {
    vnombre_caracteristica: string;
    bactivo?: boolean;
}

export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data?: T;
}