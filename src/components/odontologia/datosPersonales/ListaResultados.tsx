import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { User, Hash, CreditCard, ChevronRight } from 'lucide-react-native';

import type { PacienteForm } from '@models/Busqueda/PacienteForm.types';
import { Colors, Spacing, FontSizes, BorderRadius } from '@constants/theme';

interface ListaResultadosProps {
  pacientes: PacienteForm[];
  onSeleccionar: (paciente: PacienteForm) => void;
}

export default function ListaResultados({
  pacientes,
  onSeleccionar,
}: ListaResultadosProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <User size={16} color={Colors.textInverse} />
        </View>
        <Text style={styles.headerText}>
          {pacientes.length} {pacientes.length === 1 ? 'resultado encontrado' : 'resultados encontrados'}
        </Text>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
        {pacientes.map((paciente) => (
          <TouchableOpacity
            key={paciente.codigo}
            style={styles.resultCard}
            onPress={() => onSeleccionar(paciente)}
            activeOpacity={0.7}
          >
            <View style={styles.resultContent}>
              <View style={styles.resultInfo}>
                <View style={styles.nombreContainer}>
                  <User size={14} color={Colors.primary} />
                  <Text style={styles.nombreText}>{paciente.nombre}</Text>
                </View>

                <View style={styles.detailsContainer}>
                  <View style={styles.detailItem}>
                    <Hash size={12} color={Colors.textLight} />
                    <Text style={styles.detailText}>
                      Código: <Text style={styles.detailValue}>{paciente.codigo}</Text>
                    </Text>
                  </View>

                  <View style={styles.detailItem}>
                    <CreditCard size={12} color={Colors.textLight} />
                    <Text style={styles.detailText}>
                      CI: <Text style={styles.detailValue}>{paciente.cedula}</Text>
                    </Text>
                  </View>
                </View>
              </View>

              <ChevronRight size={16} color={Colors.textLight} />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Toca un paciente para seleccionarlo
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.xs,
    padding: Spacing.sm,
    backgroundColor: Colors.backgroundLight,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingBottom: Spacing.xs,
    marginBottom: Spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  iconContainer: {
    width: 24,
    height: 24,
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: FontSizes.xs,
    fontWeight: '600',
    color: '#1E40AF',
  },
  scrollContainer: {
    maxHeight: 320,
  },
  scrollContent: {
    gap: Spacing.xs,
  },
  resultCard: {
    padding: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surface,
  },
  resultContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  resultInfo: {
    flex: 1,
    gap: 6,
  },
  nombreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  nombreText: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: Colors.text,
    flex: 1,
  },
  detailsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: FontSizes.xs,
    color: Colors.textLight,
  },
  detailValue: {
    fontWeight: '500',
    color: Colors.text,
  },
  footer: {
    paddingTop: Spacing.xs,
    marginTop: Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  footerText: {
    fontSize: FontSizes.xs,
    color: Colors.textLight,
    textAlign: 'center',
  },
});