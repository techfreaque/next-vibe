import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "System",

  errors: {
    readFailed: "Nie udało się odczytać ustawień systemowych",
    writeFailed: "Nie udało się zapisać ustawień do pliku .env",
    readOnly: "Konfiguracja jest tylko do odczytu w tym środowisku",
    defaultPasswordDetected: "Wykryto domyślne hasło administratora",
    passwordNotConfigured: "Hasło administratora nie jest skonfigurowane",
  },

  messages: {
    settingsUpdated: "Ustawienia zaktualizowane",
  },

  get: {
    title: "Ustawienia systemowe",
    description:
      "Przeglądaj i zarządzaj konfiguracją środowiska pogrupowaną według modułu",
    tags: {
      settings: "Ustawienia",
    },
    response: {
      modules: {
        title: "Moduły konfiguracji",
      },
      isWritable: {
        title: "Zapisywalny",
      },
      isDevMode: {
        title: "Tryb deweloperski",
      },
      needsOnboarding: {
        title: "Wymaga konfiguracji",
      },
      onboardingIssues: {
        title: "Problemy z konfiguracją",
      },
      wizardSteps: {
        title: "Kroki kreatora konfiguracji",
      },
    },
    success: {
      title: "Ustawienia załadowane",
      description: "Ustawienia środowiska pobrane pomyślnie",
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry żądania",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagana autoryzacja",
      },
      forbidden: {
        title: "Zabronione",
        description: "Wymagany dostęp administratora",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Ustawienia nie znalezione",
      },
      network: {
        title: "Błąd sieci",
        description: "Wystąpił błąd sieci",
      },
      server: {
        title: "Błąd serwera",
        description: "Nie udało się załadować ustawień",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieoczekiwany błąd",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt",
      },
    },
  },

  patch: {
    title: "Aktualizuj ustawienia",
    description: "Aktualizuj wartości konfiguracji środowiska w pliku .env",
    tags: {
      settings: "Ustawienia",
    },
    fields: {
      settings: {
        label: "Ustawienia",
        description: "Pary klucz-wartość do aktualizacji",
      },
    },
    response: {
      updated: {
        title: "Zaktualizowane klucze",
      },
      needsRestart: {
        title: "Wymagany restart",
      },
      resultMessage: {
        title: "Ustawienia zaktualizowane",
      },
    },
    success: {
      title: "Ustawienia zapisane",
      description: "Ustawienia środowiska zaktualizowane pomyślnie",
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe wartości ustawień",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagana autoryzacja",
      },
      forbidden: {
        title: "Zabronione",
        description: "Wymagany dostęp administratora",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Ustawienia nie znalezione",
      },
      network: {
        title: "Błąd sieci",
        description: "Wystąpił błąd sieci",
      },
      server: {
        title: "Błąd serwera",
        description: "Nie udało się zapisać ustawień",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieoczekiwany błąd",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt",
      },
    },
  },

  widget: {
    title: "Konfiguracja systemu",
    subtitle: "Zmienne środowiskowe pogrupowane według modułu",
    readOnlyBanner:
      "Konfiguracja jest tylko do odczytu. Edytuj plik .env bezpośrednio lub użyj CLI.",
    onboardingBanner:
      "Wymagana konfiguracja - skonfiguruj wyróżnione pola, aby rozpocząć.",
    defaultPasswordWarning:
      "Wykryto domyślne hasło administratora! Zmień je natychmiast.",
    cancel: "Anuluj",
    save: "Zapisz zmiany",
    saving: "Zapisywanie...",
    apply: "Zastosuj i zrestartuj",
    applying: "Stosowanie...",
    saved: "Ustawienia zapisane pomyślnie",
    restartRequired:
      "Ustawienia zapisane. Wymagany restart, aby zastosować zmiany.",
    devRestartHint:
      "Zrestartuj serwer deweloperski (Ctrl+C, następnie uruchom vibe dev), aby zastosować zmiany.",
    notSet: "nie ustawiono",
    configured: "Skonfigurowane",
    partial: "Częściowo",
    notConfigured: "Nie skonfigurowane",
    required: "Wymagane",
    selectPlaceholder: "Wybierz...",
    boolTrue: "wł.",
    boolFalse: "wył.",
    logPathDisabled: "logowanie do pliku wyłączone",
    restartWizard: "Kreator konfiguracji",
    generate: "Generuj",
    editConfirmHint: "[Enter] potwierdź  [Esc] anuluj",
    editSettings: "Edytuj ustawienia",
    loading: "Ładowanie ustawień...",
    exportProd: "Eksportuj dla produkcji",
    moduleLabels: {
      env: "Rdzeń",
      agent: "Dostawcy AI",
      leadsCampaigns: "Kampanie leadów",
      messenger: "Messenger / SMTP",
      imap: "IMAP",
      payment: "Płatności",
      sms: "SMS",
      serverSystem: "Serwer / Platforma",
    },
  },

  wizard: {
    title: "Witaj w konfiguracji Vibe",
    subtitle: "Skonfiguruj swoją instancję w kilku krokach.",
    alreadyConfigured: "Już skonfigurowane",
    stepOf: "Krok {{step}} z {{total}}",
    next: "Dalej",
    back: "Wstecz",
    skip: "Pomiń ten krok",
    finish: "Zakończ konfigurację",
    restart: "Uruchom kreator ponownie",
    done: "Konfiguracja zakończona",
    doneSubtitle:
      "Twoja instancja jest gotowa. Możesz zmienić ustawienia w każdej chwili.",
    goToSettings: "Przejdź do pełnych ustawień",
    viewAllSettings: "Wyświetl wszystkie ustawienia",
    encryptionNote:
      "Ta wartość zostanie zaszyfrowana i bezpiecznie przechowana - nigdy nie będzie czytelna w postaci jawnej.",
    autoGeneratedNote:
      "Automatycznie wygenerowane - bezpieczne do użycia, lub zastąp własną wartością.",
    steps: {
      admin: "Konto administratora",
      database: "Baza danych",
      security: "Klucze bezpieczeństwa",
      ai: "Dostawca AI",
    },
    ai: {
      claudeCodeTitle: "Claude Code (wykrywany automatycznie)",
      claudeCodeDescription:
        "Używa lokalnej sesji CLI Claude - nie wymaga klucza API. Dodaj OpenRouter poniżej, aby uzyskać dostęp do 200+ dodatkowych modeli.",
      claudeDetected:
        "Wykryto CLI Claude! Upewnij się, że jesteś zalogowany przez `claude login`.",
      claudeNotDetected:
        "Nie znaleziono CLI Claude. Zainstaluj z claude.ai/code i uruchom `claude login`. Lub pomiń i użyj OpenRouter poniżej.",
      claudeInstallHint:
        "Opcjonalne - możesz zamiast tego użyć OpenRouter lub innych dostawców.",
      openRouterTitle: "Klucz API OpenRouter",
      openRouterDescription:
        "Dostęp do 200+ modeli AI. Działa razem z Claude Code lub samodzielnie.",
      openRouterHint: "Pobierz darmowy klucz API na openrouter.ai/keys",
      unbottledTitle: "Unbottled AI Cloud",
      unbottledDescription:
        "Zaloguj się do unbottled.ai, aby uzyskać dostęp do wszystkich modeli AI bez zarządzania kluczami API. Twoja instancja przekazuje przez chmurę.",
      unbottledConnected: "Połączono z {{url}}",
      unbottledDisconnected: "Nie połączono",
      unbottledSignIn: "Zaloguj się",
      unbottledSigningIn: "Logowanie...",
      unbottledDisconnect: "Rozłącz",
      unbottledEmail: "E-mail",
      unbottledPassword: "Hasło",
      unbottledRemoteUrl: "URL chmury",
      unbottledLoginFailed:
        "Logowanie nie powiodło się - sprawdź e-mail i hasło.",
      unbottledConnectionError:
        "Nie można połączyć z serwerem. Sprawdź adres URL.",
    },
  },

  export: {
    title: "Eksportuj dla produkcji",
    subtitle:
      "Wygeneruj plik .env gotowy do wdrożenia na serwerze. Wrażliwe wartości są wyświetlane jako tekst jawny - przechowuj ten plik bezpiecznie.",
    copyButton: "Kopiuj do schowka",
    copied: "Skopiowano!",
    downloadButton: "Pobierz .env.prod",
    instructions:
      "Skopiuj plik na serwer:\n  scp .env.prod użytkownik@twójserwer:/app/.env\nLub wklej ręcznie:\n  ssh użytkownik@twójserwer && nano /app/.env",
    checklist: "Lista kontrolna wdrożenia",
    close: "Zamknij",
  },
};
