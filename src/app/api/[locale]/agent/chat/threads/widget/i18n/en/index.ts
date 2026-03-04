export const translations = {
  common: {
    newChat: "New Chat",
    delete: "Delete",
    cancel: "Cancel",
    settings: "Settings",
    close: "Close",
    toggleSidebar: "Toggle sidebar",
    noChatsFound: "No chats found",
  },
  actions: {
    rename: "Rename",
    unpin: "Unpin",
    pin: "Pin to Top",
    unarchive: "Unarchive",
    archive: "Archive",
    manageSharing: "Manage Sharing",
    moveToFolder: "Move to Folder",
    unfiled: "Remove from folder",
  },
  folderList: {
    managePermissions: "Manage Permissions",
    today: "Today",
    lastWeek: "Last 7 Days",
    lastMonth: "Last 30 Days",
    older: "Older",
  },
  threadList: {
    deleteDialog: {
      title: "Delete Thread",
      description:
        'Are you sure you want to delete "{{title}}"? This action cannot be undone and all messages in this thread will be permanently deleted.',
    },
  },
  suggestedPrompts: {
    title: "How can I help you?",
    privateTitle: "Your Private AI Assistant",
    privateDescription:
      "Conversations saved to your account and synced across all your devices.",
    sharedTitle: "Collaborate with AI",
    sharedDescription:
      "Create conversations and share them with team members using secure links.",
    publicTitle: "Join the Public AI Forum",
    publicDescription:
      "Public conversations visible to everyone. Share ideas and engage in open dialogue.",
    incognitoTitle: "Anonymous AI Chat",
    incognitoDescription:
      "Stored only in your browser. Never saved to your account or synced.",
  },
  config: {
    appName: "unbottled.ai",
  },
  components: {
    sidebar: {
      login: "Login",
      logout: "Logout",
      footer: {
        account: "Account",
      },
    },
    credits: {
      credit: "{{count}} credit",
      credits: "{{count}} credits",
    },
    navigation: {
      subscription: "Subscription & Credits",
      referral: "Referral Program",
      help: "Help",
      about: "About",
    },
    confirmations: {
      deleteMessage: "Are you sure you want to delete this message?",
    },
    welcomeTour: {
      authDialog: {
        title: "Unlock Private & Shared Folders",
        description:
          "Sign up or log in to access private and shared folders. Your chats will sync across devices.",
        continueTour: "Continue Tour",
        signUp: "Sign Up / Login",
      },
      buttons: {
        back: "Back",
        close: "Close",
        last: "Finish",
        next: "Next",
        skip: "Skip",
      },
      welcome: {
        title: "Welcome to {{appName}}!",
        description:
          "Your privacy-first AI platform with 40+ models, user-controlled content filtering, and free speech principles.",
        subtitle: "Let's take a quick tour to get you started.",
      },
      aiCompanion: {
        title: "Choose Your AI Companion",
        description:
          "Select from 40+ AI models including mainstream, open-source, and uncensored options.",
        tip: "Click to open the model selector and pick your companion.",
      },
      rootFolders: {
        title: "Your Chat Folders",
        description:
          "Organize your chats in different folders, each with unique privacy settings:",
        private: {
          name: "Private",
          suffix: "— encrypted, only you can see",
        },
        incognito: {
          name: "Incognito",
          suffix: "— no history saved",
        },
        shared: {
          name: "Shared",
          suffix: "— collaborate with others",
        },
        public: {
          name: "Public",
          suffix: "— visible to everyone",
        },
      },
      privateFolder: {
        name: "Private",
        suffix: "Folder",
        description:
          "Your private chats are encrypted and only visible to you. Perfect for sensitive topics.",
      },
      incognitoFolder: {
        name: "Incognito",
        suffix: "Folder",
        description:
          "Chat without saving history. When you close the session, all messages are gone.",
        note: "No data is stored on our servers during incognito sessions.",
      },
      sharedFolder: {
        name: "Shared",
        suffix: "Folder",
        description:
          "Collaborate with specific people by sharing access to this folder.",
      },
      publicFolder: {
        name: "Public",
        suffix: "Folder",
        description:
          "Share your AI conversations with the world. Others can view and fork your threads.",
        note: "Everything in Public is visible to all users and search engines.",
      },
      newChatButton: {
        title: "Start a New Chat",
        description: "Click here to start a fresh conversation in any folder.",
        tip: "You can also use keyboard shortcut Ctrl+K to quickly start a new chat.",
      },
      sidebarLogin: {
        title: "Sign In to Unlock More",
        description:
          "Create a free account to access Private and Shared folders, sync across devices, and save your conversation history.",
        tip: "It's free to sign up! You get 100 free credits to start.",
      },
      subscriptionButton: {
        title: "Credits & Subscription",
        description:
          "Get {{credits}} credits/month with a Pro subscription for just {{price}}.",
        price: "$9.99",
        tip: "Credits are used for AI model interactions. Free users get limited monthly credits.",
      },
      chatInput: {
        title: "Type Your Message",
        description:
          "Type your message here and press Enter or click Send to chat with your AI companion.",
        tip: "Use Shift+Enter for a new line. You can also attach files and images.",
      },
      voiceInput: {
        title: "Voice Input",
        description: "Use your microphone to speak to your AI companion:",
        options: {
          transcribe: "Transcribe speech to text",
          sendAudio: "Send audio directly to the AI",
          pauseResume: "Pause and resume recording",
        },
      },
      callMode: {
        title: "Call Mode",
        description:
          "Enable Call Mode for a hands-free, voice-driven conversation experience with real-time AI responses.",
        tip: "Perfect for when you're on the go or prefer speaking over typing.",
      },
      complete: {
        title: "You're All Set!",
        description:
          "You've completed the tour! Start chatting with your AI companion now.",
        help: "Need help? Click the question mark icon in the sidebar anytime.",
      },
      authUnlocked: {
        unlocked: "Unlocked!",
        privateDescription:
          "Your private folder is now available. All chats here are encrypted and only visible to you.",
        privateNote:
          "Private chats sync across all your devices automatically.",
        sharedDescription:
          "Your shared folder is now available. Invite others to collaborate on AI conversations.",
        sharedNote:
          "You control who has access to your shared folders and threads.",
      },
    },
  },
};
