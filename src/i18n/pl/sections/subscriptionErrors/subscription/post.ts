import type { postTranslations as EnglishPostTranslations } from "../../../../en/sections/subscriptionErrors/subscription/post";

export const postTranslations: typeof EnglishPostTranslations = {
  error: {
    validation: {
      title: "Walidacja tworzenia subskrypcji nie powiodła się",
      description: "Sprawdź informacje o swojej subskrypcji i spróbuj ponownie",
    },
    unauthorized: {
      title: "Tworzenie subskrypcji nieautoryzowane",
      description: "Nie masz uprawnień do tworzenia subskrypcji",
    },
    server: {
      title: "Błąd serwera tworzenia subskrypcji",
      description: "Nie można utworzyć subskrypcji z powodu błędu serwera",
    },
    unknown: {
      title: "Tworzenie subskrypcji nie powiodło się",
      description: "Wystąpił nieoczekiwany błąd podczas tworzenia subskrypcji",
    },
  },
  success: {
    title: "Subskrypcja utworzona pomyślnie",
    description: "Twoja subskrypcja została aktywowana",
  },
};
