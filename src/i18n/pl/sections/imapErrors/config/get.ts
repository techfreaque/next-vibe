import type { getTranslations as EnglishGetTranslations } from "../../../../en/sections/imapErrors/config/get";

export const getTranslations: typeof EnglishGetTranslations = {
  error: {
    unauthorized: {
      title: "Brak autoryzacji",
      description: "Nie masz uprawnień do przeglądania konfiguracji.",
    },
    server: {
      title: "Błąd serwera",
      description: "Wystąpił błąd podczas pobierania konfiguracji.",
    },
    unknown: {
      title: "Nieznany błąd",
      description: "Wystąpił nieznany błąd podczas pobierania konfiguracji.",
    },
  },
  success: {
    title: "Konfiguracja pobrana",
    description: "Konfiguracja została pomyślnie pobrana.",
  },
};
