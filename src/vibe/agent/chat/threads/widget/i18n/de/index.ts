import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  common: {
    newChat: "Neuer Chat",
    delete: "Löschen",
    cancel: "Abbrechen",
    settings: "Einstellungen",
    close: "Schließen",
    toggleSidebar: "Seitenleiste umschalten",
    noChatsFound: "Keine Chats gefunden",
  },
  actions: {
    rename: "Umbenennen",
    unpin: "Entpinnen",
    pin: "Oben anheften",
    unarchive: "Aus Archiv holen",
    archive: "Archivieren",
    manageSharing: "Freigabe verwalten",
    moveToFolder: "In Ordner verschieben",
    unfiled: "Aus Ordner entfernen",
  },
  folderList: {
    managePermissions: "Berechtigungen verwalten",
    today: "Heute",
    lastWeek: "Letzte 7 Tage",
    lastMonth: "Letzte 30 Tage",
    older: "Älter",
  },
  threadList: {
    deleteDialog: {
      title: "Thread löschen",
      description:
        'Möchten Sie "{{title}}" wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden und alle Nachrichten in diesem Thread werden dauerhaft gelöscht.',
    },
  },
  suggestedPrompts: {
    title: "Wie kann ich helfen?",
    privateTitle: "Ihr privater KI-Assistent",
    privateDescription:
      "Gespräche werden in Ihrem Konto gespeichert und auf allen Geräten synchronisiert.",
    sharedTitle: "Mit KI zusammenarbeiten",
    sharedDescription:
      "Erstellen Sie Gespräche und teilen Sie sie mit Teammitgliedern über sichere Links.",
    publicTitle: "Dem öffentlichen KI-Forum beitreten",
    publicDescription:
      "Öffentliche Gespräche für alle sichtbar. Teilen Sie Ideen und engagieren Sie sich im Dialog.",
    incognitoTitle: "Anonymer KI-Chat",
    incognitoDescription:
      "Nur in Ihrem Browser gespeichert. Nie in Ihrem Konto gespeichert oder synchronisiert.",
    backgroundTitle: "Deine KI-Agenten arbeiten",
    backgroundDescription:
      "Subagenten und autonome Hintergrundagenten erledigen Aufgaben hier, während du dich um anderes kümmern kannst. Ergebnisse landen automatisch hier.",
  },
  config: {
    appName: "unbottled.ai",
  },
  components: {
    sidebar: {
      login: "Anmelden",
      signup: "Registrieren",
      logout: "Abmelden",
      footer: {
        account: "Konto",
        expandAccount: "Kontobereich aufklappen",
        collapseAccount: "Kontobereich zuklappen",
      },
    },
    credits: {
      label: "Credits",
      credit: "{{count}} Credit",
      credits: "{{count}} Credits",
    },
    navigation: {
      subscription: "Abonnement & Credits",
      partnerDashboard: "Partner-Dashboard",
      apiKeys: "API-Schlüssel",
      referral: "Empfehlungsprogramm",
      settings: "Mein Profil & Einstellungen",
      leadMagnet: "Lead Magnet",
      help: "Feedback & Support",
      about: "Über uns",
      websiteBlog: "Geschichten",
      newsletter: "Newsletter: {{freeCreditsMax}} Gratis-Credits/Monat",
      admin: "Admin-Dashboard",
    },
    confirmations: {
      deleteMessage: "Möchten Sie diese Nachricht wirklich löschen?",
    },
    signInGate: {
      title: "Melde dich an, um diesen Thread zu öffnen",
      description:
        "Diese Unterhaltung liegt in einem privaten oder geteilten Ordner. Melde dich mit einem Konto an, das Zugriff hat.",
      signIn: "Anmelden",
      signUp: "Kostenloses Konto erstellen",
      incognito: "Lieber einen privaten Chat starten",
    },
  },
};
