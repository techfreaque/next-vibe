import type { formTranslations as EnglishFormTranslations } from "../../../../en/sections/subscriptionErrors/checkout/form";

export const formTranslations: typeof EnglishFormTranslations = {
  error: {
    validation: {
      title: "Walidacja płatności nie powiodła się",
      description: "Sprawdź informacje o płatności i spróbuj ponownie",
    },
    unauthorized: {
      title: "Płatność nieautoryzowana",
      description: "Nie masz uprawnień do ukończenia tej płatności",
    },
    server: {
      title: "Błąd serwera płatności",
      description: "Nie można ukończyć płatności z powodu błędu serwera",
    },
    unknown: {
      title: "Płatność nie powiodła się",
      description: "Wystąpił nieoczekiwany błąd podczas płatności",
    },
  },
  success: {
    title: "Płatność ukończona pomyślnie",
    description: "Płatność za Twoją subskrypcję została przetworzona",
  },
};
