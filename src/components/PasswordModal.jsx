import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Unlock, Key, X } from 'lucide-react';
import { getThemeContent } from '../utils/themeContent';

export const PasswordModal = ({ isOpen, onClose, onSuccess, mode = 'unlock', currentAccent }) => {
    const [pin, setPin] = useState(['', '', '', '']);
    const [confirmPin, setConfirmPin] = useState(['', '', '', '']);
    const [step, setStep] = useState(mode === 'set' ? 'create' : 'enter'); // create, confirm, enter
    const [error, setError] = useState('');
    const inputRefs = useRef([]);
    const confirmInputRefs = useRef([]);

    // Reset state upon opening
    useEffect(() => {
        if (isOpen) {
            setPin(['', '', '', '']);
            setConfirmPin(['', '', '', '']);
            setStep(mode === 'set' ? 'create' : 'enter');
            setError('');
            // Focus first input
            setTimeout(() => {
                const refs = mode === 'set' ? inputRefs : inputRefs; // simplify focus logic
                // For create step, we focus inputRefs
                // For enter step, we focus inputRefs
                if (inputRefs.current[0]) inputRefs.current[0].focus();
            }, 300);
        }
    }, [isOpen, mode]);

    // Handle Escape Key (Only when open)
    useEffect(() => {
        if (!isOpen) return;
        const handleEscape = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    const content = getThemeContent(currentAccent);

    // Get color theme
    const getColors = () => {
        if (currentAccent === 'uncle') return {
            bg: 'bg-white dark:bg-gray-900',
            text: 'text-gray-900 dark:text-white',
            accent: 'bg-gray-900 hover:bg-black dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black',
        };
        if (currentAccent === 'blue') return {
            bg: 'bg-blue-50 dark:bg-[#0f1722]',
            text: 'text-gray-900 dark:text-white',
            accent: 'bg-blue-500 hover:bg-blue-600 text-white',
            ring: 'focus:ring-blue-500'
        };
        return {
            bg: 'bg-[#fff5f7] dark:bg-[#1a0f12]',
            text: 'text-gray-900 dark:text-white',
            accent: 'bg-coral hover:bg-coral-hover text-white',
            ring: 'focus:ring-coral'
        };
    };

    const colors = getColors();

    const handleInput = (index, value, isConfirm = false) => {
        if (!/^\d*$/.test(value)) return;
        const newPin = isConfirm ? [...confirmPin] : [...pin];
        newPin[index] = value.slice(-1);

        if (isConfirm) setConfirmPin(newPin);
        else setPin(newPin);
        setError('');

        // Auto-advance
        if (value && index < 3) {
            const refs = isConfirm ? confirmInputRefs : inputRefs;
            if (refs.current[index + 1]) refs.current[index + 1].focus();
        }
    };

    const handleSubmit = async () => {
        if (step === 'create') {
            if (pin.some(d => d === '')) {
                setError(content.pwdIncomplete);
                return;
            }
            setStep('confirm');
            setTimeout(() => {
                if (confirmInputRefs.current[0]) confirmInputRefs.current[0].focus();
            }, 100);
            return;
        }

        if (step === 'confirm') {
            if (confirmPin.some(d => d === '')) {
                setError(content.pwdIncomplete);
                return;
            }
            if (pin.join('') !== confirmPin.join('') && confirmPin.join('').length === 4) {
                setError(content.pwdMismatch);
                setConfirmPin(['', '', '', '']);
                setTimeout(() => {
                    if (confirmInputRefs.current[0]) confirmInputRefs.current[0].focus();
                }, 100);
                return;
            }
            if (pin.join('') === confirmPin.join('')) {
                onSuccess(pin.join(''));
                onClose();
            }
            return;
        }

        if (step === 'enter') {
            if (pin.some(d => d === '')) {
                setError(content.pwdIncomplete);
                return;
            }
            const result = await onSuccess(pin.join(''));
            if (!result) {
                setError(content.pwdError);
                setPin(['', '', '', '']);
                if (inputRefs.current[0]) inputRefs.current[0].focus();
            } else {
                onClose();
            }
        }
    };

    const handleKeyDown = (index, e, isConfirm = false) => {
        if (e.key === 'Backspace' && !(isConfirm ? confirmPin[index] : pin[index]) && index > 0) {
            const refs = isConfirm ? confirmInputRefs : inputRefs;
            if (refs.current[index - 1]) refs.current[index - 1].focus();
        }
        if (e.key === 'Enter') {
            handleSubmit();
        }
    };

    const title = step === 'create' || step === 'confirm' ? content.pwdTitleSet : content.pwdTitleUnlock;
    const subtitle = step === 'create' ? content.pwdSubtitleSet : (step === 'confirm' ? "Confirm your PIN" : content.pwdSubtitleUnlock);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className={`relative w-full max-w-sm ${colors.bg} rounded-[32px] p-8 shadow-2xl border border-white/20`}
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <div className="flex flex-col items-center text-center">
                            <div className={`w-16 h-16 rounded-full mb-6 flex items-center justify-center ${colors.accent} shadow-soft`}>
                                {step === 'confirm' ? <Key size={28} /> : <Lock size={28} />}
                            </div>

                            <h3 className={`text-2xl font-black mb-2 tracking-tight ${colors.text}`}>
                                {title}
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-8 font-medium text-sm">
                                {subtitle}
                            </p>

                            {/* PIN Inputs */}
                            <div className="flex gap-3 mb-6">
                                {(step === 'confirm' ? confirmPin : pin).map((digit, i) => (
                                    <input
                                        key={i}
                                        ref={el => (step === 'confirm' ? confirmInputRefs : inputRefs).current[i] = el}
                                        type="password"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleInput(i, e.target.value, step === 'confirm')}
                                        onKeyDown={(e) => handleKeyDown(i, e, step === 'confirm')}
                                        className={`w-12 h-14 rounded-2xl border-2 text-center text-2xl font-bold outline-none transition-all
                                            ${digit
                                                ? 'border-transparent bg-white dark:bg-white/10 shadow-sm'
                                                : 'border-gray-200 dark:border-white/10 bg-transparent'
                                            }
                                            ${colors.ring} focus:border-transparent focus:ring-2 ${colors.text}
                                        `}
                                    />
                                ))}
                            </div>

                            {/* Error Message */}
                            <AnimatePresence>
                                {error && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="text-red-500 font-bold text-sm mb-4"
                                    >
                                        {error}
                                    </motion.p>
                                )}
                            </AnimatePresence>

                            {/* Submit Button */}
                            <button
                                onClick={handleSubmit}
                                className={`w-full py-3 rounded-2xl font-bold text-lg transition-all transform active:scale-95
                                    ${colors.accent} shadow-lg hover:shadow-xl
                                `}
                            >
                                {step === 'create' ? content.pwdConfirm : (step === 'confirm' ? content.pwdConfirm : content.pwdUnlock)}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
