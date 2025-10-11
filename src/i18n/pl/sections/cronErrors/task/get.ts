import type { getTranslations as EnglishGetTranslations } from "../../../../en/sections/cronErrors/task/get";

export const getTranslations: typeof EnglishGetTranslations = {
  error: {
    validation: {
      title: "Walidacja pobierania zadania nie powiodła się",
      description: "Sprawdź ID zadania i spróbuj ponownie",
    },
    unauthorized: {
      title: "Pobieranie zadania nieautoryzowane",
      description: "Nie masz uprawnień do przeglądania tego zadania cron",
    },
    notFound: {
      title: "Zadanie nie znalezione",
      description: "Żądane zadanie cron nie zostało znalezione",
    },
    server: {
      title: "Błąd serwera pobierania zadania",
      description: "Nie można pobrać zadania z powodu błędu serwera",
    },
    unknown: {
      title: "Pobieranie zadania nie powiodło się",
      description: "Wystąpił nieoczekiwany błąd podczas pobierania zadania",
    },
  },
  success: {
    title: "Zadanie pobrane pomyślnie",
    description: "Szczegóły zadania cron zostały pomyślnie pobrane",
  },
};
