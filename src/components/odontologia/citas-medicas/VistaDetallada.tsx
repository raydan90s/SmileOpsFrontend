import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Clock } from 'lucide-react-native';
import type { Cita } from '@models/Citas/Citas.types';
import Theme from '@constants/theme';
interface VistaDetalladaProps {
  citas: Cita[];
  fecha: Date;
  tipo: 'semana' | 'dia';
  onClickCita: (cita: Cita) => void;
}

const VistaDetallada: React.FC<VistaDetalladaProps> = ({
  citas,
  fecha,
  tipo,
  onClickCita,
}) => {
  const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const scrollViewRef = useRef<ScrollView>(null);

  const generarHorasDia = () => {
    const horas = [];
    for (let i = 9; i <= 20; i++) {
      horas.push(`${i.toString().padStart(2, '0')}:00`);
    }
    return horas;
  };

  const obtenerDiasSemana = () => {
    const day = fecha.getDay();
    const inicio = new Date(fecha);
    inicio.setDate(fecha.getDate() - day);

    const dias = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(inicio);
      d.setDate(inicio.getDate() + i);
      dias.push(d);
    }
    return dias;
  };

  const obtenerCitasPorFecha = (fechaObj: Date): Cita[] => {
    return citas
      .filter(
        (cita) =>
          cita.dia === fechaObj.getDate() &&
          cita.mes === fechaObj.getMonth() &&
          cita.año === fechaObj.getFullYear()
      )
      .sort((a, b) => {
        const horaA = a.horaCita.split(':').map(Number);
        const horaB = b.horaCita.split(':').map(Number);
        return horaA[0] * 60 + horaA[1] - (horaB[0] * 60 + horaB[1]);
      });
  };

  const citasEnHora = (fechaObj: Date, hora: string): Cita[] => {
    const citasDia = obtenerCitasPorFecha(fechaObj);
    return citasDia.filter((cita) =>
      cita.horaCita.startsWith(hora.substring(0, 2))
    );
  };

  const esHoyCompleto = (fechaObj: Date | null | undefined): boolean => {
    if (!fechaObj || !(fechaObj instanceof Date)) return false;
    try {
      const hoy = new Date();
      return (
        fechaObj.getDate() === hoy.getDate() &&
        fechaObj.getMonth() === hoy.getMonth() &&
        fechaObj.getFullYear() === hoy.getFullYear()
      );
    } catch (e) {
      return false;
    }
  };

  const obtenerHoraEcuador = () => {
    const ahora = new Date();
    const offsetEcuador = -5 * 60 * 60 * 1000;
    const offsetLocal = ahora.getTimezoneOffset() * 60 * 1000;
    const tiempoEcuador = new Date(
      ahora.getTime() + offsetLocal + offsetEcuador
    );

    const hora = tiempoEcuador.getHours();
    const minutos = tiempoEcuador.getMinutes();

    return { hora, minutos };
  };

  const obtenerPosicionLineaTiempo = () => {
    const { hora, minutos } = obtenerHoraEcuador();

    if (hora < 9 || hora > 20) return null;

    const horaInicio = 9;
    const horasTranscurridas = hora - horaInicio;
    const alturaBloque = 72;

    const posicion =
      horasTranscurridas * alturaBloque + (minutos * alturaBloque) / 60;

    return posicion;
  };

  useEffect(() => {
    if (tipo === 'dia' && esHoyCompleto(fecha) && scrollViewRef.current) {
      const posicion = obtenerPosicionLineaTiempo();
      if (posicion !== null) {
        setTimeout(() => {
          scrollViewRef.current?.scrollTo({
            y: Math.max(0, posicion - 200),
            animated: true,
          });
        }, 100);
      }
    }
  }, [tipo, fecha]);

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

  if (tipo === 'semana') {
    const horas = generarHorasDia();
    const diasSemanaArray = obtenerDiasSemana();

    return (
      <ScrollView style={styles.container} ref={scrollViewRef}>
        <View style={styles.semanaGrid}>
          <View style={styles.horasColumn}>
            <View style={styles.horaHeaderCell}>
              <Clock size={20} color="#3B82F6" />
            </View>
            {horas.map((hora) => (
              <View key={hora} style={styles.horaCell}>
                <Text style={styles.horaText}>{hora}</Text>
              </View>
            ))}
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.diasContainer}>
              {diasSemanaArray.map((fechaDia, index) => {
                const esHoy = esHoyCompleto(fechaDia);

                return (
                  <View key={index} style={styles.diaColumn}>
                    <View
                      style={[
                        styles.diaHeaderCell,
                        esHoy && styles.diaHeaderCellHoy,
                      ]}
                    >
                      <Text
                        style={[
                          styles.diaHeaderDia,
                          esHoy && styles.diaHeaderTextHoy,
                        ]}
                      >
                        {diasSemana[fechaDia.getDay()]}
                      </Text>
                      <Text
                        style={[
                          styles.diaHeaderNumero,
                          esHoy && styles.diaHeaderTextHoy,
                        ]}
                      >
                        {fechaDia.getDate()}
                      </Text>
                    </View>

                    {horas.map((hora) => {
                      const citasHora = citasEnHora(fechaDia, hora);
                      return (
                        <View key={hora} style={styles.horarioCell}>
                          {citasHora.length > 0 && (
                            <View style={styles.citasHoraContainer}>
                              {citasHora.map((cita) => (
                                <TouchableOpacity
                                  key={cita.id}
                                  onPress={() => onClickCita(cita)}
                                  style={[
                                    styles.citaCardSemana,
                                    obtenerColorEstado(cita.estado),
                                  ]}
                                  activeOpacity={0.8}
                                >
                                  <Text style={styles.citaHoraSemana}>
                                    {cita.horaCita}
                                  </Text>
                                  <Text style={styles.citaNombreSemana}>
                                    {cita.nombre}
                                  </Text>
                                  <Text style={styles.citaConsultorioSemana}>
                                    {cita.consultorio}
                                  </Text>
                                </TouchableOpacity>
                              ))}
                            </View>
                          )}
                        </View>
                      );
                    })}
                  </View>
                );
              })}
            </View>
          </ScrollView>
        </View>
      </ScrollView>
    );
  }

  const horas = generarHorasDia();
  const posicionLinea = obtenerPosicionLineaTiempo();
  const mostrarLinea = esHoyCompleto(fecha) && posicionLinea !== null;

  return (
    <ScrollView style={styles.container} ref={scrollViewRef}>
      <View style={styles.diaContainer}>
        {horas.map((hora, horaIndex) => {
          const citasHora = citasEnHora(fecha, hora);
          const mostrarLineaEnHora =
            mostrarLinea && Math.floor((posicionLinea || 0) / 72) === horaIndex;

          return (
            <View key={hora} style={styles.horaDiaRow}>
              <View style={styles.horaDiaLabelContainer}>
                <Clock size={12} color="#3B82F6" />
                <Text style={styles.horaDiaLabel}>{hora}</Text>
              </View>

              <View style={styles.horaDiaContent}>
                {citasHora.length > 0 && (
                  <View style={styles.citasDiaContainer}>
                    {citasHora.map((cita) => (
                      <TouchableOpacity
                        key={cita.id}
                        onPress={() => onClickCita(cita)}
                        style={[styles.citaCardDia, obtenerColorEstado(cita.estado)]}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.citaDiaInfo}>
                          🕐 {cita.horaCita} - {cita.nombre}
                        </Text>
                        <Text style={styles.citaDiaDetalle}>
                          👨‍⚕️ {cita.doctor} • 🏥 {cita.consultorio}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}

                {mostrarLineaEnHora && (
                  <View
                    style={[
                      styles.lineaTiempo,
                      { top: (posicionLinea || 0) % 72 },
                    ]}
                  >
                    <View style={styles.lineaTiempoPunto} />
                    <View style={styles.lineaTiempoLinea} />
                  </View>
                )}
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Theme.colors.surface,
    maxHeight: 600,
  },
  semanaGrid: {
    flexDirection: 'row',
  },
  horasColumn: {
    width: 80,
    backgroundColor: Theme.colors.surfaceLight,
    borderRightWidth: 2,
    borderRightColor: Theme.colors.borderDark,
  },
  horaHeaderCell: {
    height: 56,
    borderBottomWidth: 2,
    borderBottomColor: Theme.colors.borderDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  horaCell: {
    height: 72,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: Theme.spacing.sm,
    justifyContent: 'flex-start',
  },
  horaText: {
    fontSize: Theme.fontSizes.xs,
    fontWeight: Theme.fontWeights.semibold,
    color: Theme.colors.text,
  },
  diasContainer: {
    flexDirection: 'row',
  },
  diaColumn: {
    width: 120,
    borderRightWidth: 1,
    borderRightColor: Theme.colors.border,
  },
  diaHeaderCell: {
    height: 56,
    borderBottomWidth: 2,
    borderBottomColor: Theme.colors.borderDark,
    paddingVertical: Theme.spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Theme.colors.surface,
  },
  diaHeaderCellHoy: {
    backgroundColor: Theme.colors.primary,
  },
  diaHeaderDia: {
    fontSize: Theme.fontSizes.xs,
    fontWeight: Theme.fontWeights.medium,
    color: Theme.colors.placeholder,
  },
  diaHeaderNumero: {
    fontSize: Theme.fontSizes.md,
    fontWeight: Theme.fontWeights.bold,
    color: Theme.colors.text,
  },
  diaHeaderTextHoy: {
    color: Theme.colors.textInverse,
  },
  horarioCell: {
    height: 72,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
    padding: Theme.spacing.xs,
  },
  citasHoraContainer: {
    gap: Theme.spacing.xs,
  },
  citaCardSemana: {
    padding: Theme.spacing.sm - 2,
    borderRadius: Theme.borderRadius.sm,
    borderLeftWidth: 4,
    borderLeftColor: 'rgba(0,0,0,0.2)',
  },
  citaHoraSemana: {
    color: Theme.colors.textInverse,
    fontSize: 10,
    fontWeight: Theme.fontWeights.bold,
  },
  citaNombreSemana: {
    color: Theme.colors.textInverse,
    fontSize: 9,
  },
  citaConsultorioSemana: {
    color: Theme.colors.textInverse,
    fontSize: 8,
    opacity: 0.9,
  },
  diaContainer: {
    flex: 1,
  },
  horaDiaRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
    minHeight: 72,
  },
  horaDiaLabelContainer: {
    width: 80,
    paddingVertical: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.md,
    backgroundColor: Theme.colors.surfaceLight,
    borderRightWidth: 2,
    borderRightColor: Theme.colors.borderDark,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Theme.spacing.xs,
  },
  horaDiaLabel: {
    fontSize: Theme.fontSizes.xs,
    fontWeight: Theme.fontWeights.semibold,
    color: Theme.colors.text,
  },
  horaDiaContent: {
    flex: 1,
    padding: Theme.spacing.sm,
    position: 'relative',
  },
  citasDiaContainer: {
    gap: Theme.spacing.xs,
  },
  citaCardDia: {
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.md,
    borderLeftWidth: 4,
    borderLeftColor: 'rgba(0,0,0,0.2)',
  },
  citaDiaInfo: {
    color: Theme.colors.textInverse,
    fontSize: Theme.fontSizes.xs,
    fontWeight: Theme.fontWeights.bold,
  },
  citaDiaDetalle: {
    color: Theme.colors.textInverse,
    fontSize: 10,
    opacity: 0.9,
    marginTop: Theme.spacing.xs,
  },
  lineaTiempo: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 20,
  },
  lineaTiempoPunto: {
    width: 12,
    height: 12,
    backgroundColor: Theme.colors.error,
    borderRadius: Theme.borderRadius.sm + 2,
    ...Theme.shadows.md,
  },
  lineaTiempoLinea: {
    flex: 1,
    height: 4,
    backgroundColor: Theme.colors.error,
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
});

export default VistaDetallada;