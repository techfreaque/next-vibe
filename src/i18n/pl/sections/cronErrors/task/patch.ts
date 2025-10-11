import type { patchTranslations as EnglishPatchTranslations } from "../../../../en/sections/cronErrors/task/patch";

export const patchTranslations: typeof EnglishPatchTranslations = {
  error: {
    validation: {
      title: "Walidacja częściowej aktualizacji zadania nie powiodła się",
      description: "Sprawdź parametry zadania i spróbuj ponownie",
    },
    unauthorized: {
      title: "Częściowa aktualizacja zadania nieautoryzowana",
      description:
        "Nie masz uprawnień do częściowej aktualizacji tego zadania cron",
    },
    notFound: {
      title: "Zadanie nie znalezione",
      description:
        "Zadanie, które próbujesz zaktualizować, nie zostało znalezione",
    },
    server: {
      title: "Błąd serwera częściowej aktualizacji zadania",
      description:
        "Nie można częściowo zaktualizować zadania z powodu błędu serwera",
    },
    unknown: {
      title: "Częściowa aktualizacja zadania nie powiodła się",
      description:
        "Wystąpił nieoczekiwany błąd podczas częściowej aktualizacji zadania",
    },
  },
  success: {
    title: "Zadanie częściowo zaktualizowane pomyślnie",
    description: "Zadanie cron zostało pomyślnie częściowo zaktualizowane",
  },
};
