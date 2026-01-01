import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Package } from 'lucide-react-native';

import BackButton from '@components/shared/BackButton';
import SuccessModal from '@components/shared/SuccessModal';
import ConsultaRUC from '@components/administracion/proveedores/ConsultaRUC';
import DatosSRI from '@components/administracion/proveedores/DatosSRI';
import InformacionAdicional from '@components/administracion/proveedores/InformacionAdicional';

import { consultaSRI_Direct } from '@services/Administracion/sri.service';
import { createProveedor } from '@services/Administracion/proveedores.service';
import { fetchAllTiposProveedor } from '@services/Administracion/tiposProveedor.service';

import type { SriData } from '@models/administracion/Proveedores/ConsultaProveedor.types';
import type { TipoProveedor } from '@models/administracion/Proveedores/TipoProveedor.types';

import { Colors, Spacing, FontSizes, BorderRadius } from '@constants/theme';

interface Establecimiento {
  tipo: 'Matriz' | 'Sucursal';
  direccion: string;
  numeroEstablecimiento: string;
}

interface FormData {
  vnombre: string;
  vruc: string;
  establecimientos: Establecimiento[];
  vtelefono: string;
  vemail: string;
  itipo_proveedor: number | '';
  bactivo: boolean;
}

export default function CrearProveedor() {
  const router = useRouter();

  const [tiposProveedor, setTiposProveedor] = useState<TipoProveedor[]>([]);
  const [loading, setLoading] = useState(false);
  const [consultandoSRI, setConsultandoSRI] = useState(false);
  const [datosConsultados, setDatosConsultados] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    vnombre: '',
    vruc: '',
    establecimientos: [],
    vtelefono: '',
    vemail: '',
    itipo_proveedor: '',
    bactivo: true,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData | 'ruc', string>>>({});

  useEffect(() => {
    cargarDatosIniciales();
  }, []);

  const cargarDatosIniciales = async () => {
    try {
      const tipos = await fetchAllTiposProveedor();
      setTiposProveedor(tipos);
    } catch (error) {
      console.error('Error al cargar datos iniciales:', error);
      Alert.alert('Error', 'No se pudieron cargar los datos iniciales');
    }
  };

  const handleRucChange = (value: string) => {
    setFormData((prev) => ({ ...prev, vruc: value }));
    if (errors.ruc || errors.vruc) {
      setErrors((prev) => ({ ...prev, ruc: undefined, vruc: undefined }));
    }
  };

  const consultarSRI = async () => {
    if (!formData.vruc || formData.vruc.trim() === '') {
      setErrors({ ruc: 'Debe ingresar un RUC para consultar' });
      return;
    }

    if (formData.vruc.length !== 13) {
      setErrors({ ruc: 'El RUC debe tener 13 dígitos' });
      return;
    }

    try {
      setConsultandoSRI(true);
      setErrors({});

      const response = await consultaSRI_Direct(formData.vruc);

      if ('error' in response) {
        setErrors({ ruc: response.error });
        return;
      }

      const datosSRI = response as SriData;

      const establecimientosAbiertos = datosSRI.data.establecimientos
        .filter((est) => est.estado === 'ABIERTO')
        .map((est) => ({
          tipo: est.matriz === 'SI' ? ('Matriz' as const) : ('Sucursal' as const),
          direccion: est.direccionCompleta,
          numeroEstablecimiento: est.numeroEstablecimiento,
        }));

      if (establecimientosAbiertos.length === 0) {
        setErrors({ ruc: 'No se encontraron establecimientos activos para este RUC' });
        return;
      }

      setFormData((prev) => ({
        ...prev,
        vnombre: datosSRI.data.razonSocial,
        establecimientos: establecimientosAbiertos,
      }));

      setDatosConsultados(true);
    } catch (error) {
      console.error('Error al consultar SRI:', error);
      setErrors({ ruc: 'Error al consultar el SRI. Verifique el RUC e intente nuevamente.' });
    } finally {
      setConsultandoSRI(false);
    }
  };

  const handleChange = (name: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validarFormulario = (): boolean => {
    const newErrors: Partial<Record<keyof FormData | 'ruc', string>> = {};

    if (!datosConsultados) {
      newErrors.ruc = 'Debe consultar el RUC en el SRI primero';
    }

    if (!formData.vnombre.trim()) {
      newErrors.vnombre = 'El nombre es requerido';
    }

    if (!formData.vruc.trim()) {
      newErrors.vruc = 'El RUC es requerido';
    }

    if (formData.establecimientos.length === 0) {
      newErrors.ruc = 'No se encontraron establecimientos activos';
    }

    if (formData.itipo_proveedor === '') {
      newErrors.itipo_proveedor = 'Debe seleccionar un tipo de proveedor';
    }

    if (formData.vemail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.vemail)) {
      newErrors.vemail = 'Email inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validarFormulario()) return;

    try {
      setLoading(true);

      const proveedorData = {
        vnombre: formData.vnombre.trim(),
        vruc: formData.vruc.trim(),
        establecimientos: formData.establecimientos,
        vtelefono: formData.vtelefono.trim() || undefined,
        vemail: formData.vemail.trim() || undefined,
        itipo_proveedor: formData.itipo_proveedor as number,
        bactivo: formData.bactivo,
      };

      await createProveedor(proveedorData);
      setModalVisible(true);
    } catch (error) {
      console.error('Error al guardar proveedor:', error);
      Alert.alert('Error', 'No se pudo crear el proveedor');
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setModalVisible(false);
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <BackButton />
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.pageHeader}>
          <View style={styles.iconContainer}>
            <Package size={24} color={Colors.textInverse} />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.title}>Nuevo Proveedor</Text>
            <Text style={styles.subtitle}>
              Complete los datos del proveedor consultando el RUC en el SRI
            </Text>
          </View>
        </View>

        {/* Consulta RUC */}
        <ConsultaRUC
          vruc={formData.vruc}
          onRucChange={handleRucChange}
          onConsultar={consultarSRI}
          consultandoSRI={consultandoSRI}
          datosConsultados={datosConsultados}
          error={errors.ruc || errors.vruc}
        />

        {datosConsultados && (
          <>
            {/* Datos SRI */}
            <DatosSRI
              razonSocial={formData.vnombre}
              establecimientos={formData.establecimientos}
            />

            {/* Información Adicional */}
            <InformacionAdicional
              formData={{
                itipo_proveedor: formData.itipo_proveedor,
                vtelefono: formData.vtelefono,
                vemail: formData.vemail,
                bactivo: formData.bactivo,
              }}
              tiposProveedor={tiposProveedor}
              errors={{
                itipo_proveedor: errors.itipo_proveedor,
                vemail: errors.vemail,
              }}
              onChange={handleChange}
              onSubmit={handleSubmit}
              loading={loading}
            />
          </>
        )}
      </ScrollView>

      <SuccessModal
        visible={modalVisible}
        onClose={handleModalClose}
        message="El proveedor ha sido creado exitosamente"
        title="¡Éxito!"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: Spacing.md,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  pageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    gap: Spacing.sm,
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary,
  },
  iconContainer: {
    backgroundColor: Colors.primary,
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
    color: Colors.text,
  },
  subtitle: {
    fontSize: FontSizes.sm,
    color: Colors.textLight,
  },
});