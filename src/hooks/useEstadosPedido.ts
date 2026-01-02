import { useState, useEffect } from 'react';
import { fetchEstadosPedido } from '@services/Pedidos/Pedidos.service';
import type { EstadoPedido } from '@models/Pedidos/Pedidos.types';

export const useEstadosPedido = () => {
    const [estados, setEstados] = useState<EstadoPedido[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const cargarEstados = async () => {
            try {
                setLoading(true);
                const data = await fetchEstadosPedido();
                setEstados(data);
                setError(null);
            } catch (err) {
                console.error('Error al cargar estados de pedido:', err);
                setError('Error al cargar los estados');
            } finally {
                setLoading(false);
            }
        };

        cargarEstados();
    }, []);

    return { estados, loading, error };
};