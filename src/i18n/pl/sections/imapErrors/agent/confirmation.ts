import type { confirmationTranslations as EnglishConfirmationTranslations } from "../../../../en/sections/imapErrors/agent/confirmation";

export const confirmationTranslations: typeof EnglishConfirmationTranslations =
  {
    error: {
      unauthorized: {
        title: "Brak autoryzacji",
        description:
          "Nie masz uprawnień do odpowiadania na żądania potwierdzenia.",
      },
      validation: {
        title: "Błąd walidacji",
        description: "Podano nieprawidłowe dane odpowiedzi potwierdzenia.",
      },
      not_found: {
        title: "Potwierdzenie nie znalezione",
        description: "Żądanie potwierdzenia nie mogło zostać znalezione.",
      },
      conflict: {
        title: "Potwierdzenie już przetworzone",
        description: "To żądanie potwierdzenia zostało już przetworzone.",
      },
      expired: {
        title: "Potwierdzenie wygasło",
        description:
          "To żądanie potwierdzenia wygasło i nie może zostać przetworzone.",
      },
      server: {
        title: "Błąd serwera",
        description:
          "Wystąpił błąd podczas przetwarzania odpowiedzi potwierdzenia.",
      },
      unknown: {
        title: "Nieznany błąd",
        description:
          "Wystąpił nieznany błąd podczas przetwarzania potwierdzenia.",
      },
    },
    success: {
      approved: "Akcja zatwierdzona i pomyślnie wykonana",
      rejected: "Akcja pomyślnie odrzucona",
    },
  };
