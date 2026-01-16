import React, { useState, useRef, useEffect } from 'react';
import {
    Bold,
    Italic,
    Underline,
    List,
    ListOrdered,
    X,
    Check,
    Palette,
    ChevronDown,
    Type,
    Folder,
    Hash
} from 'lucide-react';
import { motion } from 'framer-motion';

import { colors } from '../utils/colors';

const fontSizes = [
    { label: 'Small', value: '2' },
    { label: 'Normal', value: '3' },
    { label: 'Large', value: '5' },
    { label: 'Huge', value: '7' },
];

export const Editor = ({ note, onClose, onSave, folders }) => {
    const [title, setTitle] = useState(note?.title || '');
    const [content, setContent] = useState(note?.content || '');
    const [selectedColor, setSelectedColor] = useState(() => {
        const c = note?.color || 'blue';
        return colors.some(col => col.id === c) ? c : 'blue';
    });
    const [selectedFolderId, setSelectedFolderId] = useState(note?.folderId || folders[0]?.id);
    const [isFolderOpen, setIsFolderOpen] = useState(false);
    const [isFontMenuOpen, setIsFontMenuOpen] = useState(false);

    const contentRef = useRef(null);
    const folderRef = useRef(null);

    useEffect(() => {
        if (contentRef.current && contentRef.current.innerHTML !== content) {
            contentRef.current.innerHTML = content;
        }
    }, []);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (folderRef.current && !folderRef.current.contains(event.target)) {
                setIsFolderOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Handle Keyboard Shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    const handleFormat = (command, value = null) => {
        document.execCommand(command, false, value);
        setContent(contentRef.current.innerHTML);
        contentRef.current.focus();
        if (command === 'fontSize') {
            setIsFontMenuOpen(false);
        }
    };

    const handleSave = () => {
        onSave({
            ...note,
            title,
            content: contentRef.current.innerHTML,
            color: selectedColor,
            folderId: selectedFolderId,
        });
        onClose();
    };

    const activeSchema = colors.find(c => c.id === selectedColor) || colors[1]; // Fallback blue
    const activeFolder = folders.find(f => f.id === selectedFolderId) || folders[0];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-md z-[100] flex items-center justify-center p-4"
        >
            <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
                className={`w-full max-w-4xl h-[85vh] ${activeSchema.bg} rounded-[40px] shadow-2xl flex flex-col overflow-hidden border border-white/20`}
            >

                {/* Header */}
                <div className="flex items-center justify-between px-8 py-6">
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Thought Title..."
                        className="text-3xl font-black bg-transparent border-none outline-none text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-200 w-full tracking-tight"
                    />
                    <button
                        onClick={onClose}
                        className="p-3 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors ml-4 text-gray-600 dark:text-gray-300"
                        title="Close"
                    >
                        <X size={28} />
                    </button>
                </div>

                {/* Toolbar */}
                <div className="px-8 pb-4 flex items-center gap-1 overflow-visible relative z-20">
                    <div className="flex bg-white/30 dark:bg-black/10 p-1.5 rounded-2xl backdrop-blur-sm shadow-sm border border-white/10">
                        <ToolbarButton icon={Bold} onClick={() => handleFormat('bold')} title="Bold (Ctrl+B)" />
                        <ToolbarButton icon={Italic} onClick={() => handleFormat('italic')} title="Italic (Ctrl+I)" />
                        <ToolbarButton icon={Underline} onClick={() => handleFormat('underline')} title="Underline (Ctrl+U)" />

                        <div className="w-px h-5 bg-gray-400/30 mx-2 self-center" />

                        {/* Font Size Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setIsFontMenuOpen(!isFontMenuOpen)}
                                title="Font Size"
                                className={`p-2.5 rounded-xl text-gray-700 dark:text-gray-300 transition-colors flex items-center gap-1 ${isFontMenuOpen ? 'bg-white/50 dark:bg-white/10' : 'hover:bg-white/40 dark:hover:bg-black/20'}`}
                            >
                                <Type size={18} />
                                <ChevronDown size={12} className={`transition-transform duration-200 ${isFontMenuOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {isFontMenuOpen && (
                                <div className="absolute top-full left-0 mt-2 w-32 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col p-1 animate-fadeIn origin-top-left z-30">
                                    {fontSizes.map((size) => (
                                        <button
                                            key={size.value}
                                            onClick={() => handleFormat('fontSize', size.value)}
                                            className="px-4 py-2 text-left text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-coral/10 hover:text-coral rounded-lg transition-colors flex items-center justify-between"
                                        >
                                            {size.label}
                                            {size.value === '5' && <span className="text-[10px] bg-gray-100 dark:bg-gray-700 px-1.5 rounded text-gray-500">Lg</span>}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="w-px h-5 bg-gray-400/30 mx-2 self-center" />

                        <ToolbarButton icon={List} onClick={() => handleFormat('insertUnorderedList')} title="Bullet List" />
                        <ToolbarButton icon={ListOrdered} onClick={() => handleFormat('insertOrderedList')} title="Numbered List" />
                    </div>

                    <div className="flex-1" />

                    {/* Color Swatches */}
                    <div className="flex items-center gap-2 bg-white/30 dark:bg-black/10 p-1.5 rounded-2xl backdrop-blur-sm px-3 shadow-sm border border-white/10">
                        <Palette size={16} className="text-gray-500 dark:text-gray-200 mr-1" />
                        {colors.map((c) => (
                            <button
                                key={c.id}
                                onClick={() => setSelectedColor(c.id)}
                                title={c.id.charAt(0).toUpperCase() + c.id.slice(1)}
                                className={`w-6 h-6 rounded-full transition-transform duration-200 border border-white/20 shadow-sm ${c.bg} ${selectedColor === c.id ? 'scale-125 ring-2 ring-gray-900/20 dark:ring-white/50' : 'hover:scale-110'
                                    }`}
                            />
                        ))}
                    </div>
                </div>

                {/* Editor Content */}
                <div className="flex-1 px-10 py-6 overflow-y-auto custom-scrollbar relative z-10">
                    <div
                        ref={contentRef}
                        contentEditable
                        className="outline-none text-lg text-gray-800 dark:text-gray-200 leading-8 font-medium editor-content h-full focus-visible:ring-0 focus-visible:ring-offset-0"
                        onInput={(e) => setContent(e.currentTarget.innerHTML)}
                    />
                </div>

                {/* Footer Controls */}
                <div className="p-6 flex items-center justify-between border-t border-black/5 dark:border-white/5 bg-white/10 dark:bg-black/10 backdrop-blur-md relative z-20">

                    {/* Custom Folder Select */}
                    <div className="relative" ref={folderRef}>
                        <button
                            onClick={() => setIsFolderOpen(!isFolderOpen)}
                            className="bg-white/50 dark:bg-black/20 hover:bg-white/80 dark:hover:bg-black/40 text-gray-800 dark:text-white pl-4 pr-3 py-3 rounded-2xl text-sm font-bold shadow-sm outline-none cursor-pointer transition-all flex items-center gap-3 border border-white/20 min-w-[180px] justify-between group"
                        >
                            <span className="flex items-center gap-2 truncate">
                                <Folder size={16} className="text-gray-500 dark:text-gray-400 group-hover:text-coral transition-colors" />
                                {activeFolder?.name || 'Uncategorized'}
                            </span>
                            <ChevronDown size={16} className={`text-gray-400 transition-transform duration-300 ${isFolderOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isFolderOpen && (
                            <div className="absolute bottom-full left-0 mb-2 w-64 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden flex flex-col p-1 animate-fadeIn origin-bottom-left max-h-60 overflow-y-auto custom-scrollbar">
                                <div className="px-3 py-2 text-xs font-black text-gray-400 uppercase tracking-widest">
                                    Move to Stack
                                </div>
                                {folders.map(f => (
                                    <button
                                        key={f.id}
                                        onClick={() => { setSelectedFolderId(f.id); setIsFolderOpen(false); }}
                                        className={`px-3 py-2.5 rounded-xl text-left text-sm font-bold flex items-center gap-3 transition-colors ${selectedFolderId === f.id ? 'bg-coral/10 text-coral' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'}`}
                                    >
                                        <Hash size={14} className={selectedFolderId === f.id ? 'text-coral' : 'text-gray-400'} />
                                        {f.name}
                                        {selectedFolderId === f.id && <Check size={14} className="ml-auto" />}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <button
                        onClick={handleSave}
                        className="bg-gray-900 dark:bg-white text-white dark:text-black px-8 py-3 rounded-[18px] font-bold text-sm flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-gray-900/10 dark:shadow-none"
                    >
                        <Check size={18} strokeWidth={3} />
                        Save Note
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

const ToolbarButton = ({ icon: Icon, onClick, title }) => (
    <button
        onClick={onClick}
        title={title}
        className="p-2.5 hover:bg-white/40 dark:hover:bg-black/20 rounded-xl text-gray-700 dark:text-gray-300 transition-colors group relative"
    >
        <Icon size={18} />
    </button>
);
