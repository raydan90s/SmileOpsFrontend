import { createContext, useState, useContext, useEffect, type ReactNode } from "react";
import type { Doctor } from "@models/Doctor/Doctor.types";
import {
  fetchAllDoctores,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
} from "@services/Doctor/Doctor.service";

interface DoctorContextType {
  doctores: Doctor[];
  doctorSeleccionado: Doctor | null;
  loading: boolean;
  fetchDoctores: () => Promise<void>;
  seleccionarDoctor: (id: number) => Promise<void>;
  agregarDoctor: (nuevoDoctor: Omit<Doctor, "iiddoctor">) => Promise<void>;
  actualizarDoctor: (
    id: number,
    doctorActualizado: Omit<Doctor, "iiddoctor">
  ) => Promise<void>;
  eliminarDoctor: (id: number) => Promise<void>;
}

const DoctorContext = createContext<DoctorContextType>({
  doctores: [],
  doctorSeleccionado: null,
  loading: true,
  fetchDoctores: async () => {},
  seleccionarDoctor: async () => {},
  agregarDoctor: async () => {},
  actualizarDoctor: async () => {},
  eliminarDoctor: async () => {},
});

export const DoctorProvider = ({ children }: { children: ReactNode }) => {
  const [doctores, setDoctores] = useState<Doctor[]>([]);
  const [doctorSeleccionado, setDoctorSeleccionado] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchDoctores = async () => {
    setLoading(true);
    try {
      const data = await fetchAllDoctores();
      setDoctores(data);
    } catch (err) {
      console.error("Error al cargar doctores:", err);
    } finally {
      setLoading(false);
    }
  };

  const seleccionarDoctor = async (id: number) => {
    setLoading(true);
    try {
      const doctor = await getDoctorById(id);
      setDoctorSeleccionado(doctor);
    } catch (err) {
      console.error("Error al seleccionar doctor:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const agregarDoctor = async (nuevoDoctor: Omit<Doctor, "iiddoctor">) => {
    try {
      const doctorCreado = await createDoctor(nuevoDoctor);
      setDoctores((prev) => [...prev, doctorCreado]);
    } catch (err) {
      console.error("Error al agregar doctor:", err);
      throw err;
    }
  };

  const actualizarDoctor = async (
    id: number,
    doctorActualizado: Omit<Doctor, "iiddoctor">
  ) => {
    try {
      const doctor = await updateDoctor(id, doctorActualizado);
      setDoctores((prev) => prev.map((d) => (d.iiddoctor === id ? doctor : d)));
    } catch (err) {
      console.error("Error al actualizar doctor:", err);
      throw err;
    }
  };

  const eliminarDoctor = async (id: number) => {
    try {
      await deleteDoctor(id);
      setDoctores((prev) => prev.filter((d) => d.iiddoctor !== id));
    } catch (err) {
      console.error("Error al eliminar doctor:", err);
      throw err;
    }
  };

  useEffect(() => {
    fetchDoctores();
  }, []);

  return (
    <DoctorContext.Provider
      value={{
        doctores,
        doctorSeleccionado,
        loading,
        fetchDoctores,
        seleccionarDoctor,
        agregarDoctor,
        actualizarDoctor,
        eliminarDoctor,
      }}
    >
      {children}
    </DoctorContext.Provider>
  );
};

export const useDoctorContext = () => useContext(DoctorContext);