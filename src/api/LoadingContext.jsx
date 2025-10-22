// src/api/LoadingContext.jsx
import React, { createContext, useState, useContext } from 'react';
import LoadingScreen from '../components/LoadingScreen.jsx'; // your spinner component

const LoadingContext = createContext();

export const useLoading = () => useContext(LoadingContext);

export const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  return (
    <LoadingContext.Provider value={{ loading, setLoading }}>
      {loading && <LoadingScreen message="Loading, please wait..." />}
      {children}
    </LoadingContext.Provider>
  );
};

export default LoadingContext;
