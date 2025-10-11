import type { putTranslations as EnglishPutTranslations } from "../../../../en/sections/imapErrors/config/put";

export const putTranslations: typeof EnglishPutTranslations = {
  error: {
    unauthorized: {
      title: "Brak autoryzacji",
      description: "Nie masz uprawnień do aktualizacji konfiguracji.",
    },
    server: {
      title: "Błąd serwera",
      description: "Wystąpił błąd podczas aktualizacji konfiguracji.",
    },
    unknown: {
      title: "Nieznany błąd",
      description: "Wystąpił nieznany błąd podczas aktualizacji konfiguracji.",
    },
  },
  success: {
    title: "Konfiguracja zaktualizowana",
    description: "Konfiguracja została pomyślnie zaktualizowana.",
  },
};
