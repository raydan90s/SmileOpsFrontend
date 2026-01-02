import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Colors, Spacing, BorderRadius, FontSizes, Shadows } from '@constants/theme';

interface AddButtonProps {
  icon: React.ElementType; 
  itemText: string;
  onPress: () => void;
  bgColor?: string; 
}

export default function AddButton({ 
  icon: Icon, 
  itemText, 
  onPress, 
  bgColor = '#16a34a', 
}: AddButtonProps) {
  
  const buttonText = `Agregar ${itemText}`; 

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[
        styles.button, 
        { backgroundColor: bgColor }
      ]}
    >
      <Icon size={20} color="#FFFFFF" strokeWidth={2.5} />
      <Text style={styles.text}>{buttonText}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm, 
    paddingHorizontal: Spacing.md, 
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
    ...Shadows.sm,
  },
  text: {
    color: '#FFFFFF',
    fontSize: FontSizes.sm,
    fontWeight: '600',
  },
});