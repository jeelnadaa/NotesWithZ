import React, { useState, useEffect } from 'react';
import { X, Check, Sparkles, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';

export const NewStackModal = ({ isOpen, onClose, onCreate, folders }) => {
    const [name, setName] = useState('');
    const [error, setError] = useState('');

    // Reset state when opening
    useEffect(() => {
        if (isOpen) {
            setName('');
            setError('');
        }
    }, [isOpen]);

    // Handle Escape key
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const trimmed = name.trim();

        if (!trimmed) {
            setError("Bestie, give it a name! 💅");
            return;
        }

        if (folders.some(f => f.name.toLowerCase() === trimmed.toLowerCase())) {
            setError("This stack already exists! Be original 🙄");
            return;
        }

        onCreate(trimmed);
    };

    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm"
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="bg-white dark:bg-dark-surface w-full max-w-sm p-6 rounded-[32px] shadow-2xl border-2 border-coral/20 transform"
            >
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                        <Sparkles size={20} className="text-coral" />
                        New Stack
                    </h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full text-gray-400 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="relative mb-6">
                        <input
                            autoFocus
                            type="text"
                            value={name}
                            onChange={(e) => { setName(e.target.value); setError(''); }}
                            placeholder="e.g. Dream Journal ✨"
                            className="w-full bg-cream-50 dark:bg-black/20 text-gray-900 dark:text-white px-5 py-4 rounded-2xl font-bold border-2 border-transparent focus:border-coral/50 outline-none transition-all placeholder:text-gray-400"
                        />
                        {error && (
                            <div className="absolute bottom-full mb-4 left-0 w-full bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-xl border-2 border-red-100 dark:border-red-900/30 flex items-center gap-3 animate-bounce-in z-20 origin-bottom">
                                <div className="bg-red-100 dark:bg-red-900/30 p-2.5 rounded-xl text-red-500">
                                    <ShieldAlert size={20} />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-black text-xs text-red-500 uppercase tracking-widest mb-0.5">Hold up!</h4>
                                    <p className="text-xs font-bold text-gray-600 dark:text-gray-300 leading-tight">{error}</p>
                                </div>
                                <button
                                    onClick={() => setError('')}
                                    className="p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded-full text-gray-400 dark:text-gray-500 transition-colors"
                                >
                                    <X size={14} />
                                </button>
                                {/* Little triangle arrow pointing down */}
                                <div className="absolute -bottom-2.5 left-8 w-5 h-5 bg-white dark:bg-gray-800 border-r-2 border-b-2 border-red-100 dark:border-red-900/30 transform rotate-45"></div>
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-coral hover:bg-coral-hover text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] active:scale-95 shadow-lg shadow-coral/20"
                    >
                        Create Vibe <Check size={18} strokeWidth={3} />
                    </button>
                </form>
            </motion.div>
        </motion.div>
    );
};
