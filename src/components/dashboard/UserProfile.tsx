import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useAuth } from '@context/AuthContext';
import { getInitials } from '@utils/fotoProfile';
import { Colors, Spacing, FontSizes } from '@constants/theme';

export function UserProfile() {
  const { usuario } = useAuth();
  const fotoUrl = usuario?.vDireccionfoto?.trim() || null;
  const initials = getInitials(usuario);

  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          {fotoUrl ? (
            <Image
              source={{ uri: fotoUrl }}
              style={styles.avatarImage}
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.initialsText}>{initials}</Text>
            </View>
          )}
        </View>
        
        <View style={styles.onlineIndicatorContainer}>
          <View style={styles.onlineIndicator} />
        </View>
      </View>

      <Text style={styles.welcomeText}>BIENVENIDO</Text>
      <Text style={styles.nombreText}>
        {usuario?.vNombres?.toUpperCase() || 'USUARIO'}
      </Text>
      
      <View style={styles.divider} />
      
      <Text style={styles.apellidosText}>
        {usuario?.vApellidos || 'Usuario del Sistema'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.md,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: Spacing.md,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: Colors.surface,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  initialsText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  onlineIndicatorContainer: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 24,
    height: 24,
    backgroundColor: Colors.success,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  onlineIndicator: {
    width: 8,
    height: 8,
    backgroundColor: Colors.surface,
    borderRadius: 4,
  },
  welcomeText: {
    fontSize: FontSizes.xs,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.7)',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  nombreText: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    color: Colors.textInverse,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  divider: {
    width: 100,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 1,
    marginVertical: Spacing.xs,
  },
  apellidosText: {
    fontSize: FontSizes.sm,
    color: '#d8d8f3',
  },
});