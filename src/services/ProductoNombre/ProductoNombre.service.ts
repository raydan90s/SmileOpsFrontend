import type {
  ProductoNombre,
  CreateProductoNombreData,
  UpdateProductoNombreData
} from '@models/ProductoNombre/ProductoNombre.types';

const API_URL = process.env.EXPO_PUBLIC_API_URL;
const ENDPOINT = `${API_URL}/producto/nombres`;

export async function getAllProductosNombre(): Promise<ProductoNombre[]> {
  try {
    const res = await fetch(ENDPOINT);

    if (!res.ok) {
      throw new Error(`Error al obtener nombres de productos: ${res.status}`);
    }

    const data = await res.json();
    
    if (data.success && data.data) {
      return data.data;
    }
    
    throw new Error('Respuesta inválida del servidor');
  } catch (err) {
    console.error('Error getAllProductosNombre:', err);
    throw err;
  }
}

export async function getProductoNombreById(id: number): Promise<ProductoNombre> {
  try {
    const res = await fetch(`${ENDPOINT}/${id}`);

    if (!res.ok) {
      if (res.status === 404) {
        throw new Error('Nombre de producto no encontrado');
      }
      throw new Error(`Error al buscar nombre de producto: ${res.status}`);
    }

    const data = await res.json();
    
    if (data.success && data.data) {
      return data.data;
    }
    
    throw new Error('Respuesta inválida del servidor');
  } catch (err) {
    console.error('Error getProductoNombreById:', err);
    throw err;
  }
}

export async function crearProductoNombre(
  data: CreateProductoNombreData
): Promise<ProductoNombre> {
  try {    
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Error al crear nombre de producto: ${res.status}`
      );
    }

    const responseData = await res.json();
    
    if (responseData.success && responseData.data) {
      return responseData.data;
    }
    
    throw new Error('Respuesta inválida del servidor');
  } catch (err) {
    console.error('Error crearProductoNombre:', err);
    throw err;
  }
}

export async function actualizarProductoNombre(
  id: number,
  data: UpdateProductoNombreData
): Promise<ProductoNombre> {
  try {
    const res = await fetch(`${ENDPOINT}/${id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      if (res.status === 404) {
        throw new Error('Nombre de producto no encontrado');
      }
      const errorData = await res.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Error al actualizar nombre de producto: ${res.status}`
      );
    }

    const responseData = await res.json();
    
    if (responseData.success && responseData.data) {
      return responseData.data;
    }
    
    throw new Error('Respuesta inválida del servidor');
  } catch (err) {
    console.error('Error actualizarProductoNombre:', err);
    throw err;
  }
}

export async function eliminarProductoNombre(id: number): Promise<ProductoNombre> {
  try {
    const res = await fetch(`${ENDPOINT}/${id}`, {
      method: 'DELETE',
      headers: { 
        'Content-Type': 'application/json' 
      },
    });

    if (!res.ok) {
      if (res.status === 404) {
        throw new Error('Nombre de producto no encontrado');
      }
      const errorData = await res.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Error al eliminar nombre de producto: ${res.status}`
      );
    }

    const responseData = await res.json();
    
    if (responseData.success && responseData.data) {
      return responseData.data;
    }
    
    throw new Error('Respuesta inválida del servidor');
  } catch (err) {
    console.error('Error eliminarProductoNombre:', err);
    throw err;
  }
}

export async function activarProductoNombre(id: number): Promise<ProductoNombre> {
  try {
    const res = await fetch(`${ENDPOINT}/${id}/activar`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json' 
      },
    });

    if (!res.ok) {
      if (res.status === 404) {
        throw new Error('Nombre de producto no encontrado');
      }
      const errorData = await res.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Error al activar nombre de producto: ${res.status}`
      );
    }

    const responseData = await res.json();
    
    if (responseData.success && responseData.data) {
      return responseData.data;
    }
    
    throw new Error('Respuesta inválida del servidor');
  } catch (err) {
    console.error('Error activarProductoNombre:', err);
    throw err;
  }
}