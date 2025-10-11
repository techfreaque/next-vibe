import type { getTranslations as EnglishGetTranslations } from "../../../../en/sections/templateErrors/template/get";

export const getTranslations: typeof EnglishGetTranslations = {
  error: {
    validation: {
      title: "Walidacja danych szablonu nie powiodła się",
      description: "Nie można zwalidować żądania danych szablonu",
    },
    unauthorized: {
      title: "Dostęp do danych szablonu zabroniony",
      description: "Nie masz uprawnień do dostępu do danych szablonu",
    },
    server: {
      title: "Błąd serwera danych szablonu",
      description: "Nie można załadować danych szablonu z powodu błędu serwera",
    },
    unknown: {
      title: "Dostęp do danych szablonu nie powiódł się",
      description:
        "Wystąpił nieoczekiwany błąd podczas ładowania danych szablonu",
    },
  },
};
