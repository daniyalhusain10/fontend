// src/components/ConfirmContext.jsx
import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import ConfirmModal from '../components/ConfirmModel'; // Adjust path if needed

const ConfirmContext = createContext();

// 💡 The custom hook you will use in ShowOrder.jsx
export const useConfirm = () => useContext(ConfirmContext);

export const ConfirmProvider = ({ children }) => {
  const [modalState, setModalState] = useState({
    isOpen: false,
    message: '',
    title: 'Confirm Action',
  });
  
  const resolver = useRef();

  const myConfirm = useCallback((message, title = 'Are you sure?') => {
    return new Promise((resolve) => {
      resolver.current = resolve; 
      
      setModalState({
        isOpen: true,
        message,
        title,
      });
    });
  }, []);

  const handleConfirm = useCallback(() => {
    if (resolver.current) {
      resolver.current(true); 
    }
    setModalState({ ...modalState, isOpen: false });
  }, [modalState]);

  const handleCancel = useCallback(() => {
    if (resolver.current) {
      resolver.current(false); // Resolve with false, like window.confirm
    }
    setModalState({ ...modalState, isOpen: false });
  }, [modalState]);

  const contextValue = {
    myConfirm,
  };

  return (
    <ConfirmContext.Provider value={contextValue}>
      {children}
      <ConfirmModal
        isOpen={modalState.isOpen}
        title={modalState.title}
        message={modalState.message}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </ConfirmContext.Provider>
  );
};