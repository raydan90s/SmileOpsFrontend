import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useModules } from '@hooks/useModulos';
import { UserProfile } from '@components/dashboard/UserProfile';
import { QuickAccessButtons } from '@components/dashboard/QuickAccessButtons';
import { ModulesGrid } from '@components/dashboard/ModulesGrid';
import { Colors, Spacing } from '@constants/theme';

export default function Dashboard() {
  const modules = useModules();
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <UserProfile />
        </View>

        <View style={styles.quickAccessSection}>
          <QuickAccessButtons />
        </View>

        <View style={styles.modulesSection}>
          <ModulesGrid
            modules={modules}
            onModuleClick={(key) => router.push(`/${key}` as any)}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: Spacing.xl,
  },
  header: {
    backgroundColor: Colors.primary,
    paddingBottom: Spacing.md,
  },
  quickAccessSection: {
    backgroundColor: Colors.primary,
    paddingBottom: Spacing.xl,
  },
  modulesSection: {
    backgroundColor: Colors.background,
    padding: Spacing.lg,
    flex: 1,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
});