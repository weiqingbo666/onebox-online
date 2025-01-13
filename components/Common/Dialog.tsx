import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  title,
  message,
  type = 'info',
  confirmText = '确认',
  cancelText = '取消',
  onConfirm,
  onCancel,
}) => {
  const [, setIsClosing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 200);
  };

  const handleConfirm = () => {
    onConfirm?.();
    handleClose();
  };

  const handleCancel = () => {
    onCancel?.();
    handleClose();
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return (
          <div className="w-10 h-10 bg-[#e8ffd6] rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-[#99d363]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        );
      case 'warning':
        return (
          <div className="w-10 h-10 bg-[#e8ffd6] rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-[#99d363]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        );
      case 'error':
        return (
          <div className="w-10 h-10 bg-[#e8ffd6] rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-[#99d363]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-10 h-10 bg-[#e8ffd6] rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-[#99d363]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-[100]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={handleClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ 
              duration: 0.2,
              ease: [0.4, 0, 0.2, 1]
            }}
            className="relative bg-white rounded-2xl shadow-2xl w-[90%] max-w-sm overflow-hidden border border-gray-100"
          >
            <div className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">{getIcon()}</div>
                <div className="flex-1 min-w-0">
                  {title && <h3 className="text-lg font-medium text-gray-900 mb-1">{title}</h3>}
                  <p className="text-gray-600 text-base leading-relaxed">{message}</p>
                </div>
              </div>
              {(onConfirm || onCancel) && (
                <div className="mt-6 flex justify-end gap-3">
                  {(onCancel || cancelText) && (
                    <button
                      onClick={handleCancel}
                      className="px-4 py-2 text-gray-600 hover:text-[#99d363] transition-colors duration-200 text-sm font-medium"
                    >
                      {cancelText}
                    </button>
                  )}
                  {(onConfirm || confirmText) && (
                    <button
                      onClick={handleConfirm}
                      className="px-6 py-2 bg-[#99d363] text-black rounded-full hover:bg-[#8bc455] transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md active:scale-95"
                    >
                      {confirmText}
                    </button>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Dialog;
