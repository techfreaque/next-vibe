import type { statusTranslations as EnglishStatusTranslations } from "../../../../en/sections/imapErrors/agent/status";

export const statusTranslations: typeof EnglishStatusTranslations = {
  error: {
    unauthorized: {
      title: "Brak autoryzacji",
      description:
        "Nie masz uprawnień do przeglądania statusu przetwarzania agenta.",
    },
    validation: {
      title: "Błąd walidacji",
      description: "Podano nieprawidłowe parametry do zapytania o status.",
    },
    server: {
      title: "Błąd serwera",
      description:
        "Wystąpił błąd podczas pobierania statusu przetwarzania agenta.",
    },
    unknown: {
      title: "Nieznany błąd",
      description: "Wystąpił nieznany błąd podczas pobierania statusu.",
    },
  },
  success: {
    title: "Status pobrany",
    description: "Status przetwarzania agenta został pomyślnie pobrany.",
  },
};
