import React, { useState, useEffect } from 'react';
import { useNotes } from './hooks/useNotes';
import { Sidebar } from './components/Sidebar';
import { NoteCard } from './components/NoteCard';
import { Editor } from './components/Editor';
import { DatePicker } from './components/DatePicker';
import { ConfirmationModal } from './components/ConfirmationModal';
import { NewStackModal } from './components/NewStackModal';
import { isToday, isThisWeek, isThisMonth, isSameDay, startOfDay, endOfDay, format } from 'date-fns';
import { ToastContainer } from './components/Toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu } from 'lucide-react';
import Masonry from 'react-masonry-css';
import { CommandPalette } from './components/CommandPalette';
import { AddToStackModal } from './components/AddToStackModal';
import { getThemeContent } from './utils/themeContent';

function App() {
  const { notes, folders, addNote, updateNote, deleteNote, archiveNote, unarchiveNote, addFolder, deleteFolder } = useNotes();
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  // dateFilter state
  const [dateFilter, setDateFilter] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('dateFilter');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.type === 'interval' && parsed.start && parsed.end) {
            return { ...parsed, start: new Date(parsed.start), end: new Date(parsed.end) };
          }
          if (parsed.type === 'specific' && parsed.date) {
            return { ...parsed, date: new Date(parsed.date) };
          }
          return parsed;
        } catch (e) {
          console.error('Failed to parse date filter', e);
        }
      }
    }
    return { type: 'preset', value: 'all' };
  });
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isStackModalOpen, setIsStackModalOpen] = useState(false);

  // Toast State
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Theme State
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' ||
        (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  const [currentAccent, setCurrentAccent] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('accent') || 'pink';
    }
    return 'pink';
  });

  const content = getThemeContent(currentAccent);

  useEffect(() => {
    // Dark Mode
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }

    // Accent Theme
    document.documentElement.setAttribute('data-theme', currentAccent);
    localStorage.setItem('accent', currentAccent);

    // Persist Date Filter
    localStorage.setItem('dateFilter', JSON.stringify(dateFilter));

  }, [isDarkMode, currentAccent, dateFilter]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({ title: '', message: '', onConfirm: () => { }, confirmText: '', cancelText: '' });
  const [isInfoModal, setIsInfoModal] = useState(false);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Create Note: Ctrl + Alt + N
      if (e.ctrlKey && e.altKey && e.key === 'n') {
        e.preventDefault();
        handleCreateNote();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filtering Logic
  const filteredNotes = notes.filter(note => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return note.title.toLowerCase().includes(q) || note.content.toLowerCase().includes(q);
    }
    if (selectedFolderId === 'ARCHIVE') return note.isArchived;
    if (note.isArchived) return false;
    if (selectedFolderId) return note.folderId === selectedFolderId;

    // Date Filtering
    const noteDate = new Date(note.date);

    if (dateFilter.type === 'preset') {
      if (dateFilter.value === 'all') return true;
      if (dateFilter.value === 'today') return isToday(noteDate);
      if (dateFilter.value === 'week') return isThisWeek(noteDate);
      if (dateFilter.value === 'month') return isThisMonth(noteDate);
    } else if (dateFilter.type === 'specific' && dateFilter.date) {
      return isSameDay(noteDate, dateFilter.date);
    } else if (dateFilter.type === 'interval' && dateFilter.start && dateFilter.end) {
      return noteDate >= startOfDay(dateFilter.start) && noteDate <= endOfDay(dateFilter.end);
    }

    if (dateFilter.type === 'interval') return true;

    return true;
  });

  const handleCreateNote = () => {
    setEditingNote(null);
    setIsEditorOpen(true);
  };

  const handleEditNote = (note) => {
    setEditingNote(note);
    setIsEditorOpen(true);
  };

  const handleSaveNote = (noteData) => {
    if (editingNote) {
      updateNote(editingNote.id, noteData);
      addToast(content.toastUpdated, 'success');
    } else {
      addNote(noteData);
      addToast(content.toastCreated, 'success');
    }
  };

  // Custom Modals
  const confirmDeleteNote = (id) => {
    setIsInfoModal(false);
    setModalConfig({
      title: content.deleteNoteTitle,
      message: content.deleteNoteMsg,
      confirmText: content.deleteNoteConfirm,
      cancelText: content.deleteNoteCancel,
      onConfirm: () => {
        deleteNote(id);
        addToast(content.toastDeleted, 'delete');
        setModalOpen(false);
      }
    });
    setModalOpen(true);
  };

  const confirmDeleteFolder = (id) => {
    setIsInfoModal(false);
    setModalConfig({
      title: content.deleteFolderTitle,
      message: content.deleteFolderMsg,
      confirmText: content.deleteFolderConfirm,
      cancelText: content.deleteFolderCancel,
      onConfirm: () => {
        deleteFolder(id);
        addToast(content.toastStackNuked, 'delete');
        setModalOpen(false);
      }
    });
    setModalOpen(true);
  };

  const showImportantInfo = () => {
    setIsInfoModal(true);
    setModalConfig({
      title: content.infoTitle,
      message: content.infoMsg,
      confirmText: content.infoConfirm,
      cancelText: '',
      onConfirm: () => setModalOpen(false)
    });
    setModalOpen(true);
  };

  const getPageTitle = () => {
    if (searchQuery) return `Vibe check: "${searchQuery}"`;
    if (selectedFolderId === 'ARCHIVE') return content.vault;
    if (selectedFolderId) return folders.find(f => f.id === selectedFolderId)?.name || 'Stack';
    return content.stash;
  };

  // Move Note Logic
  const [moveNote, setMoveNote] = useState(null);

  const handleMoveNote = (folderId) => {
    if (moveNote) {
      updateNote(moveNote.id, { folderId });
      const folderName = folderId ? folders.find(f => f.id === folderId)?.name : content.stash;
      addToast(`${content.toastMoved} ${folderName} 📂`, 'success');
      setMoveNote(null);
    }
  };

  // Mobile Sidebar State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex bg-warm-50 dark:bg-dark-bg h-screen text-gray-900 dark:text-gray-100 font-sans overflow-hidden transition-colors duration-300 flex-col md:flex-row">

      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-cream-100/80 dark:bg-dark-sidebar/90 backdrop-blur-md border-b border-white/20 dark:border-white/5 z-20">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 -ml-2 text-gray-700 dark:text-gray-200"
          >
            <Menu size={24} />
          </button>
          <h1 className="font-black text-xl tracking-tighter text-gray-900 dark:text-white">NoteZ</h1>
        </div>
        {/* Placeholder for right side actions if needed, e.g. New Note shorthand */}
        <button
          onClick={handleCreateNote}
          className="w-10 h-10 rounded-full bg-coral text-white flex items-center justify-center shadow-soft"
        >
          <span className="text-xl font-bold">+</span>
        </button>
      </div>

      <Sidebar
        folders={folders}
        onCreateNote={handleCreateNote}
        selectedFolder={selectedFolderId}
        onSelectFolder={(id) => { setSelectedFolderId(id); setIsSidebarOpen(false); }}
        onAddFolder={addFolder}
        onDeleteFolder={confirmDeleteFolder}
        searchQuery={searchQuery}
        onSearch={setSearchQuery}
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
        currentAccent={currentAccent}
        onSetAccent={setCurrentAccent}
        onShowImportant={showImportantInfo}
        onOpenStackModal={() => setIsStackModalOpen(true)}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <main className="flex-1 md:my-4 md:mr-4 bg-cream-50 dark:bg-dark-surface md:rounded-[40px] shadow-none md:shadow-soft dark:shadow-soft-dark relative z-10 overflow-hidden flex flex-col border-t md:border border-white/60 dark:border-white/5 transition-colors duration-500 w-full">

        <div className="flex-1 overflow-y-auto p-4 md:p-12 custom-scrollbar">
          {/* Header */}
          <header className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter mb-1">
                {selectedFolderId === 'ARCHIVE' ? content.vault : (selectedFolderId ? folders.find(f => f.id === selectedFolderId)?.name : content.stash)}
              </h2>
              <p className="text-gray-400 font-bold text-sm">
                {selectedFolderId === 'ARCHIVE' ? content.vaultSubtitle : (selectedFolderId ? content.folderSubtitle : content.stashSubtitle)}
              </p>
            </div>
            <div className="flex items-center gap-4">
              {/* Date Filter */}
              {!selectedFolderId && !searchQuery && (
                <DatePicker filter={dateFilter} onFilterChange={setDateFilter} />
              )}
            </div>
          </header>

          {/* Notes Grid - Bento Box Style */}
          {filteredNotes.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center opacity-50">
              <div className="text-6xl mb-4">👻</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{content.noNotes}</h3>
              <p className="text-gray-500">{content.startPrompt}</p>
            </div>
          ) : (
            <Masonry
              breakpointCols={{ default: 3, 1100: 2, 700: 1 }}
              className="flex w-auto -ml-6 pb-20"
              columnClassName="pl-6 bg-clip-padding"
            >
              {filteredNotes.map((note) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  key={note.id}
                  className="mb-6"
                >
                  <NoteCard
                    note={note}
                    onClick={() => handleEditNote(note)}
                    onDelete={confirmDeleteNote}
                    onArchive={(id) => { archiveNote(id); addToast(content.toastArchived, 'info'); }}
                    onUnarchive={(id) => { unarchiveNote(id); addToast(content.toastUnarchived, 'success'); }}
                    onAddToStack={() => setMoveNote(note)}
                    className="w-full"
                  />
                </motion.div>
              ))}
            </Masonry>
          )}
        </div>
      </main>

      <AnimatePresence>
        {isEditorOpen && (
          <Editor
            key="editor"
            note={editingNote}
            folders={folders}
            onClose={() => setIsEditorOpen(false)}
            onSave={handleSaveNote}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {modalOpen && (
          <ConfirmationModal
            key="confirm-modal"
            isOpen={modalOpen}
            title={modalConfig.title}
            message={modalConfig.message}
            onConfirm={modalConfig.onConfirm}
            onCancel={() => !isInfoModal && setModalOpen(false)}
            confirmText={modalConfig.confirmText}
            cancelText={isInfoModal ? null : modalConfig.cancelText}
          />
        )}
      </AnimatePresence>

      <CommandPalette
        notes={notes}
        folders={folders}
        onCreateNote={handleCreateNote}
        onToggleTheme={toggleTheme}
        isDarkMode={isDarkMode}
        onSetAccent={setCurrentAccent}
        onSelectFolder={setSelectedFolderId}
        onOpenStackModal={() => setIsStackModalOpen(true)}
      />

      <AnimatePresence>
        {isStackModalOpen && (
          <NewStackModal
            key="stack-modal"
            isOpen={isStackModalOpen}
            onClose={() => setIsStackModalOpen(false)}
            onCreate={(name) => {
              addFolder(name);
              addToast(content.toastStackCreated, 'success');
              setIsStackModalOpen(false);
            }}
            folders={folders}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {moveNote && (
          <AddToStackModal
            isOpen={!!moveNote}
            onClose={() => setMoveNote(null)}
            onMove={handleMoveNote}
            folders={folders}
            currentFolderId={moveNote.folderId}
          />
        )}
      </AnimatePresence>

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}

export default App;
