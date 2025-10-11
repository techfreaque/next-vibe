import type { getTranslations as EnglishGetTranslations } from "../../../../en/sections/onboardingErrors/onboarding/get";

export const getTranslations: typeof EnglishGetTranslations = {
  error: {
    validation: {
      title: "Walidacja danych wdrożenia nie powiodła się",
      description: "Nie można zwalidować żądania danych wdrożenia",
    },
    unauthorized: {
      title: "Dostęp do danych wdrożenia zabroniony",
      description: "Nie masz uprawnień do dostępu do danych wdrożenia",
    },
    server: {
      title: "Błąd serwera danych wdrożenia",
      description:
        "Nie można załadować danych wdrożenia z powodu błędu serwera",
    },
    unknown: {
      title: "Dostęp do danych wdrożenia nie powiódł się",
      description:
        "Wystąpił nieoczekiwany błąd podczas ładowania danych wdrożenia",
    },
  },
  success: {
    title: "Dane wdrożenia pobrane pomyślnie",
    description: "Twój postęp wdrożenia został załadowany",
  },
};
