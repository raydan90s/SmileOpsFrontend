import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Calendar, CalendarDays, CalendarClock } from 'lucide-react-native';
import type { Cita } from '@models/Citas/Citas.types';
import VistaMes from '@components/odontologia/citas-medicas/VistaMes';
import VistaDetallada from '@components/odontologia/citas-medicas/VistaDetallada';
import ModalCita from '@components/odontologia/citas-medicas/ModalCita';
import Theme from '@constants/theme';

type VistaCalendario = 'mes' | 'semana' | 'dia';

interface CalendarioProps {
  citas: Cita[];
  onDiaSeleccionado?: (dia: number) => void;
  mesActual: Date;
  onCambiarMes: (direccion: number) => void;
  diaSeleccionado?: number | null;
  onCambiarEstadoCita?: (
    citaId: string,
    nuevoEstado: 'pendiente' | 'atendida' | 'cancelada'
  ) => void;
  onEliminarCita?: (citaId: string) => void;
}

const Calendario: React.FC<CalendarioProps> = ({
  citas,
  onDiaSeleccionado,
  mesActual,
  onCambiarMes,
  diaSeleccionado,
  onCambiarEstadoCita,
  onEliminarCita,
}) => {
  const [citaSeleccionada, setCitaSeleccionada] = useState<Cita | null>(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [vista, setVista] = useState<VistaCalendario>('mes');
  const [diaActualVista, setDiaActualVista] = useState(new Date());

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

  const handleClickCita = (cita: Cita) => {
    setCitaSeleccionada(cita);
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setCitaSeleccionada(null);
  };

  const cambiarVista = (direccion: number) => {
    const nuevaFecha = new Date(diaActualVista);
    if (vista === 'dia') {
      nuevaFecha.setDate(diaActualVista.getDate() + direccion);
    } else if (vista === 'semana') {
      nuevaFecha.setDate(diaActualVista.getDate() + direccion * 7);
    }
    setDiaActualVista(nuevaFecha);
  };

  const obtenerTituloVista = () => {
    if (vista === 'mes') {
      return `${meses[mesActual.getMonth()]} de ${mesActual.getFullYear()}`;
    } else if (vista === 'semana') {
      const dia = diaActualVista.getDay();
      const inicio = new Date(diaActualVista);
      inicio.setDate(diaActualVista.getDate() - dia);
      const fin = new Date(inicio);
      fin.setDate(inicio.getDate() + 6);
      return `${inicio.getDate()} - ${fin.getDate()} de ${
        meses[inicio.getMonth()]
      } ${inicio.getFullYear()}`;
    } else {
      return `${diaActualVista.getDate()} de ${
        meses[diaActualVista.getMonth()]
      } ${diaActualVista.getFullYear()}`;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.calendarioContainer}>
        <View style={styles.header}>
          <View style={styles.navigationContainer}>
            <TouchableOpacity
              onPress={() =>
                vista === 'mes' ? onCambiarMes(-1) : cambiarVista(-1)
              }
              style={styles.navButton}
              activeOpacity={0.7}
            >
              <Text style={styles.navButtonText}>←</Text>
            </TouchableOpacity>

            <Text style={styles.titleText}>{obtenerTituloVista()}</Text>

            <TouchableOpacity
              onPress={() =>
                vista === 'mes' ? onCambiarMes(1) : cambiarVista(1)
              }
              style={styles.navButton}
              activeOpacity={0.7}
            >
              <Text style={styles.navButtonText}>→</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.viewSelectorContainer}>
            <TouchableOpacity
              onPress={() => setVista('mes')}
              style={[
                styles.viewButton,
                vista === 'mes' && styles.viewButtonActive,
              ]}
              activeOpacity={0.7}
            >
              <Calendar
                size={16}
                color={vista === 'mes' ? 'white' : '#4B5563'}
              />
              <Text
                style={[
                  styles.viewButtonText,
                  vista === 'mes' && styles.viewButtonTextActive,
                ]}
              >
                Mes
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setVista('semana')}
              style={[
                styles.viewButton,
                vista === 'semana' && styles.viewButtonActive,
              ]}
              activeOpacity={0.7}
            >
              <CalendarDays
                size={16}
                color={vista === 'semana' ? 'white' : '#4B5563'}
              />
              <Text
                style={[
                  styles.viewButtonText,
                  vista === 'semana' && styles.viewButtonTextActive,
                ]}
              >
                Semana
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setVista('dia')}
              style={[
                styles.viewButton,
                vista === 'dia' && styles.viewButtonActive,
              ]}
              activeOpacity={0.7}
            >
              <CalendarClock
                size={16}
                color={vista === 'dia' ? 'white' : '#4B5563'}
              />
              <Text
                style={[
                  styles.viewButtonText,
                  vista === 'dia' && styles.viewButtonTextActive,
                ]}
              >
                Día
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {vista === 'mes' && (
          <VistaMes
            citas={citas}
            mesActual={mesActual}
            diaSeleccionado={diaSeleccionado}
            onDiaSeleccionado={onDiaSeleccionado}
            onClickCita={handleClickCita}
          />
        )}

        {(vista === 'semana' || vista === 'dia') && (
          <VistaDetallada
            citas={citas}
            fecha={diaActualVista}
            tipo={vista}
            onClickCita={handleClickCita}
          />
        )}
      </View>

      <ModalCita
        cita={citaSeleccionada}
        mostrar={mostrarModal}
        onCerrar={cerrarModal}
        onCambiarEstado={onCambiarEstadoCita}
        onEliminar={onEliminarCita}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  calendarioContainer: {
    borderWidth: 2,
    borderColor: Theme.colors.border,
    borderRadius: Theme.borderRadius.lg,
    overflow: 'hidden',
    ...Theme.shadows.md,
  },
  header: {
    backgroundColor: Theme.colors.primary,
    padding: Theme.spacing.md,
  },
  navigationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Theme.spacing.sm,
  },
  navButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: Theme.spacing.sm - 2,
    borderRadius: Theme.borderRadius.md,
  },
  navButtonText: {
    color: Theme.colors.textInverse,
    fontSize: Theme.fontSizes.lg,
    fontWeight: Theme.fontWeights.bold,
  },
  titleText: {
    fontSize: Theme.fontSizes.xl,
    fontWeight: Theme.fontWeights.bold,
    color: Theme.colors.textInverse,
  },
  viewSelectorContainer: {
    flexDirection: 'row',
    gap: Theme.spacing.md,
    justifyContent: 'center',
    padding: Theme.spacing.xs,
    backgroundColor: Theme.colors.background,
    borderRadius: Theme.borderRadius.lg,
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.xl - 12,
    paddingVertical: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.md,
  },
  viewButtonActive: {
    backgroundColor: Theme.colors.primary,
    ...Theme.shadows.sm,
  },
  viewButtonText: {
    fontSize: Theme.fontSizes.sm,
    fontWeight: Theme.fontWeights.semibold,
    color: Theme.colors.textDark,
  },
  viewButtonTextActive: {
    color: Theme.colors.textInverse,
  },
});

export default Calendario;