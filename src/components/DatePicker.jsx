import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, X, Clock } from 'lucide-react';
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

export const DatePicker = ({ filter, onFilterChange }) => {
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
                if (filter.type === 'specific' && filter.date && isSameDay(day, filter.date)) {
                    isSelected = true;
                } else if (filter.type === 'interval' && filter.start && filter.end) {
                    if (day >= filter.start && day <= filter.end) {
                        isRange = true;
                        if (isSameDay(day, filter.start) || isSameDay(day, filter.end)) {
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
                            ${isRange ? "bg-coral/10 dark:bg-coral/20 first:rounded-l-full last:rounded-r-full" : "rounded-full"}
                            ${isSelected ? "bg-coral text-white shadow-lg shadow-coral/30 scale-110 z-10 font-bold" : "hover:bg-black/5 dark:hover:bg-white/10"}
                        `}
                        onClick={() => handleDateClick(cloneDay)}
                    >
                        {formattedDate}
                        {isSameDay(day, new Date()) && !isSelected && (
                            <div className="absolute bottom-1 w-1 h-1 bg-coral rounded-full"></div>
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
        if (filter.type === 'interval' && filter.start && !filter.end) {
            if (day < filter.start) {
                onFilterChange({ type: 'interval', start: day, end: filter.start });
            } else {
                onFilterChange({ type: 'interval', start: filter.start, end: day });
            }
        } else {
            if (filter.mode === 'select-interval') {
                if (!filter.start || (filter.start && filter.end)) {
                    onFilterChange({ ...filter, start: day, end: null, date: null });
                } else {
                    if (day < filter.start) {
                        onFilterChange({ ...filter, type: 'interval', start: day, end: filter.start, mode: 'ready' });
                    } else {
                        onFilterChange({ ...filter, type: 'interval', start: filter.start, end: day, mode: 'ready' });
                    }
                }
            } else {
                onFilterChange({ type: 'specific', date: day });
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
        if (filter.type === 'preset') {
            if (filter.value === 'all') return 'All Time';
            return filter.value === 'today' ? 'Today' : filter.value === 'week' ? 'This Week' : 'This Month';
        }
        if (filter.type === 'specific') {
            return format(filter.date, 'MMM d');
        }
        if (filter.type === 'interval') {
            if (!filter.start) return 'Pick dates...';
            if (!filter.end) return `${format(filter.start, 'MMM d')} - ...`;
            return `${format(filter.start, 'MMM d')} - ${format(filter.end, 'MMM d')}`;
        }
        return 'Filter';
    };

    return (
        <div className="relative z-50" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-3 px-5 py-2.5 rounded-[20px] shadow-sm text-sm font-bold transition-all duration-300 border border-transparent
                   ${isOpen ? 'bg-coral text-white shadow-soft shadow-coral/30 scale-105' : 'bg-white dark:bg-dark-surface hover:shadow-md text-gray-900 dark:text-white'}
                `}
            >
                <CalendarIcon size={18} />
                <span>{getLabel()}</span>
                {filter.type !== 'preset' && (
                    <div onClick={(e) => { e.stopPropagation(); onFilterChange({ type: 'preset', value: 'all' }); }} className="ml-1 p-0.5 hover:bg-black/10 dark:hover:bg-white/20 rounded-full">
                        <X size={12} />
                    </div>
                )}
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
                                    onClick={() => { onFilterChange({ type: 'preset', value: p.value }); setIsOpen(false); }}
                                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${filter.type === 'preset' && filter.value === p.value
                                        ? 'bg-white dark:bg-white/10 text-coral shadow-sm'
                                        : 'text-gray-500 dark:text-gray-400 hover:text-coral'
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
                                onClick={() => onFilterChange({ ...filter, type: 'interval', start: null, end: null, mode: 'select-interval' })}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${filter.type === 'interval'
                                    ? 'bg-coral/10 text-coral'
                                    : 'text-gray-400 hover:text-coral hover:bg-coral/5'
                                    }`}
                            >
                                <Clock size={14} />
                                {filter.type === 'interval' ? 'Select Range' : 'Custom Range'}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
