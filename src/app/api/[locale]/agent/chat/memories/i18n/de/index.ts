import { translations as idTranslations } from "../../[id]/i18n/de";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  id: idTranslations,
  tags: {
    memories: "Erinnerungen",
  },
  category: "Chat",
  get: {
    title: "Erinnerungen auflisten",
    description: "Ruft alle Erinnerungen für den aktuellen Benutzer ab",
    container: {
      title: "Erinnerungsliste",
      description: "Alle gespeicherten Erinnerungen anzeigen",
    },
    columns: {
      memoryNumber: "#",
      content: "Inhalt",
      priority: "Priorität",
      tags: "Tags",
      createdAt: "Erstellt",
    },
    response: {
      memories: {
        memory: {
          title: "Erinnerung",
          memoryNumber: { text: "#" },
          content: { content: "Inhalt" },
          tags: { content: "Tags" },
          priority: { text: "Priorität" },
          createdAt: { content: "Erstellt am" },
        },
      },
    },
    errors: {
      validation: {
        title: "Validierung fehlgeschlagen",
        description: "Die Anfragedaten sind ungültig",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Verbindung zum Server fehlgeschlagen",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Sie müssen angemeldet sein, um Erinnerungen anzuzeigen",
      },
      forbidden: {
        title: "Verboten",
        description: "Sie haben keine Berechtigung, auf diese Ressource zuzugreifen",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Die angeforderte Ressource wurde nicht gefunden",
      },
      server: {
        title: "Serverfehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
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
        description: "Ein Konflikt mit dem aktuellen Status ist aufgetreten",
      },
    },
    success: {
      title: "Erfolg",
      description: "Erinnerungen erfolgreich abgerufen",
    },
  },
  post: {
    title: "Erinnerung hinzufügen",
    description: "Erstellt eine neue Erinnerung für den aktuellen Benutzer",
    container: {
      title: "Erinnerung hinzufügen",
      description: "Eine neue Tatsache oder Präferenz speichern",
    },
    content: {
      label: "Erinnerungsinhalt",
      description: "Die zu merkende Tatsache (z.B. 'Beruf: Software-Ingenieur')",
    },
    tags: {
      label: "Tags",
      description: "Tags zur Kategorisierung (z.B. Beruf, Präferenzen)",
    },
    priority: {
      label: "Priorität",
      description: "Höhere Priorität Erinnerungen erscheinen zuerst (0-100)",
    },
    response: {
      id: { content: "Erinnerungs-ID" },
    },
    errors: {
      validation: {
        title: "Validierung fehlgeschlagen",
        description: "Die Anfragedaten sind ungültig",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Verbindung zum Server fehlgeschlagen",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Sie müssen angemeldet sein, um Erinnerungen hinzuzufügen",
      },
      forbidden: {
        title: "Verboten",
        description: "Sie haben keine Berechtigung, Erinnerungen hinzuzufügen",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Die angeforderte Ressource wurde nicht gefunden",
      },
      server: {
        title: "Serverfehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
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
        description: "Ein Konflikt mit dem aktuellen Status ist aufgetreten",
      },
    },
    success: {
      title: "Erfolg",
      description: "Erinnerung erfolgreich hinzugefügt",
    },
  },
};
