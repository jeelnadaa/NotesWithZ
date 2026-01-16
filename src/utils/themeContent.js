export const themeContent = {
    pink: {
        // Sidebar
        spillTea: "Spill Tea",
        vibeCheck: "Vibe check...",
        vault: "The Vault",
        stash: "The Stash",
        stacks: "Stacks",
        newStack: "New Stack",
        realTalk: "Real Talk ⚠️",

        // Headers
        vaultSubtitle: "Locked away memories",
        stashTitle: "The Stash",
        stashSubtitle: "All your random thoughts",
        folderSubtitle: "Curated vibes",

        // Empty State
        noNotes: "No vibes yet",
        startPrompt: "Hit that \"Spill Tea\" button to start.",

        // Modals - Delete Note
        deleteNoteTitle: "Yeet this thought?",
        deleteNoteMsg: "This note is about to be ghosted forever. You sure?",
        deleteNoteConfirm: "Yeet it",
        deleteNoteCancel: "Wait, no",

        // Modals - Delete Folder
        deleteFolderTitle: "Nuke Stack?",
        deleteFolderMsg: "This will destroy the folder and all the tea inside it. Proceed?",
        deleteFolderConfirm: "Destroy it",
        deleteFolderCancel: "Keep safe",

        // Modals - Info
        // Modals - Info
        infoTitle: "The Tea 🫖",
        infoMsg: "Bestie, Listen Up ⚠️\n\nThis app lives in your browser cache (local storage). Clearing it = deleting memories. No cloud, just vibes.\n\np.s. entire app vibe coded by Jeel Nada. no cap. 💅✨",
        infoConfirm: "Slay",

        // Font Error
        fontLoadError: "bestie that font link is sus 💀 try another one?",

        // Stack Modal
        stackModalTitle: "New Stack ✨",
        stackModalPlaceholder: "name your vibe...",
        createStackBtn: "Create Vibe",

        // Toasts
        toastUpdated: "Thought updated! 🧠",
        toastCreated: "Fresh thought captured! ✨",
        toastDeleted: "Thought yeeted into the void 🗑️",
        toastArchived: "Locked in the Vault 🔒",
        toastUnarchived: "Back in the Stash 🙌",
        toastMoved: "Moved to",
        toastStackCreated: "Stack created! 📚",
        toastStackNuked: "Stack destroyed 💥",
    },
    blue: {
        // Sidebar
        spillTea: "Spit Facts",
        vibeCheck: "Intel check...",
        vault: "The Locker",
        stash: "The Base",
        stacks: "Sectors",
        newStack: "New Sector",
        realTalk: "No Cap ⚠️",

        // Headers
        vaultSubtitle: "Secured records",
        stashTitle: "The Base",
        stashSubtitle: "All field notes",
        folderSubtitle: "Tactical drops",

        // Empty State
        noNotes: "No intel yet",
        startPrompt: "Hit \"Spit Facts\" to log info.",

        // Modals - Delete Note
        deleteNoteTitle: "Scrub this intel?",
        deleteNoteMsg: "This data will be permanently erased. Confirm?",
        deleteNoteConfirm: "Scrub it",
        deleteNoteCancel: "Abort",

        // Modals - Delete Folder
        deleteFolderTitle: "Demolish Sector?",
        deleteFolderMsg: "This will wipe the stack and all intel inside. Execute?",
        deleteFolderConfirm: "Wipe it",
        deleteFolderCancel: "Hold fire",

        // Modals - Info
        // Modals - Info
        infoTitle: "System Intel 💾",
        infoMsg: "Yo Bro, Intel Update ⚠️\n\nData is stored locally (browser cache). Wiping cache = nuking intel. Zero cloud, 100% private.\n\n(hidden unlock: vibe coded by Jeel Nada. stay icy 🧊)",
        infoConfirm: "Copy That",

        // Toasts
        toastUpdated: "Intel updated! 🧠",
        toastCreated: "New intel secured! 🎯",
        toastDeleted: "Intel scrubbed 🗑️",
        toastArchived: "Secured in Locker 🔒",
        toastUnarchived: "Back to Base 🙌",
        toastMoved: "Deployed to",
        toastStackCreated: "Sector established! 🧱",
        toastStackNuked: "Sector demolished 💥",

        // Font Error
        fontLoadError: "Connection failed. Check vector path.",

        // Stack Modal
        stackModalTitle: "New Sector",
        stackModalPlaceholder: "Sector Name",
        createStackBtn: "Establish Sector"
    },
    uncle: {
        // Sidebar
        spillTea: "Create Note",
        vibeCheck: "Search notes...",
        vault: "Archives",
        stash: "All Notes",
        stacks: "FOLDERS",
        newStack: "New Folder",
        realTalk: "About",

        // Headers & Subtitles
        vaultSubtitle: "Archived Notes",
        folderSubtitle: "Folder View",
        stashSubtitle: "All Notes",

        // Empty States
        noNotes: "No notes found",
        startPrompt: "Click + to create a new note.",

        // Toasts
        toastCreated: "Note created successfully.",
        toastUpdated: "Note updated.",
        toastDeleted: "Note deleted.",
        toastArchived: "Note archived.",
        toastUnarchived: "Note unarchived.",
        toastMoved: "Moved to",
        toastStackCreated: "Folder created.",
        toastStackNuked: "Folder deleted.",

        // Modals - Delete Note
        deleteNoteTitle: "Delete Note?",
        deleteNoteMsg: "Are you sure you want to delete this note? This action cannot be undone.",
        deleteNoteConfirm: "Delete",
        deleteNoteCancel: "Cancel",

        // Modals - Delete Folder
        deleteFolderTitle: "Delete Folder?",
        deleteFolderMsg: "This will delete the folder and all containing notes. Confirm?",
        deleteFolderConfirm: "Delete Folder",
        deleteFolderCancel: "Cancel",

        // Modals - Info
        infoTitle: "About NoteZ",
        infoMsg: "Application Information ⚠️\n\nAll data is stored locally within your browser's cache (LocalStorage). Clearing your browser cache will result in permanent data loss. This application operates without cloud storage to ensure privacy.\n\nDeveloped by Jeel Nada.",
        infoConfirm: "Close",

        // Font Error
        fontLoadError: "Unable to load the custom font. Please check the URL.",

        // Stack Modal
        stackModalTitle: "New Folder",
        stackModalPlaceholder: "Folder Name",
        createStackBtn: "Create Folder"
    }
};

export const getThemeContent = (accent) => {
    return themeContent[accent] || themeContent.pink;
};
