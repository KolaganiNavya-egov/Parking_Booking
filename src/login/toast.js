import React, { createContext, useContext, useState, useCallback } from 'react';

// Toast Context
const ToastContext = createContext();

// Toast Types
const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error', 
  WARNING: 'warning',
  INFO: 'info'
};

// Individual Toast Component
const Toast = ({ toast, onRemove }) => {
  const { id, type, title, message, duration } = toast;
  
  const typeStyles = {
    success: 'border-green-500 bg-green-50',
    error: 'border-red-500 bg-red-50',
    warning: 'border-yellow-500 bg-yellow-50',
    info: 'border-blue-500 bg-blue-50'
  };
  
  const iconStyles = {
    success: 'text-green-600',
    error: 'text-red-600',
    warning: 'text-yellow-600', 
    info: 'text-blue-600'
  };
  
  const progressStyles = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500'
  };
  
  const icons = {
    success: '✓',
    error: '✕', 
    warning: '⚠',
    info: 'ℹ'
  };
  
  // Auto remove toast
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(id);
    }, duration);
    
    return () => clearTimeout(timer);
  }, [id, duration, onRemove]);
  
  return (
    <div className={`relative max-w-sm w-full border-l-4 ${typeStyles[type]} rounded-lg shadow-lg p-4 mb-2 transform transition-all duration-300 ease-in-out animate-slide-in`}>
      {/* Close Button */}
      <button
        onClick={() => onRemove(id)}
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-xl leading-none p-1 hover:bg-gray-200 rounded-full w-6 h-6 flex items-center justify-center transition-colors duration-200"
      >
        ×
      </button>
      
      {/* Content */}
      <div className="flex items-start space-x-3 pr-6">
        {/* Icon */}
        <div className="flex-shrink-0">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${iconStyles[type]}`}>
            {icons[type]}
          </div>
        </div>
        
        {/* Text Content */}
        <div className="flex-1 min-w-0">
          {title && (
            <div className="text-sm font-semibold text-gray-900 mb-1">
              {title}
            </div>
          )}
          <div className="text-sm text-gray-700 leading-relaxed">
            {message}
          </div>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className={`absolute bottom-0 left-0 h-1 ${progressStyles[type]} rounded-bl-lg animate-progress`}
           style={{ animationDuration: `${duration}ms` }}></div>
    </div>
  );
};

// Toast Provider Component
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  
  const addToast = useCallback((toast) => {
    const id = Date.now() + Math.random();
    const newToast = {
      id,
      duration: 3000,
      ...toast
    };
    
    setToasts(prev => [...prev, newToast]);
  }, []);
  
  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);
  
  const toast = {
    success: (message, title = 'Success', duration = 3000) => 
      addToast({ type: TOAST_TYPES.SUCCESS, title, message, duration }),
    
    error: (message, title = 'Error', duration = 4000) => 
      addToast({ type: TOAST_TYPES.ERROR, title, message, duration }),
    
    warning: (message, title = 'Warning', duration = 3500) => 
      addToast({ type: TOAST_TYPES.WARNING, title, message, duration }),
    
    info: (message, title = 'Info', duration = 3000) => 
      addToast({ type: TOAST_TYPES.INFO, title, message, duration }),
    
    // Generic method
    show: (type, message, title, duration = 3000) =>
      addToast({ type, title, message, duration })
  };
  
  return (
    <ToastContext.Provider value={toast}>
      {children}
      
      {/* Toast Container - Fixed position */}
      {toasts.length > 0 && (
        <div className="fixed top-4 right-4 z-50 space-y-2 pointer-events-none">
          {toasts.map((toastItem) => (
            <div key={toastItem.id} className="pointer-events-auto">
              <Toast toast={toastItem} onRemove={removeToast} />
            </div>
          ))}
        </div>
      )}
      
      {/* CSS Animations */}
      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes progress {
          from { width: 100%; }
          to { width: 0%; }
        }
        
        .animate-slide-in {
          animation: slide-in 0.3s ease-out forwards;
        }
        
        .animate-progress {
          animation: progress linear forwards;
        }
      `}</style>
    </ToastContext.Provider>
  );
};

// Hook to use toast
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};