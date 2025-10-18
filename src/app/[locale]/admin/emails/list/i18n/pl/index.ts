import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  admin: {
    title: "Zarządzanie pocztą e-mail",
    description: "Monitoruj kampanie e-mail",
    filters: {
      title: "Filtry",
      search: "Szukaj e-maili...",
      status: "Filtruj według statusu",
      type: "Filtruj według typu",
      clear: "Wyczyść filtry",
      quick_filters: "Szybkie filtry",
      quick: {
        sent: "Wysłane",
        opened: "Otwarte",
        bounced: "Odrzucone",
        lead_campaigns: "Kampanie lead",
      },
    },
    status: {
      all: "Wszystkie statusy",
      pending: "Oczekujące",
      sent: "Wysłane",
      delivered: "Dostarczone",
      opened: "Otwarte",
      clicked: "Kliknięte",
      bounced: "Odrzucone",
      failed: "Nieudane",
      unsubscribed: "Wypisane",
    },
    type: {
      all: "Wszystkie typy",
      transactional: "Transakcyjne",
      marketing: "Marketing",
      notification: "Powiadomienie",
      system: "System",
      lead_campaign: "Kampania lead",
      user_communication: "Komunikacja użytkownika",
    },
    sort: {
      field: "Sortuj według",
      created_at: "Data utworzenia",
      sent_at: "Data wysłania",
      subject: "Temat",
      recipient_email: "Odbiorca",
      status: "Status",
      type: "Typ",
      order: "Kolejność sortowania",
      desc: "Malejąco",
      asc: "Rosnąco",
    },
    table: {
      subject: "Temat",
      recipient: "Odbiorca",
      status: "Status",
      type: "Typ",
      sentAt: "Wysłane",
      actions: "Akcje",
    },
    messages: {
      noEmails: "Nie znaleziono e-maili",
      noEmailsDescription: "Dostosuj filtry lub utwórz nową kampanię",
    },
  },
  pagination: {
    showing: "Pokazuje {start} do {end} z {total} wyników",
    previous: "Poprzedni",
    next: "Następny",
  },
  nav: {
    campaigns: "Lista e-mail",
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
