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
    titleShort: "Favorit",
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
    viewSkillButton: {
      label: "Skill ansehen",
    },
    signupPrompt: {
      title: "Skill-Persönlichkeit anpassen",
      description:
        "Bearbeite den System-Prompt und das Verhalten des Skills. Melde dich an, um zu beginnen.",
      backButton: "Zurück",
      signupButton: "Konto erstellen",
      loginButton: "Anmelden",
    },
    id: {
      label: "Favoriten-ID",
    },
    response: {
      skillId: {
        content: "Skill: {{value}}",
      },
      customVariantName: {
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
    titleShort: "Favorit bearbeiten",
    description: "Bestehende Favoriten-Konfiguration aktualisieren",
    container: {
      title: "Skill-Setup bearbeiten",
    },
    backButton: {
      label: "Zurück zum Favoriten",
    },
    deleteButton: {
      label: "Favorit löschen",
    },
    viewSkillButton: {
      label: "Skill ansehen",
    },
    reportButton: {
      label: "Melden",
    },
    useThisSkillButton: {
      label: "Dieses Skill verwenden",
    },
    useThisModelButton: {
      label: "Dieses Modell verwenden",
    },
    currentlyActiveButton: {
      label: "Derzeit aktiv",
    },
    signupPrompt: {
      title: "Skill-Persönlichkeit anpassen",
      description:
        "Bearbeite den System-Prompt und das Verhalten des Skills. Melde dich an, um zu beginnen.",
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
      label: "Skill",
      description:
        'Skill-ID. „skillSlug" für die Standardvariante, „skillSlug__variantId" für eine bestimmte Variante.',
    },
    customVariantName: {
      label: "Bezeichnung",
      description:
        "Eigener Name für diese Variante (leer lassen für Skill-Standard)",
    },
    chatModel: {
      label: "Chat-Modell",
      placeholder: "Wie beim Skill",
    },
    voice: {
      label: "KI-Stimme",
      description: "Wählen Sie die Stimme für Ihren KI-Assistenten",
      placeholder: "Wie beim Skill",
    },
    sttModel: {
      label: "Sprache-zu-Text-Modell",
      description: "Modell für die Spracherkennung",
      placeholder: "Wie beim Skill",
    },
    imageVisionModel: {
      label: "Bild-Vision-Modell",
      description: "Modell für die Bildanalyse",
      placeholder: "Wie beim Skill",
    },
    videoVisionModel: {
      label: "Video-Vision-Modell",
      description: "Modell für die Videoanalyse",
      placeholder: "Wie beim Skill",
    },
    audioVisionModel: {
      label: "Audio-Vision-Modell",
      description: "Modell für die Audioanalyse",
      placeholder: "Wie beim Skill",
    },
    imageGenModel: {
      label: "Bildgenerierungsmodell",
      description: "Modell zur Bilderstellung",
      placeholder: "Wie beim Skill",
    },
    musicGenModel: {
      label: "Musikgenerierungsmodell",
      description: "Modell zur Musikerstellung",
      placeholder: "Wie beim Skill",
    },
    videoGenModel: {
      label: "Video-Generierungsmodell",
      description: "Modell zur Videoerstellung",
      placeholder: "Wie beim Skill",
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
      characterBased: "Basierend auf Skill",
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
      description: "Symbol des Skills für diesen Favoriten-Slot überschreiben",
    },
    compactTrigger: {
      label: "Komprimierungs-Schwellenwert (Token)",
      description:
        "Token-Anzahl, die eine automatische Gesprächskomprimierung auslöst. Null = Skill oder globaler Standard.",
    },
    availableTools: {
      label: "Erlaubte Tools",
      description:
        "Tools für diesen Slot überschreiben. Jeder Eintrag benötigt eine toolId. Null = Skill oder globale Einstellungen.",
    },
    pinnedTools: {
      label: "Angeheftete Tools",
      description:
        "Angeheftete Toolbar-Tools für diesen Slot überschreiben. Null = Skill oder globale Einstellungen.",
    },
    deniedTools: {
      label: "Gesperrte Tools",
      description:
        "Bestimmte Tools für diesen Slot sperren - zusätzlich zur Liste des Skills. Diese Tools können unabhängig von anderen Einstellungen nicht aufgerufen werden.",
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
      label: "Skill wechseln",
    },
    modifySkill: {
      label: "Skill bearbeiten",
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
    titleShort: "Favorit löschen",
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
      description: "Der Slug oder die lesbare ID des zu löschenden Favoriten",
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
