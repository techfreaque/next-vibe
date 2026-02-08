import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  get: {
    title: "Charakter abrufen",
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
    deleteButton: {
      label: "Charakter löschen",
    },
    id: {
      label: "Charakter-ID",
      description: "Die eindeutige Kennung der Charakter",
    },
    systemPrompt: {
      label: "System-Prompt",
    },
    response: {
      character: {
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
    success: {
      title: "Erfolg",
      description: "Charakter erfolgreich abgerufen",
    },
  },
  patch: {
    title: "Charakter aktualisieren",
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
    voice: {
      label: "Stimme",
      description: "Text-zu-Sprache-Stimme für diesen Charakter",
    },
    modelSelection: {
      label: "Modellauswahl",
      description: "Wie das KI-Modell für diesen Charakter ausgewählt wird",
    },
    preferredModel: {
      label: "Bevorzugtes Modell",
      description: "Das bevorzugte KI-Modell für diese Charakter",
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
