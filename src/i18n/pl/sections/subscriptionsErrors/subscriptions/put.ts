import type { putTranslations as EnglishPutTranslations } from "../../../../en/sections/subscriptionsErrors/subscriptions/put";

export const putTranslations: typeof EnglishPutTranslations = {
  error: {
    validation: {
      title: "Walidacja aktualizacji subskrypcji nie powiodła się",
      description: "Sprawdź informacje o subskrypcji i spróbuj ponownie",
    },
    unauthorized: {
      title: "Aktualizacja subskrypcji nieautoryzowana",
      description: "Nie masz uprawnień do aktualizacji subskrypcji",
    },
    forbidden: {
      title: "Aktualizacja subskrypcji zabroniona",
      description: "Nie masz uprawnień do aktualizacji tej subskrypcji",
    },
    not_found: {
      title: "Subskrypcja nie znaleziona",
      description:
        "Subskrypcja, którą próbujesz zaktualizować, nie mogła zostać znaleziona",
    },
    server: {
      title: "Błąd serwera aktualizacji subskrypcji",
      description: "Nie można zaktualizować subskrypcji z powodu błędu serwera",
    },
    unknown: {
      title: "Aktualizacja subskrypcji nie powiodła się",
      description:
        "Wystąpił nieoczekiwany błąd podczas aktualizacji subskrypcji",
    },
  },
  success: {
    title: "Subskrypcja zaktualizowana pomyślnie",
    description: "Informacje o subskrypcji zostały pomyślnie zaktualizowane",
  },
};
