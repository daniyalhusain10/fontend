// src/components/LoadingScreen.jsx

import React from "react";
// Import 'motion' from framer-motion library.
import { motion } from "framer-motion"; 
// Optional: You can also use a dedicated icon library like react-icons here 
// if you want a more standard loading icon instead of '⏳'.

const LoadingScreen = ({ message = "Loading data..." }) => {
  return (
    <div className="flex justify-center items-center min-h-screen ">
      {/* Framer Motion for the spinning animation */}
      <motion.div 
        animate={{ rotate: 360 }} 
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }} 
        className="text-5xl mr-4"
      >
        ⏳
      </motion.div>
    </div>
  );
};

export default LoadingScreen;