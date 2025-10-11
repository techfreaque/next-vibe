import type { formTranslations as EnglishFormTranslations } from "../../../../en/sections/templateErrors/templateSubRoute/form";

export const formTranslations: typeof EnglishFormTranslations = {
  error: {
    validation: {
      title: "Walidacja pod-trasy szablonu nie powiodła się",
      description: "Sprawdź dane swojej pod-trasy i spróbuj ponownie",
    },
    unauthorized: {
      title: "Dostęp do pod-trasy szablonu zabroniony",
      description: "Nie masz uprawnień do dostępu do pod-trasy szablonu",
    },
    server: {
      title: "Błąd serwera pod-trasy szablonu",
      description:
        "Nie można przetworzyć żądania pod-trasy z powodu błędu serwera",
    },
    unknown: {
      title: "Pod-trasa szablonu nie powiodła się",
      description:
        "Wystąpił nieoczekiwany błąd podczas przetwarzania żądania pod-trasy",
    },
  },
  success: {
    title: "Operacja pod-trasy pomyślna",
    description: "Operacja pod-trasy została ukończona pomyślnie",
  },
};
