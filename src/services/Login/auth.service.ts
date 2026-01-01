import type { Usuario } from "@models/Login/usuario.types";
import type { Permisos } from "@models/Login/permisos.types";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export async function loginUser(vUsuario: string, vClave: string): Promise<{ usuario: Usuario, permisos: Permisos, token: string } | null> {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ vUsuario, vClave }),
  });
  const data = await response.json();
  if (data.success) {
    return { usuario: data.usuario, permisos: data.permisos, token: data.token,  };
  }
  return null;
}

export async function fetchUserFromToken(token: string): Promise<{ usuario: Usuario, permisos: Permisos } | null> {
  const response = await fetch(`${API_URL}/login/token`, {
    headers: { "Authorization": `Bearer ${token}` }
  });

  if (!response.ok) return null;
  const data = await response.json();
  return { usuario: data.usuario, permisos: data.permisos };
}
