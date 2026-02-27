import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Chat",
  tags: {
    memories: "Erinnerungen",
  },

  search: {
    get: {
      title: "Erinnerungen durchsuchen",
      description:
        "Durchsucht Erinnerungen nach Textinhalt. Gibt passende Erinnerungen mit Inhaltsausschnitten zurück. Unterstützt Filterung nach Tags und Einbeziehung archivierter Erinnerungen.",
      container: {
        title: "Erinnerungen durchsuchen",
        description: "Erinnerungen nach Inhalt oder Tags finden",
      },
      query: {
        label: "Suchanfrage",
        description:
          "Text, nach dem im Erinnerungsinhalt gesucht wird (Groß-/Kleinschreibung wird ignoriert)",
      },
      includeArchived: {
        label: "Archivierte einbeziehen",
        description:
          "Archivierte Erinnerungen in den Suchergebnissen einbeziehen (Standard: nein)",
      },
      tags: {
        label: "Nach Tags filtern",
        description:
          "Nur Erinnerungen zurückgeben, die mindestens einen dieser Tags haben",
      },
      response: {
        results: {
          memory: {
            title: "Erinnerung",
            memoryNumber: { text: "#" },
            content: { content: "Inhalt" },
            tags: { content: "Tags" },
            priority: { text: "Priorität" },
            isArchived: { text: "Archiviert" },
            createdAt: { content: "Erstellt am" },
          },
        },
        total: { content: "Ergebnisse gesamt" },
      },
      errors: {
        validationFailed: {
          title: "Validierung fehlgeschlagen",
          description: "Die Suchanfrage ist ungültig",
        },
        network: {
          title: "Netzwerkfehler",
          description: "Verbindung zum Server fehlgeschlagen",
        },
        unauthorized: {
          title: "Nicht autorisiert",
          description:
            "Sie müssen angemeldet sein, um Erinnerungen zu durchsuchen",
        },
        forbidden: {
          title: "Verboten",
          description:
            "Sie haben keine Berechtigung, Erinnerungen zu durchsuchen",
        },
        notFound: {
          title: "Nicht gefunden",
          description: "Die angeforderte Ressource wurde nicht gefunden",
        },
        serverError: {
          title: "Serverfehler",
          description:
            "Beim Durchsuchen der Erinnerungen ist ein Fehler aufgetreten",
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
        description: "Erinnerungssuche erfolgreich abgeschlossen",
      },
    },
  },
};
