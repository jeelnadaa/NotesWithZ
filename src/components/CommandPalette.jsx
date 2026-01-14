import React, { useEffect, useState } from 'react';
import { Command } from 'cmdk';
import {
    Search,
    Plus,
    FolderPlus,
    Moon,
    Sun,
    Archive,
    Folder,
    ArrowRight,
    Palette
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const CommandPalette = ({
    notes,
    folders,
    onCreateNote,
    onToggleTheme,
    isDarkMode,
    onSetAccent,
    onSelectFolder,
    onOpenStackModal
}) => {
    const [open, setOpen] = useState(false);

    // Toggle with Ctrl+K
    useEffect(() => {
        const down = (e) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };

        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, []);

    const handleSelect = (callback) => {
        setOpen(false);
        callback();
    };

    return (
        <Command.Dialog
            open={open}
            onOpenChange={setOpen}
            label="Command Palette"
            className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh] px-4"
        >
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setOpen(false)} />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                transition={{ type: "spring", duration: 0.3 }}
                className="relative w-full max-w-lg bg-white dark:bg-[#1A1A1A] rounded-2xl shadow-2xl overflow-hidden border border-gray-100 dark:border-white/10"
            >
                <div className="flex items-center border-b border-gray-100 dark:border-white/5 px-4">
                    <Search className="w-5 h-5 text-gray-400 mr-2" />
                    <Command.Input
                        placeholder="Type a command or search..."
                        className="w-full h-14 bg-transparent outline-none text-gray-900 dark:text-gray-100 font-medium placeholder:text-gray-400"
                    />
                </div>

                <Command.List className="max-h-[300px] overflow-y-auto p-2 scroll-py-2 custom-scrollbar">
                    <Command.Empty className="p-4 text-center text-sm text-gray-500">
                        No results found.
                    </Command.Empty>

                    <Command.Group heading="Actions" className="text-xs font-bold text-gray-400 uppercase tracking-widest px-2 py-1 mb-1">
                        <Command.Item
                            onSelect={() => handleSelect(onCreateNote)}
                            className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-coral/10 hover:text-coral transition-colors cursor-pointer data-[selected=true]:bg-coral/10 data-[selected=true]:text-coral"
                        >
                            <Plus size={18} />
                            Create New Note
                        </Command.Item>
                        <Command.Item
                            onSelect={() => handleSelect(onOpenStackModal)}
                            className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-coral/10 hover:text-coral transition-colors cursor-pointer data-[selected=true]:bg-coral/10 data-[selected=true]:text-coral"
                        >
                            <FolderPlus size={18} />
                            Create New Stack
                        </Command.Item>
                    </Command.Group>

                    <div className="h-px bg-gray-100 dark:bg-white/5 my-2 mx-2" />

                    <Command.Group heading="Theme" className="text-xs font-bold text-gray-400 uppercase tracking-widest px-2 py-1 mb-1">
                        <Command.Item
                            onSelect={() => handleSelect(() => onSetAccent('pink'))}
                            className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-coral/10 hover:text-coral transition-colors cursor-pointer data-[selected=true]:bg-coral/10 data-[selected=true]:text-coral"
                        >
                            <span className="w-4 h-4 rounded-full bg-[#FF9EAA] ring-1 ring-gray-200 dark:ring-white/10" />
                            Use Pink Theme
                        </Command.Item>
                        <Command.Item
                            onSelect={() => handleSelect(() => onSetAccent('blue'))}
                            className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-coral/10 hover:text-coral transition-colors cursor-pointer data-[selected=true]:bg-coral/10 data-[selected=true]:text-coral"
                        >
                            <span className="w-4 h-4 rounded-full bg-[#60A5FA] ring-1 ring-gray-200 dark:ring-white/10" />
                            Use Blue Theme
                        </Command.Item>
                        <Command.Item
                            onSelect={() => handleSelect(onToggleTheme)}
                            className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-coral/10 hover:text-coral transition-colors cursor-pointer data-[selected=true]:bg-coral/10 data-[selected=true]:text-coral"
                        >
                            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                            Toggle Dark Mode
                        </Command.Item>
                    </Command.Group>

                    <div className="h-px bg-gray-100 dark:bg-white/5 my-2 mx-2" />

                    <Command.Group heading="Navigation" className="text-xs font-bold text-gray-400 uppercase tracking-widest px-2 py-1 mb-1">
                        <Command.Item
                            onSelect={() => handleSelect(() => onSelectFolder(null))}
                            className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-coral/10 hover:text-coral transition-colors cursor-pointer data-[selected=true]:bg-coral/10 data-[selected=true]:text-coral"
                        >
                            <ArrowRight size={18} />
                            Go to Stash
                        </Command.Item>
                        <Command.Item
                            onSelect={() => handleSelect(() => onSelectFolder('ARCHIVE'))}
                            className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-coral/10 hover:text-coral transition-colors cursor-pointer data-[selected=true]:bg-coral/10 data-[selected=true]:text-coral"
                        >
                            <Archive size={18} />
                            Go to Vault
                        </Command.Item>
                        {folders.map(folder => (
                            <Command.Item
                                key={folder.id}
                                value={`folder-${folder.name}`} // unique value for filtering
                                onSelect={() => handleSelect(() => onSelectFolder(folder.id))}
                                className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-coral/10 hover:text-coral transition-colors cursor-pointer data-[selected=true]:bg-coral/10 data-[selected=true]:text-coral"
                            >
                                <Folder size={18} />
                                Go to {folder.name}
                            </Command.Item>
                        ))}
                    </Command.Group>
                </Command.List>

                <div className="border-t border-gray-100 dark:border-white/5 px-4 py-2 flex items-center justify-between text-[10px] text-gray-400">
                    <span>Pro Tip: Use arrow keys to navigate</span>
                    <div className="flex gap-1">
                        <kbd className="bg-gray-100 dark:bg-white/10 px-1.5 py-0.5 rounded text-gray-500 dark:text-gray-300 font-mono">ESC</kbd>
                        <span>to close</span>
                    </div>
                </div>
            </motion.div>
        </Command.Dialog>
    );
};
