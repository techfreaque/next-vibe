import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Vibe Sense",
  tags: {
    vibeSense: "vibe-sense",
  },

  list: {
    title: "Pipeline-Graphen",
    description:
      "Alle fuer den aktuellen Benutzer sichtbaren Graphen auflisten",
    container: {
      title: "Graphen",
      description: "Alle Pipeline-Graphen",
    },
    response: {
      graphs: "Graphen",
      graph: {
        id: "ID",
        slug: "Slug",
        name: "Name",
        description: "Beschreibung",
        ownerType: "Besitzertyp",
        ownerId: "Besitzer-ID",
        isActive: "Aktiv",
        createdAt: "Erstellt am",
      },
    },
    success: {
      title: "Graphen geladen",
      description: "Pipeline-Graphen erfolgreich abgerufen",
    },
    errors: {
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung erforderlich zum Auflisten der Graphen",
      },
      forbidden: {
        title: "Verboten",
        description: "Admin-Zugriff erforderlich",
      },
      server: {
        title: "Serverfehler",
        description: "Graphen konnten nicht geladen werden",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description:
          "Ein unerwarteter Fehler ist beim Laden der Graphen aufgetreten",
      },
      validation: {
        title: "Validierung fehlgeschlagen",
        description: "Ungueltige Anfrageparameter",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Keine Graphen gefunden",
      },
      conflict: {
        title: "Konflikt",
        description: "Ressourcenkonflikt aufgetreten",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkanfrage beim Laden der Graphen fehlgeschlagen",
      },
      unsavedChanges: {
        title: "Ungespeicherte Aenderungen",
        description: "Aenderungen vor dem Fortfahren speichern",
      },
    },
  },

  widget: {
    refresh: "Aktualisieren",
    createGraph: "Neuer Graph",
    active: "Aktiv",
    inactive: "Inaktiv",
    empty: "Noch keine Graphen. Erstellen Sie Ihren ersten Pipeline-Graphen.",
    error: "Graphen konnten nicht geladen werden. Bitte erneut versuchen.",
    archive: "Archivieren",
    stats: {
      total: "Gesamt",
      active: "Aktiv",
      system: "System",
      admin: "Admin",
    },
  },

  create: {
    title: "Graph erstellen",
    description: "Einen neuen Pipeline-Graphen erstellen",
    fields: {
      name: {
        label: "Name",
        description: "Anzeigename des Graphen",
        placeholder: "Mein Graph",
      },
      slug: {
        label: "Slug",
        description: "Eindeutiger Bezeichner (Kleinbuchstaben, Bindestriche)",
        placeholder: "mein-graph",
      },
      description: {
        label: "Beschreibung",
        description: "Optionale Beschreibung",
        placeholder: "",
      },
      config: {
        label: "Konfiguration",
        description: "Graph DAG-Konfiguration",
      },
    },
    response: {
      id: "Graph-ID",
    },
    success: {
      title: "Graph erstellt",
      description: "Pipeline-Graph erfolgreich erstellt",
    },
    errors: {
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung erforderlich zum Erstellen von Graphen",
      },
      forbidden: {
        title: "Verboten",
        description: "Admin-Zugriff erforderlich",
      },
      server: {
        title: "Serverfehler",
        description: "Graph konnte nicht erstellt werden",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description:
          "Ein unerwarteter Fehler ist beim Erstellen des Graphen aufgetreten",
      },
      validation: {
        title: "Validierung fehlgeschlagen",
        description: "Ungueltige Graph-Konfiguration",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Ressource nicht gefunden",
      },
      conflict: {
        title: "Konflikt",
        description: "Graph-Slug existiert bereits",
      },
      network: {
        title: "Netzwerkfehler",
        description:
          "Netzwerkanfrage beim Erstellen des Graphen fehlgeschlagen",
      },
      unsavedChanges: {
        title: "Ungespeicherte Aenderungen",
        description: "Aenderungen vor dem Fortfahren speichern",
      },
    },
  },
};
