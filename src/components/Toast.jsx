import React, { useEffect } from 'react';
import { Check, X, Trash2, Sparkles, Info } from 'lucide-react';

export const Toast = ({ message, type = 'success', onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const icons = {
        success: <Check size={18} strokeWidth={3} />,
        delete: <Trash2 size={18} />,
        info: <Info size={18} />
    };

    const styles = {
        success: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800',
        delete: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800',
        info: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800'
    };

    const Config = {
        success: { icon: Check, bg: 'bg-green-500', text: 'text-white' },
        delete: { icon: Trash2, bg: 'bg-red-500', text: 'text-white' },
        info: { icon: Sparkles, bg: 'bg-coral', text: 'text-white' }
    };

    const activeConfig = Config[type] || Config.success;
    const Icon = activeConfig.icon;

    return (
        <div className="flex items-center gap-3 bg-white dark:bg-dark-surface p-4 rounded-2xl shadow-2xl border border-white/20 backdrop-blur-md animate-slideInRight min-w-[300px]">
            <div className={`w-8 h-8 rounded-full ${activeConfig.bg} ${activeConfig.text} flex items-center justify-center shadow-lg`}>
                <Icon size={16} strokeWidth={3} />
            </div>
            <div className="flex-1">
                <p className="font-bold text-gray-900 dark:text-white text-sm">{message}</p>
            </div>
            <button
                onClick={onClose}
                className="p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded-full text-gray-400 transition-colors"
            >
                <X size={14} />
            </button>
        </div>
    );
};

export const ToastContainer = ({ toasts, removeToast }) => {
    return (
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
            {toasts.map(toast => (
                <div key={toast.id} className="pointer-events-auto">
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        onClose={() => removeToast(toast.id)}
                    />
                </div>
            ))}
        </div>
    );
};
