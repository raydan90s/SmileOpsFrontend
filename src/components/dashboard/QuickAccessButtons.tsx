import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Calendar, Users } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, FontSizes, BorderRadius } from '@constants/theme';

export function QuickAccessButtons() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ACCESOS RÁPIDOS</Text>
      
      <View style={styles.buttonsRow}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/odontologia/citas-medicas')}
          activeOpacity={0.8}
        >
          <View style={[styles.iconContainer, styles.blueIcon]}>
            <Calendar size={20} color="#BFDBFE" />
          </View>
          <Text style={styles.buttonText}>Ver Agenda</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/odontologia/datos-personales')}
          activeOpacity={0.8}
        >
          <View style={[styles.iconContainer, styles.greenIcon]}>
            <Users size={20} color="#86EFAC" />
          </View>
          <Text style={styles.buttonText}>Mis Pacientes</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.md,
  },
  title: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: FontSizes.xs,
    fontWeight: '600',
    letterSpacing: 1.5,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.xs,
  },
  blueIcon: {
    backgroundColor: 'rgba(59, 130, 246, 0.3)',
  },
  greenIcon: {
    backgroundColor: 'rgba(34, 197, 94, 0.3)',
  },
  buttonText: {
    color: Colors.textInverse,
    fontSize: FontSizes.xs,
    fontWeight: '600',
    flex: 1,
  },
});