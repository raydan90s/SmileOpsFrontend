import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ModuleCard } from './ModuleCard';
import type { Module } from '@data/Modulos/modulos';
import { Colors, Spacing, FontSizes, BorderRadius, Shadows } from '@constants/theme';

interface ModulesGridProps {
  modules: Module[];
  onModuleClick: (key: string) => void;
}

export function ModulesGrid({ modules, onModuleClick }: ModulesGridProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Módulos del Sistema</Text>
      
      <View style={styles.grid}>
        {modules.map((module, index) => (
          <View key={module.key} style={styles.moduleWrapper}>
            <ModuleCard
              module={module}
              index={index}
              onPress={() => onModuleClick(module.key)}
            />
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    ...Shadows.lg,
  },
  title: {
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  grid: {
    gap: Spacing.md,
  },
  moduleWrapper: {
    width: '100%',
  },
});