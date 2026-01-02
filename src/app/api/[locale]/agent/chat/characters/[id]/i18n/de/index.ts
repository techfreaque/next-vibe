import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  get: {
    title: "Charakter abrufen",
    description: "Eine bestimmte Charakter anhand der ID abrufen",
    container: {
      title: "Charakter-Details",
      description: "Details der angeforderten Charakter",
    },
    id: {
      label: "Charakter-ID",
      description: "Die eindeutige Kennung der Charakter",
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
        suggestedPrompts: { content: "Vorgeschlagene Prompts" },
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
        description: "Sie müssen angemeldet sein, um auf diese Ressource zuzugreifen",
      },
      forbidden: {
        title: "Verboten",
        description: "Sie haben keine Berechtigung, auf diese Ressource zuzugreifen",
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
    },
    description: {
      label: "Beschreibung",
      description: "Eine kurze Beschreibung der Charakter",
    },
    icon: {
      label: "Symbol",
      description: "Ein Emoji-Symbol für die Charakter",
    },
    systemPrompt: {
      label: "System-Prompt",
      description: "Der System-Prompt, der das Verhalten der Charakter definiert",
    },
    category: {
      label: "Kategorie",
      description: "Die Kategorie, zu der diese Charakter gehört",
    },
    preferredModel: {
      label: "Bevorzugtes Modell",
      description: "Das bevorzugte KI-Modell für diese Charakter",
    },
    suggestedPrompts: {
      label: "Vorgeschlagene Prompts",
      description: "Beispiel-Prompts zur Verwendung mit dieser Charakter",
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
        description: "Sie müssen angemeldet sein, um Charakters zu aktualisieren",
      },
      forbidden: {
        title: "Verboten",
        description: "Sie haben keine Berechtigung, diese Charakter zu aktualisieren",
      },
      notFound: {
        title: "Charakter nicht gefunden",
        description: "Die Charakter, die Sie aktualisieren möchten, existiert nicht",
      },
      server: {
        title: "Serverfehler",
        description: "Beim Aktualisieren der Charakter ist ein Fehler aufgetreten",
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
      description: "Ihre benutzerdefinierte Charakter wurde erfolgreich aktualisiert",
    },
  },
  delete: {
    title: "Charakter löschen",
    description: "Einen benutzerdefinierten Charakter löschen",
    container: {
      title: "Charakter löschen",
      description: "Diesen benutzerdefinierten Charakter dauerhaft entfernen",
    },
    id: {
      label: "Charakter-ID",
      description: "Die eindeutige Kennung des zu löschenden Charakters",
    },
    errors: {
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Sie sind nicht berechtigt, diesen Charakter zu löschen",
      },
      notFound: {
        title: "Charakter nicht gefunden",
        description: "Der Charakter, den Sie löschen möchten, existiert nicht",
      },
      server: {
        title: "Serverfehler",
        description: "Ein Fehler ist beim Löschen des Charakters aufgetreten",
      },
    },
    success: {
      title: "Charakter gelöscht",
      description: "Der Charakter wurde erfolgreich gelöscht",
    },
  },
};
