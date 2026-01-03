import React, { useEffect, useState, useMemo } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert,
    ActivityIndicator,
    TextInput
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ShoppingCart, ArrowLeft, CheckCircle } from 'lucide-react-native';
import { Colors, Spacing, FontSizes, BorderRadius, Shadows } from '@constants/theme';

import type { ProductoTratamiento } from '@models/Tratamiento/Tratamiento.types';
import { getProductoByCodigo } from '@services/InventarioProductos/inventarioProductos.service';
import {
    fetchTiposPedido,
    fetchNextPedidoId,
    getPedidoById,
    recibirPedido,
    registrarFacturaPedido
} from '@services/Pedidos/Pedidos.service';
import type { TipoPedido } from '@models/Pedidos/Pedidos.types';
import { fetchBodegasPrincipales } from '@services/Bodegas/bodegas.service';
import { fetchAllProveedores } from '@services/Proveedores/Proveedores.service';
import type { Bodega } from '@models/Bodegas/Bodegas.types';
import type { Proveedor } from '@models/Proveedores/Proveedores.types';
import { useAuth } from '@context/AuthContext';
import type { DatosFactura } from '@models/FacturaPedido/FacturaPedido.types';
import type { EntidadFacturadora } from '@models/FacturaPedido/EntidadesFacturadoras.types';
import { fetchAllEntidades } from '@services/EntidadesFacturadoras/EntidadesFacturadoras.service';

const RecibirPedido: React.FC = () => {
    const router = useRouter();
    const params = useLocalSearchParams();
    const id = params.id as string;
    const modoEdicion = !!id;
    const { usuario } = useAuth();

    const [productos, setProductos] = useState<ProductoTratamiento[]>([]);
    const [pedidoOriginal, setPedidoOriginal] = useState<any>(null);
    const [guardando, setGuardando] = useState(false);
    const [tiposPedido, setTiposPedido] = useState<TipoPedido[]>([]);
    const [tipoPedidoSeleccionado, setTipoPedidoSeleccionado] = useState<string>('');
    const [nextPedidoId, setNextPedidoId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [bodegas, setBodegas] = useState<Bodega[]>([]);
    const [bodegaSeleccionada, setBodegaSeleccionada] = useState<string>('');
    const [proveedores, setProveedores] = useState<Proveedor[]>([]);
    const [proveedorSeleccionado, setProveedorSeleccionado] = useState<string>('');
    const [observaciones, setObservaciones] = useState<string>('');
    const [tieneFactura, setTieneFactura] = useState(false);
    const [datosFactura, setDatosFactura] = useState<DatosFactura>({
        iid_entidad_facturadora: null,
        v_numero_factura: '',
        v_clave_acceso: '',
        v_numero_autorizacion: '',
        d_fecha_factura: '',
        d_fecha_autorizacion: '',
        n_subtotal_0: 0,
        n_subtotal_iva: 0,
        n_subtotal: 0,
        n_iva: 0,
        n_total: 0,
        n_descuento: 0,
        v_observaciones: '',
        archivo_xml: null,
        archivo_pdf: null
    });
    const [entidadesFacturadoras, setEntidadesFacturadoras] = useState<EntidadFacturadora[]>([]);

    const formatearIdPedido = (id: number): string => {
        return `#${id.toString().padStart(5, '0')}`;
    };

    const todosLosProductosTienenPrecio = useMemo(() => {
        if (productos.length === 0) return false;
        return productos.every(p => p.precio_unitario && p.precio_unitario > 0);
    }, [productos]);

    const calcularTotalesFactura = useMemo(() => {
        let subtotalBase0 = 0;
        let subtotalBaseIVA = 0;
        let ivaTotal = 0;

        productos.forEach(producto => {
            const cantidad = producto.cantidad_recibida ?? producto.cantidad;
            const precioUnitario = producto.precio_unitario || 0;
            const porcentajeIVA = producto.iva_porcentaje || 0;

            const subtotalLinea = cantidad * precioUnitario;

            if (porcentajeIVA > 0) {
                subtotalBaseIVA += subtotalLinea;
                ivaTotal += subtotalLinea * (porcentajeIVA / 100);
            } else {
                subtotalBase0 += subtotalLinea;
            }
        });

        const subtotalTotal = subtotalBase0 + subtotalBaseIVA;
        const totalGeneral = subtotalTotal + ivaTotal;

        return {
            subtotalBase0,
            subtotalBaseIVA,
            subtotalTotal,
            ivaTotal,
            totalGeneral
        };
    }, [productos]);

    useEffect(() => {
        if (modoEdicion && id) {
            const cargarPedido = async () => {
                try {
                    setLoading(true);
                    const pedido = await getPedidoById(parseInt(id));
                    setPedidoOriginal(pedido);

                    setNextPedidoId(pedido.iid_pedido);
                    setTipoPedidoSeleccionado(pedido.iid_tipo_pedido?.toString() || '');
                    setBodegaSeleccionada(pedido.iid_bodega_destino?.toString() || '');
                    setProveedorSeleccionado(pedido.iid_proveedor?.toString() || '');
                    setObservaciones(pedido.v_observaciones || '');

                    if (!pedido.detalles || pedido.detalles.length === 0) {
                        setProductos([]);
                        return;
                    }

                    const productosConDetalles = await Promise.all(
                        pedido.detalles.map(async (detalle: any) => {
                            const producto = await getProductoByCodigo(detalle.codigo_producto);

                            return {
                                id: detalle.iid_pedido_det.toString(),
                                iid_inventario: detalle.iid_inventario,
                                codigo: detalle.codigo_producto,
                                nombre: detalle.producto?.nombre_completo || producto?.vnombre_producto || '',
                                cantidad: detalle.cantidad_cotizada || detalle.cantidad_solicitada,
                                cantidad_recibida: detalle.cantidad_recibida ||
                                    detalle.cantidad_cotizada ||
                                    detalle.cantidad_solicitada,
                                precio_unitario: Number(detalle.n_precio_unitario || 0),
                                proveedor: pedido.proveedor_nombre || '',
                                proveedor_id: pedido.iid_proveedor || undefined,
                                unidad: detalle.producto?.unidad_compra?.vabreviatura || '',
                                iid_iva: detalle.iid_iva ?? detalle.producto?.iid_iva ?? null,
                                iva_porcentaje: Number(detalle.producto?.iva_porcentaje || 0),
                                iva_vigencia_desde: detalle.producto?.iva_vigencia_desde || null,
                                iva_vigencia_hasta: detalle.producto?.iva_vigencia_hasta || null,
                                iva_activo: detalle.producto?.iva_activo ?? null,
                            };
                        })
                    );
                    setProductos(productosConDetalles);
                } catch (err) {
                    Alert.alert('Error', 'Error al cargar el pedido');
                } finally {
                    setLoading(false);
                }
            };

            cargarPedido();
        }
    }, [modoEdicion, id]);

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                setLoading(true);

                const [tipos, bodegasData, proveedoresData, nextId] = await Promise.all([
                    fetchTiposPedido(),
                    fetchBodegasPrincipales(),
                    fetchAllProveedores(),
                    !modoEdicion ? fetchNextPedidoId() : Promise.resolve(null)
                ]);

                setTiposPedido(tipos);
                setBodegas(bodegasData);
                setProveedores(proveedoresData);

                if (!modoEdicion && nextId) {
                    setNextPedidoId(nextId);
                }

            } catch (err) {
                Alert.alert('Error', 'Error al cargar datos');
            } finally {
                if (!modoEdicion) {
                    setLoading(false);
                }
            }
        };
        cargarDatos();
    }, [modoEdicion]);

    useEffect(() => {
        const cargarEntidades = async () => {
            try {
                const entidades = await fetchAllEntidades();
                setEntidadesFacturadoras(entidades);
            } catch (error) {
            }
        };
        cargarEntidades();
    }, []);

    useEffect(() => {
        setDatosFactura(prev => ({
            ...prev,
            n_subtotal_0: calcularTotalesFactura.subtotalBase0,
            n_subtotal_iva: calcularTotalesFactura.subtotalBaseIVA,
            n_subtotal: calcularTotalesFactura.subtotalTotal,
            n_iva: calcularTotalesFactura.ivaTotal,
            n_total: calcularTotalesFactura.totalGeneral
        }));
    }, [calcularTotalesFactura]);

    const handleGuardarRecepcion = async () => {
        if (!id) {
            Alert.alert('Error', 'No se puede identificar el pedido');
            return;
        }

        const productosSinCantidadRecibida = productos.filter(p => {
            const cantidadRecibida = p.cantidad_recibida;
            return cantidadRecibida === undefined || cantidadRecibida === null ||
                Number.isNaN(cantidadRecibida) || Number(cantidadRecibida) <= 0;
        });

        if (productosSinCantidadRecibida.length > 0) {
            Alert.alert(
                'Error',
                `Debe ingresar una cantidad recibida válida (mayor a 0) para todos los productos.`
            );
            return;
        }

        setGuardando(true);

        try {
            const detallesRecepcion = productos.map((prod: any) => ({
                iid_inventario: prod.iid_inventario,
                cantidad_recibida: Number(prod.cantidad_recibida),
            }));

            await recibirPedido(parseInt(id), {
                detalles: detallesRecepcion,
                iid_usuario_recibe: usuario?.iid!,
                d_fecha_recepcion: new Date().toISOString(),
                v_observaciones: observaciones.trim() || undefined,
            });

            Alert.alert(
                '¡Éxito!',
                'El pedido ha sido recibido correctamente',
                [{ text: 'OK', onPress: () => router.push('/inventario/pedidos/estado') }]
            );

        } catch (error: any) {
            Alert.alert('Error', error.message || 'Error al recibir el pedido');
        } finally {
            setGuardando(false);
        }
    };

    const handleRegistrarFactura = async () => {
        if (!id) {
            Alert.alert('Error', 'No se puede identificar el pedido');
            return;
        }

        if (!datosFactura.iid_entidad_facturadora) {
            Alert.alert('Error', 'Debe seleccionar una entidad facturadora');
            return;
        }

        if (!datosFactura.v_numero_factura || !datosFactura.d_fecha_factura) {
            Alert.alert('Error', 'Complete todos los campos requeridos de la factura');
            return;
        }

        const productosSinCantidadRecibida = productos.filter(
            p => p.cantidad_recibida == null || Number.isNaN(p.cantidad_recibida) || Number(p.cantidad_recibida) <= 0
        );

        if (productosSinCantidadRecibida.length > 0) {
            Alert.alert('Error', 'Debe ingresar la cantidad recibida para todos los productos');
            return;
        }

        setGuardando(true);
        try {
            const detallesRecepcion = productos.map((prod: any) => ({
                iid_inventario: prod.iid_inventario,
                cantidad_recibida: Number(prod.cantidad_recibida),
            }));

            await recibirPedido(parseInt(id), {
                detalles: detallesRecepcion,
                iid_usuario_recibe: usuario?.iid!,
                d_fecha_recepcion: new Date().toISOString(),
                v_observaciones: observaciones.trim() || undefined,
            });

            await registrarFacturaPedido(parseInt(id), {
                iid_entidad_facturadora: datosFactura.iid_entidad_facturadora,
                v_numero_factura: datosFactura.v_numero_factura,
                v_clave_acceso: datosFactura.v_clave_acceso || undefined,
                v_numero_autorizacion: datosFactura.v_numero_autorizacion || undefined,
                d_fecha_factura: datosFactura.d_fecha_factura,
                d_fecha_autorizacion: datosFactura.d_fecha_autorizacion || undefined,
                n_subtotal_0: datosFactura.n_subtotal_0,
                n_subtotal_iva: datosFactura.n_subtotal_iva,
                n_subtotal: datosFactura.n_subtotal,
                n_iva: datosFactura.n_iva,
                n_total: datosFactura.n_total,
                n_descuento: datosFactura.n_descuento || undefined,
                v_observaciones: datosFactura.v_observaciones || undefined,
            });

            Alert.alert(
                '¡Éxito!',
                'Pedido recibido y factura registrada correctamente',
                [{ text: 'OK', onPress: () => router.push('/inventario/pedidos/estado') }]
            );

        } catch (error: any) {
            Alert.alert('Error', error.message || 'Error al procesar el pedido');
        } finally {
            setGuardando(false);
        }
    };

    const handleEditarCantidadRecibida = (id: string, nuevaCantidadRecibida: number) => {
        setProductos(prev =>
            prev.map(p => (p.id === id ? { ...p, cantidad_recibida: nuevaCantidadRecibida } : p))
        );
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                    <Text style={styles.loadingText}>Cargando datos del pedido...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <ArrowLeft size={24} color={Colors.text} />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.card}>
                    <View style={styles.headerSection}>
                        <View style={styles.iconContainer}>
                            <ShoppingCart size={32} color={Colors.primary} strokeWidth={2} />
                        </View>
                        <View style={styles.headerTextContainer}>
                            <Text style={styles.title}>
                                {modoEdicion ? 'Entregar Pedido' : 'Orden de Pedido'}
                            </Text>
                            <Text style={styles.subtitle}>
                                {modoEdicion ? 'Actualizar precios, cantidades y productos' : 'Gestión de pedidos de productos'}
                            </Text>
                            {nextPedidoId && (
                                <Text style={styles.pedidoId}>
                                    {modoEdicion ? 'Pedido' : 'Próximo Pedido'}: {formatearIdPedido(nextPedidoId)}
                                </Text>
                            )}
                        </View>
                    </View>

                    <View style={styles.infoSection}>
                        <View style={styles.infoRow}>
                            <Text style={styles.label}>Tipo de Pedido:</Text>
                            <Text style={styles.value}>
                                {tiposPedido.find(t => t.iid_tipo_pedido.toString() === tipoPedidoSeleccionado)?.v_descripcion || 'N/A'}
                            </Text>
                        </View>

                        <View style={styles.infoRow}>
                            <Text style={styles.label}>Bodega Destino:</Text>
                            <Text style={styles.value}>
                                {bodegas.find(b => b.iid_bodega.toString() === bodegaSeleccionada)?.vnombre_bodega || 'N/A'}
                            </Text>
                        </View>

                        {modoEdicion && (
                            <View style={styles.infoRow}>
                                <Text style={styles.label}>Proveedor:</Text>
                                <Text style={styles.value}>
                                    {proveedores.find(p => p.iid_proveedor.toString() === proveedorSeleccionado)?.vnombre || 'N/A'}
                                </Text>
                            </View>
                        )}
                    </View>

                    <View style={styles.productsSection}>
                        <Text style={styles.sectionTitle}>Productos</Text>
                        {productos.map((producto) => (
                            <View key={producto.id} style={styles.productCard}>
                                <View style={styles.productHeader}>
                                    <Text style={styles.productName}>{producto.nombre}</Text>
                                    <Text style={styles.productCode}>{producto.codigo}</Text>
                                </View>

                                <View style={styles.productDetails}>
                                    <View style={styles.detailRow}>
                                        <Text style={styles.detailLabel}>Cantidad Aprobada:</Text>
                                        <Text style={styles.detailValue}>{producto.cantidad} {producto.unidad}</Text>
                                    </View>

                                    <View style={styles.detailRow}>
                                        <Text style={styles.detailLabel}>Cantidad Recibida:</Text>
                                        <TextInput
                                            style={styles.input}
                                            value={producto.cantidad_recibida?.toString() || ''}
                                            onChangeText={(text) => {
                                                const value = parseFloat(text) || 0;
                                                handleEditarCantidadRecibida(producto.id, value);
                                            }}
                                            keyboardType="numeric"
                                            placeholder="0"
                                        />
                                    </View>

                                    <View style={styles.detailRow}>
                                        <Text style={styles.detailLabel}>Precio Unitario:</Text>
                                        <Text style={styles.detailValue}>
                                            ${(producto.precio_unitario || 0).toFixed(2)}
                                        </Text>
                                    </View>

                                    <View style={styles.detailRow}>
                                        <Text style={styles.detailLabel}>Subtotal:</Text>
                                        <Text style={[styles.detailValue, styles.boldValue]}>
                                            ${((producto.cantidad_recibida || producto.cantidad) * (producto.precio_unitario || 0)).toFixed(2)}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        ))}
                    </View>

                    <View style={styles.totalesSection}>
                        <Text style={styles.sectionTitle}>Totales</Text>

                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>Subtotal Base 0%:</Text>
                            <Text style={styles.totalValue}>
                                ${calcularTotalesFactura.subtotalBase0.toFixed(2)}
                            </Text>
                        </View>

                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>Subtotal Base IVA:</Text>
                            <Text style={styles.totalValue}>
                                ${calcularTotalesFactura.subtotalBaseIVA.toFixed(2)}
                            </Text>
                        </View>

                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>IVA:</Text>
                            <Text style={styles.totalValue}>
                                ${calcularTotalesFactura.ivaTotal.toFixed(2)}
                            </Text>
                        </View>

                        <View style={[styles.totalRow, styles.totalFinal]}>
                            <Text style={styles.totalLabelFinal}>Total:</Text>
                            <Text style={styles.totalValueFinal}>
                                ${calcularTotalesFactura.totalGeneral.toFixed(2)}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.observacionesSection}>
                        <Text style={styles.label}>Observaciones</Text>
                        <TextInput
                            style={styles.textArea}
                            value={observaciones}
                            onChangeText={setObservaciones}
                            placeholder="Agregue observaciones o comentarios sobre este pedido..."
                            multiline
                            numberOfLines={4}
                            maxLength={500}
                        />
                    </View>

                    {productos.length > 0 && modoEdicion && (
                        <View style={styles.actionsSection}>
                            <TouchableOpacity
                                style={[styles.button, styles.buttonSecondary]}
                                onPress={() => setTieneFactura(!tieneFactura)}
                            >
                                <Text style={styles.buttonSecondaryText}>
                                    {tieneFactura ? '✓ Con Factura' : 'Sin Factura'}
                                </Text>
                            </TouchableOpacity>

                            {tieneFactura ? (
                                <TouchableOpacity
                                    style={[styles.button, styles.buttonSuccess, (guardando || !datosFactura.iid_entidad_facturadora) && styles.buttonDisabled]}
                                    onPress={handleRegistrarFactura}
                                    disabled={guardando || !datosFactura.iid_entidad_facturadora}
                                >
                                    <ShoppingCart size={20} color="#fff" />
                                    <Text style={styles.buttonText}>
                                        {guardando ? 'Procesando...' : 'Registrar Factura y Recibir'}
                                    </Text>
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity
                                    style={[styles.button, styles.buttonPrimary, guardando && styles.buttonDisabled]}
                                    onPress={handleGuardarRecepcion}
                                    disabled={guardando}
                                >
                                    <CheckCircle size={20} color="#fff" />
                                    <Text style={styles.buttonText}>
                                        {guardando ? 'Guardando...' : 'Marcar como Recibido'}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    header: {
        padding: Spacing.md,
    },
    backButton: {
        padding: Spacing.sm,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: Spacing.md,
        fontSize: FontSizes.md,
        color: Colors.textLight,
    },
    content: {
        flex: 1,
    },
    card: {
        backgroundColor: Colors.surface,
        borderRadius: BorderRadius.lg,
        padding: Spacing.lg,
        margin: Spacing.md,
        ...Shadows.md,
    },
    headerSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Spacing.lg,
        paddingBottom: Spacing.lg,
        borderBottomWidth: 2,
        borderBottomColor: Colors.primary,
    },
    iconContainer: {
        width: 56,
        height: 56,
        borderRadius: BorderRadius.md,
        backgroundColor: `${Colors.primary}15`,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: Spacing.md,
    },
    headerTextContainer: {
        flex: 1,
    },
    title: {
        fontSize: FontSizes.xl,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: 4,
    },
    subtitle: {
        fontSize: FontSizes.sm,
        color: Colors.secondary,
        marginBottom: 4,
    },
    pedidoId: {
        fontSize: FontSizes.md,
        fontWeight: '600',
        color: Colors.primary,
    },
    infoSection: {
        marginBottom: Spacing.lg,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: Spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    label: {
        fontSize: FontSizes.sm,
        fontWeight: '600',
        color: Colors.textLight,
        marginBottom: Spacing.xs,
    },
    value: {
        fontSize: FontSizes.sm,
        color: Colors.text,
    },
    productsSection: {
        marginBottom: Spacing.lg,
    },
    sectionTitle: {
        fontSize: FontSizes.lg,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: Spacing.md,
    },
    productCard: {
        backgroundColor: Colors.background,
        borderRadius: BorderRadius.md,
        padding: Spacing.md,
        marginBottom: Spacing.sm,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    productHeader: {
        marginBottom: Spacing.sm,
    },
    productName: {
        fontSize: FontSizes.md,
        fontWeight: '600',
        color: Colors.text,
    },
    productCode: {
        fontSize: FontSizes.xs,
        color: Colors.textLight,
    },
    productDetails: {
        gap: Spacing.xs,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 4,
    },
    detailLabel: {
        fontSize: FontSizes.sm,
        color: Colors.textLight,
    },
    detailValue: {
        fontSize: FontSizes.sm,
        color: Colors.text,
    },
    boldValue: {
        fontWeight: 'bold',
    },
    input: {
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: BorderRadius.sm,
        paddingHorizontal: Spacing.sm,
        paddingVertical: Spacing.xs,
        fontSize: FontSizes.sm,
        minWidth: 80,
        textAlign: 'right',
    },
    totalesSection: {
        marginTop: Spacing.lg,
        paddingTop: Spacing.lg,
        borderTopWidth: 2,
        borderTopColor: Colors.border,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: Spacing.sm,
    },
    totalLabel: {
        fontSize: FontSizes.md,
        color: Colors.textLight,
    },
    totalValue: {
        fontSize: FontSizes.md,
        fontWeight: '600',
        color: Colors.text,
    },
    totalFinal: {
        marginTop: Spacing.sm,
        paddingTop: Spacing.md,
        borderTopWidth: 2,
        borderTopColor: Colors.primary,
    },
    totalLabelFinal: {
        fontSize: FontSizes.lg,
        fontWeight: 'bold',
        color: Colors.text,
    },
    totalValueFinal: {
        fontSize: FontSizes.lg,
        fontWeight: 'bold',
        color: Colors.primary,
    },
    observacionesSection: {
        marginTop: Spacing.lg,
    },
    textArea: {
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: BorderRadius.md,
        padding: Spacing.md,
        fontSize: FontSizes.sm,
        minHeight: 100,
        textAlignVertical: 'top',
    },
    actionsSection: {
        marginTop: Spacing.lg,
        gap: Spacing.sm,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: Spacing.md,
        borderRadius: BorderRadius.md,
        gap: Spacing.sm,
        ...Shadows.sm,
    },
    buttonPrimary: {
        backgroundColor: Colors.primary,
    },
    buttonSuccess: {
        backgroundColor: '#10b981',
    },
    buttonSecondary: {
        backgroundColor: Colors.surface,
        borderWidth: 2,
        borderColor: Colors.primary,
    },
    buttonDisabled: {
        backgroundColor: Colors.border,
        opacity: 0.5,
    },
    buttonText: {
        fontSize: FontSizes.md,
        fontWeight: '600',
        color: '#fff',
    },
    buttonSecondaryText: {
        fontSize: FontSizes.md,
        fontWeight: '600',
        color: Colors.primary,
    },
});
export default RecibirPedido;