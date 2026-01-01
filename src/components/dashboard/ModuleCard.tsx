import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Animated, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import type { Module } from '@data/Modulos/modulos';
import { Colors, Spacing, FontSizes, BorderRadius, Shadows } from '@constants/theme';

interface ModuleCardProps {
  module: Module;
  index: number;
  onPress: () => void;
}

export function ModuleCard({ module, onPress }: ModuleCardProps) {
  const Icon = module.icon;
  const scaleAnim = new Animated.Value(1);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={styles.card}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
      >
        <View style={styles.leftContent}>
          <View style={styles.iconContainer}>
            <Icon size={32} color={Colors.primary} strokeWidth={2} />
          </View>
          
          <View style={styles.textContainer}>
            <Text style={styles.moduleName}>{module.name}</Text>
            <Text style={styles.moduleSubtitle}>Gestionar {module.name.toLowerCase()}</Text>
          </View>
        </View>
        
        <ChevronRight size={24} color={Colors.textLight} />
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 2,
    borderColor: Colors.borderLight,
    ...Shadows.md,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.md,
    backgroundColor: `${Colors.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  textContainer: {
    flex: 1,
  },
  moduleName: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  moduleSubtitle: {
    fontSize: FontSizes.sm,
    color: Colors.secondaryDark,
  },
});