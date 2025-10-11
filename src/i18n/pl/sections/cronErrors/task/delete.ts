import type { deleteTranslations as EnglishDeleteTranslations } from "../../../../en/sections/cronErrors/task/delete";

export const deleteTranslations: typeof EnglishDeleteTranslations = {
  error: {
    validation: {
      title: "Walidacja usuwania zadania nie powiodła się",
      description: "Sprawdź ID zadania i spróbuj ponownie",
    },
    unauthorized: {
      title: "Usuwanie zadania nieautoryzowane",
      description: "Nie masz uprawnień do usunięcia tego zadania cron",
    },
    notFound: {
      title: "Zadanie nie znalezione",
      description: "Zadanie, które próbujesz usunąć, nie zostało znalezione",
    },
    server: {
      title: "Błąd serwera usuwania zadania",
      description: "Nie można usunąć zadania z powodu błędu serwera",
    },
    unknown: {
      title: "Usuwanie zadania nie powiodło się",
      description: "Wystąpił nieoczekiwany błąd podczas usuwania zadania",
    },
  },
  success: {
    title: "Zadanie usunięte pomyślnie",
    description: "Zadanie cron zostało pomyślnie usunięte",
  },
};
