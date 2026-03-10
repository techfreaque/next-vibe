import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Vibe Sense",
  tags: { vibeSense: "vibe-sense" },
  post: {
    title: "Zum System hochstufen",
    description:
      "Einen Admin-Graphen zum System-eigenen hochstufen (schreibgeschützt, geteilt)",
    fields: {
      id: { label: "Graph-ID", description: "UUID des Graphen" },
    },
    response: {
      promotedId: "Graph-ID",
    },
    widget: {
      confirmDescription:
        "Promoting this graph will make it system-owned and shared with all users. The current system version for this slug will be deactivated. This can be reversed by promoting a different version.",
      promotedIdLabel: "Hochgestufte ID:",
      viewButton: "Anzeigen",
    },
    success: {
      title: "Graph hochgestuft",
      description: "Graph erfolgreich zum System hochgestuft",
    },
    errors: {
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung erforderlich",
      },
      forbidden: {
        title: "Verboten",
        description: "Administratorzugang erforderlich",
      },
      server: {
        title: "Serverfehler",
        description: "Graph konnte nicht hochgestuft werden",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
      },
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Parameter",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Graph nicht gefunden",
      },
      conflict: { title: "Konflikt", description: "Ressourcenkonflikt" },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkanfrage fehlgeschlagen",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Änderungen zuerst speichern",
      },
    },
  },
};
