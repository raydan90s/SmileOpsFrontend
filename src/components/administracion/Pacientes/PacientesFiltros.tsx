import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Search } from 'lucide-react-native';
import { Colors, Spacing, BorderRadius, FontSizes } from '@constants/theme';

interface PacientesFiltrosProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const PacientesFiltros: React.FC<PacientesFiltrosProps> = ({
  searchTerm,
  onSearchChange
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      <View 
        style={[
          styles.inputContainer,
          isFocused && styles.inputContainerFocused
        ]}
      >
        <Search 
          size={20} 
          color={isFocused ? Colors.primary : '#9CA3AF'}
          style={styles.icon} 
        />
        
        <TextInput
          value={searchTerm}
          onChangeText={onSearchChange}
          placeholder="Buscar por nombre, cédula o código..."
          placeholderTextColor="#9CA3AF" 
          style={styles.input}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.lg,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    height: 50,
  },
  inputContainerFocused: {
    borderColor: Colors.primary,
    borderWidth: 2, 
  },
  icon: {
    marginRight: Spacing.sm,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: FontSizes.md,
    color: Colors.text,
  }
});

export default PacientesFiltros;