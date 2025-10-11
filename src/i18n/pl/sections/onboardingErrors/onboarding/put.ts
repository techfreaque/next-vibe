import type { putTranslations as EnglishPutTranslations } from "../../../../en/sections/onboardingErrors/onboarding/put";

export const putTranslations: typeof EnglishPutTranslations = {
  error: {
    validation: {
      title: "Walidacja aktualizacji wdrożenia nie powiodła się",
      description: "Sprawdź aktualizacje swojego wdrożenia i spróbuj ponownie",
    },
    unauthorized: {
      title: "Aktualizacja wdrożenia nieautoryzowana",
      description: "Nie masz uprawnień do aktualizacji danych wdrożenia",
    },
    server: {
      title: "Błąd serwera aktualizacji wdrożenia",
      description:
        "Nie można zaktualizować danych wdrożenia z powodu błędu serwera",
    },
    unknown: {
      title: "Aktualizacja wdrożenia nie powiodła się",
      description:
        "Wystąpił nieoczekiwany błąd podczas aktualizacji danych wdrożenia",
    },
  },
  success: {
    title: "Wdrożenie ukończone pomyślnie",
    description: "Twój proces wdrożenia został ukończony",
  },
};
