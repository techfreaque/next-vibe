import type { formTranslations as EnglishFormTranslations } from "../../../../en/sections/onboardingErrors/status/form";

export const formTranslations: typeof EnglishFormTranslations = {
  error: {
    validation: {
      title: "Walidacja statusu wdrożenia nie powiodła się",
      description: "Nie można zwalidować żądania statusu",
    },
    unauthorized: {
      title: "Status wdrożenia nieautoryzowany",
      description: "Nie masz uprawnień do sprawdzania statusu wdrożenia",
    },
    server: {
      title: "Błąd serwera statusu wdrożenia",
      description:
        "Nie można sprawdzić statusu wdrożenia z powodu błędu serwera",
    },
    unknown: {
      title: "Status wdrożenia nie powiódł się",
      description:
        "Wystąpił nieoczekiwany błąd podczas sprawdzania statusu wdrożenia",
    },
  },
};
