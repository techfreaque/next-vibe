import type { translations as EnglishFormTranslations } from "../../../en/subscriptionErrors/subscription/form";

export const translations: typeof EnglishFormTranslations = {
  error: {
    validation: {
      title: "Walidacja subskrypcji nie powiodła się",
      description: "Sprawdź szczegóły swojej subskrypcji i spróbuj ponownie",
    },
    unauthorized: {
      title: "Subskrypcja nieautoryzowana",
      description: "Nie masz uprawnień do zarządzania tą subskrypcją",
    },
    server: {
      title: "Błąd serwera subskrypcji",
      description: "Nie można zarządzać subskrypcją z powodu błędu serwera",
    },
    unknown: {
      title: "Subskrypcja nie powiodła się",
      description:
        "Wystąpił nieoczekiwany błąd podczas zarządzania subskrypcją",
    },
  },
  success: {
    title: "Subskrypcja zarządzana pomyślnie",
    description: "Ustawienia Twojej subskrypcji zostały zaktualizowane",
  },
};
