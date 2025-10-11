import type { apiTranslations as EnglishApiTranslations } from "../../../en/sections/error/api";

export const apiTranslations: typeof EnglishApiTranslations = {
  store: {
    errors: {
      validation_failed: "Walidacja nie powiodła się dla operacji magazynu",
      request_failed: "Żądanie magazynu nie powiodło się: {{error}}",
      mutation_failed: "Mutacja magazynu nie powiodła się: {{error}}",
      unexpected_failure: "Nieoczekiwana awaria magazynu: {{error}}",
      refetch_failed: "Nie udało się odświeżyć danych magazynu: {{error}}",
    },
    status: {
      loading_data: "Ładowanie danych...",
      cached_data: "Wyświetlanie danych z pamięci podręcznej",
      success: "Gotowe",
      disabled: "Zapytanie wyłączone",
      mutation_pending: "Zapisywanie...",
      mutation_success: "Zapisano pomyślnie",
    },
  },
  query: {
    errors: {
      refetch_failed: "Nie udało się odświeżyć danych zapytania: {{error}}",
    },
  },
  mutation: {
    errors: {
      execution_failed: "Nie udało się wykonać mutacji: {{error}}",
    },
  },
  form: {
    errors: {
      validation_failed: "Walidacja formularza nie powiodła się: {{message}}",
      network_failure: "Błąd sieci podczas przesyłania formularza: {{error}}",
    },
  },
  errors: {
    too_many_requests: "Zbyt wiele żądań. Spróbuj ponownie później.",
    invalid_request_data: "Nieprawidłowe dane żądania: {{message}}",
    internal_server_error: "Wewnętrzny błąd serwera: {{error}}",
    http_error: "Błąd HTTP: {{error}}",
  },
};
