import type { Marca, MarcaForm, ApiResponse } from '@models/Marca/marcas.type';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export async function getAllMarcas(): Promise<Marca[]> {
  try {
    const res = await fetch(`${API_URL}/marcas`);
    
    if (!res.ok) {
      throw new Error(`Error al obtener marcas: ${res.status}`);
    }

    const data: ApiResponse<Marca[]> = await res.json();
    
    if (data.success && data.data) {
      return data.data;
    }
    
    throw new Error('Respuesta inválida del servidor');
  } catch (err) {
    console.error('Error getAllMarcas:', err);
    throw err;
  }
}

export async function getMarcasActivas(): Promise<Marca[]> {
  try {
    const res = await fetch(`${API_URL}/marcas/activas`);
    
    if (!res.ok) {
      throw new Error(`Error al obtener marcas activas: ${res.status}`);
    }

    const data: ApiResponse<Marca[]> = await res.json();
    
    if (data.success && data.data) {
      return data.data;
    }
    
    throw new Error('Respuesta inválida del servidor');
  } catch (err) {
    console.error('Error getMarcasActivas:', err);
    throw err;
  }
}

export async function getMarcaById(id: number): Promise<Marca> {
  try {
    const res = await fetch(`${API_URL}/marcas/${id}`);
    
    if (!res.ok) {
      if (res.status === 404) {
        throw new Error('Marca no encontrada');
      }
      throw new Error(`Error al obtener marca: ${res.status}`);
    }

    const data: ApiResponse<Marca> = await res.json();
    
    if (data.success && data.data) {
      return data.data;
    }
    
    throw new Error('Respuesta inválida del servidor');
  } catch (err) {
    console.error('Error getMarcaById:', err);
    throw err;
  }
}

export async function buscarMarcaPorNombre(nombre: string): Promise<Marca[]> {
  const valorLimpio = nombre.trim();
  
  if (!valorLimpio) {
    return [];
  }

  try {
    const res = await fetch(
      `${API_URL}/marcas/nombre/${encodeURIComponent(valorLimpio)}`
    );
    
    if (!res.ok) {
      throw new Error(`Error al buscar marca: ${res.status}`);
    }

    const data: ApiResponse<Marca[]> = await res.json();
    
    if (data.success && data.data) {
      return data.data;
    }
    
    throw new Error('Respuesta inválida del servidor');
  } catch (err) {
    console.error('Error buscarMarcaPorNombre:', err);
    throw err;
  }
}

export async function crearMarca(marcaData: MarcaForm): Promise<Marca> {
  try {
    const res = await fetch(`${API_URL}/marcas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(marcaData),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Error al crear marca: ${res.status}`
      );
    }

    const data: ApiResponse<Marca> = await res.json();
    
    if (data.success && data.data) {
      return data.data;
    }
    
    throw new Error('Respuesta inválida del servidor');
  } catch (err) {
    console.error('Error crearMarca:', err);
    throw err;
  }
}

export async function actualizarMarca(
  id: number,
  marcaData: Partial<MarcaForm>
): Promise<Marca> {
  try {
    const res = await fetch(`${API_URL}/marcas/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(marcaData),
    });

    if (!res.ok) {
      if (res.status === 404) {
        throw new Error('Marca no encontrada');
      }
      const errorData = await res.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Error al actualizar marca: ${res.status}`
      );
    }

    const data: ApiResponse<Marca> = await res.json();
    
    if (data.success && data.data) {
      return data.data;
    }
    
    throw new Error('Respuesta inválida del servidor');
  } catch (err) {
    console.error('Error actualizarMarca:', err);
    throw err;
  }
}

export async function eliminarMarca(id: number): Promise<Marca> {
  try {
    const res = await fetch(`${API_URL}/marcas/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      if (res.status === 404) {
        throw new Error('Marca no encontrada');
      }
      const errorData = await res.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Error al eliminar marca: ${res.status}`
      );
    }

    const data: ApiResponse<Marca> = await res.json();
    
    if (data.success && data.data) {
      return data.data;
    }
    
    throw new Error('Respuesta inválida del servidor');
  } catch (err) {
    console.error('Error eliminarMarca:', err);
    throw err;
  }
}

export async function activarMarca(id: number): Promise<Marca> {
  try {
    const res = await fetch(`${API_URL}/marcas/${id}/activar`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      if (res.status === 404) {
        throw new Error('Marca no encontrada');
      }
      const errorData = await res.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Error al activar marca: ${res.status}`
      );
    }

    const data: ApiResponse<Marca> = await res.json();
    
    if (data.success && data.data) {
      return data.data;
    }
    
    throw new Error('Respuesta inválida del servidor');
  } catch (err) {
    console.error('Error activarMarca:', err);
    throw err;
  }
}