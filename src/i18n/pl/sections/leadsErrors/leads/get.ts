import type { getTranslations as EnglishGetTranslations } from "../../../../en/sections/leadsErrors/leads/get";

export const getTranslations: typeof EnglishGetTranslations = {
  error: {
    validation: {
      title: "Walidacja danych potencjalnych klientów nie powiodła się",
      description: "Nie można zwalidować żądania danych potencjalnych klientów",
    },
    unauthorized: {
      title: "Dostęp do danych potencjalnych klientów odmówiony",
      description:
        "Nie masz uprawnień do dostępu do danych potencjalnych klientów",
    },
    server: {
      title: "Błąd serwera danych potencjalnych klientów",
      description:
        "Nie można załadować danych potencjalnych klientów z powodu błędu serwera",
    },
    unknown: {
      title: "Dostęp do danych potencjalnych klientów nie powiódł się",
      description:
        "Wystąpił nieoczekiwany błąd podczas ładowania danych potencjalnych klientów",
    },
    not_found: {
      title: "Potencjalny klient nie znaleziony",
      description: "Żądany potencjalny klient nie mógł zostać znaleziony",
    },
    forbidden: {
      title: "Dostęp do potencjalnego klienta zabroniony",
      description:
        "Nie masz uprawnień do przeglądania tego potencjalnego klienta",
    },
    network: {
      title: "Błąd sieci",
      description:
        "Nie można załadować danych potencjalnych klientów z powodu błędu sieci",
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
    title: "Dane potencjalnych klientów załadowane",
    description: "Informacje o potencjalnych klientach pobrane pomyślnie",
  },
};
