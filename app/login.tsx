import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Lock, Mail } from 'lucide-react-native';
import { useAuth } from '@context/AuthContext';
import { Colors, Spacing, BorderRadius, FontSizes, Shadows } from '@constants/theme';
import { useRouter } from 'expo-router'; 

const Logo = require('@assets/icon.png'); 

export default function LoginPage() {
  const [usuarioInput, setUsuarioInput] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  
  const { usuario, login, loading } = useAuth();
  const router = useRouter(); 

  useEffect(() => {
    if (usuario && !loading) {
      router.replace('/(tabs)'); 
    }
  }, [usuario, loading]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Verificando sesión...</Text>
      </View>
    );
  }

  const handleSubmit = async () => {
    setError('');
    const success = await login(usuarioInput, password);
    if (success) {
      router.replace('/(tabs)');
    } else {
      setError('Usuario o contraseña incorrectos');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formContainer}>
          <View style={styles.header}>
            <Image
              source={Logo}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.title}>Bienvenido</Text>
            <Text style={styles.subtitle}>
              Ingresa tus credenciales para continuar
            </Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Usuario</Text>
            <View style={styles.inputWrapper}>
              <Mail size={20} color={Colors.secondary} style={styles.icon} />
              <TextInput
                style={styles.input}
                value={usuarioInput}
                onChangeText={setUsuarioInput}
                placeholder="Nombre de usuario"
                placeholderTextColor={Colors.placeholder}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Contraseña</Text>
            <View style={styles.inputWrapper}>
              <Lock size={20} color={Colors.secondary} style={styles.icon} />
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                placeholderTextColor={Colors.placeholder}
                secureTextEntry
                autoCapitalize="none"
              />
            </View>
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={Colors.textInverse} />
            ) : (
              <Text style={styles.buttonText}>Iniciar Sesión</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scrollContainer: { flexGrow: 1, justifyContent: 'center', padding: Spacing.md },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background },
  loadingText: { marginTop: Spacing.md, fontSize: FontSizes.lg, color: Colors.secondary },
  formContainer: { backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, padding: Spacing.xxl, ...Shadows.md },
  header: { alignItems: 'center', marginBottom: Spacing.xl },
  logo: { height: 100, width: 200, marginBottom: Spacing.md },
  title: { fontSize: FontSizes.xxl, fontWeight: 'bold', color: Colors.text, marginBottom: Spacing.sm },
  subtitle: { fontSize: FontSizes.md, color: Colors.secondary, textAlign: 'center' },
  inputGroup: { marginBottom: Spacing.lg },
  label: { fontSize: FontSizes.sm, fontWeight: '600', color: Colors.text, marginBottom: Spacing.sm },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', borderWidth: 2, borderColor: Colors.border, borderRadius: BorderRadius.md, paddingHorizontal: Spacing.md, backgroundColor: Colors.surface },
  icon: { marginRight: Spacing.sm },
  input: { flex: 1, paddingVertical: Spacing.sm, fontSize: FontSizes.md, color: Colors.text },
  errorText: { color: Colors.error, fontSize: FontSizes.sm, marginBottom: Spacing.md },
  optionsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.lg },
  checkboxContainer: { flexDirection: 'row', alignItems: 'center' },
  checkbox: { width: 20, height: 20, borderWidth: 2, borderColor: Colors.border, borderRadius: BorderRadius.sm, marginRight: Spacing.sm, justifyContent: 'center', alignItems: 'center' },
  checkboxChecked: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  checkmark: { color: Colors.textInverse, fontSize: FontSizes.sm, fontWeight: 'bold' },
  checkboxLabel: { fontSize: FontSizes.sm, color: Colors.text },
  forgotPassword: { fontSize: FontSizes.sm, color: Colors.primary, fontWeight: '500' },
  button: { backgroundColor: Colors.primary, paddingVertical: FontSizes.sm, borderRadius: BorderRadius.md, alignItems: 'center', ...Shadows.md },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: Colors.textInverse, fontSize: FontSizes.md, fontWeight: '600' },
});