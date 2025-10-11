import type { formTranslations as EnglishFormTranslations } from "../../../../en/sections/templateErrors/templateApi/form";

export const formTranslations: typeof EnglishFormTranslations = {
  error: {
    validation: {
      title: "Walidacja API szablonu nie powiodła się",
      description: "Sprawdź dane swojego szablonu i spróbuj ponownie",
    },
    unauthorized: {
      title: "Dostęp do API szablonu zabroniony",
      description: "Nie masz uprawnień do dostępu do API szablonu",
    },
    server: {
      title: "Błąd serwera API szablonu",
      description:
        "Nie można przetworzyć żądania szablonu z powodu błędu serwera",
    },
    unknown: {
      title: "API szablonu nie powiodło się",
      description:
        "Wystąpił nieoczekiwany błąd podczas przetwarzania żądania szablonu",
    },
  },
  success: {
    title: "Operacja API szablonu pomyślna",
    description: "Operacja API szablonu została ukończona pomyślnie",
  },
};
