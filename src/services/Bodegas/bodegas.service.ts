const API_URL = process.env.EXPO_PUBLIC_API_URL;

export async function fetchAllBodegas(iid_tipo_bodega?: number) {
  try {
    const url = iid_tipo_bodega 
      ? `${API_URL}/bodegas?iid_tipo_bodega=${iid_tipo_bodega}`
      : `${API_URL}/bodegas`;
    
    const res = await fetch(url, { cache: "no-store" });

    if (!res.ok) throw new Error(`Error al obtener bodegas: ${res.status}`);

    const data = await res.json();
    if (data.success) return data.data;
    throw new Error("Respuesta inválida del servidor");
  } catch (err) {
    console.error("Error fetchAllBodegas:", err);
    throw err;
  }
}

export async function fetchBodegasPrincipales() {
  try {
    const res = await fetch(`${API_URL}/bodegas/principales`, { cache: "no-store" });

    if (!res.ok) throw new Error(`Error al obtener bodegas principales: ${res.status}`);

    const data = await res.json();
    if (data.success) return data.data;
    throw new Error("Respuesta inválida del servidor");
  } catch (err) {
    console.error("Error fetchBodegasPrincipales:", err);
    throw err;
  }
}

export async function getBodegaById(id: number) {
  try {
    const res = await fetch(`${API_URL}/bodegas/${id}`, { cache: "no-store" });

    if (!res.ok) throw new Error(`Error al obtener bodega: ${res.status}`);

    const data = await res.json();
    if (data.success) return data.data;
    throw new Error("Respuesta inválida del servidor");
  } catch (err) {
    console.error("Error getBodegaById:", err);
    throw err;
  }
}

export async function createBodega(bodega: {
  vnombre_bodega: string;
  iid_tipo_bodega: number;
  bactivo?: boolean;
}) {
  try {
    const res = await fetch(`${API_URL}/bodegas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bodega),
    });

    if (!res.ok) throw new Error(`Error al crear bodega: ${res.status}`);

    const data = await res.json();
    if (data.success) return data.data;
    throw new Error("Respuesta inválida del servidor");
  } catch (err) {
    console.error("Error createBodega:", err);
    throw err;
  }
}

export async function updateBodega(
  id: number,
  bodega: {
    vnombre_bodega: string;
    iid_tipo_bodega: number;
    bactivo: boolean;
  }
) {
  try {
    const res = await fetch(`${API_URL}/bodegas/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bodega),
    });

    if (!res.ok) throw new Error(`Error al actualizar bodega: ${res.status}`);

    const data = await res.json();
    if (data.success) return data.data;
    throw new Error("Respuesta inválida del servidor");
  } catch (err) {
    console.error("Error updateBodega:", err);
    throw err;
  }
}

export async function deleteBodega(id: number) {
  try {
    const res = await fetch(`${API_URL}/bodegas/${id}`, { method: "DELETE" });

    if (!res.ok) throw new Error(`Error al eliminar bodega: ${res.status}`);

    const data = await res.json();
    if (data.success) return data.data;
    throw new Error("Respuesta inválida del servidor");
  } catch (err) {
    console.error("Error deleteBodega:", err);
    throw err;
  }
}