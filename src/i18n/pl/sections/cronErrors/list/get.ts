import type { getTranslations as EnglishGetTranslations } from "../../../../en/sections/cronErrors/list/get";

export const getTranslations: typeof EnglishGetTranslations = {
  error: {
    validation: {
      title: "Walidacja listy zadań nie powiodła się",
      description: "Sprawdź parametry filtra i spróbuj ponownie",
    },
    unauthorized: {
      title: "Lista zadań nieautoryzowana",
      description: "Nie masz uprawnień do przeglądania zadań cron",
    },
    server: {
      title: "Błąd serwera listy zadań",
      description: "Nie można pobrać zadań z powodu błędu serwera",
    },
    unknown: {
      title: "Lista zadań nie powiodła się",
      description: "Wystąpił nieoczekiwany błąd podczas pobierania zadań",
    },
  },
  success: {
    title: "Zadania pobrane",
    description: "Zadania cron zostały pomyślnie pobrane",
  },
};
