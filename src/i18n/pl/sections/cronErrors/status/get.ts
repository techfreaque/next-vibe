import type { getTranslations as EnglishGetTranslations } from "../../../../en/sections/cronErrors/status/get";

export const getTranslations: typeof EnglishGetTranslations = {
  error: {
    validation: {
      title: "Walidacja statusu nie powiodła się",
      description: "Sprawdź parametry statusu i spróbuj ponownie",
    },
    unauthorized: {
      title: "Status nieautoryzowany",
      description: "Nie masz uprawnień do przeglądania statusu cron",
    },
    server: {
      title: "Błąd serwera statusu",
      description: "Nie można pobrać statusu z powodu błędu serwera",
    },
    unknown: {
      title: "Status nie powiódł się",
      description: "Wystąpił nieoczekiwany błąd podczas pobierania statusu",
    },
  },
  success: {
    title: "Status pobrany",
    description: "Status cron został pomyślnie pobrany",
  },
};
