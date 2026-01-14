import React from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

export const ConfirmationModal = ({ isOpen, title, message, onConfirm, onCancel, confirmText = "Yeet it", cancelText = "Nah, keep it" }) => {

    // Handle Keyboard Shortcuts
    React.useEffect(() => {
        const handleKeyDown = (e) => {
            if (!isOpen) return;
            if (e.key === 'Escape') onCancel();
            if (e.key === 'Enter') onConfirm();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onCancel, onConfirm]);

    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", bounce: 0.4 }}
                className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 border border-gray-100"
            >
                <div className="flex items-center gap-3 mb-4 text-[#FF6B6B]">
                    <div className="p-3 bg-[#FF6B6B]/10 rounded-full">
                        <AlertTriangle size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{title}</h3>
                </div>

                <p className="text-gray-600 mb-8 leading-relaxed">
                    {message}
                </p>

                <div className="flex gap-3 justify-end">
                    <button
                        onClick={onCancel}
                        className="px-6 py-2.5 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-6 py-2.5 rounded-xl font-bold bg-black text-white hover:bg-gray-800 transition-transform active:scale-95 shadow-lg shadow-gray-200"
                    >
                        {confirmText}
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};
