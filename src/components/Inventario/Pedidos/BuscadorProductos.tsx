import React, { useState, useEffect } from 'react';
import {
    View,
    TextInput,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    Keyboard,
    TouchableWithoutFeedback
} from 'react-native';
import { Colors, Spacing, BorderRadius, FontSizes, Shadows } from '@constants/theme';
import type { ProductoInventario } from '@models/ProductoInventario/ProductoInventario.types';

interface BuscadorProductosProps {
    productos: ProductoInventario[];
    productoSeleccionado: string;
    onSeleccionarProducto: (producto: ProductoInventario) => void;
    loading?: boolean;
    disabled?: boolean;
    placeholder?: string;
}

const BuscadorProductos: React.FC<BuscadorProductosProps> = ({
    productos = [],
    productoSeleccionado,
    onSeleccionarProducto,
    loading = false,
    disabled = false,
    placeholder = "Buscar por código o nombre..."
}) => {
    const [busqueda, setBusqueda] = useState('');
    const [mostrarResultados, setMostrarResultados] = useState(false);
    const [productoActual, setProductoActual] = useState<ProductoInventario | null>(null);

    const obtenerNombreCompleto = (producto: ProductoInventario): string => {
        if (!producto) return '';
        const partes = [
            producto.vnombre_producto,
            producto.vnombre_caracteristica,
            producto.vnombre_marca
        ].filter(p => p && p.trim() !== '');
        return partes.length === 0 ? producto.codigo_producto || 'Sin Nombre' : partes.join(' - ');
    };

    useEffect(() => {
        if (productoSeleccionado && productos.length > 0) {
            const producto = productos.find(p => p.codigo_producto === productoSeleccionado);
            if (producto) {
                setProductoActual(producto);
                setBusqueda('');
            }
        } else if (!productoSeleccionado) {
            setProductoActual(null);
            setBusqueda('');
        }
    }, [productoSeleccionado, productos]);

    const productosFiltrados = productos.filter(producto => {
        const terminoBusqueda = busqueda.toLowerCase();
        const codigo = (producto.codigo_producto || '').toLowerCase();
        const nombreCompleto = obtenerNombreCompleto(producto).toLowerCase();
        return codigo.includes(terminoBusqueda) || nombreCompleto.includes(terminoBusqueda);
    }).slice(0, 50);

    const handleInputChange = (text: string) => {
        setBusqueda(text);
        setMostrarResultados(true);
        if (!text) setProductoActual(null);
    };

    const handleSeleccionar = (producto: ProductoInventario) => {
        setProductoActual(producto);
        onSeleccionarProducto(producto);
        setBusqueda('');
        setMostrarResultados(false);
        Keyboard.dismiss();
    };

    const cerrarResultados = () => {
        setMostrarResultados(false);
        if (!productoActual) setBusqueda('');
        Keyboard.dismiss();
    };

    return (
        <View style={[styles.container, { zIndex: 100 }]}>
            <TextInput
                value={productoActual ? obtenerNombreCompleto(productoActual) : busqueda}
                onChangeText={handleInputChange}
                onFocus={() => {
                    if (!productoActual) setMostrarResultados(true);
                }}
                editable={!disabled && !loading}
                placeholder={loading ? "Cargando productos..." : placeholder}
                placeholderTextColor={Colors.placeholder || '#9CA3AF'}
                style={[
                    styles.input,
                    (disabled || loading) && styles.inputDisabled
                ]}
            />

            {mostrarResultados && !productoActual && busqueda.trim() !== '' && (
                <View style={styles.resultadosContainer}>
                    {loading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="small" color={Colors.primary} />
                            <Text style={styles.mensajeTexto}>Cargando productos...</Text>
                        </View>
                    ) : productosFiltrados.length > 0 ? (
                        <ScrollView
                            style={styles.lista}
                            keyboardShouldPersistTaps="handled"
                            nestedScrollEnabled={true}
                        >
                            {productosFiltrados.map((item) => (
                                <TouchableOpacity
                                    key={item.iid_inventario.toString()}
                                    onPress={() => handleSeleccionar(item)}
                                    style={styles.itemContainer}
                                >
                                    <Text style={styles.itemNombre}>
                                        {obtenerNombreCompleto(item)}
                                    </Text>
                                    <View style={styles.itemDetalles}>
                                        <Text style={styles.itemTextoSecundario}>
                                            Código: {item.codigo_producto}
                                        </Text>
                                        {item.unidad_compra_nombre && (
                                            <Text style={styles.itemTextoSecundario}>
                                                {' '}| Unidad: {item.unidad_compra_nombre}
                                            </Text>
                                        )}
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    ) : (
                        <View style={styles.mensajeContainer}>
                            <Text style={styles.mensajeTexto}>No se encontraron productos</Text>
                        </View>
                    )}
                </View>
            )}

            {mostrarResultados && !productoActual && (
                <TouchableWithoutFeedback onPress={cerrarResultados}>
                    <View style={styles.backdrop} />
                </TouchableWithoutFeedback>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        marginBottom: Spacing.md,
    },
    input: {
        borderWidth: 1,
        borderColor: Colors.border || '#E5E7EB',
        borderRadius: BorderRadius.md,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm + 4,
        fontSize: FontSizes.sm,
        color: Colors.text,
        backgroundColor: Colors.surface,
    },
    inputDisabled: {
        backgroundColor: '#F3F4F6',
        color: '#9CA3AF',
    },
    resultadosContainer: {
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        marginTop: 4,
        backgroundColor: Colors.surface || 'white',
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: BorderRadius.md,
        maxHeight: 250, 
        ...Shadows.md,
        zIndex: 1000,
        elevation: 5,
    },
    lista: {
        maxHeight: 250,
    },
    itemContainer: {
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    itemNombre: {
        fontSize: FontSizes.sm,
        fontWeight: '500',
        color: Colors.text,
        marginBottom: 2,
    },
    itemDetalles: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    itemTextoSecundario: {
        fontSize: FontSizes.xs,
        color: '#6B7280',
    },
    loadingContainer: {
        padding: Spacing.md,
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.sm,
    },
    mensajeContainer: {
        padding: Spacing.md,
        alignItems: 'center',
    },
    mensajeTexto: {
        fontSize: FontSizes.sm,
        color: '#6B7280',
    },
    backdrop: {
        position: 'absolute',
        top: -1000, 
        left: -1000,
        right: -1000,
        bottom: -1000,
        zIndex: 900,
    }
});

export default BuscadorProductos;