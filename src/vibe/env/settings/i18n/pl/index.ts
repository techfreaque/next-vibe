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
    titleShort: "Ustawienia systemu",
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
    titleShort: "Aktualizuj ustawienia",
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
    openSetup: "Otwórz konfigurację",
    restartWizard: "Kreator konfiguracji",
    generate: "Generuj",
    editConfirmHint: "[Enter] potwierdź  [Esc] anuluj",
    editSettings: "Edytuj ustawienia",
    exit: "Wyjdź",
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
    subtitle: "Trzy krótkie kroki i już czatujesz.",
    alreadyConfigured: "Już skonfigurowane",
    stepOf: "Krok {{step}} z {{total}}",
    next: "Dalej",
    continue: "Kontynuuj",
    back: "Wstecz",
    skip: "Pomiń ten krok",
    finish: "Zakończ konfigurację",
    restart: "Uruchom kreator ponownie",
    done: "Konfiguracja zakończona",
    doneSubtitle:
      "Twoja instancja jest gotowa. Każde ustawienie zmienisz później w Wyświetl wszystkie ustawienia.",
    goToSettings: "Przejdź do wszystkich ustawień",
    startChatting: "Zacznij czatować",
    viewAllSettings: "Wyświetl wszystkie ustawienia",
    encryptionNote:
      "Zapisane w postaci zaszyfrowanej. Nikt nie odczyta tego jawnym tekstem.",
    autoGeneratedNote: "Wygenerowane dla Ciebie. Zostaw albo wklej własne.",
    steps: {
      admin: "Konto administratora",
      database: "Baza danych",
      security: "Klucze bezpieczeństwa",
      ai: "Dostawca AI",
    },
    ai: {
      claudeCodeTitle: "Claude Code (wykryty na tym komputerze)",
      claudeCodeDescription:
        "Korzysta z lokalnej sesji Claude CLI. Bez klucza API.",
      claudeDetected:
        "Znaleziono Claude CLI. Sprawdź, czy jesteś zalogowany przez `claude login`.",
      claudeNotDetected:
        "Nie znaleziono Claude CLI. Zainstaluj go z claude.ai/code i uruchom `claude login` albo wybierz inną opcję na tej stronie.",
      claudeInstallHint:
        "Opcjonalnie. Konto unbottled.ai albo klucz OpenRouter działa równie dobrze.",
      openRouterTitle: "Klucz API OpenRouter",
      openRouterDescription:
        "Setki modeli z jednym kluczem. Samodzielnie albo razem z Claude Code.",
      openRouterHint:
        "Klucz weźmiesz na openrouter.ai/keys. Darmowe modele nie wymagają karty.",
      recommended: "Polecane",
      unbottledTitle: "Twoje konto unbottled.ai",
      unbottledDescription:
        "Zaloguj się raz, a ta instancja dostaje każdy model z unbottled.ai. Czaty zostają w Twojej bazie, użycie modeli schodzi z Twoich kredytów. Wymaga płatnego planu albo pakietu kredytów.",
      unbottledNoAccount:
        "Nie masz konta? Załóż je na unbottled.ai i zaloguj się tutaj.",
      unbottledConnected: "Połączono z {{url}}",
      unbottledDisconnected: "Brak połączenia",
      unbottledSignIn: "Zaloguj się",
      unbottledSigningIn: "Logowanie...",
      unbottledDisconnect: "Rozłącz",
      unbottledEmail: "E-mail",
      unbottledPassword: "Hasło",
      unbottledRemoteUrl: "URL chmury",
      unbottledLoginFailed:
        "Logowanie nie powiodło się. Sprawdź e-mail i hasło.",
      unbottledConnectionError:
        "Nie można połączyć się z serwerem. Sprawdź adres URL.",
      orDivider: "Albo własny dostawca",
    },
  },

  post: {
    title: "Zaloguj się do unbottled.ai",
    titleShort: "Logowanie Unbottled",
    description:
      "Logowanie przez serwer — dane nigdy nie opuszczają twojego serwera",
    tags: { settings: "Logowanie Unbottled" },
    fields: {
      email: {
        label: "E-mail",
        description: "E-mail konta unbottled.ai",
        placeholder: "ty@przykład.pl",
      },
      password: {
        label: "Hasło",
        description: "Hasło konta unbottled.ai",
        placeholder: "Hasło",
      },
      remoteUrl: {
        label: "Zdalny URL",
        description: "URL instancji unbottled.ai",
        placeholder: "https://unbottled.ai",
      },
      credential: {
        label: "Dane logowania",
        description: "Zakodowany ciąg uwierzytelniający",
      },
      syncScope: {
        label: "Zakres synchronizacji",
        description: "Które dane synchronizują się przez to połączenie.",
      },
    },
    success: { title: "Zalogowano", description: "Dane logowania pobrane" },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Sprawdź e-mail, hasło i URL",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagana autoryzacja",
      },
      forbidden: {
        title: "Zabronione",
        description: "Wymagany dostęp administratora",
      },
      notFound: { title: "Nie znaleziono", description: "Nie znaleziono" },
      network: {
        title: "Błąd połączenia",
        description: "Nie można połączyć z zdalną instancją",
      },
      server: {
        title: "Logowanie nieudane",
        description: "Błędny e-mail lub hasło",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieoczekiwany błąd",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany",
      },
      conflict: { title: "Konflikt", description: "Wystąpił konflikt" },
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
