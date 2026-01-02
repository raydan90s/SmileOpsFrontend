import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, FontSizes } from '@constants/theme';

interface FormFieldProps {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  colSpan?: 'full' | 'half';
}

const FormField: React.FC<FormFieldProps> = ({ 
  label, 
  required, 
  children, 
  colSpan = 'full' 
}) => {
  return (
    <View 
      style={[
        styles.container, 
        colSpan === 'half' ? styles.halfWidth : styles.fullWidth
      ]}
    >
      <Text style={styles.label}>
        {label} {required && <Text style={styles.required}>*</Text>}
      </Text>
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md, 
  },
  fullWidth: {
    width: '100%',
  },
  halfWidth: {
    width: '48%', 
  },
  label: {
    fontSize: FontSizes.sm,
    fontWeight: '600', 
    color: Colors.text,
    marginBottom: 4, 
  },
  required: {
    color: Colors.error,
  },
  content: {
  }
});

export default FormField;