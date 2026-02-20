import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  get: {
    title: "Konto komunikatora",
    description: "Wyświetl szczegóły konta komunikatora",
  },
  put: {
    title: "Edytuj konto komunikatora",
    description: "Zaktualizuj ustawienia konta komunikatora",
    success: {
      title: "Konto zaktualizowane",
      description: "Konto komunikatora zostało pomyślnie zaktualizowane",
    },
  },

  fields: {
    id: { label: "ID", description: "ID konta" },
    name: {
      label: "Nazwa konta",
      description: "Nazwa dla tego konta",
      placeholder: "np. Twilio SMS Produkcja",
    },
    description: {
      label: "Opis",
      description: "Opcjonalny opis",
      placeholder: "Opcjonalny opis...",
    },
    channel: { label: "Kanał", description: "Kanał komunikacji" },
    provider: { label: "Dostawca", description: "Dostawca komunikatora" },
    fromId: {
      label: "Nadawca / ID numeru telefonu",
      description: "ID nadawcy lub ID numeru telefonu",
      placeholder: "np. +1234567890",
    },
    apiToken: {
      label: "Token API / SID",
      description: "Pozostaw puste, aby zachować bieżący token",
      placeholder: "Nowy token API (pozostaw puste, aby zachować bieżący)",
    },
    apiSecret: {
      label: "Secret API / Token Auth",
      description: "Pozostaw puste, aby zachować bieżący secret",
      placeholder: "Nowy secret API (pozostaw puste, aby zachować bieżący)",
    },
    priority: { label: "Priorytet", description: "Priorytet konta" },
    status: { label: "Status", description: "Status konta" },
  },

  response: {
    account: {
      name: "Nazwa",
      description: "Opis",
      channel: "Kanał",
      provider: "Dostawca",
      fromId: "Od",
      status: "Status",
      priority: "Priorytet",
      messagesSentTotal: "Łącznie wysłanych",
      lastUsedAt: "Ostatnio używane",
      createdAt: "Utworzono",
      updatedAt: "Zaktualizowano",
    },
  },

  errors: {
    validation: {
      title: "Błąd walidacji",
      description: "Nieprawidłowe dane wejściowe",
    },
    unauthorized: {
      title: "Brak autoryzacji",
      description: "Wymagany dostęp administratora",
    },
    forbidden: { title: "Zabronione", description: "Odmowa dostępu" },
    notFound: {
      title: "Nie znaleziono konta",
      description: "Konto komunikatora nie zostało znalezione",
    },
    conflict: {
      title: "Nazwa już istnieje",
      description: "Konto o tej nazwie już istnieje",
    },
    server: {
      title: "Błąd serwera",
      description: "Nie udało się zaktualizować konta",
    },
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

  success: {
    title: "Konto pobrane",
    description: "Konto komunikatora zostało pomyślnie pobrane",
  },
};
