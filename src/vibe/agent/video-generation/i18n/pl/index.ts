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
    frameReferences: {
      label: "Referencje klatek",
      description:
        "Zasoby referencyjne, które sterują wideo. Każdy wpis to { url, role }. role 'first' ustala dokładnie klatkę początkową, role 'last' dokładnie klatkę końcową (tylko przy obsłudze last_frame) — klatki brzegowe to WYŁĄCZNIE obrazy, więc obie MUSZĄ być adresami URL obrazów. role 'reference' (lub brak) to zasób prowadzący, który może być adresem URL obrazu, audio lub wideo; typ jest wykrywany z URL (.mp4/.webm/.mov jako wideo, pliki audio jako audio, reszta jako obraz). Obraz początkowy lub referencyjny przełącza w razie potrzeby na najtańszy model obsługujący obrazy.",
      placeholder: "https://przyklad.pl/pierwsza-klatka.jpg",
    },
    negativePrompt: {
      label: "Prompt negatywny",
      description: "Opisz, czego nie chcesz w filmie.",
      placeholder: "rozmazane, niska jakość, zniekształcone...",
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
      referenceNotImage:
        "Link z {{host}} otwiera stronę, a nie plik obrazu. Użyj bezpośredniego linku do obrazu (prawy klik na obraz, kopiuj adres obrazu) albo wgraj plik.",
      referenceUnreachable:
        "Link do obrazu z {{host}} się nie ładuje (HTTP {{status}}). Sprawdź link albo wgraj obraz. Nic nie pobraliśmy.",
      modelDiscontinued:
        "Dostawca wycofał {{model}} i ten model już nie generuje. Wybierz inny model wideo. Nic nie pobraliśmy.",
      referenceStagingFailed:
        "Dostawca wideo nie przyjął obrazu wejściowego. Spróbuj ponownie albo wybierz inny model wideo. Nic nie pobraliśmy.",
      referenceUnavailable:
        "Obraz wejściowy jest niedostępny. Został usunięty albo należy do czatu, do którego nie masz dostępu. Użyj obrazu z tego czatu albo wgraj go ponownie.",
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
      providerUnsupported: "{{label}} nie jest jeszcze obsługiwany",
      modelUnavailable: "Ten model jest chwilowo niedostępny. Wybierz inny.",
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
      generationFailedUnknown:
        "Generowanie wideo nie powiodło się – dostawca nie podał powodu",
      providerErrorUnknown: "Dostawca zgłosił błąd bez żadnego komunikatu",
      nonJsonResponse:
        "Dostawca wideo zwrócił odpowiedź spoza JSON (HTTP {{status}}): {{body}}",
      providerHttpError: "Dostawca wideo zwrócił HTTP {{status}}: {{body}}",
      jobFailedStatus: "Zadanie wideo zakończyło się ze statusem: {{status}}",
      requestAborted: "Generowanie wideo zostało przerwane",
      requestTimedOut: "Przekroczono czas oczekiwania na generowanie wideo",
      contentRejected:
        "Filtr treści dostawcy wideo odrzucił ten prompt: {{error}}. To odmowa, nie awaria. Przeredaguj prompt albo wybierz model z mniejszą cenzurą. Nie pobrano kredytów.",
      providerOutage:
        "Dostawca wideo ma teraz awarię lub jest przeciążony: {{error}}. To awaria, nie odmowa. Spróbuj ponownie za minutę albo wybierz inny model. Nie pobrano kredytów.",
      consentRequired:
        "Dostawca wideo wymaga zgody na użycie prawdziwej twarzy z obrazu: {{error}}. Użyj obrazu bez twarzy prawdziwej osoby albo wybierz inny model wideo. Nie pobrano kredytów.",
      storageFailed:
        "Wideo powstało, ale nie udało się go zapisać. Nie pobrano kredytów. Spróbuj ponownie.",
      creditsFailed: "Nie udało się odjąć kredytów za generowanie wideo",
      imageRequiredForModel:
        "{{model}} animuje obraz. Dodaj obraz startowy i wygeneruj ponownie.",
      inputMediaRequired:
        "Ten model wymaga URL obrazu wejściowego. Wklej link do obrazu, który chcesz animować.",
      imageInputUnsupported:
        "Model wideo {{model}} odrzucił obraz wejściowy - prawdopodobnie nie obsługuje image-to-video. Wywołaj generate_video BEZ parametru model (model domyślny animuje obrazy) albo pomiń obraz.",
      noImageCapableModel:
        "Żaden dostępny model wideo nie przyjmuje obrazu referencyjnego. Pomiń obraz, aby generować z samego promptu.",
    },
    success: {
      title: "Wideo wygenerowane",
      description: "Twoje wideo zostało pomyślnie wygenerowane",
    },
  },
};
