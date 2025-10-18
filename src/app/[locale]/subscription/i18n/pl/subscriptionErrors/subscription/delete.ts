import type { translations as EnglishDeleteTranslations } from "../../../en/subscriptionErrors/subscription/delete";

export const translations: typeof EnglishDeleteTranslations = {
  error: {
    validation: {
      title: "Walidacja anulowania subskrypcji nie powiodła się",
      description: "Sprawdź swoje żądanie anulowania i spróbuj ponownie",
    },
    unauthorized: {
      title: "Anulowanie subskrypcji nieautoryzowane",
      description: "Nie masz uprawnień do anulowania subskrypcji",
    },
    server: {
      title: "Błąd serwera anulowania subskrypcji",
      description: "Nie można anulować subskrypcji z powodu błędu serwera",
    },
    unknown: {
      title: "Anulowanie subskrypcji nie powiodło się",
      description: "Wystąpił nieoczekiwany błąd podczas anulowania subskrypcji",
    },
  },
  success: {
    title: "Subskrypcja anulowana pomyślnie",
    description: "Twoja subskrypcja została anulowana",
  },
};
