import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { User } from 'lucide-react-native';

import type { PacienteForm } from '@models/Busqueda/PacienteForm.types';
import { Colors, Spacing, FontSizes, BorderRadius } from '@constants/theme';

interface InformacionPacienteProps {
  paciente: PacienteForm;
  mostrarBotonHistorial?: boolean;
}

export default function InformacionPaciente({
  paciente,
  mostrarBotonHistorial = true,
}: InformacionPacienteProps) {
  const router = useRouter();

  const handleVerHistoriaClinica = () => {
    router.push(`/odontologia/historia-clinica?codigo=${paciente.codigo}`);
  };

  if (!mostrarBotonHistorial) {
    return (
      <View style={styles.simpleContainer}>
        <View style={styles.simpleHeader}>
          <View style={styles.checkIconContainer}>
            <User size={16} color={Colors.textInverse} />
          </View>
          <Text style={styles.simpleHeaderText}>✓ Paciente encontrado</Text>
        </View>

        <View style={styles.simpleField}>
          <Text style={styles.simpleLabel}>Código</Text>
          <TextInput
            style={styles.simpleInput}
            value={paciente.codigo}
            editable={false}
          />
        </View>

        <View style={styles.simpleField}>
          <Text style={styles.simpleLabel}>Cédula</Text>
          <TextInput
            style={styles.simpleInput}
            value={paciente.cedula}
            editable={false}
          />
        </View>

        <View style={styles.simpleField}>
          <Text style={styles.simpleLabel}>Nombre Completo</Text>
          <TextInput
            style={styles.simpleInput}
            value={paciente.nombre}
            editable={false}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.iconContainer}>
            <User size={20} color={Colors.textInverse} />
          </View>
          <View>
            <Text style={styles.headerTitle}>Paciente Encontrado</Text>
            <Text style={styles.headerSubtitle}>Información verificada</Text>
          </View>
        </View>
      </View>

      <View style={styles.infoGrid}>
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Código</Text>
          <Text style={styles.infoValue}>{paciente.codigo}</Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Cédula</Text>
          <Text style={styles.infoValue}>{paciente.cedula}</Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Nombre Completo</Text>
          <Text style={styles.infoValue}>{paciente.nombre}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  simpleContainer: {
    gap: Spacing.xs,
    padding: Spacing.sm,
    backgroundColor: Colors.backgroundLight,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.sm,
  },
  simpleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  checkIconContainer: {
    width: 24,
    height: 24,
    backgroundColor: '#16A34A',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  simpleHeaderText: {
    fontSize: FontSizes.xs,
    fontWeight: '600',
    color: '#166534',
  },
  simpleField: {
    gap: 4,
  },
  simpleLabel: {
    fontSize: FontSizes.xs,
    color: Colors.textLight,
    fontWeight: '500',
  },
  simpleInput: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    fontSize: FontSizes.sm,
    backgroundColor: Colors.surface,
    color: Colors.text,
  },

  container: {
    gap: Spacing.sm,
    padding: Spacing.md,
    backgroundColor: Colors.backgroundLight,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.lg,
    marginTop: Spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    flex: 1,
  },
  iconContainer: {
    width: 32,
    height: 32,
    backgroundColor: Colors.primary,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: FontSizes.sm,
    fontWeight: 'bold',
    color: Colors.text,
  },
  headerSubtitle: {
    fontSize: FontSizes.xs,
    color: Colors.textLight,
  },
  historiaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
    gap: 4,
  },
  historiaButtonText: {
    color: Colors.textInverse,
    fontSize: FontSizes.xs,
    fontWeight: '600',
  },
  infoGrid: {
    gap: Spacing.sm,
  },
  infoCard: {
    backgroundColor: Colors.surface,
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  infoLabel: {
    fontSize: FontSizes.xs,
    color: Colors.textLight,
    fontWeight: '600',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: FontSizes.sm,
    fontWeight: 'bold',
    color: Colors.text,
  },
});