import { useState } from 'react';
import type { RangoFecha } from '@models/Fechas/Fechas.types';

export const useFiltrosFecha = () => {
  const [rangoFecha, setRangoFecha] = useState<RangoFecha>('todo');
  const [fechaDesde, setFechaDesde] = useState<string | undefined>();
  const [fechaHasta, setFechaHasta] = useState<string | undefined>();

  const formatearFecha = (fecha: Date): string => {
    const year = fecha.getUTCFullYear();
    const month = String(fecha.getUTCMonth() + 1).padStart(2, '0');
    const day = String(fecha.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const calcularFechas = (
    rango: RangoFecha, 
    desdePersonalizado?: string, 
    hastaPersonalizado?: string
  ): { desde?: string; hasta?: string } => {
    const ahora = new Date();
    const hoy = new Date(Date.UTC(ahora.getUTCFullYear(), ahora.getUTCMonth(), ahora.getUTCDate()));

    switch (rango) {
      case 'hoy':
        return { 
          desde: formatearFecha(hoy), 
          hasta: formatearFecha(hoy) 
        };
      case 'semana':
        const inicioSemana = new Date(hoy);
        inicioSemana.setUTCDate(hoy.getUTCDate() - hoy.getUTCDay());
        return { 
          desde: formatearFecha(inicioSemana), 
          hasta: formatearFecha(hoy) 
        };
      case 'mes':
        const inicioMes = new Date(Date.UTC(hoy.getUTCFullYear(), hoy.getUTCMonth(), 1));
        return { 
          desde: formatearFecha(inicioMes), 
          hasta: formatearFecha(hoy) 
        };
      case 'todo':
        return {};
      case 'personalizado':
        return {
          desde: desdePersonalizado,
          hasta: hastaPersonalizado
        };
      default:
        return {};
    }
  };

  const handleFiltroFechaChange = (
    rango: RangoFecha, 
    desde?: string, 
    hasta?: string
  ) => {

    setRangoFecha(rango);
    const { desde: fechaDesdeCalculada, hasta: fechaHastaCalculada } = 
      calcularFechas(rango, desde, hasta);
        
    setFechaDesde(fechaDesdeCalculada);
    setFechaHasta(fechaHastaCalculada);
    
    return { fechaDesde: fechaDesdeCalculada, fechaHasta: fechaHastaCalculada };
  };

  return {
    rangoFecha,
    fechaDesde,
    fechaHasta,
    calcularFechas,
    handleFiltroFechaChange
  };
};