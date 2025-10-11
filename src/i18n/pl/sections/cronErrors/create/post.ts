import type { postTranslations as EnglishPostTranslations } from "../../../../en/sections/cronErrors/create/post";

export const postTranslations: typeof EnglishPostTranslations = {
  error: {
    validation: {
      title: "Walidacja tworzenia zadania nie powiodła się",
      description: "Sprawdź parametry zadania i spróbuj ponownie",
    },
    unauthorized: {
      title: "Tworzenie zadania nieautoryzowane",
      description: "Nie masz uprawnień do tworzenia zadań cron",
    },
    server: {
      title: "Błąd serwera tworzenia zadania",
      description: "Nie można utworzyć zadania z powodu błędu serwera",
    },
    unknown: {
      title: "Tworzenie zadania nie powiodło się",
      description: "Wystąpił nieoczekiwany błąd podczas tworzenia zadania",
    },
  },
  success: {
    title: "Zadanie utworzone pomyślnie",
    description: "Twoje zadanie cron zostało pomyślnie utworzone",
  },
};
