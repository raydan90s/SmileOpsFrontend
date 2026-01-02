import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';

import FormularioPaciente from '@components/administracion/Pacientes/FormularioPaciente'; 
import { Colors, Spacing } from '@constants/theme';

export default function NuevoPacienteScreen() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <Stack.Screen 
                options={{
                    title: 'Registrar Nuevo Paciente',
                    headerShown: true,
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                            <ArrowLeft size={24} color={Colors.text} />
                        </TouchableOpacity>
                    ),
                    headerShadowVisible: false,
                    headerStyle: { backgroundColor: Colors.background },
                    headerTitleStyle: { color: Colors.text, fontWeight: 'bold' },
                }} 
            />

            <View style={styles.content}>
                <FormularioPaciente />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    backButton: {
        marginRight: Spacing.md,
    },
    content: {
        flex: 1,
        paddingHorizontal: Spacing.md,
        marginTop: Spacing.md,
    },
});