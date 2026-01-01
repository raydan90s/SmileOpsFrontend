
export interface Marca {
    iid_marca: number;
    vnombre_marca: string;
    bactivo: boolean;
}


export interface MarcaForm {
    vnombre_marca: string;
    bactivo?: boolean;
}


export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data?: T;
}