import { useState, useEffect } from 'react';
import { getAllProductos } from '@services/ProductoInventario/ProductoInventario.service';
import type { ProductoInventario } from '@models/ProductoInventario/ProductoInventario.types';

export const useProductosInventario = () => {
  const [productos, setProductos] = useState<ProductoInventario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        setLoading(true);
        const data = await getAllProductos();
        setProductos(data);
        setError(null);
      } catch (err) {
        console.error('Error cargando productos:', err);
        setError('Error al cargar los productos');
        setProductos([]);
      } finally {
        setLoading(false);
      }
    };

    cargarProductos();
  }, []);

  return { productos, loading, error };
};