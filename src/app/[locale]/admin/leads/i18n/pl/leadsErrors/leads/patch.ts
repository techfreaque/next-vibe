import type { translations as EnglishPatchTranslations } from "../../../en/leadsErrors/leads/patch";

export const translations: typeof EnglishPatchTranslations = {
  error: {
    validation: {
      title: "Walidacja aktualizacji potencjalnego klienta nie powiodła się",
      description:
        "Sprawdź swoje aktualizacje potencjalnych klientów i spróbuj ponownie",
    },
    unauthorized: {
      title: "Aktualizacja potencjalnego klienta nieautoryzowana",
      description: "Nie masz uprawnień do aktualizacji potencjalnych klientów",
    },
    server: {
      title: "Błąd serwera aktualizacji potencjalnego klienta",
      description:
        "Nie można zaktualizować potencjalnego klienta z powodu błędu serwera",
    },
    unknown: {
      title: "Aktualizacja potencjalnego klienta nie powiodła się",
      description:
        "Wystąpił nieoczekiwany błąd podczas aktualizacji potencjalnego klienta",
    },
    not_found: {
      title: "Potencjalny klient nie znaleziony",
      description: "Nie można znaleźć potencjalnego klienta do aktualizacji",
    },
    forbidden: {
      title: "Aktualizacja potencjalnego klienta zabroniona",
      description:
        "Nie masz uprawnień do aktualizacji tego potencjalnego klienta",
    },
    network: {
      title: "Błąd sieci",
      description:
        "Nie można zaktualizować potencjalnego klienta z powodu błędu sieci",
    },
    unsaved_changes: {
      title: "Niezapisane zmiany",
      description: "Masz niezapisane zmiany, które zostaną utracone",
    },
    conflict: {
      title: "Konflikt danych",
      description:
        "Dane potencjalnego klienta zostały zmodyfikowane przez innego użytkownika",
    },
  },
  success: {
    title: "Potencjalny klient zaktualizowany",
    description: "Informacje o potencjalnym kliencie zaktualizowane pomyślnie",
  },
};
