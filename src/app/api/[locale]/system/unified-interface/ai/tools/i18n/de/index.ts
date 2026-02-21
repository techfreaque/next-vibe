import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  get: {
    title: "Tool-Hilfe — Verfügbare KI-Tools entdecken",
    description:
      "Suche und entdecke alle verfügbaren KI-Tools. Verwende query zum Suchen nach Name, Beschreibung oder Alias. Verwende category zum Filtern nach Tool-Kategorie. Gibt Toolnamen, Beschreibungen, Aliase und Metadaten zurück.",
    response: {
      title: "KI-Tools Antwort",
      description: "Liste der verfügbaren KI-Tools",
    },
    fields: {
      query: {
        label: "Suchanfrage",
        description:
          "Tools nach Name, Beschreibung, Alias oder Tag durchsuchen (ohne Beachtung der Groß-/Kleinschreibung)",
        placeholder: "z.B. Suche, Speicher, Abruf...",
      },
      category: {
        label: "Kategoriefilter",
        description:
          "Tools nach Kategoriename filtern (ohne Beachtung der Groß-/Kleinschreibung)",
      },
      toolName: {
        label: "Tool-Name (Detail)",
        description:
          "Vollständige Details für ein bestimmtes Tool nach Name oder Alias. Gibt Parameterschema zurück.",
      },
      tools: {
        title: "Verfügbare Tools",
      },
      totalCount: {
        title: "Gesamtzahl der Tools",
      },
      matchedCount: {
        title: "Anzahl der Treffer",
      },
      categories: {
        title: "Tool-Kategorien",
      },
      hint: {
        title: "Nutzungshinweis",
      },
    },
    submitButton: {
      label: "Tools suchen",
      loadingText: "Suche...",
    },
    widget: {
      totalTools: "{{count}} Tools verfügbar",
      matchedOf: "{{matched}} von {{total}} Tools",
      categories: "{{count}} Kategorien",
      noToolsFound: "Keine Tools gefunden, die Ihrer Suche entsprechen",
    },
    success: {
      title: "Tools erfolgreich abgerufen",
      description: "Verfügbare KI-Tools abgerufen",
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
        description: "Authentifizierung erforderlich",
      },
      forbidden: {
        title: "Verboten",
        description: "Sie haben keine Berechtigung für AI-Tools",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "AI-Tools-Endpunkt nicht gefunden",
      },
      server: {
        title: "Serverfehler",
        description: "Tools konnten nicht abgerufen werden",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Sie haben ungespeicherte Änderungen",
      },
      conflict: {
        title: "Konflikt",
        description: "Ein Konflikt ist beim Abrufen der AI-Tools aufgetreten",
      },
    },
  },
  category: "KI-Tools",
  tags: {
    tools: "tools",
  },
};
