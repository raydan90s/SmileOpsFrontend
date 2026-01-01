import type { SriData, SriResponse } from "@models/administracion/Proveedores/ConsultaProveedor.types";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export async function consultaSRI_Direct(ruc: string): Promise<SriResponse> {
  try {
    if (!ruc || ruc.trim() === '') {
      return { error: 'El RUC es requerido' };
    }

    if (ruc.length !== 13) {
      return { error: 'El RUC debe tener 13 dígitos' };
    }

    const res = await fetch(`${API_URL}/sri/consultar`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json" 
      },
      body: JSON.stringify({ ruc }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return { 
        error: errorData.message || `Error al consultar el SRI: ${res.status}` 
      };
    }

    const data = await res.json();
    
    if (data.success) {
      return data.data as SriData;
    }
    
    return { 
      error: data.message || "Respuesta inválida del servidor" 
    };

  } catch (err) {
    const errorMessage = (err instanceof Error) 
      ? err.message 
      : "Error desconocido al realizar la consulta al SRI.";
    
    console.error("Error consultaSRI_Direct:", err);
    
    return { error: errorMessage };
  }
}