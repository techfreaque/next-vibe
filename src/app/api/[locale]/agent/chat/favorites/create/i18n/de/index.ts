import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
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
    characterId: {
      label: "Charakter",
      description: "Wählen Sie den Charakter für diesen Favoriten",
    },
    customName: {
      label: "Benutzerdefinierter Name",
      description: "Optionaler benutzerdefinierter Name für diesen Favoriten",
    },
    customIcon: {
      label: "Benutzerdefiniertes Symbol",
      description: "Optionales benutzerdefiniertes Symbol für diesen Favoriten",
    },
    voice: {
      label: "Stimme",
      description: "Text-to-Speech-Stimmpräferenz",
    },
    mode: {
      label: "Auswahlmodus",
      description: "Wie das Modell ausgewählt werden soll",
    },
    modelSelection: {
      title: "Modellauswahl",
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
    changeCharacter: {
      label: "Charakter ändern",
    },
    modifyCharacter: {
      label: "Charakter bearbeiten",
    },
  },
};
