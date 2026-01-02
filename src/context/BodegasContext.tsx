import { createContext, useState, useContext, useEffect, type ReactNode } from "react";
import { 
  fetchAllBodegas, 
  createBodega, 
  updateBodega, 
  deleteBodega 
} from "@services/Bodegas/bodegas.service";

import type { Bodega } from "@models/Bodegas/Bodegas.types";

interface BodegasContextType {
  bodegas: Bodega[];
  loading: boolean;
  fetchBodegas: (iid_tipo_bodega?: number) => Promise<void>;
  agregarBodega: (nuevaBodega: Omit<Bodega, "iid_bodega">) => Promise<void>;
  actualizarBodega: (id: number, bodega: Omit<Bodega, "iid_bodega">) => Promise<void>;
  eliminarBodega: (id: number) => Promise<void>;
}

const BodegasContext = createContext<BodegasContextType>({
  bodegas: [],
  loading: true,
  fetchBodegas: async () => {},
  agregarBodega: async () => {},
  actualizarBodega: async () => {},
  eliminarBodega: async () => {},
});

export const BodegasProvider = ({ children }: { children: ReactNode }) => {
  const [bodegas, setBodegas] = useState<Bodega[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchBodegas = async (iid_tipo_bodega?: number) => {
    setLoading(true);
    try {
      const data = await fetchAllBodegas(iid_tipo_bodega);
      setBodegas(data);
    } catch (err) {
      console.error("Error al cargar bodegas:", err);
    } finally {
      setLoading(false);
    }
  };

  const agregarBodega = async (nuevaBodega: Omit<Bodega, "iid_bodega">) => {
    try {
      const bodegaCreada = await createBodega(nuevaBodega);
      setBodegas((prev) => [...prev, bodegaCreada]);
    } catch (err) {
      console.error("Error al agregar bodega:", err);
    }
  };

  const actualizarBodega = async (id: number, bodegaActualizada: Omit<Bodega, "iid_bodega">) => {
    try {
      const bodega = await updateBodega(id, bodegaActualizada);
      setBodegas((prev) => prev.map((b) => (b.iid_bodega === id ? bodega : b)));
    } catch (err) {
      console.error("Error al actualizar bodega:", err);
    }
  };

  const eliminarBodega = async (id: number) => {
    try {
      await deleteBodega(id);
      setBodegas((prev) => prev.filter((b) => b.iid_bodega !== id));
    } catch (err) {
      console.error("Error al eliminar bodega:", err);
    }
  };

  useEffect(() => {
    fetchBodegas();
  }, []);

  return (
    <BodegasContext.Provider 
      value={{ bodegas, loading, fetchBodegas, agregarBodega, actualizarBodega, eliminarBodega }}
    >
      {children}
    </BodegasContext.Provider>
  );
};

export const useBodegas = () => useContext(BodegasContext);