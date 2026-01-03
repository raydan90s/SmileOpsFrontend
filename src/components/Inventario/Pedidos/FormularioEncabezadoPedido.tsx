import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import { Colors, Spacing, BorderRadius, FontSizes, FontWeights, Shadows } from '@constants/theme';

interface FormularioEncabezadoPedidoProps {
  icon: LucideIcon;
  titulo: string;
  subtitulo: string;
  nextId?: number | null;
  formatearId?: (id: number) => string;
  labelNextId?: string;
  children: React.ReactNode;
}

const FormularioEncabezadoPedido: React.FC<FormularioEncabezadoPedidoProps> = ({
  icon: Icon,
  titulo,
  subtitulo,
  nextId,
  formatearId,
  labelNextId = 'Próximo',
  children,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.leftSection}>
          <View style={styles.iconContainer}>
            <Icon size={20} color={Colors.textInverse} strokeWidth={2.5} />
          </View>
          <View>
            <Text style={styles.title}>{titulo}</Text>
            <Text style={styles.subtitle}>{subtitulo}</Text>
          </View>
        </View>

        {nextId && formatearId && (
          <View style={styles.rightSection}>
            <Text style={styles.nextLabel}>{labelNextId}</Text>
            <Text style={styles.nextValue}>{formatearId(nextId)}</Text>
          </View>
        )}
      </View>

      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.lg,
    padding: Spacing.md,
    ...Shadows.sm,
  },
  header: {
    flexDirection: 'column',
    gap: Spacing.sm,
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    marginBottom: Spacing.md,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flex: 1,
    flexShrink: 1,
  },
  iconContainer: {
    backgroundColor: Colors.primary,
    padding: 10,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.text,
  },
  subtitle: {
    fontSize: FontSizes.xs,
    color: Colors.secondary,
    flexShrink: 1,
  },
  rightSection: {
    alignItems: 'flex-start',
    width: '100%',
  },
  nextLabel: {
    fontSize: FontSizes.xs,
    color: Colors.secondary,
    fontWeight: FontWeights.medium,
  },
  nextValue: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.primary,
  },
  content: {
  }
});

export default FormularioEncabezadoPedido;