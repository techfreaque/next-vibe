import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Vibe Sense",
  tags: { vibeSense: "vibe-sense" },
  post: {
    title: "Graph archivieren",
    description:
      "Graph weich loeschen (deaktivieren und als archiviert markieren)",
    fields: {
      id: {
        label: "Graph-ID",
        description: "UUID des zu archivierenden Graphen",
      },
    },
    response: {
      archivedId: "Archivierte Graph-ID",
    },
    widget: {
      confirmDescription:
        "Dies deaktiviert den Graphen und markiert ihn als archiviert. Er wird nicht mehr planmaessig ausgefuehrt. Dies kann rueckgaengig gemacht werden.",
      archivedIdLabel: "Archivierte ID:",
      backToList: "Back to graphs",
    },
    success: {
      title: "Graph archiviert",
      description: "Graph wurde erfolgreich archiviert",
    },
    errors: {
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung erforderlich",
      },
      forbidden: {
        title: "Verboten",
        description: "Systemgraphen koennen nicht archiviert werden",
      },
      server: {
        title: "Serverfehler",
        description: "Graph konnte nicht archiviert werden",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
      },
      validation: {
        title: "Validierung fehlgeschlagen",
        description: "Ungueltige Parameter",
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
        title: "Ungespeicherte Aenderungen",
        description: "Aenderungen zuerst speichern",
      },
    },
  },
};
