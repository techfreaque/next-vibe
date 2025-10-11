import type { formTranslations as EnglishFormTranslations } from "../../../../en/sections/authErrors/loginOptions/form";

export const formTranslations: typeof EnglishFormTranslations = {
  error: {
    validation: {
      title: "Walidacja opcji logowania nie powiodła się",
      description: "Nie można zwalidować żądania opcji logowania",
    },
    unauthorized: {
      title: "Opcje logowania nieautoryzowane",
      description: "Nie masz uprawnień do dostępu do opcji logowania",
    },
    server: {
      title: "Błąd serwera opcji logowania",
      description: "Nie można załadować opcji logowania z powodu błędu serwera",
    },
    unknown: {
      title: "Opcje logowania nie powiodły się",
      description:
        "Wystąpił nieoczekiwany błąd podczas ładowania opcji logowania",
    },
  },
  success: {
    title: "Opcje logowania załadowane",
    description: "Dostępne opcje logowania zostały załadowane",
  },
};
