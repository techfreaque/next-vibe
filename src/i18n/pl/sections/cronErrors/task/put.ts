import type { putTranslations as EnglishPutTranslations } from "../../../../en/sections/cronErrors/task/put";

export const putTranslations: typeof EnglishPutTranslations = {
  error: {
    validation: {
      title: "Walidacja aktualizacji zadania nie powiodła się",
      description: "Sprawdź parametry zadania i spróbuj ponownie",
    },
    unauthorized: {
      title: "Aktualizacja zadania nieautoryzowana",
      description: "Nie masz uprawnień do aktualizacji tego zadania cron",
    },
    notFound: {
      title: "Zadanie nie znalezione",
      description:
        "Zadanie, które próbujesz zaktualizować, nie zostało znalezione",
    },
    server: {
      title: "Błąd serwera aktualizacji zadania",
      description: "Nie można zaktualizować zadania z powodu błędu serwera",
    },
    unknown: {
      title: "Aktualizacja zadania nie powiodła się",
      description: "Wystąpił nieoczekiwany błąd podczas aktualizacji zadania",
    },
  },
  success: {
    title: "Zadanie zaktualizowane pomyślnie",
    description: "Zadanie cron zostało pomyślnie zaktualizowane",
  },
};
