// ./api/MiniLoaderContext.jsx
import React, { createContext, useContext, useState, useRef } from "react";

const MiniLoaderContext = createContext();

export const MiniLoaderProvider = ({ children }) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const overlayRef = useRef(null); // 👈 shared reference for GSAP animation

  return (
    <MiniLoaderContext.Provider
      value={{ isTransitioning, setIsTransitioning, overlayRef }}
    >
      {children}
    </MiniLoaderContext.Provider>
  );
};

export const useTransition = () => useContext(MiniLoaderContext);
