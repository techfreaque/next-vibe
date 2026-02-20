import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Utwórz konto komunikatora",
  description: "Dodaj nowe konto dostawcy SMS, WhatsApp lub Telegram",

  fields: {
    name: {
      label: "Nazwa konta",
      description: "Unikalna nazwa dla tego konta",
      placeholder: "np. Twilio SMS Produkcja",
    },
    description: {
      label: "Opis",
      description: "Opcjonalny opis",
      placeholder: "Opcjonalny opis...",
    },
    channel: {
      label: "Kanał",
      description: "Kanał komunikacji (SMS, WhatsApp, Telegram)",
    },
    provider: {
      label: "Dostawca",
      description: "Dostawca komunikatora",
    },
    fromId: {
      label: "Nadawca / ID numeru telefonu",
      description: "ID nadawcy lub ID numeru telefonu",
      placeholder: "np. +1234567890",
    },
    apiToken: {
      label: "Token API / SID",
      description: "Główne dane uwierzytelniające API",
      placeholder: "Token API lub SID konta",
    },
    apiSecret: {
      label: "Secret API / Token Auth",
      description: "Pomocnicze dane uwierzytelniające API",
      placeholder: "Secret API lub token uwierzytelniający",
    },
    priority: {
      label: "Priorytet",
      description: "Priorytet konta (0 = najniższy)",
    },
  },

  response: {
    id: "ID",
    status: "Status",
    createdAt: "Utworzono",
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
      title: "Nie znaleziono",
      description: "Zasób nie został znaleziony",
    },
    conflict: {
      title: "Nazwa już istnieje",
      description: "Konto o tej nazwie już istnieje",
    },
    server: {
      title: "Błąd serwera",
      description: "Nie udało się utworzyć konta",
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
    title: "Konto utworzone",
    description: "Konto komunikatora zostało pomyślnie utworzone",
  },
};
