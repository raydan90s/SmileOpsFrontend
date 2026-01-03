import React, { useEffect, useState, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    TextInput,
    Modal,
    FlatList,
    Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Calendario from '@components/odontologia/citas-medicas/Calendario';
import FiltrosCalendario from '@components/odontologia/citas-medicas/FiltrosCalendario';
import ModalExito from '@components/shared/ModalExito';
import ModalError from '@components/shared/ModalError';
import BusquedaPaciente from '@components/Busqueda/ConsultaPaciente';
import type { Cita, EstadoCita } from '@models/Citas/Citas.types';
import type { PacienteForm } from '@models/Busqueda/PacienteForm.types';
import { useDoctorContext } from '@context/DoctorContext';
import { useConsultorios } from '@context/ConsultoriosContext';
import { useAuth } from '@context/AuthContext';
import Theme from '@constants/theme';
import {
    crearCita,
    actualizarEstadoCita,
    eliminarCita,
    obtenerCitas,
} from '@services/Citas/Citas.service';
import type { NuevaCita } from '@models/Citas/Citas.types';
import BackButton from '@components/shared/BackButton';
import { ChevronDown, Check } from 'lucide-react-native';

const CitasPage = () => {
    const [mesActual, setMesActual] = useState(new Date());
    const [diaSeleccionado, setDiaSeleccionado] = useState<number | null>(null);
    const [citas, setCitas] = useState<Cita[]>([]);
    const [mostrarModalExito, setMostrarModalExito] = useState(false);
    const [mostrarModalError, setMostrarModalError] = useState(false);
    const [mensajeError, setMensajeError] = useState('');
    const [mensajeExito, setMensajeExito] = useState('');
    const [resetearBusqueda, setResetearBusqueda] = useState(false);
    const [guardandoCita, setGuardandoCita] = useState(false);
    const [cargandoCitas, setCargandoCitas] = useState(true);
    const [filtroDoctor, setFiltroDoctor] = useState<string>('');
    const [filtroConsultorio, setFiltroConsultorio] = useState<string>('');
    const [showDoctorModal, setShowDoctorModal] = useState(false);
    const [showConsultorioModal, setShowConsultorioModal] = useState(false);
    const [showTratamientoModal, setShowTratamientoModal] = useState(false);
    const [showTiempoModal, setShowTiempoModal] = useState(false);

    const [formData, setFormData] = useState({
        codigo: '',
        cedula: '',
        nombre: '',
        consultorio: '',
        tratamiento: 'Diagnostico',
        horaCita: '',
        tiempoEstimado: '15 Minutos',
    });

    const { doctores, loading: loadingDoctores } = useDoctorContext();
    const { consultorios, loading: loadingConsultorios } = useConsultorios();
    const { usuario } = useAuth();
    const [doctorSeleccionado, setDoctorSeleccionado] = useState<string>('');
    const [showHoraModal, setShowHoraModal] = useState(false);

    const ESPECIALIDAD_MAP: { [key: string]: number } = {
        Diagnostico: 1,
        Operatoria: 2,
        'Estetica Dental': 3,
        Cirugía: 4,
        Periodoncia: 5,
        Ortodoncia: 6,
        Endodoncia: 7,
        'Prótesis Removibles': 8,
        'Prótesis Fija': 9,
        Implantes: 10,
        Ventas: 11,
        'Esp. Independientes': 12,
    };

    const TRATAMIENTOS = [
        'Diagnostico',
        'Operatoria',
        'Estetica Dental',
        'Cirugía',
        'Periodoncia',
        'Ortodoncia',
        'Endodoncia',
        'Prótesis Removibles',
        'Prótesis Fija',
        'Implantes',
        'Ventas',
        'Esp. Independientes',
    ];

    const TIEMPOS = ['15 Minutos', '30 Minutos', '60 Minutos', '120 Minutos'];

    const generarHoras = () => {
        const horas = [];
        for (let h = 7; h <= 20; h++) {
            for (let m = 0; m < 60; m += 15) {
                const hora = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
                horas.push(hora);
            }
        }
        return horas;
    };

    const HORAS_DISPONIBLES = generarHoras();

    const ESPECIALIDAD_REVERSE_MAP: { [key: number]: string } = {
        1: 'Diagnostico',
        2: 'Operatoria',
        3: 'Estetica Dental',
        4: 'Cirugía',
        5: 'Periodoncia',
        6: 'Ortodoncia',
        7: 'Endodoncia',
        8: 'Prótesis Removibles',
        9: 'Prótesis Fija',
        10: 'Implantes',
        11: 'Ventas',
        12: 'Esp. Independientes',
    };

    const TIEMPO_MAP: { [key: string]: number } = {
        '15 Minutos': 15,
        '30 Minutos': 30,
        '60 Minutos': 60,
        '120 Minutos': 120,
    };

    const TIEMPO_REVERSE_MAP: { [key: number]: string } = {
        15: '15 Minutos',
        30: '30 Minutos',
        60: '60 Minutos',
        120: '120 Minutos',
    };

    const ESTADO_MAP: { [key in EstadoCita]: 'P' | 'A' | 'C' } = {
        pendiente: 'P',
        atendida: 'A',
        cancelada: 'C',
    };

    const ESTADO_REVERSE_MAP: { [key: string]: EstadoCita } = {
        P: 'pendiente',
        A: 'atendida',
        C: 'cancelada',
    };

    useEffect(() => {
        const cargarCitasDesdeDB = async () => {
            try {
                setCargandoCitas(true);
                const citasDB = await obtenerCitas();
                const citasFormateadas: Cita[] = citasDB.map((citaDB: any) => {
                    const fecha = new Date(citaDB.dfechacita);
                    const doctorNombre =
                        doctores.find((d) => d.iiddoctor === citaDB.iiddoctor)?.nombreCompleto ||
                        'Sin doctor';
                    const consultorioNombre =
                        consultorios.find((c) => c.iidconsultorio === citaDB.iidconsultorio)
                            ?.vnombre || 'Sin consultorio';

                    const citaFormateada = {
                        id: citaDB.iidcita?.toString() || '',
                        codigo: citaDB.iidpaciente?.toString() || '',
                        cedula: citaDB.paciente_cedula || '',
                        nombre: citaDB.paciente_nombre || 'Sin nombre',
                        consultorio: consultorioNombre,
                        tratamiento:
                            ESPECIALIDAD_REVERSE_MAP[citaDB.iidespecialidad] || 'Diagnostico',
                        horaCita: citaDB.choracita || '00:00',
                        tiempoEstimado: TIEMPO_REVERSE_MAP[citaDB.itiempo] || '15 Minutos',
                        dia: fecha.getDate(),
                        mes: fecha.getMonth(),
                        año: fecha.getFullYear(),
                        doctor: doctorNombre,
                        estado: ESTADO_REVERSE_MAP[citaDB.cestado] || 'pendiente',
                    };
                    return citaFormateada;
                });
                setCitas(citasFormateadas);
            } catch (error) {
                setMensajeError('Error al cargar las citas desde la base de datos');
                setMostrarModalError(true);
            } finally {
                setCargandoCitas(false);
            }
        };

        if (doctores.length > 0 && consultorios.length > 0) {
            cargarCitasDesdeDB();
        }
    }, [doctores, consultorios]);

    useEffect(() => {
        if (consultorios.length > 0 && !formData.consultorio) {
            const primerConsultorioActivo = consultorios.find((c) => c.bactivo);
            if (primerConsultorioActivo) {
                setFormData((prev) => ({
                    ...prev,
                    consultorio: primerConsultorioActivo.iidconsultorio.toString(),
                }));
            }
        }
    }, [consultorios]);

    const citasFiltradas = useMemo(() => {
        let citasResultado = [...citas];

        if (filtroDoctor) {
            const doctorNombre = doctores.find(
                (d) => d.iiddoctor.toString() === filtroDoctor
            )?.nombreCompleto;
            citasResultado = citasResultado.filter(
                (cita) => cita.doctor === doctorNombre
            );
        }

        if (filtroConsultorio) {
            const consultorioNombre = consultorios.find(
                (c) => c.iidconsultorio.toString() === filtroConsultorio
            )?.vnombre;
            citasResultado = citasResultado.filter(
                (cita) => cita.consultorio === consultorioNombre
            );
        }

        return citasResultado;
    }, [citas, filtroDoctor, filtroConsultorio, doctores, consultorios]);

    const cambiarMes = (direccion: number) => {
        const nuevoMes = new Date(mesActual);
        nuevoMes.setMonth(mesActual.getMonth() + direccion);
        setMesActual(nuevoMes);
    };

    const handleInputChange = (name: string, value: string) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handlePacienteSeleccionado = (paciente: PacienteForm) => {
        setFormData((prev) => ({
            ...prev,
            codigo: paciente.codigo,
            cedula: paciente.cedula,
            nombre: paciente.nombre,
        }));
    };

    const agendarCita = async () => {
        try {
            if (!formData.codigo || !formData.cedula || !formData.nombre) {
                setMensajeError('Por favor complete todos los datos del paciente');
                setMostrarModalError(true);
                return;
            }

            if (!doctorSeleccionado) {
                setMensajeError('Por favor seleccione un doctor antes de agendar la cita');
                setMostrarModalError(true);
                return;
            }

            if (!diaSeleccionado) {
                setMensajeError('Por favor seleccione un día en el calendario');
                setMostrarModalError(true);
                return;
            }

            if (!formData.horaCita) {
                setMensajeError('Por favor ingrese la hora de la cita');
                setMostrarModalError(true);
                return;
            }

            if (!formData.consultorio) {
                setMensajeError('Por favor seleccione un consultorio');
                setMostrarModalError(true);
                return;
            }

            setGuardandoCita(true);

            const fechaCita = new Date(
                mesActual.getFullYear(),
                mesActual.getMonth(),
                diaSeleccionado
            );
            const fechaISO = fechaCita.toISOString().split('T')[0] + 'T00:00:00';

            const nuevaCitaAPI: NuevaCita = {
                iIdPaciente: parseInt(formData.codigo),
                iIdDoctor: parseInt(doctorSeleccionado),
                iIdConsultorio: parseInt(formData.consultorio),
                iIdEspecialidad: ESPECIALIDAD_MAP[formData.tratamiento] || 1,
                dFechaCita: fechaISO,
                cHoraCita: formData.horaCita,
                iTiempo: TIEMPO_MAP[formData.tiempoEstimado] || 15,
                cEstado: 'P',
                vUsuarioIng: usuario?.vUsuario || 'SISTEMA',
            };

            const citaCreada = await crearCita(nuevaCitaAPI);
            const doctorNombre =
                doctores.find((d) => d.iiddoctor.toString() === doctorSeleccionado)
                    ?.nombreCompleto || 'Sin doctor';
            const consultorioNombre =
                consultorios.find(
                    (c) => c.iidconsultorio.toString() === formData.consultorio
                )?.vnombre || 'Sin consultorio';

            const nuevaCitaLocal: Cita = {
                id: citaCreada.iidcita?.toString() || Date.now().toString(),
                codigo: formData.codigo,
                cedula: formData.cedula,
                nombre: formData.nombre,
                consultorio: consultorioNombre,
                tratamiento: formData.tratamiento,
                horaCita: formData.horaCita,
                tiempoEstimado: formData.tiempoEstimado,
                dia: diaSeleccionado,
                mes: mesActual.getMonth(),
                año: mesActual.getFullYear(),
                doctor: doctorNombre,
                estado: 'pendiente',
            };

            setCitas((prev) => [...prev, nuevaCitaLocal]);

            const primerConsultorioActivo = consultorios.find((c) => c.bactivo);
            setFormData({
                codigo: '',
                cedula: '',
                nombre: '',
                consultorio: primerConsultorioActivo?.iidconsultorio.toString() || '',
                tratamiento: 'Diagnostico',
                horaCita: '',
                tiempoEstimado: '15 Minutos',
            });

            setDoctorSeleccionado('');
            setResetearBusqueda(true);
            setTimeout(() => setResetearBusqueda(false), 100);

            setMensajeExito('La cita ha sido agendada correctamente');
            setMostrarModalExito(true);
        } catch (error) {
            setMensajeError(
                error instanceof Error
                    ? error.message
                    : 'Ocurrió un error al agendar la cita. Por favor intente nuevamente.'
            );
            setMostrarModalError(true);
        } finally {
            setGuardandoCita(false);
        }
    };

    const cambiarEstadoCita = async (citaId: string, nuevoEstado: EstadoCita) => {
        try {
            if (!usuario?.vUsuario) {
                setMensajeError('No se pudo identificar el usuario');
                setMostrarModalError(true);
                return;
            }

            const estadoAPI = ESTADO_MAP[nuevoEstado];
            await actualizarEstadoCita(citaId, estadoAPI, usuario.vUsuario);

            setCitas((prev) =>
                prev.map((cita) =>
                    cita.id === citaId ? { ...cita, estado: nuevoEstado } : cita
                )
            );

            setMensajeExito('Estado de la cita actualizado correctamente');
            setMostrarModalExito(true);
        } catch (error) {
            setMensajeError(
                error instanceof Error
                    ? error.message
                    : 'Error al actualizar el estado de la cita'
            );
            setMostrarModalError(true);
        }
    };

    const eliminarCitaHandler = async (citaId: string) => {
        try {
            await eliminarCita(citaId);
            setCitas((prev) => prev.filter((cita) => cita.id !== citaId));

            setMensajeExito('Cita eliminada correctamente');
            setMostrarModalExito(true);
        } catch (error) {
            setMensajeError(
                error instanceof Error ? error.message : 'Error al eliminar la cita'
            );
            setMostrarModalError(true);
        }
    };

    const limpiarFiltros = () => {
        setFiltroDoctor('');
        setFiltroConsultorio('');
    };

    if (loadingDoctores || loadingConsultorios || cargandoCitas) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#3B82F6" />
                <Text style={styles.loadingText}>Cargando datos...</Text>
            </View>
        );
    }

    const consultoriosActivos = consultorios.filter((c) => c.bactivo);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <BackButton />
            </View>

            <ScrollView style={styles.scrollContainer}>
                <View style={styles.content}>
                    <View style={styles.card}>
                        <Text style={styles.title}>Gestión de Citas Médicas</Text>

                        <View style={styles.mainGrid}>
                            <View style={styles.calendarioSection}>
                                <FiltrosCalendario
                                    doctores={doctores}
                                    consultorios={consultoriosActivos}
                                    doctorSeleccionado={filtroDoctor}
                                    consultorioSeleccionado={filtroConsultorio}
                                    onDoctorChange={setFiltroDoctor}
                                    onConsultorioChange={setFiltroConsultorio}
                                    onLimpiarFiltros={limpiarFiltros}
                                />

                                <Calendario
                                    citas={citasFiltradas}
                                    onDiaSeleccionado={setDiaSeleccionado}
                                    mesActual={mesActual}
                                    onCambiarMes={cambiarMes}
                                    diaSeleccionado={diaSeleccionado}
                                    onCambiarEstadoCita={cambiarEstadoCita}
                                    onEliminarCita={eliminarCitaHandler}
                                />
                            </View>

                            <View style={styles.formSection}>
                                <View style={styles.formCard}>
                                    <View style={styles.formGroup}>
                                        <Text style={styles.label}>Seleccionar Doctor</Text>
                                        <TouchableOpacity
                                            style={styles.selectButton}
                                            onPress={() => setShowDoctorModal(true)}
                                            disabled={guardandoCita}
                                            activeOpacity={0.7}
                                        >
                                            <Text style={[
                                                styles.selectButtonText,
                                                !doctorSeleccionado && styles.selectButtonPlaceholder
                                            ]}>
                                                {doctorSeleccionado
                                                    ? doctores.find(d => d.iiddoctor.toString() === doctorSeleccionado)?.nombreCompleto
                                                    : 'Seleccione Un Doctor'}
                                            </Text>
                                            <ChevronDown size={20} color={Theme.colors.placeholder} />
                                        </TouchableOpacity>
                                    </View>

                                    <Modal
                                        visible={showDoctorModal}
                                        transparent
                                        animationType="fade"
                                        onRequestClose={() => setShowDoctorModal(false)}
                                    >
                                        <Pressable style={styles.modalOverlay} onPress={() => setShowDoctorModal(false)}>
                                            <Pressable onPress={(e) => e.stopPropagation()}>
                                                <View style={styles.modalContent}>
                                                    <View style={styles.modalHeader}>
                                                        <Text style={styles.modalTitle}>Seleccionar Doctor</Text>
                                                    </View>
                                                    <FlatList
                                                        data={doctores}
                                                        keyExtractor={(item) => item.iiddoctor.toString()}
                                                        renderItem={({ item }) => (
                                                            <TouchableOpacity
                                                                style={styles.modalItem}
                                                                onPress={() => {
                                                                    setDoctorSeleccionado(item.iiddoctor.toString());
                                                                    setShowDoctorModal(false);
                                                                }}
                                                                activeOpacity={0.7}
                                                            >
                                                                <Text style={styles.modalItemText}>
                                                                    {item.nombreCompleto} ({item.iiddoctor})
                                                                </Text>
                                                                {doctorSeleccionado === item.iiddoctor.toString() && (
                                                                    <Check size={20} color={Theme.colors.primary} />
                                                                )}
                                                            </TouchableOpacity>
                                                        )}
                                                        ItemSeparatorComponent={() => <View style={styles.separator} />}
                                                        style={styles.modalList}
                                                    />
                                                    <TouchableOpacity
                                                        style={styles.modalCloseButton}
                                                        onPress={() => setShowDoctorModal(false)}
                                                        activeOpacity={0.8}
                                                    >
                                                        <Text style={styles.modalCloseButtonText}>Cerrar</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </Pressable>
                                        </Pressable>
                                    </Modal>

                                    <View style={styles.formGroup}>
                                        <Text style={styles.sectionTitle}>Datos del Paciente</Text>
                                        <BusquedaPaciente
                                            onPacienteSeleccionado={handlePacienteSeleccionado}
                                            mostrarMensajeAyuda={false}
                                            mostrarBotonHistorial={false}
                                            resetear={resetearBusqueda}
                                        />
                                    </View>

                                    <View style={styles.divider} />

                                    <View style={styles.formGroup}>
                                        <Text style={styles.label}>Consultorio:</Text>
                                        <TouchableOpacity
                                            style={styles.selectButton}
                                            onPress={() => setShowConsultorioModal(true)}
                                            disabled={guardandoCita || loadingConsultorios}
                                            activeOpacity={0.7}
                                        >
                                            <Text style={[
                                                styles.selectButtonText,
                                                !formData.consultorio && styles.selectButtonPlaceholder
                                            ]}>
                                                {formData.consultorio
                                                    ? consultoriosActivos.find(c => c.iidconsultorio.toString() === formData.consultorio)?.vnombre
                                                    : 'Seleccione consultorio'}
                                            </Text>
                                            <ChevronDown size={20} color={Theme.colors.placeholder} />
                                        </TouchableOpacity>
                                    </View>

                                    <Modal
                                        visible={showConsultorioModal}
                                        transparent
                                        animationType="fade"
                                        onRequestClose={() => setShowConsultorioModal(false)}
                                    >
                                        <Pressable style={styles.modalOverlay} onPress={() => setShowConsultorioModal(false)}>
                                            <Pressable onPress={(e) => e.stopPropagation()}>
                                                <View style={styles.modalContent}>
                                                    <View style={styles.modalHeader}>
                                                        <Text style={styles.modalTitle}>Seleccionar Consultorio</Text>
                                                    </View>
                                                    <FlatList
                                                        data={consultoriosActivos}
                                                        keyExtractor={(item) => item.iidconsultorio.toString()}
                                                        renderItem={({ item }) => (
                                                            <TouchableOpacity
                                                                style={styles.modalItem}
                                                                onPress={() => {
                                                                    handleInputChange('consultorio', item.iidconsultorio.toString());
                                                                    setShowConsultorioModal(false);
                                                                }}
                                                                activeOpacity={0.7}
                                                            >
                                                                <Text style={styles.modalItemText}>{item.vnombre}</Text>
                                                                {formData.consultorio === item.iidconsultorio.toString() && (
                                                                    <Check size={20} color={Theme.colors.primary} />
                                                                )}
                                                            </TouchableOpacity>
                                                        )}
                                                        ItemSeparatorComponent={() => <View style={styles.separator} />}
                                                        style={styles.modalList}
                                                    />
                                                    <TouchableOpacity
                                                        style={styles.modalCloseButton}
                                                        onPress={() => setShowConsultorioModal(false)}
                                                        activeOpacity={0.8}
                                                    >
                                                        <Text style={styles.modalCloseButtonText}>Cerrar</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </Pressable>
                                        </Pressable>
                                    </Modal>

                                    <View style={styles.formGroup}>
                                        <Text style={styles.label}>Tratamiento de:</Text>
                                        <TouchableOpacity
                                            style={styles.selectButton}
                                            onPress={() => setShowTratamientoModal(true)}
                                            disabled={guardandoCita}
                                            activeOpacity={0.7}
                                        >
                                            <Text style={styles.selectButtonText}>{formData.tratamiento}</Text>
                                            <ChevronDown size={20} color={Theme.colors.placeholder} />
                                        </TouchableOpacity>
                                    </View>

                                    <Modal
                                        visible={showTratamientoModal}
                                        transparent
                                        animationType="fade"
                                        onRequestClose={() => setShowTratamientoModal(false)}
                                    >
                                        <Pressable style={styles.modalOverlay} onPress={() => setShowTratamientoModal(false)}>
                                            <Pressable onPress={(e) => e.stopPropagation()}>
                                                <View style={styles.modalContent}>
                                                    <View style={styles.modalHeader}>
                                                        <Text style={styles.modalTitle}>Seleccionar Tratamiento</Text>
                                                    </View>
                                                    <FlatList
                                                        data={TRATAMIENTOS}
                                                        keyExtractor={(item) => item}
                                                        renderItem={({ item }) => (
                                                            <TouchableOpacity
                                                                style={styles.modalItem}
                                                                onPress={() => {
                                                                    handleInputChange('tratamiento', item);
                                                                    setShowTratamientoModal(false);
                                                                }}
                                                                activeOpacity={0.7}
                                                            >
                                                                <Text style={styles.modalItemText}>{item}</Text>
                                                                {formData.tratamiento === item && (
                                                                    <Check size={20} color={Theme.colors.primary} />
                                                                )}
                                                            </TouchableOpacity>
                                                        )}
                                                        ItemSeparatorComponent={() => <View style={styles.separator} />}
                                                        style={styles.modalList}
                                                    />
                                                    <TouchableOpacity
                                                        style={styles.modalCloseButton}
                                                        onPress={() => setShowTratamientoModal(false)}
                                                        activeOpacity={0.8}
                                                    >
                                                        <Text style={styles.modalCloseButtonText}>Cerrar</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </Pressable>
                                        </Pressable>
                                    </Modal>

                                    <View style={styles.row}>
                                        <View style={styles.halfWidth}>
                                            <Text style={styles.label}>Hora de la cita</Text>
                                            <TouchableOpacity
                                                style={styles.selectButton}
                                                onPress={() => setShowHoraModal(true)}
                                                disabled={guardandoCita}
                                                activeOpacity={0.7}
                                            >
                                                <Text style={[
                                                    styles.selectButtonText,
                                                    !formData.horaCita && styles.selectButtonPlaceholder
                                                ]}>
                                                    {formData.horaCita || 'Seleccionar hora'}
                                                </Text>
                                                <ChevronDown size={20} color={Theme.colors.placeholder} />
                                            </TouchableOpacity>
                                        </View>

                                        <Modal
                                            visible={showHoraModal}
                                            transparent
                                            animationType="fade"
                                            onRequestClose={() => setShowHoraModal(false)}
                                        >
                                            <Pressable style={styles.modalOverlay} onPress={() => setShowHoraModal(false)}>
                                                <Pressable onPress={(e) => e.stopPropagation()}>
                                                    <View style={styles.modalContent}>
                                                        <View style={styles.modalHeader}>
                                                            <Text style={styles.modalTitle}>Seleccionar Hora</Text>
                                                        </View>
                                                        <FlatList
                                                            data={HORAS_DISPONIBLES}
                                                            keyExtractor={(item) => item}
                                                            renderItem={({ item }) => (
                                                                <TouchableOpacity
                                                                    style={styles.modalItem}
                                                                    onPress={() => {
                                                                        handleInputChange('horaCita', item);
                                                                        setShowHoraModal(false);
                                                                    }}
                                                                    activeOpacity={0.7}
                                                                >
                                                                    <Text style={styles.modalItemText}>{item}</Text>
                                                                    {formData.horaCita === item && (
                                                                        <Check size={20} color={Theme.colors.primary} />
                                                                    )}
                                                                </TouchableOpacity>
                                                            )}
                                                            ItemSeparatorComponent={() => <View style={styles.separator} />}
                                                            style={styles.modalList}
                                                        />
                                                        <TouchableOpacity
                                                            style={styles.modalCloseButton}
                                                            onPress={() => setShowHoraModal(false)}
                                                            activeOpacity={0.8}
                                                        >
                                                            <Text style={styles.modalCloseButtonText}>Cerrar</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                </Pressable>
                                            </Pressable>
                                        </Modal>

                                        <View style={styles.halfWidth}>
                                            <Text style={styles.label}>Tiempo Estimado:</Text>
                                            <TouchableOpacity
                                                style={styles.selectButton}
                                                onPress={() => setShowTiempoModal(true)}
                                                disabled={guardandoCita}
                                                activeOpacity={0.7}
                                            >
                                                <Text style={styles.selectButtonText}>{formData.tiempoEstimado}</Text>
                                                <ChevronDown size={20} color={Theme.colors.placeholder} />
                                            </TouchableOpacity>
                                        </View>

                                        <Modal
                                            visible={showTiempoModal}
                                            transparent
                                            animationType="fade"
                                            onRequestClose={() => setShowTiempoModal(false)}
                                        >
                                            <Pressable style={styles.modalOverlay} onPress={() => setShowTiempoModal(false)}>
                                                <Pressable onPress={(e) => e.stopPropagation()}>
                                                    <View style={styles.modalContent}>
                                                        <View style={styles.modalHeader}>
                                                            <Text style={styles.modalTitle}>Seleccionar Tiempo</Text>
                                                        </View>
                                                        <FlatList
                                                            data={TIEMPOS}
                                                            keyExtractor={(item) => item}
                                                            renderItem={({ item }) => (
                                                                <TouchableOpacity
                                                                    style={styles.modalItem}
                                                                    onPress={() => {
                                                                        handleInputChange('tiempoEstimado', item);
                                                                        setShowTiempoModal(false);
                                                                    }}
                                                                    activeOpacity={0.7}
                                                                >
                                                                    <Text style={styles.modalItemText}>{item}</Text>
                                                                    {formData.tiempoEstimado === item && (
                                                                        <Check size={20} color={Theme.colors.primary} />
                                                                    )}
                                                                </TouchableOpacity>
                                                            )}
                                                            ItemSeparatorComponent={() => <View style={styles.separator} />}
                                                            style={styles.modalList}
                                                        />
                                                        <TouchableOpacity
                                                            style={styles.modalCloseButton}
                                                            onPress={() => setShowTiempoModal(false)}
                                                            activeOpacity={0.8}
                                                        >
                                                            <Text style={styles.modalCloseButtonText}>Cerrar</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                </Pressable>
                                            </Pressable>
                                        </Modal>
                                    </View>

                                    <TouchableOpacity
                                        onPress={agendarCita}
                                        disabled={guardandoCita || consultoriosActivos.length === 0}
                                        style={[
                                            styles.submitButton,
                                            (guardandoCita || consultoriosActivos.length === 0) &&
                                            styles.submitButtonDisabled,
                                        ]}
                                        activeOpacity={0.8}
                                    >
                                        <Text style={styles.submitButtonText}>
                                            {guardandoCita ? 'Guardando...' : 'Agendar Cita'}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>

            <ModalExito
                isOpen={mostrarModalExito}
                onClose={() => setMostrarModalExito(false)}
                mensaje={mensajeExito}
                titulo="¡Felicitaciones!"
            />

            <ModalError
                isOpen={mostrarModalError}
                onClose={() => setMostrarModalError(false)}
                mensaje={mensajeError}
                titulo="¡Atención!"
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Theme.colors.background,
    },
    header: {
        padding: Theme.spacing.md,
    },
    scrollContainer: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: Theme.spacing.lg,
    },
    loadingText: {
        marginTop: Theme.spacing.md,
        fontSize: Theme.fontSizes.md,
        color: Theme.colors.placeholder,
    },
    content: {
        padding: Theme.spacing.xs,
    },
    card: {
        backgroundColor: Theme.colors.surface,
        borderRadius: Theme.borderRadius.lg,
        padding: Theme.spacing.md,
        ...Theme.shadows.md,
    },
    title: {
        fontSize: Theme.fontSizes.lg,
        fontWeight: Theme.fontWeights.bold,
        color: Theme.colors.text,
        marginBottom: Theme.spacing.md,
    },
    mainGrid: {
        gap: Theme.spacing.md,
    },
    calendarioSection: {
        marginBottom: Theme.spacing.md,
    },
    formSection: {
        marginBottom: Theme.spacing.md,
    },
    formCard: {
        borderWidth: 1,
        borderColor: Theme.colors.border,
        borderRadius: Theme.borderRadius.md,
        overflow: 'hidden',
        backgroundColor: Theme.colors.surface,
    },
    formGroup: {
        padding: Theme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: Theme.colors.border,
    },
    sectionTitle: {
        fontSize: Theme.fontSizes.sm,
        fontWeight: Theme.fontWeights.semibold,
        color: Theme.colors.primary,
        marginBottom: Theme.spacing.sm,
    },
    label: {
        fontSize: Theme.fontSizes.xs,
        fontWeight: Theme.fontWeights.semibold,
        color: Theme.colors.primary,
        marginBottom: Theme.spacing.sm,
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: Theme.colors.borderDark,
        borderRadius: Theme.borderRadius.md,
        overflow: 'hidden',
    },
    input: {
        borderWidth: 1,
        borderColor: Theme.colors.borderDark,
        borderRadius: Theme.borderRadius.md,
        paddingHorizontal: Theme.spacing.sm + 2,
        paddingVertical: Theme.spacing.sm - 2,
        fontSize: Theme.fontSizes.sm,
        color: Theme.colors.text,
    },
    row: {
        flexDirection: 'row',
        gap: Theme.spacing.sm,
        padding: Theme.spacing.md,
    },
    halfWidth: {
        flex: 1,
    },
    divider: {
        height: 1,
        backgroundColor: Theme.colors.border,
    },
    submitButton: {
        backgroundColor: Theme.colors.primary,
        paddingVertical: Theme.spacing.sm + 2,
        borderRadius: Theme.borderRadius.md,
        margin: Theme.spacing.md,
        ...Theme.shadows.sm,
    },
    submitButtonDisabled: {
        backgroundColor: Theme.colors.placeholder,
        opacity: Theme.opacity.disabled,
    },
    submitButtonText: {
        color: Theme.colors.textInverse,
        fontSize: Theme.fontSizes.sm,
        fontWeight: Theme.fontWeights.semibold,
        textAlign: 'center',
    },
    selectButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Theme.colors.surface,
        borderWidth: 1,
        borderColor: Theme.colors.borderDark,
        borderRadius: Theme.borderRadius.md,
        paddingHorizontal: Theme.spacing.md,
        paddingVertical: Theme.spacing.sm,
    },
    selectButtonText: {
        fontSize: Theme.fontSizes.sm,
        color: Theme.colors.text,
        flex: 1,
    },
    selectButtonPlaceholder: {
        color: Theme.colors.placeholder,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: Theme.spacing.md,
    },
    modalContent: {
        backgroundColor: Theme.colors.surface,
        borderRadius: Theme.borderRadius.lg,
        width: '100%',
        maxWidth: 400,
        maxHeight: '70%',
        overflow: 'hidden',
        ...Theme.shadows.xl,
    },
    modalHeader: {
        padding: Theme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: Theme.colors.border,
    },
    modalTitle: {
        fontSize: Theme.fontSizes.md,
        fontWeight: Theme.fontWeights.bold,
        color: Theme.colors.text,
    },
    modalList: {
        maxHeight: 400,
    },
    modalItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: Theme.spacing.md,
    },
    modalItemText: {
        fontSize: Theme.fontSizes.sm,
        color: Theme.colors.text,
        flex: 1,
    },
    separator: {
        height: 1,
        backgroundColor: Theme.colors.border,
    },
    modalCloseButton: {
        backgroundColor: Theme.colors.primary,
        padding: Theme.spacing.md,
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: Theme.colors.border,
    },
    modalCloseButtonText: {
        color: Theme.colors.textInverse,
        fontSize: Theme.fontSizes.sm,
        fontWeight: Theme.fontWeights.semibold,
    },
});

export default CitasPage;