const API_URL = process.env.EXPO_PUBLIC_API_URL;

export async function fetchAllPaises() {
  try {
    const res = await fetch(`${API_URL}/paises`, { cache: "no-store" });

    if (!res.ok) throw new Error(`Error al obtener países: ${res.status}`);

    const data = await res.json();
    if (data.success) return data.data;
    throw new Error("Respuesta inválida del servidor");
  } catch (err) {
    console.error("Error fetchAllPaises:", err);
    throw err;
  }
}

export async function getPaisById(id: number) {
  try {
    const res = await fetch(`${API_URL}/paises/${id}`, { cache: "no-store" });

    if (!res.ok) throw new Error(`Error al obtener país: ${res.status}`);

    const data = await res.json();
    if (data.success) return data.data;
    throw new Error("Respuesta inválida del servidor");
  } catch (err) {
    console.error("Error getPaisById:", err);
    throw err;
  }
}

export async function createPais(pais: { vcodigo: string; vnombre: string; bactivo?: boolean }) {
  try {
    const res = await fetch(`${API_URL}/paises`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pais),
    });

    if (!res.ok) throw new Error(`Error al crear país: ${res.status}`);

    const data = await res.json();
    if (data.success) return data.data;
    throw new Error("Respuesta inválida del servidor");
  } catch (err) {
    console.error("Error createPais:", err);
    throw err;
  }
}

export async function updatePais(id: number, pais: { vcodigo: string; vnombre: string; bactivo: boolean }) {
  try {
    const res = await fetch(`${API_URL}/paises/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pais),
    });

    if (!res.ok) throw new Error(`Error al actualizar país: ${res.status}`);

    const data = await res.json();
    if (data.success) return data.data;
    throw new Error("Respuesta inválida del servidor");
  } catch (err) {
    console.error("Error updatePais:", err);
    throw err;
  }
}

export async function deletePais(id: number) {
  try {
    const res = await fetch(`${API_URL}/paises/${id}`, { method: "DELETE" });

    if (!res.ok) throw new Error(`Error al eliminar país: ${res.status}`);

    const data = await res.json();
    if (data.success) return data.data;
    throw new Error("Respuesta inválida del servidor");
  } catch (err) {
    console.error("Error deletePais:", err);
    throw err;
  }
}
