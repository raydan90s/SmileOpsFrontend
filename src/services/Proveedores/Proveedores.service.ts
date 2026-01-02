import type { 
  Proveedor, 
  Direccion,
  CreateProveedorDTO, 
  UpdateProveedorDTO,
  CreateDireccionDTO,
  UpdateDireccionDTO
} from '@models/Proveedores/Proveedores.types';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export async function fetchAllProveedores(itipo_proveedor?: number): Promise<Proveedor[]> {
  try {
    const url = itipo_proveedor 
      ? `${API_URL}/proveedores?itipo_proveedor=${itipo_proveedor}`
      : `${API_URL}/proveedores`;
    
    const res = await fetch(url, { cache: "no-store" });

    if (!res.ok) {
      throw new Error(`Error al obtener proveedores: ${res.status}`);
    }

    const data = await res.json();
    
    if (data.success) {
      return data.data;
    }
    
    throw new Error(data.message || "Respuesta inválida del servidor");
  } catch (err) {
    console.error("Error fetchAllProveedores:", err);
    throw err;
  }
}

export async function getProveedorById(id: number): Promise<Proveedor> {
  try {
    const res = await fetch(`${API_URL}/proveedores/${id}`, { 
      cache: "no-store" 
    });

    if (!res.ok) {
      if (res.status === 404) {
        throw new Error('Proveedor no encontrado');
      }
      throw new Error(`Error al obtener proveedor: ${res.status}`);
    }

    const data = await res.json();
    
    if (data.success) {
      return data.data;
    }
    
    throw new Error(data.message || "Respuesta inválida del servidor");
  } catch (err) {
    console.error("Error getProveedorById:", err);
    throw err;
  }
}

export async function createProveedor(proveedor: CreateProveedorDTO): Promise<Proveedor> {
  try {
    const res = await fetch(`${API_URL}/proveedores`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json" 
      },
      body: JSON.stringify(proveedor),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Error al crear proveedor: ${res.status}`
      );
    }

    const data = await res.json();
    
    if (data.success) {
      return data.data;
    }
    
    throw new Error(data.message || "Respuesta inválida del servidor");
  } catch (err) {
    console.error("Error createProveedor:", err);
    throw err;
  }
}

export async function updateProveedor(
  id: number,
  proveedor: UpdateProveedorDTO
): Promise<Proveedor> {
  try {
    const res = await fetch(`${API_URL}/proveedores/${id}`, {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json" 
      },
      body: JSON.stringify(proveedor),
    });

    if (!res.ok) {
      if (res.status === 404) {
        throw new Error('Proveedor no encontrado');
      }
      const errorData = await res.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Error al actualizar proveedor: ${res.status}`
      );
    }

    const data = await res.json();
    
    if (data.success) {
      return data.data;
    }
    
    throw new Error(data.message || "Respuesta inválida del servidor");
  } catch (err) {
    console.error("Error updateProveedor:", err);
    throw err;
  }
}

export async function deleteProveedor(id: number): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await fetch(`${API_URL}/proveedores/${id}`, { 
      method: "DELETE" 
    });

    if (!res.ok) {
      if (res.status === 404) {
        throw new Error('Proveedor no encontrado');
      }
      throw new Error(`Error al eliminar proveedor: ${res.status}`);
    }

    const data = await res.json();
    
    if (data.success) {
      return data;
    }
    
    throw new Error(data.message || "Respuesta inválida del servidor");
  } catch (err) {
    console.error("Error deleteProveedor:", err);
    throw err;
  }
}

export async function getDireccionesByProveedor(id_proveedor: number): Promise<Direccion[]> {
  try {
    const res = await fetch(`${API_URL}/proveedores/${id_proveedor}/direcciones`, { 
      cache: "no-store" 
    });

    if (!res.ok) {
      throw new Error(`Error al obtener direcciones: ${res.status}`);
    }

    const data = await res.json();
    
    if (data.success) {
      return data.data;
    }
    
    throw new Error(data.message || "Respuesta inválida del servidor");
  } catch (err) {
    console.error("Error getDireccionesByProveedor:", err);
    throw err;
  }
}

export async function createDireccion(direccion: CreateDireccionDTO): Promise<Direccion> {
  try {
    const res = await fetch(`${API_URL}/proveedores/direcciones`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json" 
      },
      body: JSON.stringify(direccion),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Error al crear dirección: ${res.status}`
      );
    }

    const data = await res.json();
    
    if (data.success) {
      return data.data;
    }
    
    throw new Error(data.message || "Respuesta inválida del servidor");
  } catch (err) {
    console.error("Error createDireccion:", err);
    throw err;
  }
}

export async function updateDireccion(
  id: number,
  direccion: UpdateDireccionDTO
): Promise<Direccion> {
  try {
    const res = await fetch(`${API_URL}/proveedores/direcciones/${id}`, {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json" 
      },
      body: JSON.stringify(direccion),
    });

    if (!res.ok) {
      if (res.status === 404) {
        throw new Error('Dirección no encontrada');
      }
      const errorData = await res.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Error al actualizar dirección: ${res.status}`
      );
    }

    const data = await res.json();
    
    if (data.success) {
      return data.data;
    }
    
    throw new Error(data.message || "Respuesta inválida del servidor");
  } catch (err) {
    console.error("Error updateDireccion:", err);
    throw err;
  }
}

export async function deleteDireccion(id: number): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await fetch(`${API_URL}/proveedores/direcciones/${id}`, { 
      method: "DELETE" 
    });

    if (!res.ok) {
      if (res.status === 404) {
        throw new Error('Dirección no encontrada');
      }
      throw new Error(`Error al eliminar dirección: ${res.status}`);
    }

    const data = await res.json();
    
    if (data.success) {
      return data;
    }
    
    throw new Error(data.message || "Respuesta inválida del servidor");
  } catch (err) {
    console.error("Error deleteDireccion:", err);
    throw err;
  }
}