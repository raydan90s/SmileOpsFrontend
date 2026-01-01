import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { MapPin, Trash2 } from 'lucide-react-native';
import { Colors, Spacing, FontSizes, BorderRadius } from '@constants/theme';

interface DireccionItemProps {
  direccion: string;
  ciudad: string;
  provincia: string;
  pais: string;
  onChangeDireccion: (value: string) => void;
  onChangeCiudad: (value: string) => void;
  onChangeProvincia: (value: string) => void;
  onChangePais: (value: string) => void;
  onDelete: () => void;
}

export default function DireccionItem({
  direccion,
  ciudad,
  provincia,
  pais,
  onChangeDireccion,
  onChangeCiudad,
  onChangeProvincia,
  onChangePais,
  onDelete
}: DireccionItemProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <MapPin size={20} color={Colors.primary} />
      </View>

      <View style={styles.content}>
        <TextInput
          style={styles.input}
          value={direccion}
          onChangeText={onChangeDireccion}
          placeholder="Dirección"
          placeholderTextColor={Colors.placeholder}
        />
        <TextInput
          style={styles.input}
          value={ciudad}
          onChangeText={onChangeCiudad}
          placeholder="Ciudad"
          placeholderTextColor={Colors.placeholder}
        />
        <TextInput
          style={styles.input}
          value={provincia}
          onChangeText={onChangeProvincia}
          placeholder="Provincia"
          placeholderTextColor={Colors.placeholder}
        />
        <TextInput
          style={styles.input}
          value={pais}
          onChangeText={onChangePais}
          placeholder="País"
          placeholderTextColor={Colors.placeholder}
        />
      </View>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={onDelete}
        activeOpacity={0.7}
      >
        <Trash2 size={20} color={Colors.error} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.backgroundLight,
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    gap: Spacing.sm,
  },
  iconContainer: {
    paddingTop: Spacing.sm,
  },
  content: {
    flex: 1,
    gap: Spacing.xs,
  },
  input: {
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    fontSize: FontSizes.sm,
    color: Colors.text,
  },
  deleteButton: {
    padding: Spacing.xs,
    paddingTop: Spacing.sm,
  },
});