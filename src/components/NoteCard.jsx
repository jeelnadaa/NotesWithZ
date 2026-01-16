import React from 'react';
import { format } from 'date-fns';
import { Edit2, Trash2, Archive, ArchiveRestore, FolderInput } from 'lucide-react';
import { colors } from '../utils/colors';

const stripHtml = (html) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
};

export function NoteCard({ note, onClick, onDelete, onArchive, onUnarchive, onAddToStack, className }) {
    const theme = colors.find(c => c.id === note.color);
    const bgClass = theme ? theme.bg : 'bg-white dark:bg-[#1A1A1A]';
    const borderClass = theme ? theme.border : 'border-transparent';

    return (
        <div
            onClick={onClick}
            className={`group ${bgClass} rounded-3xl p-6 hover:shadow-xl transition-all duration-300 border ${borderClass} hover:border-coral/20 cursor-pointer relative overflow-hidden backdrop-blur-sm ${className}`}
        >

            <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-xl text-gray-900 dark:text-white line-clamp-2 leading-tight group-hover:text-coral transition-colors duration-300">
                    {note.title}
                </h3>
                {note.pinned && <span className="text-xl animate-pulse">📌</span>}
            </div>

            <div
                className="text-gray-600 dark:text-gray-400 text-sm line-clamp-4 mb-6 leading-relaxed font-medium"
                dangerouslySetInnerHTML={{ __html: stripHtml(note.content) }}
            />

            <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100 dark:border-white/5">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    {format(new Date(note.date), 'MMM d, h:mm a')}
                </span>
                <div className="flex gap-2 transition-opacity duration-300">
                    <button
                        onClick={(e) => { e.stopPropagation(); onAddToStack(note.id); }}
                        className="p-2 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-full text-gray-400 hover:text-purple-500 transition-colors"
                        title="Add to Stack"
                    >
                        <FolderInput size={16} />
                    </button>
                    {note.isArchived ? (
                        <button
                            onClick={(e) => { e.stopPropagation(); onUnarchive(note.id); }}
                            className="p-2 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-full text-gray-400 hover:text-green-500 transition-colors"
                            title="Unarchive"
                        >
                            <ArchiveRestore size={16} />
                        </button>
                    ) : (
                        <button
                            onClick={(e) => { e.stopPropagation(); onArchive(note.id); }}
                            className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-full text-gray-400 hover:text-blue-500 transition-colors"
                            title="Archive"
                        >
                            <Archive size={16} />
                        </button>
                    )}
                    <button
                        onClick={(e) => { e.stopPropagation(); onDelete(note.id); }}
                        className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-full text-gray-400 hover:text-red-500 transition-colors"
                        title="Delete"
                    >
                        <Trash2 size={16} />
                    </button>
                    <button
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800/50 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                    >
                        <Edit2 size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}
