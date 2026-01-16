import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, X, Clock, ChevronDown } from 'lucide-react';
import {
    format,
    addMonths,
    subMonths,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    addDays,
    isSameMonth,
    isSameDay
} from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

export const DatePicker = ({ selectedFilter, onChange, currentAccent }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClick = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const renderHeader = () => {
        return (
            <div className="flex items-center justify-between mb-6 px-2">
                <button
                    onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                    className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors"
                >
                    <ChevronLeft size={18} className="text-gray-600 dark:text-gray-300" />
                </button>
                <motion.span
                    key={currentMonth.toString()}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-base font-black text-gray-900 dark:text-white capitalize"
                >
                    {format(currentMonth, 'MMMM yyyy')}
                </motion.span>
                <button
                    onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                    className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors"
                >
                    <ChevronRight size={18} className="text-gray-600 dark:text-gray-300" />
                </button>
            </div>
        );
    };

    const renderDays = () => {
        const dateFormat = "EEEE";
        const days = [];
        let startDate = startOfWeek(currentMonth);

        for (let i = 0; i < 7; i++) {
            days.push(
                <div key={i} className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest text-center py-2">
                    {format(addDays(startDate, i), dateFormat).substring(0, 2)}
                </div>
            );
        }
        return <div className="grid grid-cols-7 mb-2">{days}</div>;
    };

    const renderCells = () => {
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart);
        const endDate = endOfWeek(monthEnd);

        const rows = [];
        let days = [];
        let day = startDate;
        let formattedDate = "";

        while (day <= endDate) {
            for (let i = 0; i < 7; i++) {
                formattedDate = format(day, "d");
                const cloneDay = day;

                let isSelected = false;
                let isRange = false;

                // Check selection state logic
                if (selectedFilter.type === 'specific' && selectedFilter.date && isSameDay(day, selectedFilter.date)) {
                    isSelected = true;
                } else if (selectedFilter.type === 'interval' && selectedFilter.start && selectedFilter.end) {
                    if (day >= selectedFilter.start && day <= selectedFilter.end) {
                        isRange = true;
                        if (isSameDay(day, selectedFilter.start) || isSameDay(day, selectedFilter.end)) {
                            isSelected = true;
                            isRange = false;
                        }
                    }
                }

                days.push(
                    <div
                        key={day}
                        className={`relative h-9 flex items-center justify-center text-sm font-medium transition-all duration-200 cursor-pointer
                            ${!isSameMonth(day, monthStart) ? "text-gray-300 dark:text-white/20" : "text-gray-700 dark:text-gray-200"}
                            ${isRange ? (currentAccent === 'uncle' ? "bg-gray-200 dark:bg-gray-700 first:rounded-l-full last:rounded-r-full" : "bg-coral/10 dark:bg-coral/20 first:rounded-l-full last:rounded-r-full") : "rounded-full"}
                            ${isSelected ? (currentAccent === 'uncle' ? "bg-gray-900 dark:bg-white text-white dark:text-black shadow-lg shadow-gray-500/30 scale-110 z-10 font-bold" : "bg-coral text-white shadow-lg shadow-coral/30 scale-110 z-10 font-bold") : "hover:bg-black/5 dark:hover:bg-white/10"}
                        `}
                        onClick={() => handleDateClick(cloneDay)}
                    >
                        {formattedDate}
                        {isSameDay(day, new Date()) && !isSelected && (
                            <div className={`absolute bottom-1 w-1 h-1 rounded-full ${currentAccent === 'uncle' ? 'bg-gray-900 dark:bg-white' : 'bg-coral'}`}></div>
                        )}
                    </div>
                );
                day = addDays(day, 1);
            }
            rows.push(
                <div className="grid grid-cols-7 gap-y-1 mb-1" key={day}>
                    {days}
                </div>
            );
            days = [];
        }
        return <div className="mt-2">{rows}</div>;
    };

    const handleDateClick = (day) => {
        if (selectedFilter.type === 'interval' && selectedFilter.start && !selectedFilter.end) {
            if (day < selectedFilter.start) {
                onChange({ type: 'interval', start: day, end: selectedFilter.start });
            } else {
                onChange({ type: 'interval', start: selectedFilter.start, end: day });
            }
        } else {
            if (selectedFilter.mode === 'select-interval') {
                if (!selectedFilter.start || (selectedFilter.start && selectedFilter.end)) {
                    onChange({ ...selectedFilter, start: day, end: null, date: null });
                } else {
                    if (day < selectedFilter.start) {
                        onChange({ ...selectedFilter, type: 'interval', start: day, end: selectedFilter.start, mode: 'ready' });
                    } else {
                        onChange({ ...selectedFilter, type: 'interval', start: selectedFilter.start, end: day, mode: 'ready' });
                    }
                }
            } else {
                onChange({ type: 'specific', date: day });
            }
        }
    };

    const presets = [
        { label: 'All', value: 'all' },
        { label: 'Today', value: 'today' },
        { label: 'Week', value: 'week' },
        { label: 'Month', value: 'month' },
    ];

    const getLabel = () => {
        if (selectedFilter.type === 'preset') {
            if (selectedFilter.value === 'all') return 'All Time';
            return selectedFilter.value === 'today' ? 'Today' : selectedFilter.value === 'week' ? 'This Week' : 'This Month';
        }
        if (selectedFilter.type === 'specific') {
            return format(selectedFilter.date, 'MMM d');
        }
        if (selectedFilter.type === 'interval') {
            if (!selectedFilter.start) return 'Pick dates...';
            if (!selectedFilter.end) return `${format(selectedFilter.start, 'MMM d')} - ...`;
            return `${format(selectedFilter.start, 'MMM d')} - ${format(selectedFilter.end, 'MMM d')}`;
        }
        return 'Filter';
    };

    return (
        <div className="relative z-50" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${isOpen
                    ? currentAccent === 'uncle'
                        ? 'bg-gray-100 border-gray-400 dark:bg-white/10 dark:border-white/20'
                        : 'bg-coral/10 border-coral/20'
                    : 'bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20'
                    }`}
            >
                <CalendarIcon size={16} className={isOpen ? (currentAccent === 'uncle' ? 'text-gray-900 dark:text-white' : 'text-coral') : 'text-gray-500'} />
                <span className={`text-sm font-bold ${isOpen ? (currentAccent === 'uncle' ? 'text-gray-900 dark:text-white' : 'text-coral') : 'text-gray-600 dark:text-gray-400'}`}>
                    {getLabel()}
                </span>
                {selectedFilter.type !== 'preset' && (
                    <div onClick={(e) => { e.stopPropagation(); onChange({ type: 'preset', value: 'all' }); }} className="ml-1 p-0.5 hover:bg-black/10 dark:hover:bg-white/20 rounded-full">
                        <X size={12} />
                    </div>
                )}
                <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''} ${isOpen ? (currentAccent === 'uncle' ? 'text-gray-900 dark:text-white' : 'text-coral') : 'text-gray-400'}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ type: "spring", duration: 0.4, bounce: 0.2 }}
                        className="absolute top-14 right-0 bg-white/80 dark:bg-[#1A1A1A]/90 backdrop-blur-2xl p-6 rounded-[32px] shadow-2xl w-80 border border-white/20 overflow-hidden"
                    >
                        {/* Decorative background blur */}
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-coral/10 rounded-full blur-3xl pointer-events-none" />
                        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />

                        {/* Presets */}
                        <div className="flex gap-2 mb-6 p-1 bg-gray-100/50 dark:bg-white/5 rounded-2xl relative z-10">
                            {presets.map(p => (
                                <button
                                    key={p.value}
                                    onClick={() => { onChange({ type: 'preset', value: p.value }); setIsOpen(false); }}
                                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${selectedFilter.type === 'preset' && selectedFilter.value === p.value
                                        ? currentAccent === 'uncle'
                                            ? 'bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm'
                                            : 'bg-white dark:bg-white/10 text-coral shadow-sm'
                                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                        }`}
                                >
                                    {p.label}
                                </button>
                            ))}
                        </div>

                        {/* Calendar */}
                        <div className="relative z-10">
                            {renderHeader()}
                            {renderDays()}
                            {renderCells()}
                        </div>

                        {/* Range Toggle */}
                        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/5 flex justify-center relative z-10">
                            <button
                                onClick={() => onChange({ ...selectedFilter, type: 'interval', start: null, end: null, mode: 'select-interval' })}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${selectedFilter.type === 'interval'
                                    ? currentAccent === 'uncle'
                                        ? 'bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white'
                                        : 'bg-coral/10 text-coral'
                                    : currentAccent === 'uncle'
                                        ? 'text-gray-400 hover:text-gray-900 dark:text-gray-500 dark:hover:text-white dark:hover:bg-white/5'
                                        : 'text-gray-400 hover:text-coral hover:bg-coral/5'
                                    }`}
                            >
                                <Clock size={14} />
                                {selectedFilter.type === 'interval' ? 'Select Range' : 'Custom Range'}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
