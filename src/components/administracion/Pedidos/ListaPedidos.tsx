import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Eye, Check, X, Package, Printer, Edit } from 'lucide-react-native';
import type { Pedido } from '@models/Pedidos/Pedidos.types';
import type { PermisosAcciones } from '@models/Permisos/Permisos.types';
import Theme from '@constants/theme';

interface ListaPedidosProps {
  items: Pedido[];
  estadoActivo: number;
  permisos: PermisosAcciones;
  onVerDetalle: (item: Pedido) => void;
  onEditar: (item: Pedido) => void;
  onAprobar: (item: Pedido) => void;
  onRechazar: (item: Pedido) => void;
  onMarcarRecibido: (item: Pedido) => void;
  onEditarCotizacion: (item: Pedido) => void;
  onAprobarCotizacion: (item: Pedido) => void;
  onEditarCotizado: (item: Pedido) => void;
}

export const ListaPedidos: React.FC<ListaPedidosProps> = ({
  items = [],
  estadoActivo,
  permisos,
  onVerDetalle,
  onEditar,
  onAprobar,
  onRechazar,
  onMarcarRecibido,
  onEditarCotizacion,
  onAprobarCotizacion,
  onEditarCotizado,
}) => {
  const formatearId = (id: number) => `#${id.toString().padStart(5, '0')}`;

  if (!items || items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Package size={64} color={Theme.colors.placeholder} />
        <Text style={styles.emptyTitle}>No hay pedidos en este estado</Text>
        <Text style={styles.emptySubtitle}>Los nuevos pedidos aparecerán aquí</Text>
      </View>
    );
  }

  const getEstadoStyle = (estadoId: number) => {
    switch (estadoId) {
      case 1:
        return styles.estadoPendiente;
      case 2:
        return styles.estadoAprobado;
      case 3:
        return styles.estadoRechazado;
      default:
        return styles.estadoDefault;
    }
  };

  const renderBotones = (pedido: Pedido) => (
    <View style={styles.botonesContainer}>
      {permisos.puedeVer && (
        <TouchableOpacity
          onPress={() => onVerDetalle(pedido)}
          style={[styles.boton, styles.botonVer]}
          activeOpacity={0.7}
        >
          <Eye size={18} color="#1D4ED8" />
        </TouchableOpacity>
      )}

      {estadoActivo === 1 && (
        <>
          {permisos.puedeEditar && (
            <TouchableOpacity
              onPress={() => onEditar(pedido)}
              style={[styles.boton, styles.botonEditar]}
              activeOpacity={0.7}
            >
              <Edit size={18} color="#4F46E5" />
            </TouchableOpacity>
          )}

          {permisos.puedeAprobar && (
            <TouchableOpacity
              onPress={() => onAprobar(pedido)}
              style={[styles.boton, styles.botonAprobar]}
              activeOpacity={0.7}
            >
              <Check size={18} color="#059669" />
            </TouchableOpacity>
          )}

          {permisos.puedeRechazar && (
            <TouchableOpacity
              onPress={() => onRechazar(pedido)}
              style={[styles.boton, styles.botonRechazar]}
              activeOpacity={0.7}
            >
              <X size={18} color="#DC2626" />
            </TouchableOpacity>
          )}
        </>
      )}

      {estadoActivo === 2 && permisos.puedeEditar && (
        <TouchableOpacity
          onPress={() => onEditarCotizacion(pedido)}
          style={[styles.boton, styles.botonEditar]}
          activeOpacity={0.7}
        >
          <Edit size={18} color="#4F46E5" />
        </TouchableOpacity>
      )}

      {estadoActivo === 3 && (permisos as any).puedeMarcarRecibido && (
        <TouchableOpacity
          onPress={() => onMarcarRecibido(pedido)}
          style={[styles.boton, styles.botonRecibido]}
          activeOpacity={0.7}
        >
          <Package size={18} color="#7C3AED" />
        </TouchableOpacity>
      )}

      {estadoActivo === 6 && (
        <>
          {permisos.puedeAprobar && (
            <TouchableOpacity
              onPress={() => onAprobarCotizacion(pedido)}
              style={[styles.boton, styles.botonAprobar]}
              activeOpacity={0.7}
            >
              <Check size={18} color="#059669" />
            </TouchableOpacity>
          )}

          {permisos.puedeRechazar && (
            <TouchableOpacity
              onPress={() => onRechazar(pedido)}
              style={[styles.boton, styles.botonRechazar]}
              activeOpacity={0.7}
            >
              <X size={18} color="#DC2626" />
            </TouchableOpacity>
          )}

          {permisos.puedeEditar && (
            <TouchableOpacity
              onPress={() => onEditarCotizado(pedido)}
              style={[styles.boton, styles.botonEditar]}
              activeOpacity={0.7}
            >
              <Edit size={18} color="#4F46E5" />
            </TouchableOpacity>
          )}
        </>
      )}
    </View>
  );

  return (
  <ScrollView style={styles.lista} showsVerticalScrollIndicator={false}>
    {items.map((pedido: Pedido) => {
      const esRequisicion = pedido.tipo?.v_descripcion === 'Requisición' || 
                           (pedido as any).iid_requisicion !== undefined;

      return (
        <View key={pedido.iid_pedido} style={styles.card}>
          <View style={styles.idRow}>
            <Text style={styles.pedidoId}>
              {formatearId(pedido.iid_pedido)}
            </Text>
            {pedido.tipo?.v_descripcion && (
              <View style={styles.tipoBadge}>
                <Text style={styles.tipoBadgeText}>
                  {pedido.tipo.v_descripcion}
                </Text>
              </View>
            )}
          </View>

          <View style={[styles.estadoBadge, getEstadoStyle(pedido.iid_estado_pedido)]}>
            <Text style={styles.estadoBadgeText}>
              {pedido.estado?.v_descripcion || 'N/A'}
            </Text>
          </View>

          {renderBotones(pedido)}

          <View style={styles.detallesGrid}>
            {esRequisicion ? (
              <>
                <View style={styles.detalleItem}>
                  <Text style={styles.detalleLabel}>Bodega Solicita:</Text>
                  <Text style={styles.detalleValue}>
                    {(pedido as any).bodega_solicita_nombre || pedido.bodega_destino_nombre || 'N/A'}
                  </Text>
                </View>
                <View style={styles.detalleItem}>
                  <Text style={styles.detalleLabel}>Bodega Origen:</Text>
                  <Text style={styles.detalleValue}>
                    {(pedido as any).bodega_origen_nombre || 'N/A'}
                  </Text>
                </View>
              </>
            ) : (
              <>
                <View style={styles.detalleItem}>
                  <Text style={styles.detalleLabel}>Bodega Destino:</Text>
                  <Text style={styles.detalleValue}>
                    {pedido.bodega_destino_nombre || `#${pedido.iid_bodega_destino}`}
                  </Text>
                </View>
                {pedido.iid_proveedor && (
                  <View style={styles.detalleItem}>
                    <Text style={styles.detalleLabel}>Proveedor:</Text>
                    <Text style={styles.detalleValue}>
                      {pedido.proveedor_nombre || `#${pedido.iid_proveedor}`}
                    </Text>
                  </View>
                )}
              </>
            )}

            <View style={styles.detalleItem}>
              <Text style={styles.detalleLabel}>Fecha Solicitud:</Text>
              <Text style={styles.detalleValue}>
                {new Date(pedido.d_fecha_solicitud).toLocaleDateString()}
              </Text>
            </View>
            <View style={styles.detalleItem}>
              <Text style={styles.detalleLabel}>Solicitado por:</Text>
              <Text style={styles.detalleValue}>
                {pedido.usuario_solicita_nombre || `Usuario #${pedido.iid_usuario_solicita}`}
              </Text>
            </View>
          </View>

          {pedido.v_observaciones && (
            <View style={styles.observacionesContainer}>
              <Text style={styles.observacionesText}>
                <Text style={styles.observacionesLabel}>Observaciones: </Text>
                {pedido.v_observaciones}
              </Text>
            </View>
          )}

          {pedido.v_motivo_rechazo && (
            <View style={styles.rechazoContainer}>
              <Text style={styles.rechazoText}>
                <Text style={styles.rechazoLabel}>Motivo de rechazo: </Text>
                {pedido.v_motivo_rechazo}
              </Text>
            </View>
          )}
        </View>
      );
    })}
  </ScrollView>
);
};

const styles = StyleSheet.create({
  lista: {
    flex: 1,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Theme.spacing.xxxl,
    backgroundColor: Theme.colors.surfaceLight,
    borderRadius: Theme.borderRadius.md,
    borderWidth: 2,
    borderColor: Theme.colors.borderDark,
    borderStyle: 'dashed',
  },
  emptyTitle: {
    fontSize: Theme.fontSizes.lg,
    fontWeight: Theme.fontWeights.semibold,
    color: Theme.colors.placeholder,
    marginTop: Theme.spacing.md,
  },
  emptySubtitle: {
    fontSize: Theme.fontSizes.sm,
    color: Theme.colors.placeholder,
    marginTop: Theme.spacing.sm,
  },
  card: {
    backgroundColor: Theme.colors.surface,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.sm,
    marginBottom: Theme.spacing.sm,
    gap: Theme.spacing.sm,
  },
  idRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.sm,
    flexWrap: 'wrap',
  },
  pedidoId: {
    fontSize: Theme.fontSizes.xl,
    fontWeight: Theme.fontWeights.bold,
    color: Theme.colors.primary,
  },
  tipoBadge: {
    backgroundColor: '#DDD6FE',
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: Theme.borderRadius.full,
  },
  tipoBadgeText: {
    color: '#6B21A8',
    fontSize: Theme.fontSizes.xs,
    fontWeight: Theme.fontWeights.medium,
  },
  estadoBadge: {
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: Theme.spacing.xs,
    borderRadius: Theme.borderRadius.md,
    alignSelf: 'flex-start',
  },
  estadoBadgeText: {
    fontSize: Theme.fontSizes.xs,
    fontWeight: Theme.fontWeights.semibold,
  },
  estadoPendiente: {
    backgroundColor: '#FEF3C7',
  },
  estadoAprobado: {
    backgroundColor: '#D1FAE5',
  },
  estadoRechazado: {
    backgroundColor: '#FEE2E2',
  },
  estadoDefault: {
    backgroundColor: '#DBEAFE',
  },
  botonesContainer: {
    flexDirection: 'row',
    gap: Theme.spacing.xs,
    flexWrap: 'wrap',
  },
  boton: {
    padding: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.md,
  },
  botonVer: {
    backgroundColor: '#DBEAFE',
  },
  botonEditar: {
    backgroundColor: '#E0E7FF',
  },
  botonAprobar: {
    backgroundColor: '#D1FAE5',
  },
  botonRechazar: {
    backgroundColor: '#FEE2E2',
  },
  botonRecibido: {
    backgroundColor: '#EDE9FE',
  },
  botonImprimir: {
    backgroundColor: '#F3F4F6',
  },
  detallesGrid: {
    gap: Theme.spacing.sm,
  },
  detalleItem: {
    flexDirection: 'column',
    gap: 2,
  },
  detalleLabel: {
    fontSize: Theme.fontSizes.xs,
    color: Theme.colors.placeholder,
  },
  detalleValue: {
    fontSize: Theme.fontSizes.sm,
    fontWeight: Theme.fontWeights.medium,
    color: Theme.colors.text,
  },
  observacionesContainer: {
    padding: Theme.spacing.sm,
    backgroundColor: '#EFF6FF',
    borderLeftWidth: 3,
    borderLeftColor: '#3B82F6',
    borderRadius: Theme.borderRadius.sm,
  },
  observacionesText: {
    fontSize: Theme.fontSizes.xs,
    color: '#1E40AF',
  },
  observacionesLabel: {
    fontWeight: Theme.fontWeights.bold,
  },
  rechazoContainer: {
    padding: Theme.spacing.sm,
    backgroundColor: '#FEF2F2',
    borderLeftWidth: 3,
    borderLeftColor: '#EF4444',
    borderRadius: Theme.borderRadius.sm,
  },
  rechazoText: {
    fontSize: Theme.fontSizes.xs,
    color: '#991B1B',
  },
  rechazoLabel: {
    fontWeight: Theme.fontWeights.bold,
  },
});