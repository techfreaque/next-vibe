import type { formTranslations as EnglishFormTranslations } from "../../../../en/sections/consultationErrors/availability/form";

export const formTranslations: typeof EnglishFormTranslations = {
  error: {
    validation: {
      title: "Walidacja dostępności nie powiodła się",
      description: "Nie można zwalidować żądania dostępności",
    },
    unauthorized: {
      title: "Dostępność nieautoryzowana",
      description: "Nie masz uprawnień do sprawdzania dostępności",
    },
    server: {
      title: "Błąd serwera dostępności",
      description: "Nie można sprawdzić dostępności z powodu błędu serwera",
    },
    unknown: {
      title: "Sprawdzanie dostępności nie powiodło się",
      description:
        "Wystąpił nieoczekiwany błąd podczas sprawdzania dostępności",
    },
  },
  success: {
    title: "Dostępność załadowana pomyślnie",
    description: "Dostępne terminy konsultacji zostały pobrane",
  },
};
