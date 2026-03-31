import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Chat",
  tags: {
    favorites: "Favoriten",
  },
  voices: {
    MALE: "Männliche Stimme",
    FEMALE: "Weibliche Stimme",
  },

  get: {
    title: "Favorit abrufen",
    description: "Spezifische Favoriten-Konfiguration abrufen",
    container: {
      title: "Favoriten-Details",
    },
    editButton: {
      label: "Favoriten bearbeiten",
    },
    deleteButton: {
      label: "Favoriten löschen",
    },
    customizeSkillButton: {
      label: "Charakter-Persönlichkeit anpassen",
    },
    signupPrompt: {
      title: "Charakter-Persönlichkeit anpassen",
      description:
        "Bearbeite den System-Prompt und das Verhalten des Charakters. Melde dich an, um zu beginnen.",
      backButton: "Zurück",
      signupButton: "Konto erstellen",
      loginButton: "Anmelden",
    },
    id: {
      label: "Favoriten-ID",
    },
    response: {
      skillId: {
        content: "Charakter: {{value}}",
      },
      customName: {
        content: "Benutzerdefinierter Name: {{value}}",
      },
      customIcon: {
        content: "Benutzerdefiniertes Symbol: {{value}}",
      },
      voice: {
        content: "Stimme: {{value}}",
      },
      mode: {
        content: "Modus: {{value}}",
      },
      intelligence: {
        content: "Intelligenz: {{value}}",
      },
      modelSelection: {
        title: "Modellauswahl",
      },
      selectionType: {
        content: "Auswahltyp: {{value}}",
      },
      minIntelligence: {
        content: "Min. Intelligenz: {{value}}",
      },
      maxIntelligence: {
        content: "Max. Intelligenz: {{value}}",
      },
      minPrice: {
        content: "Mindestpreis: {{value}}",
      },
      maxPrice: {
        content: "Maximaler Preis: {{value}}",
      },
      minContent: {
        content: "Min. Inhaltsstufe: {{value}}",
      },
      maxContent: {
        content: "Max. Inhaltsstufe: {{value}}",
      },
      minSpeed: {
        content: "Min. Geschwindigkeit: {{value}}",
      },
      maxSpeed: {
        content: "Max. Geschwindigkeit: {{value}}",
      },
      content: {
        content: "Inhaltsstufe: {{value}}",
      },
      preferredStrengths: {
        content: "Bevorzugte Stärken: {{value}}",
      },
      ignoredWeaknesses: {
        content: "Ignorierte Schwächen: {{value}}",
      },
      manualModelId: {
        content: "Manuelles Modell: {{value}}",
      },
      position: {
        content: "Position: {{value}}",
      },
      color: {
        content: "Farbe: {{value}}",
      },
      isActive: {
        content: "Aktiv: {{value}}",
      },
      useCount: {
        content: "Verwendungen: {{value}}",
      },
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Favoriten-ID",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Verbindung zum Server nicht möglich",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description:
          "Sie müssen angemeldet sein, um diesen Favoriten anzuzeigen",
      },
      forbidden: {
        title: "Verboten",
        description:
          "Sie haben keine Berechtigung, diesen Favoriten anzuzeigen",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Favorit nicht gefunden",
      },
      server: {
        title: "Serverfehler",
        description: "Favorit konnte nicht geladen werden",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
      },
      unsavedChanges: {
        title: "Nicht gespeicherte Änderungen",
        description:
          "Sie haben nicht gespeicherte Änderungen, die verloren gehen",
      },
      conflict: {
        title: "Konflikt",
        description:
          "Bei der Verarbeitung Ihrer Anfrage ist ein Konflikt aufgetreten",
      },
    },
    success: {
      title: "Erfolg",
      description: "Favorit erfolgreich geladen",
    },
  },
  patch: {
    title: "Favorit aktualisieren",
    description: "Bestehende Favoriten-Konfiguration aktualisieren",
    container: {
      title: "Favorit bearbeiten",
    },
    backButton: {
      label: "Zurück zum Favoriten",
    },
    deleteButton: {
      label: "Favorit löschen",
    },
    customizeSkillButton: {
      label: "Charakter-Persönlichkeit anpassen",
    },
    useThisSkillButton: {
      label: "Diesen Charakter verwenden",
    },
    useThisModelButton: {
      label: "Dieses Modell verwenden",
    },
    currentlyActiveButton: {
      label: "Derzeit aktiv",
    },
    signupPrompt: {
      title: "Charakter-Persönlichkeit anpassen",
      description:
        "Bearbeite den System-Prompt und das Verhalten des Charakters. Melde dich an, um zu beginnen.",
      backButton: "Zurück",
      signupButton: "Konto erstellen",
      loginButton: "Anmelden",
    },
    saveButton: {
      label: "Speichern",
      loadingText: "Speichern...",
    },
    saveAndUseButton: {
      label: "Speichern & Verwenden",
      loadingText: "Wird gespeichert & aktiviert...",
    },
    id: {
      label: "Favoriten-ID",
    },
    skillId: {
      label: "Charakter",
    },
    customName: {
      label: "Benutzerdefinierter Name",
    },
    chatModel: {
      label: "Chat-Modell",
      placeholder: "Von Fertigkeit übernehmen",
    },
    voice: {
      label: "KI-Stimme",
      description: "Wählen Sie die Stimme für Ihren KI-Assistenten",
      placeholder: "Vom Charakter erben",
    },
    sttModel: {
      label: "Sprache-zu-Text-Modell",
      description: "Modell für die Spracherkennung",
      placeholder: "Vom Charakter erben",
    },
    visionBridgeModel: {
      label: "Vision-Modell",
      description: "Modell für die Bildanalyse",
      placeholder: "Vom Charakter erben",
    },
    translationModel: {
      label: "Übersetzungsmodell",
      description: "Modell für die Textübersetzung",
    },
    imageGenModel: {
      label: "Bildgenerierungsmodell",
      description: "Modell zur Bilderstellung",
      placeholder: "Vom Charakter erben",
    },
    musicGenModel: {
      label: "Musikgenerierungsmodell",
      description: "Modell zur Musikerstellung",
      placeholder: "Vom Charakter erben",
    },
    videoGenModel: {
      label: "Video-Generierungsmodell",
      description: "Modell zur Videoerstellung",
      placeholder: "Vom Charakter erben",
    },
    defaultChatMode: {
      label: "Standard-Chat-Modus",
      description: "Standardmodus beim Öffnen dieses Chats",
    },
    mode: {
      label: "Auswahlmodus",
    },
    modelSelection: {
      title: "Modellauswahl",
      label: "Modellauswahl",
      description:
        "Wählen Sie, wie das KI-Modell ausgewählt werden soll - entweder ein bestimmtes Modell auswählen oder das System basierend auf Filtern wählen lassen",
    },
    selectionType: {
      label: "Auswahltyp",
      characterBased: "Basierend auf Charakter",
      manual: "Bestimmtes Modell",
      filters: "Filterkriterien",
    },
    intelligence: {
      label: "Intelligenzstufe",
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
    minPrice: {
      label: "Mindestpreis",
      description: "Minimale Kreditkosten pro Nachricht",
    },
    maxPrice: {
      label: "Maximaler Preis",
    },
    minContent: {
      label: "Minimale Inhaltsstufe",
      description: "Minimale Inhaltsmoderationsebene für das Modell",
    },
    maxContent: {
      label: "Maximale Inhaltsstufe",
      description: "Maximale Inhaltsmoderationsebene für das Modell",
    },
    minSpeed: {
      label: "Minimale Geschwindigkeit",
      description:
        "Minimale Geschwindigkeitsstufe, die für das Modell erforderlich ist",
    },
    maxSpeed: {
      label: "Maximale Geschwindigkeit",
      description:
        "Maximale Geschwindigkeitsstufe, die für das Modell zulässig ist",
    },
    content: {
      label: "Inhaltsstufe",
    },
    preferredStrengths: {
      label: "Bevorzugte Stärken",
      description: "Modellfähigkeiten und Stärken, die bevorzugt werden",
    },
    ignoredWeaknesses: {
      label: "Ignorierte Schwächen",
      description: "Modellschwächen, die ignoriert oder zugelassen werden",
    },
    manualModelId: {
      label: "Manuelles Modell",
    },
    isActive: {
      label: "Aktiv",
    },
    position: {
      label: "Position",
    },
    color: {
      label: "Farbe",
      description: "Benutzerdefinierte Farbe für diesen Favoriten",
    },
    customIcon: {
      label: "Benutzerdefiniertes Symbol",
      description: "Benutzerdefiniertes Symbol für diesen Favoriten",
    },
    icon: {
      label: "Benutzerdefiniertes Symbol",
      description:
        "Symbol des Charakters für diesen Favoriten-Slot überschreiben",
    },
    compactTrigger: {
      label: "Komprimierungs-Schwellenwert (Token)",
      description:
        "Token-Anzahl, die eine automatische Gesprächskomprimierung auslöst. Null = Charakter oder globaler Standard.",
    },
    availableTools: {
      label: "Erlaubte Tools",
      description:
        "Tools für diesen Slot überschreiben. Jeder Eintrag benötigt eine toolId. Null = Charakter oder globale Einstellungen.",
    },
    pinnedTools: {
      label: "Angeheftete Tools",
      description:
        "Angeheftete Toolbar-Tools für diesen Slot überschreiben. Null = Charakter oder globale Einstellungen.",
    },
    deniedTools: {
      label: "Gesperrte Tools",
      description:
        "Bestimmte Tools für diesen Slot sperren – zusätzlich zur Liste des Skills. Diese Tools können unabhängig von anderen Einstellungen nicht aufgerufen werden.",
      clearAll: "Alle löschen",
      noToolsFound: "Keine Tools gefunden",
      blockedNote:
        "Gesperrte Tools können unabhängig von anderen Einstellungen nicht aufgerufen werden.",
      searchPlaceholder: "Tools suchen...",
      blocked: "gesperrt",
    },
    promptAppend: {
      label: "Prompt-Anhang",
      description:
        "Zusätzliche Anweisungen, die nur für diesen Slot an den System-Prompt des Skills angehängt werden. Damit können Sie das Verhalten der KI personalisieren, ohne den gemeinsamen Skill zu ändern.",
      placeholder: "z. B. Antworte immer in einem freundlichen, lockeren Ton.",
    },
    memoryLimit: {
      label: "Speicherlimit (Token)",
      description:
        "Maximale Gesamttoken des Speicherinhalts für diesen Slot. Null = Skill oder globaler Standard.",
    },
    changeSkill: {
      label: "Charakter wechseln",
    },
    modifySkill: {
      label: "Charakter bearbeiten",
    },
    response: {
      success: {
        content: "Aktualisiert: {{value}}",
      },
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description:
          "Bitte überprüfen Sie Ihre Eingabe und versuchen Sie es erneut",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Verbindung zum Server nicht möglich",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description:
          "Sie müssen angemeldet sein, um diesen Favoriten zu aktualisieren",
      },
      forbidden: {
        title: "Verboten",
        description:
          "Sie haben keine Berechtigung, diesen Favoriten zu aktualisieren",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Favorit nicht gefunden",
      },
      server: {
        title: "Serverfehler",
        description: "Favorit konnte nicht aktualisiert werden",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
      },
      unsavedChanges: {
        title: "Nicht gespeicherte Änderungen",
        description:
          "Sie haben nicht gespeicherte Änderungen, die verloren gehen",
      },
      conflict: {
        title: "Konflikt",
        description:
          "Beim Aktualisieren des Favoriten ist ein Konflikt aufgetreten",
      },
    },
    slotOverride: {
      label: "Überschreibung für diesen Slot",
    },
    globalDefault: {
      label: "Mein Standard (Fallback)",
    },
    success: {
      title: "Erfolg",
      description: "Favorit erfolgreich aktualisiert",
    },
  },
  delete: {
    title: "Favorit löschen",
    description: "Favoriten-Konfiguration entfernen",
    container: {
      title: "Favorit löschen",
      description: "Diesen Favoriten dauerhaft entfernen",
    },
    backButton: {
      label: "Abbrechen",
    },
    actions: {
      delete: "Favoriten löschen",
      deleting: "Löschen des Favoriten...",
    },
    id: {
      label: "Favoriten-ID",
      description: "Die eindeutige Kennung des zu löschenden Favoriten",
    },
    response: {
      success: {
        content: "Gelöscht: {{value}}",
      },
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Favoriten-ID",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Verbindung zum Server nicht möglich",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description:
          "Sie müssen angemeldet sein, um diesen Favoriten zu löschen",
      },
      forbidden: {
        title: "Verboten",
        description:
          "Sie haben keine Berechtigung, diesen Favoriten zu löschen",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Favorit nicht gefunden",
      },
      server: {
        title: "Serverfehler",
        description: "Favorit konnte nicht gelöscht werden",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
      },
      unsavedChanges: {
        title: "Nicht gespeicherte Änderungen",
        description:
          "Sie haben nicht gespeicherte Änderungen, die verloren gehen",
      },
      conflict: {
        title: "Konflikt",
        description:
          "Favorit kann aufgrund eines Konflikts nicht gelöscht werden",
      },
    },
    success: {
      title: "Erfolg",
      description: "Favorit erfolgreich gelöscht",
    },
  },
};
