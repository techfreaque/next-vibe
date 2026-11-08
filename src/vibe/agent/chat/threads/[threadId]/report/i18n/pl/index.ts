import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Czat",
  tags: {
    moderation: "Moderacja",
  },
  post: {
    title: "Zgłoś treść",
    titleShort: "Zgłoś",
    description:
      "Zgłoś publiczny post lub udostępniony wątek. Wystarczająco dużo zgłoszeń ukrywa go do czasu weryfikacji przez admina.",
    reason: {
      label: "Powód",
      description: "Co jest nie tak z tą treścią?",
    },
    note: {
      label: "Szczegóły",
      description: "Opcjonalnie. Dodaj kontekst dla weryfikującego.",
      placeholder: "Co powinien wiedzieć weryfikujący?",
    },
    reasons: {
      spam: "Spam",
      illegal: "Treści nielegalne",
      abuse: "Nadużycie lub nękanie",
      csamFlag: "Zagrożenie bezpieczeństwa dzieci",
      other: "Inne",
    },
    messageId: {
      label: "ID wiadomości",
      description: "Konkretna zgłaszana wiadomość (opcjonalnie)",
    },
    errors: {
      validation: { title: "Błąd walidacji", description: "Wybierz powód" },
      network: {
        title: "Błąd sieci",
        description: "Nie udało się połączyć z serwerem",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Nie możesz zgłosić tej treści",
      },
      forbidden: {
        title: "Zabronione",
        description: "Nie możesz zgłosić własnej treści",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Ta treść nie istnieje lub jest niedostępna",
      },
      server: {
        title: "Błąd serwera",
        description: "Nie udało się wysłać zgłoszenia",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieoczekiwany błąd",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany",
      },
      conflict: {
        title: "Już zgłoszone",
        description: "Ta treść została już przez Ciebie zgłoszona",
      },
      rateLimited: {
        title: "Za dużo zgłoszeń",
        description: "Zgłaszasz zbyt szybko. Spróbuj później.",
      },
    },
    success: {
      title: "Zgłoszenie wysłane",
      description: "Dziękujemy. Sprawdzamy każde zgłoszenie.",
    },
    response: {
      reported: { content: "Zgłoszono" },
      reportCount: { content: "Liczba zgłoszeń" },
      hidden: { content: "Ukryte" },
    },
    backButton: {
      label: "Wstecz",
    },
    button: {
      submit: "Wyślij zgłoszenie",
      loading: "Wysyłanie...",
    },
  },
};
