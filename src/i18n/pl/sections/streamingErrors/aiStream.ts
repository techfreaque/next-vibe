import type { aiStreamTranslations as EnglishAiStreamTranslations } from "../../../en/sections/streamingErrors/aiStream";

export const aiStreamTranslations: typeof EnglishAiStreamTranslations = {
  error: {
    validation: {
      title: "Błąd walidacji AI Stream",
      description: "Sprawdź parametry wejściowe i spróbuj ponownie",
    },
    network: {
      title: "Błąd sieci AI Stream",
      description: "Nie udało się połączyć z usługą streamingu AI",
    },
    unauthorized: {
      title: "AI Stream nieautoryzowany",
      description: "Nie masz uprawnień do dostępu do streamingu AI",
    },
    server: {
      title: "Błąd serwera AI Stream",
      description:
        "Wystąpił błąd podczas przetwarzania zapytania o streaming AI",
    },
    unknown: {
      title: "Nieznany błąd AI Stream",
      description: "Wystąpił nieoczekiwany błąd podczas streamingu AI",
    },
    apiKey: {
      missing: "Klucz API OpenAI nie jest skonfigurowany",
      invalid: "Klucz API OpenAI jest nieprawidłowy lub wygasł",
    },
    configuration: "Usługa streamingu AI nie jest prawidłowo skonfigurowana",
    processing: "Nie udało się przetworzyć zapytania o streaming AI",
  },
  success: {
    title: "Sukces AI Stream",
    description: "Streaming AI zakończony pomyślnie",
  },
};
