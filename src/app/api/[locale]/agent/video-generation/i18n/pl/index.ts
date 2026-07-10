import type { translations as enTranslations } from "../en";
export const translations: typeof enTranslations = {
  tags: {
    video: "Wideo",
    generation: "Generowanie",
    ai: "AI",
  },
  post: {
    title: "Generuj wideo",
    titleShort: "Generuj wideo",
    dynamicTitle: "Wideo: {{prompt}}",
    description: "Wygeneruj wideo z opisu tekstowego przy użyciu AI",
    form: {
      title: "Generowanie wideo",
      description: "Wpisz opis, aby wygenerować wideo",
    },
    prompt: {
      label: "Opis",
      description: "Opisz wideo, które chcesz wygenerować",
      placeholder:
        "Kinematograficzne ujęcie górskiego jeziora o zachodzie słońca...",
    },
    model: {
      label: "Model",
      description:
        "Model generowania wideo. Pozostaw puste, by użyć domyślnego modelu użytkownika.",
    },
    duration: {
      label: "Czas trwania",
      description: "Długość wygenerowanego klipu wideo",
      short: "Krótki (~5 sek.)",
      medium: "Średni (~10 sek.)",
      long: "Długi (~15 sek.)",
    },
    aspectRatio: {
      label: "Proporcje obrazu",
      description: "Proporcje wyjściowego wideo",
    },
    resolution: {
      label: "Rozdzielczość",
      description: "Rozdzielczość wyjściowego wideo",
    },
    firstFrameUrl: {
      label: "URL pierwszej klatki",
      description:
        "Obraz dla pierwszej klatki. Model animuje do przodu od tego obrazu.",
      placeholder: "https://przyklad.pl/pierwsza-klatka.jpg",
    },
    lastFrameUrl: {
      label: "URL ostatniej klatki",
      description:
        "Obraz dla ostatniej klatki. Model animuje wstecz do tego obrazu.",
      placeholder: "https://przyklad.pl/ostatnia-klatka.jpg",
    },
    negativePrompt: {
      label: "Prompt negatywny",
      description: "Opisz, czego nie chcesz w filmie.",
      placeholder: "rozmazane, niska jakość, zniekształcone...",
    },
    cfgScale: {
      label: "Skala CFG",
      description:
        "Jak ściśle model stosuje się do promptu (0–30). Wyżej = dosłowniej.",
    },

    download: "Pobierz",
    generatingNote: "Generowanie wideo może zająć 1–3 minuty",
    backButton: {
      label: "Wstecz",
    },
    submitButton: {
      text: "Generuj wideo",
      label: "Generuj wideo",
      loadingText: "Generowanie...",
    },
    response: {
      videoUrl: "URL wygenerowanego wideo",
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
        description: "Nie udało się połączyć z usługą generowania wideo",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Zaloguj się, aby generować wideo",
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
        description: "Wystąpił nieoczekiwany błąd podczas generowania wideo",
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
        description: "Wystąpił konflikt podczas generowania wideo",
      },
      notAVideoModel:
        "Wybrany model nie obsługuje generowania wideo. Wybierz model wideo.",
      notConfigured:
        "{{label}} nie jest skonfigurowany. Dodaj {{envKey}} do pliku .env. Pobierz klucz pod adresem {{url}}",
      insufficientCredits:
        "Niewystarczające kredyty. Saldo: {{balance}}, wymagane: {{minimum}}",
      balanceCheckFailed: "Nie udało się sprawdzić salda kredytów",
      unsupportedDuration:
        "Model {{model}} nie obsługuje czasu trwania {{duration}}. Obsługiwane czasy: {{supported}}",
      unsupportedAspectRatio:
        "Model {{model}} nie obsługuje proporcji {{aspectRatio}}. Obsługiwane proporcje: {{supported}}",
      unsupportedResolution:
        "Model {{model}} nie obsługuje rozdzielczości {{resolution}}. Obsługiwane rozdzielczości: {{supported}}",
      generationFailed: "Generowanie wideo nie powiodło się: {{error}}",
      providerError: "Błąd dostawcy: {{error}}",
      noVideoUrl: "Dostawca nie zwrócił URL wideo",
      creditsFailed: "Nie udało się odjąć kredytów za generowanie wideo",
      inputMediaRequired:
        "Ten model wymaga URL obrazu wejściowego. Wklej link do obrazu, który chcesz animować.",
      imageInputUnsupported:
        "Model wideo {{model}} odrzucił obraz wejściowy - prawdopodobnie nie obsługuje image-to-video. Wywołaj generate_video BEZ parametru model (model domyślny animuje obrazy) albo pomiń obraz.",
    },
    success: {
      title: "Wideo wygenerowane",
      description: "Twoje wideo zostało pomyślnie wygenerowane",
    },
  },
};
