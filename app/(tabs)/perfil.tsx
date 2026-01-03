import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@context/AuthContext';
import { router } from 'expo-router';
import { Colors, Spacing, BorderRadius, FontSizes, FontWeights } from '@constants/theme';

export default function PerfilScreen() {
    const { usuario, logout } = useAuth();
    const [modalAyudaVisible, setModalAyudaVisible] = useState(false);

    const handleLogout = () => {
        Alert.alert(
            '¿Cerrar sesión?',
            '¿Estás seguro que deseas cerrar sesión?',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
                {
                    text: 'Cerrar sesión',
                    style: 'destructive',
                    onPress: async () => {
                        await logout();
                        router.replace('/login');
                    },
                },
            ],
            { cancelable: true }
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.avatarContainer}>
                    <Ionicons name="person-circle" size={80} color={Colors.primary} />
                </View>
                <Text style={styles.nombreUsuario}>
                    {usuario?.vNombres || 'Usuario'}
                </Text>
                <Text style={styles.emailUsuario}>
                    {usuario?.vUsuario || 'usuario@ejemplo.com'}
                </Text>
            </View>

            <View style={styles.opcionesContainer}>
                <TouchableOpacity 
                    style={styles.opcionItem}
                    onPress={() => setModalAyudaVisible(true)}
                >
                    <Ionicons name="help-circle-outline" size={24} color={Colors.text} />
                    <Text style={styles.opcionTexto}>Ayuda y Soporte</Text>
                    <Ionicons name="chevron-forward" size={24} color={Colors.textLight} />
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.logoutButton}
                    onPress={handleLogout}
                >
                    <Ionicons name="log-out-outline" size={24} color={Colors.error || '#EF4444'} />
                    <Text style={styles.logoutTexto}>Cerrar Sesión</Text>
                </TouchableOpacity>
            </View>

            <Modal
                visible={modalAyudaVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalAyudaVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Ayuda y Soporte</Text>
                            <TouchableOpacity onPress={() => setModalAyudaVisible(false)}>
                                <Ionicons name="close" size={28} color={Colors.text} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.modalContent}>
                            <View style={styles.ayudaItem}>
                                <Ionicons name="mail-outline" size={24} color={Colors.primary} />
                                <View style={styles.ayudaTexto}>
                                    <Text style={styles.ayudaTitulo}>Correo de soporte</Text>
                                    <Text style={styles.ayudaDescripcion}>soporte@smileops.com</Text>
                                </View>
                            </View>

                            <View style={styles.ayudaItem}>
                                <Ionicons name="call-outline" size={24} color={Colors.primary} />
                                <View style={styles.ayudaTexto}>
                                    <Text style={styles.ayudaTitulo}>Teléfono</Text>
                                    <Text style={styles.ayudaDescripcion}>+593 99 123 4567</Text>
                                </View>
                            </View>

                            <View style={styles.ayudaItem}>
                                <Ionicons name="time-outline" size={24} color={Colors.primary} />
                                <View style={styles.ayudaTexto}>
                                    <Text style={styles.ayudaTitulo}>Horario de atención</Text>
                                    <Text style={styles.ayudaDescripcion}>Lunes a Viernes: 8:00 AM - 6:00 PM</Text>
                                </View>
                            </View>

                            <View style={styles.ayudaItem}>
                                <Ionicons name="information-circle-outline" size={24} color={Colors.primary} />
                                <View style={styles.ayudaTexto}>
                                    <Text style={styles.ayudaTitulo}>Versión de la app</Text>
                                    <Text style={styles.ayudaDescripcion}>v1.0.0</Text>
                                </View>
                            </View>
                        </ScrollView>

                        <TouchableOpacity 
                            style={styles.modalButton}
                            onPress={() => setModalAyudaVisible(false)}
                        >
                            <Text style={styles.modalButtonText}>Cerrar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    header: {
        alignItems: 'center',
        paddingVertical: Spacing.xl * 2,
        backgroundColor: Colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    avatarContainer: {
        marginBottom: Spacing.md,
    },
    nombreUsuario: {
        fontSize: FontSizes.xl,
        fontWeight: FontWeights.bold,
        color: Colors.text,
        marginBottom: Spacing.xs,
    },
    emailUsuario: {
        fontSize: FontSizes.sm,
        color: Colors.secondary,
    },
    opcionesContainer: {
        marginTop: Spacing.lg,
        paddingHorizontal: Spacing.md,
    },
    opcionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.surface,
        padding: Spacing.md,
        borderRadius: BorderRadius.md,
        marginBottom: Spacing.sm,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    opcionTexto: {
        flex: 1,
        marginLeft: Spacing.md,
        fontSize: FontSizes.md,
        color: Colors.text,
        fontWeight: FontWeights.medium,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FEE2E2',
        padding: Spacing.md,
        borderRadius: BorderRadius.md,
        marginTop: Spacing.lg,
        borderWidth: 1,
        borderColor: '#FCA5A5',
    },
    logoutTexto: {
        flex: 1,
        marginLeft: Spacing.md,
        fontSize: FontSizes.md,
        color: '#EF4444',
        fontWeight: FontWeights.semibold,
    },
    // Estilos del Modal
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        backgroundColor: Colors.surface,
        borderTopLeftRadius: BorderRadius.xl,
        borderTopRightRadius: BorderRadius.xl,
        paddingTop: Spacing.lg,
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: Spacing.lg,
        paddingBottom: Spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    modalTitle: {
        fontSize: FontSizes.xl,
        fontWeight: FontWeights.bold,
        color: Colors.text,
    },
    modalContent: {
        padding: Spacing.lg,
    },
    ayudaItem: {
        flexDirection: 'row',
        padding: Spacing.md,
        backgroundColor: Colors.background,
        borderRadius: BorderRadius.md,
        marginBottom: Spacing.md,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    ayudaTexto: {
        flex: 1,
        marginLeft: Spacing.md,
    },
    ayudaTitulo: {
        fontSize: FontSizes.md,
        fontWeight: FontWeights.semibold,
        color: Colors.text,
        marginBottom: 4,
    },
    ayudaDescripcion: {
        fontSize: FontSizes.sm,
        color: Colors.textLight,
    },
    modalButton: {
        backgroundColor: Colors.primary,
        margin: Spacing.lg,
        padding: Spacing.md,
        borderRadius: BorderRadius.md,
        alignItems: 'center',
    },
    modalButtonText: {
        color: 'white',
        fontSize: FontSizes.md,
        fontWeight: FontWeights.semibold,
    },
});