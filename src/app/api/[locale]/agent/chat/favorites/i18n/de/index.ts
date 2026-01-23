import { translations as idTranslations } from "../../[id]/i18n/de";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  id: idTranslations,
  enums: {
    selectionType: {
      characterBased: "Basierend auf Charakter",
      manual: "Spezifisches Modell",
      filters: "Filterkriterien",
    },
    mode: {
      auto: "Auto",
      manual: "Manuell",
    },
    intelligence: {
      any: "Beliebig",
      quick: "Schnell",
      smart: "Intelligent",
      brilliant: "Brilliant",
    },
    price: {
      any: "Beliebig",
      cheap: "Günstig",
      standard: "Standard",
      premium: "Premium",
    },
    content: {
      any: "Beliebig",
      mainstream: "Mainstream",
      open: "Offen",
      uncensored: "Unzensiert",
    },
    speed: {
      any: "Beliebig",
      fast: "Schnell",
      balanced: "Ausgewogen",
      thorough: "Gründlich",
    },
  },
  get: {
    title: "Favoriten abrufen",
    description: "Alle gespeicherten Favoriten-Konfigurationen abrufen",
    container: {
      title: "Ihre Favoriten",
      description:
        "Verwalten Sie Ihre bevorzugten Charakter- und Modellkonfigurationen",
    },
    createButton: {
      label: "Favorit hinzufügen",
    },
    response: {
      favorite: {
        title: "Favoriten-Konfiguration",
        id: {
          content: "ID: {{value}}",
        },
        characterId: {
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
        separator: {
          content: "•",
        },
      },
      hasCompanion: {
        content: "Hat Companion: {{value}}",
      },
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Anfrageparameter",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Verbindung zum Server nicht möglich",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Sie müssen angemeldet sein, um Favoriten anzuzeigen",
      },
      forbidden: {
        title: "Verboten",
        description:
          "Sie haben keine Berechtigung, auf diese Ressource zuzugreifen",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Keine Favoriten gefunden",
      },
      server: {
        title: "Serverfehler",
        description: "Favoriten konnten nicht geladen werden",
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
      description: "Favoriten erfolgreich geladen",
    },
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
  },
};
