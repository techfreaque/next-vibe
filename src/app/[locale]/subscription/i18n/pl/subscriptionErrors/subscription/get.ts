import type { translations as EnglishGetTranslations } from "../../../en/subscriptionErrors/subscription/get";

export const translations: typeof EnglishGetTranslations = {
  error: {
    validation: {
      title: "Walidacja danych subskrypcji nie powiodła się",
      description: "Nie można zwalidować żądania danych subskrypcji",
    },
    unauthorized: {
      title: "Dostęp do danych subskrypcji zabroniony",
      description: "Nie masz uprawnień do dostępu do danych subskrypcji",
    },
    server: {
      title: "Błąd serwera danych subskrypcji",
      description:
        "Nie można załadować danych subskrypcji z powodu błędu serwera",
    },
    unknown: {
      title: "Dostęp do danych subskrypcji nie powiódł się",
      description:
        "Wystąpił nieoczekiwany błąd podczas ładowania danych subskrypcji",
    },
  },
  success: {
    title: "Dane subskrypcji pobrane pomyślnie",
    description: "Informacje o Twojej subskrypcji zostały załadowane",
  },
};
