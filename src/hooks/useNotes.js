import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEYS = {
    NOTES: 'syncscribe_notes',
    FOLDERS: 'syncscribe_folders',
};

const INITIAL_FOLDERS = [
    { id: 'noobies', name: 'Noobies', icon: 'sparkles' },
    { id: '1', name: 'Bucket List', icon: 'check-square' },
    { id: '2', name: 'Finances', icon: 'dollar-sign' },
    { id: '3', name: 'Travel Plans', icon: 'plane' },
    { id: '4', name: 'Shopping', icon: 'shopping-cart' },
    { id: '5', name: 'Personal', icon: 'user' },
    { id: '6', name: 'Work', icon: 'briefcase' },
    { id: '7', name: 'Projects', icon: 'folder' },
];

const INITIAL_NOTES = [
    // --- PINK / BESTIE NOTES ---
    {
        id: uuidv4(),
        title: 'Spill Tea Feature 🍵',
        content: '<p>Bestie, listen. The "Spill Tea" button is for strictly important updates. Like, if you see your ex or find a cute cafe. 💅</p><p><b>How to use:</b> Click the big "+" button in the sidebar.</p>',
        date: new Date().toISOString(),
        folderId: 'noobies',
        color: 'pink',
        pinned: true,
        isArchived: false,
    },
    {
        id: uuidv4(),
        title: 'Vibe Check: Themes 🎨',
        content: '<p>You can switch themes based on your mood. Feeling spicy? Go Pink. Feeling chill? Go Blue.</p><p><b>Pro Tip:</b> Hit <code>Ctrl+K</code> and type "Pink" or "Blue". It upgrades the whole app\'s personality! ✨</p>',
        date: new Date().toISOString(),
        folderId: 'noobies',
        color: 'purple',
        pinned: false,
        isArchived: false,
    },
    {
        id: uuidv4(),
        title: 'The Stash vs Vault 🔒',
        content: '<p><b>The Stash:</b> Where all your random thoughts live. messy but cute.</p><p><b>The Vault:</b> For secrets you wanna take to the grave (or just archive). Yeet them there to keep the feed clean.</p>',
        date: new Date().toISOString(),
        folderId: 'noobies',
        color: 'yellow',
        pinned: false,
        isArchived: false,
    },

    // --- BLUE / BRO NOTES ---
    {
        id: uuidv4(),
        title: 'Intel Report: Stacks 🧱',
        content: '<p>Bro, organize your intel into Stacks. It\'s like folders but tactical.</p><p><b>Execute:</b> Click "New Stack" in the sidebar. Drag and drop isn\'t here yet, but you can "Add to Stack" from any note.</p>',
        date: new Date().toISOString(),
        folderId: 'noobies',
        color: 'blue',
        pinned: true,
        isArchived: false,
    },
    {
        id: uuidv4(),
        title: 'Tactical Shortcuts ⌨️',
        content: '<p>Efficiency is key. Use these keybinds:</p><ul><li><b>Ctrl+K:</b> Command Center.</li></ul><p>Stay sharp.</p>',
        date: new Date().toISOString(),
        folderId: 'noobies',
        color: 'green',
        pinned: false,
        isArchived: false,
    },
    {
        id: uuidv4(),
        title: 'Masonry Grid Layout 🏗️',
        content: '<p>The dashboard uses a responsive masonry grid. It eliminates gaps in your visual feed. Maximum density, maximum information flow.</p>',
        date: new Date().toISOString(),
        folderId: 'noobies',
        color: 'orange',
        pinned: false,
        isArchived: false,
    }
];

export function useNotes() {
    const [notes, setNotes] = useState(() => {
        const hasSeeded = localStorage.getItem('seeded_v5');
        if (!hasSeeded) {
            // Force reset for this update
            return INITIAL_NOTES;
        }
        const saved = localStorage.getItem(STORAGE_KEYS.NOTES);
        return saved ? JSON.parse(saved) : INITIAL_NOTES;
    });

    // Mark as seeded on mount
    useEffect(() => {
        if (!localStorage.getItem('seeded_v5')) {
            localStorage.setItem('seeded_v5', 'true');
            // Ensure we save the new initial notes and folders
            localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(INITIAL_NOTES));
            localStorage.setItem(STORAGE_KEYS.FOLDERS, JSON.stringify(INITIAL_FOLDERS));
        }
    }, []);

    const [folders, setFolders] = useState(() => {
        const hasSeeded = localStorage.getItem('seeded_v5');
        if (!hasSeeded) {
            return INITIAL_FOLDERS;
        }
        const saved = localStorage.getItem(STORAGE_KEYS.FOLDERS);
        return saved ? JSON.parse(saved) : INITIAL_FOLDERS;
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
    }, [notes]);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEYS.FOLDERS, JSON.stringify(folders));
    }, [folders]);

    const addNote = (note) => {
        const newNote = {
            id: uuidv4(),
            date: new Date().toISOString(),
            color: 'yellow', // Default
            isArchived: false,
            isDeleted: false,
            ...note,
        };
        setNotes((prev) => [newNote, ...prev]);
    };

    const updateNote = (id, updates) => {
        setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, ...updates, date: new Date().toISOString() } : n)));
    };

    const deleteNote = (id) => {
        // Soft delete
        updateNote(id, { isDeleted: true, isArchived: false, pinned: false });
    };

    const permanentlyDeleteNote = (id) => {
        setNotes((prev) => prev.filter((n) => n.id !== id));
    };

    const restoreNote = (id) => {
        updateNote(id, { isDeleted: false });
    };

    const archiveNote = (id) => {
        updateNote(id, { isArchived: true });
    };

    const unarchiveNote = (id) => {
        updateNote(id, { isArchived: false });
    };

    const addFolder = (name) => {
        const newFolder = { id: uuidv4(), name: name, icon: 'folder' };
        setFolders((prev) => [...prev, newFolder]);
    };

    const deleteFolder = (id) => {
        // Optional: Delete notes within the folder or move them to a default folder?
        // For safety, let's just delete the folder, notes will become "Uncategorized" effectively if we don't delete them, 
        // but logically user expects them gone or moved. Use simple approach: delete folder, keep notes but set folderId to null (Undefined/All).
        // OR delete them. Let's delete them to map "delete folder" to "delete content".
        // Removed window.confirm as it is already handled by the UI layer
        setNotes(prev => prev.filter(n => n.folderId !== id));
        setFolders(prev => prev.filter(f => f.id !== id));
    };

    const convertAllNotesToColor = (color) => {
        setNotes(prev => prev.map(n => ({ ...n, color })));
    };

    return {
        notes,
        folders,
        addNote,
        updateNote,
        deleteNote,
        permanentlyDeleteNote,
        restoreNote,
        archiveNote,
        unarchiveNote,
        addFolder,
        deleteFolder,
        convertAllNotesToColor
    };
}
