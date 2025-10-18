import type { translations as EnglishGetTranslations } from "../../../en/leadsErrors/leadsTracking/get";

export const translations: typeof EnglishGetTranslations = {
  error: {
    validation: {
      title: "Walidacja śledzenia leadów nie powiodła się",
      description: "Sprawdź parametry śledzenia i spróbuj ponownie",
    },
    unauthorized: {
      title: "Śledzenie leadów nieautoryzowane",
      description: "Nie masz uprawnień do dostępu do śledzenia leadów",
    },
    server: {
      title: "Błąd serwera śledzenia leadów",
      description: "Nie można przetworzyć śledzenia z powodu błędu serwera",
    },
    unknown: {
      title: "Śledzenie leadów nie powiodło się",
      description: "Wystąpił nieoczekiwany błąd podczas śledzenia leadów",
    },
    forbidden: {
      title: "Dostęp do śledzenia leadów zabroniony",
      description: "Nie masz uprawnień do dostępu do śledzenia leadów",
    },
    not_found: {
      title: "Lead nie znaleziony",
      description: "Żądany lead nie mógł zostać znaleziony do śledzenia",
    },
  },
  success: {
    title: "Śledzenie leadów pomyślne",
    description: "Śledzenie leadów zostało pomyślnie zarejestrowane",
  },
};
