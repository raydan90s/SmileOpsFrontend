import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Plus } from 'lucide-react-native';

import { useBodegas } from '@context/BodegasContext';
import { useFormularioProducto } from '@hooks/useFormularioProducto';
import { useProductosInventario } from '@hooks/useProductosInventario';

import ModalError from '@components/shared/ModalError';
import BuscadorProductos from '@components/Inventario/Pedidos/BuscadorProductos';
import AddButton from '@components/shared/AddButton';
import CamposProducto from '@components/Inventario/Pedidos/CamposProducto';

import type { ProductoInventario } from '@models/ProductoInventario/ProductoInventario.types';
import type { ProductoTratamiento } from '@models/Tratamiento/Tratamiento.types';
import type { Consultorio } from '@models/Consultorios/Consultorios.types';

import { Colors, Spacing, BorderRadius, FontSizes, FontWeights, Shadows } from '@constants/theme';

export interface FormularioProductoProps {
  consultorios?: Consultorio[];
  onAgregarProducto: (producto: Omit<ProductoTratamiento, 'id'>) => void;
  consultorioInicial?: string;
  mostrarConsultorio?: boolean;
  mostrarBodegaProveedor?: boolean;
  mostrarValorUnitario?: boolean;
}

const FormularioProducto: React.FC<FormularioProductoProps> = ({
  consultorios = [],
  onAgregarProducto,
  consultorioInicial = '',
  mostrarConsultorio = true,
  mostrarBodegaProveedor = true,
  mostrarValorUnitario = false,
}) => {
  const { bodegas } = useBodegas();
  const { productos: productosInventario, loading: loadingProductos } = useProductosInventario();

  const {
    consultorioProducto,
    setConsultorioProducto,
    bodegaProducto,
    proveedorProducto,
    codigoProducto,
    setCodigoProducto,
    nombreProducto,
    setNombreProducto,
    cantidadProducto,
    setCantidadProducto,
    unidadProducto,
    setUnidadProducto,
    valorUnitarioProducto,
    handleValorUnitarioChange,
    proveedores,
    limpiarFormulario,
  } = useFormularioProducto(consultorioInicial);

  const [modalAbierto, setModalAbierto] = useState(false);
  const [mensajeError, setMensajeError] = useState('');
  const [productoSeleccionadoCodigo, setProductoSeleccionadoCodigo] = useState('');
  const [bodegaOrigen, setBodegaOrigen] = useState('');

  const mostrarError = (mensaje: string) => {
    setMensajeError(mensaje);
    setModalAbierto(true);
  };

  const handleSeleccionarProducto = (producto: ProductoInventario) => {
    setProductoSeleccionadoCodigo(producto.codigo_producto);
    setCodigoProducto(producto.codigo_producto);
    const nombreCompleto = [
      producto.vnombre_producto,
      producto.vnombre_caracteristica,
      producto.vnombre_marca
    ].filter(Boolean).join(' - ');
    setNombreProducto(nombreCompleto);
    setUnidadProducto(producto.unidad_compra_nombre || 'UNIDAD');
  };

  const validarFormulario = (): string | null => {
    if (!cantidadProducto || parseInt(cantidadProducto) <= 0)
      return 'Por favor ingrese una cantidad válida';

    if (mostrarValorUnitario && (!valorUnitarioProducto || parseFloat(valorUnitarioProducto) <= 0)) {
      return 'Por favor ingrese un valor unitario válido';
    }

    return null;
  };

  const handleAgregar = () => {
    const error = validarFormulario();
    if (error) {
      mostrarError(error);
      return;
    }

    const consultorio = consultorios.find(c => c.iidconsultorio.toString() === consultorioProducto);
    
    const bodegaSolicita = mostrarBodegaProveedor
      ? bodegas.find(b => b.iid_bodega.toString() === bodegaProducto)
      : null;
      
    const bodegaOrigenObj = mostrarBodegaProveedor
      ? bodegas.find(b => b.iid_bodega.toString() === bodegaOrigen)
      : null;
      
    const proveedor = mostrarBodegaProveedor
      ? proveedores.find(p => p.iid_proveedor.toString() === proveedorProducto)
      : null;

    const nuevoProducto: any = {
      codigo: codigoProducto,
      nombre: nombreProducto,
      cantidad: parseInt(cantidadProducto),
      unidad: unidadProducto,
    };

    if (mostrarConsultorio) {
      nuevoProducto.consultorio = consultorio?.vnombre || 'Sin consultorio';
    }

    if (mostrarBodegaProveedor) {
      nuevoProducto.bodegaSolicita = bodegaSolicita?.vnombre_bodega || 'Sin bodega';
      nuevoProducto.bodegaOrigen = bodegaOrigenObj?.vnombre_bodega || 'Sin bodega origen';
      nuevoProducto.proveedor = proveedor?.vnombre || 'Sin proveedor';
      nuevoProducto.iidBodegaSolicita = bodegaProducto;
      nuevoProducto.iidBodegaOrigen = bodegaOrigen;
      nuevoProducto.iidProveedor = proveedorProducto;
    }

    if (mostrarValorUnitario) {
      nuevoProducto.valorUnitario = parseFloat(valorUnitarioProducto);
    }

    onAgregarProducto(nuevoProducto);
    limpiarFormulario();
    setProductoSeleccionadoCodigo('');
    setBodegaOrigen('');
    if (mostrarConsultorio) {
      setConsultorioProducto('');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Buscar Producto</Text>
        <BuscadorProductos
          productos={productosInventario}
          onSeleccionarProducto={handleSeleccionarProducto}
          productoSeleccionado={productoSeleccionadoCodigo}
          loading={loadingProductos}
        />
      </View>

      <CamposProducto
        mostrarConsultorio={mostrarConsultorio}
        consultorioProducto={consultorioProducto}
        setConsultorioProducto={setConsultorioProducto}
        consultorios={consultorios}
        codigoProducto={codigoProducto}
        setCodigoProducto={setCodigoProducto}
        nombreProducto={nombreProducto}
        setNombreProducto={setNombreProducto}
        cantidadProducto={cantidadProducto}
        setCantidadProducto={setCantidadProducto}
        unidadProducto={unidadProducto}
        mostrarValorUnitario={mostrarValorUnitario}
        valorUnitarioProducto={valorUnitarioProducto}
        handleValorUnitarioChange={handleValorUnitarioChange}
      />

      <View style={styles.addButtonContainer}>
        <AddButton
          icon={Plus}
          itemText="Producto"
          onPress={handleAgregar}
          bgColor={Colors.primary}
        />
      </View>

      <ModalError
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
        mensaje={mensajeError}
        titulo="¡Atención!"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  section: {
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  addButtonContainer: {
    marginTop: Spacing.md,
  },
});

export default FormularioProducto;