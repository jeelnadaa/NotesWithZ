import React from 'react';
import { getThemeContent } from '../utils/themeContent';
import {
    Plus,
    Search,
    Archive,
    Trash2,
    Zap,
    Folder,
    FolderOpen,
    ShieldAlert,
    Moon,
    Sun,
    Hash,
    X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Sidebar = ({
    folders,
    onCreateNote,
    selectedFolder,
    onSelectFolder,
    onAddFolder,
    onDeleteFolder,
    searchQuery,
    onSearch,
    isDarkMode,
    toggleTheme,
    currentAccent,
    onSetAccent,
    onShowImportant,
    onOpenStackModal,
    isOpen,
    onClose
}) => {
    const content = getThemeContent(currentAccent);

    return (
        <>
            {/* Mobile Overlay */}
            <div
                className={`md:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />

            <aside className={`
                fixed md:relative z-50 
                w-[85vw] md:w-80 h-[100dvh] md:h-full 
                bg-cream-100/95 md:bg-cream-100/80 dark:bg-dark-sidebar/95 md:dark:bg-dark-sidebar/90 backdrop-blur-xl 
                flex flex-col p-6 md:p-8 flex-shrink-0 font-sans 
                transition-all duration-300 ease-in-out
                border-r md:border border-white/40 dark:border-white/5 shadow-2xl 
                md:ml-4 md:my-4 md:rounded-[32px]
                top-0 left-0
                ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3 cursor-pointer group" onClick={() => { onSelectFolder(null); onClose?.(); }}>
                        <div className="w-12 h-12 bg-black dark:bg-white rounded-[18px] flex items-center justify-center flex-shrink-0 shadow-soft group-hover:rotate-6 transition-transform duration-300">
                            <Zap size={24} className="text-[#ccff33] fill-[#ccff33] dark:text-black dark:fill-black" />
                        </div>
                        <div>
                            <h1 className="font-black text-3xl tracking-tighter leading-none text-gray-900 dark:text-white">NoteZ</h1>
                        </div>
                    </div>

                    {/* Close Button (Mobile Only) */}
                    <button
                        onClick={onClose}
                        className="md:hidden p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Primary Actions */}
                <div className="mb-6">
                    <button
                        onClick={() => { onCreateNote(); onClose?.(); }}
                        className="w-full bg-coral hover:bg-coral-hover text-white rounded-[20px] py-4 px-6 flex items-center justify-between transition-all hover:scale-[1.02] active:scale-[0.98] shadow-soft shadow-coral/30 group mb-6"
                    >
                        <span className="flex items-center gap-3 font-bold text-lg font-mono">
                            <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                                <Plus size={18} strokeWidth={3} />
                            </span>
                            {content.spillTea}
                        </span>
                    </button>

                    {/* Search Bar */}
                    <div className="relative group transition-transform duration-200 hover:scale-[1.02]">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-coral transition-colors">
                            <Search size={20} />
                        </div>
                        <input
                            type="text"
                            placeholder={content.vibeCheck}
                            value={searchQuery}
                            onChange={(e) => onSearch(e.target.value)}
                            className="w-full bg-white/50 dark:bg-dark-surface/50 text-gray-900 dark:text-white placeholder-gray-400 pl-11 pr-4 py-4 rounded-[18px] transition-all text-sm font-bold shadow-sm border-2 border-transparent focus:border-coral/20 outline-none font-mono"
                        />
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-2">

                    {/* Main Navigation Group */}
                    <nav className="font-mono space-y-2">
                        <button
                            onClick={() => onSelectFolder('ARCHIVE')}
                            className={`w-full flex items-center gap-4 px-5 py-3.5 text-sm font-bold rounded-[18px] transition-all duration-200 ${selectedFolder === 'ARCHIVE'
                                ? 'bg-white dark:bg-dark-surface text-black dark:text-white shadow-soft dark:shadow-none translate-x-1 ring-1 ring-black/5 dark:ring-white/10'
                                : 'text-gray-500 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'
                                }`}
                        >
                            <Archive size={20} />
                            {content.vault}
                        </button>

                        <button
                            onClick={() => onSelectFolder(null)}
                            className={`w-full flex items-center gap-4 px-5 py-3.5 text-sm font-bold rounded-[18px] transition-all duration-200 ${selectedFolder === null
                                ? 'bg-white dark:bg-dark-surface text-black dark:text-white shadow-soft dark:shadow-none translate-x-1 ring-1 ring-black/5 dark:ring-white/10'
                                : 'text-gray-500 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'
                                }`}
                        >
                            {selectedFolder === null ? <FolderOpen size={20} className="text-coral" /> : <Folder size={20} />}
                            {content.stash}
                        </button>
                    </nav>

                    {/* Divider */}
                    <div className="py-4 flex items-center gap-3">
                        <div className="h-px bg-gray-200 dark:bg-white/10 flex-1" />
                        <span className="text-[10px] font-black tracking-widest text-gray-400 dark:text-gray-600 uppercase font-mono">{content.stacks}</span>
                        <div className="h-px bg-gray-200 dark:bg-white/10 flex-1" />
                    </div>

                    {/* Stacks Group */}
                    <div className="space-y-2 font-mono">
                        {/* Prominent New Stack Button */}
                        <button
                            onClick={onOpenStackModal}
                            className="w-full flex items-center justify-between px-5 py-3.5 text-xs font-bold rounded-[18px] transition-all duration-200 bg-coral/10 hover:bg-coral/20 text-coral border border-coral/20 group mb-2"
                        >
                            <span className="flex items-center gap-2">
                                <Folder size={16} className="fill-coral/20" />
                                {content.newStack}
                            </span>
                            <div className="bg-coral text-white rounded-lg p-1 group-hover:scale-110 transition-transform">
                                <Plus size={14} strokeWidth={3} />
                            </div>
                        </button>

                        {/* Folder List */}
                        <AnimatePresence mode='popLayout'>
                            {folders.map((folder) => (
                                <motion.div
                                    key={folder.id}
                                    layout
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    className="group/item relative"
                                >
                                    <button
                                        onClick={() => onSelectFolder(folder.id)}
                                        className={`w-full flex items-center gap-4 px-5 py-3.5 text-sm font-bold rounded-[18px] transition-all duration-200 ${selectedFolder === folder.id
                                            ? 'bg-white dark:bg-dark-surface text-black dark:text-white shadow-soft dark:shadow-none translate-x-1 ring-1 ring-black/5 dark:ring-white/10'
                                            : 'text-gray-500 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'
                                            }`}
                                    >
                                        <div className={`transition-colors ${selectedFolder === folder.id ? 'text-coral' : 'text-gray-300 dark:text-gray-600'}`}>
                                            <Folder size={20} className={selectedFolder === folder.id ? 'fill-coral/20' : ''} />
                                        </div>
                                        {folder.name}
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); onDeleteFolder(folder.id); }}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-300 hover:text-coral hover:bg-coral/10 rounded-xl opacity-0 group-hover/item:opacity-100 transition-all"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Footer / Important */}
                <div className="mt-6 pt-2 border-t border-gray-100 dark:border-white/5 space-y-4">
                    {/* Theme Controls */}
                    <div className="flex items-center justify-between p-2 bg-white/50 dark:bg-white/5 rounded-2xl">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-2">Theme</span>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => onSetAccent('pink')}
                                className={`w-6 h-6 rounded-full bg-[#FF9EAA] transition-transform hover:scale-110 ${currentAccent === 'pink' ? 'ring-2 ring-offset-2 ring-[#FF9EAA] ring-offset-cream-100 dark:ring-offset-dark-sidebar scale-90' : ''}`}
                                title="Pink Theme"
                            />
                            <button
                                onClick={() => onSetAccent('blue')}
                                className={`w-6 h-6 rounded-full bg-[#60A5FA] transition-transform hover:scale-110 ${currentAccent === 'blue' ? 'ring-2 ring-offset-2 ring-[#60A5FA] ring-offset-cream-100 dark:ring-offset-dark-sidebar scale-90' : ''}`}
                                title="Blue Theme"
                            />
                            <div className="w-px h-4 bg-gray-300 dark:bg-white/20 mx-1" />
                            <button
                                onClick={toggleTheme}
                                className="w-6 h-6 rounded-full flex items-center justify-center text-gray-400 dark:text-gray-300 hover:text-coral dark:hover:text-coral transition-all duration-500 hover:rotate-180"
                            >
                                {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
                            </button>
                        </div>
                    </div>

                    <button
                        onClick={onShowImportant}
                        className="w-full bg-coral hover:bg-coral-hover text-white py-3 rounded-2xl flex items-center justify-center gap-2 font-bold text-sm uppercase font-mono tracking-wide transition-colors shadow-soft shadow-coral/30"
                    >
                        <ShieldAlert size={18} />
                        {content.realTalk}
                    </button>
                </div>
            </aside >
        </>
    );
};
