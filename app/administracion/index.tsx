import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import { Colors, Spacing, FontSizes, BorderRadius, Shadows } from '@constants/theme';
import { menuItems } from '@data/SubModulos/administracion';

export default function AdministracionHome() {
  const router = useRouter();

  const handlePress = (item: typeof menuItems[0]) => {
    if (item.children && item.children.length > 0) {
      router.push(item.route as any);
    } else {
      router.push(item.route as any);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Módulo de Administración</Text>
        <Text style={styles.subtitle}>Seleccione una opción</Text>
      </View>

      <View style={styles.content}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <TouchableOpacity
              key={item.id}
              style={styles.menuCard}
              onPress={() => handlePress(item)}
              activeOpacity={0.7}
            >
              <View style={styles.iconContainer}>
                <Icon size={32} color={Colors.primary} strokeWidth={2} />
              </View>
              
              <View style={styles.textContainer}>
                <View style={styles.titleRow}>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                  {item.children && item.children.length > 0 && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{item.children.length}</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
              </View>

              <ChevronRight size={24} color={Colors.textLight} />
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: Spacing.lg,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontSize: FontSizes.xxl,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: FontSizes.md,
    color: Colors.textLight,
  },
  content: {
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  menuCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.md,
    borderWidth: 2,
    borderColor: Colors.border,
    ...Shadows.sm,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.md,
    backgroundColor: `${Colors.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  menuTitle: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    color: Colors.text,
  },
  badge: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.full,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    fontSize: FontSizes.xs,
    fontWeight: 'bold',
    color: Colors.textInverse,
  },
  menuSubtitle: {
    fontSize: FontSizes.sm,
    color: Colors.textLight,
    marginTop: 2,
  },
});