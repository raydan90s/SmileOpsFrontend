import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { Pedido } from '@models/Pedidos/Pedidos.types';
import type { RangoFecha } from '@models/Fechas/Fechas.types';
import type { PermisosAcciones } from '@models/Permisos/Permisos.types';
import { FiltrosPedidos } from '@components/administracion/Pedidos/FiltrosPedidos';
import { ListaPedidos } from '@components/administracion/Pedidos/ListaPedidos';
import  Paginacion from '@components/shared/Paginacion';
import Theme from '@constants/theme';

interface ContenedorPedidosProps {
  items: Pedido[];
  totalItems: number;
  estadoActivo: number;
  busqueda: string;
  rangoFecha: RangoFecha;
  paginaActual: number;
  itemsPorPagina: number;
  indiceInicio: number;
  indiceFin: number;
  onBusquedaChange: (busqueda: string) => void;
  onFiltroFechaChange: (rango: RangoFecha, desde?: string, hasta?: string) => void;
  onCambiarPagina: (pagina: number) => void;
  actions: {
    permisos: {
      puedeVer: boolean;
      puedeEditar: boolean;
      puedeAprobar: boolean;
      puedeRechazar: boolean;
      puedeMarcarRecibido: boolean;
    };
    handleVerDetalle: (item: Pedido) => void;
    handleEditar: (item: Pedido) => void;
    handleAprobar: (item: Pedido) => void;
    handleRechazar: (item: Pedido) => void;
    handleMarcarRecibido: (item: Pedido) => Promise<void>;
    handleEditarCotizacion: (item: Pedido) => void;
    handleEditarCotizado: (item: Pedido) => void;
    handleAprobarCotizacion: (item: Pedido) => void;
  };
}

export const ContenedorPedidos: React.FC<ContenedorPedidosProps> = ({
  items,
  totalItems,
  estadoActivo,
  busqueda,
  rangoFecha,
  paginaActual,
  itemsPorPagina,
  indiceInicio,
  indiceFin,
  onBusquedaChange,
  onFiltroFechaChange,
  onCambiarPagina,
  actions
}) => {
  const totalPaginas = Math.ceil(totalItems / itemsPorPagina);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>LISTADO DE PEDIDOS</Text>
      </View>

      <View style={styles.content}>
        <FiltrosPedidos
          busqueda={busqueda}
          rangoSeleccionado={rangoFecha}
          onBusquedaChange={onBusquedaChange}
          onFiltroFechaChange={onFiltroFechaChange}
        />

        <ListaPedidos
          items={items}
          permisos={actions.permisos as unknown as PermisosAcciones}
          estadoActivo={estadoActivo}
          onVerDetalle={actions.handleVerDetalle}
          onEditar={actions.handleEditar}
          onAprobar={actions.handleAprobar}
          onRechazar={actions.handleRechazar}
          onMarcarRecibido={actions.handleMarcarRecibido}
          onEditarCotizacion={actions.handleEditarCotizacion}
          onAprobarCotizacion={actions.handleAprobarCotizacion}
          onEditarCotizado={actions.handleEditarCotizado}
        />

        {totalItems > 0 && (
          <Paginacion
            paginaActual={paginaActual}
            totalPaginas={totalPaginas}
            indiceInicio={indiceInicio}
            indiceFin={indiceFin}
            totalItems={totalItems}
            onCambiarPagina={onCambiarPagina}
            nombreEntidad="pedidos"
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    borderColor: Theme.colors.primary,
    borderRadius: Theme.borderRadius.md,
    overflow: 'hidden',
    backgroundColor: Theme.colors.surface,
    ...Theme.shadows.lg,
  },
  header: {
    backgroundColor: Theme.colors.primary,
    padding: Theme.spacing.md,
  },
  headerText: {
    fontWeight: Theme.fontWeights.bold,
    color: Theme.colors.textInverse,
    fontSize: Theme.fontSizes.md,
  },
  content: {
    padding: Theme.spacing.lg,
    gap: Theme.spacing.md,
  },
});