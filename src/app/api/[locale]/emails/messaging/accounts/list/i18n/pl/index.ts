import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Konta Wiadomości",
  description: "Zarządzaj kontami SMS, WhatsApp i Telegram",

  fields: {
    channel: { label: "Kanał", description: "Filtruj według kanału" },
    status: { label: "Status", description: "Filtruj według statusu" },
    search: {
      label: "Szukaj",
      description: "Szukaj po nazwie",
      placeholder: "Szukaj kont...",
    },
    page: { label: "Strona", description: "Numer strony" },
    limit: { label: "Limit", description: "Kont na stronę" },
  },

  response: {
    account: {
      title: "Konto Wiadomości",
      description: "Dane konta dostawcy wiadomości",
      id: "ID",
      name: "Nazwa",
      channel: "Kanał",
      provider: "Dostawca",
      fromId: "Od",
      status: "Status",
      messagesSentTotal: "Łącznie wysłanych",
      lastUsedAt: "Ostatnio używane",
      createdAt: "Utworzone",
    },
    pagination: {
      title: "Paginacja",
      description: "Informacje o paginacji",
      page: "Strona",
      limit: "Limit",
      total: "Łącznie",
      totalPages: "Łączna liczba stron",
    },
  },

  errors: {
    validation: {
      title: "Błąd walidacji",
      description: "Nieprawidłowe parametry",
    },
    unauthorized: {
      title: "Nieautoryzowany",
      description: "Wymagany dostęp administratora",
    },
    forbidden: { title: "Zabronione", description: "Dostęp zabroniony" },
    notFound: { title: "Nie znaleziono", description: "Zasób nie znaleziony" },
    conflict: { title: "Konflikt", description: "Konflikt danych" },
    server: { title: "Błąd serwera", description: "Nie udało się pobrać kont" },
    networkError: { title: "Błąd sieci", description: "Błąd sieci" },
    unsavedChanges: {
      title: "Niezapisane zmiany",
      description: "Masz niezapisane zmiany",
    },
    unknown: {
      title: "Nieznany błąd",
      description: "Wystąpił nieoczekiwany błąd",
    },
  },

  success: { title: "Konta pobrane", description: "Pomyślnie pobrano konta" },

  widget: {
    create: "Dodaj konto",
    refresh: "Odśwież",
    emptyState: "Brak skonfigurowanych kont wiadomości",
    sent: "Wysłano",
    searchPlaceholder: "Szukaj kont...",
  },
};
