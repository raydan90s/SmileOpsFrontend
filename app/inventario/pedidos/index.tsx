import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ClipboardList, PlusCircle } from 'lucide-react-native';
import BackButton from '@components/shared/BackButton';
import Theme from '@constants/theme';

export default function PedidosMenuScreen() {
  const router = useRouter();

  const opciones = [
    {
      id: 'estado',
      title: 'Estado de Pedidos',
      subtitle: 'Ver y gestionar pedidos existentes',
      icon: ClipboardList,
      route: '/inventario/pedidos/estado',
      color: '#3B82F6',
    },
    {
      id: 'solicitar',
      title: 'Solicitar Pedidos',
      subtitle: 'Crear nueva orden de pedido',
      icon: PlusCircle,
      route: '/inventario/pedidos/solicitar',
      color: '#10B981',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <BackButton />
      </View>

      <ScrollView style={styles.scrollContainer}>
        <View style={styles.content}>
          <Text style={styles.title}>Gestión de Pedidos</Text>
          <Text style={styles.subtitle}>Seleccione una opción</Text>

          <View style={styles.grid}>
            {opciones.map((opcion) => {
              const Icon = opcion.icon;
              return (
                <TouchableOpacity
                  key={opcion.id}
                  style={styles.card}
                  onPress={() => router.push(opcion.route as any)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.iconContainer, { backgroundColor: opcion.color }]}>
                    <Icon size={32} color="white" strokeWidth={2} />
                  </View>
                  <View style={styles.cardContent}>
                    <Text style={styles.cardTitle}>{opcion.title}</Text>
                    <Text style={styles.cardSubtitle}>{opcion.subtitle}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  header: {
    padding: Theme.spacing.md,
  },
  scrollContainer: {
    flex: 1,
  },
  content: {
    padding: Theme.spacing.md,
  },
  title: {
    fontSize: Theme.fontSizes.xxl,
    fontWeight: Theme.fontWeights.bold,
    color: Theme.colors.text,
    marginBottom: Theme.spacing.xs,
  },
  subtitle: {
    fontSize: Theme.fontSizes.md,
    color: Theme.colors.placeholder,
    marginBottom: Theme.spacing.xl,
  },
  grid: {
    gap: Theme.spacing.md,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.lg,
    ...Theme.shadows.lg,
    borderWidth: 2,
    borderColor: Theme.colors.border,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: Theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Theme.spacing.md,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: Theme.fontSizes.lg,
    fontWeight: Theme.fontWeights.bold,
    color: Theme.colors.text,
    marginBottom: Theme.spacing.xs,
  },
  cardSubtitle: {
    fontSize: Theme.fontSizes.sm,
    color: Theme.colors.placeholder,
  },
});