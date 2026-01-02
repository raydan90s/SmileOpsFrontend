import type {
  Subclasificacion,
  CreateSubclasificacionData,
  UpdateSubclasificacionData
} from '@models/SubclasificacionProducto/Subclasificacion.types';

const API_URL = process.env.EXPO_PUBLIC_API_URL;
const ENDPOINT = `${API_URL}/subclasificaciones`;

export async function getAllSubclasificaciones(): Promise<Subclasificacion[]> {
  try {
    const res = await fetch(ENDPOINT);

    if (!res.ok) {
      throw new Error(`Error al obtener subclasificaciones: ${res.status}`);
    }

    const data = await res.json();
    
    if (data.success && data.data) {
      return data.data;
    }
    
    throw new Error('Respuesta inválida del servidor');
  } catch (err) {
    console.error('Error getAllSubclasificaciones:', err);
    throw err;
  }
}

export async function getSubclasificacionesActivas(): Promise<Subclasificacion[]> {
  try {
    const res = await fetch(`${ENDPOINT}/activas`);

    if (!res.ok) {
      throw new Error(`Error al obtener subclasificaciones activas: ${res.status}`);
    }

    const data = await res.json();
    
    if (data.success && data.data) {
      return data.data;
    }
    
    throw new Error('Respuesta inválida del servidor');
  } catch (err) {
    console.error('Error getSubclasificacionesActivas:', err);
    throw err;
  }
}

export async function getSubclasificacionesByClasificacion(
  idClasificacion: number
): Promise<Subclasificacion[]> {
  try {
    const res = await fetch(`${ENDPOINT}/clasificacion/${idClasificacion}`);

    if (!res.ok) {
      throw new Error(
        `Error al obtener subclasificaciones por clasificación: ${res.status}`
      );
    }

    const data = await res.json();
    
    if (data.success && data.data) {
      return data.data;
    }
    
    throw new Error('Respuesta inválida del servidor');
  } catch (err) {
    console.error('Error getSubclasificacionesByClasificacion:', err);
    throw err;
  }
}

export async function getSubclasificacionById(id: number): Promise<Subclasificacion> {
  try {
    const res = await fetch(`${ENDPOINT}/${id}`);

    if (!res.ok) {
      if (res.status === 404) {
        throw new Error('Subclasificación no encontrada');
      }
      throw new Error(`Error al buscar subclasificación: ${res.status}`);
    }

    const data = await res.json();
    
    if (data.success && data.data) {
      return data.data;
    }
    
    throw new Error('Respuesta inválida del servidor');
  } catch (err) {
    console.error('Error getSubclasificacionById:', err);
    throw err;
  }
}

export async function buscarSubclasificacionPorDescripcion(
  descripcion: string
): Promise<Subclasificacion[]> {
  try {
    const res = await fetch(
      `${ENDPOINT}/descripcion/${encodeURIComponent(descripcion)}`
    );

    if (!res.ok) {
      if (res.status === 404) {
        return [];
      }
      throw new Error(`Error al buscar subclasificación: ${res.status}`);
    }

    const data = await res.json();
    
    if (data.success && data.data) {
      return data.data;
    }
    
    throw new Error('Respuesta inválida del servidor');
  } catch (err) {
    console.error('Error buscarSubclasificacionPorDescripcion:', err);
    throw err;
  }
}

export async function crearSubclasificacion(
  subclasificacionData: CreateSubclasificacionData
): Promise<Subclasificacion> {
  try {    
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(subclasificacionData),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Error al crear subclasificación: ${res.status}`
      );
    }

    const data = await res.json();
    
    if (data.success && data.data) {
      return data.data;
    }
    
    throw new Error('Respuesta inválida del servidor');
  } catch (err) {
    console.error('Error crearSubclasificacion:', err);
    throw err;
  }
}

export async function actualizarSubclasificacion(
  id: number,
  subclasificacionData: UpdateSubclasificacionData
): Promise<Subclasificacion> {
  try {
    const res = await fetch(`${ENDPOINT}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(subclasificacionData),
    });

    if (!res.ok) {
      if (res.status === 404) {
        throw new Error('Subclasificación no encontrada');
      }
      const errorData = await res.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Error al actualizar subclasificación: ${res.status}`
      );
    }

    const data = await res.json();
    
    if (data.success && data.data) {
      return data.data;
    }
    
    throw new Error('Respuesta inválida del servidor');
  } catch (err) {
    console.error('Error actualizarSubclasificacion:', err);
    throw err;
  }
}

export async function eliminarSubclasificacion(id: number): Promise<Subclasificacion> {
  try {
    const res = await fetch(`${ENDPOINT}/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
    });

    if (!res.ok) {
      if (res.status === 404) {
        throw new Error('Subclasificación no encontrada');
      }
      const errorData = await res.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Error al eliminar subclasificación: ${res.status}`
      );
    }

    const data = await res.json();
    
    if (data.success && data.data) {
      return data.data;
    }
    
    throw new Error('Respuesta inválida del servidor');
  } catch (err) {
    console.error('Error eliminarSubclasificacion:', err);
    throw err;
  }
}