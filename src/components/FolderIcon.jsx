import React from 'react';

// Generates a consistent gradient based on the folder name
const getGradient = (name) => {
    const gradients = [
        'from-pink-300 to-rose-300',
        'from-purple-300 to-indigo-300',
        'from-yellow-300 to-orange-300',
        'from-green-300 to-emerald-300',
        'from-blue-300 to-cyan-300',
    ];
    const index = name.length % gradients.length;
    return gradients[index];
};

export const FolderIcon = ({ folder }) => {
    const gradient = getGradient(folder.name);

    return (
        <div className="flex flex-col items-center gap-3 cursor-pointer group animate-fadeIn">
            <div className={`relative w-24 h-20 bg-gradient-to-br ${gradient} rounded-2xl shadow-sm flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:shadow-md border border-white/20`}>
                {/* Folder Lip */}
                <div className={`absolute -top-2 left-0 w-10 h-3 bg-gradient-to-r ${gradient} rounded-t-lg opacity-80`} />

                {/* Content Preview (Visual) */}
                <div className="absolute inset-x-3 inset-y-3 bg-white/30 backdrop-blur-sm rounded-lg" />

                {/* Initials */}
                <span className="relative z-10 text-white font-black text-xl tracking-wider drop-shadow-sm mix-blend-overlay opacity-90">
                    {folder.name.slice(0, 2).toUpperCase()}
                </span>
            </div>
            <span className="text-xs font-bold text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                {folder.name}
            </span>
        </div>
    );
};
