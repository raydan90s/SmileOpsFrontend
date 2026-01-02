import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronRight, Settings } from 'lucide-react-native';
import BackButton from '@components/shared/BackButton';
import { Colors, Spacing, FontSizes, BorderRadius, Shadows } from '@constants/theme';
import { findMenuItemById } from '@data/SubModulos/administracion';

export default function ParametrosGeneralesHome() {
  const router = useRouter();
  const menuItem = findMenuItemById('parametros-generales');

  if (!menuItem?.children) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <BackButton />
      </View>

      <View style={styles.pageHeader}>
        <View style={styles.iconContainer}>
          <Settings size={32} color={Colors.primary} strokeWidth={2} />
        </View>
        <View style={styles.headerText}>
          <Text style={styles.title}>{menuItem.title}</Text>
          <Text style={styles.subtitle}>{menuItem.subtitle}</Text>
        </View>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        {menuItem.children.map((child) => {
          const Icon = child.icon;
          return (
            <TouchableOpacity
              key={child.id}
              style={styles.menuCard}
              onPress={() => router.push(child.route as any)}
              activeOpacity={0.7}
            >
              <View style={styles.cardIconContainer}>
                <Icon size={24} color={Colors.primary} strokeWidth={2} />
              </View>
              
              <View style={styles.textContainer}>
                <Text style={styles.menuTitle}>{child.title}</Text>
                <Text style={styles.menuSubtitle}>{child.subtitle}</Text>
              </View>

              <ChevronRight size={20} color={Colors.textLight} />
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: Spacing.md,
  },
  pageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    gap: Spacing.md,
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.md,
    backgroundColor: `${Colors.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: FontSizes.xxl,
    fontWeight: 'bold',
    color: Colors.text,
  },
  subtitle: {
    fontSize: FontSizes.sm,
    color: Colors.secondary,
    marginTop: 2,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  menuCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.sm,
  },
  cardIconContainer: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.sm,
    backgroundColor: `${Colors.primary}10`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.text,
  },
  menuSubtitle: {
    fontSize: FontSizes.xs,
    color: Colors.secondary,
    marginTop: 2,
  },
});