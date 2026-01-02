import { createContext, useState, useContext, useEffect, type ReactNode } from "react";
import {
  fetchAllConsultorios,
  createConsultorio,
  updateConsultorio,
  deleteConsultorio,
} from "@services/Consultorios/Consultorios.service";
import type { Consultorio } from "@models/Consultorios/Consultorios.types";

interface ConsultoriosContextType {
  consultorios: Consultorio[];
  loading: boolean;
  fetchConsultorios: () => Promise<void>;
  agregarConsultorio: (
    nuevo: Omit<Consultorio, "iidconsultorio" | "dfechacreacion">
  ) => Promise<void>;
  actualizarConsultorio: (
    id: number,
    actualizacion: Partial<Omit<Consultorio, "iidconsultorio" | "dfechacreacion">>
  ) => Promise<void>;
  eliminarConsultorio: (id: number) => Promise<void>;
}

const ConsultoriosContext = createContext<ConsultoriosContextType>({
  consultorios: [],
  loading: true,
  fetchConsultorios: async () => {},
  agregarConsultorio: async () => {},
  actualizarConsultorio: async () => {},
  eliminarConsultorio: async () => {},
});

export const ConsultoriosProvider = ({ children }: { children: ReactNode }) => {
  const [consultorios, setConsultorios] = useState<Consultorio[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchConsultoriosData = async () => {
    setLoading(true);
    try {
      const data = await fetchAllConsultorios();
      setConsultorios(data);
    } catch (err) {
      console.error("Error al cargar consultorios:", err);
    } finally {
      setLoading(false);
    }
  };

  const agregarConsultorio = async (
    nuevo: Omit<Consultorio, "iidconsultorio" | "dfechacreacion">
  ) => {
    try {
      const creado = await createConsultorio(nuevo);
      setConsultorios((prev) => [...prev, creado]);
    } catch (err) {
      console.error("Error al agregar consultorio:", err);
      throw err;
    }
  };

  const actualizarConsultorioFn = async (
    id: number,
    actualizacion: Partial<Omit<Consultorio, "iidconsultorio" | "dfechacreacion">>
  ) => {
    try {
      const actualizado = await updateConsultorio(id, actualizacion);
      setConsultorios((prev) =>
        prev.map((c) => (c.iidconsultorio === id ? actualizado : c))
      );
    } catch (err) {
      console.error("Error al actualizar consultorio:", err);
      throw err;
    }
  };

  const eliminarConsultorioFn = async (id: number) => {
    try {
      await deleteConsultorio(id);
      setConsultorios((prev) => prev.filter((c) => c.iidconsultorio !== id));
    } catch (err) {
      console.error("Error al eliminar consultorio:", err);
      throw err;
    }
  };

  useEffect(() => {
    fetchConsultoriosData();
  }, []);

  return (
    <ConsultoriosContext.Provider
      value={{
        consultorios,
        loading,
        fetchConsultorios: fetchConsultoriosData,
        agregarConsultorio,
        actualizarConsultorio: actualizarConsultorioFn,
        eliminarConsultorio: eliminarConsultorioFn,
      }}
    >
      {children}
    </ConsultoriosContext.Provider>
  );
};

export const useConsultorios = () => useContext(ConsultoriosContext);