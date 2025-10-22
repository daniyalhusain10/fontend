// src/components/ConfirmModal.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        // Backdrop
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-gray-900 bg-opacity-70 backdrop-blur-sm"
          onClick={onCancel} // Close on backdrop click
        >
          {/* Modal Container with Cute Styling */}
          <motion.div
            initial={{ scale: 0.9, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 50, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-sm border border-gray-700"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
          >
            {/* Header */}
            <div className="text-center mb-4">
              <span className="text-5xl block animate-bounce-once">
                 🚨
              </span> 
              <h3 className="text-xl font-bold text-white mt-3">{title}</h3>
            </div>
            
            {/* Message */}
            <p className="text-gray-400 text-center mb-6">{message}</p>
            
            {/* Buttons */}
            <div className="flex justify-around gap-4">
              <button
                onClick={onCancel}
                className="flex-1 py-2 px-4 rounded-lg bg-gray-700 text-gray-300 font-semibold hover:bg-gray-600 transition duration-150 border border-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="flex-1 py-2 px-4 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition duration-150 shadow-md shadow-red-900/50"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;