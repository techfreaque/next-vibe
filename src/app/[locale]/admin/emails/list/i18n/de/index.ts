import type { translations as enTranslations } from "../en";

// Using EN values for now - can be translated later
export const translations: typeof enTranslations = {
  admin: {
    title: "Email-Verwaltung",
    description: "E-Mail-Kampagnen überwachen",
    filters: {
      title: "Filter",
      search: "E-Mails suchen...",
      status: "Nach Status filtern",
      type: "Nach Typ filtern",
      clear: "Filter löschen",
      quick_filters: "Schnellfilter",
      quick: {
        sent: "Gesendet",
        opened: "Geöffnet",
        bounced: "Zurückgewiesen",
        lead_campaigns: "Lead-Kampagnen",
      },
    },
    status: {
      all: "Alle Status",
      pending: "Ausstehend",
      sent: "Gesendet",
      delivered: "Zugestellt",
      opened: "Geöffnet",
      clicked: "Geklickt",
      bounced: "Zurückgewiesen",
      failed: "Fehlgeschlagen",
      unsubscribed: "Abgemeldet",
    },
    type: {
      all: "Alle Typen",
      transactional: "Transaktional",
      marketing: "Marketing",
      notification: "Benachrichtigung",
      system: "System",
      lead_campaign: "Lead-Kampagne",
      user_communication: "Benutzerkommunikation",
    },
    sort: {
      field: "Sortieren nach",
      created_at: "Erstellungsdatum",
      sent_at: "Sendedatum",
      subject: "Betreff",
      recipient_email: "Empfänger",
      status: "Status",
      type: "Typ",
      order: "Sortierreihenfolge",
      desc: "Absteigend",
      asc: "Aufsteigend",
    },
    table: {
      subject: "Betreff",
      recipient: "Empfänger",
      status: "Status",
      type: "Typ",
      sentAt: "Gesendet am",
      actions: "Aktionen",
    },
    messages: {
      noEmails: "Keine E-Mails gefunden",
      noEmailsDescription: "Filter anpassen oder neue Kampagne erstellen",
    },
  },
  pagination: {
    showing: "Zeige {start} bis {end} von {total} Ergebnissen",
    previous: "Zurück",
    next: "Weiter",
  },
  nav: {
    campaigns: "E-Mail-Liste",
  },
  post: {
    title: "List",
    description: "List endpoint",
    form: {
      title: "List Configuration",
      description: "Configure list parameters",
    },
    response: {
      title: "Response",
      description: "List response data",
    },
    errors: {
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required",
      },
      validation: {
        title: "Validation Error",
        description: "Invalid request parameters",
      },
      server: {
        title: "Server Error",
        description: "Internal server error occurred",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred",
      },
      network: {
        title: "Network Error",
        description: "Network error occurred",
      },
      forbidden: {
        title: "Forbidden",
        description: "Access forbidden",
      },
      notFound: {
        title: "Not Found",
        description: "Resource not found",
      },
      conflict: {
        title: "Conflict",
        description: "Data conflict occurred",
      },
    },
    success: {
      title: "Success",
      description: "Operation completed successfully",
    },
  },
};
