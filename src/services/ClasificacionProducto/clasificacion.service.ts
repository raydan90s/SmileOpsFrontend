import type {
  Clasificacion,
  CreateClasificacionData,
  UpdateClasificacionData
} from '@models/ClasificacionProducto/Clasificacion.types';

const API_URL = process.env.EXPO_PUBLIC_API_URL;
const ENDPOINT = `${API_URL}/clasificaciones`;

export async function getAllClasificaciones(): Promise<Clasificacion[]> {
  try {
    const res = await fetch(ENDPOINT);

    if (!res.ok) {
      throw new Error(`Error al obtener clasificaciones: ${res.status}`);
    }

    const data = await res.json();
    
    if (data.success && data.data) {
      return data.data;
    }
    
    throw new Error('Respuesta inválida del servidor');
  } catch (err) {
    console.error('Error getAllClasificaciones:', err);
    throw err;
  }
}

export async function getClasificacionesActivas(): Promise<Clasificacion[]> {
  try {
    const res = await fetch(`${ENDPOINT}/activas`);

    if (!res.ok) {
      throw new Error(`Error al obtener clasificaciones activas: ${res.status}`);
    }

    const data = await res.json();
    
    if (data.success && data.data) {
      return data.data;
    }
    
    throw new Error('Respuesta inválida del servidor');
  } catch (err) {
    console.error('Error getClasificacionesActivas:', err);
    throw err;
  }
}

export async function getClasificacionById(id: number): Promise<Clasificacion> {
  try {
    const res = await fetch(`${ENDPOINT}/${id}`);

    if (!res.ok) {
      if (res.status === 404) {
        throw new Error('Clasificación no encontrada');
      }
      throw new Error(`Error al buscar clasificación: ${res.status}`);
    }

    const data = await res.json();
    
    if (data.success && data.data) {
      return data.data;
    }
    
    throw new Error('Respuesta inválida del servidor');
  } catch (err) {
    console.error('Error getClasificacionById:', err);
    throw err;
  }
}

export async function buscarClasificacionPorDescripcion(
  descripcion: string
): Promise<Clasificacion[]> {
  try {
    const res = await fetch(
      `${ENDPOINT}/descripcion/${encodeURIComponent(descripcion)}`
    );

    if (!res.ok) {
      if (res.status === 404) {
        return [];
      }
      throw new Error(`Error al buscar clasificación: ${res.status}`);
    }

    const data = await res.json();
    
    if (data.success && data.data) {
      return data.data;
    }
    
    throw new Error('Respuesta inválida del servidor');
  } catch (err) {
    console.error('Error buscarClasificacionPorDescripcion:', err);
    throw err;
  }
}

export async function crearClasificacion(
  clasificacionData: CreateClasificacionData
): Promise<Clasificacion> {
  try {    
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(clasificacionData),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Error al crear clasificación: ${res.status}`
      );
    }

    const data = await res.json();
    
    if (data.success && data.data) {
      return data.data;
    }
    
    throw new Error('Respuesta inválida del servidor');
  } catch (err) {
    console.error('Error crearClasificacion:', err);
    throw err;
  }
}

export async function actualizarClasificacion(
  id: number,
  clasificacionData: UpdateClasificacionData
): Promise<Clasificacion> {
  try {
    const res = await fetch(`${ENDPOINT}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(clasificacionData),
    });

    if (!res.ok) {
      if (res.status === 404) {
        throw new Error('Clasificación no encontrada');
      }
      const errorData = await res.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Error al actualizar clasificación: ${res.status}`
      );
    }

    const data = await res.json();
    
    if (data.success && data.data) {
      return data.data;
    }
    
    throw new Error('Respuesta inválida del servidor');
  } catch (err) {
    console.error('Error actualizarClasificacion:', err);
    throw err;
  }
}

export async function eliminarClasificacion(id: number): Promise<Clasificacion> {
  try {
    const res = await fetch(`${ENDPOINT}/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
    });

    if (!res.ok) {
      if (res.status === 404) {
        throw new Error('Clasificación no encontrada');
      }
      const errorData = await res.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Error al eliminar clasificación: ${res.status}`
      );
    }

    const data = await res.json();
    
    if (data.success && data.data) {
      return data.data;
    }
    
    throw new Error('Respuesta inválida del servidor');
  } catch (err) {
    console.error('Error eliminarClasificacion:', err);
    throw err;
  }
}