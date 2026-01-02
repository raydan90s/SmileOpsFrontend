import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import FormField from '@components/shared/FormField';
import SelectUbicacion from '@components/shared/SelectUbicacion';
import { Colors, Spacing, BorderRadius, FontSizes } from '@constants/theme';

import type { FormularioPacienteData } from '@models/Pacientes/Pacientes.types';
import type { Pais } from '@models/Paises/Paises.types';
import type { Provincia } from '@models/Ubicacion/Provincia.types';
import type { Ciudad } from '@models/Ubicacion/Ciudad.types';

interface DatosDomicilioProps {
  formData: FormularioPacienteData;
  onChange: (field: keyof FormularioPacienteData, value: string) => void;
  paises: Pais[];
  provincias: Provincia[];
  ciudades: Ciudad[];
  cargandoPaises: boolean;
  cargandoProvincias: boolean;
  cargandoCiudades: boolean;
}

const DatosDomicilio: React.FC<DatosDomicilioProps> = ({
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
      <FormField label="Dirección de Domicilio" required colSpan="full">
        <TextInput
          value={formData.direccionDomicilio}
          onChangeText={(text) => onChange('direccionDomicilio', text)}
          placeholder="Av. Principal y Calle Secundaria"
          placeholderTextColor={Colors.textLight}
          style={styles.input}
        />
      </FormField>

      <View style={styles.row}>
        <View style={styles.halfWidth}>
          <SelectUbicacion
            label="País"
            tipo="pais"
            value={formData.idPais}
            onChange={(val) => onChange('idPais', val)}
            opciones={paises}
            cargando={cargandoPaises}
            required
          />
        </View>

        <View style={styles.halfWidth}>
          <SelectUbicacion
            label="Provincia"
            tipo="provincia"
            value={formData.idProvincia}
            onChange={(val) => onChange('idProvincia', val)}
            opciones={provincias}
            cargando={cargandoProvincias}
            deshabilitado={!formData.idPais}
            mensajeDeshabilitado="Seleccione país"
            required
          />
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.halfWidth}>
          <SelectUbicacion
            label="Ciudad"
            tipo="ciudad"
            value={formData.idCiudad}
            onChange={(val) => onChange('idCiudad', val)}
            opciones={ciudades}
            cargando={cargandoCiudades}
            deshabilitado={!formData.idProvincia}
            mensajeDeshabilitado="Seleccione prov."
            required
          />
        </View>

        <View style={styles.halfWidth}>
          <FormField label="Celular" required colSpan="full">
            <TextInput
              value={formData.celular}
              onChangeText={(text) => onChange('celular', text)}
              placeholder="0987654321"
              keyboardType="phone-pad"
              maxLength={10}
              placeholderTextColor={Colors.textLight}
              style={styles.input}
            />
          </FormField>
        </View>
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

export default DatosDomicilio;