import type { Consultorio } from "@models/Consultorios/Consultorios.types";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export async function fetchAllConsultorios(): Promise<Consultorio[]> {
  try {
    const res = await fetch(`${API_URL}/consultorios`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      throw new Error(`Error al obtener consultorios: ${res.status}`);
    }

    const data = await res.json();
    
    if (data.success && data.data) {
      return data.data;
    }
    
    throw new Error('Respuesta inválida del servidor');
  } catch (err) {
    console.error('Error fetchAllConsultorios:', err);
    throw err;
  }
}

export async function getConsultorioById(id: number): Promise<Consultorio | null> {
  try {
    const res = await fetch(`${API_URL}/consultorios/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      if (res.status === 404) {
        return null;
      }
      throw new Error(`Error al obtener consultorio: ${res.status}`);
    }

    const data = await res.json();
    
    if (data.success && data.data) {
      return data.data;
    }
    
    return null;
  } catch (err) {
    console.error('Error getConsultorioById:', err);
    throw err;
  }
}

export async function createConsultorio(
  consultorio: Omit<Consultorio, "iidconsultorio" | "dfechacreacion">
) {
  try {
    const res = await fetch(`${API_URL}/consultorios`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(consultorio),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Error al crear consultorio: ${res.status}`
      );
    }

    const data = await res.json();
    
    if (data.success && data.data) {
      return data.data;
    }
    
    throw new Error('Respuesta inválida del servidor');
  } catch (err) {
    console.error('Error createConsultorio:', err);
    throw err;
  }
}

export async function updateConsultorio(
  id: number,
  consultorio: Partial<Omit<Consultorio, "iidconsultorio" | "dfechacreacion">>
) {
  try {
    const res = await fetch(`${API_URL}/consultorios/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(consultorio),
    });

    if (!res.ok) {
      if (res.status === 404) {
        throw new Error('Consultorio no encontrado');
      }
      const errorData = await res.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Error al actualizar consultorio: ${res.status}`
      );
    }

    const data = await res.json();
    
    if (data.success && data.data) {
      return data.data;
    }
    
    throw new Error('Respuesta inválida del servidor');
  } catch (err) {
    console.error('Error updateConsultorio:', err);
    throw err;
  }
}

export async function deleteConsultorio(id: number) {
  try {
    const res = await fetch(`${API_URL}/consultorios/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      if (res.status === 404) {
        throw new Error('Consultorio no encontrado');
      }
      const errorData = await res.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Error al eliminar consultorio: ${res.status}`
      );
    }

    const data = await res.json();
    
    if (data.success && data.data) {
      return data.data;
    }
    
    throw new Error('Respuesta inválida del servidor');
  } catch (err) {
    console.error('Error deleteConsultorio:', err);
    throw err;
  }
}