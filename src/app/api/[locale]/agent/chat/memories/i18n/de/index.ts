import { translations as idTranslations } from "../../[id]/i18n/de";
import { translations as createTranslations } from "../../create/i18n/de";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  create: createTranslations,
  id: idTranslations,
  tags: {
    memories: "Erinnerungen",
  },
  category: "Chat",
  searchPlaceholder: "Erinnerungen nach Inhalt oder Tags durchsuchen...",
  showing: "{{count}} von {{total}} Erinnerungen werden angezeigt",
  stats: {
    total: "Gesamt",
    highPriority: "Hohe Priorität",
    avgPriority: "Durchschn. Priorität",
    size: "Größe",
  },
  get: {
    title: "Erinnerungen auflisten",
    description: "Ruft alle Erinnerungen für den aktuellen Benutzer ab",
    container: {
      title: "Erinnerungen",
    },
    createButton: {
      label: "Erinnerung erstellen",
    },
    stats: {
      title: "Übersicht",
    },
    emptyState: "Noch keine Erinnerungen. Erstellen Sie Ihre erste Erinnerung.",
    emptySearch: "Keine Erinnerungen gefunden, die Ihrer Suche entsprechen.",
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
        description:
          "Sie haben keine Berechtigung, auf diese Ressource zuzugreifen",
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
};
