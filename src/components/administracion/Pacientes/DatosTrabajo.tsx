import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import FormField from '@components/shared/FormField';
import SelectUbicacion from '@components/shared/SelectUbicacion';
import { Colors, Spacing, BorderRadius, FontSizes } from '@constants/theme';

import type { FormularioPacienteData } from '@models/Pacientes/Pacientes.types';
import type { Pais } from '@models/Paises/Paises.types';
import type { Provincia } from '@models/Ubicacion/Provincia.types';
import type { Ciudad } from '@models/Ubicacion/Ciudad.types';

interface DatosTrabajoProps {
  formData: FormularioPacienteData;
  onChange: (field: keyof FormularioPacienteData, value: string) => void;
  paises: Pais[];
  provincias: Provincia[];
  ciudades: Ciudad[];
  cargandoPaises: boolean;
  cargandoProvincias: boolean;
  cargandoCiudades: boolean;
}

const DatosTrabajo: React.FC<DatosTrabajoProps> = ({
  formData,
  onChange,
  paises,
  provincias,
  ciudades,
  cargandoPaises,
  cargandoProvincias,
  cargandoCiudades
}) => {
  return (
    <View style={styles.container}>
      
      <View style={styles.fullWidthSpacing}>
        <FormField label="Empresa" colSpan="full">
          <TextInput
            value={formData.empresa}
            onChangeText={(text) => onChange('empresa', text)}
            placeholder="Nombre empresa"
            placeholderTextColor={Colors.textLight}
            style={styles.input}
          />
        </FormField>
      </View>

      <View style={styles.fullWidthSpacing}>
        <FormField label="Ocupación" colSpan="full">
          <TextInput
            value={formData.ocupacion}
            onChangeText={(text) => onChange('ocupacion', text)}
            placeholder="Cargo/Profesión"
            placeholderTextColor={Colors.textLight}
            style={styles.input}
          />
        </FormField>
      </View>

      <View style={styles.fullWidthSpacing}>
        <FormField label="Dirección de Trabajo" colSpan="full">
          <TextInput
            value={formData.direccionTrabajo}
            onChangeText={(text) => onChange('direccionTrabajo', text)}
            placeholder="Dirección del lugar de trabajo"
            placeholderTextColor={Colors.textLight}
            style={styles.input}
          />
        </FormField>
      </View>

      <View style={styles.row}>
        <View style={styles.halfWidth}>
          <SelectUbicacion
            label="País"
            tipo="pais"
            value={formData.idPaisTrabajo}
            onChange={(val) => onChange('idPaisTrabajo', val)}
            opciones={paises}
            cargando={cargandoPaises}
          />
        </View>

        <View style={styles.halfWidth}>
          <SelectUbicacion
            label="Provincia"
            tipo="provincia"
            value={formData.idProvinciaTrabajo}
            onChange={(val) => onChange('idProvinciaTrabajo', val)}
            opciones={provincias}
            cargando={cargandoProvincias}
            deshabilitado={!formData.idPaisTrabajo}
            mensajeDeshabilitado="Seleccione país"
          />
        </View>
      </View>

      <View style={styles.fullWidthSpacing}>
        <SelectUbicacion
          label="Ciudad"
          tipo="ciudad"
          value={formData.idCiudadTrabajo}
          onChange={(val) => onChange('idCiudadTrabajo', val)}
          opciones={ciudades}
          cargando={cargandoCiudades}
          deshabilitado={!formData.idProvinciaTrabajo}
          mensajeDeshabilitado="Seleccione prov."
        />
      </View>

      <View style={styles.fullWidthSpacing}>
        <FormField label="Telf. Trabajo" colSpan="full">
          <TextInput
            value={formData.telefonoTrabajo}
            onChangeText={(text) => onChange('telefonoTrabajo', text)}
            placeholder="023456789"
            keyboardType="phone-pad"
            maxLength={15}
            placeholderTextColor={Colors.textLight}
            style={styles.input}
          />
        </FormField>
      </View>

      <View style={styles.fullWidthSpacing}>
        <FormField label="Email" colSpan="full">
          <TextInput
            value={formData.email}
            onChangeText={(text) => onChange('email', text)}
            placeholder="correo@ejemplo.com"
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor={Colors.textLight}
            style={styles.input}
          />
        </FormField>
      </View>

      <View style={styles.fullWidthSpacing}>
        <FormField label="Recomendado Por" colSpan="full">
          <TextInput
            value={formData.recomendadoPor}
            onChangeText={(text) => onChange('recomendadoPor', text)}
            placeholder="Nombre completo"
            placeholderTextColor={Colors.textLight}
            style={styles.input}
          />
        </FormField>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  halfWidth: {
    width: '48%',
  },
  fullWidthSpacing: {
    marginBottom: Spacing.md,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    fontSize: FontSizes.sm,
    color: Colors.text,
    backgroundColor: '#FFFFFF',
  },
});

export default DatosTrabajo;