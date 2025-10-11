import type { formTranslations as EnglishFormTranslations } from "../../../../en/sections/businessDataErrors/businessData/form";

export const formTranslations: typeof EnglishFormTranslations = {
  error: {
    validation: {
      title: "Walidacja danych biznesowych nie powiodła się",
      description: "Sprawdź swoje dane biznesowe i spróbuj ponownie",
    },
    unauthorized: {
      title: "Dostęp do danych biznesowych zabroniony",
      description: "Nie masz uprawnień do dostępu do danych biznesowych",
    },
    server: {
      title: "Błąd serwera danych biznesowych",
      description:
        "Nie można załadować danych biznesowych z powodu błędu serwera",
    },
    unknown: {
      title: "Dostęp do danych biznesowych nie powiódł się",
      description:
        "Wystąpił nieoczekiwany błąd podczas dostępu do danych biznesowych",
    },
  },
  success: {
    title: "Dane biznesowe zapisane pomyślnie",
    description: "Twoje informacje biznesowe zostały zaktualizowane",
  },
};
