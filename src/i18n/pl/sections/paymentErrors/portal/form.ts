import type { formTranslations as EnglishFormTranslations } from "../../../../en/sections/paymentErrors/portal/form";

export const formTranslations: typeof EnglishFormTranslations = {
  error: {
    validation: {
      title: "Walidacja portalu nie powiodła się",
      description: "Nie można zwalidować żądania dostępu do portalu",
    },
    unauthorized: {
      title: "Dostęp do portalu nieautoryzowany",
      description: "Nie masz uprawnień do dostępu do portalu płatności",
    },
    server: {
      title: "Błąd serwera portalu",
      description:
        "Nie można uzyskać dostępu do portalu płatności z powodu błędu serwera",
    },
    unknown: {
      title: "Dostęp do portalu nie powiódł się",
      description:
        "Wystąpił nieoczekiwany błąd podczas dostępu do portalu płatności",
    },
  },
  success: {
    title: "Dostęp do portalu pomyślny",
    description: "Portal płatności został otwarty",
  },
};
