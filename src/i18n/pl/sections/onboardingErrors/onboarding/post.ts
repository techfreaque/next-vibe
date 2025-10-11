import type { postTranslations as EnglishPostTranslations } from "../../../../en/sections/onboardingErrors/onboarding/post";

export const postTranslations: typeof EnglishPostTranslations = {
  error: {
    validation: {
      title: "Walidacja tworzenia wdrożenia nie powiodła się",
      description: "Sprawdź informacje o swoim wdrożeniu i spróbuj ponownie",
    },
    unauthorized: {
      title: "Tworzenie wdrożenia nieautoryzowane",
      description: "Nie masz uprawnień do tworzenia danych wdrożenia",
    },
    server: {
      title: "Błąd serwera tworzenia wdrożenia",
      description: "Nie można utworzyć danych wdrożenia z powodu błędu serwera",
    },
    unknown: {
      title: "Tworzenie wdrożenia nie powiodło się",
      description:
        "Wystąpił nieoczekiwany błąd podczas tworzenia danych wdrożenia",
    },
  },
  success: {
    title: "Dane wdrożenia utworzone pomyślnie",
    description: "Twój postęp wdrożenia został zapisany",
  },
};
