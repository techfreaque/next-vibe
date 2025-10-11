import type { processingTranslations as EnglishProcessingTranslations } from "../../../../en/sections/imapErrors/agent/processing";

export const processingTranslations: typeof EnglishProcessingTranslations = {
  error: {
    unauthorized: {
      title: "Brak autoryzacji",
      description: "Nie masz uprawnień do przetwarzania e-maili przez agenta.",
    },
    validation: {
      title: "Błąd walidacji",
      description: "Podano nieprawidłowe parametry do przetwarzania e-maili.",
    },
    server: {
      title: "Błąd serwera",
      description: "Wystąpił błąd podczas przetwarzania e-maili przez agenta.",
    },
    unknown: {
      title: "Nieznany błąd",
      description: "Wystąpił nieznany błąd podczas przetwarzania e-maili.",
    },
    api_error: {
      title: "Błąd API",
      description: "Żądanie API nie powiodło się: {{error}}",
    },
    api_timeout: {
      title: "Przekroczenie czasu API",
      description: "Żądanie API przekroczyło limit czasu",
    },
    api_key_not_configured: {
      title: "Klucz API nie skonfigurowany",
      description: "Klucz API nie jest prawidłowo skonfigurowany",
    },
    llm_provider_unsupported: {
      title: "Nieobsługiwany dostawca LLM",
      description: "Określony dostawca LLM nie jest obsługiwany",
    },
    template_not_found: {
      title: "Szablon nie znaleziony",
      description: "Żądany szablon promptu nie został znaleziony",
    },
    analysis_failed: {
      title: "Analiza nie powiodła się",
      description: "Analiza e-maila nie mogła zostać ukończona",
    },
    response_generation_failed: {
      title: "Generowanie odpowiedzi nie powiodło się",
      description: "Nie udało się wygenerować odpowiedzi e-mail",
    },
  },
  success: {
    title: "Przetwarzanie rozpoczęte",
    description:
      "Przetwarzanie e-maili przez agenta zostało pomyślnie rozpoczęte.",
    analysis_completed: "Zaawansowana analiza AI zakończona z wysoką pewnością",
    ai_analysis_completed: "Analiza AI zakończona pomyślnie",
  },
};
