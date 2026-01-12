import { Redirect, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pais } from '@models/Paises/Paises.types';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { fetchAllPaises } from '@services/Paises/paises.service';
import { Colors, Spacing, BorderRadius, FontSizes, FontWeights, Shadows } from '@constants/theme';
import SelectUbicacion from '@components/shared/SelectUbicacion';

export default function apiPublica() {
    const [paises, setPaises] = useState<Pais[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchPaises = async () => {
        setLoading(true);
        try {
            const data = await fetchAllPaises();
            setPaises(data);
        } catch (err) {
            console.error("Error al cargar países:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = () => {
        console.log("CAMbIANDO");
    };

    const handleSubmit = () => {
        router.replace("/login")
    };

    useEffect(() => {
        fetchPaises();
    }, []);

    return (
        <View>
            <View style={styles.halfWidth}>
                <SelectUbicacion
                    label="País"
                    tipo="pais"
                    opciones={paises}
                    onChange={handleChange}
                    value='1'
                    required
                />
            </View>

            <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}

                onPress={handleSubmit}
                disabled={loading}
            >
                <Text style={styles.buttonText}>Iniciar Sesión</Text>
            </TouchableOpacity>
        </View>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    button: { backgroundColor: Colors.primary, paddingVertical: FontSizes.sm, borderRadius: BorderRadius.md, alignItems: 'center', ...Shadows.md },
    buttonDisabled: { opacity: 0.5 },

    halfWidth: {

        marginTop: Spacing.xxxl,
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
        color: Colors.primary,
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
    buttonText: { color: Colors.textInverse, fontSize: FontSizes.md, fontWeight: '600' },

});