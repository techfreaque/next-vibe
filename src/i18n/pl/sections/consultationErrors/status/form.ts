import type { formTranslations as EnglishFormTranslations } from "../../../../en/sections/consultationErrors/status/form";

export const formTranslations: typeof EnglishFormTranslations = {
  error: {
    validation: {
      title: "Walidacja statusu nie powiodła się",
      description: "Nie można zwalidować żądania statusu",
    },
    unauthorized: {
      title: "Status nieautoryzowany",
      description: "Nie masz uprawnień do sprawdzania statusu konsultacji",
    },
    server: {
      title: "Błąd serwera statusu",
      description: "Nie można sprawdzić statusu z powodu błędu serwera",
    },
    unknown: {
      title: "Sprawdzanie statusu nie powiodło się",
      description: "Wystąpił nieoczekiwany błąd podczas sprawdzania statusu",
    },
  },
  success: {
    title: "Status pobrany pomyślnie",
    description: "Status konsultacji został załadowany",
  },
};
