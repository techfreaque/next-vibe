import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Analizuj insight wydajności",
  description:
    "Dostarcza bardziej szczegółowych informacji o określonym insightu wydajności zestawu insightów, który został wyróżniony w wynikach nagrania trace",
  form: {
    label: "Analizuj insight wydajności",
    description:
      "Pobierz szczegółowe informacje o określonym insightu wydajności",
    fields: {
      insightSetId: {
        label: "ID zestawu insightów",
        description:
          "ID określonego zestawu insightów (używaj tylko ID podanych na liście Dostępne zestawy insightów)",
        placeholder: "Wprowadź ID zestawu insightów",
      },
      insightName: {
        label: "Nazwa insightu",
        description:
          "Nazwa insightu, o którym chcesz uzyskać więcej informacji (np. DocumentLatency lub LCPBreakdown)",
        placeholder: "Wprowadź nazwę insightu",
      },
    },
  },
  response: {
    success: "Insight wydajności przeanalizowany pomyślnie",
    result: "Wynik analizy insightu wydajności",
    error: "Komunikat błędu",
    executionId: "ID wykonania do śledzenia",
  },
  errors: {
    validation: {
      title: "Błąd walidacji",
      description: "Sprawdź wprowadzone dane i spróbuj ponownie",
    },
    network: {
      title: "Błąd sieci",
      description:
        "Wystąpił błąd sieci podczas analizowania insightu wydajności",
    },
    unauthorized: {
      title: "Nieautoryzowany",
      description: "Nie masz uprawnień do analizowania insightów wydajności",
    },
    forbidden: {
      title: "Zabronione",
      description: "Analizowanie insightów wydajności jest zabronione",
    },
    notFound: {
      title: "Nie znaleziono",
      description: "Żądany zasób nie został znaleziony",
    },
    serverError: {
      title: "Błąd serwera",
      description:
        "Wystąpił wewnętrzny błąd serwera podczas analizowania insightu wydajności",
    },
    unknown: {
      title: "Nieznany błąd",
      description:
        "Wystąpił nieznany błąd podczas analizowania insightu wydajności",
    },
    unsavedChanges: {
      title: "Niezapisane zmiany",
      description: "Masz niezapisane zmiany, które mogą zostać utracone",
    },
    conflict: {
      title: "Konflikt",
      description: "Wystąpił konflikt podczas analizowania insightu wydajności",
    },
  },
  success: {
    title: "Insight wydajności przeanalizowany pomyślnie",
    description: "Insight wydajności został pomyślnie przeanalizowany",
  },
};
