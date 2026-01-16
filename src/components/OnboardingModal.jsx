import React from 'react';
import { motion } from 'framer-motion';
import { User, Sparkles } from 'lucide-react';

export const OnboardingModal = ({ onSelect }) => {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/90 dark:bg-gray-900/95 rounded-[32px] p-8 max-w-md w-full shadow-2xl border border-white/20 text-center relative overflow-hidden"
            >
                {/* Background Decoration */}
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-pink-300/30 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-300/30 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-soft">
                        <Sparkles size={32} className="text-gray-900 dark:text-white" />
                    </div>

                    <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2 tracking-tighter">Welcome to NoteZ</h2>
                    <p className="text-gray-500 font-medium mb-8">Let's set your vibe. Who's driving?</p>

                    <div className="grid grid-cols-3 gap-3">
                        <button
                            onClick={() => onSelect('male')}
                            className="group flex flex-col items-center justify-center p-4 rounded-2xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 border border-blue-100 dark:border-blue-800 transition-all hover:scale-105"
                        >
                            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mb-2 text-white shadow-lg shadow-blue-500/30 group-hover:rotate-6 transition-transform">
                                <span className="text-lg font-bold">🙋‍♂️</span>
                            </div>
                            <span className="font-bold text-sm text-blue-600 dark:text-blue-400">Male</span>
                            <span className="text-[10px] text-blue-400 dark:text-blue-500 mt-0.5 font-mono uppercase tracking-wide">Blue</span>
                        </button>

                        <button
                            onClick={() => onSelect('female')}
                            className="group flex flex-col items-center justify-center p-4 rounded-2xl bg-pink-50 hover:bg-pink-100 dark:bg-pink-900/20 dark:hover:bg-pink-900/30 border border-pink-100 dark:border-pink-800 transition-all hover:scale-105"
                        >
                            <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center mb-2 text-white shadow-lg shadow-pink-500/30 group-hover:-rotate-6 transition-transform">
                                <span className="text-lg font-bold">🙋‍♀️</span>
                            </div>
                            <span className="font-bold text-sm text-pink-600 dark:text-pink-400">Female</span>
                            <span className="text-[10px] text-pink-400 dark:text-pink-500 mt-0.5 font-mono uppercase tracking-wide">Pink</span>
                        </button>

                        <button
                            onClick={() => onSelect('uncle')}
                            className="group flex flex-col items-center justify-center p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 dark:bg-gray-800/40 dark:hover:bg-gray-800/60 border border-gray-200 dark:border-gray-700 transition-all hover:scale-105"
                        >
                            <div className="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center mb-2 text-white shadow-lg shadow-gray-500/30 group-hover:scale-110 transition-transform">
                                <span className="text-xl font-bold">👴</span>
                            </div>
                            <span className="font-bold text-sm text-gray-600 dark:text-gray-300">Uncle</span>
                            <span className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5 font-mono uppercase tracking-wide">25+</span>
                        </button>
                    </div>

                    <p className="mt-8 text-xs text-gray-400 font-bold uppercase tracking-widest">
                        Onboarding • Vibe Coded
                    </p>
                </div>
            </motion.div>
        </div>
    );
};
