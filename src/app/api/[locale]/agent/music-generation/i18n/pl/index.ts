// eslint-disable-next-line i18next/no-literal-string
export const translations = {
  tags: {
    music: "Muzyka",
    generation: "Generowanie",
    ai: "AI",
  },
  post: {
    title: "Generuj muzykę",
    dynamicTitle: "Muzyka: {{prompt}}",
    description: "Wygeneruj muzykę z opisu tekstowego przy użyciu AI",
    form: {
      title: "Generowanie muzyki",
      description: "Wpisz opis, aby wygenerować muzykę",
    },
    prompt: {
      label: "Opis",
      description: "Opisz muzykę, którą chcesz wygenerować",
      placeholder: "Energetyczna muzyka elektroniczna z chwytliwą melodią...",
    },
    model: {
      label: "Model",
      description: "Wybierz model do generowania muzyki",
    },
    duration: {
      label: "Czas trwania",
      description: "Długość wygenerowanego klipu audio",
      short: "Krótki (~8 sek.)",
      medium: "Średni (~20 sek.)",
      long: "Długi (~30 sek.)",
    },
    inputMediaUrl: {
      label: "URL referencyjnego audio",
      description:
        "Audio źródłowe do transferu stylu lub remiksu. Model użyje go jako punktu wyjścia.",
      placeholder: "https://przyklad.pl/audio.mp3",
    },
    download: "Pobierz",
    separator: "·",
    backButton: {
      label: "Wstecz",
    },
    submitButton: {
      text: "Generuj muzykę",
      label: "Generuj muzykę",
      loadingText: "Generowanie...",
    },
    response: {
      audioUrl: "URL wygenerowanego audio",
      creditCost: "Użyte kredyty",
      durationSeconds: "Czas trwania w sekundach",
      jobId: "ID zadania asynchronicznego",
    },
    errors: {
      validation_failed: {
        title: "Błąd walidacji",
        description: "Sprawdź swój opis i ustawienia",
      },
      network_error: {
        title: "Błąd sieci",
        description: "Nie udało się połączyć z usługą generowania muzyki",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Zaloguj się, aby generować muzykę",
      },
      forbidden: {
        title: "Zabronione",
        description: "Nie masz uprawnień do korzystania z tej funkcji",
      },
      not_found: {
        title: "Nie znaleziono",
        description: "Wybrany model nie został znaleziony",
      },
      server_error: {
        title: "Błąd serwera",
        description: "Wystąpił nieoczekiwany błąd podczas generowania muzyki",
      },
      unknown_error: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd",
      },
      unsaved_changes: {
        title: "Niezapisane zmiany",
        description: "Zapisz zmiany przed generowaniem",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt podczas generowania muzyki",
      },
      notAnAudioModel:
        "Wybrany model nie obsługuje generowania muzyki. Wybierz model muzyczny.",
      notConfigured:
        "{{label}} nie jest skonfigurowany. Dodaj {{envKey}} do pliku .env. Pobierz klucz pod adresem {{url}}",
      insufficientCredits:
        "Niewystarczające kredyty. Saldo: {{balance}}, wymagane: {{minimum}}",
      balanceCheckFailed: "Nie udało się sprawdzić salda kredytów",
      unsupportedDuration:
        "Model {{model}} nie obsługuje czasu trwania {{duration}}. Obsługiwane czasy: {{supported}}",
      generationFailed: "Generowanie muzyki nie powiodło się",
      providerError: "Błąd dostawcy: {{error}}",
      noAudioUrl: "Dostawca nie zwrócił URL audio",
      creditsFailed: "Nie udało się odjąć kredytów za generowanie muzyki",
      apiKeyNotConfigured: "Klucz API nie jest skonfigurowany",
      externalServiceError: "Błąd zewnętrznej usługi: {{message}}",
      requestAborted: "Żądanie zostało przerwane",
      requestTimedOut: "Przekroczono czas oczekiwania na generowanie muzyki",
      requestFailed: "Żądanie nie powiodło się: {{message}}",
      pollFailed: "Odpytywanie nie powiodło się ze statusem {{status}}",
    },
    success: {
      title: "Muzyka wygenerowana",
      description: "Twoja muzyka została pomyślnie wygenerowana",
    },
  },
} as const;
