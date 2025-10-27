import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  apiUtils: {
    errors: {
      http_error: "Błąd HTTP",
      validation_error: "Błąd walidacji",
      internal_error: "Błąd wewnętrzny",
      auth_required: "Wymagana autoryzacja",
    },
  },
  mutationForm: {
    post: {
      errors: {
        mutation_failed: {
          title: "Mutacja nie powiodła się",
        },
        validation_error: {
          title: "Błąd walidacji",
        },
      },
    },
  },
  queryForm: {
    errors: {
      network_failure: "Błąd sieci",
      validation_failed: "Walidacja nie powiodła się",
    },
  },
  store: {
    errors: {
      validation_failed: "Walidacja nie powiodła się",
      request_failed: "Żądanie nie powiodło się",
      mutation_failed: "Mutacja nie powiodła się",
      unexpected_failure: "Nieoczekiwany błąd",
      refetch_failed: "Ponowne pobieranie nie powiodło się",
    },
    status: {
      loading_data: "Ładowanie danych...",
      cached_data: "Używanie danych z pamięci podręcznej",
      success: "Sukces",
      mutation_pending: "Mutacja w toku...",
      mutation_success: "Mutacja zakończona sukcesem",
    },
  },
};
