import type { resetTranslations as EnglishResetTranslations } from "../../../../en/sections/imapErrors/config/reset";

export const resetTranslations: typeof EnglishResetTranslations = {
  error: {
    unauthorized: {
      title: "Brak autoryzacji",
      description: "Nie masz uprawnień do resetowania konfiguracji.",
    },
    server: {
      title: "Błąd serwera",
      description: "Wystąpił błąd podczas resetowania konfiguracji.",
    },
    unknown: {
      title: "Nieznany błąd",
      description: "Wystąpił nieznany błąd podczas resetowania konfiguracji.",
    },
  },
  success: {
    title: "Konfiguracja zresetowana",
    description:
      "Konfiguracja została pomyślnie zresetowana do wartości domyślnych.",
  },
};
