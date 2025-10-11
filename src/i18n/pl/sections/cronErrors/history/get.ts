import type { getTranslations as EnglishGetTranslations } from "../../../../en/sections/cronErrors/history/get";

export const getTranslations: typeof EnglishGetTranslations = {
  error: {
    validation: {
      title: "Walidacja historii nie powiodła się",
      description: "Sprawdź parametry historii i spróbuj ponownie",
    },
    unauthorized: {
      title: "Historia nieautoryzowana",
      description: "Nie masz uprawnień do przeglądania historii cron",
    },
    server: {
      title: "Błąd serwera historii",
      description: "Nie można pobrać historii z powodu błędu serwera",
    },
    unknown: {
      title: "Historia nie powiodła się",
      description: "Wystąpił nieoczekiwany błąd podczas pobierania historii",
    },
  },
  success: {
    title: "Historia pobrana",
    description: "Historia cron została pomyślnie pobrana",
  },
};
