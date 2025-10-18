import type { translations as EnglishFormTranslations } from "../../../en/paymentErrors/payment/form";

export const translations: typeof EnglishFormTranslations = {
  error: {
    validation: {
      title: "Walidacja płatności nie powiodła się",
      description: "Sprawdź swoje informacje płatnicze i spróbuj ponownie",
    },
    unauthorized: {
      title: "Płatność nieautoryzowana",
      description: "Nie masz uprawnień do przetworzenia tej płatności",
    },
    server: {
      title: "Błąd serwera płatności",
      description: "Nie można przetworzyć płatności z powodu błędu serwera",
    },
    unknown: {
      title: "Płatność nie powiodła się",
      description:
        "Wystąpił nieoczekiwany błąd podczas przetwarzania płatności",
    },
  },
  success: {
    title: "Płatność przetworzona pomyślnie",
    description: "Twoja płatność została zakończona",
  },
};
