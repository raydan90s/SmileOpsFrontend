import { createContext, useState, useContext, useEffect, type ReactNode } from "react";
import { fetchAllPaises, createPais, updatePais, deletePais } from "@services/Paises/paises.service";

import type { Pais } from "@models/Paises/Paises.types"; 

interface PaisesContextType {
  paises: Pais[];
  loading: boolean;
  fetchPaises: () => Promise<void>;
  agregarPais: (nuevoPais: Omit<Pais, "iidpais">) => Promise<void>;
  actualizarPais: (id: number, pais: Omit<Pais, "iidpais">) => Promise<void>;
  eliminarPais: (id: number) => Promise<void>;
}

const PaisesContext = createContext<PaisesContextType>({
  paises: [],
  loading: true,
  fetchPaises: async () => {},
  agregarPais: async () => {},
  actualizarPais: async () => {},
  eliminarPais: async () => {},
});

export const PaisesProvider = ({ children }: { children: ReactNode }) => {
  const [paises, setPaises] = useState<Pais[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchPaises = async () => {
    setLoading(true);
    try {
      const data = await fetchAllPaises();
      setPaises(data);
    } catch (err) {
      console.error("Error al cargar países:", err);
    } finally {
      setLoading(false);
    }
  };

  const agregarPais = async (nuevoPais: Omit<Pais, "iidpais">) => {
    try {
      const paisCreado = await createPais(nuevoPais);
      setPaises((prev) => [...prev, paisCreado]);
    } catch (err) {
      console.error("Error al agregar país:", err);
    }
  };

  const actualizarPais = async (id: number, paisActualizado: Omit<Pais, "iidpais">) => {
    try {
      const pais = await updatePais(id, paisActualizado);
      setPaises((prev) => prev.map((p) => (p.iidpais === id ? pais : p)));
    } catch (err) {
      console.error("Error al actualizar país:", err);
    }
  };

  const eliminarPais = async (id: number) => {
    try {
      await deletePais(id);
      setPaises((prev) => prev.filter((p) => p.iidpais !== id));
    } catch (err) {
      console.error("Error al eliminar país:", err);
    }
  };

  useEffect(() => {
    fetchPaises();
  }, []);

  return (
    <PaisesContext.Provider 
      value={{ paises, loading, fetchPaises, agregarPais, actualizarPais, eliminarPais }}
    >
      {children}
    </PaisesContext.Provider>
  );
};

export const usePaises = () => useContext(PaisesContext);
