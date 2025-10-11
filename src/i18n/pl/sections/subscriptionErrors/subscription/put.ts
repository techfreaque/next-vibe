import type { putTranslations as EnglishPutTranslations } from "../../../../en/sections/subscriptionErrors/subscription/put";

export const putTranslations: typeof EnglishPutTranslations = {
  error: {
    validation: {
      title: "Walidacja aktualizacji subskrypcji nie powiodła się",
      description: "Sprawdź aktualizacje swojej subskrypcji i spróbuj ponownie",
    },
    unauthorized: {
      title: "Aktualizacja subskrypcji nieautoryzowana",
      description: "Nie masz uprawnień do aktualizacji subskrypcji",
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
    description: "Twój plan subskrypcji został zmieniony",
  },
};
