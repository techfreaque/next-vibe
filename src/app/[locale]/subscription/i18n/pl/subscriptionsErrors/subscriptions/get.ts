import type { translations as EnglishGetTranslations } from "../../../en/subscriptionsErrors/subscriptions/get";

export const translations: typeof EnglishGetTranslations = {
  error: {
    validation: {
      title: "Walidacja pobierania subskrypcji nie powiodła się",
      description: "Sprawdź parametry żądania i spróbuj ponownie",
    },
    unauthorized: {
      title: "Pobieranie subskrypcji nieautoryzowane",
      description: "Nie masz uprawnień do dostępu do danych subskrypcji",
    },
    forbidden: {
      title: "Dostęp do subskrypcji zabroniony",
      description: "Nie masz uprawnień do dostępu do tej subskrypcji",
    },
    not_found: {
      title: "Subskrypcja nie znaleziona",
      description: "Żądana subskrypcja nie mogła zostać znaleziona",
    },
    server: {
      title: "Błąd serwera pobierania subskrypcji",
      description: "Nie można pobrać subskrypcji z powodu błędu serwera",
    },
    unknown: {
      title: "Pobieranie subskrypcji nie powiodło się",
      description: "Wystąpił nieoczekiwany błąd podczas pobierania subskrypcji",
    },
  },
  success: {
    title: "Subskrypcje pobrane pomyślnie",
    description: "Dane subskrypcji zostały załadowane pomyślnie",
  },
};
