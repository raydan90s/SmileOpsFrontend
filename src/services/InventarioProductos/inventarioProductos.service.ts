import type {
  InventarioProducto,
  CreateInventarioProductoData,
  UpdateInventarioProductoData
} from '@models/InventarioProducto/InventarioProducto.types';
import { ProductoInventario } from '@models/ProductoInventario/ProductoInventario.types';

const API_URL = process.env.EXPO_PUBLIC_API_URL;
const ENDPOINT = `${API_URL}/inventario-productos`;

export async function getAllInventarioProductos(): Promise<InventarioProducto[]> {
  try {
    const res = await fetch(ENDPOINT);

    if (!res.ok) {
      throw new Error(`Error al obtener productos de inventario: ${res.status}`);
    }

    const data = await res.json();
    
    if (data.success && data.data) {
      return data.data;
    }
    
    throw new Error('Respuesta inválida del servidor');
  } catch (err) {
    console.error('Error getAllInventarioProductos:', err);
    throw err;
  }
}

export async function getProductoByCodigo(codigo: string): Promise<ProductoInventario | null> {
  if (!codigo.trim()) return null;

  try {
    const res = await fetch(`${ENDPOINT}/codigo/${encodeURIComponent(codigo)}`);
    
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

export async function getInventarioProductoById(id: number): Promise<InventarioProducto> {
  try {
    const res = await fetch(`${ENDPOINT}/${id}`);

    if (!res.ok) {
      if (res.status === 404) {
        throw new Error('Producto de inventario no encontrado');
      }
      throw new Error(`Error al buscar producto de inventario: ${res.status}`);
    }

    const data = await res.json();
    
    if (data.success && data.data) {
      return data.data;
    }
    
    throw new Error('Respuesta inválida del servidor');
  } catch (err) {
    console.error('Error getInventarioProductoById:', err);
    throw err;
  }
}

export async function getInventarioProductoByCodigo(
  codigo: string
): Promise<InventarioProducto> {
  try {
    const res = await fetch(`${ENDPOINT}/codigo/${encodeURIComponent(codigo)}`);

    if (!res.ok) {
      if (res.status === 404) {
        throw new Error('Producto no encontrado con ese código');
      }
      throw new Error(`Error al buscar producto por código: ${res.status}`);
    }

    const data = await res.json();
    
    if (data.success && data.data) {
      return data.data;
    }
    
    throw new Error('Respuesta inválida del servidor');
  } catch (err) {
    console.error('Error getInventarioProductoByCodigo:', err);
    throw err;
  }
}

export async function getInventarioProductosBySubclasificacion(
  idSubclasificacion: number
): Promise<InventarioProducto[]> {
  try {
    const res = await fetch(`${ENDPOINT}/subclasificacion/${idSubclasificacion}`);

    if (!res.ok) {
      throw new Error(
        `Error al obtener productos por subclasificación: ${res.status}`
      );
    }

    const data = await res.json();
    
    if (data.success && data.data) {
      return data.data;
    }
    
    throw new Error('Respuesta inválida del servidor');
  } catch (err) {
    console.error('Error getInventarioProductosBySubclasificacion:', err);
    throw err;
  }
}

export async function getInventarioProductosByMarca(
  idMarca: number
): Promise<InventarioProducto[]> {
  try {
    const res = await fetch(`${ENDPOINT}/marca/${idMarca}`);

    if (!res.ok) {
      throw new Error(`Error al obtener productos por marca: ${res.status}`);
    }

    const data = await res.json();
    
    if (data.success && data.data) {
      return data.data;
    }
    
    throw new Error('Respuesta inválida del servidor');
  } catch (err) {
    console.error('Error getInventarioProductosByMarca:', err);
    throw err;
  }
}

export async function buscarInventarioProductosPorNombre(
  termino: string
): Promise<InventarioProducto[]> {
  try {
    const res = await fetch(`${ENDPOINT}/nombre/${encodeURIComponent(termino)}`);

    if (!res.ok) {
      if (res.status === 404) {
        return [];
      }
      throw new Error(`Error al buscar productos por nombre: ${res.status}`);
    }

    const data = await res.json();
    
    if (data.success && data.data) {
      return data.data;
    }
    
    throw new Error('Respuesta inválida del servidor');
  } catch (err) {
    console.error('Error buscarInventarioProductosPorNombre:', err);
    throw err;
  }
}

export async function getNextCodigoProducto(
  iid_subclasificacion: number
): Promise<string> {
  try {
    const res = await fetch(`${ENDPOINT}/next-codigo/${iid_subclasificacion}`);

    if (!res.ok) {
      throw new Error(`Error al obtener el siguiente código: ${res.status}`);
    }

    const data = await res.json();
    
    if (data.success && data.codigo) {
      return data.codigo;
    }
    
    throw new Error('Respuesta inválida del servidor');
  } catch (err) {
    console.error('Error getNextCodigoProducto:', err);
    throw err;
  }
}

export async function crearInventarioProducto(
  productoData: CreateInventarioProductoData
): Promise<InventarioProducto> {
  try {    
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(productoData),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Error al crear producto de inventario: ${res.status}`
      );
    }

    const data = await res.json();
    
    if (data.success && data.data) {
      return data.data;
    }
    
    throw new Error('Respuesta inválida del servidor');
  } catch (err) {
    console.error('Error crearInventarioProducto:', err);
    throw err;
  }
}

export async function actualizarInventarioProducto(
  id: number,
  productoData: UpdateInventarioProductoData
): Promise<InventarioProducto> {
  try {
    const res = await fetch(`${ENDPOINT}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(productoData),
    });

    if (!res.ok) {
      if (res.status === 404) {
        throw new Error('Producto de inventario no encontrado');
      }
      const errorData = await res.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Error al actualizar producto de inventario: ${res.status}`
      );
    }

    const data = await res.json();
    
    if (data.success && data.data) {
      return data.data;
    }
    
    throw new Error('Respuesta inválida del servidor');
  } catch (err) {
    console.error('Error actualizarInventarioProducto:', err);
    throw err;
  }
}

export async function eliminarInventarioProducto(id: number): Promise<InventarioProducto> {
  try {
    const res = await fetch(`${ENDPOINT}/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
    });

    if (!res.ok) {
      if (res.status === 404) {
        throw new Error('Producto de inventario no encontrado');
      }
      const errorData = await res.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Error al eliminar producto de inventario: ${res.status}`
      );
    }

    const data = await res.json();
    
    if (data.success && data.data) {
      return data.data;
    }
    
    throw new Error('Respuesta inválida del servidor');
  } catch (err) {
    console.error('Error eliminarInventarioProducto:', err);
    throw err;
  }
}