import { useState } from 'react';

export function useModalAprobacion<T = any>() {
  const [modalState, setModalState] = useState<{
    visible: boolean;
    pedido: T | null;  
  }>({
    visible: false,
    pedido: null  
  });

  const abrirModal = (pedido: T) => {
    setModalState({ visible: true, pedido });  
  };

  const cerrarModal = () => {
    setModalState({ visible: false, pedido: null });
  };

  return {
    modalState,
    abrirModal,
    cerrarModal
  };
}