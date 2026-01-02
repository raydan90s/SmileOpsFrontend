import type {
  ProductoInventario,
  CreateProductoData,
  UpdateProductoData
} from '@models/ProductoInventario/ProductoInventario.types';

const API_URL = process.env.EXPO_PUBLIC_API_URL;
const ENDPOINT = `${API_URL}/inventario-productos`;

async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
  return fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
}

export async function getAllProductos(): Promise<ProductoInventario[]> {
  try {
    const res = await fetch(ENDPOINT, {
      method: 'GET',
    });
    
    if (!res.ok) throw new Error('Error al obtener productos');

    const data = await res.json();
    return (data.success && data.data) ? data.data : [];
  } catch (err) {
    console.error('Error getAllProductos:', err);
    throw err;
  }
}

export async function getProductoByCodigo(codigo: string): Promise<ProductoInventario | null> {
  if (!codigo.trim()) return null;

  try {
    const res = await fetch(`${ENDPOINT}/codigo/${encodeURIComponent(codigo)}`, {
      method: 'GET',
    });
    
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error('Error al buscar producto');
    }

    const data = await res.json();
    return (data.success && data.data) ? data.data : null;
  } catch (err) {
    console.error('Error getProductoByCodigo:', err);
    return null;
  }
}

export async function getProductosBySubclasificacion(idSubclasificacion: number): Promise<ProductoInventario[]> {
  try {
    const res = await fetch(`${ENDPOINT}/subclasificacion/${idSubclasificacion}`, {
      method: 'GET',
    });
    
    if (!res.ok) {
      if (res.status === 404) return [];
      throw new Error('Error al buscar por subclasificación');
    }

    const data = await res.json();
    return (data.success && Array.isArray(data.data)) ? data.data : [];
  } catch (err) {
    console.error('Error getProductosBySubclasificacion:', err);
    return [];
  }
}

export async function getProductosByMarca(idMarca: number): Promise<ProductoInventario[]> {
  try {
    const res = await fetch(`${ENDPOINT}/marca/${idMarca}`, {
      method: 'GET',
    });
    
    if (!res.ok) {
      if (res.status === 404) return [];
      throw new Error('Error al buscar por marca');
    }

    const data = await res.json();
    return (data.success && Array.isArray(data.data)) ? data.data : [];
  } catch (err) {
    console.error('Error getProductosByMarca:', err);
    return [];
  }
}

export async function getProductosByNombre(nombre: string): Promise<ProductoInventario[]> {
  const valorLimpio = nombre.trim();
  if (!valorLimpio) return [];

  try {
    const res = await fetch(`${ENDPOINT}/nombre/${encodeURIComponent(valorLimpio)}`, {
      method: 'GET',
    });
    
    if (!res.ok) {
      if (res.status === 404) return [];
      throw new Error('Error al buscar por nombre');
    }

    const data = await res.json();
    return (data.success && Array.isArray(data.data)) ? data.data : [];
  } catch (err) {
    console.error('Error getProductosByNombre:', err);
    return [];
  }
}

export async function crearProducto(data: CreateProductoData): Promise<ProductoInventario> {
  try {
    const res = await fetchWithAuth(ENDPOINT, {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ message: 'Error desconocido' }));
      throw new Error(errorData.message || 'Error al crear producto');
    }

    const responseData = await res.json();
    if (!responseData.success || !responseData.data) {
      throw new Error('Respuesta inválida');
    }
    
    return responseData.data;
  } catch (err) {
    console.error('Error crearProducto:', err);
    throw err;
  }
}

export async function actualizarProducto(
  id: number, 
  data: UpdateProductoData
): Promise<ProductoInventario> {
  try {
    const res = await fetchWithAuth(`${ENDPOINT}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ message: 'Error desconocido' }));
      if (res.status === 404) throw new Error('Producto no encontrado');
      throw new Error(errorData.message || 'Error al actualizar producto');
    }

    const responseData = await res.json();
    if (!responseData.success || !responseData.data) {
      throw new Error('Respuesta inválida');
    }
    
    return responseData.data;
  } catch (err) {
    console.error('Error actualizarProducto:', err);
    throw err;
  }
}

export async function eliminarProducto(id: number): Promise<ProductoInventario> {
  try {
    const res = await fetchWithAuth(`${ENDPOINT}/${id}`, {
      method: 'DELETE',
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ message: 'Error desconocido' }));
      if (res.status === 404) throw new Error('Producto no encontrado');
      throw new Error(errorData.message || 'Error al eliminar producto');
    }

    const responseData = await res.json();
    if (!responseData.success || !responseData.data) {
      throw new Error('Respuesta inválida');
    }
    
    return responseData.data;
  } catch (err) {
    console.error('Error eliminarProducto:', err);
    throw err;
  }
}