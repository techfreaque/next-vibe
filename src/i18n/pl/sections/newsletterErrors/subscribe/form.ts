import type { formTranslations as EnglishFormTranslations } from "../../../../en/sections/newsletterErrors/subscribe/form";

export const formTranslations: typeof EnglishFormTranslations = {
  error: {
    validation: {
      title: "Walidacja subskrypcji newslettera nie powiodła się",
      description: "Sprawdź swój adres e-mail i spróbuj ponownie",
    },
    unauthorized: {
      title: "Subskrypcja newslettera nieautoryzowana",
      description: "Nie masz uprawnień do subskrypcji newslettera",
    },
    server: {
      title: "Błąd serwera subskrypcji newslettera",
      description: "Nie można subskrybować newslettera z powodu błędu serwera",
    },
    unknown: {
      title: "Subskrypcja newslettera nie powiodła się",
      description:
        "Wystąpił nieoczekiwany błąd podczas subskrypcji newslettera",
    },
  },
  success: {
    title: "Subskrypcja newslettera pomyślna",
    description: "Zostałeś zapisany do naszego newslettera",
  },
};
