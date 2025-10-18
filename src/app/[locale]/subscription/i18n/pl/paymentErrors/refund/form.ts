import type { translations as EnglishFormTranslations } from "../../../en/paymentErrors/refund/form";

export const translations: typeof EnglishFormTranslations = {
  error: {
    validation: {
      title: "Walidacja zwrotu nie powiodła się",
      description: "Sprawdź swoje żądanie zwrotu i spróbuj ponownie",
    },
    unauthorized: {
      title: "Zwrot nieautoryzowany",
      description: "Nie masz uprawnień do żądania tego zwrotu",
    },
    server: {
      title: "Błąd serwera zwrotu",
      description: "Nie można przetworzyć zwrotu z powodu błędu serwera",
    },
    unknown: {
      title: "Zwrot nie powiódł się",
      description: "Wystąpił nieoczekiwany błąd podczas przetwarzania zwrotu",
    },
  },
  success: {
    title: "Zwrot przetworzony pomyślnie",
    description: "Twój zwrot został zainicjowany",
  },
};
