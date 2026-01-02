import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';

import Theme, {
} from '@constants/theme';
import type { EstadoPedido } from '@models/Pedidos/Pedidos.types';

interface TabsEstadosProps {
  estadoActivo: number;
  onEstadoChange: (estado: number) => void;
  estados: EstadoPedido[];
  loading?: boolean;
}

export const TabsEstados: React.FC<TabsEstadosProps> = ({
  estadoActivo,
  onEstadoChange,
  estados,
  loading = false,
}) => {
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        {[1, 2, 3, 4].map((i) => (
          <View key={i} style={styles.skeletonItem} />
        ))}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
      >
        {estados.map((estado) => {
          const isActive = estadoActivo === estado.iid_estado_pedido;

          return (
            <TouchableOpacity
              key={estado.iid_estado_pedido}
              onPress={() => onEstadoChange(estado.iid_estado_pedido)}
              activeOpacity={0.8}
              style={[
                styles.tabButton,
                isActive ? styles.tabActive : styles.tabInactive,
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  isActive ? styles.textActive : styles.textInactive,
                ]}
              >
                {estado.v_descripcion}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: Theme.spacing.xs,
  },
  scrollView: {
    flexGrow: 0,
  },
  scrollContent: {
    paddingHorizontal: Theme.spacing.xs,
    gap: Theme.spacing.xs,
    alignItems: 'center',
  },
  tabButton: {
    paddingVertical: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.md,
    borderWidth: 1,
    minWidth: 85,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabActive: {
    backgroundColor: Theme.colors.primary,
    borderColor: Theme.colors.primary,
    ...Theme.shadows.sm,
  },
  tabInactive: {
    backgroundColor: Theme.colors.surface,
    borderColor: Theme.colors.border,
  },
  tabText: {
    fontSize: Theme.fontSizes.xs,
  },
  textActive: {
    color: Theme.colors.textInverse,
    fontWeight: Theme.fontWeights.semibold,
  },
  textInactive: {
    color: Theme.colors.text,
    fontWeight: Theme.fontWeights.medium,
  },
  loadingContainer: {
    flexDirection: 'row',
    paddingHorizontal: Theme.spacing.xs,
    gap: Theme.spacing.xs,
  },
  skeletonItem: {
    width: 85,
    height: 36,
    backgroundColor: Theme.colors.backgroundLight,
    borderRadius: Theme.borderRadius.md,
  },
});