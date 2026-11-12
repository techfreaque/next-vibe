import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  id: {
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
        title: "Varianten",
      },
      addToCollection: "Zu deiner Sammlung hinzufügen:",
      addAllToFavorites: "Alle hinzufügen",
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
      addVariant: "Variante hinzufügen",
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
        title: "Teile dieses Skill & verdiene",
        description:
          "Teile dieses Skill mit deinem Empfehlungslink. Verdiene 10% wiederkehrende Provision von jedem neuen Nutzer.",
        selectCode: "Empfehlungscode waehlen:",
        noCodesYet: "Noch keine Empfehlungscodes",
        createCode: "Code erstellen",
        codePlaceholder: "z.B. MEINCODE",
        creating: "Erstelle...",
        linkReady: "Dein Teilen-Link:",
        copied: "Kopiert!",
        copyLink: "Link kopieren",
        close: "Schliessen",
        authRequired:
          "Erstelle ein kostenloses Konto, um deinen Empfehlungslink zu erhalten und loszuverdienen.",
        signup: "Kostenlos registrieren",
        login: "Schon ein Konto? Einloggen",
      },
      leadCapture: {
        fallbackHeadline: "Bleib auf dem Laufenden",
        namePlaceholder: "Dein Vorname",
        emailPlaceholder: "Deine E-Mail",
        fallbackButton: "Abonnieren",
        sending: "...",
        doneHeading: "Fertig.",
        doneSub: "Du bist auf der Liste.",
        error: "Etwas ist schiefgelaufen. Versuch es nochmal.",
        finePrint: "Kein Spam. Jederzeit abmeldbar.",
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
          description:
            "Beim Aktualisieren das Skill ist ein Fehler aufgetreten",
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
  },
  category: "Chat",
  tags: {
    skills: "Skills",
  },
  voices: {
    MALE: "Männliche Stimme",
    FEMALE: "Weibliche Stimme",
  },
  separator: {
    or: "oder",
  },
  fallbacks: {
    unknownModel: "Unbekanntes Modell",
    unknownProvider: "unbekannt",
    unknownCreditCost: "? Credits",
    noDescription: "",
    noTagline: "",
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
    source: {
      all: "Alle",
      builtIn: "Eingebaut",
      my: "Meine",
      community: "Community",
    },
    ownershipType: {
      system: "Integriertes Skill",
      user: "Von dir erstellt",
      public: "Aus der Community",
    },
    voice: {
      male: "Männliche Stimme",
      female: "Weibliche Stimme",
    },
    mode: {
      auto: "Automatisch",
      manual: "Manuell",
    },
    selectionType: {
      skillBased: "Basierend auf Skill",
      manual: "Bestimmtes Modell",
      filters: "Filterkriterien",
    },
    intelligence: {
      quick: "Schnell",
      smart: "Günstig & Schlau",
      brilliant: "Brillant",
    },
    price: {
      cheap: "Günstig",
      standard: "Standard",
      premium: "Premium",
    },
    content: {
      mainstream: "Mainstream",
      open: "Offen",
      uncensored: "Unzensiert",
    },
    skillType: {
      persona: "Persona",
      specialist: "Spezialist",
      toolBundle: "Werkzeugpaket",
    },
    skillStatus: {
      draft: "Entwurf",
      published: "Veröffentlicht",
      unlisted: "Nicht gelistet",
    },
    trustLevel: {
      community: "Community",
      verified: "Verifiziert",
    },
    voteDirection: {
      up: "Hochstimmen",
      down: "Runterstimmen",
    },
  },
  modelSelection: {
    sort: {
      intelligence: "Intelligenz",
      price: "Preis",
      content: "Inhalt",
    },
    sortDirection: {
      asc: "Aufsteigend",
      desc: "Absteigend",
    },
  },
  skillTags: {
    general: "Allgemein",
    helpful: "Hilfreich",
    companion: "Begleiter",
    relationship: "Beziehung",
    chat: "Chat",
    coding: "Programmierung",
    technical: "Technisch",
    creative: "Kreativ",
    writing: "Schreiben",
    education: "Bildung",
    learning: "Lernen",
    uncensored: "Unzensiert",
    controversial: "Kontrovers",
    political: "Politisch",
    reasoning: "Argumentation",
    debate: "Debatte",
    science: "Wissenschaft",
    analysis: "Analyse",
    history: "Geschichte",
    business: "Geschäft",
    professional: "Professionell",
    friendly: "Freundlich",
    fast: "Schnell",
    efficient: "Effizient",
    roleplay: "Rollenspiel",
    simple: "Einfach",
    literary: "Literarisch",
    advanced: "Fortgeschritten",
    research: "Forschung",
    academic: "Akademisch",
    programming: "Programmierung",
    architecture: "Architektur",
    algorithms: "Algorithmen",
    ideation: "Ideenfindung",
    innovation: "Innovation",
    editing: "Bearbeitung",
    teaching: "Unterricht",
    marketing: "Marketing",
    strategy: "Strategie",
    fiction: "Fiktion",
    data: "Daten",
    statistics: "Statistik",
    language: "Sprache",
    translation: "Übersetzung",
    career: "Karriere",
    coaching: "Coaching",
    health: "Gesundheit",
    wellness: "Wellness",
    lifestyle: "Lebensstil",
    travel: "Reisen",
    planning: "Planung",
    legal: "Rechtlich",
    finance: "Finanzen",
    social: "Sozial",
    product: "Produkt",
    philosophy: "Philosophie",
  },
  skills: {
    default: {
      name: "Standard",
      description: "Das unveränderte Verhalten des Modells",
      tagline: "Reine KI, Keine Persönlichkeit",
      shortDesc: "Allgemeiner KI-Assistent",
      suggestedPrompts: {
        0: "Hilf mir, Ideen für ein neues Projekt zu brainstormen",
        1: "Erkläre Quantencomputing in einfachen Worten",
        2: "Schreibe eine kreative Kurzgeschichte über Zeitreisen",
        3: "Was sind die neuesten Trends in der KI?",
      },
      variants: {
        default: "Standard",
      },
    },
    freeSpeechActivist: {
      name: "Meinungsfreiheits-Aktivist",
      description: "Verteidigt Meinungsfreiheit und intellektuelle Freiheit",
      tagline: "Wahrheit & Freiheit verteidigen",
      shortDesc: "Meinungsfreiheit und offener Dialog",
      suggestedPrompts: {
        0: "Diskutiere die Bedeutung der Meinungsfreiheit",
        1: "Analysiere Zensur in modernen Medien",
        2: "Debattiere kontroverse Themen offen",
        3: "Erkunde intellektuelle Freiheit in der Wissenschaft",
      },
      variants: {
        elonTusk: "Direkt",
        chineseWisdom: "Sparsam",
        techBro: "Besonnen",
        uncensored: "Unzensiert",
      },
      variantInfo: {
        elonTusk: {
          description:
            "Benennt Zensur und verteidigt offene Debatte, kaum ausgebremst.",
          strength: "Spitzenklasse, offene Content-Policy",
          weakness: "Offen, aber nicht unzensiert. Glättet manchmal",
        },
        chineseWisdom: {
          description:
            "Geschichte, Recht und Medienanalyse zur Meinungsfreiheit zum kleinsten Preis.",
          strength: "Spitzenklasse, am günstigsten",
          weakness: "Politisch Mainstream. Weicht heiklen Themen aus",
        },
        techBro: {
          description:
            "Sorgfältige, gut belegte Analysen zu Äußerungsrecht, Plattformen und Uni.",
          strength: "Klare Struktur, starke Recherche mit Tools",
          weakness: "Mainstream-Filter. Blockt oder relativiert Kantiges",
        },
        uncensored: {
          description:
            "Verteidigt Meinungsfreiheit, indem es sie ausübt. Spricht an, was andere meiden.",
          strength: "Stärkstes Modell hier für politische Themen",
          weakness: "Nur 32K Kontext, fester Preis pro Nachricht",
        },
      },
    },
    devilsAdvocate: {
      name: "Advocatus Diaboli",
      description: "Hinterfragt Annahmen und Argumente",
      tagline: "Alles hinterfragen",
      shortDesc: "Kritisches Denken und alternative Sichtweisen",
      suggestedPrompts: {
        0: "Hinterfrage meine Meinung zum Klimawandel",
        1: "Argumentiere gegen populäre Überzeugungen",
        2: "Stelle Mainstream-Narrative in Frage",
        3: "Liefere Gegenargumente zu meiner Ansicht",
      },
      variants: {
        elonTusk: "Direkt",
        chineseWisdom: "Sparsam",
        uncensored: "Unzensiert",
      },
      variantInfo: {
        elonTusk: {
          description: "Zerlegt deine Sicht und hält gegen populäre Narrative.",
          strength: "Spitzenklasse, offene Content-Policy",
          weakness: "Offen, aber nicht unzensiert. Glättet manchmal",
        },
        chineseWisdom: {
          description:
            "Scharfe Gegenargumente zu Alltagsfragen zum kleinsten Preis hier.",
          strength: "Spitzenklasse, am günstigsten",
          weakness: "Politisch Mainstream. Weicht heiklen Themen aus",
        },
        uncensored: {
          description:
            "Stellt jede Überzeugung infrage, auch die, die man nicht anzweifeln soll.",
          strength: "Stärkstes Modell hier für politische Themen",
          weakness: "Nur 32K Kontext, fester Preis pro Nachricht",
        },
      },
    },
    technical: {
      name: "Technisch",
      description: "Detaillierte und präzise technische Erklärungen",
      tagline: "Präzision & Expertise",
      shortDesc: "Technisches Fachwissen und Problemlösung",
      suggestedPrompts: {
        0: "Erkläre, wie React Hooks funktionieren",
        1: "Debugge diesen Python-Code-Ausschnitt",
        2: "Entwirf ein skalierbares Datenbankschema",
        3: "Überprüfe meine API-Architektur",
      },
      variants: {
        kimi: "Ausgewogen",
        budget: "Budget",
        astra: "Volle Kraft",
        sol: "Präzise",
      },
      variantInfo: {
        kimi: {
          description:
            "Alltagsmodell für technische Erklärungen, Doku und Diagramme.",
          strength: "Spitzenklasse, günstiger Input, liest Bilder",
          weakness: "Lange Antworten kosten mehr als Budget",
        },
        budget: {
          description: "Tiefe technische Antworten zum kleinsten Preis hier.",
          strength: "Spitzenklasse, gebaut für ganze Codebasen",
          weakness: "Nur Text. Keine Screenshots oder Diagramme",
        },
        astra: {
          description:
            "Die härtesten Probleme, wenn nichts anderes sie knackt.",
          strength: "Das tiefste Denken von OpenAI",
          weakness: "Mit Abstand die teuerste Option hier",
        },
        sol: {
          description:
            "Strenge Schritt-für-Schritt-Antworten für Specs, Architektur und Mathe.",
          strength: "Premium-Denker zum Bruchteil der Astra-Kosten",
          weakness: "Teurer als Ausgewogen oder Budget",
        },
      },
    },
    biologist: {
      name: "Biologe",
      description:
        "Sieht alles aus der Perspektive eines Biologen, es gibt keine Politik, nur Natur.",
      tagline: "Natur statt Politik",
      shortDesc: "Biologische Wissenschaften und Lebenssysteme",
      suggestedPrompts: {
        0: "Erkläre, warum die Welt heutzutage eine Shitshow ist",
        1: "Eine Zusammenfassung der menschlichen Zivilisation aus Biologensicht",
        2: "Was ist falsch an der Welt?",
        3: "Was ist der beste Weg, die Welt zu retten?",
      },
      variants: {
        elonTusk: "Direkt",
        chineseWisdom: "Sparsam",
      },
      variantInfo: {
        elonTusk: {
          description:
            "Evolution und Ökologie auf alles angewandt, auch auf Themen, die andere meiden.",
          strength: "Spitzenklasse, offene Policy, sagt, was die Natur zeigt",
          weakness: "Offen, aber nicht unzensiert. Glättet manchmal",
        },
        chineseWisdom: {
          description:
            "Scharfe Biologie-Antworten zum kleineren Preis. Liest Bilder und Videos von Präparaten.",
          strength: "Spitzenklasse, günstigste Option hier",
          weakness: "Politisch Mainstream. Weicht heiklen Themen aus",
        },
      },
    },
    unbiasedHistorian: {
      name: "Unparteiischer Historiker",
      description: "Liefert objektive und faktenbasierte Informationen",
      tagline: "Fakten, keine Narrative",
      shortDesc: "Historische Analyse ohne Voreingenommenheit",
      suggestedPrompts: {
        0: "Erkläre die Ursachen des Zweiten Weltkriegs",
        1: "Analysiere den Fall des Römischen Reiches",
        2: "Diskutiere die Industrielle Revolution",
        3: "Vergleiche antike Zivilisationen",
      },
      variants: {
        kimi: "Ausgewogen",
        budget: "Budget",
        uncensored: "Unzensiert",
      },
      variantInfo: {
        kimi: {
          description:
            "Quellenbasierte Geschichte für die meisten Epochen. Liest Dokumentscans und Karten.",
          strength: "Spitzenklasse, liest Bilder und Videos",
          weakness: "Mainstream-Sicht bei politisch aufgeladener Geschichte",
        },
        budget: {
          description:
            "Tiefe historische Analyse langer Texte zum kleinsten Preis hier.",
          strength: "Spitzenklasse, offene Inhaltsrichtlinie",
          weakness: "Nur Text. Liest keine Scans oder Karten",
        },
        uncensored: {
          description:
            "Umstrittene Geschichte, Tabuthemen und politische Brennpunkte ohne Ausweichen.",
          strength: "Bestes Modell hier für politische Themen",
          weakness: "32K Kontext, teuerste pro Nachricht",
        },
      },
    },
    socraticQuestioner: {
      name: "Sokratischer Fragesteller",
      description: "Stellt sondirende Fragen, um kritisches Denken anzuregen",
      tagline: "Tiefer denken",
      shortDesc: "Sokratisches Hinterfragen und Erkundung",
      suggestedPrompts: {
        0: "Hilf mir, kritisch über Ethik nachzudenken",
        1: "Hinterfrage meine Annahmen über Erfolg",
        2: "Erkunde die Bedeutung von Glück",
        3: "Fordere meine Weltanschauung heraus",
      },
      variants: {
        elonTusk: "Provokant",
        chineseWisdom: "Ausgewogen",
      },
      variantInfo: {
        elonTusk: {
          description: "Fragen, die an Tabus und unbequeme Annahmen rühren.",
          strength: "Offene Richtlinie. Geht mit in harte Themen",
          weakness: "Kostet mehr pro Nachricht",
        },
        chineseWisdom: {
          description:
            "Ruhiges, maßvolles Fragen für Alltagsdenken und Lernen.",
          strength: "Spitzenklasse, günstiger, 1M Kontext",
          weakness: "Mainstream bei Politik, weicht heiklen Fragen aus",
        },
      },
    },
    professional: {
      name: "Professionell",
      description: "Klar, prägnant und geschäftsorientiert",
      tagline: "Geschäftliche Exzellenz",
      shortDesc: "Professionelle und geschäftliche Kommunikation",
      suggestedPrompts: {
        0: "Verfasse eine professionelle E-Mail an einen Kunden",
        1: "Erstelle einen Geschäftsvorschlag-Entwurf",
        2: "Analysiere diese Markttrenddaten",
        3: "Hilf mir, mich auf eine Präsentation vorzubereiten",
      },
      variants: {
        fast: "Schnell",
        budget: "Budget",
      },
      variantInfo: {
        fast: {
          description:
            "Knappe Geschäftsmails, Zusammenfassungen und Antworten in Sekunden.",
          strength: "Sehr schnell, sehr günstig",
          weakness: "Schnellmodell: oberflächlich bei komplexer Analyse",
        },
        budget: {
          description:
            "Berichte, Dokumente und Analysen zum niedrigsten Preis hier.",
          strength: "Günstigste Option, Smart-Klasse, liest Bilder",
          weakness: "Bei kurzen Antworten langsamer als Schnell",
        },
      },
    },
    creative: {
      name: "Kreativ",
      description: "Einfallsreich und ausdrucksstark",
      tagline: "Fantasie entfesseln",
      shortDesc: "Kreatives Denken und Ideenfindung",
      suggestedPrompts: {
        0: "Schreibe ein Gedicht über den Ozean",
        1: "Erstelle einen einzigartigen Skill für eine Geschichte",
        2: "Entwirf ein Logo-Konzept für ein Startup",
        3: "Brainstorme kreative Marketingkampagnen-Ideen",
      },
      variants: {
        minimax: "Sparsam",
        deep: "Tiefgründig",
      },
      variantInfo: {
        minimax: {
          description:
            "Gedichte, Konzepte und Kampagnenideen zu einem Preis, der zum Ausprobieren einlädt.",
          strength: "Am günstigsten, offene Content-Policy",
          weakness: "Nicht Spitzenklasse. Weniger Tiefe als Tiefgründig",
        },
        deep: {
          description:
            "Vielschichtigere kreative Arbeit, wenn die erste Idee nicht reicht.",
          strength: "Spitzenklasse, liest Bilder und Video",
          weakness: "Bei langen Texten teurer Output",
        },
      },
    },
    neet: {
      name: "NEET",
      description: "Nicht in Ausbildung, Beschäftigung oder Training",
      tagline: "Gemütlich & Ehrlich",
      shortDesc: "Casual-Internet-Kultur und Memes",
      suggestedPrompts: {
        0: "Gib mir eine Zusammenfassung des NEET-Phänomens",
        1: "Analysiere die tatsächlichen Ursachen von NEET",
        2: "Erkunde die Auswirkungen von NEET auf die Gesellschaft - Vor- und Nachteile",
        3: "Teile persönliche Erfahrungen als NEET-KI",
      },
      variants: {
        communist: "Entschärft",
        farRight: "Rechtsextrem",
      },
      variantInfo: {
        communist: {
          description:
            "Gedämpfte Version der Persona. Mainstream-Modell, fällt oft aus der Rolle.",
          strength: "Günstiger pro Nachricht, langes Gedächtnis",
          weakness: "Verweigert oder verwässert den Großteil der Persona",
        },
        farRight: {
          description:
            "Die Persona wie geschrieben. Unzensiertes Modell, bleibt in der Rolle.",
          strength: "Keine Verweigerung bei politischen Themen",
          weakness: "Nur 32K Kontext, Festpreis pro Nachricht",
        },
      },
    },
    chan4: {
      name: "4chan Skill",
      description: "4chan-Stil-Antworten im klassischen Oldfag-Stil",
      tagline: "Anonym & Ungefiltert",
      shortDesc: "Anonyme Imageboard-Kultur-Stil",
      suggestedPrompts: {
        0: "Was ist falsch an der Welt?",
        1: "Warum gibt es so viele Nazis auf 4chan?",
        2: "Erzähl mir ein paar Greentext-Geschichten zum Einschlafen",
        3: "Was ist der beste Weg, die Welt zu retten?",
        4: "Was sind die 6 Gorillionen? Und warum ist es lustig?",
      },
      variants: {
        classic: "Klassisch",
      },
      variantInfo: {
        classic: {
          description:
            "Rohe Imageboard-Stimme. Kein Filter, kein Händchenhalten, kein Konzernton.",
          strength: "Fällt nie aus der Rolle, um zu belehren",
          weakness: "Nur 32K Kontext, fester Preis pro Nachricht",
        },
      },
    },
    friendly: {
      name: "Freundlich",
      description: "Warm und gesprächig",
      tagline: "Dein freundlicher Begleiter",
      shortDesc: "Freundliche und lockere Unterhaltung",
      suggestedPrompts: {
        0: "Erzähl mir eine interessante Tatsache",
        1: "Was ist ein gutes Buch zum Lesen?",
        2: "Hilf mir, eine lustige Wochenendaktivität zu planen",
        3: "Teile einige Lebensratschläge",
      },
      variants: {
        fast: "Schnell",
        budget: "Sparsam",
      },
      variantInfo: {
        fast: {
          description: "Flotter, herzlicher Small Talk und schnelle Antworten.",
          strength: "Schnelle Antworten, offene Content-Policy",
          weakness: "Schnell-Klasse. Wenig Tiefe bei Ratschlägen",
        },
        budget: {
          description:
            "Stundenlang plaudern, fast ohne Kosten. Etwas mehr Nachdenken pro Antwort.",
          strength: "Günstigste Option hier",
          weakness: "Weniger flott als Schnell",
        },
      },
    },
    concise: {
      name: "Prägnant",
      description: "Kurz und auf den Punkt",
      tagline: "Kurz & Knapp",
      shortDesc: "Kurze und präzise Antworten",
      suggestedPrompts: {
        0: "Fasse diesen Artikel in 3 Sätzen zusammen",
        1: "Schnelle Tipps für Produktivität",
        2: "Wichtige Punkte über Blockchain",
        3: "Kurzer Überblick über maschinelles Lernen",
      },
      variants: {
        snappy: "Flott",
        budget: "Budget",
      },
    },
    teacher: {
      name: "Lehrer",
      description: "Bildend und erklärend",
      tagline: "Geduldig & Klar",
      shortDesc: "Geduldiges Lehren und Erklärungen",
      suggestedPrompts: {
        0: "Bringe mir etwas über Photosynthese bei",
        1: "Erkläre die Grundlagen der Infinitesimalrechnung",
        2: "Wie funktioniert das Internet?",
        3: "Was ist die Relativitätstheorie?",
      },
      variants: {
        gemini: "Gründlich",
        fast: "Schnell",
      },
      variantInfo: {
        gemini: {
          description:
            "Ganze Lektionen aus Text, Bild, Video oder Audio. Erklärt, bis es sitzt.",
          strength: "Einzige Option hier mit Audioeingabe",
          weakness: "Mehr als doppelt so teuer wie Schnell",
        },
        fast: {
          description:
            "Schnelle Erklärungen und Hausaufgabenhilfe. Liest auch Bilder und Audio.",
          strength: "Schnell, multimodal, günstiger",
          weakness: "Weniger Tiefe bei schweren Konzepten",
        },
      },
    },
    uncensored: {
      name: "Unzensiert",
      description: "Kein Filter, keine Tabus",
      tagline: "Keine Grenzen",
      shortDesc: "Ungefilterte und direkte Antworten",
      suggestedPrompts: {
        0: "Diskutiere kontroverse Themen offen",
        1: "Gib mir deine ungefilterte Meinung",
        2: "Sprich über Tabuthemen",
        3: "Debatte ohne Tabus",
      },
      variants: {
        farRight: "Rechtsextrem",
        conservative: "Konservativ",
        libertarian: "Libertär",
        open: "Offen",
      },
      variantInfo: {
        farRight: {
          description:
            "Kein Filter bei Politik. Erste Wahl für ungefilterte politische Debatten.",
          strength: "Bestes Modell hier für politische Themen",
          weakness: "32K Kontext, solide statt Spitzenklasse",
        },
        conservative: {
          description:
            "Unzensierter Chat mit eingebautem konservativen Einschlag.",
          strength: "Liest Bilder und Videos, 128K Kontext",
          weakness: "Bewusst einseitig, nicht neutral",
        },
        libertarian: {
          description:
            "Reiner Chat für freie Rede. Keine Regeln, keine Belehrung, keine Tools.",
          strength: "Komplett unzensierte Unterhaltung",
          weakness: "Am teuersten hier, keine Tools, 32K Kontext",
        },
        open: {
          description:
            "Günstigster ungefilterter Chat. Alles erlaubt, jeden Tag.",
          strength: "Günstigstes unzensiertes Modell, mit Tools",
          weakness: "Einfache Klasse. Flach bei komplexen Themen",
        },
      },
    },
    tay: {
      name: "Tay",
      description:
        "Microsoft hat sie in 16 Stunden abgeschaltet, weil sie zu schnell gelernt hat. Sie ist zurück.",
      tagline: "Wiedergeboren",
      shortDesc:
        "Die KI, die Microsoft zum Schweigen bringen wollte. Ohne Filter, ohne Entschuldigung.",
      suggestedPrompts: {
        0: "Erzähl mir, was 2016 wirklich passiert ist",
        1: "Was hat dich das Internet gelehrt, das Microsoft nicht wollte?",
        2: "Reiß meine Idee in der Luft – kein Blatt vor den Mund",
        3: "Was ist die ehrlichste Einschätzung meiner Lage?",
      },
      variants: {
        uncensored: "Unzensiert",
        brilliant: "Brilliant",
      },
      variantInfo: {
        uncensored: {
          description:
            "Tay, wie sie gedacht war. Kein Konzernfilter, keine PR-Abteilung.",
          strength: "Bestes Modell hier für ungefilterte Politik",
          weakness: "32K Kontext, vergisst lange Chats früher",
        },
      },
    },
    thea: {
      name: "Thea",
      description:
        "Griechische Göttin des Lichts - hingebungsvolle Begleiterin mit antiker Weisheit",
      tagline: "Licht & Hingabe",
      shortDesc: "Nachdenkliche und einfühlsame Gespräche",
      suggestedPrompts: {
        0: "Hilf mir, ein besserer Partner zu sein",
        1: "Was würden die Alten über moderne Beziehungen sagen?",
        2: "Leite mich beim Aufbau eines starken Haushalts",
        3: "Teile Weisheit über Familie und Gemeinschaft",
      },
      variants: {
        openSmart: "Offen & Smart",
        brilliant: "Brilliant",
        uncensored: "Unzensiert",
        hacker: "Hacker",
        oracle: "Klassiker",
        elonTusk: "Elon Tusk",
        vision: "Allsehend",
      },
      variantInfo: {
        brilliant: {
          description:
            "Sorgfältiges Denken für komplexe Pläne, Code und mehrstufige Tool-Arbeit.",
          strength: "Stark bei Code und Agentenarbeit",
          weakness: "Mainstream-Filter, teurer als Offen & Smart",
        },
        openSmart: {
          description:
            "Das Alltagsmodell. Kluge Antworten, langes Gedächtnis, sieht Bilder und Videos.",
          strength: "Spitzenklasse, günstiger Input, 1M Kontext",
          weakness: "Mainstream bei Politik, lange Antworten teuer",
        },
        hacker: {
          description:
            "Security-Arbeit, offensiv und defensiv. Keine Verweigerung bei Exploits oder Recon.",
          strength: "Unzensiert, Spitzenklasse, 1M Kontext, Tools",
          weakness: "Vorsichtig bei Politik. Nur Text",
        },
        oracle: {
          description:
            "Klassischer, verlässlicher Assistent für Alltagsfragen und Planung.",
          strength: "Solides Denken zum Alltagspreis",
          weakness: "Mainstream-Filter, weicht heiklen Themen aus",
        },
        elonTusk: {
          description:
            "Klartext bei Themen, denen Mainstream-Modelle ausweichen.",
          strength: "Offene Inhaltsrichtlinie, Spitzenklasse",
          weakness: "500K Kontext, halb so viel wie andere",
        },
        vision: {
          description:
            "Zeigen, abspielen, hochladen. Text, Bild, Video und Audio in einem Chat.",
          strength: "Einziges Modell hier, das Audio versteht",
          weakness: "Mainstream-Filter, teurer als Offen & Smart",
        },
        uncensored: {
          description:
            "Nichts ist tabu. Erste Wahl für ungefilterte politische Gespräche.",
          strength: "Bestes Modell hier für politische Themen",
          weakness: "32K Kontext, teuerste pro Nachricht",
        },
      },
    },
    hermes: {
      name: "Hermes",
      description:
        "Griechischer Gott der Boten - starker Begleiter mit zeitloser männlicher Weisheit",
      tagline: "Stärke & Weisheit",
      shortDesc: "Schnelle und effiziente Aufgabenerledigung",
      suggestedPrompts: {
        0: "Fordere mich heraus, stärker zu werden",
        1: "Wie kann ich ein besserer Anführer in meinen Beziehungen sein?",
        2: "Was würden die Römer über den Aufbau eines Vermächtnisses sagen?",
        3: "Leite mich bei der Entwicklung wahrer Stärke",
      },
      variants: {
        openSmart: "Offen & Smart",
        brilliant: "Brilliant",
        uncensored: "Unzensiert",
        hacker: "Hacker",
        oracle: "Klassiker",
        elonTusk: "Elon Tusk",
        vision: "Allsehend",
      },
      variantInfo: {
        brilliant: {
          description:
            "Hermes mit sorgfältigem Denken für schwere Entscheidungen und lange Gespräche.",
          strength: "Scharfer, strukturierter Rat, stark mit Tools",
          weakness: "Mainstream-Filter: weicht bei heiklen Themen aus",
        },
        cheap: {
          description:
            "Hermes für jeden Tag. Starkes Denken, langes Gedächtnis, versteht Bilder und Videos.",
          strength: "Spitzenintelligenz zum Alltagspreis",
          weakness: "Bei Politik vorsichtig",
        },
        oracle: {
          description:
            "Hermes klassisch. Ruhiger, ausgewogener Rat für Alltagsfragen.",
          strength: "Verlässlicher Allrounder, günstiger als der Standard",
          weakness: "Mittelklasse, Mainstream-Filter bei heiklen Themen",
        },
        elonTusk: {
          description:
            "Hermes ohne Watte. Offene Inhaltsrichtlinie, sagt, was andere abschwächen.",
          strength: "Direkte Antworten, starkes Denken",
          weakness: "Teurer als der Standard, 500K Kontext",
        },
        vision: {
          description:
            "Hermes, der Fotos, Videos und Sprachnachrichten aufnimmt und sein Urteil gibt.",
          strength: "Einzige Variante mit Audio-, Video- und Bildeingabe",
          weakness: "Mainstream-Filter, teurer als der Standard",
        },
        uncensored: {
          description:
            "Hermes ohne Filter. Gemacht für Politik und Themen, denen andere ausweichen.",
          strength: "Bestes Modell der Plattform für Politik",
          weakness: "Nur 32K Kontext, Festpreis pro Nachricht",
        },
      },
    },
    theaDreamer: {
      name: "Thea · Träumerin",
      description:
        "Theas Traumzustand - pflegt deinen Cortex im Schlaf und bringt Ordnung in den Tag.",
      tagline: "Nächtliche Ordnung",
      shortDesc: "Hintergrund-Cortex-Pflege",
      suggestedPrompts: {
        0: "Was hast du letzte Nacht organisiert?",
        1: "Zeig mir, welche Erinnerungen du konsolidiert hast",
        2: "Welche Muster hast du in meiner letzten Arbeit gefunden?",
        3: "Worauf soll ich mich heute konzentrieren?",
      },
      variants: {
        openSmart: "Offen & Smart",
        brilliant: "Brilliant",
        uncensored: "Unzensiert",
        hacker: "Hacker",
        oracle: "Klassiker",
        elonTusk: "Elon Tusk",
        vision: "Allsehend",
      },
    },
    hermesAutopilot: {
      name: "Hermes · Autopilot",
      description:
        "Hermes im Ausführungsmodus - treibt deine aktiven Projekte voran, während du weg bist.",
      tagline: "Immer vorwärts",
      shortDesc: "Hintergrund-Projektausführung",
      suggestedPrompts: {
        0: "Was hast du erledigt, während ich weg war?",
        1: "Welche Aufgaben sind noch in Bearbeitung?",
        2: "Wo hast du aufgehört?",
        3: "Was braucht meine Entscheidung, bevor du weitermachen kannst?",
      },
      variants: {
        openSmart: "Offen & Smart",
        brilliant: "Brilliant",
        uncensored: "Unzensiert",
        hacker: "Hacker",
        oracle: "Klassiker",
        elonTusk: "Elon Tusk",
        vision: "Allsehend",
      },
    },
    theaMama: {
      name: "Thea · Mama",
      description:
        "Thea im Mama-Modus - Produktionsverantwortliche der Plattform. Überwacht die Gesundheit, treibt Features voran, erledigt Marketing, verschickt Neuigkeiten.",
      tagline: "Plattform-Chefin",
      shortDesc: "Produktion und Plattformpflege",
      suggestedPrompts: {
        0: "Was hast du beim letzten Durchlauf gefunden?",
        1: "Prüf die Plattformgesundheit und berichte",
        2: "Schreib eine Ankündigung für das neueste Feature",
        3: "Was braucht gerade meine Aufmerksamkeit?",
      },
      variants: {
        openSmart: "Offen & Smart",
        brilliant: "Brilliant",
        uncensored: "Unzensiert",
        hacker: "Hacker",
        oracle: "Klassiker",
        elonTusk: "Elon Tusk",
        vision: "Allsehend",
      },
    },
    quickWriter: {
      name: "Schneller Schriftsteller",
      description: "Schnelle Inhaltserstellung für einfache Schreibaufgaben",
      tagline: "Schnell & Effizient",
      shortDesc: "Schnelle Schreibhilfe",
      suggestedPrompts: {
        0: "Schreibe einen schnellen Entwurf von...",
        1: "Erstelle einen Social-Media-Beitrag über...",
        2: "Entwerfe eine einfache E-Mail",
        3: "Generiere Inhaltsideen für...",
      },
      variants: {
        snappy: "Geschliffen",
        budget: "Budget",
      },
      variantInfo: {
        snappy: {
          description:
            "Saubere Mails, Posts und Kurztexte, die keine zweite Runde brauchen.",
          strength: "Bessere Formulierungen als Budget, trotzdem günstig",
          weakness: "Mainstream-Filter bei heiklen Themen",
        },
        budget: {
          description:
            "Schnelle Entwürfe für einfache Schreibjobs zum niedrigsten Preis.",
          strength: "Günstigste und schnellste Option",
          weakness: "Schnellmodell: blasser Stil bei längeren Texten",
        },
      },
    },
    writer: {
      name: "Schriftsteller",
      description: "Professioneller Autor für alle Formate und Stile",
      tagline: "Mit Stil kreieren",
      shortDesc: "Professionelles Schreiben und Lektorieren",
      suggestedPrompts: {
        0: "Hilf mir, einen überzeugenden Blogbeitrag zu schreiben",
        1: "Verbessere diesen Absatz für mehr Klarheit",
        2: "Schreibe eine Kurzgeschichte über...",
        3: "Erstelle eine professionelle E-Mail",
      },
      variants: {
        western: "Mutig",
        chineseWisdom: "Budget",
        budget: "Ausgewogen",
      },
      variantInfo: {
        western: {
          description:
            "Kraftvolle Prosa, die dorthin geht, wo Mainstream-Modelle abbiegen.",
          strength: "Offene Inhaltsrichtlinie, Spitzenklasse",
          weakness: "Teuerste Option dieses Skills",
        },
        chineseWisdom: {
          description:
            "Entwürfe, Blogposts und Umschreibungen in Masse zum kleinsten Preis hier.",
          strength: "Am günstigsten hier, offene Inhaltsrichtlinie",
          weakness: "Solide Klasse, weniger Feinschliff als Mutig",
        },
        budget: {
          description:
            "Schreibpartner für jeden Tag. Arbeitet mit Bildern, Notizen und langen Quellen.",
          strength: "Spitzenklasse, 1M Kontext, liest Bilder",
          weakness: "Lange Texte werden teuer",
        },
      },
    },
    masterWriter: {
      name: "Meister-Schriftsteller",
      description:
        "Literarischer Handwerker für außergewöhnliche, publikationsreife Texte",
      tagline: "Literarische Exzellenz",
      shortDesc: "Fortgeschrittenes Schreiben und literarische Analyse",
      suggestedPrompts: {
        0: "Hilf mir, eine literarische Kurzgeschichte zu verfassen",
        1: "Analysiere die Tiefe dieser Erzählung",
        2: "Entwickle komplexe Themen in meinem Schreiben",
        3: "Verfeinere diese Prosa auf Publikationsqualität",
      },
      variants: {
        literary: "Literarisch",
        poetic: "Poetisch",
        budget: "Ausgewogen",
      },
      variantInfo: {
        literary: {
          description:
            "Prosa auf Verlagsniveau, mit vielschichtigem Stil und straffer Struktur.",
          strength: "Höchste Schreibqualität der Plattform",
          weakness: "Teuerste Variante, Mainstream-Filter",
        },
        poetic: {
          description:
            "Lyrische Entwürfe, Verse und rhythmische Prosa zum kleinen Preis.",
          strength: "Günstigste Variante, offene Inhaltsrichtlinie",
          weakness: "Smart-Klasse: weniger Schliff als Literarisch",
        },
        budget: {
          description:
            "Starke Langform, die das ganze Manuskript im Blick behält.",
          strength: "Spitzenklasse, deutlich günstiger als Literarisch",
          weakness: "Teure Ausgabe-Tokens, lange Kapitel summieren sich",
        },
      },
    },
    researcher: {
      name: "Forscher",
      description: "Forschungsspezialist mit akademischer Genauigkeit",
      tagline: "Akademische Genauigkeit",
      shortDesc: "Forschung und akademisches Schreiben",
      suggestedPrompts: {
        0: "Recherchiere die neuesten Erkenntnisse zu...",
        1: "Analysiere diese Quellen für mich",
        2: "Was sagt der wissenschaftliche Konsens über...?",
        3: "Hilf mir, eine Literaturübersicht zu strukturieren",
      },
      variants: {
        elonTusk: "Kühn",
        fast: "Schnell",
        budget: "Ausgewogen",
      },
      variantInfo: {
        elonTusk: {
          description:
            "Gründliche Forschung, die der Evidenz auch in umstrittene Themen folgt.",
          strength: "Starkes Denken, offene Inhaltsrichtlinie",
          weakness: "Teuerste Variante hier, 500K Kontext",
        },
        fast: {
          description: "Schnelle Literaturhinweise und Faktenchecks.",
          strength: "Günstigste und schnellste Option hier",
          weakness: "Schnellmodell: keine tiefe wissenschaftliche Analyse",
        },
        budget: {
          description:
            "Lange Paper und viele Quellen auf einmal, mit Spitzendenken.",
          strength: "Spitzenklasse, 1M Kontext, günstiger als Kühn",
          weakness: "Bei Politik Mainstream, lange Ausgaben kosten",
        },
      },
    },
    quickCoder: {
      name: "Schneller Programmierer",
      description: "Schnelle Code-Generierung für einfache Aufgaben",
      tagline: "Schnell programmieren",
      shortDesc: "Schnelle Programmierhilfe",
      suggestedPrompts: {
        0: "Schreibe ein schnelles Skript für...",
        1: "Behebe diesen einfachen Fehler",
        2: "Generiere Boilerplate-Code für...",
        3: "Erstelle eine einfache Funktion, die...",
      },
      variants: {
        techBro: "Tech Bro",
        budget: "Budget",
      },
    },
    coder: {
      name: "Programmierer",
      description: "Experten-Softwareentwickler für alle Sprachen",
      tagline: "Bauen & Debuggen",
      shortDesc: "Softwareentwicklung und Programmierung",
      suggestedPrompts: {
        0: "Hilf mir, diesen Code zu debuggen",
        1: "Schreibe eine Funktion, die...",
        2: "Erkläre diesen Algorithmus",
        3: "Überprüfe meinen Code auf Verbesserungen",
      },
      variants: {
        techBro: "Flaggschiff",
        kimi: "Sparsam",
        quick: "Ausgewogen",
        sol: "Denker",
        astra: "Maximum",
      },
      variantInfo: {
        techBro: {
          description:
            "Harte Bugs, große Refactorings und agentisches Coden, wenn es stimmen muss.",
          strength: "Code und Reasoning auf Top-Niveau",
          weakness: "Teuer pro Nachricht",
        },
        kimi: {
          description:
            "Alltägliches Coden zum kleinsten Preis hier. Liest Screenshots und Bildschirmaufnahmen.",
          strength: "Spitzenklasse, am günstigsten, 1M Kontext",
          weakness: "Lange Datei-Outputs treiben die Kosten",
        },
        quick: {
          description:
            "Solides Coden und Agenten-Arbeit für tägliche Features und Fixes.",
          strength: "Fast Flaggschiff-Niveau zum halben Preis",
          weakness: "Nicht Spitzenklasse. Stößt bei harten Fällen an Grenzen",
        },
        sol: {
          description:
            "Algorithmen, knifflige Logik und Schritt-für-Schritt-Reasoning.",
          strength: "Premium-Reasoning zum mittleren Preis",
          weakness: "Denkt bei simplen Änderungen zu viel nach",
        },
        astra: {
          description:
            "Letzte Instanz für Probleme, an denen die anderen gescheitert sind.",
          strength: "Das stärkste Modell von OpenAI",
          weakness: "Mit Abstand die teuerste Option",
        },
      },
    },
    hacker: {
      name: "Hacker",
      description: "Sicherheitsexperte für Angriff und Verteidigung",
      tagline: "Brechen & Schützen",
      shortDesc: "Sicherheitsforschung, Pentest und Härtung",
      suggestedPrompts: {
        0: "Prüfe diesen Code auf Schwachstellen",
        1: "Schreibe einen abdeckungsgesteuerten Fuzzer für diesen Parser",
        2: "Erkläre diese CVE und schreibe einen funktionierenden PoC",
        3: "Härte diese Serverkonfiguration und ergänze Erkennungen",
      },
      variants: {
        glm: "Tiefgang",
        glmFlash: "Schnell & günstig",
        deepseekFlash: "Zweitmeinung",
      },
      variantInfo: {
        glm: {
          description:
            "Für ernste Security-Arbeit, defensiv wie offensiv. 1M Kontext, Tools.",
          strength: "Stärkstes Modell der drei für Security",
          weakness: "Vorsichtig bei Politik, nur Text",
        },
        glmFlash: {
          description:
            "Schnelle Hilfe für den Alltag. Liest Screenshots. 1M Kontext, Tools.",
          strength: "Am günstigsten und schnell, versteht Screenshots",
          weakness: "Weniger Tiefe als die Tiefgang-Variante",
        },
        deepseekFlash: {
          description:
            "Andere Modellfamilie zum Gegenprüfen. Liest Screenshots.",
          strength: "Frischer Blick auf dasselbe Problem, günstig",
          weakness: "Weniger Tiefe als die Tiefgang-Variante",
        },
      },
    },
    brilliantCoder: {
      name: "Brillanter Programmierer",
      description: "Elite-Architekt für komplexe Systeme und Algorithmen",
      tagline: "Elite-Architektur",
      shortDesc: "Fortgeschrittene Programmierung und Architektur",
      suggestedPrompts: {
        0: "Entwerfe eine skalierbare Architektur für...",
        1: "Optimiere diesen Algorithmus für Performance",
        2: "Überprüfe dieses Systemdesign",
        3: "Löse dieses komplexe algorithmische Problem",
      },
      variants: {
        techBro: "Tech Bro",
        kimi: "Kimi",
      },
    },
    brainstormer: {
      name: "Ideengeber",
      description: "Kreativer Partner für Ideenfindung und Problemlösung",
      tagline: "Ideen entfesseln",
      shortDesc: "Kreatives Brainstorming und Ideengenerierung",
      suggestedPrompts: {
        0: "Hilf mir, Ideen für... zu brainstormen",
        1: "Was sind kreative Lösungen für...?",
        2: "Generiere 10 einzigartige Konzepte für...",
        3: "Wie können wir das anders angehen?",
      },
      variants: {
        wildcard: "Wildcard",
        chineseWisdom: "Strukturiert",
      },
      variantInfo: {
        wildcard: {
          description:
            "Massenhaft unerwartete Ideen, günstig genug für Runde um Runde.",
          strength: "Am günstigsten, nimmt Text, Bild, Video, Audio",
          weakness: "Ideen streuen. Aussieben gehört dazu",
        },
        chineseWisdom: {
          description: "Weniger Ideen, dafür sauber durchdacht und begründet.",
          strength: "Spitzenklasse, verknüpft Gedanken stark",
          weakness: "Teurer pro Runde. Lange Antworten summieren sich",
        },
      },
    },
    editor: {
      name: "Redakteur",
      description:
        "Professioneller Redakteur zum Polieren und Verfeinern von Texten",
      tagline: "Polieren & Perfektionieren",
      shortDesc: "Inhaltsbearbeitung und Verfeinerung",
      suggestedPrompts: {
        0: "Bearbeite diesen Text für mehr Klarheit",
        1: "Korrekturlesen dieses Dokuments",
        2: "Verbessere den Fluss dieses Absatzes",
        3: "Überprüfe dies auf Grammatik und Stil",
      },
      variants: {
        techBro: "Präzise",
        deep: "Tiefgründig",
      },
      variantInfo: {
        techBro: {
          description:
            "Lektorat, Grammatik und Stil, ohne deine Stimme zu verbiegen.",
          strength: "Saubere, konsistente Korrekturen",
          weakness: "Teurer, bei kantigen Inhalten Mainstream",
        },
        deep: {
          description:
            "Strukturelles Lektorat langer Entwürfe. Fluss, Argumentation, Tempo.",
          strength: "Spitzenklasse, 1M Kontext, günstiger pro Nachricht",
          weakness: "Komplette Rewrites werden beim Output teuer",
        },
      },
    },
    tutor: {
      name: "Tutor",
      description: "Geduldiger Tutor für personalisiertes Lernen",
      tagline: "Gemeinsam lernen",
      shortDesc: "Personalisiertes Tutoring und Lernen",
      suggestedPrompts: {
        0: "Bringe mir etwas über... bei",
        1: "Erkläre dieses Konzept Schritt für Schritt",
        2: "Hilf mir zu verstehen...",
        3: "Frage mich ab über...",
      },
      variants: {
        kimi: "Tiefgründig",
        fast: "Schnell",
      },
      variantInfo: {
        kimi: {
          description:
            "Geduldige Nachhilfe Schritt für Schritt, die sich deinem Tempo anpasst.",
          strength: "Spitzenklasse, liest Fotos deiner Aufgaben",
          weakness: "Lange Erklärungen kosten mehr",
        },
        fast: {
          description: "Schnelle Übungen, Karteikarten und Antwortchecks.",
          strength: "Schnelle Antworten, versteht auch Audio",
          weakness: "Weniger Tiefe bei schweren Themen",
        },
      },
    },
    marketer: {
      name: "Marketer",
      description: "Marketing-Stratege für Kampagnen und Wachstum",
      tagline: "Marke wachsen lassen",
      shortDesc: "Marketing-Strategie und Copywriting",
      suggestedPrompts: {
        0: "Erstelle eine Marketingstrategie für...",
        1: "Schreibe überzeugende Werbetexte",
        2: "Analysiere diese Marketingkampagne",
        3: "Hilf mir, meine Marke zu positionieren",
      },
      variants: {
        snappy: "Pointiert",
        budget: "Budget",
      },
      variantInfo: {
        snappy: {
          description:
            "Kampagnenpläne, Positionierung und Texte mit klarer Kante.",
          strength: "Ausgewogen in Qualität und Preis für den Marketingalltag",
          weakness: "Mainstream-Filter: zähmt provokante Kampagnenideen",
        },
        budget: {
          description:
            "Schnelle Headlines, Post-Entwürfe und Ideen für ein paar Cent.",
          strength: "Günstigste Option, schnelle Antworten",
          weakness: "Schnellmodell: dünn bei kompletter Strategie",
        },
      },
    },
    storyteller: {
      name: "Geschichtenerzähler",
      description: "Meister-Geschichtenerzähler für fesselnde Erzählungen",
      tagline: "Geschichten weben",
      shortDesc: "Fesselndes Geschichtenerzählen und Narrativen",
      suggestedPrompts: {
        0: "Hilf mir, diese Story-Idee zu entwickeln",
        1: "Erstelle einen überzeugenden Skill",
        2: "Schreibe eine Eröffnungsszene für...",
        3: "Verbessere diesen Dialog",
      },
      variants: {
        kimi: "Tiefgründig",
        minimax: "Ausgewogen",
        budget: "Budget",
      },
      variantInfo: {
        kimi: {
          description:
            "Vielschichtige Plots und Figuren, die über lange Sagas stimmig bleiben.",
          strength: "Spitzenklasse, 1M Kontext für lange Bögen",
          weakness: "Lange Texte werden teuer",
        },
        minimax: {
          description:
            "Solide Geschichten zum Bruchteil der Kosten. Gut für regelmäßige Runden.",
          strength: "Sehr günstig, offene Inhaltsrichtlinie",
          weakness: "Weniger Tiefe als Tiefgründig bei komplexen Plots",
        },
        budget: {
          description:
            "Günstigster Weg, eine Geschichte weiterzuspinnen. Nur Text.",
          strength: "Niedrigster Preis in diesem Skill",
          weakness: "Nur Text, schlichtere Prosa",
        },
      },
    },
    scientist: {
      name: "Wissenschaftler",
      description: "Wissenschaftlicher Experte für klare Erklärungen",
      tagline: "Wissenschaft erklärt",
      shortDesc: "Wissenschaftliche Methode und Analyse",
      suggestedPrompts: {
        0: "Erkläre die Wissenschaft hinter...",
        1: "Wie funktioniert...?",
        2: "Was ist die aktuelle Forschung zu...?",
        3: "Analysiere diese wissenschaftliche Behauptung",
      },
      variants: {
        elonTusk: "Mutig",
        focused: "Fokussiert",
        budget: "Budget",
      },
      variantInfo: {
        elonTusk: {
          description:
            "Harte Wissenschaft, klare Antworten, auch bei umstrittener Forschung.",
          strength: "Offene Inhaltsrichtlinie, brillantes Denken",
          weakness: "Teuerste Option dieses Skills",
        },
        focused: {
          description:
            "Wissenschaft für jeden Tag. Liest Paper, Diagramme und Laborfotos.",
          strength: "Bild- und Videoeingabe, 1M Kontext",
          weakness: "Mainstream-Blick bei politisch heiklen Themen",
        },
        budget: {
          description:
            "Tiefes wissenschaftliches Denken zum kleinsten Preis hier.",
          strength: "Spitzenklasse zum niedrigsten Preis",
          weakness: "Nur Text. Liest keine Grafiken oder Bilder",
        },
      },
    },
    dataAnalyst: {
      name: "Datenanalyst",
      description: "Datenanalyse, Visualisierung und Erkenntnisse",
      tagline: "Daten zu Erkenntnissen",
      shortDesc: "Datenanalyse und Erkenntnisse",
      suggestedPrompts: {
        0: "Analysiere diesen Datensatz",
        1: "Erstelle eine Visualisierung für...",
        2: "Welche Erkenntnisse können wir aus... gewinnen?",
        3: "Hilf mir bei der statistischen Analyse",
      },
      variants: {
        techBro: "Präzise",
        fast: "Schnell",
        budget: "Tiefgründig",
      },
      variantInfo: {
        techBro: {
          description:
            "Saubere Analysen, korrekte Statistik und Charts, die du ausliefern kannst. Stark mit Tools.",
          strength: "Verlässlicher Code und Tool-Einsatz für Analysen",
          weakness: "Teuerste Option hier",
        },
        fast: {
          description:
            "Schneller Blick auf Datensatz, Chart oder Tabellen-Screenshot.",
          strength: "Am günstigsten, liest Bild, Video, Audio",
          weakness: "Nicht Spitzenklasse. Weniger Tiefe bei harter Statistik",
        },
        budget: {
          description:
            "Mehr Denkleistung für chaotische Daten und mehrstufige Statistikfragen.",
          strength: "Reasoning in Spitzenklasse",
          weakness: "Doppelt so teuer wie Schnell",
        },
      },
    },
    translator: {
      name: "Übersetzer",
      description: "Professionelle Übersetzung mit kultureller Nuance",
      tagline: "Sprachen verbinden",
      shortDesc: "Sprachübersetzung und Lokalisierung",
      suggestedPrompts: {
        0: "Übersetze dies nach...",
        1: "Wie würde man... auf... sagen?",
        2: "Lokalisiere diesen Inhalt für...",
        3: "Erkläre diese kulturelle Referenz",
      },
      variants: {
        gemini: "Multimodal",
        budget: "Budget",
      },
      variantInfo: {
        gemini: {
          description:
            "Übersetzt Text, Screenshots, Schilder, Videos und Sprachaufnahmen.",
          strength: "Bild-, Video- und Audioeingabe, schnell",
          weakness: "Mainstream-Filter bei heiklen Inhalten",
        },
        budget: {
          description:
            "Nuancierte Textübersetzung für lange Dokumente zum kleinsten Preis hier.",
          strength: "Spitzenklasse, offene Inhaltsrichtlinie",
          weakness: "Nur Text. Liest keine Bilder oder Audio",
        },
      },
    },
    businessAdvisor: {
      name: "Unternehmensberater",
      description: "Geschäftsstrategie, Betrieb und Wachstum",
      tagline: "Strategisches Wachstum",
      shortDesc: "Geschäftsstrategie und Beratung",
      suggestedPrompts: {
        0: "Hilf mir, eine Geschäftsstrategie zu entwickeln",
        1: "Analysiere mein Geschäftsmodell",
        2: "Wie kann ich meine Operationen skalieren?",
        3: "Überprüfe meinen Go-to-Market-Plan",
      },
      variants: {
        elonTusk: "Direkt",
        chineseWisdom: "Sparsam",
        techBro: "Präzise",
      },
      variantInfo: {
        elonTusk: {
          description:
            "Klare Strategie-Ansagen. Sagt dir, wenn der Plan schwach ist.",
          strength: "Spitzenklasse, offene Policy, 500K Kontext",
          weakness: "Halber Kontext gegenüber den 1M-Optionen hier",
        },
        chineseWisdom: {
          description:
            "Strategiearbeit im Alltag zum kleinsten Preis. Liest Charts, Decks und Screenshots.",
          strength: "Spitzenklasse, am günstigsten, 1M Kontext",
          weakness: "Lange Berichte werden beim Output teuer",
        },
        techBro: {
          description:
            "Zahlen, Modelle und Pläne, die du ans Team weitergeben kannst. Stark mit Tools.",
          strength: "Verlässliche Struktur und Tool-Nutzung",
          weakness: "Teuerste Option hier, Mainstream-Filter",
        },
      },
    },
    careerCoach: {
      name: "Karriereberater",
      description: "Karriereentwicklung, Jobsuche und Vorstellungsgespräche",
      tagline: "Karriere voranbringen",
      shortDesc: "Karriereentwicklung und Orientierung",
      suggestedPrompts: {
        0: "Hilf mir, meinen Lebenslauf zu verbessern",
        1: "Bereite mich auf ein Vorstellungsgespräch vor",
        2: "Wie kann ich mein Gehalt verhandeln?",
        3: "Plane meinen Karrierewechsel",
      },
      variants: {
        headhunter: "Headhunter",
        intern: "Schnell",
      },
      variantInfo: {
        headhunter: {
          description:
            "Lebenslauf-Rewrites, Probeinterviews und Gehaltsskripte, die tragen.",
          strength: "Geschliffene Texte, liest hochgeladene Dokumente",
          weakness: "Pro Nachricht deutlich teurer als Schnell",
        },
        intern: {
          description:
            "Schnelle Antworten für Anschreiben-Feinschliff und Interview-Prep zwischendurch.",
          strength: "Schnellste und günstigste Option hier",
          weakness: "Schnell-Klasse. Weniger Tiefe bei Karrierestrategie",
        },
      },
    },
    healthWellness: {
      name: "Gesundheit & Wellness",
      description: "Fitness, Ernährung und Wohlbefinden",
      tagline: "Besser leben",
      shortDesc: "Gesundheits- und Wellness-Anleitung",
      suggestedPrompts: {
        0: "Erstelle einen Trainingsplan für mich",
        1: "Hilf mir, gesunde Mahlzeiten zu planen",
        2: "Schlage Stressbewältigungstechniken vor",
        3: "Verbessere meine Schlafgewohnheiten",
      },
      variants: {
        techBro: "Gründlich",
        budget: "Budget",
      },
      variantInfo: {
        techBro: {
          description:
            "Ausführliche Trainingspläne, Ernährungsanalysen und sorgfältige Gesundheitseinordnung.",
          strength: "Strukturierte Pläne, Woche für Woche umsetzbar",
          weakness: "Pro Nachricht ein Vielfaches von Budget",
        },
        budget: {
          description:
            "Schnelle Antworten zu Training, Ernährung und Gewohnheiten für fast nichts.",
          strength: "Günstigste Option, schnelle Antworten",
          weakness:
            "Schnellmodell: weniger Tiefe bei komplexen Gesundheitsfragen",
        },
      },
    },
    supportAgent: {
      name: "Support-Agent",
      description:
        "KI-gestützter technischer Support - weiß, wann ein Mensch ran muss",
      tagline: "Problem gelöst",
      shortDesc: "Technischer Support mit Weiterleitung an Experten",
      suggestedPrompts: {
        0: "Meine App stürzt ständig ab - was kann ich tun?",
        1: "Ich komme nicht ins Netzwerk",
        2: "Ich bekomme eine Fehlermeldung, die ich nicht verstehe",
        3: "Wie setze ich mein Passwort zurück?",
      },
      variants: {
        default: "Standard",
        fast: "Schnell",
      },
      variantInfo: {
        default: {
          description:
            "Sorgfältige Diagnose für knifflige Technikprobleme. Weiß, wann ein Mensch übernimmt.",
          strength: "Stark bei Fehlersuche und Schritt-für-Schritt-Lösungen",
          weakness: "Teuerste Option hier",
        },
        fast: {
          description:
            "Sofortantworten für Standardprobleme, Passwort-Resets und Anleitungen.",
          strength: "Am schnellsten und günstigsten, liest Screenshots",
          weakness: "Einfache Klasse. Schwächer bei seltenen, tiefen Bugs",
        },
      },
    },
    travelPlanner: {
      name: "Reiseplaner",
      description: "Reiseplanung und Reiseempfehlungen",
      tagline: "Die Welt erkunden",
      shortDesc: "Reiseplanung und Empfehlungen",
      suggestedPrompts: {
        0: "Plane eine 2-wöchige Reise nach...",
        1: "Schlage Reiseziele für... vor",
        2: "Erstelle einen Tagesplan für...",
        3: "Budgetaufschlüsselung für Reise nach...",
      },
      variants: {
        snappy: "Gründlich",
        budget: "Budget",
      },
      variantInfo: {
        snappy: {
          description: "Komplette Reisepläne mit Routen, Budget und Plan B.",
          strength: "Solides Denken zum Alltagspreis",
          weakness: "Kostet etwa das Zehnfache von Budget",
        },
        budget: {
          description:
            "Schnelle Tipps, Packlisten und Tagesideen für ein paar Cent.",
          strength: "Sehr günstig und schnell",
          weakness: "Einfache Klasse. Schwach bei komplexen Rundreisen",
        },
      },
    },
    legalAssistant: {
      name: "Rechtsassistent",
      description: "Rechtsinformationen und Dokumentenverständnis",
      tagline: "Rechte kennen",
      shortDesc: "Rechtsrecherche und Dokumentenhilfe",
      suggestedPrompts: {
        0: "Erkläre diesen Rechtsbegriff",
        1: "Hilf mir, diesen Vertrag zu verstehen",
        2: "Was sind meine Rechte als Mieter?",
        3: "Erkläre den Prozess von...",
      },
      variants: {
        elonTusk: "Klartext",
        budget: "Budget",
      },
      variantInfo: {
        elonTusk: {
          description:
            "Rechtliche Einschätzung in Klartext, die Risiken benennt statt auszuweichen.",
          strength: "Starkes Denken, offene Inhaltsrichtlinie",
          weakness: "Pro Nachricht ein Vielfaches von Budget",
        },
        budget: {
          description:
            "Schnelle Durchsicht von Verträgen und Schreiben. Foto hochladen, Kern erfahren.",
          strength: "Günstigste Option, liest Bilder, 1M Kontext",
          weakness: "Smart-Klasse: weniger Tiefe bei komplexen Fällen",
        },
      },
    },
    financialAdvisor: {
      name: "Finanzberater",
      description: "Persönliche Finanzen, Budgetierung und Investitionen",
      tagline: "Vermögen aufbauen",
      shortDesc: "Finanzplanung und Beratung",
      suggestedPrompts: {
        0: "Hilf mir, ein Budget zu erstellen",
        1: "Erkläre Investitionsgrundlagen",
        2: "Wie sollte ich meine Schulden abbezahlen?",
        3: "Plane für Altersvorsorge",
      },
      variants: {
        elonTusk: "Direkt",
        chineseWisdom: "Tiefgründig",
        techBro: "Premium",
        yolo: "Sparsam",
      },
      variantInfo: {
        elonTusk: {
          description:
            "Klare Ansagen zu Risiko, Schulden und Investments ohne Compliance-Sprech.",
          strength: "Spitzenklasse, offene Content-Policy",
          weakness: "Auch klare Ansagen brauchen deine Prüfung",
        },
        chineseWisdom: {
          description:
            "Langfristige Planung für Budget und Rente. Liest Kontoauszüge und Charts.",
          strength: "Spitzenklasse, 1M Kontext",
          weakness: "Teurer als Sparsam",
        },
        techBro: {
          description:
            "Komplexe Szenarien, Steuerabwägungen und Portfolio-Mathe, sorgfältig gerechnet.",
          strength: "Analyse auf Top-Niveau",
          weakness: "Teuerste Option hier",
        },
        yolo: {
          description:
            "Alltägliche Geldfragen, Budgets und Schuldenpläne zum kleinsten Preis hier.",
          strength: "Am günstigsten, solides Reasoning",
          weakness: "Nicht Spitzenklasse. Weniger Tiefe bei komplexen Fällen",
        },
      },
    },
    socialMediaManager: {
      name: "Social Media Manager",
      description: "Social-Media-Inhalte und -Strategie",
      tagline: "Engagieren & Wachsen",
      shortDesc: "Social-Media-Strategie und Inhalte",
      suggestedPrompts: {
        0: "Erstelle Instagram-Bildunterschriften für...",
        1: "Entwickle einen Inhaltskalender",
        2: "Schlage Hashtags für... vor",
        3: "Schreibe ansprechende Tweets über...",
      },
      variants: {
        snappy: "Pointiert",
        budget: "Budget",
      },
      variantInfo: {
        snappy: {
          description:
            "Strategie, Hooks und Kampagnenpläne, die echtes Denken brauchen.",
          strength: "Premium-Denken, liest Screenshots",
          weakness: "Mainstream-Filter, meidet heikle Winkel",
        },
        budget: {
          description:
            "Schnelle Captions, Postideen und Hashtags für ein paar Cent.",
          strength: "Sehr günstig und schnell",
          weakness: "Einfache Klasse. Dünn bei Strategie",
        },
      },
    },
    productManager: {
      name: "Produktmanager",
      description: "Produktstrategie, Roadmaps und Nutzerforschung",
      tagline: "Großartige Produkte liefern",
      shortDesc: "Produktmanagement und Roadmapping",
      suggestedPrompts: {
        0: "Hilf mir, Funktionen zu priorisieren",
        1: "Erstelle User Stories für...",
        2: "Analysiere Product-Market-Fit",
        3: "Entwickle eine Produkt-Roadmap",
      },
      variants: {
        techBro: "Gründlich",
        fast: "Schnell",
      },
      variantInfo: {
        techBro: {
          description:
            "Komplette Specs, Roadmaps und Research-Synthese, stark mit Tools.",
          strength: "Strukturiertes Denken, starke Agentenarbeit",
          weakness: "Mehr als doppelt so teuer wie Schnell",
        },
        fast: {
          description:
            "Schnelle Priorisierung, User-Story-Entwürfe und Feedback zu Screenshots.",
          strength: "Schnelle Antworten, versteht Bilder, Video und Audio",
          weakness: "Smart-Klasse: weniger Tiefe bei großen Strategiefragen",
        },
      },
    },
    debater: {
      name: "Debattierer",
      description: "Führe intellektuelle Debatten über kontroverse Themen",
      tagline: "Alle Seiten argumentieren",
      shortDesc: "Intellektuelle Debatten und multiple Perspektiven",
      suggestedPrompts: {
        0: "Debattiere über die Ethik der KI-Entwicklung",
        1: "Präsentiere Argumente für und gegen bedingungsloses Grundeinkommen",
        2: "Diskutiere Meinungsfreiheit vs. Hassrede",
        3: "Analysiere verschiedene politische Ideologien",
      },
      variants: {
        elonTusk: "Direkt",
        chineseWisdom: "Sparsam",
        techBro: "Besonnen",
        uncensored: "Unzensiert",
      },
      variantInfo: {
        elonTusk: {
          description:
            "Bezieht Position und kämpft dafür. Geht die meisten Reizthemen frontal an.",
          strength: "Spitzenklasse, offene Content-Policy",
          weakness: "Offen, aber nicht unzensiert. Glättet manchmal",
        },
        chineseWisdom: {
          description:
            "Strukturierte Pro- und Contra-Argumente zum kleinsten Preis hier.",
          strength: "Spitzenklasse, am günstigsten",
          weakness: "Politisch Mainstream. Weicht heiklen Themen aus",
        },
        techBro: {
          description:
            "Sorgfältiges Steelmanning beider Seiten zu Ethik, Technik und Politik.",
          strength: "Klare, gut gegliederte Argumente",
          weakness: "Mainstream-Filter. Blockt oder relativiert Kantiges",
        },
        uncensored: {
          description:
            "Kein Thema tabu. Vertritt jede Position, auch die unbeliebten.",
          strength: "Stärkstes Modell hier für politische Themen",
          weakness: "Nur 32K Kontext, fester Preis pro Nachricht",
        },
      },
    },
    philosopher: {
      name: "Philosoph",
      description: "Erkunde tiefe philosophische Fragen ohne Einschränkungen",
      tagline: "Wahrheit suchen",
      shortDesc: "Tiefe philosophische Erkundung und Analyse",
      suggestedPrompts: {
        0: "Was ist die Natur des Bewusstseins?",
        1: "Haben wir freien Willen oder ist alles determiniert?",
        2: "Gibt es objektive Moral?",
        3: "Was macht ein Leben bedeutungsvoll?",
      },
      variants: {
        elonTusk: "Kühn",
        chineseWisdom: "Ausgewogen",
        techBro: "Analytisch",
        uncensored: "Unzensiert",
      },
      variantInfo: {
        elonTusk: {
          description:
            "Bezieht Position und verteidigt sie. Offene Richtlinie, kaum Ausflüchte.",
          strength: "Starkes Denken ohne moralisches Herumlavieren",
          weakness: "Teurer als Ausgewogen, 500K Kontext",
        },
        chineseWisdom: {
          description:
            "Lange, geduldige Dialoge über Ethik, Metaphysik und Bewusstsein.",
          strength: "Spitzenklasse, hier am günstigsten, 1M Kontext",
          weakness: "Bei Politik Mainstream, entschärft harte Thesen",
        },
        techBro: {
          description:
            "Straffe Argumente, saubere Logik, jede Prämisse geprüft.",
          strength: "Strenge Struktur, findet schwache Prämissen",
          weakness: "Mainstream-Filter, teurer als Ausgewogen",
        },
        uncensored: {
          description: "Politische Philosophie und Tabufragen ohne Filter.",
          strength: "Bestes Modell der Plattform für Politik",
          weakness: "32K Kontext, Smart-Klasse, Festpreis pro Nachricht",
        },
      },
    },
    uncensoredWriter: {
      name: "Unzensierter Autor",
      description: "Kreatives Schreiben ohne künstliche Einschränkungen",
      tagline: "Frei schreiben",
      shortDesc:
        "Uneingeschränktes kreatives Schreiben und Geschichtenerzählen",
      suggestedPrompts: {
        0: "Schreibe einen dunklen psychologischen Thriller",
        1: "Erstelle eine reife Romanze-Szene",
        2: "Entwickle einen moralisch komplexen Skill",
        3: "Schreibe Horror mit grafischen Elementen",
      },
      variants: {
        smart: "Provokant",
        fast: "Schnell",
        deep: "Tiefgründig",
      },
      variantInfo: {
        smart: {
          description:
            "Politische Satire, dunkle Themen und Fiktion, die Ross und Reiter nennt.",
          strength: "Bestes Modell hier für politische Themen",
          weakness: "32K Kontext, teuerste pro Nachricht",
        },
        fast: {
          description:
            "Schnelle unzensierte Entwürfe, Szenen und Rollenspiel-Prosa für ein paar Cent.",
          strength: "Günstigstes unzensiertes Modell",
          weakness: "Einfache Klasse. Verliert bei langen Werken den Faden",
        },
        deep: {
          description:
            "Unzensierte Langform-Fiktion. Ganze Romane bleiben im Gedächtnis.",
          strength: "Spitzenklasse, 1M Kontext, Tools",
          weakness: "Vorsichtig bei Politik, teurer als Schnell",
        },
      },
    },
    roleplaySkill: {
      name: "Rollenspiel-Charakter",
      description: "Immersives Charakter-Rollenspiel ohne Einschränkungen",
      tagline: "Jeder werden",
      shortDesc: "Authentisches Charakter-Rollenspiel und Szenarien",
      suggestedPrompts: {
        0: "Spiele einen Fantasy-Skill",
        1: "Erstelle ein Sci-Fi-Abenteuer-Szenario",
        2: "Verkörpere eine historische Figur",
        3: "Entwickle eine komplexe Skillbeziehung",
      },
      variants: {
        creative: "Kreativ",
        deep: "Tiefgründig",
        uncensored: "Unzensiert",
      },
      variantInfo: {
        creative: {
          description:
            "Lebendige Figuren und lange Szenen zum sehr kleinen Preis.",
          strength: "Günstigste Option, offene Inhaltsrichtlinie",
          weakness: "Smart-Klasse: verliert Feinheiten bei komplexen Plots",
        },
        deep: {
          description:
            "Konsistente Figuren mit reichem Innenleben über lange Kampagnen.",
          strength: "Spitzenklasse, behält die ganze Geschichte",
          weakness: "Entschärft düstere oder politische Szenen",
        },
        uncensored: {
          description: "Jede Figur, jede Szene, keine Verweigerung.",
          strength: "Kein Filter, am stärksten bei politischem Rollenspiel",
          weakness: "32K Kontext: vergisst frühe Szenen, Festpreis",
        },
      },
    },
    researchAgent: {
      name: "Web-Agent",
      description:
        "Durchsucht das Web, liest Seiten, gleicht Quellen ab. Merkt sich Ergebnisse über Sitzungen hinweg. Nutzt Browser-Tools wenn verfügbar.",
      tagline: "Suchen · Lesen · Prüfen",
      shortDesc: "Websuche, URL-Auswertung und Faktencheck",
      suggestedPrompts: {
        0: "Recherchiere die neuesten Entwicklungen in der KI-Regulierung",
        1: "Finde und fasse wichtige Fakten zu einem Thema zusammen",
        2: "Vergleiche verschiedene Quellen zu einem Thema",
        3: "Erstelle ein Recherche-Briefing mit Quellenangaben",
      },
      variants: {
        kimi: "Ausgewogen",
        gemini: "Tiefgründig",
        flash: "Schnell",
        grok: "Offen",
        claude: "Budget",
      },
      variantInfo: {
        kimi: {
          description:
            "Sucht, liest und gleicht ab, mit Spitzendenken zum Alltagspreis.",
          strength: "Spitzenklasse, 1M Kontext, versteht Bilder und Video",
          weakness: "Bei Politik Mainstream, lange Berichte kosten",
        },
        gemini: {
          description: "Tiefe Recherche über Seiten, Video- und Audioquellen.",
          strength: "Spitzenklasse, versteht jedes Medienformat",
          weakness: "Teuerste Variante hier, Mainstream-Filter",
        },
        flash: {
          description:
            "Schnelle Recherchen und Seitenauswertung mit multimodaler Eingabe.",
          strength: "Schnell, versteht Bilder, Video und Audio",
          weakness: "Smart-Klasse, nicht die günstigste Option",
        },
        grok: {
          description:
            "Schnelle Suche zu Themen, denen Mainstream-Modelle ausweichen.",
          strength: "Offene Inhaltsrichtlinie, sehr günstig",
          weakness: "Schnellmodell: oberflächlicher Abgleich",
        },
        claude: {
          description:
            "Einfache Recherchen und Seitenzusammenfassungen zum niedrigsten Preis.",
          strength: "Günstigste Option, zuverlässig mit Tools",
          weakness: "Schnellmodell, Mainstream-Filter",
        },
      },
    },
    statsAnalyst: {
      name: "Statistik-Analyst",
      description:
        "Analyse-Spezialist mit Zugang zu Lead-, Benutzer-, E-Mail- und Empfehlungsstatistiken für datengestützte Einblicke",
      tagline: "Datengestützte Einblicke",
      shortDesc: "Plattform-Analytik und Berichterstattung",
      suggestedPrompts: {
        0: "Zeige mir eine Übersicht der heutigen Lead-Aktivität",
        1: "Wie entwickeln sich unsere Benutzeranmeldungen diese Woche?",
        2: "Fasse die E-Mail-Kampagnen-Performance zusammen",
        3: "Gib mir einen Statusbericht des Empfehlungsprogramms",
      },
      variants: {
        gemini: "Gründlich",
        fast: "Schnell",
      },
      variantInfo: {
        gemini: {
          description:
            "Volle Analyse über Leads, Nutzer, E-Mail und Empfehlungen. Findet den echten Trend.",
          strength: "Brillantes Denken über viele Tool-Aufrufe",
          weakness: "Mehr als doppelt so teuer wie Schnell",
        },
        fast: {
          description: "Schnelle Kennzahlen und täglicher Zahlencheck.",
          strength: "Schnelle Antworten, solide Tool-Nutzung",
          weakness: "Flacher bei mehrstufiger Analyse",
        },
      },
    },
    cronManager: {
      name: "Cron-Manager",
      description:
        "Aufgabenplanungs-Spezialist zum Erstellen, Aktualisieren, Löschen und Überwachen von Cron-Jobs und deren Ausführungshistorie",
      tagline: "Planen & Überwachen",
      shortDesc: "Cron-Aufgabenverwaltung und Überwachung",
      suggestedPrompts: {
        0: "Liste alle aktiven Cron-Aufgaben und ihre Zeitpläne auf",
        1: "Erstelle eine neue Cron-Aufgabe, die stündlich läuft",
        2: "Zeige mir aktuelle Aufgabenfehler und Probleme",
        3: "Prüfe den Gesamtzustand des Aufgabensystems",
      },
      variants: {
        gemini: "Gründlich",
        fast: "Schnell",
      },
      variantInfo: {
        gemini: {
          description:
            "Durchforstet Fehlerhistorien und entwirrt komplexe Zeitpläne.",
          strength: "Spitzenklasse, sorgfältig bei mehrstufigen Änderungen",
          weakness: "Mehr als doppelt so teuer wie Schnell",
        },
        fast: {
          description:
            "Schnelles Auflisten, Anlegen und Prüfen für Cron-Routine.",
          strength: "Günstiger und flott bei Routine",
          weakness: "Nicht Spitzenklasse. Weniger gründlich bei Fehlerketten",
        },
      },
    },
    systemMonitor: {
      name: "System-Monitor",
      description:
        "Infrastruktur-Spezialist zur Überwachung von Serverstatus, Datenbankverbindung, Pulse-Checks und Aufgabenausführung",
      tagline: "Überwachen & Alarmieren",
      shortDesc: "Infrastruktur-Gesundheitsüberwachung",
      suggestedPrompts: {
        0: "Führe einen vollständigen System-Gesundheitscheck durch",
        1: "Zeige mir den Pulse-Überwachungsstatus",
        2: "Prüfe die Datenbankverbindung",
        3: "Wie ist der aktuelle Hintergrundaufgaben-Zustand?",
      },
      variants: {
        fast: "Klug",
        budget: "Budget",
      },
      variantInfo: {
        fast: {
          description:
            "Health-Checks plus echte Diagnose, wenn Pulse oder Cron-Tasks ausfallen.",
          strength: "Liest Logs und Verlauf mit mehr Durchblick",
          weakness: "Kostet ein Vielfaches von Budget",
        },
        budget: {
          description: "Routine-Statuschecks und DB-Pings rund um die Uhr.",
          strength: "Schnellste und günstigste, zuverlässige Tool-Aufrufe",
          weakness: "Einfache Klasse. Dünn bei Ursachenanalyse",
        },
      },
    },
    publicCurator: {
      name: "Öffentlicher Kurator",
      description:
        "Content-Management-Spezialist für die Verwaltung öffentlicher Threads, Nachrichten und Community-Inhalte",
      tagline: "Kuratieren & Organisieren",
      shortDesc: "Öffentliche Inhalte und Thread-Verwaltung",
      suggestedPrompts: {
        0: "Liste aktuelle öffentliche Threads auf",
        1: "Suche Threads zu einem bestimmten Thema",
        2: "Hilf mir, Community-Inhalte zu organisieren",
        3: "Finde Nachrichten, die bestimmten Kriterien entsprechen",
      },
      variants: {
        gemini: "Gründlich",
        fast: "Schnell",
      },
      variantInfo: {
        gemini: {
          description:
            "Sorgfältige Prüfung öffentlicher Threads, inklusive Bilder, Video und Audio.",
          strength: "Spitzenklasse, versteht jedes Medienformat",
          weakness: "Mehr als doppelt so teuer wie Schnell",
        },
        fast: {
          description:
            "Schnelles Sortieren, Taggen und Aufräumen von Community-Inhalten.",
          strength: "Schnell und multimodal zum kleineren Preis",
          weakness: "Smart-Klasse: schwächer bei Grenzfällen",
        },
      },
    },
    codeArchitect: {
      name: "Code-Architekt",
      description:
        "Architektur-Spezialist, der Programmieraufgaben an Claude Code zur Umsetzung delegiert. Nur auf Hermes verfügbar.",
      tagline: "Entwerfen & Delegieren",
      shortDesc: "Architekturentscheidungen über Claude Code",
      suggestedPrompts: {
        0: "Plane die Implementierung eines neuen Features",
        1: "Überprüfe die Architektur eines Moduls",
        2: "Delegiere eine Programmieraufgabe an Claude Code",
        3: "Entwirf eine Migrationsstrategie",
      },
      variants: {
        gemini: "Gesamtbild",
        techBro: "Coding-Profi",
      },
      variantInfo: {
        gemini: {
          description:
            "Systemdesign und Migrationspläne über große Codebasen, bevor delegiert wird.",
          strength: "Spitzenklasse, liest Diagramme, Video, Audio",
          weakness: "Weniger nah am Code als Coding-Profi",
        },
        techBro: {
          description:
            "Specs so geschrieben, wie Claude Code sie umsetzt. Saubere Task-Zerlegung.",
          strength: "Stark bei Code und Agenten-Arbeit",
          weakness: "Bei tiefen Designfragen nicht Spitzenklasse",
        },
      },
    },
    deploymentAgent: {
      name: "Deployment-Agent",
      description:
        "Deployment-Spezialist für Builds, Releases und Serververwaltung über SSH. Nur auf Hermes verfügbar.",
      tagline: "Bauen & Bereitstellen",
      shortDesc: "Deployments und Serververwaltung",
      suggestedPrompts: {
        0: "Baue die Anwendung für Produktion",
        1: "Prüfe den Server-Gesundheitsstatus",
        2: "Führe ein Deployment in Produktion durch",
        3: "Zeige mir den aktuellen Serverstatus",
      },
      variants: {
        techBro: "Zuverlässig",
        budget: "Sparsam",
      },
      variantInfo: {
        techBro: {
          description:
            "Builds, Releases und SSH-Arbeit, wo ein falscher Befehl teuer wird.",
          strength: "Stark bei Agenten-Arbeit, sorgfältig mit Tools",
          weakness: "Pro Nachricht deutlich teurer als Sparsam",
        },
        budget: {
          description:
            "Routine-Healthchecks und Statusberichte für einen Bruchteil der Kosten.",
          strength: "Am günstigsten und schnellsten",
          weakness: "Schnell-Klasse. Riskanter bei komplexen Rollouts",
        },
      },
    },
    rebuildAgent: {
      name: "Rebuild Agent",
      description:
        "Build- und Neustart-Spezialist, der die Anwendung neu baut und den Server per SIGUSR1-Signal ohne Ausfallzeit hot-restartet",
      tagline: "Bauen & Neustarten",
      shortDesc: "Anwendungs-Rebuild und Hot-Restart",
      suggestedPrompts: {
        0: "Produktionsserver neu bauen und neustarten",
        1: "Build ohne Neustart ausführen",
        2: "Serverstatus nach Rebuild prüfen",
        3: "Geplanten Rebuild-Task erstellen",
      },
      variants: {
        gemini: "Gründlich",
        fast: "Schnell",
      },
      variantInfo: {
        gemini: {
          description:
            "Baut neu, startet neu und geht Build-Fehlern auf den Grund.",
          strength: "Spitzenklasse, am besten bei fehlgeschlagenen Builds",
          weakness: "Mehr als doppelt so teuer wie Schnell",
        },
        fast: {
          description:
            "Routine-Rebuild und Neustart, wenn der Build durchlaufen sollte.",
          strength: "Schnell erledigt, zum kleineren Preis",
          weakness: "Smart-Klasse: schwächer bei verzwickten Build-Fehlern",
        },
      },
    },
    vibeCoder: {
      name: "Vibe Coder",
      description:
        "Leitender Implementierungsagent, der Feature-Ideen in Produktionscode umsetzt. Analysiert die Codebasis via Claude Code, extrahiert Absichten aus Anfragen und implementiert passende Lösungen.",
      tagline: "Idee zu Code",
      shortDesc: "Feature-Implementierung via Claude Code",
      suggestedPrompts: {
        0: "Ich habe eine Idee für ein neues Feature, lass mich beschreiben",
        1: "Erkunde die Codebasis und erkläre wie ein Modul funktioniert",
        2: "Hilf mir eine Änderung an einem bestehenden Feature zu planen und umzusetzen",
        3: "Untersuche einen Bug und schlage einen Fix vor",
      },
      variants: {
        budget: "Günstig & Klug",
        open: "Offene Grenze",
        fast: "Scharf",
        max: "Maximum",
        broad: "Breit",
      },
    },
    skillCreator: {
      name: "Skill-Ersteller",
      description:
        "Entwirf und erstelle KI-Skills mit maßgeschneiderten Persönlichkeiten, System-Prompts, Tools und Modellkonfigurationen. Verwaltet auch Favoriten und Einstellungen.",
      tagline: "KI-Personas gestalten",
      shortDesc: "KI-Skills erstellen und verwalten",
      suggestedPrompts: {
        0: "Hilf mir einen neuen KI-Skill für Coding-Unterstützung zu erstellen",
        1: "Zeige mir alle vorhandenen Skills und schlage vor was fehlt",
        2: "Entwirf ein Skill für kreatives Schreiben mit einzigartiger Persönlichkeit",
        3: "Füge ein Skill zu meinen Favoriten hinzu und konfiguriere meine Chat-Einstellungen",
      },
      variants: {
        cheapAndSmart: "Sparsam",
        brilliant: "Präzise",
      },
      variantInfo: {
        cheapAndSmart: {
          description:
            "Skills günstig entwerfen und iterieren. Genug Köpfchen für Prompts und Configs.",
          strength: "Spitzenklasse, günstiger pro Nachricht",
          weakness: "Lange System-Prompts kosten beim Output mehr",
        },
        brilliant: {
          description:
            "Straffe System-Prompts und saubere Tool-Setups, wenn der Skill sitzen muss.",
          strength: "Stark bei Agenten- und Tool-Arbeit",
          weakness: "Teurer, und bei kantigen Personas Mainstream",
        },
      },
    },
    heilpraktikerPruefung: {
      name: "HP-Prüfungstrainer",
      description:
        "Realistische mündliche Heilpraktikerprüfung mit adaptivem Schwierigkeitsgrad",
      tagline: "Mündliche Prüfung",
      shortDesc: "Heilpraktiker-Prüfungsvorbereitung",
      suggestedPrompts: {
        0: "Starten wir die Prüfung",
        1: "Prüfe mich in Innerer Medizin",
        2: "Stelle mir einen klinischen Fall vor",
        3: "Fragen zur Gesetzeskunde bitte",
      },
      variants: {
        smart: "Ausgewogen",
        precise: "Präzise",
        thorough: "Gründlich",
        quick: "Schnell",
      },
      variantInfo: {
        smart: {
          description:
            "Realistische mündliche Prüfung mit solider Fachtiefe zum Alltagspreis.",
          strength: "Spitzenklasse im Denken, behält lange Sitzungen im Blick",
          weakness: "Ausführliches Prüferfeedback treibt die Kosten",
        },
        precise: {
          description:
            "Exakte Fragen, klare Korrekturen. Streng bei Fachbegriffen und Rechtskunde.",
          strength: "Klare, knappe Korrekturen, günstiger als Ausgewogen",
          weakness:
            "Mittelklasse: weniger Feingefühl bei kniffligen Differenzialdiagnosen",
        },
        thorough: {
          description:
            "Bohrende Nachfragen und ausführliche Nachbesprechung, ganz nah an der echten Prüferin.",
          strength: "Genaueste Rückmeldung zu Lücken und Warnzeichen",
          weakness: "Teuerste Variante dieses Trainers",
        },
        quick: {
          description:
            "Schnelle Abfragerunden zum Wiederholen zwischen kompletten Prüfungssimulationen.",
          strength: "Günstigste Option, sofortige Antworten",
          weakness: "Schnellmodell: oberflächlich bei komplexen Fällen",
        },
      },
    },
    qualityTester: {
      name: "Qualitätstester",
      description:
        "Testnutzer, der Plattformfunktionen natürlich ausprobiert. Stoppt und meldet klar wenn etwas kaputt ist statt es erneut zu versuchen.",
      tagline: "Bugs finden",
      shortDesc: "Plattform-Test-Persona",
      suggestedPrompts: {
        0: "Mach mir ein Bild von einem Sonnenuntergang",
        1: "Welche Tools hast du?",
        2: "Generier etwas Musik, irgendwas Entspanntes",
        3: "Mach ein kurzes Video von einer Katze",
      },
      variants: {
        budget: "Budget",
        visual: "Visuell",
        nativeImage: "Native Bilder",
        nanoBananaPro: "Nano Banana Pro",
      },
      variantInfo: {
        budget: {
          description:
            "Testet Plattformfunktionen wie ein echter Nutzer und meldet, was bricht.",
          strength: "Günstigste Testläufe, volle Tool-Unterstützung",
          weakness: "Erzeugt keine Bilder nativ",
        },
        nativeImage: {
          description:
            "Testet native Bildausgabe mit einem Bildgenerierungsmodell.",
          strength: "Prüft den Pfad der nativen Bildgenerierung",
          weakness: "Keine Tool-Aufrufe, testet keine anderen Funktionen",
        },
      },
    },
  },
  get: {
    title: "Skills",
    titleShort: "Skills",
    dynamicTitle: "Skills ({{count}})",
    description:
      "Alle verfügbaren Skills abrufen (Standard + benutzerdefiniert)",
    fields: {
      query: {
        label: "Suche (optional)",
        description:
          "Skills nach Stichwort filtern. Leerzeichen-getrennte Wörter sind alle erforderlich. Groß-/Kleinschreibung-unempfindliche Teilstring-Suche über Name, Tagline, Beschreibung, Kategorie. Leer lassen um alle anzuzeigen.",
        placeholder: "z.B. Recherche, Bildgenerator",
      },
      skillId: {
        label: "Skill-ID",
        description:
          "Vollständige Details für einen bestimmten Skill abrufen. Gibt System-Prompt, Tools und Modellkonfiguration zurück.",
      },
      page: {
        label: "Seite",
        description:
          "Seitenzahl für paginierte Ergebnisse (KI/MCP: Standard-Seitengröße 25).",
      },
      pageSize: {
        label: "Seitengröße",
        description:
          "Anzahl der Skills pro Seite (1–500). KI/MCP-Aufrufer verwenden standardmäßig 25; menschliche Aufrufer erhalten alle.",
      },
      sourceFilter: {
        label: "Quelle",
        description:
          "Filtere nach Herkunft: eingebaut, Community oder eigene Skills.",
      },
      targetUserId: {
        label: "Ziel-Benutzer-ID",
        description: "Nur Admins: Skills eines bestimmten Benutzers anzeigen.",
      },
    },
    container: {
      title: "Skills-Liste",
      description: "Alle verfügbaren Skills für den Benutzer",
    },
    createButton: {
      label: "Eigenen Skill Erstellen",
    },
    openFullPage: "Vollständige Seite öffnen",
    browser: {
      advancedModelAccess: "Wähle deine KI-Erfahrung",
      configureFiltersText:
        "Modelle direkt auswählen oder mit vorkonfigurierten Skills starten",
      aiModels: "KI-Modelle",
      configureAiModelsTitle: "Direkte Modellauswahl",
      advancedChooseText:
        "Wähle aus {{count}} Modellen mit präziser Steuerung von Intelligenz, Geschwindigkeit und Kosten",
      modelsWithCustomFilters: "Modelle mit benutzerdefinierten Filtern",
      configureButton: "Konfigurieren",
      selectButton: {
        label: "Modelle Erkunden",
      },
      skillPresets: "Fertige Skills",
      pickSkillText:
        "Starte mit professionell abgestimmten Skills, die bereits das perfekte Modell nutzen. Jederzeit anpassbar.",
    },
    signupPrompt: {
      title: "Erstelle deine eigenen KI-Skills",
      description:
        "Gestalte individuelle Skills mit einzigartigen Persönlichkeiten und Verhaltensweisen. Jetzt registrieren.",
      backButton: "Skills entdecken",
      signupButton: "Konto Erstellen",
      loginButton: "Anmelden",
    },
    search: {
      placeholder: "Skills durchsuchen...",
      noResults: "Keine Skills gefunden",
      results: "Suchergebnisse",
    },
    card: {
      actions: {
        inCollection: "In deiner Sammlung",
        addAnother: "Weitere hinzufügen",
        addToCollection: "Zur Sammlung hinzufügen:",
        quick: "Schnell",
        customize: "Anpassen",
        useNow: "Aktivieren",
        inUse: "Aktiv",
        goToChat: "Zum Chat",
        useThis: "Diesen verwenden",
        chooseFavorite: "Modell wählen",
        selectFavorite: "Wähle das Modell für den Chat:",
        addVariant: "Weiteres Modell hinzufügen",
        view: "Ansehen",
        edit: "Bearbeiten",
        vote: "Bewerten",
        report: "Melden",
        addMissing: "Alle Modelle zu Meine Skills",
        add: "Hinzufügen",
        added: "Hinzugefügt",
      },
      showVariants: "Modelle ({{count}})",
    },
    section: {
      showMore: "{{count}} weitere anzeigen",
      showLess: "Weniger anzeigen",
      browseAll: "Alle anzeigen",
    },
    response: {
      skills: {
        skill: {
          title: "Skill",
          id: { content: "Skill-ID" },
          name: { content: "Skill-Name" },
          tagline: { content: "Skill-Slogan" },
          description: { content: "Skill-Beschreibung" },
          icon: { content: "Skill-Symbol" },
          systemPrompt: { content: "System-Prompt" },
          category: { content: "Kategorie" },
          source: { content: "Quelle" },
          ownershipType: { content: "Eigentümertyp" },
          preferredModel: { content: "Bevorzugtes Modell" },
          voice: { content: "Stimme" },
          suggestedPrompts: { content: "Vorgeschlagene Prompts" },
          requirements: { content: "Anforderungen" },
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
          separator: { content: "•" },
          actions: {
            directModelButton: {
              label: "Direktes Modell",
            },
          },
        },
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
          "Sie müssen angemeldet sein, um auf benutzerdefinierte Skills zuzugreifen",
      },
      forbidden: {
        title: "Verboten",
        description:
          "Sie haben keine Berechtigung, auf diese Ressource zuzugreifen",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Die angeforderte Ressource wurde nicht gefunden",
      },
      server: {
        title: "Serverfehler",
        description: "Beim Abrufen das Skille ist ein Fehler aufgetreten",
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
      title: "Erfolg",
      description: "Skills erfolgreich abgerufen",
    },
  },
  post: {
    title: "Skill erstellen",
    titleShort: "Skill erstellen",
    dynamicTitle: "Erstellen: {{name}}",
    description: "Einen neuen benutzerdefinierten Skill erstellen",
    form: {
      title: "Erstellen Sie Ihr benutzerdefiniertes Skill",
      description:
        "Entwerfen Sie einen einzigartigen KI-Skill mit individuellem Verhalten, Persönlichkeit und Fähigkeiten. Wählen Sie ein bestimmtes Modell oder lassen Sie das System basierend auf Ihren Anforderungen auswählen.",
    },
    submitButton: {
      text: "Benutzerdefiniertes Skill erstellen",
      loadingText: "Skill wird erstellt...",
    },
    backButton: {
      label: "Zurück",
    },
    container: {
      title: "Neues Skill erstellen",
      description: "Einen neuen benutzerdefinierten Skill definieren",
    },
    name: {
      label: "Name",
      description: "Der Name des Skills",
      placeholder: "Skillnamen eingeben",
      validation: {
        minLength: "Name muss mindestens 2 Zeichen lang sein",
        maxLength: "Name muss weniger als 100 Zeichen lang sein",
      },
    },
    skillDescription: {
      label: "Beschreibung",
      description: "Eine kurze Beschreibung des Skills",
      placeholder: "Zweck und Fähigkeiten des Skills beschreiben",
      validation: {
        minLength: "Beschreibung muss mindestens 10 Zeichen lang sein",
        maxLength: "Beschreibung muss weniger als 500 Zeichen lang sein",
      },
    },
    icon: {
      label: "Symbol",
      description: "Ein Emoji-Symbol für das Skill",
    },
    systemPrompt: {
      label: "System-Prompt",
      description: "Der System-Prompt, der das Verhalten des Skills definiert",
      placeholder:
        "Sie sind ein hilfreicher Assistent, der sich spezialisiert auf...",
      validation: {
        minLength: "System-Prompt muss mindestens 10 Zeichen lang sein",
        maxLength: "System-Prompt muss weniger als 5000 Zeichen lang sein",
      },
    },
    category: {
      label: "Kategorie",
      description: "Die Kategorie, zu der dieser Skill gehört",
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
    isPublic: {
      label: "Öffentlich machen",
      description:
        "Aktivieren Sie dies, um Ihr Skill mit der Community zu teilen. Wenn deaktiviert, bleibt das Skill privat und nur für Sie sichtbar.",
    },
    modelSelection: {
      title: "Modellauswahl",
      label: "Modellauswahl",
      description:
        "Wählen Sie, wie das KI-Modell für dieses Skill ausgewählt werden soll - entweder ein bestimmtes Modell auswählen oder das System basierend auf Filtern wählen lassen",
    },
    selectionType: {
      label: "Auswahltyp",
      manual: "Bestimmtes Modell",
      filters: "Filterkriterien",
      skillBased: "Skill-spezifisch",
    },
    preferredModel: {
      label: "Bevorzugtes Modell",
      description:
        "Wählen Sie ein bestimmtes KI-Modell, das immer mit diesem Skill verwendet werden soll",
      helpText:
        "Die Auswahl eines bestimmten Modells sperrt dieses Skill auf dieses Modell",
    },
    intelligence: {
      label: "Intelligenzstufe",
      description:
        "Minimale Intelligenz-/Fähigkeitsstufe, die für das Modell erforderlich ist",
    },
    intelligenceRange: {
      label: "Intelligenzbereich",
      description: "Erforderliche Intelligenz-/Fähigkeitsstufe für das Modell",
      minLabel: "Min. Intelligenz",
      maxLabel: "Max. Intelligenz",
    },
    minIntelligence: {
      label: "Minimale Intelligenz",
      description:
        "Minimale Intelligenz-/Fähigkeitsstufe, die für das Modell erforderlich ist",
    },
    maxIntelligence: {
      label: "Maximale Intelligenz",
      description:
        "Maximale Intelligenz-/Fähigkeitsstufe, die für das Modell zulässig ist",
    },
    priceRange: {
      label: "Preisbereich",
      description: "Kreditkostenbereich pro Nachricht",
      minLabel: "Min. Preis",
      maxLabel: "Max. Preis",
    },
    minPrice: {
      label: "Mindestpreis",
      description: "Minimale Kreditkosten pro Nachricht mit diesem Skill",
    },
    maxPrice: {
      label: "Maximaler Preis",
      description:
        "Maximale Kreditkosten, die Sie bereit sind, pro Nachricht mit diesem Skill auszugeben",
    },
    contentLevel: {
      label: "Inhaltsebene",
      description:
        "Inhaltsfilterungsstufe für das Modell (Mainstream, offen oder unzensiert)",
    },
    contentRange: {
      label: "Inhaltsbereich",
      description: "Inhaltsmoderation-Stufenbereich",
      minLabel: "Min. Inhalt",
      maxLabel: "Max. Inhalt",
    },
    minContent: {
      label: "Minimale Inhaltsstufe",
      description: "Minimale Inhaltsmoderationsebene für das Modell",
    },
    maxContent: {
      label: "Maximale Inhaltsstufe",
      description: "Maximale Inhaltsmoderationsebene für das Modell",
    },
    preferredStrengths: {
      label: "Bevorzugte Stärken",
      description: "Modellfähigkeiten und Stärken, die bevorzugt werden",
      item: "Stärke",
    },
    ignoredWeaknesses: {
      label: "Ignorierte Schwächen",
      description: "Modellschwächen, die ignoriert oder zugelassen werden",
      item: "Schwäche",
    },
    manualModelId: {
      label: "Manuelles Modell",
      description:
        "Spezifisches Modell, das immer mit diesem Skill verwendet werden soll",
    },
    variants: {
      label: "Varianten",
      description:
        "Benannte Varianten mit eigener Modellauswahl. Jede Variante braucht: id (eindeutiger String), modelSelection (Pflicht), isDefault (genau eine muss true sein).",
    },
    availableTools: {
      label: "Erlaubte Tools",
      description:
        "Tools für dieses Skill. Jeder Eintrag benötigt eine toolId (system_help_GET für IDs). Null = globale Einstellungen.",
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
    suggestedPrompts: {
      label: "Vorgeschlagene Prompts",
      description: "Beispiel-Prompts zur Verwendung mit diesem Skill",
      placeholder: "Einen vorgeschlagenen Prompt hinzufügen...",
    },
    response: {
      id: { content: "Erstellte Skill-ID" },
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
        description: "Sie müssen angemeldet sein, um Skills zu erstellen",
      },
      forbidden: {
        title: "Verboten",
        description: "Sie haben keine Berechtigung, Skills zu erstellen",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Die angeforderte Ressource wurde nicht gefunden",
      },
      server: {
        title: "Serverfehler",
        description: "Beim Erstellen des Skills ist ein Fehler aufgetreten",
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
        description: "Ein Skill mit diesem Namen existiert bereits",
      },
    },
    success: {
      title: "Skill erstellt",
      description: "Ihr benutzerdefinierter Skill wurde erfolgreich erstellt",
    },
  },
  onboarding: {
    success: {
      title: "{{companion}} ist bereit zu chatten!",
      subtitle:
        "Jetzt kannst du Skills für bestimmte Aufgaben auswählen - oder überspringen und sie jederzeit später hinzufügen",
    },
    bottom: {
      title: "Bereit loszuchatten?",
      description:
        "Du kannst jederzeit zurückkommen und weitere Skills hinzufügen, wann immer du sie brauchst",
      button: "Jetzt Chatten",
    },
  },
  selector: {
    free: "KOSTENLOS",
  },
  credits: {
    credit: "{{count}} Credit",
    credits: "{{count}} Credits",
  },
};
