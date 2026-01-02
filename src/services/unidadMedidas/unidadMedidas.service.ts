import type {
  Unidad,
  CreateUnidadData,
  UpdateUnidadData
} from '@models/UnidadMedidas/unidadMedidas.types';

const API_URL = process.env.EXPO_PUBLIC_API_URL;
const ENDPOINT = `${API_URL}/unidades`;

export async function getAllUnidades(): Promise<Unidad[]> {
  try {
    const res = await fetch(ENDPOINT);

    if (!res.ok) {
      throw new Error(`Error al obtener unidades: ${res.status}`);
    }

    const data = await res.json();
    
    if (data.success && data.data) {
      return data.data;
    }
    
    throw new Error('Respuesta inválida del servidor');
  } catch (err) {
    console.error('Error getAllUnidades:', err);
    throw err;
  }
}

export async function getUnidadesActivas(): Promise<Unidad[]> {
  try {
    const res = await fetch(`${ENDPOINT}/activas`);

    if (!res.ok) {
      throw new Error(`Error al obtener unidades activas: ${res.status}`);
    }

    const data = await res.json();
    
    if (data.success && data.data) {
      return data.data;
    }
    
    throw new Error('Respuesta inválida del servidor');
  } catch (err) {
    console.error('Error getUnidadesActivas:', err);
    throw err;
  }
}

export async function getUnidadById(id: number): Promise<Unidad> {
  try {
    const res = await fetch(`${ENDPOINT}/${id}`);

    if (!res.ok) {
      if (res.status === 404) {
        throw new Error('Unidad no encontrada');
      }
      throw new Error(`Error al buscar unidad: ${res.status}`);
    }

    const data = await res.json();
    
    if (data.success && data.data) {
      return data.data;
    }
    
    throw new Error('Respuesta inválida del servidor');
  } catch (err) {
    console.error('Error getUnidadById:', err);
    throw err;
  }
}

export async function buscarUnidadPorNombre(nombre: string): Promise<Unidad[]> {
  try {
    const res = await fetch(`${ENDPOINT}/nombre/${encodeURIComponent(nombre)}`);

    if (!res.ok) {
      if (res.status === 404) {
        return [];
      }
      throw new Error(`Error al buscar unidad: ${res.status}`);
    }

    const data = await res.json();
    
    if (data.success && data.data) {
      return data.data;
    }
    
    throw new Error('Respuesta inválida del servidor');
  } catch (err) {
    console.error('Error buscarUnidadPorNombre:', err);
    throw err;
  }
}

export async function crearUnidad(unidadData: CreateUnidadData): Promise<Unidad> {
  try {    
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(unidadData),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Error al crear unidad: ${res.status}`
      );
    }

    const data = await res.json();
    
    if (data.success && data.data) {
      return data.data;
    }
    
    throw new Error('Respuesta inválida del servidor');
  } catch (err) {
    console.error('Error crearUnidad:', err);
    throw err;
  }
}

export async function actualizarUnidad(
  id: number,
  unidadData: UpdateUnidadData
): Promise<Unidad> {
  try {
    const res = await fetch(`${ENDPOINT}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(unidadData),
    });

    if (!res.ok) {
      if (res.status === 404) {
        throw new Error('Unidad no encontrada');
      }
      const errorData = await res.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Error al actualizar unidad: ${res.status}`
      );
    }

    const data = await res.json();
    
    if (data.success && data.data) {
      return data.data;
    }
    
    throw new Error('Respuesta inválida del servidor');
  } catch (err) {
    console.error('Error actualizarUnidad:', err);
    throw err;
  }
}

export async function eliminarUnidad(id: number): Promise<Unidad> {
  try {
    const res = await fetch(`${ENDPOINT}/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
    });

    if (!res.ok) {
      if (res.status === 404) {
        throw new Error('Unidad no encontrada');
      }
      const errorData = await res.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Error al eliminar unidad: ${res.status}`
      );
    }

    const data = await res.json();
    
    if (data.success && data.data) {
      return data.data;
    }
    
    throw new Error('Respuesta inválida del servidor');
  } catch (err) {
    console.error('Error eliminarUnidad:', err);
    throw err;
  }
}