import { useState, useEffect } from 'react';
import { fetchAllProveedores } from '@services/Proveedores/Proveedores.service';


export const useFormularioProducto = (consultorioInicial: string) => {
  const [consultorioProducto, setConsultorioProducto] = useState(consultorioInicial);
  const [bodegaProducto, setBodegaProducto] = useState('');
  const [proveedorProducto, setProveedorProducto] = useState('');
  const [codigoProducto, setCodigoProducto] = useState('');
  const [nombreProducto, setNombreProducto] = useState('');
  const [cantidadProducto, setCantidadProducto] = useState('');
  const [unidadProducto, setUnidadProducto] = useState('Unidad');
  const [valorUnitarioProducto, setValorUnitarioProducto] = useState('');

  const [proveedores, setProveedores] = useState<Array<{ iid_proveedor: number; vnombre: string }>>([]);
  const [loadingProveedores, setLoadingProveedores] = useState(true);

  useEffect(() => {
    const cargarProveedores = async () => {
      setLoadingProveedores(true);
      try {
        const data = await fetchAllProveedores();
        setProveedores(data);
      } catch (error) {
        console.error('Error al cargar proveedores:', error);
      } finally {
        setLoadingProveedores(false);
      }
    };
    
    cargarProveedores();
  }, []);

  const limpiarFormulario = () => {
    setCodigoProducto('');
    setNombreProducto('');
    setCantidadProducto('');
    setUnidadProducto('Unidad');
    setValorUnitarioProducto('');
    setBodegaProducto('');
    setProveedorProducto('');
  };

  const handleValorUnitarioChange = (value: string) => {
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setValorUnitarioProducto(value);
    }
  };

  return {
    consultorioProducto,
    setConsultorioProducto,
    bodegaProducto,
    setBodegaProducto,
    proveedorProducto,
    setProveedorProducto,
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
    loadingProveedores,
    limpiarFormulario,
  };
};