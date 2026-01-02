import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { User, UserPlus } from 'lucide-react-native';
import BackButton from '@components/shared/BackButton';
import BusquedaPaciente from '@components/Busqueda/ConsultaPaciente';
import { Colors, Spacing, FontSizes, BorderRadius } from '@constants/theme';

export default function DatosPersonalesPage() {
  const router = useRouter();

  const handleNuevoPaciente = () => {
    router.push('/odontologia/pacientes/crear');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <BackButton />
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.pageHeader}>
          <View style={styles.headerLeft}>
            <View style={styles.iconContainer}>
              <User size={28} color={Colors.primary} />
            </View>
            <View>
              <Text style={styles.title}>Datos Personales</Text>
              <Text style={styles.subtitle}>Búsqueda de pacientes</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.addButton}
            onPress={handleNuevoPaciente}
            activeOpacity={0.8}
          >
            <UserPlus size={20} color={Colors.textInverse} />
            <Text style={styles.addButtonText}>Nuevo</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.searchCard}>
          <Text style={styles.searchTitle}>Buscar Paciente</Text>
          <BusquedaPaciente
            mostrarMensajeAyuda={true}
            mostrarBotonHistorial={true}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: Spacing.md,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  pageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    backgroundColor: `${Colors.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    color: Colors.text,
  },
  subtitle: {
    fontSize: FontSizes.xs,
    color: Colors.secondary,
    marginTop: 2,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    gap: Spacing.xs,
  },
  addButtonText: {
    color: Colors.textInverse,
    fontSize: FontSizes.sm,
    fontWeight: '600',
  },
  searchCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
  },
  searchTitle: {
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Spacing.md,
  },
});