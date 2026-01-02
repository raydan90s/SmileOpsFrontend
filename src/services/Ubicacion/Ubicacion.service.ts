const API_URL = process.env.EXPO_PUBLIC_API_URL;

export async function obtenerProvincias(iidpais: number) {
  const res = await fetch(`${API_URL}/provincias?iidpais=${iidpais}`);
  const data = await res.json();
  return data.success ? data.data : [];
}

export async function obtenerCiudades(iidprovincia?: number, iidpais?: number) {
  let url = `${API_URL}/ciudades?`;
  const params = new URLSearchParams();
  
  if (iidprovincia) {
    params.append('iidprovincia', iidprovincia.toString());
  }
  
  if (iidpais) {
    params.append('iidpais', iidpais.toString());
  }
  
  const res = await fetch(`${url}${params.toString()}`);
  const data = await res.json();
  return data.success ? data.data : [];
}

export async function obtenerCiudadPorId(iidciudad: number) {
  const res = await fetch(`${API_URL}/ciudades/${iidciudad}`);
  const data = await res.json();
  return data.success ? data.data : null;
}