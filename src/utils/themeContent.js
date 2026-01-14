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
        infoTitle: "Bestie, Listen Up ⚠️",
        infoMsg: "All your tea is stored right here in this browser (Local Storage). If you clear your cache or switch devices, your notes will ghost you. We don't do clouds here. Keep it safe! 🔒",
        infoConfirm: "Bet",

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
        infoTitle: "Yo Bro, Listen Up ⚠️",
        infoMsg: "All data is local to this rig. clear cache or switch devices = data MIA. No cloud backups here. Stay frosty. 🔒",
        infoConfirm: "Got it",

        // Toasts
        toastUpdated: "Intel updated! 🧠",
        toastCreated: "New intel secured! 🎯",
        toastDeleted: "Intel scrubbed 🗑️",
        toastArchived: "Secured in Locker 🔒",
        toastUnarchived: "Back to Base 🤝",
        toastMoved: "Deployed to",
        toastStackCreated: "Sector established! 🧱",
        toastStackNuked: "Sector demolished 💥",
    }
};

export const getThemeContent = (accent) => {
    return themeContent[accent] || themeContent.pink;
};
