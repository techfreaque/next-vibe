import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Chat",
  tags: {
    folders: "Ordner",
  },

  patch: {
    title: "Ordner aktualisieren",
    description: "Einen vorhandenen Ordner aktualisieren",
    container: {
      title: "Ordner aktualisieren",
      description: "Ordnereigenschaften ändern",
    },
    id: {
      label: "Ordner-ID",
      description: "Die eindeutige Kennung des zu aktualisierenden Ordners",
    },
    sections: {
      updates: {
        title: "Ordneraktualisierungen",
        description: "Zu aktualisierende Felder",
      },
    },
    name: {
      label: "Name",
      description: "Der Ordnername",
    },
    icon: {
      label: "Symbol",
      description: "Lucide- oder Simple Icons-Symbolname",
    },
    color: {
      label: "Farbe",
      description: "Hex-Farbcode zur visuellen Unterscheidung",
    },
    parentId: {
      label: "Übergeordneter Ordner",
      description:
        "Ordner zu einem anderen übergeordneten Ordner verschieben (null für Wurzel)",
    },
    expanded: {
      label: "Erweitert",
      description: "Ob der Ordner in der Benutzeroberfläche erweitert ist",
    },
    sortOrder: {
      label: "Sortierreihenfolge",
      description: "Reihenfolge zum Sortieren von Ordnern",
    },
    pinned: {
      label: "Angeheftet",
      description: "Diesen Ordner oben in der Seitenleiste anheften",
    },
    rolesView: {
      label: "Ansichtsrollen",
      description: "Rollen, die diesen Ordner ansehen können",
    },
    rolesManage: {
      label: "Verwaltungsrollen",
      description: "Rollen, die Ordnereinstellungen verwalten können",
    },
    rolesCreateThread: {
      label: "Thread-Erstellungsrollen",
      description: "Rollen, die Threads in diesem Ordner erstellen können",
    },
    rolesPost: {
      label: "Beitragsrollen",
      description: "Rollen, die Nachrichten posten können",
    },
    rolesModerate: {
      label: "Moderationsrollen",
      description: "Rollen, die Inhalte moderieren können",
    },
    rolesAdmin: {
      label: "Admin-Rollen",
      description: "Rollen mit vollem Administratorzugriff",
    },
    response: {
      folder: {
        id: {
          content: "ID",
        },
        updatedAt: {
          content: "Aktualisiert am",
        },
      },
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Die angegebenen Daten sind ungültig",
        circularReference:
          "Ordner kann nicht als eigener übergeordneter Ordner festgelegt werden",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Sie müssen angemeldet sein, um Ordner zu aktualisieren",
      },
      forbidden: {
        title: "Verboten",
        description:
          "Sie haben keine Berechtigung, diesen Ordner zu aktualisieren",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Der angeforderte Ordner wurde nicht gefunden",
      },
      server: {
        title: "Serverfehler",
        description:
          "Beim Aktualisieren des Ordners ist ein Fehler aufgetreten",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Verbindung zum Server nicht möglich",
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
        description: "Ein Ordner mit diesem Namen existiert bereits",
      },
    },
    success: {
      title: "Erfolg",
      description: "Ordner erfolgreich aktualisiert",
    },
    backButton: {
      label: "Zurück",
    },
    submitButton: {
      label: "Aktualisieren",
      loadingText: "Aktualisieren...",
    },
  },
};
