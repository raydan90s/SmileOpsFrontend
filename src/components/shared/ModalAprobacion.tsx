import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import { CheckCircle, FileText } from 'lucide-react-native';
import { Colors, Spacing, BorderRadius, FontSizes, FontWeights, Shadows } from '@constants/theme';
import type { Pedido } from '@models/Pedidos/Pedidos.types';

interface ModalAprobacionProps {
  item?: Pedido | null;
  pedido?: Pedido | null;
  visible: boolean;
  onConfirm: (observaciones: string) => Promise<void>;
  onCancel: () => void;
  mostrarCampoObservaciones?: boolean;
  titulo?: string;
  idDisplay?: string | number;
  renderInfo?: (item: Pedido) => React.ReactNode;
  mensajeAdvertencia?: string;
}

export const ModalAprobacion = ({
  item,
  pedido,
  visible,
  onConfirm,
  onCancel,
  mostrarCampoObservaciones = true,
  titulo,
  idDisplay,
  renderInfo,
  mensajeAdvertencia
}: ModalAprobacionProps) => {
  const [step, setStep] = useState<'confirm' | 'observaciones'>('confirm');
  const [observaciones, setObservaciones] = useState('');
  const [loading, setLoading] = useState(false);
  
  const itemActual = item || pedido;

  const id = idDisplay || itemActual?.iid_pedido;

  if (!itemActual) return null;

  const handleCancel = () => {
    setStep('confirm');
    setObservaciones('');
    onCancel();
  };

  const handleContinuar = () => {
    if (!mostrarCampoObservaciones) {
      handleAprobar();
    } else {
      setStep('observaciones');
    }
  };

  const handleAprobar = async () => {
    setLoading(true);
    try {
      await onConfirm(observaciones);
      setStep('confirm');
      setObservaciones('');
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const getInfoItem = () => {
    return {
      bodega: itemActual.bodega_destino_nombre,
      proveedor: itemActual.proveedor_nombre,
      tipo: itemActual.tipo?.v_descripcion,
      usuario: itemActual.usuario_solicita_nombre
    };
  };

  const info = getInfoItem();

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={handleCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {step === 'confirm' ? (
            <ScrollView contentContainerStyle={styles.content}>
              <View style={styles.header}>
                <CheckCircle color={Colors.success} size={24} />
                <Text style={styles.title}>
                  {titulo || '¿Aprobar pedido?'}
                </Text>
              </View>

              <View style={styles.infoContainer}>
                {renderInfo ? (
                  <>
                    <Text style={styles.infoText}>
                      <Text style={styles.label}>Pedido: </Text>
                      #{id}
                    </Text>
                    {renderInfo(itemActual)}
                  </>
                ) : (
                  <>
                    <Text style={styles.infoText}>
                      <Text style={styles.label}>Pedido: </Text>
                      #{id}
                    </Text>
                    {info.bodega && <Text style={styles.infoText}><Text style={styles.label}>Bodega: </Text>{info.bodega}</Text>}
                    {info.tipo && <Text style={styles.infoText}><Text style={styles.label}>Tipo: </Text>{info.tipo}</Text>}
                    {info.proveedor && <Text style={styles.infoText}><Text style={styles.label}>Proveedor: </Text>{info.proveedor}</Text>}
                    {info.usuario && <Text style={styles.infoText}><Text style={styles.label}>Solicita: </Text>{info.usuario}</Text>}
                  </>
                )}
              </View>

              {mensajeAdvertencia && (
                <View style={styles.warningContainer}>
                  <Text style={styles.warningText}>{mensajeAdvertencia}</Text>
                </View>
              )}

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  onPress={handleCancel}
                  style={styles.buttonSecondary}
                  disabled={loading}
                >
                  <Text style={styles.buttonTextSecondary}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleContinuar}
                  style={styles.buttonPrimary}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color={Colors.textInverse} size="small" />
                  ) : (
                    <Text style={styles.buttonTextPrimary}>
                      {mostrarCampoObservaciones ? 'Continuar' : 'Aprobar'}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>
          ) : (
            <ScrollView contentContainerStyle={styles.content}>
              <View style={styles.header}>
                <FileText color={Colors.text} size={24} />
                <Text style={styles.title}>
                  Pedido #{id} - Aprobación
                </Text>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Observaciones (opcional)</Text>
                <TextInput
                  value={observaciones}
                  onChangeText={setObservaciones}
                  style={styles.textArea}
                  multiline
                  numberOfLines={4}
                  placeholder="Ingrese observaciones si lo desea..."
                  placeholderTextColor={Colors.placeholder}
                  textAlignVertical="top"
                  editable={!loading}
                />
              </View>

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  onPress={handleCancel}
                  style={styles.buttonSecondary}
                  disabled={loading}
                >
                  <Text style={styles.buttonTextSecondary}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleAprobar}
                  style={styles.buttonPrimary}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color={Colors.textInverse} size="small" />
                  ) : (
                    <View style={styles.buttonContent}>
                      <CheckCircle color={Colors.textInverse} size={16} />
                      <Text style={styles.buttonTextPrimary}>Aprobar</Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: Spacing.md,
  },
  container: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    ...Shadows.lg,
    maxHeight: '80%',
  },
  content: {
    padding: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  title: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    flex: 1,
  },
  infoContainer: {
    marginBottom: Spacing.lg,
    gap: Spacing.xs,
  },
  infoText: {
    fontSize: FontSizes.md,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  label: {
    fontWeight: FontWeights.bold,
    color: Colors.text,
  },
  warningContainer: {
    backgroundColor: '#EFF6FF',
    borderLeftWidth: 4,
    borderLeftColor: Colors.info,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    borderRadius: BorderRadius.sm,
  },
  warningText: {
    color: '#1D4ED8',
    fontSize: FontSizes.sm,
  },
  inputContainer: {
    marginBottom: Spacing.lg,
  },
  inputLabel: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  textArea: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    fontSize: FontSizes.md,
    color: Colors.text,
    minHeight: 100,
    backgroundColor: Colors.surface,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  buttonSecondary: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  buttonPrimary: {
    flex: 1,
    backgroundColor: Colors.success,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonTextSecondary: {
    color: Colors.text,
    fontWeight: FontWeights.semibold,
    fontSize: FontSizes.md,
  },
  buttonTextPrimary: {
    color: Colors.textInverse,
    fontWeight: FontWeights.semibold,
    fontSize: FontSizes.md,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
});