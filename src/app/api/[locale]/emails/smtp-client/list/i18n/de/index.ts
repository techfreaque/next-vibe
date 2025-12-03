import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "SMTP-Konten auflisten",
  description: "Paginierte Liste der SMTP-Konten mit Filteroptionen abrufen",

  container: {
    title: "SMTP-Konten-Liste",
    description: "SMTP-Konten durchsuchen und filtern",
  },

  fields: {
    campaignType: {
      label: "Kampagnentyp",
      description: "Nach Kampagnentyp filtern",
    },
    status: {
      label: "Kontostatus",
      description: "Nach Kontostatus filtern",
    },
    healthStatus: {
      label: "Gesundheitsstatus",
      description: "Nach Gesundheitsstatus filtern",
    },
    search: {
      label: "Suchen",
      description: "Nach Kontoname oder E-Mail suchen",
      placeholder: "Konten suchen...",
    },
    sortBy: {
      label: "Sortieren nach",
      description: "Konten nach Feld sortieren",
    },
    sortOrder: {
      label: "Sortierreihenfolge",
      description: "Sortierreihenfolge (aufsteigend oder absteigend)",
    },
    page: {
      label: "Seite",
      description: "Seitennummer für Paginierung",
    },
    limit: {
      label: "Limit",
      description: "Anzahl der Konten pro Seite",
    },
  },

  response: {
    account: {
      title: "SMTP-Konto",
      description: "SMTP-Konto-Details",
      id: "Konto-ID",
      name: "Kontoname",
      status: "Status",
      healthStatus: "Gesundheitsstatus",
      priority: "Priorität",
      totalEmailsSent: "Gesendete E-Mails gesamt",
      lastUsedAt: "Zuletzt verwendet am",
      createdAt: "Erstellt am",
    },
    pagination: {
      title: "Paginierung",
      description: "Paginierungsinformationen",
      page: "Seite",
      limit: "Limit",
      total: "Gesamt",
      totalPages: "Seiten gesamt",
    },
  },

  errors: {
    validation: {
      title: "Validierungsfehler",
      description: "Ungültige Filterparameter",
    },
    unauthorized: {
      title: "Nicht autorisiert",
      description: "Admin-Zugriff erforderlich für SMTP-Konten-Auflistung",
    },
    forbidden: {
      title: "Verboten",
      description: "Zugriff verweigert",
    },
    notFound: {
      title: "Nicht gefunden",
      description: "Ressource nicht gefunden",
    },
    conflict: {
      title: "Konflikt",
      description: "Datenkonflikt aufgetreten",
    },
    server: {
      title: "Serverfehler",
      description: "Fehler beim Abrufen der SMTP-Konten",
    },
    networkError: {
      title: "Netzwerkfehler",
      description: "Netzwerkkommunikation fehlgeschlagen",
    },
    unsavedChanges: {
      title: "Ungespeicherte Änderungen",
      description: "Sie haben ungespeicherte Änderungen",
    },
    unknown: {
      title: "Unbekannter Fehler",
      description: "Ein unerwarteter Fehler ist aufgetreten",
    },
  },

  success: {
    title: "SMTP-Konten abgerufen",
    description: "SMTP-Konten-Liste erfolgreich abgerufen",
  },
};
