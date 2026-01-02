const API_URL = process.env.EXPO_PUBLIC_API_URL;

export async function obtenerSiguienteFicha(): Promise<string> {
  try {
    const res = await fetch(`${API_URL}/pacientes/next-ficha`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Error en la petición: ${res.status}`);
    }
    const data = await res.json();
    if (data.success && data.nextFicha) return data.nextFicha.toString();
    throw new Error("Respuesta inválida del servidor");
  } catch (err) {
    console.error("Error obtenerSiguienteFicha:", err);
    throw err;
  }
}
