import { translations as idTranslations } from "../../[id]/i18n/de";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  id: idTranslations,
  get: {
    title: "Personas auflisten",
    description:
      "Alle verfügbaren Personas abrufen (Standard + benutzerdefiniert)",
    container: {
      title: "Personas-Liste",
      description: "Alle verfügbaren Personas für den Benutzer",
    },
    response: {
      personas: {
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
          "Sie müssen angemeldet sein, um auf benutzerdefinierte Personas zuzugreifen",
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
        description: "Beim Abrufen der Personas ist ein Fehler aufgetreten",
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
      description: "Personas erfolgreich abgerufen",
    },
  },
  post: {
    title: "Persona erstellen",
    description: "Eine neue benutzerdefinierte Persona erstellen",
    container: {
      title: "Neue Persona erstellen",
      description: "Eine neue benutzerdefinierte Persona definieren",
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
    response: {
      id: { content: "Erstellte Persona-ID" },
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
        description: "Sie müssen angemeldet sein, um Personas zu erstellen",
      },
      forbidden: {
        title: "Verboten",
        description: "Sie haben keine Berechtigung, Personas zu erstellen",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Die angeforderte Ressource wurde nicht gefunden",
      },
      server: {
        title: "Serverfehler",
        description: "Beim Erstellen der Persona ist ein Fehler aufgetreten",
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
        description: "Eine Persona mit diesem Namen existiert bereits",
      },
    },
    success: {
      title: "Persona erstellt",
      description: "Ihre benutzerdefinierte Persona wurde erfolgreich erstellt",
    },
  },
};
