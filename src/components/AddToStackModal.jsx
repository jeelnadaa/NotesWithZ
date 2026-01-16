import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Folder, FolderOpen } from 'lucide-react';

export const AddToStackModal = ({ isOpen, onClose, onMove, folders, currentFolderId, currentAccent }) => {
    // Handle ESC key
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const modalBorder = currentAccent === 'uncle' ? 'border-gray-200 dark:border-white/10' : 'border-white/20 dark:border-white/5';
    const activeIconBg = currentAccent === 'uncle' ? 'bg-black text-white dark:bg-white dark:text-black' : 'bg-coral/10 text-coral';
    const hoverClass = currentAccent === 'uncle'
        ? 'hover:bg-gray-100 dark:hover:bg-white/5 hover:scale-[1.02] active:scale-[0.98]'
        : 'hover:bg-coral/10 hover:border-coral/20 hover:scale-[1.02] active:scale-[0.98]';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />

            {/* Modal */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className={`relative w-full max-w-md bg-white dark:bg-[#1A1A1A] rounded-[32px] p-8 shadow-2xl overflow-hidden border ${modalBorder}`}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                >
                    <X size={20} className="text-gray-400 dark:text-gray-500" />
                </button>

                <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6 tracking-tight">
                    {currentAccent === 'uncle' ? 'Select Folder' : 'Add to Stack'}
                </h2>

                <div className="space-y-3 max-h-[60vh] overflow-y-auto custom-scrollbar px-1">
                    {/* Stash Option */}
                    <button
                        onClick={() => onMove(null)}
                        disabled={currentFolderId === null}
                        className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-200 border border-transparent 
              ${currentFolderId === null
                                ? 'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-white/5'
                                : hoverClass
                            }`}
                    >
                        <div className={`p-2 rounded-xl ${currentFolderId === null ? 'bg-gray-200 dark:bg-white/10' : activeIconBg}`}>
                            <FolderOpen size={20} />
                        </div>
                        <div className="text-left">
                            <p className={`font-bold text-base ${currentFolderId === null ? 'text-gray-400' : 'text-gray-900 dark:text-white'}`}>
                                {currentAccent === 'uncle' ? 'All Notes' : 'The Stash'}
                            </p>
                            <p className="text-xs text-gray-400 font-medium">
                                {currentAccent === 'uncle' ? 'Uncategorized' : 'Unorganized notes'}
                            </p>
                        </div>
                    </button>

                    {/* Folders */}
                    {folders.map((folder) => (
                        <button
                            key={folder.id}
                            onClick={() => onMove(folder.id)}
                            disabled={currentFolderId === folder.id}
                            className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-200 border border-transparent 
                ${currentFolderId === folder.id
                                    ? 'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-white/5'
                                    : hoverClass
                                }`}
                        >
                            <div className={`p-2 rounded-xl ${currentFolderId === folder.id ? 'bg-gray-200 dark:bg-white/10' : activeIconBg}`}>
                                <Folder size={20} />
                            </div>
                            <div className="text-left">
                                <p className={`font-bold text-base ${currentFolderId === folder.id ? 'text-gray-400' : 'text-gray-900 dark:text-white'}`}>{folder.name}</p>
                                <p className="text-xs text-gray-400 font-medium">
                                    {currentAccent === 'uncle' ? 'Folder' : 'Stack'}
                                </p>
                            </div>
                        </button>
                    ))}

                    {folders.length === 0 && (
                        <div className="text-center py-8 text-gray-400">
                            <p>{currentAccent === 'uncle' ? 'No folders created yet.' : 'No stacks created yet.'}</p>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};
