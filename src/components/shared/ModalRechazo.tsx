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
import { XCircle, AlertTriangle } from 'lucide-react-native';
import { Colors, Spacing, BorderRadius, FontSizes, FontWeights, Shadows } from '@constants/theme';

interface ModalRechazoProps<T = any> {
  item: T | null;
  visible: boolean;
  onConfirm: (motivoRechazo: string) => Promise<void>;
  onCancel: () => void;
  titulo?: string;
  idDisplay?: string | number;
  renderInfo?: (item: T) => React.ReactNode;
  mensajeAdvertencia?: string;
  placeholderMotivo?: string;
}

export const ModalRechazo = <T,>({
  item,
  visible,
  onConfirm,
  onCancel,
  titulo = 'Rechazar',
  idDisplay,
  renderInfo,
  mensajeAdvertencia = 'Esta acción rechazará el elemento de forma permanente. El motivo del rechazo quedará registrado en el historial.',
  placeholderMotivo = 'Ingrese el motivo del rechazo (obligatorio)...'
}: ModalRechazoProps<T>) => {
  const [step, setStep] = useState<'confirm' | 'motivo'>('confirm');
  const [motivoRechazo, setMotivoRechazo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!item) return null;

  const handleCancel = () => {
    setStep('confirm');
    setMotivoRechazo('');
    setError('');
    onCancel();
  };

  const handleContinuar = () => {
    setStep('motivo');
  };

  const handleRechazar = async () => {
    if (motivoRechazo.trim() === '') {
      setError('El motivo del rechazo es obligatorio');
      return;
    }

    setError('');
    setLoading(true);
    try {
      await onConfirm(motivoRechazo);
      setStep('confirm');
      setMotivoRechazo('');
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

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
                <XCircle color={Colors.error} size={24} />
                <Text style={styles.title}>¿{titulo}?</Text>
              </View>

              <View style={styles.infoContainer}>
                {renderInfo ? (
                  <>
                    {idDisplay && (
                      <Text style={styles.infoText}>
                        <Text style={styles.label}>ID: </Text>
                        #{idDisplay}
                      </Text>
                    )}
                    {renderInfo(item)}
                  </>
                ) : (
                  <>
                    {idDisplay && (
                      <Text style={styles.infoText}>
                        <Text style={styles.label}>ID: </Text>
                        #{idDisplay}
                      </Text>
                    )}
                    <Text style={styles.description}>
                      ¿Está seguro de que desea rechazar este elemento?
                    </Text>
                  </>
                )}
              </View>

              <View style={styles.warningContainer}>
                <View style={styles.warningHeader}>
                  <AlertTriangle color="#B45309" size={16} />
                  <Text style={styles.warningText}>{mensajeAdvertencia}</Text>
                </View>
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
                  onPress={handleContinuar}
                  style={styles.buttonDestructive}
                  disabled={loading}
                >
                  <Text style={styles.buttonTextDestructive}>Continuar</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          ) : (
            <ScrollView contentContainerStyle={styles.content}>
              <View style={styles.header}>
                <XCircle color={Colors.error} size={24} />
                <Text style={styles.title}>
                  {idDisplay ? `#${idDisplay} - Rechazo` : 'Rechazo'}
                </Text>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>
                  Motivo del rechazo <Text style={{ color: Colors.error }}>*</Text>
                </Text>
                <TextInput
                  value={motivoRechazo}
                  onChangeText={(text) => {
                    setMotivoRechazo(text);
                    setError('');
                  }}
                  style={[
                    styles.textArea,
                    error ? styles.textAreaError : null
                  ]}
                  multiline
                  numberOfLines={4}
                  placeholder={placeholderMotivo}
                  placeholderTextColor={Colors.placeholder}
                  textAlignVertical="top"
                  editable={!loading}
                />
                {error ? (
                  <View style={styles.errorContainer}>
                    <AlertTriangle color={Colors.error} size={12} />
                    <Text style={styles.errorText}>{error}</Text>
                  </View>
                ) : null}
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
                  onPress={handleRechazar}
                  style={styles.buttonDestructive}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color={Colors.textInverse} size="small" />
                  ) : (
                    <View style={styles.buttonContent}>
                      <XCircle color={Colors.textInverse} size={16} />
                      <Text style={styles.buttonTextDestructive}>Rechazar</Text>
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

export const createModalRechazo = <T,>() => {
  return (props: ModalRechazoProps<T>) => <ModalRechazo {...props} />;
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
    color: Colors.error,
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
  description: {
    fontSize: FontSizes.md,
    color: Colors.text,
  },
  label: {
    fontWeight: FontWeights.bold,
    color: Colors.text,
  },
  warningContainer: {
    backgroundColor: '#FFFBEB',
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    borderRadius: BorderRadius.sm,
  },
  warningHeader: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  warningText: {
    color: '#B45309',
    fontSize: FontSizes.sm,
    flex: 1,
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
  textAreaError: {
    borderColor: Colors.error,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.xs,
    gap: Spacing.xs,
  },
  errorText: {
    color: Colors.error,
    fontSize: FontSizes.xs,
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
  buttonDestructive: {
    flex: 1,
    backgroundColor: Colors.error,
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
  buttonTextDestructive: {
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