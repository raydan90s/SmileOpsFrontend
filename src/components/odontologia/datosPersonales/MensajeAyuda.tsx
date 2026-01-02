import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Info, AlertCircle } from 'lucide-react-native';
import { Colors, Spacing, FontSizes, BorderRadius } from '@constants/theme';

interface MensajeAyudaProps {
  tipo?: 'info' | 'error';
  mensaje: string;
  submensaje?: string;
}

export default function MensajeAyuda({
  tipo = 'info',
  mensaje,
  submensaje,
}: MensajeAyudaProps) {
  const isError = tipo === 'error';
  const Icon = isError ? AlertCircle : Info;
  const emoji = tipo === 'info' ? '💡 ' : '';

  return (
    <View style={[styles.container, isError ? styles.errorContainer : styles.infoContainer]}>
      <Icon
        size={20}
        color={isError ? '#991B1B' : Colors.primary}
        style={styles.icon}
      />
      <View style={styles.textContainer}>
        <Text style={[styles.mensaje, isError ? styles.errorText : styles.infoText]}>
          {emoji}{mensaje}
        </Text>
        {submensaje && (
          <Text style={[styles.submensaje, isError ? styles.errorSubtext : styles.infoSubtext]}>
            {submensaje}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
  },
  infoContainer: {
    backgroundColor: `${Colors.primary}10`,
    borderColor: Colors.primary,
  },
  errorContainer: {
    backgroundColor: '#FEE2E2',
    borderColor: '#FCA5A5',
  },
  icon: {
    marginRight: Spacing.xs,
    marginTop: 2,
  },
  textContainer: {
    flex: 1,
  },
  mensaje: {
    fontSize: FontSizes.xs,
    fontWeight: '500',
  },
  infoText: {
    color: Colors.primary,
  },
  errorText: {
    color: '#991B1B',
  },
  submensaje: {
    fontSize: FontSizes.xs,
    marginTop: 4,
  },
  infoSubtext: {
    color: Colors.text,
  },
  errorSubtext: {
    color: '#991B1B',
  },
});