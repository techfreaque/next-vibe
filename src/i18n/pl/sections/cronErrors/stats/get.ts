import type { getTranslations as EnglishGetTranslations } from "../../../../en/sections/cronErrors/stats/get";

export const getTranslations: typeof EnglishGetTranslations = {
  error: {
    validation: {
      title: "Walidacja statystyk nie powiodła się",
      description: "Sprawdź parametry statystyk i spróbuj ponownie",
    },
    unauthorized: {
      title: "Statystyki nieautoryzowane",
      description: "Nie masz uprawnień do przeglądania statystyk cron",
    },
    server: {
      title: "Błąd serwera statystyk",
      description: "Nie można pobrać statystyk z powodu błędu serwera",
    },
    unknown: {
      title: "Statystyki nie powiodły się",
      description: "Wystąpił nieoczekiwany błąd podczas pobierania statystyk",
    },
  },
  success: {
    title: "Statystyki pobrane",
    description: "Statystyki cron zostały pomyślnie pobrane",
  },
};
