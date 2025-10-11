import type { formTranslations as EnglishFormTranslations } from "../../../../en/sections/newsletterErrors/unsubscribe/form";

export const formTranslations: typeof EnglishFormTranslations = {
  error: {
    validation: {
      title: "Walidacja wypisania z newslettera nie powiodła się",
      description: "Nie można zwalidować żądania wypisania",
    },
    unauthorized: {
      title: "Wypisanie z newslettera nieautoryzowane",
      description: "Nie masz uprawnień do wypisania się z newslettera",
    },
    server: {
      title: "Błąd serwera wypisania z newslettera",
      description: "Nie można wypisać się z newslettera z powodu błędu serwera",
    },
    unknown: {
      title: "Wypisanie z newslettera nie powiodło się",
      description:
        "Wystąpił nieoczekiwany błąd podczas wypisywania się z newslettera",
    },
  },
  success: {
    title: "Wypisanie z newslettera pomyślne",
    description: "Zostałeś wypisany z naszego newslettera",
  },
};
