import type { 
    TipoProveedor, CreateTipoProveedorDTO, UpdateTipoProveedorDTO 
} from '@models/administracion/Proveedores/TipoProveedor.types';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export async function fetchAllTiposProveedor(): Promise<TipoProveedor[]> {
  try {
    const res = await fetch(`${API_URL}/tipoProveedor`, { cache: "no-store" });

    if (!res.ok) throw new Error(`Error al obtener tipos de proveedor: ${res.status}`);

    const data = await res.json();
    if (data.success) return data.data;
    throw new Error("Respuesta inválida del servidor");
  } catch (err) {
    console.error("Error fetchAllTiposProveedor:", err);
    throw err;
  }
}

export async function getTipoProveedorById(id: number): Promise<TipoProveedor> {
  try {
    const res = await fetch(`${API_URL}/tipoProveedor/${id}`, { cache: "no-store" });

    if (!res.ok) throw new Error(`Error al obtener tipo de proveedor: ${res.status}`);

    const data = await res.json();
    if (data.success) return data.data;
    throw new Error("Respuesta inválida del servidor");
  } catch (err) {
    console.error("Error getTipoProveedorById:", err);
    throw err;
  }
}

export async function createTipoProveedor(tipoProveedor: CreateTipoProveedorDTO): Promise<TipoProveedor> {
  try {
    const res = await fetch(`${API_URL}/tipoProveedor`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(tipoProveedor),
    });

    if (!res.ok) throw new Error(`Error al crear tipo de proveedor: ${res.status}`);

    const data = await res.json();
    if (data.success) return data.data;
    throw new Error("Respuesta inválida del servidor");
  } catch (err) {
    console.error("Error createTipoProveedor:", err);
    throw err;
  }
}

export async function updateTipoProveedor(
  id: number,
  tipoProveedor: UpdateTipoProveedorDTO
): Promise<TipoProveedor> {
  try {
    const res = await fetch(`${API_URL}/tipoProveedor/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(tipoProveedor),
    });

    if (!res.ok) throw new Error(`Error al actualizar tipo de proveedor: ${res.status}`);

    const data = await res.json();
    if (data.success) return data.data;
    throw new Error("Respuesta inválida del servidor");
  } catch (err) {
    console.error("Error updateTipoProveedor:", err);
    throw err;
  }
}

export async function deleteTipoProveedor(id: number): Promise<any> {
  try {
    const res = await fetch(`${API_URL}/tipoProveedor/${id}`, { method: "DELETE" });

    if (!res.ok) throw new Error(`Error al eliminar tipo de proveedor: ${res.status}`);

    const data = await res.json();
    if (data.success) return data.data;
    throw new Error("Respuesta inválida del servidor");
  } catch (err) {
    console.error("Error deleteTipoProveedor:", err);
    throw err;
  }
}