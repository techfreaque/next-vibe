import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  get: {
    title: "Persona abrufen",
    description: "Eine bestimmte Persona anhand der ID abrufen",
    container: {
      title: "Persona-Details",
      description: "Details der angeforderten Persona",
    },
    id: {
      label: "Persona-ID",
      description: "Die eindeutige Kennung der Persona",
    },
    response: {
      persona: {
        title: "Persona",
        id: { content: "Persona-ID" },
        name: { content: "Persona-Name" },
        description: { content: "Persona-Beschreibung" },
        icon: { content: "Persona-Symbol" },
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
        description:
          "Sie müssen angemeldet sein, um auf diese Ressource zuzugreifen",
      },
      forbidden: {
        title: "Verboten",
        description:
          "Sie haben keine Berechtigung, auf diese Ressource zuzugreifen",
      },
      notFound: {
        title: "Persona nicht gefunden",
        description: "Die angeforderte Persona existiert nicht",
      },
      server: {
        title: "Serverfehler",
        description: "Beim Abrufen der Persona ist ein Fehler aufgetreten",
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
      description: "Persona erfolgreich abgerufen",
    },
  },
  patch: {
    title: "Persona aktualisieren",
    description: "Eine vorhandene benutzerdefinierte Persona aktualisieren",
    container: {
      title: "Persona aktualisieren",
      description: "Eine vorhandene benutzerdefinierte Persona ändern",
    },
    response: {
      success: {
        content: "Persona erfolgreich aktualisiert",
      },
    },
    id: {
      label: "Persona-ID",
      description: "Die eindeutige Kennung der zu aktualisierenden Persona",
    },
    name: {
      label: "Name",
      description: "Der Name der Persona",
    },
    personaDescription: {
      label: "Beschreibung",
      description: "Eine kurze Beschreibung der Persona",
    },
    icon: {
      label: "Symbol",
      description: "Ein Emoji-Symbol für die Persona",
    },
    systemPrompt: {
      label: "System-Prompt",
      description: "Der System-Prompt, der das Verhalten der Persona definiert",
    },
    category: {
      label: "Kategorie",
      description: "Die Kategorie, zu der diese Persona gehört",
    },
    preferredModel: {
      label: "Bevorzugtes Modell",
      description: "Das bevorzugte KI-Modell für diese Persona",
    },
    suggestedPrompts: {
      label: "Vorgeschlagene Prompts",
      description: "Beispiel-Prompts zur Verwendung mit dieser Persona",
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Die Persona-Daten sind ungültig",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Verbindung zum Server fehlgeschlagen",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Sie müssen angemeldet sein, um Personas zu aktualisieren",
      },
      forbidden: {
        title: "Verboten",
        description:
          "Sie haben keine Berechtigung, diese Persona zu aktualisieren",
      },
      notFound: {
        title: "Persona nicht gefunden",
        description:
          "Die Persona, die Sie aktualisieren möchten, existiert nicht",
      },
      server: {
        title: "Serverfehler",
        description:
          "Beim Aktualisieren der Persona ist ein Fehler aufgetreten",
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
      title: "Persona aktualisiert",
      description:
        "Ihre benutzerdefinierte Persona wurde erfolgreich aktualisiert",
    },
  },
};
