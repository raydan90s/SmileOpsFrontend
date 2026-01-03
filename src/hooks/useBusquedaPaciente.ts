import { useCallback, useState } from 'react';
import type { PacienteForm } from '@models/Busqueda/PacienteForm.types';
import type { BusquedaPacienteState, IconoTipoInfo } from '@models/Busqueda/BusquedaPaciente.types';
import {
  buscarPacientePorCodigo,
  buscarPacientePorCedula,
  buscarPacientePorNombre
} from '@services/Pacientes/Pacientes.service';
import {
  detectarTipoBusqueda,
  validarTerminoBusqueda,
  obtenerMensajeError
} from '@utils/validacionBusqueda';

interface UseBusquedaPacienteProps {
  onPacienteSeleccionado?: (paciente: PacienteForm) => void;
}

export const useBusquedaPaciente = ({
  onPacienteSeleccionado
}: UseBusquedaPacienteProps) => {
  const [state, setState] = useState<BusquedaPacienteState>({
    terminoBusqueda: '',
    pacienteEncontrado: null,
    buscando: false,
    error: '',
    tipoBusqueda: ''
  });

  const handleChange = (valor: string) => {
    setState(prev => ({
      ...prev,
      terminoBusqueda: valor,
      error: '',
      tipoBusqueda: valor.trim() ? detectarTipoBusqueda(valor) : '',
      pacienteEncontrado: null
    }));
  };

  const handleBuscar = async () => {
    const valorLimpio = state.terminoBusqueda.trim();
    const validacion = validarTerminoBusqueda(valorLimpio);
    if (!validacion.valido) {
      setState(prev => ({
        ...prev,
        error: validacion.error || ''
      }));
      return;
    }

    setState(prev => ({
      ...prev,
      buscando: true,
      error: '',
      pacienteEncontrado: null
    }));

    const tipo = detectarTipoBusqueda(valorLimpio);

    try {
      let resultado: PacienteForm | PacienteForm[] | null = null;

      switch (tipo) {
        case 'codigo':
          resultado = await buscarPacientePorCodigo(valorLimpio);
          break;
        case 'cedula':
          resultado = await buscarPacientePorCedula(valorLimpio);
          break;
        case 'nombre':
          const pacientes = await buscarPacientePorNombre(valorLimpio);
          resultado = pacientes || null;
          break;
        default:
          setState(prev => ({
            ...prev,
            error: 'No se pudo determinar el tipo de búsqueda',
            buscando: false
          }));
          return;
      }

      if (resultado) {
        setState(prev => ({
          ...prev,
          pacienteEncontrado: resultado,
          buscando: false,
          error: '',
          tipoBusqueda: tipo,
          terminoBusqueda: '', // ← LIMPIAR AQUÍ
        }));

        // ✅ SOLO llamar si es un paciente único (no array)
        if (!Array.isArray(resultado)) {
          onPacienteSeleccionado?.(resultado);
        }
      } else {
        setState(prev => ({
          ...prev,
          error: obtenerMensajeError(tipo),
          buscando: false
        }));
      }
    } catch (err) {
      setState(prev => ({
        ...prev,
        error: 'Error al realizar la búsqueda. Intente nuevamente.',
        buscando: false
      }));
      console.error('Error en búsqueda:', err);
    }
  };

  const handleSeleccionarPaciente = async (paciente: PacienteForm) => {
    try {
      let pacienteCompleto: PacienteForm | null = null;

      // Si viene de una lista, buscar el paciente completo
      if (Array.isArray(state.pacienteEncontrado)) {
        pacienteCompleto = await buscarPacientePorCodigo(paciente.codigo);
      } else {
        pacienteCompleto = paciente;
      }

      if (pacienteCompleto) {
        setState(prev => ({
          ...prev,
          pacienteEncontrado: pacienteCompleto,
          terminoBusqueda: '', // ← LIMPIAR TAMBIÉN AQUÍ
        }));

        // ✅ Llamar al callback con el paciente completo
        onPacienteSeleccionado?.(pacienteCompleto);
      }
    } catch (err) {
      console.error('Error al cargar paciente completo:', err);
      setState(prev => ({
        ...prev,
        error: 'Error al cargar los datos completos del paciente'
      }));
    }
  };

  const handleSubmit = () => {
    handleBuscar();
  };

  const getTipoInfo = (): IconoTipoInfo | null => {
    switch (state.tipoBusqueda) {
      case 'codigo':
        return {
          icon: null,
          texto: 'Código',
          color: '#3b82f6'
        };
      case 'cedula':
        return {
          icon: null,
          texto: 'Cédula',
          color: '#6366f1'
        };
      case 'nombre':
        return {
          icon: null,
          texto: 'Nombre',
          color: '#a855f7'
        };
      default:
        return null;
    }
  };

  const resetearBusqueda = useCallback(() => {
    setState({
      terminoBusqueda: '',
      pacienteEncontrado: null,
      buscando: false,
      error: '',
      tipoBusqueda: ''
    });
  }, []); 

  return {
    state,
    handleChange,
    handleBuscar,
    handleSubmit,
    getTipoInfo,
    handleSeleccionarPaciente,
    resetearBusqueda
  };
};