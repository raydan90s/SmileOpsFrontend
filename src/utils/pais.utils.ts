import type { Pais } from "@models/Paises/Paises.types";

export const encontrarEcuador = (paises: Pais[]): Pais | undefined => {
    return paises.find(p => p.vnombre === "Ecuador");
};