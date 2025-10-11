import type { deleteTranslations as EnglishDeleteTranslations } from "../../../../en/sections/subscriptionsErrors/subscriptions/delete";

export const deleteTranslations: typeof EnglishDeleteTranslations = {
  error: {
    validation: {
      title: "Walidacja anulowania subskrypcji nie powiodła się",
      description: "Sprawdź swoje żądanie i spróbuj ponownie",
    },
    unauthorized: {
      title: "Anulowanie subskrypcji nieautoryzowane",
      description: "Nie masz uprawnień do anulowania subskrypcji",
    },
    forbidden: {
      title: "Anulowanie subskrypcji zabronione",
      description: "Nie masz uprawnień do anulowania tej subskrypcji",
    },
    not_found: {
      title: "Subskrypcja nie znaleziona",
      description:
        "Subskrypcja, którą próbujesz anulować, nie mogła zostać znaleziona",
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
    description:
      "Subskrypcja została anulowana i zakończy się na koniec bieżącego okresu",
  },
};
