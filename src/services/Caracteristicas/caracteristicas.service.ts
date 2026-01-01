import type { Caracteristica, CaracteristicaForm, ApiResponse } from '@models/Caracteristicas/caracteristicas.types';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export async function getAllCaracteristicas(): Promise<Caracteristica[]> {
  try {
    const res = await fetch(`${API_URL}/caracteristicas`);
    
    if (!res.ok) {
      throw new Error(`Error al obtener características: ${res.status}`);
    }

    const data: ApiResponse<Caracteristica[]> = await res.json();
    
    if (data.success && data.data) {
      return data.data;
    }
    
    throw new Error('Respuesta inválida del servidor');
  } catch (err) {
    console.error('Error getAllCaracteristicas:', err);
    throw err;
  }
}

export async function getCaracteristicasActivas(): Promise<Caracteristica[]> {
  try {
    const res = await fetch(`${API_URL}/caracteristicas/activas`);
    
    if (!res.ok) {
      throw new Error(`Error al obtener características activas: ${res.status}`);
    }

    const data: ApiResponse<Caracteristica[]> = await res.json();
    
    if (data.success && data.data) {
      return data.data;
    }
    
    throw new Error('Respuesta inválida del servidor');
  } catch (err) {
    console.error('Error getCaracteristicasActivas:', err);
    throw err;
  }
}

export async function getCaracteristicaById(id: number): Promise<Caracteristica> {
  try {
    const res = await fetch(`${API_URL}/caracteristicas/${id}`);
    
    if (!res.ok) {
      if (res.status === 404) {
        throw new Error('Característica no encontrada');
      }
      throw new Error(`Error al obtener característica: ${res.status}`);
    }

    const data: ApiResponse<Caracteristica> = await res.json();
    
    if (data.success && data.data) {
      return data.data;
    }
    
    throw new Error('Respuesta inválida del servidor');
  } catch (err) {
    console.error('Error getCaracteristicaById:', err);
    throw err;
  }
}

export async function buscarCaracteristicaPorNombre(nombre: string): Promise<Caracteristica[]> {
  const valorLimpio = nombre.trim();
  
  if (!valorLimpio) {
    return [];
  }

  try {
    const res = await fetch(
      `${API_URL}/caracteristicas/nombre/${encodeURIComponent(valorLimpio)}`
    );
    
    if (!res.ok) {
      throw new Error(`Error al buscar característica: ${res.status}`);
    }

    const data: ApiResponse<Caracteristica[]> = await res.json();
    
    if (data.success && data.data) {
      return data.data;
    }
    
    throw new Error('Respuesta inválida del servidor');
  } catch (err) {
    console.error('Error buscarCaracteristicaPorNombre:', err);
    throw err;
  }
}

export async function crearCaracteristica(caracteristicaData: CaracteristicaForm): Promise<Caracteristica> {
  try {
    const res = await fetch(`${API_URL}/caracteristicas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(caracteristicaData),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Error al crear característica: ${res.status}`
      );
    }

    const data: ApiResponse<Caracteristica> = await res.json();
    
    if (data.success && data.data) {
      return data.data;
    }
    
    throw new Error('Respuesta inválida del servidor');
  } catch (err) {
    console.error('Error crearCaracteristica:', err);
    throw err;
  }
}

export async function actualizarCaracteristica(
  id: number,
  caracteristicaData: Partial<CaracteristicaForm>
): Promise<Caracteristica> {
  try {
    const res = await fetch(`${API_URL}/caracteristicas/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(caracteristicaData),
    });

    if (!res.ok) {
      if (res.status === 404) {
        throw new Error('Característica no encontrada');
      }
      const errorData = await res.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Error al actualizar característica: ${res.status}`
      );
    }

    const data: ApiResponse<Caracteristica> = await res.json();
    
    if (data.success && data.data) {
      return data.data;
    }
    
    throw new Error('Respuesta inválida del servidor');
  } catch (err) {
    console.error('Error actualizarCaracteristica:', err);
    throw err;
  }
}

export async function eliminarCaracteristica(id: number): Promise<Caracteristica> {
  try {
    const res = await fetch(`${API_URL}/caracteristicas/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      if (res.status === 404) {
        throw new Error('Característica no encontrada');
      }
      const errorData = await res.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Error al eliminar característica: ${res.status}`
      );
    }

    const data: ApiResponse<Caracteristica> = await res.json();
    
    if (data.success && data.data) {
      return data.data;
    }
    
    throw new Error('Respuesta inválida del servidor');
  } catch (err) {
    console.error('Error eliminarCaracteristica:', err);
    throw err;
  }
}