import type { formTranslations as EnglishFormTranslations } from "../../../../en/sections/newsletterErrors/status/form";

export const formTranslations: typeof EnglishFormTranslations = {
  error: {
    validation: {
      title: "Walidacja statusu newslettera nie powiodła się",
      description: "Nie można zwalidować żądania statusu",
    },
    unauthorized: {
      title: "Status newslettera nieautoryzowany",
      description: "Nie masz uprawnień do sprawdzania statusu newslettera",
    },
    server: {
      title: "Błąd serwera statusu newslettera",
      description:
        "Nie można sprawdzić statusu newslettera z powodu błędu serwera",
    },
    unknown: {
      title: "Status newslettera nie powiódł się",
      description:
        "Wystąpił nieoczekiwany błąd podczas sprawdzania statusu newslettera",
    },
  },
  success: {
    title: "Status newslettera pobrany pomyślnie",
    description: "Status Twojej subskrypcji newslettera został załadowany",
  },
};
