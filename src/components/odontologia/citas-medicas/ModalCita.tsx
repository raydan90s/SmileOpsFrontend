import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from 'react-native';
import type { Cita, EstadoCita } from '@models/Citas/Citas.types';
import ModalConfirmacion from '@components/odontologia/citas-medicas/ModalConfirmacion';
import Theme from '@constants/theme';

interface ModalCitaProps {
  cita: Cita | null;
  mostrar: boolean;
  onCerrar: () => void;
  onCambiarEstado?: (
    citaId: string,
    nuevoEstado: EstadoCita
  ) => void;
  onEliminar?: (citaId: string) => void;
}

const ModalCita: React.FC<ModalCitaProps> = ({
  cita,
  mostrar,
  onCerrar,
  onCambiarEstado,
  onEliminar,
}) => {
  const [estadoLocal, setEstadoLocal] = useState<EstadoCita | undefined>(
    cita?.estado
  );
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [mostrarConfirmacionEstado, setMostrarConfirmacionEstado] = useState(false);
  const [nuevoEstadoPendiente, setNuevoEstadoPendiente] = useState<EstadoCita | null>(
    null
  );

  useEffect(() => {
    if (cita) {
      setEstadoLocal(cita.estado);
    }
  }, [cita]);

  if (!mostrar || !cita) return null;

  const meses = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ];

  const obtenerColorEstado = (estado?: EstadoCita) => {
    switch (estado) {
      case 'atendida':
        return styles.estadoAtendida;
      case 'cancelada':
        return styles.estadoCancelada;
      case 'pendiente':
      default:
        return styles.estadoPendiente;
    }
  };

  const obtenerTextoEstado = (estado?: EstadoCita) => {
    switch (estado) {
      case 'atendida':
        return 'Atendida';
      case 'cancelada':
        return 'Cancelada';
      case 'pendiente':
      default:
        return 'Pendiente';
    }
  };

  const handleSolicitarCambiarEstado = (nuevoEstado: EstadoCita) => {
    if (estadoLocal === nuevoEstado) {
      return;
    }

    if (estadoLocal === 'atendida' || estadoLocal === 'cancelada') {
      return;
    }

    setNuevoEstadoPendiente(nuevoEstado);
    setMostrarConfirmacionEstado(true);
  };

  const handleConfirmarCambiarEstado = () => {
    if (nuevoEstadoPendiente && cita.id) {
      setEstadoLocal(nuevoEstadoPendiente);
      if (onCambiarEstado) {
        onCambiarEstado(cita.id, nuevoEstadoPendiente);
      }
    }
    setMostrarConfirmacionEstado(false);
    setNuevoEstadoPendiente(null);
    onCerrar();
  };

  const handleCancelarCambiarEstado = () => {
    setMostrarConfirmacionEstado(false);
    setNuevoEstadoPendiente(null);
  };

  const handleSolicitarEliminar = () => {
    setMostrarConfirmacion(true);
  };

  const handleConfirmarEliminar = () => {
    if (onEliminar && cita.id) {
      onEliminar(cita.id);
      setMostrarConfirmacion(false);
      onCerrar();
    }
  };

  const handleCancelarEliminar = () => {
    setMostrarConfirmacion(false);
  };

  const obtenerMensajeConfirmacionEstado = () => {
    if (!nuevoEstadoPendiente) return '';

    const estadoTexto = obtenerTextoEstado(nuevoEstadoPendiente);
    return `¿Está seguro de cambiar el estado de la cita a "${estadoTexto}"?`;
  };

  const esEstadoBloqueado = (estado: EstadoCita) => {
    if (estadoLocal === 'atendida' || estadoLocal === 'cancelada') {
      return true;
    }
    if (estadoLocal === estado) {
      return true;
    }
    return false;
  };

  return (
    <>
      <Modal
        visible={mostrar && !mostrarConfirmacion && !mostrarConfirmacionEstado}
        transparent
        animationType="fade"
        onRequestClose={onCerrar}
      >
        <Pressable style={styles.overlay} onPress={onCerrar}>
          <Pressable onPress={(e) => e.stopPropagation()}>
            <View style={styles.container}>
              <View style={styles.header}>
                <Text style={styles.title}>Detalles de la Cita</Text>
                <TouchableOpacity
                  onPress={onCerrar}
                  style={styles.closeButton}
                  activeOpacity={0.7}
                >
                  <Text style={styles.closeButtonText}>×</Text>
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.section}>
                  <View style={[styles.estadoCard, obtenerColorEstado(estadoLocal)]}>
                    <Text style={styles.estadoLabel}>Estado</Text>
                    <Text style={styles.estadoValue}>
                      {obtenerTextoEstado(estadoLocal)}
                    </Text>
                  </View>

                  <View style={styles.infoCard}>
                    <Text style={styles.infoLabel}>Fecha y Hora</Text>
                    <Text style={styles.infoValue}>
                      {cita.dia} de {meses[cita.mes]} {cita.año} - {cita.horaCita}
                    </Text>
                  </View>

                  <View style={styles.row}>
                    <View style={[styles.infoCardSmall, styles.halfWidth]}>
                      <Text style={styles.infoLabel}>Código</Text>
                      <Text style={styles.infoValue}>{cita.codigo}</Text>
                    </View>
                    <View style={[styles.infoCardSmall, styles.halfWidth]}>
                      <Text style={styles.infoLabel}>Cédula</Text>
                      <Text style={styles.infoValue}>{cita.cedula}</Text>
                    </View>
                  </View>

                  <View style={styles.infoCardSmall}>
                    <Text style={styles.infoLabel}>Paciente</Text>
                    <Text style={styles.infoValue}>{cita.nombre}</Text>
                  </View>

                  <View style={styles.infoCardSmall}>
                    <Text style={styles.infoLabel}>Doctor</Text>
                    <Text style={styles.infoValue}>{cita.doctor}</Text>
                  </View>

                  <View style={styles.row}>
                    <View style={[styles.infoCardSmall, styles.halfWidth]}>
                      <Text style={styles.infoLabel}>Consultorio</Text>
                      <Text style={styles.infoValue}>{cita.consultorio}</Text>
                    </View>
                    <View style={[styles.infoCardSmall, styles.halfWidth]}>
                      <Text style={styles.infoLabel}>Duración</Text>
                      <Text style={styles.infoValue}>{cita.tiempoEstimado}</Text>
                    </View>
                  </View>

                  <View style={styles.infoCardSmall}>
                    <Text style={styles.infoLabel}>Tratamiento</Text>
                    <Text style={styles.infoValue}>{cita.tratamiento}</Text>
                  </View>

                  <View style={styles.divider} />

                  <View style={styles.estadosSection}>
                    <Text style={styles.estadosTitle}>Cambiar Estado:</Text>
                    <View style={styles.estadosButtons}>
                      <TouchableOpacity
                        onPress={() => handleSolicitarCambiarEstado('pendiente')}
                        disabled={esEstadoBloqueado('pendiente')}
                        style={[
                          styles.estadoButton,
                          styles.estadoButtonPendiente,
                          estadoLocal === 'pendiente' && styles.estadoButtonActive,
                          esEstadoBloqueado('pendiente') && styles.estadoButtonDisabled,
                        ]}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.estadoButtonText}>🟡 Pendiente</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => handleSolicitarCambiarEstado('atendida')}
                        disabled={esEstadoBloqueado('atendida')}
                        style={[
                          styles.estadoButton,
                          styles.estadoButtonAtendida,
                          estadoLocal === 'atendida' && styles.estadoButtonActive,
                          esEstadoBloqueado('atendida') && styles.estadoButtonDisabled,
                        ]}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.estadoButtonText}>🟢 Atendida</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => handleSolicitarCambiarEstado('cancelada')}
                        disabled={esEstadoBloqueado('cancelada')}
                        style={[
                          styles.estadoButton,
                          styles.estadoButtonCancelada,
                          estadoLocal === 'cancelada' && styles.estadoButtonActive,
                          esEstadoBloqueado('cancelada') && styles.estadoButtonDisabled,
                        ]}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.estadoButtonText}>🔴 Cancelada</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </ScrollView>

              <View style={styles.footer}>
                <TouchableOpacity
                  onPress={handleSolicitarEliminar}
                  style={[styles.actionButton, styles.deleteButton]}
                  activeOpacity={0.8}
                >
                  <Text style={styles.actionButtonText}>Eliminar Cita</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={onCerrar}
                  style={[styles.actionButton, styles.closeActionButton]}
                  activeOpacity={0.8}
                >
                  <Text style={styles.actionButtonText}>Cerrar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      <ModalConfirmacion
        mostrar={mostrarConfirmacion}
        titulo="¿Eliminar esta cita?"
        mensaje="Esta acción no se puede deshacer. ¿Está seguro de que desea eliminar esta cita médica?"
        textoConfirmar="Sí, eliminar"
        textoCancelar="No, cancelar"
        icono="advertencia"
        onConfirmar={handleConfirmarEliminar}
        onCancelar={handleCancelarEliminar}
      />

      <ModalConfirmacion
        mostrar={mostrarConfirmacionEstado}
        titulo="¿Cambiar estado de la cita?"
        mensaje={obtenerMensajeConfirmacionEstado()}
        textoConfirmar="Sí, cambiar"
        textoCancelar="No, cancelar"
        icono="advertencia"
        onConfirmar={handleConfirmarCambiarEstado}
        onCancelar={handleCancelarCambiarEstado}
      />
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Theme.spacing.sm,
  },
  container: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.lg,
    maxWidth: 400,
    width: '100%',
    maxHeight: '90%',
    ...Theme.shadows.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
  },
  title: {
    fontSize: Theme.fontSizes.lg,
    fontWeight: Theme.fontWeights.bold,
    color: Theme.colors.primary,
  },
  closeButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: Theme.fontSizes.xl,
    fontWeight: Theme.fontWeights.bold,
    color: Theme.colors.primary,
  },
  content: {
    padding: Theme.spacing.md,
  },
  section: {
    gap: Theme.spacing.sm,
  },
  estadoCard: {
    padding: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.md,
    alignItems: 'center',
  },
  estadoLabel: {
    fontSize: Theme.fontSizes.xs,
    fontWeight: Theme.fontWeights.medium,
    color: Theme.colors.textInverse,
    opacity: 0.9,
  },
  estadoValue: {
    fontSize: Theme.fontSizes.md,
    fontWeight: Theme.fontWeights.bold,
    color: Theme.colors.textInverse,
  },
  estadoPendiente: {
    backgroundColor: Theme.colors.warning,
  },
  estadoAtendida: {
    backgroundColor: Theme.colors.success,
  },
  estadoCancelada: {
    backgroundColor: Theme.colors.error,
  },
  infoCard: {
    backgroundColor: Theme.colors.backgroundLight,
    padding: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.md,
    marginTop: Theme.spacing.sm,
  },
  infoCardSmall: {
    backgroundColor: Theme.colors.surfaceLight,
    padding: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.md,
    marginTop: Theme.spacing.sm,
  },
  infoLabel: {
    fontSize: Theme.fontSizes.xs,
    color: Theme.colors.primary,
    fontWeight: Theme.fontWeights.medium,
  },
  infoValue: {
    fontSize: Theme.fontSizes.sm,
    fontWeight: Theme.fontWeights.semibold,
    color: Theme.colors.text,
    marginTop: 2,
  },
  row: {
    flexDirection: 'row',
    gap: Theme.spacing.sm,
  },
  halfWidth: {
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: Theme.colors.border,
    marginVertical: Theme.spacing.md,
  },
  estadosSection: {
    marginTop: Theme.spacing.sm,
  },
  estadosTitle: {
    fontSize: Theme.fontSizes.xs,
    color: Theme.colors.primary,
    fontWeight: Theme.fontWeights.medium,
    marginBottom: Theme.spacing.sm,
  },
  estadosButtons: {
    flexDirection: 'row',
    gap: Theme.spacing.sm,
  },
  estadoButton: {
    flex: 1,
    paddingVertical: Theme.spacing.sm - 2,
    paddingHorizontal: Theme.spacing.xs,
    borderRadius: Theme.borderRadius.md,
    alignItems: 'center',
  },
  estadoButtonPendiente: {
    backgroundColor: Theme.colors.warning,
  },
  estadoButtonAtendida: {
    backgroundColor: Theme.colors.success,
  },
  estadoButtonCancelada: {
    backgroundColor: Theme.colors.error,
  },
  estadoButtonActive: {
    opacity: Theme.opacity.hover,
  },
  estadoButtonDisabled: {
    opacity: Theme.opacity.disabled,
  },
  estadoButtonText: {
    color: Theme.colors.textInverse,
    fontSize: 11,
    fontWeight: Theme.fontWeights.semibold,
  },
  footer: {
    flexDirection: 'row',
    gap: Theme.spacing.sm,
    padding: Theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.border,
  },
  actionButton: {
    flex: 1,
    paddingVertical: Theme.spacing.sm - 2,
    borderRadius: Theme.borderRadius.md,
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: Theme.colors.primary,
  },
  closeActionButton: {
    backgroundColor: Theme.colors.primary,
  },
  actionButtonText: {
    color: Theme.colors.textInverse,
    fontSize: Theme.fontSizes.sm,
    fontWeight: Theme.fontWeights.semibold,
  },
});

export default ModalCita;