import type { updateTranslations as EnglishUpdateTranslations } from "../../../../en/sections/leadsErrors/batch/update";

export const updateTranslations: typeof EnglishUpdateTranslations = {
  success: {
    title: "Aktualizacja wsadowa pomyślna",
    description: "Leady zostały pomyślnie zaktualizowane",
  },
  error: {
    server: {
      title: "Aktualizacja wsadowa nie powiodła się",
      description: "Nie można zaktualizować leadów z powodu błędu serwera",
    },
    validation: {
      title: "Walidacja nie powiodła się",
      description: "Sprawdź dane wejściowe i spróbuj ponownie",
    },
    unauthorized: {
      title: "Nieautoryzowany",
      description: "Nie masz uprawnień do wykonywania aktualizacji wsadowych",
    },
    forbidden: {
      title: "Zabronione",
      description: "Dostęp do aktualizacji wsadowych jest zabroniony",
    },
    not_found: {
      title: "Nie znaleziono",
      description: "Żądany zasób nie został znaleziony",
    },
    unknown: {
      title: "Nieznany błąd",
      description: "Wystąpił nieoczekiwany błąd podczas aktualizacji wsadowej",
    },
  },
  validation: {
    no_fields: "Należy podać co najmniej jedno pole do aktualizacji",
  },
};
