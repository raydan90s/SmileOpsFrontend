import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ShoppingCart, RefreshCw, Package } from 'lucide-react-native';
import type { EstadoPedido } from '@models/Pedidos/Pedidos.types';
import { TabsEstados } from '@components/administracion/Pedidos/TabsOrdenes';
import Theme from '@constants/theme';

type EstadoGenerico = EstadoPedido;

interface HeaderGestionProps {
  tipo: 'pedido' | 'requisicion';
  estadoActivo: number;
  onEstadoChange: (estado: number) => void;
  onRefrescar: () => void;
  estados: EstadoGenerico[];
  loadingEstados?: boolean;
}

export const HeaderGestion = ({
  tipo,
  estadoActivo,
  onEstadoChange,
  onRefrescar,
  estados,
  loadingEstados = false
}: HeaderGestionProps) => {
  const config = {
    pedido: {
      titulo: 'Gestión de Pedidos',
      subtitulo: 'Administra y aprueba las órdenes de pedido',
      icon: ShoppingCart
    },
    requisicion: {
      titulo: 'Gestión de Requisiciones',
      subtitulo: 'Administra y aprueba las requisiciones de inventario',
      icon: Package
    }
  };

  const { titulo, subtitulo, icon: Icon } = config[tipo];

  return (
    <View style={styles.container}>
      <View style={styles.headerSection}>
        <View style={styles.iconContainer}>
          <Icon size={20} color={Theme.colors.textInverse} strokeWidth={2} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{titulo}</Text>
          <Text style={styles.subtitle}>{subtitulo}</Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={onRefrescar}
        style={styles.refreshButton}
        activeOpacity={0.8}
      >
        <RefreshCw size={16} color={Theme.colors.textInverse} strokeWidth={2} />
        <Text style={styles.refreshButtonText}>Refrescar</Text>
      </TouchableOpacity>

      <View style={styles.divider} />

      <View style={styles.tabsContainer}>
        <TabsEstados
          estadoActivo={estadoActivo}
          onEstadoChange={onEstadoChange}
          estados={estados}
          loading={loadingEstados}
        />
      </View>
    </View>
  );
};

export const HeaderGestionPedidos = (props: Omit<HeaderGestionProps, 'tipo'>) => (
  <HeaderGestion {...props} tipo="pedido" />
);


const styles = StyleSheet.create({
  container: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
    ...Theme.shadows.md,
  },
  headerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.sm,
    marginBottom: Theme.spacing.sm,
  },
  iconContainer: {
    backgroundColor: Theme.colors.primary,
    padding: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.md,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: Theme.fontSizes.lg,
    fontWeight: Theme.fontWeights.bold,
    color: Theme.colors.text,
  },
  subtitle: {
    fontSize: Theme.fontSizes.xs,
    color: Theme.colors.placeholder,
    marginTop: 2,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Theme.spacing.xs,
    backgroundColor: Theme.colors.primary,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.md,
    marginBottom: Theme.spacing.sm,
  },
  refreshButtonText: {
    color: Theme.colors.textInverse,
    fontSize: Theme.fontSizes.sm,
    fontWeight: Theme.fontWeights.semibold,
  },
  divider: {
    height: 1,
    backgroundColor: Theme.colors.border,
    marginVertical: Theme.spacing.sm,
  },
  tabsContainer: {
    marginTop: Theme.spacing.xs,
  },
});