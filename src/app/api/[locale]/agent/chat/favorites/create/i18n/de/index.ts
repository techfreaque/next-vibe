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

  post: {
    title: "Favorit erstellen",
    description: "Neue Favoriten-Konfiguration erstellen",
    container: {
      title: "Neuer Favorit",
      description: "Charakterkonfiguration als Favorit speichern",
    },
    backButton: {
      label: "Zurück zu Favoriten",
    },
    submitButton: {
      label: "Favorit erstellen",
      loadingText: "Erstellen...",
    },
    useWithoutSavingButton: {
      label: "Ohne Speichern verwenden",
      loadingText: "Anwenden...",
    },
    skillId: {
      label: "Charakter",
      description: "Wählen Sie den Charakter für diesen Favoriten",
    },
    variantId: {
      label: "Variante",
      description: "Skill-Variante (z.B. brilliant, günstig, unzensiert)",
    },
    customName: {
      label: "Benutzerdefinierter Name",
      description: "Optionaler benutzerdefinierter Name für diesen Favoriten",
    },
    customIcon: {
      label: "Benutzerdefiniertes Symbol",
      description: "Optionales benutzerdefiniertes Symbol für diesen Favoriten",
    },
    chatModel: {
      label: "Chat-Modell",
      placeholder: "Von Fertigkeit übernehmen",
    },
    voice: {
      label: "Stimme",
      description: "Text-to-Speech-Stimmpräferenz",
      placeholder: "Von Skill erben",
    },
    sttModel: {
      label: "Sprache-zu-Text-Modell",
      description: "Modell zur Spracherkennung",
      placeholder: "Vom Skill erben",
    },
    visionBridgeModel: {
      label: "Vision-Modell",
      description: "Modell zur Bildanalyse",
      placeholder: "Vom Skill erben",
    },
    translationModel: {
      label: "Übersetzungsmodell",
      description: "Modell zur Textübersetzung",
    },
    imageGenModel: {
      label: "Bildgenerierungsmodell",
      description: "Modell zur Bilderstellung",
      placeholder: "Von Skill erben",
    },
    musicGenModel: {
      label: "Musikgenerierungsmodell",
      description: "Modell zur Musikerstellung",
      placeholder: "Von Skill erben",
    },
    videoGenModel: {
      label: "Video-Generierungsmodell",
      description: "Modell zur Videoerstellung",
      placeholder: "Von Skill erben",
    },
    defaultChatMode: {
      label: "Standard-Chat-Modus",
      description: "Standardmodus beim Öffnen dieses Chats",
    },
    mode: {
      label: "Auswahlmodus",
      description: "Wie das Modell ausgewählt werden soll",
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
      description: "Mindestens erforderliche Intelligenzstufe",
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
    intelligenceRange: {
      label: "Intelligenzbereich",
      description: "Erforderliche Intelligenz-/Fähigkeitsstufe für das Modell",
      minLabel: "Min. Intelligenz",
      maxLabel: "Max. Intelligenz",
    },
    priceRange: {
      label: "Preisbereich",
      description: "Kreditkostenbereich pro Nachricht",
      minLabel: "Min. Preis",
      maxLabel: "Max. Preis",
    },
    contentRange: {
      label: "Inhaltsbereich",
      description: "Inhaltsmoderation-Stufenbereich",
      minLabel: "Min. Inhalt",
      maxLabel: "Max. Inhalt",
    },
    speedRange: {
      label: "Geschwindigkeitsbereich",
      description: "Antwortgeschwindigkeit-Stufenbereich",
      minLabel: "Min. Geschwindigkeit",
      maxLabel: "Max. Geschwindigkeit",
    },
    minPrice: {
      label: "Mindestpreis",
      description: "Minimale Kreditkosten pro Nachricht",
    },
    maxPrice: {
      label: "Maximaler Preis",
      description: "Maximale Preisstufe",
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
      description: "Moderationsstufe für Inhalte",
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
      description: "Spezifisches Modell (für manuellen Modus)",
    },
    icon: {
      label: "Benutzerdefiniertes Symbol",
      description:
        "Symbol des Charakters für diesen Favoriten-Slot überschreiben",
    },
    compactTrigger: {
      label: "Komprimierungs-Schwellenwert (Token)",
      description:
        "Token-Anzahl für automatische Gesprächskomprimierung. Null = Charakter oder globaler Standard.",
    },
    availableTools: {
      label: "Erlaubte Tools",
      description:
        "Tools für diesen Slot. Jeder Eintrag benötigt eine toolId. Null = Charakter oder globale Einstellungen.",
    },
    pinnedTools: {
      label: "Angeheftete Tools",
      description:
        "Angeheftete Toolbar-Tools für diesen Slot. Null = Charakter oder globale Einstellungen.",
    },
    response: {
      id: {
        content: "Favorit erstellt mit ID: {{value}}",
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
        description: "Sie müssen angemeldet sein, um Favoriten hinzuzufügen",
      },
      forbidden: {
        title: "Verboten",
        description: "Sie haben keine Berechtigung, Favoriten zu erstellen",
      },
      notFound: {
        title: "Nicht gefunden",
        description:
          "Das Element, das Sie als Favorit markieren möchten, existiert nicht",
      },
      server: {
        title: "Serverfehler",
        description: "Favorit konnte nicht hinzugefügt werden",
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
        description: "Dieser Favorit existiert bereits",
      },
    },
    success: {
      title: "Erfolg",
      description: "Favorit erfolgreich erstellt",
    },
    changeSkill: {
      label: "Charakter ändern",
    },
    modifySkill: {
      label: "Charakter bearbeiten",
    },
    character: {
      name: "Name",
      tagline: "Slogan",
      description: "Beschreibung",
    },
  },
};
