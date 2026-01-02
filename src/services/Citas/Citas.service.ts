import type { NuevaCita } from '@models/Citas/Citas.types';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export async function crearCita(cita: NuevaCita) {
  try {
    const res = await fetch(`${API_URL}/citas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cita),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Error al crear cita: ${res.status}`
      );
    }

    const data = await res.json();
    
    if (data.success && data.data) {
      return data.data;
    }
    
    throw new Error('Respuesta inválida del servidor');
  } catch (err) {
    console.error('Error crearCita:', err);
    throw err;
  }
}

export async function actualizarEstadoCita(
  citaId: string,
  nuevoEstado: 'P' | 'A' | 'C',
  usuario: string
) {
  try {
    const res = await fetch(`${API_URL}/citas/${citaId}/estado`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cEstado: nuevoEstado,
        vUsuarioMod: usuario,
      }),
    });

    if (!res.ok) {
      if (res.status === 404) {
        throw new Error('Cita no encontrada');
      }
      const errorData = await res.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Error al actualizar estado de la cita: ${res.status}`
      );
    }

    const data = await res.json();
    
    if (data.success && data.data) {
      return data.data;
    }
    
    throw new Error('Respuesta inválida del servidor');
  } catch (err) {
    console.error('Error actualizarEstadoCita:', err);
    throw err;
  }
}

export async function eliminarCita(citaId: string) {
  try {
    const res = await fetch(`${API_URL}/citas/${citaId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      if (res.status === 404) {
        throw new Error('Cita no encontrada');
      }
      const errorData = await res.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Error al eliminar la cita: ${res.status}`
      );
    }

    const data = await res.json();
    
    if (data.success && data.data) {
      return data.data;
    }
    
    throw new Error('Respuesta inválida del servidor');
  } catch (err) {
    console.error('Error eliminarCita:', err);
    throw err;
  }
}

export async function obtenerCitas() {
  try {
    const res = await fetch(`${API_URL}/citas`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      throw new Error(`Error al obtener las citas: ${res.status}`);
    }

    const data = await res.json();
    
    if (data.success && data.data) {
      return data.data;
    }
    
    throw new Error('Respuesta inválida del servidor');
  } catch (err) {
    console.error('Error obtenerCitas:', err);
    throw err;
  }
}