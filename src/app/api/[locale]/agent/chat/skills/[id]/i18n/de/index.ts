import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "KI-Werkzeuge",
  tags: {
    skills: "Charaktere",
  },
  voices: {
    MALE: "Männliche Stimme",
    FEMALE: "Weibliche Stimme",
  },
  enums: {
    ownershipType: {
      system: "Eingebaute Fertigkeit",
      user: "Von dir erstellt",
      public: "Aus der Community",
    },
  },

  get: {
    title: "Charakter abrufen",
    dynamicTitle: "Charakter: {{name}}",
    description: "Eine bestimmte Charakter anhand der ID abrufen",
    container: {
      title: "Charakter-Details",
      description: "Details der angeforderten Charakter",
    },
    backButton: {
      label: "Zurück zu Charakteren",
    },
    editButton: {
      label: "Charakter bearbeiten",
    },
    customizeButton: {
      label: "Charakter anpassen",
    },
    deleteButton: {
      label: "Charakter löschen",
    },
    addToFavoritesButton: {
      label: "Zu Favoriten hinzufügen",
    },
    inCollection: "In Sammlung",
    addAnother: "Weitere hinzufügen",
    addAnotherTooltip:
      "Eine weitere Instanz dieses Charakters zu deiner Sammlung hinzufügen",
    addToCollection: "Zu deiner Sammlung hinzufügen:",
    quickAdd: "Schnell hinzufügen",
    tweakAndAdd: "Anpassen & hinzufügen",
    edit: "Bearbeiten",
    copyAndCustomize: "Kopieren & anpassen",
    delete: "Löschen",
    actions: "Aktionen",
    designSelector: {
      label: "Design:",
      current: "Aktuell",
      a: "A: App Store",
      b: "B: Split Header",
      c: "C: Card Hero",
      d: "D: Two-Row",
    },
    yourskill: "Dein Charakter",
    signupPrompt: {
      title: "Diesen Charakter anpassen",
      description:
        "Erstelle eine personalisierte Version mit deinen eigenen Einstellungen und Vorlieben. Melde dich an, um zu beginnen.",
      backButton: "Zurück",
      signupButton: "Konto erstellen",
      loginButton: "Anmelden",
    },
    id: {
      label: "Charakter-ID",
      description: "Die eindeutige Kennung der Charakter",
    },
    systemPrompt: {
      label: "System-Prompt",
    },
    response: {
      skill: {
        title: "Charakter",
        id: { content: "Charakter-ID" },
        name: { content: "Charakter-Name" },
        description: { content: "Charakter-Beschreibung" },
        icon: { content: "Charakter-Symbol" },
        systemPrompt: { content: "System-Prompt" },
        category: { content: "Kategorie" },
        source: { content: "Quelle" },
        preferredModel: { content: "Bevorzugtes Modell" },
        voice: { content: "Stimme" },
        modelSelection: { title: "Modellauswahl" },
        selectionType: { content: "Auswahltyp" },
        minIntelligence: { content: "Minimale Intelligenz" },
        maxIntelligence: { content: "Maximale Intelligenz" },
        minPrice: { content: "Mindestpreis" },
        maxPrice: { content: "Maximalpreis" },
        minContent: { content: "Minimale Inhaltsstufe" },
        maxContent: { content: "Maximale Inhaltsstufe" },
        minSpeed: { content: "Minimale Geschwindigkeit" },
        maxSpeed: { content: "Maximale Geschwindigkeit" },
        preferredStrengths: { content: "Bevorzugte Stärken" },
        ignoredWeaknesses: { content: "Ignorierte Schwächen" },
        manualModelId: { content: "Manuelles Modell" },
      },
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Anfrageparameter",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Verbindung zum Server fehlgeschlagen",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description:
          "Sie müssen angemeldet sein, um auf diese Ressource zuzugreifen",
      },
      forbidden: {
        title: "Verboten",
        description:
          "Sie haben keine Berechtigung, auf diese Ressource zuzugreifen",
      },
      notFound: {
        title: "Charakter nicht gefunden",
        description: "Die angeforderte Charakter existiert nicht",
      },
      server: {
        title: "Serverfehler",
        description: "Beim Abrufen der Charakter ist ein Fehler aufgetreten",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
      },
      unsavedChanges: {
        title: "Nicht gespeicherte Änderungen",
        description: "Sie haben nicht gespeicherte Änderungen",
      },
      conflict: {
        title: "Konflikt",
        description: "Ein Konflikt mit dem aktuellen Zustand ist aufgetreten",
      },
    },
    voiceModelSelection: {
      systemDefault: "Systemstandard",
    },
    success: {
      title: "Erfolg",
      description: "Charakter erfolgreich abgerufen",
    },
    share: {
      button: "Teilen & Verdienen",
      title: "Teile diesen Skill & verdiene",
      description:
        "Teile diesen Skill mit deinem Empfehlungslink. Verdiene 10% wiederkehrende Provision von jedem neuen Nutzer.",
      selectCode: "Empfehlungscode waehlen:",
      noCodesYet: "Noch keine Empfehlungscodes",
      createCode: "Code erstellen",
      codePlaceholder: "z.B. MEINCODE",
      creating: "Erstelle...",
      linkReady: "Dein Teilen-Link:",
      copied: "Kopiert!",
      copyLink: "Link kopieren",
      close: "Schliessen",
    },
  },
  patch: {
    title: "Charakter aktualisieren",
    dynamicTitle: "Bearbeiten: {{name}}",
    container: {
      title: "Charakter aktualisieren",
      description: "Eine vorhandene benutzerdefinierte Charakter ändern",
    },
    backButton: {
      label: "Zurück zur Charakter",
    },
    deleteButton: {
      label: "Charakter löschen",
    },
    submitButton: {
      label: "Charakter aktualisieren",
      loadingText: "Charakter wird aktualisiert...",
    },
    actions: {
      update: "Charakter aktualisieren",
      updating: "Charakter wird aktualisiert",
    },
    response: {
      success: {
        content: "Charakter erfolgreich aktualisiert",
      },
    },
    id: {
      label: "Charakter-ID",
      description: "Die eindeutige Kennung der zu aktualisierenden Charakter",
    },
    name: {
      label: "Name",
      description: "Der Name der Charakter",
      placeholder: "Charakternamen eingeben",
      validation: {
        minLength: "Name muss mindestens 2 Zeichen lang sein",
        maxLength: "Name muss weniger als 100 Zeichen lang sein",
      },
    },
    description: {
      label: "Beschreibung",
      description: "Eine kurze Beschreibung der Charakter",
      placeholder: "Zweck und Fähigkeiten des Charakters beschreiben",
      validation: {
        minLength: "Beschreibung muss mindestens 10 Zeichen lang sein",
        maxLength: "Beschreibung muss weniger als 500 Zeichen lang sein",
      },
    },
    icon: {
      label: "Symbol",
      description: "Ein Emoji-Symbol für die Charakter",
    },
    systemPrompt: {
      label: "System-Prompt",
      description:
        "Der System-Prompt, der das Verhalten der Charakter definiert",
      placeholder: "System-Prompt eingeben",
      validation: {
        minLength: "System-Prompt muss mindestens 10 Zeichen lang sein",
        maxLength: "System-Prompt muss weniger als 5000 Zeichen lang sein",
      },
    },
    category: {
      label: "Kategorie",
      description: "Die Kategorie, zu der diese Charakter gehört",
    },
    tagline: {
      label: "Slogan",
      description: "Ein kurzer Slogan, der den Charakter beschreibt",
      placeholder: "Slogan eingeben",
      validation: {
        minLength: "Slogan muss mindestens 2 Zeichen lang sein",
        maxLength: "Slogan muss weniger als 500 Zeichen lang sein",
      },
    },
    source: {
      label: "Quelle",
      description:
        "Die Quelle dieses Charakters (integriert, benutzerdefiniert oder Community)",
    },
    isPublic: {
      label: "Öffentlich machen",
      description:
        "Aktivieren Sie dies, um Ihren Charakter mit der Community zu teilen. Wenn deaktiviert, bleibt der Charakter privat und nur für Sie sichtbar.",
    },
    chatModel: {
      label: "Chat-Modell",
      placeholder: "Systemstandard",
    },
    voice: {
      label: "Stimme",
      description: "Text-zu-Sprache-Stimme für diesen Charakter",
      placeholder: "Systemstandard",
    },
    sttModel: {
      label: "Sprache-zu-Text-Modell",
      description: "Modell für die Spracherkennung",
      placeholder: "Systemstandard",
    },
    imageVisionModel: {
      label: "Bild-Vision-Modell",
      description: "Modell zur Bildanalyse",
      placeholder: "Systemstandard",
    },
    videoVisionModel: {
      label: "Video-Vision-Modell",
      description: "Modell zur Videoanalyse",
      placeholder: "Systemstandard",
    },
    audioVisionModel: {
      label: "Audio-Vision-Modell",
      description: "Modell zur Audioanalyse",
      placeholder: "Systemstandard",
    },
    translationModel: {
      label: "Übersetzungsmodell",
      description: "Modell für die Textübersetzung",
    },
    imageGenModel: {
      label: "Bildgenerierungsmodell",
      description: "Modell zur Bilderstellung",
      placeholder: "Systemstandard",
    },
    musicGenModel: {
      label: "Musikgenerierungsmodell",
      description: "Modell zur Musikerstellung",
      placeholder: "Systemstandard",
    },
    videoGenModel: {
      label: "Video-Generierungsmodell",
      description: "Modell zur Videoerstellung",
      placeholder: "Systemstandard",
    },
    defaultChatMode: {
      label: "Standard-Chat-Modus",
      description: "Standardmodus beim Öffnen dieses Chats",
    },
    modelSelection: {
      label: "Modellauswahl",
      description: "Wie das KI-Modell für diesen Charakter ausgewählt wird",
    },
    preferredModel: {
      label: "Bevorzugtes Modell",
      description: "Das bevorzugte KI-Modell für diese Charakter",
    },
    availableTools: {
      label: "Erlaubte Tools",
      description:
        "Tools für diesen Charakter. Jeder Eintrag benötigt eine toolId. Null = globale Einstellungen.",
    },
    pinnedTools: {
      label: "Angeheftete Tools",
      description:
        "Angeheftete Toolbar-Tools für diesen Charakter. Null = globale Einstellungen.",
    },
    compactTrigger: {
      label: "Komprimierungs-Schwellenwert (Token)",
      description:
        "Token-Anzahl für automatische Gesprächskomprimierung. Null = globaler Standard.",
    },

    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Die Charakter-Daten sind ungültig",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Verbindung zum Server fehlgeschlagen",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description:
          "Sie müssen angemeldet sein, um Charakters zu aktualisieren",
      },
      forbidden: {
        title: "Verboten",
        description:
          "Sie haben keine Berechtigung, diese Charakter zu aktualisieren",
      },
      notFound: {
        title: "Charakter nicht gefunden",
        description:
          "Die Charakter, die Sie aktualisieren möchten, existiert nicht",
      },
      server: {
        title: "Serverfehler",
        description:
          "Beim Aktualisieren der Charakter ist ein Fehler aufgetreten",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
      },
      unsavedChanges: {
        title: "Nicht gespeicherte Änderungen",
        description: "Sie haben nicht gespeicherte Änderungen",
      },
      conflict: {
        title: "Konflikt",
        description: "Ein Konflikt mit dem aktuellen Zustand ist aufgetreten",
      },
    },
    success: {
      title: "Charakter aktualisiert",
      description:
        "Ihre benutzerdefinierte Charakter wurde erfolgreich aktualisiert",
    },
  },
  delete: {
    title: "Charakter löschen",
    dynamicTitle: "Löschen: {{name}}",
    description: "Einen benutzerdefinierten Charakter löschen",
    container: {
      title: "Charakter löschen",
      description: "Diesen benutzerdefinierten Charakter dauerhaft entfernen",
    },
    backButton: {
      label: "Zurück zur Charakter",
    },
    actions: {
      delete: "Charakter löschen",
      deleting: "Charakter wird gelöscht",
    },
    id: {
      label: "Charakter-ID",
      description: "Die eindeutige Kennung des zu löschenden Charakters",
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Die Charakter-Daten sind ungültig",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Verbindung zum Server nicht möglich",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Sie sind nicht berechtigt, diesen Charakter zu löschen",
      },
      forbidden: {
        title: "Verboten",
        description:
          "Sie haben keine Berechtigung, diesen Charakter zu löschen",
      },
      notFound: {
        title: "Charakter nicht gefunden",
        description: "Der Charakter, den Sie löschen möchten, existiert nicht",
      },
      server: {
        title: "Serverfehler",
        description: "Ein Fehler ist beim Löschen des Charakters aufgetreten",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description:
          "Ein unerwarteter Fehler beim Löschen des Charakters ist aufgetreten",
      },
      unsavedChanges: {
        title: "Nicht gespeicherte Änderungen",
        description: "Sie haben nicht gespeicherte Änderungen",
      },
      conflict: {
        title: "Konflikt",
        description: "Der Charakter wurde von einem anderen Benutzer geändert",
      },
    },
    success: {
      title: "Charakter gelöscht",
      description: "Der Charakter wurde erfolgreich gelöscht",
      content: "Charakter erfolgreich gelöscht",
    },
  },
};
