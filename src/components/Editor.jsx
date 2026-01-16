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
    Hash,
    Link as LinkIcon,
    Table as TableIcon,
    Eye,
    EyeOff,
    MoreHorizontal,
    Plus,
    Trash2,
    Settings2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import katex from 'katex';
import renderMathInElement from 'katex/dist/contrib/auto-render';
import 'katex/dist/katex.min.css';

import { colors } from '../utils/colors';

const fontSizes = [
    { label: 'Small', value: '2' },
    { label: 'Normal', value: '3' },
    { label: 'Large', value: '5' },
    { label: 'Huge', value: '7' },
];

const fontFamilies = [
    { label: 'Satoshi (Default)', value: 'Satoshi' },
    { label: 'Inter', value: 'Inter, sans-serif' },
    { label: 'Serif (Playfair)', value: '"Playfair Display", serif' },
    { label: 'Mono (JetBrains)', value: '"JetBrains Mono", monospace' },
    { label: 'Cursive (Dancing)', value: '"Dancing Script", cursive' },
];

import { getThemeContent } from '../utils/themeContent';

export const Editor = ({ note, onClose, onSave, folders, currentAccent, readOnly = false }) => {
    const [title, setTitle] = useState(note?.title || '');
    const [content, setContent] = useState(note?.content || '');
    const [selectedColor, setSelectedColor] = useState(() => {
        if (note?.color) {
            return colors.some(col => col.id === note.color) ? note.color : 'blue';
        }
        return currentAccent === 'uncle' ? 'monochrome' : 'blue';
    });
    const [selectedFolderId, setSelectedFolderId] = useState(note?.folderId || folders[0]?.id);
    const [isFolderOpen, setIsFolderOpen] = useState(false);
    const [isFontMenuOpen, setIsFontMenuOpen] = useState(false);
    const [isFontFamilyMenuOpen, setIsFontFamilyMenuOpen] = useState(false);
    const [isPreview, setIsPreview] = useState(false);
    const [customFontUrl, setCustomFontUrl] = useState('');
    const [errorToast, setErrorToast] = useState(null);

    // Link Modal State
    const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
    const [linkUrl, setLinkUrl] = useState('');

    // Table Selection State (Basic tracking if cursor is in table)
    const [isTableSelected, setIsTableSelected] = useState(false);
    const [isTableOptionsOpen, setIsTableOptionsOpen] = useState(false);

    const contentRef = useRef(null);
    const folderRef = useRef(null);
    const fontMenuRef = useRef(null);
    const linkModalRef = useRef(null);
    const tableOptionsRef = useRef(null); // Add ref if needed, or just rely on state

    // Handle Global ESC and Shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                // Priority 1: Close Dropdowns/Modals
                if (isLinkModalOpen) { setIsLinkModalOpen(false); return; }
                if (isFontMenuOpen) { setIsFontMenuOpen(false); return; }
                if (isFontFamilyMenuOpen) { setIsFontFamilyMenuOpen(false); return; }
                if (isTableOptionsOpen) { setIsTableOptionsOpen(false); return; }

                // Priority 2: Close Editor
                onClose();
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isLinkModalOpen, isFontMenuOpen, isFontFamilyMenuOpen, isTableOptionsOpen, onClose]);

    useEffect(() => {
        if (contentRef.current && contentRef.current.innerHTML !== content && !isPreview) {
            contentRef.current.innerHTML = content;
        }
    }, [isPreview]); // Only sync when switching back to edit mode

    // Handle LaTeX Rendering
    useEffect(() => {
        if (isPreview && contentRef.current) {
            renderMathInElement(contentRef.current, {
                delimiters: [
                    { left: '$$', right: '$$', display: true },
                    { left: '\\(', right: '\\)', display: false },
                ],
                throwOnError: false
            });
        }
    }, [isPreview, content]);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (folderRef.current && !folderRef.current.contains(event.target)) {
                setIsFolderOpen(false);
            }
            if (fontMenuRef.current && !fontMenuRef.current.contains(event.target)) {
                setIsFontFamilyMenuOpen(false);
            }
            if (linkModalRef.current && !linkModalRef.current.contains(event.target)) {
                setIsLinkModalOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Handle Keyboard Shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                if (isLinkModalOpen) setIsLinkModalOpen(false);
                else onClose();
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [onClose, isLinkModalOpen]);

    // Helper to clear toast
    useEffect(() => {
        if (errorToast) {
            const timer = setTimeout(() => setErrorToast(null), 4000);
            return () => clearTimeout(timer);
        }
    }, [errorToast]);

    // Check if cursor is in table
    const checkSelection = () => {
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            let node = selection.getRangeAt(0).commonAncestorContainer;
            while (node) {
                if (node.nodeName === 'TABLE') {
                    setIsTableSelected(true);
                    return;
                }
                node = node.parentNode;
            }
            setIsTableSelected(false);
        }
    };

    const handleFormat = (command, value = null) => {
        if (command === 'createLink') {
            saveSelection(); // Save cursor position
            setLinkUrl('');
            setIsLinkModalOpen(true);
            return;
        }

        if (command === 'insertTable') {
            const tableHTML = `
                <table class="editor-table" style="border-collapse: collapse; width: 100%;">
                    <tbody>
                        <tr><td><br></td><td><br></td><td><br></td></tr>
                        <tr><td><br></td><td><br></td><td><br></td></tr>
                        <tr><td><br></td><td><br></td><td><br></td></tr>
                    </tbody>
                </table>
                <p><br/></p>
            `;
            document.execCommand('insertHTML', false, tableHTML);
        } else if (command === 'fontName') {
            // Use CSS styles for fonts to handle custom fonts better
            document.execCommand('styleWithCSS', false, true);
            document.execCommand('fontName', false, value);
            document.execCommand('styleWithCSS', false, false);
        } else {
            document.execCommand(command, false, value);
        }

        if (contentRef.current) {
            setContent(contentRef.current.innerHTML);
            contentRef.current.focus();
        }

        if (command === 'fontSize') {
            setIsFontMenuOpen(false);
        }
    };

    // Selection Saving for Link Modal
    const [savedRange, setSavedRange] = useState(null);
    const saveSelection = () => {
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            setSavedRange(selection.getRangeAt(0));
        }
    };
    const restoreSelection = () => {
        const selection = window.getSelection();
        selection.removeAllRanges();
        if (savedRange) {
            selection.addRange(savedRange);
        }
    };

    const confirmLink = () => {
        restoreSelection();
        if (linkUrl) {
            document.execCommand('createLink', false, linkUrl);
            if (contentRef.current) setContent(contentRef.current.innerHTML);
        }
        setIsLinkModalOpen(false);
    };

    const handleCustomFontLoad = async () => {
        if (!customFontUrl) return;

        const themeContent = getThemeContent(currentAccent); // Get content for current accent

        try {
            const fontName = `CustomFont-${Date.now()}`;
            const font = new FontFace(fontName, `url(${customFontUrl})`);
            await font.load();
            document.fonts.add(font);

            // Assuming setFontFamily and setIsFontOpen are defined elsewhere or meant to be setIsFontFamilyMenuOpen
            // For faithful replacement, I'll use the provided names.
            // If setFontFamily is meant to apply the font, it should probably use execCommand.
            // If setIsFontOpen is meant to close the font family menu, it should be setIsFontFamilyMenuOpen.
            // Given the context, I'll assume setIsFontOpen is a typo for setIsFontFamilyMenuOpen.
            // And setFontFamily is not directly used in the original logic, so I'll omit it for now to avoid undefined errors.

            document.execCommand('styleWithCSS', false, true); // Re-adding these for consistency with other fontName calls
            document.execCommand('fontName', false, fontName);
            document.execCommand('styleWithCSS', false, false);

            setIsFontFamilyMenuOpen(false); // Changed from setIsFontOpen to match existing state
            setCustomFontUrl('');
            if (contentRef.current) setContent(contentRef.current.innerHTML);

        } catch (error) {
            setErrorToast(themeContent.fontLoadError);
        }
    };

    // Table Operations
    const modifyTable = (action) => {
        const selection = window.getSelection();
        if (!selection.rangeCount) return;

        let cell = selection.anchorNode;
        while (cell && cell.nodeName !== 'TD' && cell.nodeName !== 'TH') {
            cell = cell.parentNode;
        }
        if (!cell) return;

        const row = cell.parentNode;
        const table = row.parentNode.parentNode; // tbody -> table

        if (action === 'addRow') {
            const newRow = table.insertRow(row.rowIndex + 1);
            for (let i = 0; i < row.cells.length; i++) {
                const newCell = newRow.insertCell(i);
                newCell.innerHTML = '<br>';
            }
        } else if (action === 'deleteRow') {
            if (table.rows.length > 1) {
                table.deleteRow(row.rowIndex);
            } else {
                table.remove();
            }
        } else if (action === 'addCol') {
            for (let i = 0; i < table.rows.length; i++) {
                const newCell = table.rows[i].insertCell(cell.cellIndex + 1);
                newCell.innerHTML = '<br>';
            }
        } else if (action === 'deleteCol') {
            // Check if it's the last column
            if (row.cells.length > 1) {
                for (let i = 0; i < table.rows.length; i++) {
                    table.rows[i].deleteCell(cell.cellIndex);
                }
            } else {
                table.remove();
            }
        } else if (action === 'deleteTable') {
            table.remove();
            setIsTableSelected(false);
            setIsTableOptionsOpen(false); // Close menu
        }

        if (contentRef.current) setContent(contentRef.current.innerHTML);
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

    const activeSchema = colors.find(c => c.id === selectedColor) || colors[1];
    const activeFolder = folders.find(f => f.id === selectedFolderId) || folders[0];

    const handleEditorClick = (e) => {
        checkSelection();
        // Handle Ctrl + Click on links
        if (e.ctrlKey && e.target.tagName === 'A') {
            e.preventDefault();
            // Ensure absolute URL
            let href = e.target.getAttribute('href');
            if (href && !/^https?:\/\//i.test(href)) {
                href = 'https://' + href;
                // Fix it permanently in DOM and State so 'Copy Link' works
                e.target.setAttribute('href', href);
                if (contentRef.current) setContent(contentRef.current.innerHTML);
            }
            window.open(href, '_blank');
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-md z-[100] flex items-center justify-center p-4"
        >
            {/* Error Toast Overlay - Middle Top Position */}
            <AnimatePresence>
                {errorToast && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.9 }}
                        className="fixed top-24 left-1/2 -translate-x-1/2 z-[200] max-w-md w-full px-4"
                    >
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-2xl border border-gray-100 dark:border-gray-700 flex items-center gap-4 relative overflow-hidden">
                            {/* Accent stripe */}
                            <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${currentAccent === 'uncle'
                                ? 'bg-gray-900 dark:bg-white'
                                : currentAccent === 'blue' ? 'bg-blue-500' : 'bg-coral'
                                }`} />

                            <div className={`p-2 rounded-full shrink-0 ${currentAccent === 'uncle'
                                ? 'bg-gray-200 text-gray-900 dark:bg-white dark:text-black'
                                : currentAccent === 'blue' ? 'bg-blue-100 text-blue-500' : 'bg-pink-100 text-pink-500'
                                }`}>
                                <Type size={20} />
                            </div>
                            <p className="text-sm font-bold text-gray-800 dark:text-gray-200 pr-6 leading-tight">
                                {errorToast}
                            </p>

                            <button
                                onClick={() => setErrorToast(null)}
                                className="absolute top-2 right-2 p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-400 transition-colors"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

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
                        readOnly={readOnly}
                        placeholder="Thought Title..."
                        className={`text-3xl font-black bg-transparent border-none outline-none text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-200 w-full tracking-tight ${readOnly ? 'cursor-default' : ''}`}
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
                {!readOnly && (
                    <div className="px-4 sm:px-8 pb-4 flex items-center gap-1 overflow-visible relative z-20 flex-wrap">
                        <div className="flex bg-white/30 dark:bg-black/10 p-1.5 rounded-2xl backdrop-blur-sm shadow-sm border border-white/10 mb-2 sm:mb-0 relative z-30">
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
                                    <span className="text-xs font-bold">Size</span>
                                    <ChevronDown size={12} className={`transition-transform duration-200 ${isFontMenuOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {isFontMenuOpen && (
                                    <div className="absolute top-full left-0 mt-2 w-32 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col p-1 animate-fadeIn origin-top-left z-[50]">
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

                            {/* Font Family Dropdown */}
                            <div className="relative" ref={fontMenuRef}>
                                <button
                                    onClick={() => setIsFontFamilyMenuOpen(!isFontFamilyMenuOpen)}
                                    title="Font Family"
                                    className={`p-2.5 rounded-xl text-gray-700 dark:text-gray-300 transition-colors flex items-center gap-1 ${isFontFamilyMenuOpen ? 'bg-white/50 dark:bg-white/10' : 'hover:bg-white/40 dark:hover:bg-black/20'}`}
                                >
                                    <Type size={18} />
                                    <ChevronDown size={12} className={`transition-transform duration-200 ${isFontFamilyMenuOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {isFontFamilyMenuOpen && (
                                    <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-visible flex flex-col p-1 animate-fadeIn origin-top-left z-[60]">
                                        {/* Predefined Fonts */}
                                        {fontFamilies.map((font) => (
                                            <button
                                                key={font.label}
                                                onClick={() => {
                                                    document.execCommand('styleWithCSS', false, true);
                                                    document.execCommand('fontName', false, font.value);
                                                    document.execCommand('styleWithCSS', false, false);
                                                    setIsFontFamilyMenuOpen(false);
                                                    if (contentRef.current) setContent(contentRef.current.innerHTML);
                                                }}
                                                style={{ fontFamily: font.value === 'Satoshi' ? 'Satoshi, sans-serif' : font.value }}
                                                className="px-4 py-2.5 text-left text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-coral/10 hover:text-coral rounded-lg transition-colors flex items-center justify-between"
                                            >
                                                {font.label}
                                            </button>
                                        ))}

                                        <div className="h-px bg-gray-100 dark:bg-gray-700 my-1" />

                                        {/* Custom URL Input Area */}
                                        <div className="p-2">
                                            <p className="text-[10px] font-bold text-gray-400 mb-1.5 uppercase tracking-wider ml-1">Custom Font (URL)</p>
                                            <div className="flex items-center gap-1 bg-gray-50 dark:bg-black/20 rounded-lg p-1 border border-gray-200 dark:border-gray-700">
                                                <input
                                                    type="text"
                                                    placeholder="https://..."
                                                    value={customFontUrl}
                                                    onChange={(e) => setCustomFontUrl(e.target.value)}
                                                    onKeyDown={(e) => e.key === 'Enter' && handleCustomFontLoad()}
                                                    className="w-full px-2 py-1 text-xs bg-transparent border-none outline-none text-gray-700 dark:text-gray-300"
                                                />
                                                <button
                                                    onClick={handleCustomFontLoad}
                                                    disabled={!customFontUrl}
                                                    className="p-1 rounded-md bg-white dark:bg-gray-700 text-coral disabled:opacity-50 shadow-sm hover:scale-105 transition-transform"
                                                >
                                                    <Check size={12} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="w-px h-5 bg-gray-400/30 mx-2 self-center" />

                            <ToolbarButton icon={List} onClick={() => handleFormat('insertUnorderedList')} title="Bullet List" />
                            <ToolbarButton icon={ListOrdered} onClick={() => handleFormat('insertOrderedList')} title="Numbered List" />

                            <div className="w-px h-5 bg-gray-400/30 mx-2 self-center" />

                            <div className="relative" ref={linkModalRef}>
                                <ToolbarButton icon={LinkIcon} onClick={() => handleFormat('createLink')} title="Insert Link" />
                                {isLinkModalOpen && (
                                    <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 p-2 z-30 animate-fadeIn">
                                        <input
                                            type="text"
                                            placeholder="Paste link URL..."
                                            value={linkUrl}
                                            autoFocus
                                            onChange={(e) => setLinkUrl(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    confirmLink();
                                                }
                                            }}
                                            className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-black/20 border-none outline-none text-sm text-gray-800 dark:text-gray-200 mb-2 focus:ring-2 focus:ring-coral/20"
                                        />
                                        <button
                                            onClick={confirmLink}
                                            className="w-full bg-coral text-white py-1.5 rounded-lg text-xs font-bold hover:opacity-90 transition-opacity"
                                        >
                                            Insert Link
                                        </button>
                                    </div>
                                )}
                            </div>

                            <ToolbarButton icon={TableIcon} onClick={() => handleFormat('insertTable')} title="Insert Table" />

                            {/* Table Options Dropdown - Permanent but Disabled if no table selected or in Preview */}
                            <div className="relative ml-2">
                                <button
                                    onClick={() => !isPreview && isTableSelected && setIsTableOptionsOpen(!isTableOptionsOpen)}
                                    disabled={!isTableSelected || isPreview}
                                    className={`px-3 py-2.5 rounded-xl transition-colors flex items-center gap-2 text-xs font-bold shadow-sm ${(!isPreview && isTableSelected)
                                        ? 'bg-white/50 dark:bg-white/10 hover:bg-white/60 dark:hover:bg-white/20 text-gray-800 dark:text-gray-100 cursor-pointer'
                                        : 'bg-black/5 dark:bg-white/5 text-gray-400 dark:text-gray-600 cursor-not-allowed opacity-60'
                                        }`}
                                >
                                    <Settings2 size={14} className={(!isPreview && isTableSelected) ? '' : 'opacity-50'} />
                                    Table Options
                                    <ChevronDown size={12} className={`transition-transform duration-200 ${isTableOptionsOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {!isPreview && isTableSelected && isTableOptionsOpen && (
                                    <div className="absolute top-full left-0 mt-2 w-52 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl shadow-xl border border-white/20 dark:border-gray-700 overflow-hidden flex flex-col p-1 animate-fadeIn z-[50]">
                                        <button onClick={() => modifyTable('addRow')} className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors text-left">
                                            <Plus size={14} className="text-gray-500" /> Add Row
                                        </button>
                                        <button onClick={() => modifyTable('addCol')} className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors text-left">
                                            <Plus size={14} className="text-gray-500" /> Add Column
                                        </button>
                                        <div className="h-px bg-gray-400/20 my-1" />
                                        <button onClick={() => modifyTable('deleteRow')} className="flex items-center gap-3 px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-left">
                                            <Trash2 size={14} /> Delete Row
                                        </button>
                                        <button onClick={() => modifyTable('deleteCol')} className="flex items-center gap-3 px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-left">
                                            <Trash2 size={14} /> Delete Column
                                        </button>
                                        <div className="h-px bg-gray-400/20 my-1" />
                                        <button onClick={() => modifyTable('deleteTable')} className="flex items-center gap-3 px-3 py-2 text-sm font-bold text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors text-left">
                                            <Trash2 size={14} strokeWidth={2.5} /> Delete Table
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="w-px h-5 bg-gray-400/30 mx-2 self-center" />

                            <ToolbarButton
                                icon={isPreview ? EyeOff : Eye}
                                onClick={() => setIsPreview(!isPreview)}
                                title={isPreview ? "Edit Mode" : "Preview Mode (LaTeX)"}
                            />
                        </div>

                        <div className="hidden sm:block flex-1" />

                        {/* Color Swatches */}
                        <div className="flex items-center gap-2 bg-white/30 dark:bg-black/10 p-1.5 rounded-2xl backdrop-blur-sm px-3 shadow-sm border border-white/10 relative z-10">
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
                )}

                {/* Editor Content */}
                <div className="flex-1 px-10 py-6 overflow-y-auto custom-scrollbar relative z-0">
                    <div
                        ref={contentRef}
                        contentEditable={!isPreview && !readOnly}
                        className={`outline-none text-lg text-gray-800 dark:text-gray-200 leading-8 font-medium editor-content h-full focus-visible:ring-0 focus-visible:ring-offset-0 ${isPreview ? 'pointer-events-none' : ''}`}
                        onInput={(e) => {
                            if (!isPreview) setContent(e.currentTarget.innerHTML);
                        }}
                        onSelect={checkSelection}
                        onClick={handleEditorClick}
                        onKeyUp={checkSelection}
                        dangerouslySetInnerHTML={isPreview ? { __html: content } : undefined}
                    />
                </div>

                {/* Footer Controls */}
                {!readOnly && (
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
                                <div className="absolute bottom-full left-0 mb-2 w-64 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden flex flex-col p-1 animate-fadeIn origin-bottom-left max-h-60 overflow-y-auto custom-scrollbar z-[60]">
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
                )}
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


