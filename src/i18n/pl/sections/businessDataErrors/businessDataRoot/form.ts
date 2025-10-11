import type { formTranslations as EnglishFormTranslations } from "../../../../en/sections/businessDataErrors/businessDataRoot/form";

export const formTranslations: typeof EnglishFormTranslations = {
  error: {
    validation: {
      title: "Walidacja głównych danych biznesowych nie powiodła się",
      description: "Nie można zwalidować żądania głównych danych biznesowych",
    },
    unauthorized: {
      title: "Główne dane biznesowe nieautoryzowane",
      description:
        "Nie masz uprawnień do dostępu do głównych danych biznesowych",
    },
    server: {
      title: "Błąd serwera głównych danych biznesowych",
      description:
        "Nie można uzyskać dostępu do głównych danych biznesowych z powodu błędu serwera",
    },
    unknown: {
      title: "Główne dane biznesowe nie powiodły się",
      description:
        "Wystąpił nieoczekiwany błąd podczas dostępu do głównych danych biznesowych",
    },
  },
  success: {
    title: "Dostęp do głównych danych biznesowych pomyślny",
    description: "Informacje głównych danych biznesowych zostały załadowane",
  },
};
