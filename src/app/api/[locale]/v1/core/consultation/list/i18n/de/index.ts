/**
 * Consultation List endpoint translations for German
 */

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Beratungen auflisten",
  description: "Liste der Beratungen mit Filterung und Paginierung abrufen",
  category: "Beratung",

  form: {
    title: "Beratungsfilter",
    description: "Filter konfigurieren, um bestimmte Beratungen zu finden",
  },

  search: {
    label: "Suchen",
    description: "Beratungen nach Nachrichteninhalt oder Details durchsuchen",
    placeholder: "Suchbegriffe eingeben...",
  },

  userId: {
    label: "Benutzer-ID",
    description: "Beratungen nach spezifischer Benutzer-ID filtern",
    placeholder: "Benutzer-ID eingeben...",
  },

  status: {
    label: "Status",
    description: "Nach Beratungsstatus filtern (Mehrfachauswahl)",
    placeholder: "Status auswählen...",
  },

  dateFrom: {
    label: "Datum von",
    description: "Startdatum für Beratungsdatumsbereichsfilter",
    placeholder: "Startdatum auswählen...",
  },

  dateTo: {
    label: "Datum bis",
    description: "Enddatum für Beratungsdatumsbereichsfilter",
    placeholder: "Enddatum auswählen...",
  },

  sortBy: {
    label: "Sortieren nach",
    description: "Felder zum Sortieren auswählen (Mehrfachauswahl)",
    placeholder: "Sortierfeld(er) auswählen...",
  },

  sortOrder: {
    label: "Sortierreihenfolge",
    description: "Sortierrichtung auswählen (Mehrfachauswahl)",
    placeholder: "Sortierreihenfolge(n) auswählen...",
  },

  limit: {
    label: "Limit",
    description: "Maximale Anzahl der zurückzugebenden Beratungen",
    placeholder: "Limit eingeben...",
  },

  offset: {
    label: "Versatz",
    description: "Anzahl der zu überspringenden Beratungen",
    placeholder: "Versatz eingeben...",
  },

  columns: {
    id: "ID",
    userId: "Benutzer-ID",
    status: "Status",
  },

  item: {
    title: "Beratungselement",
    description: "Einzelne Beratungsdetails",
    id: "Beratungs-ID",
    userId: "Benutzer-ID",
    preferredDate: "Bevorzugtes Datum",
    preferredTime: "Bevorzugte Zeit",
    status: "Status",
    createdAt: "Erstellt am",
    updatedAt: "Aktualisiert am",
  },

  total: {
    title: "Beratungen gesamt",
  },

  errors: {
    validation: {
      title: "Validierungsfehler",
      description: "Die Filterparameter sind ungültig",
    },
    notFound: {
      title: "Nicht gefunden",
      description: "Keine Beratungen mit den angegebenen Filtern gefunden",
    },
    unauthorized: {
      title: "Nicht autorisiert",
      description: "Sie müssen angemeldet sein, um Beratungen aufzulisten",
    },
    forbidden: {
      title: "Zugriff verweigert",
      description: "Sie haben keine Berechtigung, diese Beratungen anzuzeigen",
    },
    server: {
      title: "Serverfehler",
      description: "Beim Abrufen der Beratungen ist ein Fehler aufgetreten",
    },
    network: {
      title: "Netzwerkfehler",
      description:
        "Verbindung zum Server nicht möglich. Bitte überprüfen Sie Ihre Internetverbindung",
    },
    unknown: {
      title: "Unbekannter Fehler",
      description:
        "Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es später erneut",
    },
    unsavedChanges: {
      title: "Ungespeicherte Änderungen",
      description:
        "Sie haben ungespeicherte Filteränderungen, die verloren gehen, wenn Sie fortfahren",
    },
    conflict: {
      title: "Konflikt",
      description: "Es besteht ein Konflikt mit den aktuellen Beratungsfiltern",
    },
  },

  success: {
    title: "Beratungen abgerufen",
    description: "Beratungsliste erfolgreich abgerufen",
  },
};
