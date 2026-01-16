import React, { useState, useEffect } from 'react';
import { X, Check, Sparkles, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getThemeContent } from '../utils/themeContent';

export const NewStackModal = ({ isOpen, onClose, onCreate, folders, currentAccent }) => {
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const content = getThemeContent(currentAccent);

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
            setError(currentAccent === 'uncle' ? "Please enter a folder name." : "Bestie, give it a name! 💅");
            return;
        }

        if (folders.some(f => f.name.toLowerCase() === trimmed.toLowerCase())) {
            setError(currentAccent === 'uncle' ? "A folder with this name already exists." : "This stack already exists! Be original 🙄");
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
                className={`w-full max-w-sm p-6 rounded-[32px] shadow-2xl border-2 transform ${currentAccent === 'uncle'
                    ? 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700'
                    : 'bg-white dark:bg-dark-surface border-coral/20'
                    }`}
            >
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter">
                        {content.stackModalTitle}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors">
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="relative mb-6">
                        <input
                            autoFocus
                            type="text"
                            placeholder={content.stackModalPlaceholder}
                            value={name}
                            onChange={(e) => { setName(e.target.value); setError(''); }}
                            className={`w-full border-2 rounded-xl px-4 py-3 font-bold outline-none transition-all
                                ${currentAccent === 'uncle'
                                    ? 'bg-gray-50 dark:bg-black/20 focus:border-gray-900 dark:focus:border-white text-gray-900 dark:text-white placeholder-gray-400'
                                    : 'bg-cream-50 dark:bg-black/20 focus:border-coral/50 text-gray-900 dark:text-white placeholder-gray-400 border-transparent'
                                }`}
                        />
                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className={`absolute bottom-full mb-4 left-0 w-full p-4 rounded-2xl shadow-xl border-2 flex items-center gap-3 z-20 origin-bottom
                                        ${currentAccent === 'uncle'
                                            ? 'bg-white dark:bg-gray-800 border-black dark:border-white'
                                            : 'bg-white dark:bg-gray-800 border-red-100 dark:border-red-900/30'
                                        }`}
                                >
                                    <div className={`p-2.5 rounded-xl ${currentAccent === 'uncle' ? 'bg-gray-100 dark:bg-gray-700 text-black dark:text-white' : 'bg-red-100 dark:bg-red-900/30 text-red-500'}`}>
                                        <ShieldAlert size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className={`font-black text-xs uppercase tracking-widest mb-0.5 ${currentAccent === 'uncle' ? 'text-black dark:text-white' : 'text-red-500'}`}>
                                            {currentAccent === 'uncle' ? 'Error' : 'Hold up!'}
                                        </h4>
                                        <p className="text-xs font-bold text-gray-600 dark:text-gray-300 leading-tight">{error}</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setError('')}
                                        className="p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded-full text-gray-400 dark:text-gray-500 transition-colors"
                                    >
                                        <X size={14} />
                                    </button>
                                    {/* Little triangle arrow pointing down */}
                                    <div className={`absolute -bottom-2.5 left-8 w-5 h-5 border-r-2 border-b-2 transform rotate-45 bg-white dark:bg-gray-800
                                        ${currentAccent === 'uncle' ? 'border-black dark:border-white' : 'border-red-100 dark:border-red-900/30'}`}
                                    ></div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <button
                        type="submit"
                        disabled={!name.trim()}
                        className={`w-full py-4 rounded-2xl flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] active:scale-95 shadow-lg font-black disabled:opacity-50 disabled:cursor-not-allowed
                            ${currentAccent === 'uncle'
                                ? 'bg-gray-900 hover:bg-black dark:bg-white dark:text-black dark:hover:bg-gray-200 text-white shadow-gray-500/20'
                                : 'bg-coral hover:bg-coral-hover text-white shadow-coral/20'
                            }`}
                    >
                        {content.createStackBtn} <Check size={18} strokeWidth={3} />
                    </button>
                </form>
            </motion.div>
        </motion.div>
    );
};
