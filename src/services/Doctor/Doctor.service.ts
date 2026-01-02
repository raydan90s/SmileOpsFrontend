import type { Doctor } from "@models/Doctor/Doctor.types";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export async function fetchAllDoctores(): Promise<Doctor[]> {
  try {
    const res = await fetch(`${API_URL}/doctores`, { cache: "no-store" });
    if (!res.ok) throw new Error(`Error al obtener doctores: ${res.status}`);

    const data = await res.json();
    if (data.success && Array.isArray(data.data)) return data.data;
    throw new Error("Respuesta inválida del servidor");
  } catch (err) {
    console.error("Error fetchAllDoctores:", err);
    throw err;
  }
}

export async function getDoctorById(id: number): Promise<Doctor | null> {
  try {
    const res = await fetch(`${API_URL}/doctores/${id}`, { cache: "no-store" });
    if (!res.ok) throw new Error(`Error al obtener doctor: ${res.status}`);

    const data = await res.json();
    if (data.success && data.data) return data.data;
    return null;
  } catch (err) {
    console.error("Error getDoctorById:", err);
    return null;
  }
}

export async function createDoctor(doctor: Omit<Doctor, "iiddoctor">): Promise<Doctor> {
  try {
    const res = await fetch(`${API_URL}/doctores`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(doctor),
    });

    if (!res.ok) throw new Error(`Error al crear doctor: ${res.status}`);

    const data = await res.json();
    if (data.success) return data.data;
    throw new Error("Respuesta inválida del servidor");
  } catch (err) {
    console.error("Error createDoctor:", err);
    throw err;
  }
}

export async function updateDoctor(id: number, doctor: Omit<Doctor, "iiddoctor">): Promise<Doctor> {
  try {
    const res = await fetch(`${API_URL}/doctores/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(doctor),
    });

    if (!res.ok) throw new Error(`Error al actualizar doctor: ${res.status}`);

    const data = await res.json();
    if (data.success) return data.data;
    throw new Error("Respuesta inválida del servidor");
  } catch (err) {
    console.error("Error updateDoctor:", err);
    throw err;
  }
}

export async function deleteDoctor(id: number): Promise<void> {
  try {
    const res = await fetch(`${API_URL}/doctores/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error(`Error al eliminar doctor: ${res.status}`);

    const data = await res.json();
    if (!data.success) throw new Error("Error al eliminar doctor en el servidor");
  } catch (err) {
    console.error("Error deleteDoctor:", err);
    throw err;
  }
}
