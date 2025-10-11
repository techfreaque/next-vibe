import type { patchTranslations as EnglishPatchTranslations } from "../../../../en/sections/leadsErrors/leadsImport/patch";

export const patchTranslations: typeof EnglishPatchTranslations = {
  success: {
    title: "Zadanie importu zaktualizowane pomyślnie",
    description: "Ustawienia zadania zostały zaktualizowane",
  },
  error: {
    validation: {
      title: "Nieprawidłowe żądanie aktualizacji zadania",
      description: "Sprawdź parametry aktualizacji",
    },
    unauthorized: {
      title: "Aktualizacja zadania nieautoryzowana",
      description: "Nie masz uprawnień do aktualizacji tego zadania",
    },
    forbidden: {
      title: "Aktualizacja zadania zabroniona",
      description: "Nie masz uprawnień do aktualizacji tego zadania importu",
    },
    not_found: {
      title: "Zadanie importu nie znalezione",
      description: "Nie można znaleźć zadania importu",
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
};
