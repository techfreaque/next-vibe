import { translations as idTranslations } from "../../[id]/i18n/de";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  id: idTranslations,
  enums: {
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
        maxPrice: {
          content: "Maximaler Preis: {{value}}",
        },
        content: {
          content: "Inhaltsstufe: {{value}}",
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
    characterId: {
      label: "Charakter",
      description: "Wählen Sie den Charakter für diesen Favoriten",
    },
    customName: {
      label: "Benutzerdefinierter Name",
      description: "Optionaler benutzerdefinierter Name für diesen Favoriten",
    },
    voice: {
      label: "Stimme",
      description: "Text-to-Speech-Stimmpräferenz",
    },
    mode: {
      label: "Auswahlmodus",
      description: "Wie das Modell ausgewählt werden soll",
    },
    intelligence: {
      label: "Intelligenzstufe",
      description: "Mindestens erforderliche Intelligenzstufe",
    },
    maxPrice: {
      label: "Maximaler Preis",
      description: "Maximale Preisstufe",
    },
    content: {
      label: "Inhaltsstufe",
      description: "Moderationsstufe für Inhalte",
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
