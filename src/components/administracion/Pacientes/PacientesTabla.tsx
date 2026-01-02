import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Users, Edit, Power, Trash2, Phone, Mail } from 'lucide-react-native';
import type { PacienteDB } from '@models/Pacientes/Pacientes.types';
import { Colors, Spacing, BorderRadius, FontSizes, Shadows } from '@constants/theme';

interface PacientesTablaProps {
  pacientes: PacienteDB[];
  onEditar: (id: number) => void;
  onEliminar?: (id: number) => void;
  onToggleEstado?: (paciente: PacienteDB) => void;
  obtenerNombreCompleto: (paciente: PacienteDB) => string;
}

const PacientesTabla: React.FC<PacientesTablaProps> = ({
  pacientes,
  onEditar,
  onEliminar,
  onToggleEstado,
  obtenerNombreCompleto
}) => {

  const calcularEdad = (fechaNacimiento: string | null) => {
    if (!fechaNacimiento) return '-';
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return `${edad} años`;
  };

  if (pacientes.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Users size={64} color={Colors.placeholder} />
        <Text style={styles.emptyText}>No hay pacientes registrados</Text>
        <Text style={styles.emptySubtext}>Comience agregando un nuevo paciente</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.listContainer}>
      {pacientes.map((paciente) => (
        <View key={paciente.iidpaciente} style={styles.card}>
          
          <View style={styles.cardHeader}>
            <View style={styles.headerInfo}>
              <Text style={styles.pacienteNombre} numberOfLines={1}>
                {obtenerNombreCompleto(paciente)}
              </Text>
              <Text style={styles.pacienteCodigo}>
                Cód: {paciente.iidpaciente} • CI: {paciente.vcedula || '-'}
              </Text>
            </View>
            <View style={[
              styles.badge, 
              paciente.cestado ? styles.badgeActive : styles.badgeInactive
            ]}>
              <Text style={[
                styles.badgeText, 
                paciente.cestado ? styles.badgeTextActive : styles.badgeTextInactive
              ]}>
                {paciente.cestado ? 'Activo' : 'Inactivo'}
              </Text>
            </View>
          </View>

          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Edad:</Text>
              <Text style={styles.detailValue}>{calcularEdad(paciente.dfechanacimiento)}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Sexo:</Text>
              <Text style={styles.detailValue}>
                {paciente.csexo === 'M' ? 'Masculino' : 
                 paciente.csexo === 'F' ? 'Femenino' : 'Otro'}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Phone size={14} color={Colors.primary} style={styles.icon} />
              <Text style={styles.detailValue} numberOfLines={1}>
                {paciente.vcelular || '-'}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Mail size={14} color={Colors.primary} style={styles.icon} />
              <Text style={styles.detailValue} numberOfLines={1}>
                {paciente.vemail || '-'}
              </Text>
            </View>
          </View>

          <View style={styles.actionsContainer}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.editButton]} 
              onPress={() => paciente.iidpaciente && onEditar(paciente.iidpaciente)}
            >
              <Edit size={18} color={Colors.primary} />
              <Text style={styles.actionTextPrimary}>Editar</Text>
            </TouchableOpacity>

            {onToggleEstado ? (
              <TouchableOpacity 
                style={[styles.actionButton, styles.stateButton]} 
                onPress={() => onToggleEstado(paciente)}
              >
                <Power 
                  size={18} 
                  color={paciente.cestado ? Colors.warning : Colors.success} 
                />
                <Text style={paciente.cestado ? styles.actionTextWarning : styles.actionTextSuccess}>
                  {paciente.cestado ? 'Desactivar' : 'Activar'}
                </Text>
              </TouchableOpacity>
            ) : onEliminar ? (
              <TouchableOpacity 
                style={[styles.actionButton, styles.deleteButton]} 
                onPress={() => paciente.iidpaciente && onEliminar(paciente.iidpaciente)}
              >
                <Trash2 size={18} color={Colors.error} />
                <Text style={styles.actionTextError}>Eliminar</Text>
              </TouchableOpacity>
            ) : null}
          </View>

        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingBottom: Spacing.xl,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
    marginTop: Spacing.xxl,
  },
  emptyText: {
    marginTop: Spacing.md,
    fontSize: FontSizes.lg,
    color: Colors.textLight,
    fontWeight: '600',
  },
  emptySubtext: {
    marginTop: Spacing.xs,
    fontSize: FontSizes.sm,
    color: Colors.placeholder,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  headerInfo: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  pacienteNombre: {
    fontSize: FontSizes.md,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 2,
  },
  pacienteCodigo: {
    fontSize: FontSizes.xs,
    color: Colors.primary,
  },
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  badgeActive: {
    backgroundColor: '#DCFCE7', 
  },
  badgeInactive: {
    backgroundColor: '#FEE2E2', 
  },
  badgeText: {
    fontSize: FontSizes.xs,
    fontWeight: '600',
  },
  badgeTextActive: {
    color: '#166534',
  },
  badgeTextInactive: {
    color: '#991B1B', 
  },
  detailsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    marginBottom: 4,
  },
  icon: {
    marginRight: 6,
  },
  detailLabel: {
    fontSize: FontSizes.xs,
    color: Colors.primary,
    marginRight: 4,
  },
  detailValue: {
    fontSize: FontSizes.xs,
    color: Colors.text,
    fontWeight: '500',
  },
  actionsContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing.sm,
    justifyContent: 'space-around',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  editButton: {
    backgroundColor: '#EFF6FF', 
  },
  stateButton: {
    backgroundColor: '#F9FAFB', 
  },
  deleteButton: {
    backgroundColor: '#FEF2F2', 
  },
  actionTextPrimary: {
    marginLeft: 6,
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: Colors.primary,
  },
  actionTextSuccess: {
    marginLeft: 6,
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: Colors.success,
  },
  actionTextWarning: {
    marginLeft: 6,
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: Colors.warning,
  },
  actionTextError: {
    marginLeft: 6,
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: Colors.error,
  },
});

export default PacientesTabla;