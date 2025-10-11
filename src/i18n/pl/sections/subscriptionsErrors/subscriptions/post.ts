import type { postTranslations as EnglishPostTranslations } from "../../../../en/sections/subscriptionsErrors/subscriptions/post";

export const postTranslations: typeof EnglishPostTranslations = {
  error: {
    validation: {
      title: "Walidacja tworzenia subskrypcji nie powiodła się",
      description: "Sprawdź informacje o subskrypcji i spróbuj ponownie",
    },
    unauthorized: {
      title: "Tworzenie subskrypcji nieautoryzowane",
      description: "Nie masz uprawnień do tworzenia subskrypcji",
    },
    forbidden: {
      title: "Tworzenie subskrypcji zabronione",
      description: "Nie masz uprawnień do tworzenia subskrypcji",
    },
    duplicate: {
      title: "Subskrypcja już istnieje",
      description: "Subskrypcja dla tego użytkownika już istnieje",
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
    description: "Nowa subskrypcja została utworzona i aktywowana",
  },
};
