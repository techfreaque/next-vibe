import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Lead-Verwaltung",
  tags: {
    leads: "Leads",
    search: "Suchen",
  },
  get: {
    title: "Leads suchen",
    description: "Leads mit Filterung und Paginierung suchen",
    form: {
      title: "Lead-Suchformular",
      description: "Suchkriterien eingeben um Leads zu finden",
    },
    search: {
      label: "Suchanfrage",
      description:
        "Suchbegriff um Leads nach E-Mail, Firmenname oder Notizen zu filtern",
      placeholder: "Suchbegriff eingeben...",
    },
    limit: {
      label: "Ergebnislimit",
      description: "Maximale Anzahl der zurückzugebenden Ergebnisse (1-100)",
    },
    offset: {
      label: "Ergebnisversatz",
      description: "Anzahl der zu überspringenden Ergebnisse für Paginierung",
    },
    response: {
      title: "Suchergebnisse",
      description: "Paginierte Suchergebnisse mit Lead-Daten",
    },
    errors: {
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung erforderlich um Leads zu suchen",
      },
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Suchparameter angegeben",
      },
      server: {
        title: "Serverfehler",
        description: "Interner Serverfehler bei der Lead-Suche",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler bei der Lead-Suche",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkfehler bei der Lead-Suche",
      },
      forbidden: {
        title: "Verboten",
        description: "Zugriff auf Lead-Suche verboten",
      },
      notFound: {
        title: "Keine Ergebnisse",
        description: "Keine Leads gefunden die den Suchkriterien entsprechen",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Es gibt ungespeicherte Änderungen im Suchformular",
      },
      conflict: {
        title: "Konflikt",
        description: "Datenkonflikt bei der Lead-Suche",
      },
    },
    success: {
      title: "Suche abgeschlossen",
      description: "Lead-Suche erfolgreich abgeschlossen",
    },
  },
};
