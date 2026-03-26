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
      },
    },
    credits: {
      credit: "{{count}} Credit",
      credits: "{{count}} Credits",
    },
    navigation: {
      subscription: "Abonnement & Credits",
      referral: "Empfehlungsprogramm",
      help: "Hilfe",
      about: "Über uns",
      admin: "Admin-Dashboard",
    },
    confirmations: {
      deleteMessage: "Möchten Sie diese Nachricht wirklich löschen?",
    },
    welcomeTour: {
      authDialog: {
        title: "Private & geteilte Ordner freischalten",
        description:
          "Melden Sie sich an oder erstellen Sie ein Konto, um auf private und geteilte Ordner zuzugreifen. Ihre Chats werden geräteübergreifend synchronisiert.",
        continueTour: "Tour fortsetzen",
        signUp: "Registrieren / Anmelden",
      },
      buttons: {
        back: "Zurück",
        close: "Schließen",
        last: "Fertig",
        next: "Weiter",
        skip: "Überspringen",
      },
      welcome: {
        title: "Willkommen bei {{appName}}!",
        description:
          "Ihre datenschutzorientierte KI-Plattform mit {{modelCount}}+ Modellen, benutzergesteuerter Inhaltsfilterung und freier Meinungsfreiheit.",
        subtitle: "Machen Sie eine kurze Tour, um loszulegen.",
      },
      aiCompanion: {
        title: "Wählen Sie Ihren KI-Begleiter",
        description:
          "Wählen Sie aus {{modelCount}}+ KI-Modellen, darunter Mainstream, Open-Source und zensurfreie Optionen.",
        tip: "Klicken Sie, um den Modellselektor zu öffnen und Ihren Begleiter auszuwählen.",
      },
      companionVariants: {
        title: "Ihre Begleiter-Varianten",
        description:
          "Ihr Begleiter hat mehrere Varianten — brilliant für tiefes Denken, smart für alltägliche Aufgaben und zensurfrei für ungefilterte Antworten. Tippen Sie auf eine Zeile, um sofort zu wechseln.",
        tip: "Sie können die Reihenfolge per Drag ändern oder jederzeit weitere Varianten hinzufügen.",
      },
      browseSkills: {
        title: "Weitere Skills entdecken",
        description:
          "Erkunden Sie 40+ Spezialist-Skills — von Programmierern und Forschern bis zu Autoren und Beratern. Fügen Sie einen Skill als Favorit hinzu und er erscheint direkt hier.",
        tip: "Skills geben Ihrer KI einen spezifischen Fokus und das beste Modell für die Aufgabe.",
      },
      rootFolders: {
        title: "Ihre Chat-Ordner",
        description:
          "Organisieren Sie Ihre Chats in verschiedenen Ordnern, jeder mit einzigartigen Datenschutzeinstellungen:",
        private: {
          name: "Privat",
          suffix: "— nur Sie können es sehen",
        },
        incognito: {
          name: "Inkognito",
          suffix: "— kein Verlauf gespeichert",
        },
        shared: {
          name: "Geteilt",
          suffix: "— mit anderen zusammenarbeiten",
        },
        public: {
          name: "Öffentlich",
          suffix: "— für alle sichtbar",
        },
      },
      privateFolder: {
        name: "Privat",
        suffix: "Ordner",
        description:
          "Ihre privaten Chats sind nur für Sie sichtbar. Perfekt für sensible Themen.",
      },
      incognitoFolder: {
        name: "Inkognito",
        suffix: "Ordner",
        description:
          "Chatten Sie ohne Speicherung auf dem Server. Nachrichten werden lokal in Ihrem Browser gespeichert und bleiben erhalten, bis Sie sie löschen.",
        note: "Während Inkognito-Sitzungen werden keine Daten auf unseren Servern gespeichert.",
      },
      sharedFolder: {
        name: "Geteilt",
        suffix: "Ordner",
        description:
          "Arbeiten Sie mit bestimmten Personen zusammen, indem Sie den Zugriff auf diesen Ordner teilen.",
      },
      publicFolder: {
        name: "Öffentlich",
        suffix: "Ordner",
        description:
          "Teilen Sie Ihre KI-Gespräche mit der Welt. Andere können Ihre Threads ansehen und forken.",
        note: "Alles im öffentlichen Bereich ist für alle Benutzer und Suchmaschinen sichtbar.",
      },
      newChatButton: {
        title: "Einen neuen Chat starten",
        description:
          "Klicken Sie hier, um ein neues Gespräch in einem beliebigen Ordner zu starten.",
      },
      sidebarLogin: {
        title: "Anmelden, um mehr freizuschalten",
        description:
          "Erstellen Sie ein kostenloses Konto, um auf private und geteilte Ordner zuzugreifen, geräteübergreifend zu synchronisieren und die KI Dinge über Sie merken zu lassen.",
        tip: "Die Registrierung ist kostenlos!",
      },
      subscriptionButton: {
        title: "Credits & Abonnement",
        description:
          "Erhalten Sie {{credits}} Credits/Monat mit einem Abonnement für nur {{price}}/Monat. Kostenlose Nutzer erhalten {{freeCredits}} Credits/Monat.",
      },
      chatInput: {
        title: "Ihre Nachricht eingeben",
        description:
          "Geben Sie Ihre Nachricht hier ein und drücken Sie Enter oder klicken Sie Senden, um mit Ihrem KI-Begleiter zu chatten.",
        tip: "Verwenden Sie Umschalt+Enter für eine neue Zeile. Sie können auch Dateien und Bilder anhängen.",
      },
      voiceInput: {
        title: "Spracheingabe",
        description:
          "Verwenden Sie Ihr Mikrofon, um mit Ihrem KI-Begleiter zu sprechen:",
        options: {
          transcribe: "Sprache in Text transkribieren",
          sendAudio: "Audio direkt an die KI senden",
          pauseResume: "Aufnahme pausieren und fortsetzen",
        },
      },
      callMode: {
        title: "Anrufmodus — die KI antwortet laut",
        description:
          "Telefon-Symbol antippen und einfach sprechen. Die KI hört zu, antwortet laut und hält sich kurz — wie ein echtes Gespräch.",
        tip: "Kein Tippen. Kein Lesen. Einfach reden.",
      },
      complete: {
        title: "Alles erledigt!",
        description:
          "Sie haben die Tour abgeschlossen! Beginnen Sie jetzt, mit Ihrem KI-Begleiter zu chatten.",
        help: "Brauchen Sie Hilfe? Klicken Sie jederzeit auf das Fragezeichen-Symbol in der Seitenleiste.",
      },
      authUnlocked: {
        unlocked: "Freigeschaltet!",
        privateDescription:
          "Ihr privater Ordner ist jetzt verfügbar. Alle Chats hier sind nur für Sie sichtbar.",
        privateNote:
          "Private Chats werden automatisch auf allen Ihren Geräten synchronisiert.",
        sharedDescription:
          "Ihr geteilter Ordner ist jetzt verfügbar. Laden Sie andere ein, an KI-Gesprächen zusammenzuarbeiten.",
        sharedNote:
          "Sie kontrollieren, wer Zugang zu Ihren geteilten Ordnern und Threads hat.",
      },
    },
  },
};
