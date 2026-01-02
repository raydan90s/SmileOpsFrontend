import React, { useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Search, Hash, CreditCard, User } from 'lucide-react-native';
import InformacionPaciente from '@components/odontologia/datosPersonales/InformacionPaciente';
import ListaResultados from '@components/odontologia/datosPersonales/ListaResultados';
import type { BusquedaPacienteProps } from '@models/Busqueda/BusquedaPaciente.types';
import { Colors } from '@constants/theme';
import MensajeAyuda from '@components/odontologia/datosPersonales/MensajeAyuda';
import { useBusquedaPaciente } from '@hooks/useBusquedaPaciente';
import Theme from '@constants/theme';

export default function BusquedaPaciente({
  mostrarMensajeAyuda = true,
  mostrarBotonHistorial = true,
  resetear = false,
}: BusquedaPacienteProps) {
  const {
    state,
    handleChange,
    handleBuscar,
    getTipoInfo,
    handleSeleccionarPaciente,
    resetearBusqueda,
  } = useBusquedaPaciente({
  });

  const tipoInfo = getTipoInfo();

  useEffect(() => {
    if (resetear && resetearBusqueda) {
      resetearBusqueda();
    }
  }, [resetear, resetearBusqueda]);

  const renderIconoTipo = () => {
    switch (state.tipoBusqueda) {
      case 'codigo':
        return <Hash size={16} color="#3b82f6" />;
      case 'cedula':
        return <CreditCard size={16} color="#6366f1" />;
      case 'nombre':
        return <User size={16} color="#a855f7" />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {mostrarMensajeAyuda && (
        <MensajeAyuda
          tipo="info"
          mensaje="Búsqueda Inteligente"
          submensaje="Escriba el código (1-7 dígitos), cédula (10 dígitos) o nombre del paciente."
        />
      )}

      {state.error && <MensajeAyuda tipo="error" mensaje={state.error} />}

      <View style={styles.searchContainer}>
        <View style={styles.inputContainer}>
          <Search size={20} color={Colors.textLight} style={styles.searchIcon} />
          <TextInput
            style={styles.input}
            value={state.terminoBusqueda}
            onChangeText={handleChange}
            placeholder="Buscar por código, cédula o nombre..."
            placeholderTextColor={Colors.placeholder}
            editable={!state.buscando}
          />
        </View>

        {tipoInfo && (
          <View style={[styles.infoContainer, { borderLeftColor: tipoInfo.color }]}>
            {renderIconoTipo()}
            <Text style={[styles.infoText, { color: tipoInfo.color }]}>
              {tipoInfo.texto}
            </Text>
          </View>
        )}
      </View>

      {state.pacienteEncontrado && Array.isArray(state.pacienteEncontrado) ? (
        <ListaResultados
          pacientes={state.pacienteEncontrado}
          onSeleccionar={handleSeleccionarPaciente}
        />
      ) : state.pacienteEncontrado ? (
        <InformacionPaciente
          paciente={state.pacienteEncontrado}
          mostrarBotonHistorial={mostrarBotonHistorial}
        />
      ) : null}

      <TouchableOpacity
        style={[
          styles.searchButton,
          (!state.terminoBusqueda.trim() || state.buscando) &&
            styles.searchButtonDisabled,
        ]}
        onPress={handleBuscar}
        disabled={!state.terminoBusqueda.trim() || state.buscando}
        activeOpacity={0.8}
      >
        {state.buscando ? (
          <>
            <ActivityIndicator size="small" color={Colors.textInverse} />
            <Text style={styles.searchButtonText}>Buscando...</Text>
          </>
        ) : (
          <>
            <Search size={20} color={Colors.textInverse} />
            <Text style={styles.searchButtonText}>Buscar Paciente</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Theme.spacing.md,
  },
  searchContainer: {
    gap: Theme.spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.surface,
    borderWidth: 2,
    borderColor: Theme.colors.border,
    borderRadius: Theme.borderRadius.md,
    paddingHorizontal: Theme.spacing.sm,
  },
  searchIcon: {
    marginRight: Theme.spacing.xs,
  },
  input: {
    flex: 1,
    paddingVertical: Theme.spacing.sm,
    fontSize: Theme.fontSizes.md,
    color: Theme.colors.text,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.xs,
    backgroundColor: Theme.colors.backgroundLight,
    padding: Theme.spacing.xs,
    paddingLeft: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.sm,
    borderLeftWidth: 3,
  },
  infoText: {
    fontSize: Theme.fontSizes.xs,
    fontWeight: Theme.fontWeights.semibold,
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Theme.colors.primary,
    paddingVertical: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.md,
    gap: Theme.spacing.xs,
    marginTop: Theme.spacing.sm,
  },
  searchButtonDisabled: {
    backgroundColor: Theme.colors.border,
    opacity: Theme.opacity.disabled,
  },
  searchButtonText: {
    color: Theme.colors.textInverse,
    fontSize: Theme.fontSizes.sm,
    fontWeight: Theme.fontWeights.semibold,
  },
});