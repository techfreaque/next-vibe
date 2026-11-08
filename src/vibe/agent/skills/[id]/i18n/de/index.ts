import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "KI-Werkzeuge",
  tags: {
    skills: "Skills",
  },
  voices: {
    MALE: "Männliche Stimme",
    FEMALE: "Weibliche Stimme",
  },
  enums: {
    category: {
      companion: "Begleiter",
      assistant: "Assistenten",
      coding: "Programmierung",
      creative: "Kreativ",
      writing: "Schreiben",
      analysis: "Analyse",
      roleplay: "Rollenspiel",
      education: "Bildung",
      controversial: "Kontrovers",
      background: "Hintergrund",
      custom: "Benutzerdefiniert",
    },
    ownershipType: {
      system: "Eingebaute Fertigkeit",
      user: "Von dir erstellt",
      public: "Aus der Community",
    },
  },

  get: {
    title: "Skill abrufen",
    titleShort: "Skill-Details",
    dynamicTitle: "Skill: {{name}}",
    description: "Eine bestimmte Skill anhand der ID abrufen",
    container: {
      title: "Skill-Details",
      description: "Details der angeforderten Skill",
    },
    backButton: {
      label: "Zurück zu Skills",
    },
    openFullPage: "Vollseite öffnen",
    editButton: {
      label: "Skill bearbeiten",
    },
    customizeButton: {
      label: "Skill anpassen",
    },
    deleteButton: {
      label: "Skill löschen",
    },
    addToFavoritesButton: {
      label: "Zu Favoriten hinzufügen",
    },
    inCollection: "In Sammlung",
    useNow: "Jetzt verwenden",
    goToChat: "Zum Chat",
    addAnother: "Weitere hinzufügen",
    addAnotherTooltip:
      "Eine weitere Instanz dieses Skills zu deiner Sammlung hinzufügen",
    variants: {
      title: "Modell wählen",
    },
    addToCollection: "Zu deiner Sammlung hinzufügen:",
    addAllToFavorites: "Alle Modelle hinzufügen",
    quickAdd: "Hinzufügen",
    tweakAndAdd: "Anpassen & hinzufügen",
    edit: "Bearbeiten",
    copyAndCustomize: "Eigene Version erstellen",
    delete: "Löschen",
    vote: "Bewerten",
    report: "Melden",
    actions: "Aktionen",
    designSelector: {
      label: "Design:",
      current: "Aktuell",
      a: "A: App Store",
      b: "B: Split Header",
      c: "C: Card Hero",
      d: "D: Two-Row",
    },
    addVariant: "Weiteres Modell hinzufügen",
    addVariantHint: "Anderes Modell, Persönlichkeit oder Stil",
    yourskill: "Dein Skill",
    signupPrompt: {
      title: "Dieses Skill anpassen",
      description:
        "Erstelle eine personalisierte Version mit deinen eigenen Einstellungen und Vorlieben. Melde dich an, um zu beginnen.",
      backButton: "Zurück",
      signupButton: "Konto erstellen",
      loginButton: "Anmelden",
    },
    id: {
      label: "Skill-ID",
      description: "Der Slug oder die lesbare ID des Skills",
    },
    models: {
      brain: "Gehirn",
      eyes: "Augen",
      ears: "Ohren & Stimme",
      media: "Medien",
      slots: {
        chat: "Chat",
        imageVision: "Bilderkennung",
        videoVision: "Videoerkennung",
        stt: "Sprache zu Text",
        tts: "Text zu Sprache",
        audioVision: "Audioerkennung",
        imageGen: "Bildgenerierung",
        musicGen: "Musikgenerierung",
        videoGen: "Videogenerierung",
      },
    },
    systemPrompt: {
      label: "System-Prompt",
      copy: "Kopieren",
      copied: "Kopiert!",
      view: "Vollständigen Prompt anzeigen",
    },
    response: {
      skill: {
        title: "Skill",
        id: { content: "Skill-ID" },
        name: { content: "Skill-Name" },
        description: { content: "Skill-Beschreibung" },
        icon: { content: "Skill-Symbol" },
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
        title: "Skill nicht gefunden",
        description: "Die angeforderte Skill existiert nicht",
      },
      server: {
        title: "Serverfehler",
        description: "Beim Abrufen das Skill ist ein Fehler aufgetreten",
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
      description: "Skill erfolgreich abgerufen",
    },
    share: {
      button: "Teilen & Verdienen",
      titleNamed: "{{name}} teilen und verdienen",
      title: "Teile dieses Skill & verdiene",
      description:
        "Teile dieses Skill mit deinem Empfehlungslink. Verdiene 10 % wiederkehrende Provision von jedem neuen Nutzer.",
      selectCode: "Empfehlungscode waehlen:",
      noCodesYet: "Noch keine Empfehlungscodes",
      createCode: "Code erstellen",
      codePlaceholder: "z.B. MEINCODE",
      creating: "Erstelle...",
      createFailed: "Code konnte nicht erstellt werden. Versuch einen anderen.",
      linkReady: "Dein Teilen-Link:",
      copied: "Kopiert!",
      copyLink: "Link kopieren",
      close: "Schliessen",
      authRequired:
        "Erstelle ein kostenloses Konto, um deinen Empfehlungslink zu erhalten und loszuverdienen.",
      signup: "Kostenlos registrieren",
      login: "Schon ein Konto? Einloggen",
    },
    landing: {
      backToHome: "Startseite",
      signIn: "Anmelden",
      joinFree: "Kostenlos registrieren",
      viewProfile: "Vollstaendiges Profil ansehen",
      capabilities: "Faehigkeiten",
      tools: "{{count}} Tools",
      moreFromCreator: "Mehr von {{name}}",
      tryCta: "{{name}} jetzt ausprobieren",
      tryCtaSub:
        "Kostenloses Konto. Keine Kreditkarte. In 30 Sekunden startklar.",
      startFree: "Kostenlos starten",
      alreadyHaveAccount: "Schon ein Konto?",
      copyright: "\u00A9",
      allSkills: "Alle Skills",
      featuredSkill: "Vorgestellter Skill",
      aboutSkill: "Über dieses Skill",
      modelsVariants: "Modelle & Varianten",
    },
  },
  patch: {
    title: "Skill aktualisieren",
    titleShort: "Skill bearbeiten",
    dynamicTitle: "Bearbeiten: {{name}}",
    container: {
      title: "Skill aktualisieren",
      description: "Eine vorhandene benutzerdefinierte Skill ändern",
    },
    backButton: {
      label: "Zurück zu Skills",
    },
    deleteButton: {
      label: "Skill löschen",
    },
    submitButton: {
      label: "Skill aktualisieren",
      loadingText: "Skill wird aktualisiert...",
    },
    actions: {
      update: "Skill aktualisieren",
      updating: "Skill wird aktualisiert",
    },
    response: {
      success: {
        content: "Skill erfolgreich aktualisiert",
      },
    },
    id: {
      label: "Skill-ID",
      description:
        "Der Slug oder die lesbare ID des zu aktualisierenden Skills",
    },
    name: {
      label: "Name",
      description: "Der Name das Skill",
      placeholder: "Skillnamen eingeben",
      validation: {
        minLength: "Name muss mindestens 2 Zeichen lang sein",
        maxLength: "Name muss weniger als 100 Zeichen lang sein",
      },
    },
    description: {
      label: "Beschreibung",
      description: "Eine kurze Beschreibung das Skill",
      placeholder: "Zweck und Fähigkeiten des Skills beschreiben",
      validation: {
        minLength: "Beschreibung muss mindestens 10 Zeichen lang sein",
        maxLength: "Beschreibung muss weniger als 500 Zeichen lang sein",
      },
    },
    icon: {
      label: "Symbol",
      description: "Ein Emoji-Symbol für die Skill",
    },
    systemPrompt: {
      label: "System-Prompt",
      description: "Der System-Prompt, der das Verhalten das Skill definiert",
      placeholder: "System-Prompt eingeben",
      validation: {
        minLength: "System-Prompt muss mindestens 10 Zeichen lang sein",
        maxLength: "System-Prompt muss weniger als 5000 Zeichen lang sein",
      },
    },
    category: {
      label: "Kategorie",
      description: "Die Kategorie, zu der diese Skill gehört",
    },
    tagline: {
      label: "Slogan",
      description: "Ein kurzer Slogan, der das Skill beschreibt",
      placeholder: "Slogan eingeben",
      validation: {
        minLength: "Slogan muss mindestens 2 Zeichen lang sein",
        maxLength: "Slogan muss weniger als 500 Zeichen lang sein",
      },
    },
    source: {
      label: "Quelle",
      description:
        "Die Quelle dieses Skills (integriert, benutzerdefiniert oder Community)",
    },
    isPublic: {
      label: "Öffentlich machen",
      description:
        "Aktivieren Sie dies, um Ihr Skill mit der Community zu teilen. Wenn deaktiviert, bleibt das Skill privat und nur für Sie sichtbar.",
    },
    chatModel: {
      label: "Chat-Modell",
      placeholder: "Systemstandard",
    },
    voice: {
      label: "Stimme",
      description: "Text-zu-Sprache-Stimme für dieses Skill",
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
    modelSelection: {
      label: "Modellauswahl",
      description: "Wie das KI-Modell für dieses Skill ausgewählt wird",
    },
    variants: {
      label: "Varianten",
      description:
        "Benannte Varianten mit eigener Modellauswahl. Jede Variante braucht: id, modelSelection (Pflicht), isDefault (genau eine true).",
      addButton: "Variante hinzufügen",
      setDefault: "Als Standard setzen",
      remove: "Entfernen",
      defaultBadge: "Standard",
      namePlaceholder: "Variantenname (optional)",
      skillDefaults: "Skill-Standardwerte",
      skillDefaultsHint:
        "Fallback, wenn eine Variante keine Modalität konfiguriert",
    },
    preferredModel: {
      label: "Bevorzugtes Modell",
      description: "Das bevorzugte KI-Modell für diese Skill",
    },
    availableTools: {
      label: "Erlaubte Tools",
      description:
        "Tools für dieses Skill. Jeder Eintrag benötigt eine toolId. Null = globale Einstellungen.",
    },
    pinnedTools: {
      label: "Angeheftete Tools",
      description:
        "Angeheftete Toolbar-Tools für dieses Skill. Null = globale Einstellungen.",
    },
    compactTrigger: {
      label: "Komprimierungs-Schwellenwert (Token)",
      description:
        "Token-Anzahl für automatische Gesprächskomprimierung. Null = globaler Standard.",
    },

    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Die Skill-Daten sind ungültig",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Verbindung zum Server fehlgeschlagen",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Sie müssen angemeldet sein, um Skills zu aktualisieren",
      },
      forbidden: {
        title: "Verboten",
        description:
          "Sie haben keine Berechtigung, dieses Skill zu aktualisieren",
      },
      notFound: {
        title: "Skill nicht gefunden",
        description:
          "Die Skill, die Sie aktualisieren möchten, existiert nicht",
      },
      server: {
        title: "Serverfehler",
        description: "Beim Aktualisieren das Skill ist ein Fehler aufgetreten",
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
      title: "Skill aktualisiert",
      description:
        "Ihre benutzerdefinierte Skill wurde erfolgreich aktualisiert",
    },
  },
  delete: {
    title: "Skill löschen",
    titleShort: "Skill löschen",
    dynamicTitle: "Löschen: {{name}}",
    description: "Einen benutzerdefinierten Skill löschen",
    container: {
      title: "Skill löschen",
      description: "Diesen benutzerdefinierten Skill dauerhaft entfernen",
    },
    backButton: {
      label: "Zurück zu Skills",
    },
    actions: {
      delete: "Skill löschen",
      deleting: "Skill wird gelöscht",
    },
    id: {
      label: "Skill-ID",
      description: "Der Slug oder die lesbare ID des zu löschenden Skills",
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Die Skill-Daten sind ungültig",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Verbindung zum Server nicht möglich",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Sie sind nicht berechtigt, dieses Skill zu löschen",
      },
      forbidden: {
        title: "Verboten",
        description: "Sie haben keine Berechtigung, dieses Skill zu löschen",
      },
      notFound: {
        title: "Skill nicht gefunden",
        description: "Der Skill, den Sie löschen möchten, existiert nicht",
      },
      server: {
        title: "Serverfehler",
        description: "Ein Fehler ist beim Löschen des Skills aufgetreten",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description:
          "Ein unerwarteter Fehler beim Löschen des Skills ist aufgetreten",
      },
      unsavedChanges: {
        title: "Nicht gespeicherte Änderungen",
        description: "Sie haben nicht gespeicherte Änderungen",
      },
      conflict: {
        title: "Konflikt",
        description: "Der Skill wurde von einem anderen Benutzer geändert",
      },
    },
    success: {
      title: "Skill gelöscht",
      description: "Der Skill wurde erfolgreich gelöscht",
      content: "Skill erfolgreich gelöscht",
    },
  },
};
