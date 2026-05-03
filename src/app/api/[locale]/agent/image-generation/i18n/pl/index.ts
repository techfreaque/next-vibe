// eslint-disable-next-line i18next/no-literal-string
export const translations = {
  tags: {
    image: "Obraz",
    generation: "Generowanie",
    ai: "AI",
  },
  post: {
    title: "Generuj obraz",
    dynamicTitle: "Obraz: {{prompt}}",
    description: "Wygeneruj obraz z opisu tekstowego przy użyciu AI",
    form: {
      title: "Generowanie obrazu",
      description: "Wpisz opis, aby wygenerować obraz",
    },
    prompt: {
      label: "Opis",
      description: "Opisz obraz, który chcesz wygenerować",
      placeholder: "Zachód słońca nad górskim jeziorem, fotorealistyczny...",
    },
    model: {
      label: "Model",
      description: "Wybierz model do generowania obrazów",
    },
    approxCost: "~kredyty",
    size: {
      label: "Rozmiar",
      description: "Wybierz wymiary wyjściowego obrazu",
      square1024: "Kwadrat (1024×1024)",
      landscape1792: "Poziomy (1792×1024)",
      portrait1792: "Pionowy (1024×1792)",
    },
    quality: {
      label: "Jakość",
      description: "Wybierz jakość wyjściowego obrazu",
      standard: "Standardowa",
      hd: "HD",
    },
    aspectRatio: {
      label: "Proporcje obrazu",
      description: "Proporcje wyjściowego obrazu",
    },
    inputMediaUrl: {
      label: "URL obrazu referencyjnego",
      description:
        "Obraz źródłowy do generowania obraz-na-obraz. Model użyje go jako punktu wyjścia.",
      placeholder: "https://przyklad.pl/obraz.jpg",
    },
    download: "Pobierz",
    dimensionSeparator: "×",
    backButton: {
      label: "Wstecz",
    },
    submitButton: {
      text: "Generuj obraz",
      label: "Generuj obraz",
      loadingText: "Generowanie...",
    },
    response: {
      imageUrl: "URL wygenerowanego obrazu",
      creditCost: "Użyte kredyty",
      jobId: "ID zadania asynchronicznego",
    },
    errors: {
      validation_failed: {
        title: "Błąd walidacji",
        description: "Sprawdź swój opis i ustawienia",
      },
      network_error: {
        title: "Błąd sieci",
        description: "Nie udało się połączyć z usługą generowania obrazów",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Zaloguj się, aby generować obrazy",
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
        description: "Wystąpił nieoczekiwany błąd podczas generowania obrazu",
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
        description: "Wystąpił konflikt podczas generowania obrazu",
      },
      notAnImageModel:
        "Wybrany model nie obsługuje generowania obrazów. Wybierz model obrazu.",
      notConfigured:
        "{{label}} nie jest skonfigurowany. Dodaj {{envKey}} do pliku .env. Pobierz klucz pod adresem {{url}}",
      insufficientCredits:
        "Niewystarczające kredyty. Saldo: {{balance}}, wymagane: {{minimum}}",
      balanceCheckFailed: "Nie udało się sprawdzić salda kredytów",
      unsupportedSize:
        "Model {{model}} nie obsługuje rozmiaru {{size}}. Obsługiwane rozmiary: {{supported}}",
      unsupportedQuality:
        "Model {{model}} nie obsługuje jakości {{quality}}. Obsługiwane jakości: {{supported}}",
      unsupportedAspectRatio:
        "Model {{model}} nie obsługuje proporcji {{aspectRatio}}. Obsługiwane proporcje: {{supported}}",
      generationFailed: "Generowanie obrazu nie powiodło się",
      providerError: "Błąd dostawcy: {{error}}",
      noImageUrl: "Dostawca nie zwrócił URL obrazu",
      creditsFailed: "Nie udało się odjąć kredytów za generowanie obrazu",
      apiKeyNotConfigured: "Klucz API nie jest skonfigurowany",
      externalServiceError: "Błąd zewnętrznej usługi: {{message}}",
      requestAborted: "Żądanie zostało przerwane",
      requestTimedOut: "Przekroczono czas oczekiwania na generowanie obrazu",
      requestFailed: "Żądanie nie powiodło się: {{message}}",
      pollFailed: "Odpytywanie nie powiodło się ze statusem {{status}}",
    },
    success: {
      title: "Obraz wygenerowany",
      description: "Twój obraz został pomyślnie wygenerowany",
    },
  },
} as const;
