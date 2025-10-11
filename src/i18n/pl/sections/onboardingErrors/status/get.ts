import type { getTranslations as EnglishGetTranslations } from "../../../../en/sections/onboardingErrors/status/get";

export const getTranslations: typeof EnglishGetTranslations = {
  error: {
    validation: {
      title: "Walidacja pobierania statusu nie powiodła się",
      description: "Nieprawidłowe parametry żądania pobierania statusu",
    },
    unauthorized: {
      title: "Dostęp do pobierania statusu zabroniony",
      description: "Nie masz uprawnień do dostępu do statusu wdrożenia",
    },
    server: {
      title: "Błąd serwera pobierania statusu",
      description: "Nie można pobrać statusu wdrożenia z powodu błędu serwera",
    },
    unknown: {
      title: "Pobieranie statusu nie powiodło się",
      description:
        "Wystąpił nieoczekiwany błąd podczas pobierania statusu wdrożenia",
    },
  },
  success: {
    title: "Status pobrany pomyślnie",
    description: "Status wdrożenia został pomyślnie pobrany",
  },
};
