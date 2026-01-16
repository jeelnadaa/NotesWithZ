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

    // Reset state when opening
    useEffect(() => {
        if (isOpen) {
            setPin(['', '', '', '']);
            setConfirmPin(['', '', '', '']);
            setStep(mode === 'set' ? 'create' : 'enter');
            setError('');
            // Focus first input after animation
            setTimeout(() => {
                inputRefs.current[0]?.focus();
            }, 300);
        }
    }, [isOpen, mode]);

    const content = getThemeContent(currentAccent);

    const handleInput = (index, value, isConfirm = false) => {
        if (!/^\d*$/.test(value)) return;

        const newPin = isConfirm ? [...confirmPin] : [...pin];
        newPin[index] = value.slice(-1); // Only take last char

        if (isConfirm) setConfirmPin(newPin);
        else setPin(newPin);
        setError('');

        // Auto-advance
        if (value && index < 3) {
            const nextInput = isConfirm ? confirmInputRefs.current[index + 1] : inputRefs.current[index + 1];
            nextInput?.focus();
        }
    };

    const handleKeyDown = (index, e, isConfirm = false) => {
        if (e.key === 'Backspace' && !(isConfirm ? confirmPin[index] : pin[index]) && index > 0) {
            const prevInput = isConfirm ? confirmInputRefs.current[index - 1] : inputRefs.current[index - 1];
            prevInput?.focus();
        }
    };

    const handleSubmit = () => {
        if (step === 'create') {
            if (pin.some(d => d === '')) return;
            setStep('confirm');
            setTimeout(() => confirmInputRefs.current[0]?.focus(), 100);
            return;
        }

        if (step === 'confirm') {
            if (pin.join('') !== confirmPin.join('') && confirmPin.join('').length === 4) {
                setError(content.pwdMismatch);
                setConfirmPin(['', '', '', '']);
                confirmInputRefs.current[0]?.focus();
                return;
            }
            if (pin.join('') === confirmPin.join('')) {
                onSuccess(pin.join(''));
                onClose();
            }
            return;
        }

        if (step === 'enter') {
            const result = onSuccess(pin.join(''));
            if (!result) {
                setError(content.pwdError);
                setPin(['', '', '', '']);
                inputRefs.current[0]?.focus();
            } else {
                onClose();
            }
        }
    };

    // Auto-submit when 4 digits filled
    useEffect(() => {
        if (step === 'create' && pin.every(d => d !== '')) {
            // Wait a beat before moving to confirm
            const timer = setTimeout(handleSubmit, 300);
            return () => clearTimeout(timer);
        }
        if (step === 'confirm' && confirmPin.every(d => d !== '')) {
            const timer = setTimeout(handleSubmit, 300);
            return () => clearTimeout(timer);
        }
        if (step === 'enter' && pin.every(d => d !== '')) {
            const timer = setTimeout(handleSubmit, 300);
            return () => clearTimeout(timer);
        }
    }, [pin, confirmPin, step]);

    // Theme Colors
    const getColors = () => {
        if (currentAccent === 'uncle') return {
            bg: 'bg-white dark:bg-gray-900',
            text: 'text-gray-900 dark:text-white',
            accent: 'bg-gray-900 dark:bg-white text-white dark:text-black',
            ring: 'focus:ring-gray-900 dark:focus:ring-white'
        };
        if (currentAccent === 'blue') return {
            bg: 'bg-blue-50 dark:bg-[#0f1722]',
            text: 'text-gray-900 dark:text-white',
            accent: 'bg-blue-500 text-white',
            ring: 'focus:ring-blue-500'
        };
        return {
            bg: 'bg-[#fff5f7] dark:bg-[#1a0f12]',
            text: 'text-gray-900 dark:text-white',
            accent: 'bg-coral text-white',
            ring: 'focus:ring-coral'
        };
    };

    const colors = getColors();

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
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className={`relative w-full max-w-sm ${colors.bg} rounded-[32px] p-8 shadow-2xl border border-white/20`}
                    >
                        {/* Close button */}
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
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
