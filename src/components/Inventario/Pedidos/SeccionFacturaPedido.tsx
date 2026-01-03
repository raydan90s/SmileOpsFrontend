import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Switch,
  Platform,
  Modal,
} from 'react-native';
import { FileText, Upload, X, Calendar } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as DocumentPicker from 'expo-document-picker';
import { Colors, Spacing, FontSizes, BorderRadius, Shadows } from '@constants/theme';
import type { DatosFactura } from '@models/FacturaPedido/FacturaPedido.types';
import type { EntidadFacturadora } from '@models/FacturaPedido/EntidadesFacturadoras.types';

interface SeccionFacturaPedidoProps {
  value: DatosFactura;
  onChange: (datos: DatosFactura) => void;
  entidades: EntidadFacturadora[];
  loadingEntidades?: boolean;
  subtotalBase0?: number;
  subtotalBaseIVA?: number;
  subtotalTotal?: number;
  ivaTotal?: number;
  totalGeneral?: number;
  tieneFactura: boolean;
  onTieneFacturaChange: (checked: boolean) => void;
}

const SeccionFacturaPedido: React.FC<SeccionFacturaPedidoProps> = ({
  value,
  onChange,
  entidades,
  loadingEntidades = false,
  subtotalBase0 = 0,
  subtotalBaseIVA = 0,
  subtotalTotal = 0,
  ivaTotal = 0,
  totalGeneral = 0,
  tieneFactura,
  onTieneFacturaChange
}) => {
  const [erroresArchivos, setErroresArchivos] = useState<{ xml?: string; pdf?: string }>({});
  const [mostrarSelectorEntidad, setMostrarSelectorEntidad] = useState(false);
  const [mostrarDatePicker, setMostrarDatePicker] = useState<{
    tipo: 'factura' | 'autorizacion' | null;
    visible: boolean;
  }>({ tipo: null, visible: false });

  const [fechaTemporal, setFechaTemporal] = useState<Date | null>(null);

  const handleCheckboxChange = (checked: boolean) => {
    onTieneFacturaChange(checked);
    if (!checked) {
      onChange({
        iid_entidad_facturadora: null,
        v_numero_factura: '',
        v_clave_acceso: '',
        v_numero_autorizacion: '',
        d_fecha_factura: '',
        d_fecha_autorizacion: '',
        n_subtotal_0: value.n_subtotal_0,
        n_subtotal_iva: value.n_subtotal_iva,
        n_subtotal: value.n_subtotal,
        n_iva: value.n_iva,
        n_total: value.n_total,
        n_descuento: 0,
        v_observaciones: '',
        archivo_xml: null,
        archivo_pdf: null
      });
      setErroresArchivos({});
    }
  };

  const handleInputChange = (field: keyof DatosFactura, newValue: any) => {
    onChange({ ...value, [field]: newValue });
  };

  const handleFechaChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      setFechaTemporal(selectedDate);
    }
  };

  const confirmarFecha = () => {
    const tipo = mostrarDatePicker.tipo;
    const fecha = fechaTemporal || obtenerFechaInicial(mostrarDatePicker.tipo || 'factura');

    if (tipo === 'factura') {
      const fechaStr = fecha.toISOString().split('T')[0];
      handleInputChange('d_fecha_factura', fechaStr);
    } else if (tipo === 'autorizacion') {
      const year = fecha.getFullYear();
      const month = String(fecha.getMonth() + 1).padStart(2, '0');
      const day = String(fecha.getDate()).padStart(2, '0');
      const hours = String(fecha.getHours()).padStart(2, '0');
      const minutes = String(fecha.getMinutes()).padStart(2, '0');
      const fechaStr = `${year}-${month}-${day} ${hours}:${minutes}`;
      handleInputChange('d_fecha_autorizacion', fechaStr);
    }

    setMostrarDatePicker({ tipo: null, visible: false });
    setFechaTemporal(null);
  };

  const cancelarSeleccion = () => {
    setMostrarDatePicker({ tipo: null, visible: false });
    setFechaTemporal(null);
  };

  const obtenerFechaMinima = (): Date => {
    const hoy = new Date();
    const hace30Dias = new Date(hoy);
    hace30Dias.setDate(hoy.getDate() - 30);
    return hace30Dias;
  };

  const formatearFechaDisplay = (fecha: string): string => {
    if (!fecha) return '';
    try {
      const date = new Date(fecha);
      if (isNaN(date.getTime())) return fecha;
      
      return date.toLocaleDateString('es-EC', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return fecha;
    }
  };

  const formatearFechaHoraDisplay = (fecha: string): string => {
    if (!fecha) return '';
    try {
      const date = new Date(fecha);
      if (isNaN(date.getTime())) return fecha;
      
      return date.toLocaleDateString('es-EC', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return fecha;
    }
  };

  const obtenerFechaInicial = (tipo: 'factura' | 'autorizacion'): Date => {
    if (tipo === 'factura' && value.d_fecha_factura) {
      const fecha = new Date(value.d_fecha_factura);
      if (!isNaN(fecha.getTime())) return fecha;
    }
    if (tipo === 'autorizacion' && value.d_fecha_autorizacion) {
      const fecha = new Date(value.d_fecha_autorizacion);
      if (!isNaN(fecha.getTime())) return fecha;
    }
    return new Date();
  };

  const handleArchivoChange = async (tipo: 'xml' | 'pdf') => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: tipo === 'xml' ? 'text/xml' : 'application/pdf',
        copyToCacheDirectory: true
      });

      if (result.canceled) {
        return;
      }

      const file = result.assets[0];
      const extension = file.name.split('.').pop()?.toLowerCase();

      if (tipo === 'xml' && extension !== 'xml') {
        setErroresArchivos(prev => ({ ...prev, xml: 'Solo se permiten archivos XML' }));
        return;
      }
      if (tipo === 'pdf' && extension !== 'pdf') {
        setErroresArchivos(prev => ({ ...prev, pdf: 'Solo se permiten archivos PDF' }));
        return;
      }

      if (file.size && file.size > 5 * 1024 * 1024) {
        setErroresArchivos(prev => ({
          ...prev,
          [tipo]: 'El archivo no debe superar los 5MB'
        }));
        return;
      }

      onChange({
        ...value,
        [`archivo_${tipo}`]: file as any
      });
      setErroresArchivos(prev => ({ ...prev, [tipo]: undefined }));

    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudo cargar el archivo');
    }
  };

  const handleEliminarArchivo = (tipo: 'xml' | 'pdf') => {
    onChange({
      ...value,
      [`archivo_${tipo}`]: null
    });
    setErroresArchivos(prev => ({ ...prev, [tipo]: undefined }));
  };

  const validarClaveAcceso = (clave: string): boolean => {
    return clave.length === 0 || clave.length === 49;
  };

  const entidadSeleccionada = entidades.find(
    e => e.iid_entidad_facturadora === value.iid_entidad_facturadora
  );

  return (
    <View style={styles.container}>
      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>Tiene factura</Text>
        <Switch
          value={tieneFactura}
          onValueChange={handleCheckboxChange}
          trackColor={{ false: Colors.border, true: Colors.primaryLight }}
          thumbColor={tieneFactura ? Colors.primary : '#f4f3f4'}
        />
      </View>

      {tieneFactura && (
        <View style={styles.facturaSection}>
          <View style={styles.sectionHeader}>
            <FileText size={20} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Información de la Factura</Text>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              Entidad Facturadora <Text style={styles.required}>*</Text>
            </Text>
            {loadingEntidades ? (
              <Text style={styles.loadingText}>Cargando entidades...</Text>
            ) : (
              <TouchableOpacity
                style={styles.selector}
                onPress={() => setMostrarSelectorEntidad(!mostrarSelectorEntidad)}
              >
                <Text style={entidadSeleccionada ? styles.selectorText : styles.selectorPlaceholder}>
                  {entidadSeleccionada
                    ? `${entidadSeleccionada.v_razon_social}`
                    : 'Seleccione una entidad'}
                </Text>
              </TouchableOpacity>
            )}

            {mostrarSelectorEntidad && (
              <View style={styles.selectorDropdown}>
                <ScrollView style={styles.selectorList} nestedScrollEnabled>
                  {entidades.map((entidad) => (
                    <TouchableOpacity
                      key={entidad.iid_entidad_facturadora}
                      style={styles.selectorItem}
                      onPress={() => {
                        handleInputChange('iid_entidad_facturadora', entidad.iid_entidad_facturadora);
                        setMostrarSelectorEntidad(false);
                      }}
                    >
                      <Text style={styles.selectorItemText}>
                        {entidad.v_razon_social}
                      </Text>
                      <Text style={styles.selectorItemSubtext}>
                        RUC: {entidad.v_ruc}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>

          <View style={styles.row}>
            <View style={styles.halfField}>
              <Text style={styles.label}>
                Número de Factura <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                value={value.v_numero_factura}
                onChangeText={(text) => handleInputChange('v_numero_factura', text)}
                maxLength={50}
                placeholder="001-001..."
                placeholderTextColor={Colors.placeholder}
              />
            </View>

            <View style={styles.halfField}>
              <Text style={styles.label}>
                Fecha <Text style={styles.required}>*</Text>
              </Text>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setMostrarDatePicker({ tipo: 'factura', visible: true })}
              >
                <Calendar size={16} color={Colors.placeholder} />
                <Text style={value.d_fecha_factura ? styles.dateText : styles.datePlaceholder}>
                  {value.d_fecha_factura ? formatearFechaDisplay(value.d_fecha_factura) : 'Seleccionar fecha'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Clave de Acceso (49 dígitos)</Text>
            <TextInput
              style={[
                styles.input,
                value.v_clave_acceso && !validarClaveAcceso(value.v_clave_acceso) && styles.inputError
              ]}
              value={value.v_clave_acceso}
              onChangeText={(text) => {
                const valor = text.replace(/\D/g, '');
                if (valor.length <= 49) {
                  handleInputChange('v_clave_acceso', valor);
                }
              }}
              maxLength={49}
              keyboardType="numeric"
              placeholder="49 dígitos numéricos"
              placeholderTextColor={Colors.placeholder}
            />
            {value.v_clave_acceso && !validarClaveAcceso(value.v_clave_acceso) && (
              <Text style={styles.errorText}>Debe tener exactamente 49 dígitos</Text>
            )}
            <Text style={styles.hint}>{value.v_clave_acceso?.length || 0}/49 dígitos</Text>
          </View>

          <View style={styles.row}>
            <View style={styles.halfField}>
              <Text style={styles.label}>No. Autorización</Text>
              <TextInput
                style={styles.input}
                value={value.v_numero_autorizacion}
                onChangeText={(text) => handleInputChange('v_numero_autorizacion', text)}
                maxLength={49}
                placeholder="Autorización SRI"
                placeholderTextColor={Colors.placeholder}
              />
            </View>
            <View style={styles.halfField}>
              <Text style={styles.label}>Fecha Aut.</Text>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setMostrarDatePicker({ tipo: 'autorizacion', visible: true })}
              >
                <Calendar size={16} color={Colors.placeholder} />
                <Text style={value.d_fecha_autorizacion ? styles.dateText : styles.datePlaceholder}>
                  {value.d_fecha_autorizacion 
                    ? formatearFechaHoraDisplay(value.d_fecha_autorizacion) 
                    : 'Seleccionar fecha y hora'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.valoresSection}>
            <Text style={styles.subsectionTitle}>Valores de la Factura</Text>

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Descuento</Text>
              <TextInput
                style={styles.input}
                value={value.n_descuento?.toString() || ''}
                onChangeText={(text) => {
                  const val = text.replace(/[^0-9.]/g, '');
                  handleInputChange('n_descuento', val === '' ? 0 : parseFloat(val));
                }}
                keyboardType="numeric"
                placeholder="0.00"
                placeholderTextColor={Colors.placeholder}
              />
            </View>

            <View style={styles.totalesContainer}>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Subtotal Base 0%:</Text>
                <Text style={styles.totalValue}>${subtotalBase0.toFixed(2)}</Text>
              </View>

              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Subtotal Base IVA:</Text>
                <Text style={styles.totalValue}>${subtotalBaseIVA.toFixed(2)}</Text>
              </View>

              <View style={[styles.totalRow, styles.totalRowBorder]}>
                <Text style={styles.totalLabelBold}>Subtotal Total:</Text>
                <Text style={styles.totalValueBold}>${subtotalTotal.toFixed(2)}</Text>
              </View>

              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>IVA (15%):</Text>
                <Text style={styles.totalValue}>${ivaTotal.toFixed(2)}</Text>
              </View>

              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Descuento:</Text>
                <Text style={styles.totalValueRed}>-${(value.n_descuento || 0).toFixed(2)}</Text>
              </View>

              <View style={[styles.totalRow, styles.totalRowFinal]}>
                <Text style={styles.totalLabelFinal}>TOTAL A PAGAR:</Text>
                <Text style={styles.totalValueFinal}>
                  ${((totalGeneral || 0) - (value.n_descuento || 0)).toFixed(2)}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.archivosSection}>
            <Text style={styles.subsectionTitle}>Archivos Adjuntos</Text>

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Archivo XML</Text>
              <View style={styles.fileButtonContainer}>
                <TouchableOpacity
                  style={styles.uploadButton}
                  onPress={() => handleArchivoChange('xml')}
                >
                  <Upload size={16} color={Colors.textLight} />
                  <Text style={styles.uploadButtonText} numberOfLines={1}>
                    {value.archivo_xml ? (value.archivo_xml as any).name : 'Seleccionar XML'}
                  </Text>
                </TouchableOpacity>

                {value.archivo_xml && (
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => handleEliminarArchivo('xml')}
                  >
                    <X size={16} color="#ef4444" />
                  </TouchableOpacity>
                )}
              </View>
              {erroresArchivos.xml && (
                <Text style={styles.errorText}>{erroresArchivos.xml}</Text>
              )}
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Archivo PDF</Text>
              <View style={styles.fileButtonContainer}>
                <TouchableOpacity
                  style={styles.uploadButton}
                  onPress={() => handleArchivoChange('pdf')}
                >
                  <Upload size={16} color={Colors.textLight} />
                  <Text style={styles.uploadButtonText} numberOfLines={1}>
                    {value.archivo_pdf ? (value.archivo_pdf as any).name : 'Seleccionar PDF'}
                  </Text>
                </TouchableOpacity>

                {value.archivo_pdf && (
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => handleEliminarArchivo('pdf')}
                  >
                    <X size={16} color="#ef4444" />
                  </TouchableOpacity>
                )}
              </View>
              {erroresArchivos.pdf && (
                <Text style={styles.errorText}>{erroresArchivos.pdf}</Text>
              )}
            </View>
          </View>

          {mostrarDatePicker.visible && mostrarDatePicker.tipo && (
            <Modal
              visible={mostrarDatePicker.visible}
              transparent={true}
              animationType="slide"
              onRequestClose={cancelarSeleccion}
            >
              <TouchableOpacity
                style={styles.modalOverlay}
                activeOpacity={1}
                onPress={cancelarSeleccion}
              >
                <TouchableOpacity
                  style={styles.modalContent}
                  activeOpacity={1}
                  onPress={(e) => e.stopPropagation()}
                >
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>
                      {mostrarDatePicker.tipo === 'factura' 
                        ? 'Seleccionar Fecha de Factura' 
                        : 'Seleccionar Fecha de Autorización'}
                    </Text>
                    <TouchableOpacity
                      onPress={cancelarSeleccion}
                      style={styles.modalCloseButton}
                    >
                      <X size={24} color={Colors.text} />
                    </TouchableOpacity>
                  </View>
                  
                  <View style={styles.datePickerContainer}>
                    <DateTimePicker
                      value={fechaTemporal || obtenerFechaInicial(mostrarDatePicker.tipo)}
                      mode={mostrarDatePicker.tipo === 'autorizacion' ? 'datetime' : 'date'}
                      display="spinner"
                      onChange={handleFechaChange}
                      minimumDate={obtenerFechaMinima()}
                      maximumDate={new Date()}
                      locale="es-EC"
                      themeVariant="light"
                      textColor={Colors.text}
                    />
                  </View>

                  <View style={styles.modalFooter}>
                    <TouchableOpacity
                      style={styles.modalConfirmButton}
                      onPress={confirmarFecha}
                    >
                      <Text style={styles.modalConfirmButtonText}>Confirmar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.modalCancelButton}
                      onPress={cancelarSeleccion}
                    >
                      <Text style={styles.modalCancelButtonText}>Cancelar</Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              </TouchableOpacity>
            </Modal>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.md,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.sm,
  },
  switchLabel: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: Colors.text,
  },
  facturaSection: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginTop: Spacing.sm,
    backgroundColor: '#FFFFFF',
    ...Shadows.sm
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    gap: Spacing.sm
  },
  sectionTitle: {
    fontSize: FontSizes.md,
    fontWeight: 'bold',
    color: Colors.text,
  },
  fieldContainer: {
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  required: {
    color: '#ef4444',
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    fontSize: FontSizes.sm,
    color: Colors.text,
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: '#ef4444',
  },
  hint: {
    fontSize: FontSizes.xs,
    color: Colors.textLight,
    marginTop: 4,
  },
  errorText: {
    fontSize: FontSizes.xs,
    color: '#ef4444',
    marginTop: 4,
  },
  loadingText: {
    fontSize: FontSizes.sm,
    color: Colors.textLight,
    fontStyle: 'italic',
  },
  selector: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    backgroundColor: '#fff',
  },
  selectorText: {
    fontSize: FontSizes.sm,
    color: Colors.text,
  },
  selectorPlaceholder: {
    fontSize: FontSizes.sm,
    color: Colors.placeholder,
  },
  selectorDropdown: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.xs,
    backgroundColor: '#fff',
    maxHeight: 200,
    zIndex: 10,
  },
  selectorList: {
    maxHeight: 200,
  },
  selectorItem: {
    padding: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  selectorItemText: {
    fontSize: FontSizes.sm,
    color: Colors.text,
    fontWeight: '600',
  },
  selectorItemSubtext: {
    fontSize: FontSizes.xs,
    color: Colors.textLight,
    marginTop: 2,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  halfField: {
    flex: 1,
  },
  subsectionTitle: {
    fontSize: FontSizes.sm,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  valoresSection: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing.md,
    marginTop: Spacing.md,
  },
  totalesContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: Spacing.sm,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  totalRowBorder: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing.xs,
    marginTop: Spacing.xs,
  },
  totalRowFinal: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing.sm,
    marginTop: Spacing.sm,
  },
  totalLabel: {
    fontSize: FontSizes.sm,
    color: Colors.textLight,
  },
  totalValue: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: Colors.text,
  },
  totalLabelBold: {
    fontSize: FontSizes.sm,
    fontWeight: 'bold',
    color: Colors.text,
  },
  totalValueBold: {
    fontSize: FontSizes.sm,
    fontWeight: 'bold',
    color: Colors.text,
  },
  totalValueRed: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: '#ef4444',
  },
  totalLabelFinal: {
    fontSize: FontSizes.md,
    fontWeight: 'bold',
    color: Colors.text,
  },
  totalValueFinal: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  archivosSection: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing.md,
    marginTop: Spacing.md,
  },
  fileButtonContainer: {
    flexDirection: 'row',
    gap: Spacing.sm
  },
  uploadButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    backgroundColor: '#fff',
    gap: Spacing.xs
  },
  uploadButtonText: {
    fontSize: FontSizes.sm,
    color: Colors.textLight,
  },
  removeButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.sm,
    backgroundColor: '#FEF2F2',
    borderRadius: BorderRadius.md
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    backgroundColor: '#fff',
    gap: Spacing.xs,
  },
  dateText: {
    fontSize: FontSizes.sm,
    color: Colors.text,
    flex: 1,
  },
  datePlaceholder: {
    fontSize: FontSizes.sm,
    color: Colors.placeholder,
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: Spacing.xl,
    ...Shadows.lg
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    color: Colors.text,
  },
  modalCloseButton: {
    padding: Spacing.xs,
  },
  datePickerContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: Spacing.md,
  },
  modalFooter: {
    padding: Spacing.lg,
    paddingTop: Spacing.md,
    gap: Spacing.sm,
  },
  modalConfirmButton: {
    backgroundColor: Colors.primary,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  modalConfirmButtonText: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  modalCancelButton: {
    backgroundColor: '#F3F4F6',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  modalCancelButtonText: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.text,
  },
});

export default SeccionFacturaPedido;