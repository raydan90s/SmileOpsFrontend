import { apiRequest } from '@utils/api';
import type {
  Pedido,
  CreatePedidoDTO,
  UpdatePedidoDTO,
  CotizarPedidoDTO,
  RechazarPedidoDTO,
  RecibirPedidoDTO,
  TipoPedido,
  EstadoPedido,
  PedidoFilters,
  ActualizarPedidoCotizadoDTO
} from '@models/Pedidos/Pedidos.types';
import type { ApiResponse } from '@models/Api.types';
import type { CreateFacturaPedidoDTO } from '@models/FacturaPedido/FacturaPedido.types';

export async function recibirPedido(
  id: number,
  recepcion: RecibirPedidoDTO
): Promise<Pedido> {
  try {
    const data = await apiRequest<ApiResponse<Pedido>>(`/pedidos/${id}/recibir`, {
      method: "PATCH",
      body: JSON.stringify(recepcion),
    });

    if (data.success && data.data) {
      return data.data;
    }

    throw new Error(data.message || "Respuesta inválida del servidor");
  } catch (err) {
    console.error("Error recibirPedido:", err);
    throw err;
  }
}

export async function registrarFacturaPedido(
  id_pedido: number,
  factura: CreateFacturaPedidoDTO
): Promise<Pedido> {
  try {
    const data = await apiRequest<ApiResponse<Pedido>>(`/pedidos/${id_pedido}/factura`, {
      method: "POST",
      body: JSON.stringify(factura),
    });

    if (data.success && data.data) {
      return data.data;
    }

    throw new Error(data.message || "Respuesta inválida del servidor");
  } catch (err) {
    console.error("Error registrarFacturaPedido:", err);
    throw err;
  }
}

export async function fetchNextPedidoId(): Promise<number> {
  try {
    const data = await apiRequest<ApiResponse<{ next_id: number }>>('/pedidos/next-id', {
      method: 'GET',
    });

    if (data.success && data.data) {
      return data.data.next_id;
    }

    throw new Error(data.message || "Respuesta inválida del servidor");
  } catch (err) {
    console.error("Error fetchNextPedidoId:", err);
    throw err;
  }
}

export async function fetchTiposPedido(): Promise<TipoPedido[]> {
  try {
    const data = await apiRequest<ApiResponse<TipoPedido[]>>('/pedidos/tipos', {
      method: 'GET',
    });

    if (data.success) {
      return data.data || [];
    }

    throw new Error(data.message || "Respuesta inválida del servidor");
  } catch (err) {
    console.error("Error fetchTiposPedido:", err);
    throw err;
  }
}

export async function fetchEstadosPedido(): Promise<EstadoPedido[]> {
  try {
    const data = await apiRequest<ApiResponse<EstadoPedido[]>>('/pedidos/estados', {
      method: 'GET',
    });

    if (data.success) {
      return data.data || [];
    }

    throw new Error(data.message || "Respuesta inválida del servidor");
  } catch (err) {
    console.error("Error fetchEstadosPedido:", err);
    throw err;
  }
}

export async function fetchAllPedidos(filters?: PedidoFilters): Promise<Pedido[]> {
  try {
    const params = new URLSearchParams();

    if (filters?.iid_estado_pedido) {
      params.append('iid_estado_pedido', filters.iid_estado_pedido.toString());
    }
    if (filters?.iid_tipo_pedido) {
      params.append('iid_tipo_pedido', filters.iid_tipo_pedido.toString());
    }
    if (filters?.iid_bodega_destino) {
      params.append('iid_bodega_destino', filters.iid_bodega_destino.toString());
    }
    if (filters?.iid_proveedor) {
      params.append('iid_proveedor', filters.iid_proveedor.toString());
    }
    if (filters?.fecha_desde) {
      params.append('fecha_desde', filters.fecha_desde);
    }
    if (filters?.fecha_hasta) {
      params.append('fecha_hasta', filters.fecha_hasta);
    }

    const queryString = params.toString();
    const endpoint = queryString ? `/pedidos?${queryString}` : '/pedidos';

    const data = await apiRequest<ApiResponse<Pedido[]>>(endpoint, {
      method: 'GET',
    });

    if (data.success) {
      return data.data || [];
    }

    throw new Error(data.message || "Respuesta inválida del servidor");
  } catch (err) {
    console.error("Error fetchAllPedidos:", err);
    throw err;
  }
}

export async function getPedidoById(id: number): Promise<Pedido> {
  try {
    const data = await apiRequest<ApiResponse<Pedido>>(`/pedidos/${id}`, {
      method: 'GET',
    });

    if (data.success && data.data) {
      return data.data;
    }

    throw new Error(data.message || "Respuesta inválida del servidor");
  } catch (err) {
    console.error("Error getPedidoById:", err);
    throw err;
  }
}

export async function createPedido(pedido: CreatePedidoDTO): Promise<Pedido> {
  try {
    const data = await apiRequest<ApiResponse<Pedido>>('/pedidos', {
      method: "POST",
      body: JSON.stringify(pedido),
    });

    if (data.success && data.data) {
      return data.data;
    }

    throw new Error(data.message || "Respuesta inválida del servidor");
  } catch (err) {
    console.error("Error createPedido:", err);
    throw err;
  }
}

export async function updatePedido(
  id: number,
  pedido: UpdatePedidoDTO
): Promise<Pedido> {
  try {
    const data = await apiRequest<ApiResponse<Pedido>>(`/pedidos/${id}`, {
      method: "PUT",
      body: JSON.stringify(pedido),
    });

    if (data.success && data.data) {
      return data.data;
    }

    throw new Error(data.message || "Respuesta inválida del servidor");
  } catch (err) {
    console.error("Error updatePedido:", err);
    throw err;
  }
}

export async function cotizarPedido(
  id: number,
  cotizacion: CotizarPedidoDTO
): Promise<Pedido> {
  try {
    const data = await apiRequest<ApiResponse<Pedido>>(`/pedidos/${id}/cotizar`, {
      method: "PATCH",
      body: JSON.stringify(cotizacion),
    });

    if (data.success && data.data) {
      return data.data;
    }

    throw new Error(data.message || "Respuesta inválida del servidor");
  } catch (err) {
    console.error("Error cotizarPedido:", err);
    throw err;
  }
}

export async function aprobarPedido(
  id: number,
  aprobarData: { iid_usuario_aprueba: number; v_observaciones?: string }
): Promise<Pedido> {
  try {
    const data = await apiRequest<ApiResponse<Pedido>>(`/pedidos/${id}/aprobar`, {
      method: "PATCH",
      body: JSON.stringify(aprobarData),
    });

    if (data.success && data.data) {
      return data.data;
    }

    throw new Error(data.message || "Respuesta inválida del servidor");
  } catch (err) {
    console.error("Error aprobarPedido:", err);
    throw err;
  }
}

export async function rechazarPedido(
  id: number,
  rechazo: RechazarPedidoDTO
): Promise<Pedido> {
  try {
    const data = await apiRequest<ApiResponse<Pedido>>(`/pedidos/${id}/rechazar`, {
      method: "PATCH",
      body: JSON.stringify(rechazo),
    });

    if (data.success && data.data) {
      return data.data;
    }

    throw new Error(data.message || "Respuesta inválida del servidor");
  } catch (err) {
    console.error("Error rechazarPedido:", err);
    throw err;
  }
}

export async function aprobarCotizacionFinal(
  id: number,
  datos: { v_observaciones?: string }
): Promise<Pedido> {
  try {
    const data = await apiRequest<ApiResponse<Pedido>>(`/pedidos/${id}/aprobar-cotizacion`, {
      method: "PATCH",
      body: JSON.stringify(datos),
    });

    if (data.success && data.data) {
      return data.data;
    }

    throw new Error(data.message || "Respuesta inválida del servidor");
  } catch (err) {
    console.error("Error aprobarCotizacionFinal:", err);
    throw err;
  }
}

export async function actualizarPedidoCotizado(
  id: number,
  datos: ActualizarPedidoCotizadoDTO
): Promise<Pedido> {
  try {
    const data = await apiRequest<ApiResponse<Pedido>>(`/pedidos/${id}/actualizar-cotizacion`, {
      method: "PUT",
      body: JSON.stringify(datos),
    });

    if (data.success && data.data) {
      return data.data;
    }

    throw new Error(data.message || "Respuesta inválida del servidor");
  } catch (err) {
    console.error("Error actualizarPedidoCotizado:", err);
    throw err;
  }
}