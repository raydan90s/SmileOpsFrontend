import type { 
  EntidadFacturadora, 
  CreateEntidadFacturadoraDTO, 
  UpdateEntidadFacturadoraDTO 
} from '@models/FacturaPedido/EntidadesFacturadoras.types';

const API_URL = process.env.EXPO_PUBLIC_API_URL;
const ENDPOINT = `${API_URL}/entidades/facturadoras`;

export async function fetchAllEntidades(filtros?: { 
  activo?: boolean; 
  busqueda?: string; 
}): Promise<EntidadFacturadora[]> {
  try {
    const params = new URLSearchParams();

    if (filtros?.activo !== undefined) {
      params.append('activo', filtros.activo.toString());
    }
    if (filtros?.busqueda) {
      params.append('busqueda', filtros.busqueda);
    }

    const queryString = params.toString();
    const url = queryString ? `${ENDPOINT}?${queryString}` : ENDPOINT;

    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!res.ok) {
      throw new Error(`Error al obtener entidades facturadoras: ${res.status}`);
    }

    const data = await res.json();

    if (data.success && data.data) {
      return data.data;
    }

    throw new Error(data.message || 'Respuesta inválida del servidor');
  } catch (err) {
    console.error('Error fetchAllEntidades:', err);
    throw err;
  }
}

export async function getEntidadById(id: number): Promise<EntidadFacturadora> {
  try {
    const res = await fetch(`${ENDPOINT}/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!res.ok) {
      if (res.status === 404) {
        throw new Error('Entidad facturadora no encontrada');
      }
      throw new Error(`Error al obtener entidad facturadora: ${res.status}`);
    }

    const data = await res.json();

    if (data.success && data.data) {
      return data.data;
    }

    throw new Error(data.message || 'Respuesta inválida del servidor');
  } catch (err) {
    console.error('Error getEntidadById:', err);
    throw err;
  }
}

export async function getEntidadesActivas(): Promise<EntidadFacturadora[]> {
  try {
    const res = await fetch(`${ENDPOINT}/activas`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!res.ok) {
      throw new Error(`Error al obtener entidades activas: ${res.status}`);
    }

    const data = await res.json();

    if (data.success && data.data) {
      return data.data;
    }

    throw new Error(data.message || 'Respuesta inválida del servidor');
  } catch (err) {
    console.error('Error getEntidadesActivas:', err);
    throw err;
  }
}

export async function buscarEntidadPorRuc(ruc: string): Promise<EntidadFacturadora | null> {
  try {
    const res = await fetch(`${ENDPOINT}/ruc/${encodeURIComponent(ruc)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!res.ok) {
      if (res.status === 404) {
        return null;
      }
      throw new Error(`Error al buscar entidad por RUC: ${res.status}`);
    }

    const data = await res.json();

    if (data.success && data.data) {
      return data.data;
    }

    throw new Error(data.message || 'Respuesta inválida del servidor');
  } catch (err) {
    console.error('Error buscarEntidadPorRuc:', err);
    throw err;
  }
}

export async function createEntidad(
  entidadData: CreateEntidadFacturadoraDTO
): Promise<EntidadFacturadora> {
  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(entidadData)
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Error al crear entidad facturadora: ${res.status}`
      );
    }

    const data = await res.json();

    if (data.success && data.data) {
      return data.data;
    }

    throw new Error(data.message || 'Respuesta inválida del servidor');
  } catch (err) {
    console.error('Error createEntidad:', err);
    throw err;
  }
}

export async function updateEntidad(
  id: number,
  entidadData: UpdateEntidadFacturadoraDTO
): Promise<EntidadFacturadora> {
  try {
    const res = await fetch(`${ENDPOINT}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(entidadData)
    });

    if (!res.ok) {
      if (res.status === 404) {
        throw new Error('Entidad facturadora no encontrada');
      }
      const errorData = await res.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Error al actualizar entidad facturadora: ${res.status}`
      );
    }

    const data = await res.json();

    if (data.success && data.data) {
      return data.data;
    }

    throw new Error(data.message || 'Respuesta inválida del servidor');
  } catch (err) {
    console.error('Error updateEntidad:', err);
    throw err;
  }
}

export async function toggleEstadoEntidad(id: number): Promise<EntidadFacturadora> {
  try {
    const res = await fetch(`${ENDPOINT}/${id}/toggle-estado`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Error al cambiar estado de entidad: ${res.status}`
      );
    }

    const data = await res.json();

    if (data.success && data.data) {
      return data.data;
    }

    throw new Error(data.message || 'Respuesta inválida del servidor');
  } catch (err) {
    console.error('Error toggleEstadoEntidad:', err);
    throw err;
  }
}

export async function activarEntidad(id: number): Promise<EntidadFacturadora> {
  try {
    const res = await fetch(`${ENDPOINT}/${id}/activar`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Error al activar entidad: ${res.status}`
      );
    }

    const data = await res.json();

    if (data.success && data.data) {
      return data.data;
    }

    throw new Error(data.message || 'Respuesta inválida del servidor');
  } catch (err) {
    console.error('Error activarEntidad:', err);
    throw err;
  }
}

export async function desactivarEntidad(id: number): Promise<EntidadFacturadora> {
  try {
    const res = await fetch(`${ENDPOINT}/${id}/desactivar`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Error al desactivar entidad: ${res.status}`
      );
    }

    const data = await res.json();

    if (data.success && data.data) {
      return data.data;
    }

    throw new Error(data.message || 'Respuesta inválida del servidor');
  } catch (err) {
    console.error('Error desactivarEntidad:', err);
    throw err;
  }
}

export async function eliminarEntidad(id: number): Promise<void> {
  try {
    const res = await fetch(`${ENDPOINT}/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!res.ok) {
      if (res.status === 404) {
        throw new Error('Entidad facturadora no encontrada');
      }
      const errorData = await res.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Error al eliminar entidad facturadora: ${res.status}`
      );
    }

    const data = await res.json();

    if (!data.success) {
      throw new Error(data.message || 'Error al eliminar entidad facturadora');
    }
  } catch (err) {
    console.error('Error eliminarEntidad:', err);
    throw err;
  }
}