import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Trash2, Package } from 'lucide-react-native';
import { Colors, Spacing, BorderRadius, FontSizes } from '@constants/theme';
import type { ProductoTratamiento } from '@models/Tratamiento/Tratamiento.types';

interface TablaProductosTratamientoProps {
  productos: ProductoTratamiento[];
  onEliminarProducto?: (id: string) => void;
  onEditarCantidad?: (id: string, nuevaCantidad: number) => void;
  onEditarCantidadRecibida?: (id: string, nuevaCantidadRecibida: number) => void;
  onEditarPrecio?: (id: string, nuevoPrecio: number) => void;
  mostrarConsultorio?: boolean;
  mostrarValorUnitario?: boolean;
  mostrarIVA?: boolean;
  mostrarBodega?: boolean;
  mostrarTotal?: boolean;
  mostrarCantidadRecibida?: boolean;
  permitirEditarCantidad?: boolean;
  permitirEditarCantidadRecibida?: boolean;
  permitirEditarPrecio?: boolean;
  labelCantidad?: string;
}

const TablaProductosTratamiento: React.FC<TablaProductosTratamientoProps> = ({
  productos,
  onEliminarProducto,
  onEditarCantidad,
  onEditarCantidadRecibida,
  onEditarPrecio,
  mostrarConsultorio = true,
  mostrarValorUnitario = true,
  mostrarIVA = true,
  mostrarBodega = false,
  mostrarTotal = true,
  mostrarCantidadRecibida = false,
  permitirEditarCantidad = false,
  permitirEditarCantidadRecibida = false,
  permitirEditarPrecio = false,
  labelCantidad = 'Cantidad',
}) => {

  const obtenerCantidadCalculo = (producto: ProductoTratamiento) => {
    if (mostrarCantidadRecibida) {
      return (producto as any).cantidad_recibida ?? producto.cantidad ?? 0;
    }
    return producto.cantidad || 0;
  };

  const calcularValorIVA = (producto: ProductoTratamiento) => {
    const precioBase = producto.precio_unitario || producto.valorUnitario || 0;
    const porcentajeIVA = (producto as any).iva_porcentaje || 0;
    return precioBase * (porcentajeIVA / 100);
  };

  const calcularPrecioConIVA = (producto: ProductoTratamiento) => {
    const precioBase = producto.precio_unitario || producto.valorUnitario || 0;
    const porcentajeIVA = (producto as any).iva_porcentaje || 0;
    return precioBase * (1 + porcentajeIVA / 100);
  };

  const calcularSubtotalBase0 = () => {
    return productos.reduce((total, producto) => {
      const porcentajeIVA = (producto as any).iva_porcentaje || 0;
      if (porcentajeIVA === 0) {
        const precioUnitario = producto.precio_unitario || producto.valorUnitario || 0;
        const cantidad = obtenerCantidadCalculo(producto);
        return total + (precioUnitario * cantidad);
      }
      return total;
    }, 0);
  };

  const calcularSubtotalBaseIVA = () => {
    return productos.reduce((total, producto) => {
      const porcentajeIVA = (producto as any).iva_porcentaje || 0;
      if (porcentajeIVA > 0) {
        const precioUnitario = producto.precio_unitario || producto.valorUnitario || 0;
        const cantidad = obtenerCantidadCalculo(producto);
        return total + (precioUnitario * cantidad);
      }
      return total;
    }, 0);
  };

  const calcularSubtotal = () => {
    return productos.reduce((total, producto) => {
      const precioUnitario = producto.precio_unitario || producto.valorUnitario || 0;
      const cantidad = obtenerCantidadCalculo(producto);
      return total + (precioUnitario * cantidad);
    }, 0);
  };

  const calcularTotalIVA = () => {
    return productos.reduce((total, producto) => {
      const valorIVA = calcularValorIVA(producto);
      const cantidad = obtenerCantidadCalculo(producto);
      return total + (valorIVA * cantidad);
    }, 0);
  };

  const calcularTotalGeneral = () => {
    return productos.reduce((total, producto) => {
      const precioConIVA = calcularPrecioConIVA(producto);
      const cantidad = obtenerCantidadCalculo(producto);
      return total + (precioConIVA * cantidad);
    }, 0);
  };

  const formatearPrecio = (precio: number) => {
    return new Intl.NumberFormat('es-EC', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(precio);
  };

  const handleCantidadChange = (id: string, valor: string) => {
    if (!onEditarCantidad) return;
    const nuevaCantidad = parseFloat(valor);
    if (!isNaN(nuevaCantidad) && nuevaCantidad >= 0) {
      onEditarCantidad(id, nuevaCantidad);
    } else if (valor === '') {
      onEditarCantidad(id, 0);
    }
  };

  const handleCantidadRecibidaChange = (id: string, valor: string) => {
    if (!onEditarCantidadRecibida) return;
    if (valor === '') {
      onEditarCantidadRecibida(id, NaN);
      return;
    }
    const nuevaCantidad = parseFloat(valor);
    if (!isNaN(nuevaCantidad) && nuevaCantidad >= 0) {
      onEditarCantidadRecibida(id, nuevaCantidad);
    }
  };

  const handlePrecioChange = (id: string, valor: string) => {
    if (!onEditarPrecio) return;
    const nuevoPrecio = parseFloat(valor);
    if (!isNaN(nuevoPrecio) && nuevoPrecio >= 0) {
      onEditarPrecio(id, nuevoPrecio);
    } else if (valor === '') {
      onEditarPrecio(id, 0);
    }
  };

  if (productos.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Package size={48} color={Colors.placeholder} />
        <Text style={styles.emptyText}>
          No hay productos agregados.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Package size={20} color="#FFFFFF" />
          <Text style={styles.headerTitle}>PRODUCTOS AGREGADOS</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {productos.length} {productos.length === 1 ? 'item' : 'items'}
          </Text>
        </View>
      </View>

      <View style={styles.listContainer}>
        {productos.map((producto, index) => {
          const precioBase = producto.precio_unitario || producto.valorUnitario || 0;
          const porcentajeIVA = (producto as any).iva_porcentaje || 0;
          const valorIVA = calcularValorIVA(producto);
          const precioConIVA = calcularPrecioConIVA(producto);
          const cantidadRecibida = (producto as any).cantidad_recibida;
          const cantidadEfectiva = obtenerCantidadCalculo(producto);
          const totalLinea = precioConIVA * cantidadEfectiva;

          return (
            <View key={producto.id} style={styles.card}>
              
              <View style={styles.cardHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.productName}>{producto.nombre}</Text>
                  <Text style={styles.productCode}>Cód: {producto.codigo}</Text>
                </View>
                {onEliminarProducto && (
                  <TouchableOpacity 
                    onPress={() => onEliminarProducto(producto.id)}
                    style={styles.deleteButton}
                  >
                    <Trash2 size={20} color={Colors.error} />
                  </TouchableOpacity>
                )}
              </View>

              <View style={styles.gridDetails}>
                
                <View style={styles.gridItem}>
                  <Text style={styles.label}>{labelCantidad}</Text>
                  {permitirEditarCantidad ? (
                    <TextInput
                      style={styles.input}
                      keyboardType="numeric"
                      value={producto.cantidad ? producto.cantidad.toString() : ''}
                      onChangeText={(val) => handleCantidadChange(producto.id, val)}
                    />
                  ) : (
                    <Text style={styles.value}>{producto.cantidad}</Text>
                  )}
                </View>

                <View style={styles.gridItem}>
                  <Text style={styles.label}>Unidad</Text>
                  <Text style={styles.value}>{producto.unidad}</Text>
                </View>

                {mostrarCantidadRecibida && (
                  <View style={styles.gridItem}>
                    <Text style={styles.label}>Recibido</Text>
                    {permitirEditarCantidadRecibida ? (
                      <TextInput
                        style={[styles.input, { borderColor: Colors.success }]}
                        keyboardType="numeric"
                        value={Number.isNaN(cantidadRecibida) ? '' : (cantidadRecibida ?? producto.cantidad).toString()}
                        onChangeText={(val) => handleCantidadRecibidaChange(producto.id, val)}
                      />
                    ) : (
                      <Text style={styles.value}>{cantidadRecibida ?? producto.cantidad}</Text>
                    )}
                  </View>
                )}
              </View>

              {mostrarValorUnitario && (
                <View style={styles.priceRow}>
                  <View style={styles.priceItem}>
                    <Text style={styles.label}>P. Unit</Text>
                    {permitirEditarPrecio ? (
                      <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        value={precioBase ? precioBase.toString() : ''}
                        onChangeText={(val) => handlePrecioChange(producto.id, val)}
                      />
                    ) : (
                      <Text style={styles.value}>{formatearPrecio(precioBase)}</Text>
                    )}
                  </View>

                  {mostrarIVA && (
                    <View style={styles.priceItem}>
                      <Text style={styles.label}>IVA ({porcentajeIVA}%)</Text>
                      <Text style={[styles.value, { color: Colors.success }]}>
                        {formatearPrecio(valorIVA * cantidadEfectiva)}
                      </Text>
                    </View>
                  )}

                  <View style={styles.priceItem}>
                    <Text style={styles.label}>Total</Text>
                    <Text style={[styles.value, { fontWeight: 'bold', color: Colors.primary }]}>
                      {formatearPrecio(totalLinea)}
                    </Text>
                  </View>
                </View>
              )}

              {(mostrarBodega || mostrarConsultorio) && (
                <View style={styles.extraInfo}>
                  {mostrarBodega && (
                    <Text style={styles.extraText}>Bodega: {producto.bodega || 'N/A'}</Text>
                  )}
                  {mostrarConsultorio && (
                    <Text style={styles.extraText}>Consultorio: {producto.consultorio || 'N/A'}</Text>
                  )}
                </View>
              )}
            </View>
          );
        })}
      </View>

      {mostrarTotal && mostrarValorUnitario && (
        <View style={styles.footer}>
          {mostrarIVA && (
            <>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Subtotal Base 0%:</Text>
                <Text style={styles.totalValue}>{formatearPrecio(calcularSubtotalBase0())}</Text>
              </View>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Subtotal Base IVA:</Text>
                <Text style={styles.totalValue}>{formatearPrecio(calcularSubtotalBaseIVA())}</Text>
              </View>
              <View style={styles.totalRow}>
                <Text style={[styles.totalLabel, { fontWeight: 'bold' }]}>Subtotal Total:</Text>
                <Text style={[styles.totalValue, { fontWeight: 'bold' }]}>{formatearPrecio(calcularSubtotal())}</Text>
              </View>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total IVA:</Text>
                <Text style={[styles.totalValue, { color: Colors.success }]}>{formatearPrecio(calcularTotalIVA())}</Text>
              </View>
              <View style={styles.divider} />
            </>
          )}
          <View style={[styles.totalRow, styles.grandTotalRow]}>
            <Text style={styles.grandTotalLabel}>TOTAL GENERAL:</Text>
            <Text style={styles.grandTotalValue}>
              {formatearPrecio(mostrarIVA ? calcularTotalGeneral() : calcularSubtotal())}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    marginTop: Spacing.md,
  },
  header: {
    backgroundColor: Colors.primary,
    padding: Spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: FontSizes.sm,
  },
  badge: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  badgeText: {
    color: Colors.primary,
    fontSize: FontSizes.xs,
    fontWeight: 'bold',
  },
  emptyContainer: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: Colors.border,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.md,
  },
  emptyText: {
    marginTop: Spacing.sm,
    color: Colors.textLight,
    fontSize: FontSizes.sm,
  },
  listContainer: {
    backgroundColor: '#F9FAFB', 
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
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
  deleteButton: {
    padding: Spacing.xs,
  },
  gridDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginBottom: Spacing.sm,
  },
  gridItem: {
    alignItems: 'flex-start',
    minWidth: 60,
  },
  label: {
    fontSize: FontSizes.xs,
    color: Colors.textLight,
    fontWeight: '500',
    marginBottom: 2,
  },
  value: {
    fontSize: FontSizes.sm,
    color: Colors.text,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    fontSize: FontSizes.sm,
    textAlign: 'center',
    minWidth: 60,
    backgroundColor: '#FFFFFF',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F3F4F6', 
    padding: Spacing.sm,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.sm,
  },
  priceItem: {
    alignItems: 'center',
  },
  extraInfo: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.xs,
  },
  extraText: {
    fontSize: FontSizes.xs,
    color: Colors.textLight,
    fontStyle: 'italic',
  },
  footer: {
    backgroundColor: '#FFFFFF',
    padding: Spacing.md,
    borderTopWidth: 2,
    borderTopColor: Colors.border,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  totalLabel: {
    fontSize: FontSizes.sm,
    color: Colors.text,
  },
  totalValue: {
    fontSize: FontSizes.sm,
    color: Colors.text,
    fontVariant: ['tabular-nums'],
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.sm,
  },
  grandTotalRow: {
    marginTop: Spacing.xs,
    alignItems: 'center',
  },
  grandTotalLabel: {
    fontSize: FontSizes.md,
    fontWeight: 'bold',
    color: Colors.text,
  },
  grandTotalValue: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    color: Colors.primary,
  },
});

export default TablaProductosTratamiento;