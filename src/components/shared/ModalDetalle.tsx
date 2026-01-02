import React from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from 'react-native';
import {
  X,
  Package,
  Calendar,
  User,
  Building2,
  FileText,
  AlertCircle,
} from 'lucide-react-native';
import type { Pedido } from '@models/Pedidos/Pedidos.types';
import Theme from '@constants/theme';

interface ModalDetalleProps {
  item: Pedido | null;
  visible: boolean;
  onClose: () => void;
  mostrarCotizado?: boolean;
  mostrarRecibido?: boolean;
  mostrarPrecioUnitario?: boolean;
  mostrarSubtotal?: boolean;
}

export const ModalDetalle = ({
  item,
  visible,
  onClose,
  mostrarCotizado = true,
  mostrarRecibido = true,
  mostrarPrecioUnitario = true,
  mostrarSubtotal = true,
}: ModalDetalleProps) => {
  if (!visible || !item) return null;

  const itemExtendido = item as any;

  const formatearFecha = (fecha: string | null | undefined) => {
    if (!fecha) return 'N/A';
    return new Date(fecha).toLocaleDateString('es-EC', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatearMoneda = (valor: number | null | undefined) => {
    if (!valor) return '$0.00';
    return new Intl.NumberFormat('es-EC', {
      style: 'currency',
      currency: 'USD',
    }).format(valor);
  };

  const calcularTotal = () => {
    if (!item.detalles) return 0;
    return item.detalles.reduce((sum, det: any) => {
      return sum + (det.n_subtotal_linea || 0);
    }, 0);
  };

  const esRequisicion =
    item.tipo?.v_descripcion === 'Requisición' ||
    (item as any).iid_requisicion !== undefined;

  return (
    <Modal
  visible={visible}
  transparent
  animationType="slide"
  onRequestClose={onClose}
>
  <View style={styles.overlay}>
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Package size={24} color={Theme.colors.textInverse} strokeWidth={2} />
          <View>
            <Text style={styles.headerTitle}>
              Pedido #{item.iid_pedido.toString().padStart(5, '0')}
            </Text>
            <Text style={styles.headerSubtitle}>
              Detalle completo del pedido
            </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={onClose}
          style={styles.closeButton}
          activeOpacity={0.7}
        >
          <X size={24} color={Theme.colors.textInverse} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContentContainer}
      >
        <View style={styles.infoGrid}>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Tipo de Pedido</Text>
            <Text style={styles.infoValue}>
              {item.tipo?.v_descripcion || 'N/A'}
            </Text>
          </View>
          <View style={[styles.infoCard, styles.infoCardSecondary]}>
            <Text style={styles.infoLabel}>Bodega Destino</Text>
            <Text style={styles.infoValue}>
              {item.bodega_destino_nombre || 'N/A'}
            </Text>
          </View>
        </View>

        {item.proveedor_nombre && (
          <View style={styles.proveedorSection}>
            <View style={styles.sectionHeader}>
              <Building2 size={20} color={Theme.colors.primary} />
              <Text style={styles.sectionTitle}>
                Información del Proveedor
              </Text>
            </View>
            <View style={styles.proveedorGrid}>
              <View style={styles.proveedorItem}>
                <Text style={styles.proveedorLabel}>Nombre</Text>
                <Text style={styles.proveedorValue}>
                  {item.proveedor_nombre}
                </Text>
              </View>
              {item.proveedor_ruc && (
                <View style={styles.proveedorItem}>
                  <Text style={styles.proveedorLabel}>RUC</Text>
                  <Text style={styles.proveedorValue}>
                    {item.proveedor_ruc}
                  </Text>
                </View>
              )}
              {item.proveedor_email && (
                <View style={styles.proveedorItem}>
                  <Text style={styles.proveedorLabel}>Email</Text>
                  <Text style={styles.proveedorValue}>
                    {item.proveedor_email}
                  </Text>
                </View>
              )}
              {item.proveedor_telefono && (
                <View style={styles.proveedorItem}>
                  <Text style={styles.proveedorLabel}>Teléfono</Text>
                  <Text style={styles.proveedorValue}>
                    {item.proveedor_telefono}
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}

        <View style={styles.historialSection}>
          <View style={styles.sectionHeader}>
            <Calendar size={20} color={Theme.colors.text} />
            <Text style={styles.sectionTitle}>Historial del Pedido</Text>
          </View>

          <View style={styles.historialItem}>
            <Text style={styles.historialLabel}>📝 Solicitud</Text>
            <Text style={styles.historialFecha}>
              {formatearFecha(item.d_fecha_solicitud)}
            </Text>
            <View style={styles.historialUsuario}>
              <User size={12} color={Theme.colors.placeholder} />
              <Text style={styles.historialUsuarioText}>
                {item.usuario_solicita_nombre || 'N/A'}
              </Text>
            </View>
          </View>

                {itemExtendido.d_fecha_cotizacion && (
                  <View style={[styles.historialItem, styles.historialItemTeal]}>
                    <Text style={styles.historialLabel}>💰 Cotización</Text>
                    <Text style={styles.historialFecha}>
                      {formatearFecha(itemExtendido.d_fecha_cotizacion)}
                    </Text>
                  </View>
                )}

                {itemExtendido.d_fecha_aprobacion && (
                  <View style={[styles.historialItem, styles.historialItemGreen]}>
                    <Text style={styles.historialLabel}>✅ Aprobación</Text>
                    <Text style={styles.historialFecha}>
                      {formatearFecha(itemExtendido.d_fecha_aprobacion)}
                    </Text>
                    {itemExtendido.usuario_aprueba_nombre && (
                      <View style={styles.historialUsuario}>
                        <User size={12} color={Theme.colors.placeholder} />
                        <Text style={styles.historialUsuarioText}>
                          {itemExtendido.usuario_aprueba_nombre}
                        </Text>
                      </View>
                    )}
                  </View>
                )}

                {itemExtendido.d_fecha_recepcion && (
                  <View style={[styles.historialItem, styles.historialItemPurple]}>
                    <Text style={styles.historialLabel}>📦 Recepción</Text>
                    <Text style={styles.historialFecha}>
                      {formatearFecha(itemExtendido.d_fecha_recepcion)}
                    </Text>
                    {itemExtendido.usuario_recibe_nombre && (
                      <View style={styles.historialUsuario}>
                        <User size={12} color={Theme.colors.placeholder} />
                        <Text style={styles.historialUsuarioText}>
                          {itemExtendido.usuario_recibe_nombre}
                        </Text>
                      </View>
                    )}
                  </View>
                )}
              </View>

              {itemExtendido.v_observaciones && (
                <View style={styles.observacionesContainer}>
                  <View style={styles.observacionesHeader}>
                    <FileText size={16} color={Theme.colors.info} />
                    <Text style={styles.observacionesLabel}>Observaciones</Text>
                  </View>
                  <Text style={styles.observacionesText}>
                    {itemExtendido.v_observaciones}
                  </Text>
                </View>
              )}

              {itemExtendido.v_motivo_rechazo && (
                <View style={styles.rechazoContainer}>
                  <View style={styles.rechazoHeader}>
                    <AlertCircle size={20} color={Theme.colors.error} />
                    <Text style={styles.rechazoLabel}>Motivo de Rechazo</Text>
                  </View>
                  <Text style={styles.rechazoText}>
                    {itemExtendido.v_motivo_rechazo}
                  </Text>
                </View>
              )}

              {item.detalles && item.detalles.length > 0 && (
                <View style={styles.productosSection}>
                  <View style={styles.sectionHeader}>
                    <Package size={20} color={Theme.colors.text} />
                    <Text style={styles.sectionTitle}>
                      Productos ({item.detalles.length})
                    </Text>
                  </View>

                  {item.detalles.map((detalle: any, index) => (
                    <View key={index} style={styles.productoCard}>
                      <View style={styles.productoHeader}>
                        <Text style={styles.productoCodigo}>
                          {detalle.codigo_producto || 'N/A'}
                        </Text>
                      </View>
                      <Text style={styles.productoNombre}>
                        {detalle.producto?.nombre_completo || 'N/A'}
                      </Text>
                      {detalle.producto?.unidad_compra && (
                        <Text style={styles.productoUnidad}>
                          {detalle.producto.unidad_compra.vnombreunidad}
                        </Text>
                      )}

                      <View style={styles.productoCantidades}>
                        <View style={styles.cantidadItem}>
                          <Text style={styles.cantidadLabel}>Solicitado</Text>
                          <Text style={styles.cantidadValue}>
                            {detalle.cantidad_solicitada}
                          </Text>
                        </View>

                        {mostrarCotizado && (
                          <View style={styles.cantidadItem}>
                            <Text style={styles.cantidadLabel}>Cotizado</Text>
                            <Text style={[styles.cantidadValue, styles.cantidadCotizado]}>
                              {detalle.cantidad_cotizada || '-'}
                            </Text>
                          </View>
                        )}

                        {mostrarRecibido && (
                          <View style={styles.cantidadItem}>
                            <Text style={styles.cantidadLabel}>Recibido</Text>
                            <Text style={[styles.cantidadValue, styles.cantidadRecibido]}>
                              {detalle.cantidad_recibida || '-'}
                            </Text>
                          </View>
                        )}
                      </View>

                      {mostrarPrecioUnitario && detalle.n_precio_unitario && (
                        <View style={styles.productoPrecio}>
                          <Text style={styles.precioLabel}>P. Unitario:</Text>
                          <Text style={styles.precioValue}>
                            {formatearMoneda(detalle.n_precio_unitario)}
                          </Text>
                        </View>
                      )}

                      {mostrarSubtotal && detalle.n_subtotal_linea && (
                        <View style={styles.productoSubtotal}>
                          <Text style={styles.subtotalLabel}>Subtotal:</Text>
                          <Text style={styles.subtotalValue}>
                            {formatearMoneda(detalle.n_subtotal_linea)}
                          </Text>
                        </View>
                      )}
                    </View>
                  ))}

                  {mostrarSubtotal && calcularTotal() > 0 && (
                    <View style={styles.totalContainer}>
                      <Text style={styles.totalLabel}>Total:</Text>
                      <Text style={styles.totalValue}>
                        {formatearMoneda(calcularTotal())}
                      </Text>
                    </View>
                  )}
                </View>
              )}

              {item.facturas && item.facturas.length > 0 && (
                <View style={styles.facturasSection}>
                  <View style={styles.sectionHeader}>
                    <FileText size={20} color={Theme.colors.text} />
                    <Text style={styles.sectionTitle}>
                      Facturas Asociadas ({item.facturas.length})
                    </Text>
                  </View>

                  {item.facturas.map((factura, index) => (
                    <View key={index} style={styles.facturaCard}>
                      <View style={styles.facturaGrid}>
                        <View style={styles.facturaItem}>
                          <Text style={styles.facturaLabel}>Número</Text>
                          <Text style={styles.facturaValue}>
                            {factura.v_numero_factura}
                          </Text>
                        </View>
                        <View style={styles.facturaItem}>
                          <Text style={styles.facturaLabel}>Fecha</Text>
                          <Text style={styles.facturaValue}>
                            {formatearFecha(factura.d_fecha_factura)}
                          </Text>
                        </View>
                        <View style={styles.facturaItem}>
                          <Text style={styles.facturaLabel}>Subtotal</Text>
                          <Text style={styles.facturaValue}>
                            {formatearMoneda(factura.n_subtotal)}
                          </Text>
                        </View>
                        <View style={styles.facturaItem}>
                          <Text style={styles.facturaLabel}>Total</Text>
                          <Text style={styles.facturaTotal}>
                            {formatearMoneda(factura.n_total)}
                          </Text>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </ScrollView>

            <View style={styles.footer}>
              <TouchableOpacity
                onPress={onClose}
                style={styles.closeFooterButton}
                activeOpacity={0.8}
              >
                <Text style={styles.closeFooterButtonText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };
  
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: Theme.spacing.md,
  },
  container: {
    backgroundColor: Theme.colors.surface,
    borderTopLeftRadius: Theme.borderRadius.xl,   
    borderTopRightRadius: Theme.borderRadius.xl,
    width: '100%',           
    height: '95%',           
    overflow: 'hidden',
    ...Theme.shadows.xl,
  },
  header: {
    backgroundColor: Theme.colors.primary,
    padding: Theme.spacing.md,  
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.sm, 
    flex: 1,
  },
  headerTitle: {
    fontSize: Theme.fontSizes.xl, 
    fontWeight: Theme.fontWeights.bold,
    color: Theme.colors.textInverse,
  },
  headerSubtitle: {
    fontSize: Theme.fontSizes.xs,
    color: Theme.colors.textInverse,
    opacity: 0.9,
  },
  closeButton: {
    padding: Theme.spacing.sm,
  },
  content: {
    padding: Theme.spacing.md,  
  },
  infoGrid: {
    flexDirection: 'column',  
    gap: Theme.spacing.sm,    
    marginBottom: Theme.spacing.md,  
  },
  infoCard: {
    flex: 1,
    padding: Theme.spacing.sm, 
    borderRadius: Theme.borderRadius.md,
    borderWidth: 1,  
    backgroundColor: '#F3E8FF',
    borderColor: '#D8B4FE',
  },
  infoCardSecondary: {
    backgroundColor: '#E0E7FF',
    borderColor: '#C7D2FE',
  },
  infoLabel: {
    fontSize: Theme.fontSizes.xs,  
    fontWeight: Theme.fontWeights.medium,
    color: '#6B21A8',
    opacity: 0.75,
  },
  infoValue: {
    fontSize: Theme.fontSizes.md,  
    fontWeight: Theme.fontWeights.bold,
    color: '#6B21A8',
  },
  proveedorSection: {
    backgroundColor: '#EFF6FF',
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.sm, 
    marginBottom: Theme.spacing.md, 
    borderLeftWidth: 3,  
    borderLeftColor: Theme.colors.primary,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.sm,
    marginBottom: Theme.spacing.md,
  },
  sectionTitle: {
    fontSize: Theme.fontSizes.lg,
    fontWeight: Theme.fontWeights.bold,
    color: Theme.colors.text,
  },
  proveedorGrid: {
    gap: Theme.spacing.md,
  },
  proveedorItem: {
    marginBottom: Theme.spacing.sm,
  },
  proveedorLabel: {
    fontSize: Theme.fontSizes.sm,
    color: Theme.colors.primary,
    fontWeight: Theme.fontWeights.medium,
  },
  proveedorValue: {
    fontSize: Theme.fontSizes.md,
    fontWeight: Theme.fontWeights.semibold,
    color: Theme.colors.text,
  },
  scrollContentContainer: {
  paddingBottom: Theme.spacing.xl,
},
  historialSection: {
    backgroundColor: Theme.colors.surfaceLight,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.sm,  
    marginBottom: Theme.spacing.md, 
  },
  historialItem: {
    backgroundColor: Theme.colors.surface,
    padding: Theme.spacing.sm,  
    borderRadius: Theme.borderRadius.sm,
    marginBottom: Theme.spacing.xs,  
    borderLeftWidth: 3, 
    borderLeftColor: Theme.colors.primary,
  },
  historialItemTeal: {
    borderLeftColor: '#14B8A6',
  },
  historialItemGreen: {
    borderLeftColor: Theme.colors.success,
  },
  historialItemPurple: {
    borderLeftColor: '#A855F7',
  },
  historialLabel: {
    fontSize: Theme.fontSizes.sm,
    color: Theme.colors.placeholder,
    fontWeight: Theme.fontWeights.medium,
  },
  historialFecha: {
    fontSize: Theme.fontSizes.md,
    fontWeight: Theme.fontWeights.semibold,
    color: Theme.colors.text,
  },
  historialUsuario: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.xs,
    marginTop: Theme.spacing.xs,
  },
  historialUsuarioText: {
    fontSize: Theme.fontSizes.sm,
    color: Theme.colors.placeholder,
  },
  observacionesContainer: {
    backgroundColor: '#EFF6FF',
    borderLeftWidth: 4,
    borderLeftColor: Theme.colors.info,
    padding: Theme.spacing.md,
    borderRadius: Theme.borderRadius.sm,
    marginBottom: Theme.spacing.lg,
  },
  observacionesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.sm,
    marginBottom: Theme.spacing.xs,
  },
  observacionesLabel: {
    fontSize: Theme.fontSizes.sm,
    fontWeight: Theme.fontWeights.medium,
    color: '#1E40AF',
  },
  observacionesText: {
    fontSize: Theme.fontSizes.md,
    color: '#1E3A8A',
  },
  rechazoContainer: {
    backgroundColor: '#FEF2F2',
    borderLeftWidth: 4,
    borderLeftColor: Theme.colors.error,
    padding: Theme.spacing.md,
    borderRadius: Theme.borderRadius.sm,
    marginBottom: Theme.spacing.lg,
  },
  rechazoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.sm,
    marginBottom: Theme.spacing.xs,
  },
  rechazoLabel: {
    fontSize: Theme.fontSizes.sm,
    fontWeight: Theme.fontWeights.medium,
    color: '#991B1B',
  },
  rechazoText: {
    fontSize: Theme.fontSizes.md,
    color: '#7F1D1D',
  },
  productosSection: {
    backgroundColor: Theme.colors.surfaceLight,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.sm, 
    marginBottom: Theme.spacing.md,  
  },
  productoCard: {
    backgroundColor: Theme.colors.surface,
    padding: Theme.spacing.sm,  
    borderRadius: Theme.borderRadius.md,
    marginBottom: Theme.spacing.sm,  
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  productoHeader: {
    marginBottom: Theme.spacing.sm,
  },
  productoCodigo: {
    fontSize: Theme.fontSizes.xs,
    fontFamily: 'monospace',
    color: Theme.colors.placeholder,
  },
  productoNombre: {
    fontSize: Theme.fontSizes.md,
    fontWeight: Theme.fontWeights.medium,
    color: Theme.colors.text,
    marginBottom: Theme.spacing.xs,
  },
  productoUnidad: {
    fontSize: Theme.fontSizes.xs,
    color: Theme.colors.placeholder,
    marginBottom: Theme.spacing.md,
  },
  productoCantidades: {
    flexDirection: 'row',
    justifyContent: 'space-between',  
    marginBottom: Theme.spacing.sm,  
    gap: Theme.spacing.xs,  
  },
  cantidadItem: {
    alignItems: 'center',
    flex: 1,  
  },
  cantidadLabel: {
    fontSize: Theme.fontSizes.xs,
    color: Theme.colors.placeholder,
    marginBottom: Theme.spacing.xs,
  },
  cantidadValue: {
    fontSize: Theme.fontSizes.md,
    fontWeight: Theme.fontWeights.semibold,
    color: Theme.colors.text,
  },
  cantidadCotizado: {
    color: Theme.colors.success,
  },
  cantidadRecibido: {
    color: Theme.colors.info,
  },
  productoPrecio: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Theme.spacing.xs,
  },
  precioLabel: {
    fontSize: Theme.fontSizes.sm,
    color: Theme.colors.placeholder,
  },
  precioValue: {
    fontSize: Theme.fontSizes.sm,
    fontWeight: Theme.fontWeights.medium,
    color: Theme.colors.text,
  },
  productoSubtotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Theme.spacing.xs,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.border,
  },
  subtotalLabel: {
    fontSize: Theme.fontSizes.sm,
    fontWeight: Theme.fontWeights.semibold,
    color: Theme.colors.text,
  },
  subtotalValue: {
    fontSize: Theme.fontSizes.sm,
    fontWeight: Theme.fontWeights.semibold,
    color: Theme.colors.text,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Theme.colors.surface,
    padding: Theme.spacing.md,
    borderRadius: Theme.borderRadius.md,
    marginTop: Theme.spacing.sm,
  },
  totalLabel: {
    fontSize: Theme.fontSizes.md,
    fontWeight: Theme.fontWeights.bold,
    color: Theme.colors.text,
  },
  totalValue: {
    fontSize: Theme.fontSizes.lg,
    fontWeight: Theme.fontWeights.bold,
    color: Theme.colors.primary,
  },
  facturasSection: {
    backgroundColor: Theme.colors.surfaceLight,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.lg,
  },
  facturaCard: {
    backgroundColor: Theme.colors.surface,
    padding: Theme.spacing.md,
    borderRadius: Theme.borderRadius.md,
    marginBottom: Theme.spacing.md,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    ...Theme.shadows.sm,
  },
  facturaGrid: {
    gap: Theme.spacing.md,
  },
  facturaItem: {},
  facturaLabel: {
    fontSize: Theme.fontSizes.sm,
    color: Theme.colors.placeholder,
  },
  facturaValue: {
    fontSize: Theme.fontSizes.md,
    fontWeight: Theme.fontWeights.semibold,
    color: Theme.colors.text,
  },
  facturaTotal: {
    fontSize: Theme.fontSizes.lg,
    fontWeight: Theme.fontWeights.bold,
    color: Theme.colors.primary,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: Theme.colors.border,
    padding: Theme.spacing.md,
    backgroundColor: Theme.colors.surfaceLight,
  },
  closeFooterButton: {
    backgroundColor: Theme.colors.primary,
    paddingVertical: Theme.spacing.md,
    borderRadius: Theme.borderRadius.md,
    alignItems: 'center',
  },
  closeFooterButtonText: {
    color: Theme.colors.textInverse,
    fontSize: Theme.fontSizes.md,
    fontWeight: Theme.fontWeights.semibold,
  },
});