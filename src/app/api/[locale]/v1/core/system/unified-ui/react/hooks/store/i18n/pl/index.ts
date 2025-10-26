import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  post: {
    title: "Tytuł",
    description: "Opis endpointu",
    form: {
      title: "Konfiguracja",
      description: "Skonfiguruj parametry",
    },
    response: {
      title: "Odpowiedź",
      description: "Dane odpowiedzi",
    },
    errors: {
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagana autoryzacja",
      },
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry żądania",
      },
      server: {
        title: "Błąd serwera",
        description: "Wystąpił wewnętrzny błąd serwera",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd",
      },
      network: {
        title: "Błąd sieci",
        description: "Wystąpił błąd sieci",
      },
      forbidden: {
        title: "Zabronione",
        description: "Dostęp zabroniony",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Zasób nie został znaleziony",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt danych",
      },
    },
    success: {
      title: "Sukces",
      description: "Operacja zakończona pomyślnie",
    },
  },
  errors: {
    validation_failed: "Walidacja nie powiodła się",
    request_failed: "Żądanie nie powiodło się",
    mutation_failed: "Mutacja nie powiodła się",
    unexpected_failure: "Wystąpił nieoczekiwany błąd",
    refetch_failed: "Nie udało się ponownie pobrać danych",
  },
  status: {
    loading_data: "Ładowanie danych...",
    cached_data: "Używanie danych z pamięci podręcznej",
    success: "Sukces",
    mutation_pending: "Mutacja w toku...",
    mutation_success: "Mutacja zakończona pomyślnie",
  },
};
