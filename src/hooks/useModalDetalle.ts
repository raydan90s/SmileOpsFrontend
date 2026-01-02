import { useState } from 'react';

export function useModalDetalle<T = any>() {
  const [modalState, setModalState] = useState<{
    visible: boolean;
    item: T | null;
  }>({
    visible: false,
    item: null
  });

  const abrirModal = (item: T) => {
    setModalState({ visible: true, item });
  };

  const cerrarModal = () => {
    setModalState({ visible: false, item: null });
  };

  return {
    modalState,
    abrirModal,
    cerrarModal
  };
}