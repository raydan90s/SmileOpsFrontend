import type { PacienteForm } from '@models/Busqueda/PacienteForm.types';
import type { PacienteDB } from '@models/Pacientes/Pacientes.types';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export async function buscarPacientePorCodigo(codigo: string): Promise<PacienteForm | null> {
  if (!codigo.trim()) return null;

  try {
    const res = await fetch(`${API_URL}/pacientes/${codigo}`);
    
    if (!res.ok) {
      throw new Error(`Error al buscar paciente por código: ${res.status}`);
    }

    const data = await res.json();
    
    if (data.success && data.data) {
      return {
        codigo: data.data.iidpaciente,
        cedula: data.data.vcedula || '',
        nombre: data.data.nombreCompleto,
        foto: data.data.vrutafoto
      };
    }
    
    return null;
  } catch (err) {
    console.error('Error buscarPacientePorCodigo:', err);
    return null;
  }
}

export async function buscarPacientePorCedula(cedula: string): Promise<PacienteForm | null> {
  if (!cedula.trim()) return null;

  try {
    const res = await fetch(`${API_URL}/pacientes/cedula/${cedula}`);
    
    if (!res.ok) {
      throw new Error(`Error al buscar paciente por cédula: ${res.status}`);
    }

    const data = await res.json();
    
    if (data.success && data.data) {
      return {
        codigo: data.data.iidpaciente || '',
        cedula: data.data.vci || cedula,
        nombre: data.data.nombreCompleto || ''
      };
    }
    
    return null;
  } catch (err) {
    console.error('Error buscarPacientePorCedula:', err);
    return null;
  }
}

export async function buscarPacientePorNombre(nombre: string): Promise<PacienteForm[] | null> {
  const valorLimpio = nombre.trim();
  
  if (!valorLimpio) return null;

  try {
    const res = await fetch(
      `${API_URL}/pacientes/nombre/${encodeURIComponent(valorLimpio)}`
    );
    
    if (!res.ok) {
      throw new Error(`Error al buscar paciente por nombre: ${res.status}`);
    }

    const data = await res.json();
    
    if (data.success && data.data && Array.isArray(data.data)) {
      return data.data.map((p: any) => ({
        codigo: p.iidpaciente || '',
        cedula: p.vcedula || '',
        nombre: p.nombreCompleto || ''
      }));
    }

    return null;
  } catch (err) {
    console.error('Error buscarPacientePorNombre:', err);
    return null;
  }
}

export async function obtenerTodosPacientes(): Promise<PacienteDB[]> {
  try {
    const res = await fetch(`${API_URL}/pacientes`);
    
    if (!res.ok) {
      throw new Error(`Error al obtener pacientes: ${res.status}`);
    }

    const data = await res.json();
    
    if (data.success && data.data) {
      return data.data;
    }
    
    return [];
  } catch (err) {
    console.error('Error obtenerTodosPacientes:', err);
    throw err;
  }
}

export async function obtenerPacienteCompleto(id: string): Promise<PacienteDB | null> {
  try {
    const res = await fetch(`${API_URL}/pacientes/completo/${id}`);
    
    if (!res.ok) {
      if (res.status === 404) {
        throw new Error('Paciente no encontrado');
      }
      throw new Error(`Error al obtener paciente completo: ${res.status}`);
    }

    const data = await res.json();
    
    if (data.success && data.data) {
      return data.data;
    }
    
    return null;
  } catch (err) {
    console.error('Error obtenerPacienteCompleto:', err);
    throw err;
  }
}

export async function crearPaciente(data: PacienteDB): Promise<PacienteDB> {
  try {
    const res = await fetch(`${API_URL}/pacientes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Error al crear paciente: ${res.status}`
      );
    }

    const responseData = await res.json();
    
    if (responseData.success && responseData.data) {
      return responseData.data;
    }
    
    throw new Error('Respuesta inválida del servidor');
  } catch (err) {
    console.error('Error crearPaciente:', err);
    throw err;
  }
}

export async function actualizarPaciente(
  id: string | number,
  data: PacienteDB
): Promise<PacienteDB> {
  try {
    const res = await fetch(`${API_URL}/pacientes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      if (res.status === 404) {
        throw new Error('Paciente no encontrado');
      }
      const errorData = await res.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Error al actualizar paciente: ${res.status}`
      );
    }

    const responseData = await res.json();
    
    if (responseData.success && responseData.data) {
      return responseData.data;
    }
    
    throw new Error('Respuesta inválida del servidor');
  } catch (err) {
    console.error('Error actualizarPaciente:', err);
    throw err;
  }
}

export async function desactivarPaciente(id: string | number): Promise<PacienteDB> {
  try {
    const res = await fetch(`${API_URL}/pacientes/${id}/desactivar`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      if (res.status === 404) {
        throw new Error('Paciente no encontrado');
      }
      const errorData = await res.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Error al desactivar paciente: ${res.status}`
      );
    }

    const responseData = await res.json();
    
    if (responseData.success && responseData.data) {
      return responseData.data;
    }
    
    throw new Error('Respuesta inválida del servidor');
  } catch (err) {
    console.error('Error desactivarPaciente:', err);
    throw err;
  }
}

export async function activarPaciente(id: string | number): Promise<PacienteDB> {
  try {
    const res = await fetch(`${API_URL}/pacientes/${id}/activar`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      if (res.status === 404) {
        throw new Error('Paciente no encontrado');
      }
      const errorData = await res.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Error al activar paciente: ${res.status}`
      );
    }

    const responseData = await res.json();
    
    if (responseData.success && responseData.data) {
      return responseData.data;
    }
    
    throw new Error('Respuesta inválida del servidor');
  } catch (err) {
    console.error('Error activarPaciente:', err);
    throw err;
  }
}