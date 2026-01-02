import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import type { Cita } from '@models/Citas/Citas.types';
import Theme from '@constants/theme';
interface VistaMesProps {
  citas: Cita[];
  mesActual: Date;
  diaSeleccionado?: number | null;
  onDiaSeleccionado?: (dia: number) => void;
  onClickCita: (cita: Cita) => void;
}

const VistaMes: React.FC<VistaMesProps> = ({
  citas,
  mesActual,
  diaSeleccionado,
  onDiaSeleccionado,
  onClickCita,
}) => {
  const diasSemana = [
    'Lun',
    'Mar',
    'Mié',
    'Jue',
    'Vie',
    'Sáb',
    'Dom',
  ];

  const obtenerDiasDelMes = () => {
    const año = mesActual.getFullYear();
    const mes = mesActual.getMonth();
    const primerDia = new Date(año, mes, 1).getDay();
    const ultimoDia = new Date(año, mes + 1, 0).getDate();

    const dias: (number | null)[] = [];
    const primerDiaAjustado = primerDia === 0 ? 6 : primerDia - 1;

    for (let i = 0; i < primerDiaAjustado; i++) {
      dias.push(null);
    }
    for (let i = 1; i <= ultimoDia; i++) {
      dias.push(i);
    }
    return dias;
  };

  const obtenerCitasDelDia = (dia: number): Cita[] => {
    const año = mesActual.getFullYear();
    const mes = mesActual.getMonth();

    return citas
      .filter(
        (cita) => cita.dia === dia && cita.mes === mes && cita.año === año
      )
      .sort((a, b) => {
        const horaA = a.horaCita.split(':').map(Number);
        const horaB = b.horaCita.split(':').map(Number);
        return horaA[0] * 60 + horaA[1] - (horaB[0] * 60 + horaB[1]);
      });
  };

  const esHoy = (dia: number) => {
    const hoy = new Date();
    return (
      dia === hoy.getDate() &&
      mesActual.getMonth() === hoy.getMonth() &&
      mesActual.getFullYear() === hoy.getFullYear()
    );
  };

  const obtenerColorEstado = (estado?: 'pendiente' | 'atendida' | 'cancelada') => {
    switch (estado) {
      case 'atendida':
        return styles.citaAtendida;
      case 'cancelada':
        return styles.citaCancelada;
      case 'pendiente':
      default:
        return styles.citaPendiente;
    }
  };

  const dias = obtenerDiasDelMes();
  const semanas: (number | null)[][] = [];
  for (let i = 0; i < dias.length; i += 7) {
    semanas.push(dias.slice(i, i + 7));
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        {diasSemana.map((dia, index) => (
          <View key={index} style={styles.headerCell}>
            <Text style={styles.headerText}>{dia}</Text>
          </View>
        ))}
      </View>

      <ScrollView style={styles.scrollContainer}>
        {semanas.map((semana, semanaIndex) => (
          <View key={semanaIndex} style={styles.semanaContainer}>
            {semana.map((dia, diaIndex) => {
              const citasDelDia = dia ? obtenerCitasDelDia(dia) : [];
              const tieneCitas = citasDelDia.length > 0;
              const esHoyDia = dia ? esHoy(dia) : false;

              return (
                <TouchableOpacity
                  key={diaIndex}
                  onPress={() => dia && onDiaSeleccionado && onDiaSeleccionado(dia)}
                  disabled={!dia}
                  style={[
                    styles.diaCell,
                    !dia && styles.diaCellEmpty,
                    dia === diaSeleccionado && styles.diaCellSelected,
                    esHoyDia && styles.diaCellHoy,
                  ]}
                  activeOpacity={0.7}
                >
                  {dia && (
                    <View style={styles.diaCellContent}>
                      <View
                        style={[
                          styles.diaNumeroContainer,
                          esHoyDia && styles.diaNumeroHoyContainer,
                          dia === diaSeleccionado && styles.diaNumeroSelectedContainer,
                        ]}
                      >
                        <Text
                          style={[
                            styles.diaNumero,
                            esHoyDia && styles.diaNumeroHoy,
                            dia === diaSeleccionado && styles.diaNumeroSelected,
                          ]}
                        >
                          {dia}
                        </Text>
                      </View>

                      {tieneCitas && (
                        <ScrollView
                          style={styles.citasContainer}
                          nestedScrollEnabled
                        >
                          {citasDelDia.map((cita) => (
                            <TouchableOpacity
                              key={cita.id}
                              onPress={() => onClickCita(cita)}
                              style={[styles.citaCard, obtenerColorEstado(cita.estado)]}
                              activeOpacity={0.8}
                            >
                              <Text style={styles.citaHora}>
                                🕐 {cita.horaCita}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </ScrollView>
                      )}
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Theme.colors.surface,
  },
  headerContainer: {
    flexDirection: 'row',
    backgroundColor: Theme.colors.backgroundLight,
    borderBottomWidth: 2,
    borderBottomColor: Theme.colors.border,
  },
  headerCell: {
    flex: 1,
    paddingVertical: Theme.spacing.md,
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: Theme.colors.accentLight,
  },
  headerText: {
    fontWeight: Theme.fontWeights.bold,
    color: Theme.colors.primary,
    fontSize: Theme.fontSizes.xs,
  },
  scrollContainer: {
    backgroundColor: Theme.colors.surface,
  },
  semanaContainer: {
    flexDirection: 'row',
  },
  diaCell: {
    flex: 1,
    minHeight: 112,
    padding: Theme.spacing.md,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: Theme.colors.border,
    backgroundColor: Theme.colors.surface,
  },
  diaCellEmpty: {
    backgroundColor: Theme.colors.surfaceLight,
  },
  diaCellSelected: {
    backgroundColor: Theme.colors.backgroundLight,
    borderWidth: 2,
    borderColor: Theme.colors.primary,
  },
  diaCellHoy: {
    backgroundColor: Theme.colors.backgroundLight,
  },
  diaCellContent: {
    flex: 1,
  },
  diaNumeroContainer: {
    marginBottom: Theme.spacing.sm,
  },
  diaNumeroHoyContainer: {
    backgroundColor: Theme.colors.primary,
    width: 32,
    height: 32,
    borderRadius: Theme.borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  diaNumeroSelectedContainer: {
  },
  diaNumero: {
    fontWeight: Theme.fontWeights.bold,
    color: Theme.colors.text,
  },
  diaNumeroHoy: {
    color: Theme.colors.textInverse,
  },
  diaNumeroSelected: {
    color: Theme.colors.primary,
    fontSize: Theme.fontSizes.lg,
  },
  citasContainer: {
    flex: 1,
    maxHeight: 80,
  },
  citaCard: {
    paddingHorizontal: 10,
    paddingVertical: Theme.spacing.sm - 2,
    borderRadius: Theme.borderRadius.md,
    marginBottom: Theme.spacing.sm - 2,
  },
  citaPendiente: {
    backgroundColor: Theme.colors.warning,
  },
  citaAtendida: {
    backgroundColor: Theme.colors.success,
  },
  citaCancelada: {
    backgroundColor: Theme.colors.error,
  },
  citaHora: {
    color: Theme.colors.textInverse,
    fontSize: 10,
    fontWeight: Theme.fontWeights.semibold,
    textAlign: 'center',
  },
});

export default VistaMes;