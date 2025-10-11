import type { statsTranslations as EnglishStatsTranslations } from "../../../../en/sections/leadsErrors/campaigns/stats";

export const statsTranslations: typeof EnglishStatsTranslations = {
  error: {
    validation: {
      title: "Walidacja statystyk kampanii nie powiodła się",
      description: "Sprawdź parametry statystyk i spróbuj ponownie",
    },
    unauthorized: {
      title: "Dostęp do statystyk kampanii odmówiony",
      description: "Nie masz uprawnień do przeglądania statystyk kampanii",
    },
    server: {
      title: "Błąd serwera statystyk kampanii",
      description: "Nie można pobrać statystyk z powodu błędu serwera",
    },
    unknown: {
      title: "Operacja statystyk kampanii nie powiodła się",
      description: "Wystąpił nieoczekiwany błąd podczas pobierania statystyk",
    },
    forbidden: {
      title: "Dostęp do statystyk kampanii zabroniony",
      description: "Nie masz uprawnień do przeglądania statystyk kampanii",
    },
    notFound: {
      title: "Statystyki kampanii nie znalezione",
      description: "Żądane statystyki kampanii nie zostały znalezione",
    },
  },
  success: {
    title: "Statystyki kampanii załadowane",
    description: "Statystyki kampanii zostały pomyślnie pobrane",
  },
};
