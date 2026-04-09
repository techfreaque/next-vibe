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
      signup: "Sign up",
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
      settings: "Profile Settings",
      leadMagnet: "Lead Magnet",
      help: "Feedback & Support",
      about: "About",
      websiteBlog: "Website & Blog",
      admin: "Admin Dashboard",
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
          "Your privacy-first AI platform with {{modelCount}} models, user-controlled content filtering, and free speech principles.",
        subtitle: "Let's take a quick tour to get you started.",
      },
      aiCompanion: {
        title: "Choose Your AI Companion",
        description:
          "Select from {{modelCount}} AI models including mainstream, open-source, and uncensored options.",
        tip: "Click to open the model selector and pick your companion.",
      },
      companionVariants: {
        title: "Your Companion Variants",
        description:
          "Your companion comes in multiple variants - brilliant for deep thinking, smart for everyday tasks, and uncensored for unfiltered responses. Tap any row to switch instantly.",
        tip: "You can drag to reorder or add more variants anytime.",
      },
      browseSkills: {
        title: "Discover More Skills",
        description:
          "Explore 40+ skills - coders, researchers, writers, advisors and more. Add one as a favorite and it shows up right here.",
        tip: "Skills give your AI a clear focus and the right model for the job.",
      },
      meetCompanion: {
        title: "Meet Your Companion",
        description:
          "Your companion is ready. Click any variant to start a conversation — each one has a different style and model behind it.",
      },
      rootFolders: {
        title: "Your Chat Folders",
        description:
          "Organize your chats in different folders, each with unique privacy settings:",
        private: {
          name: "Private",
          suffix: "— only you can see",
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
          "Your private chats are only visible to you. Perfect for sensitive topics.",
      },
      incognitoFolder: {
        name: "Incognito",
        suffix: "Folder",
        description:
          "Chat without saving history to the server. Messages are stored locally in your browser and persist until you clear them.",
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
      },
      sidebarLogin: {
        title: "Sign In to Unlock More",
        description:
          "Create a free account to access Private and Shared folders, sync your conversation history across devices, and let the AI remember things about you.",
        tip: "It's free to sign up!",
      },
      subscriptionButton: {
        title: "Credits & Subscription",
        description:
          "Get {{credits}} credits/month with a subscription for just {{price}}/month. Free users get {{freeCredits}} credits/month.",
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
        title: "Call Mode - AI Talks Back",
        description:
          "Tap the phone button and just speak. The AI listens, answers out loud, and keeps it short - like a real conversation.",
        tip: "No typing. No reading. Just talk.",
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
          "Your private folder is now available. All chats here are only visible to you.",
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
