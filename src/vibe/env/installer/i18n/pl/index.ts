import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Instalacja {{appName}}",
    description:
      "Postęp lokalnej instalacji oraz opcjonalna konfiguracja prywatnego repozytorium GitHub.",
  },
  enums: {
    stepStatus: {
      done: "Gotowe",
      inProgress: "W toku",
      pending: "Oczekuje",
      skipped: "Pominięto",
      error: "Wymaga uwagi",
    },
    action: {
      refresh: "Sprawdź ponownie",
      githubAuthStart: "Zaloguj przez GitHub",
      githubAuthCheck: "Sprawdź logowanie GitHub",
      githubCreatePrivateRepo: "Utwórz prywatne repozytorium",
      githubSkip: "Pomiń GitHub",
      githubReset: "Skonfiguruj GitHub",
    },
    checkoutMode: {
      cloned: "Świeży klon",
      existing: "Zachowano istniejący folder",
      unknown: "Lokalna kopia",
    },
  },
  get: {
    title: "Status instalatora",
    titleShort: "Instalator",
    description:
      "Podgląd postępu lokalnej instalacji, folderu projektu oraz opcjonalnego połączenia z GitHub.",
    tags: {
      installer: "Instalator",
    },
    success: {
      title: "Status pobrany",
      description: "Pobrano lokalny status instalacji.",
    },
    response: {
      installDir: { title: "Folder instalacji" },
      os: { title: "System operacyjny" },
      arch: { title: "Architektura" },
      checkoutMode: { title: "Tryb kopii" },
      branch: { title: "Gałąź Git" },
      originUrl: { title: "Zdalne origin" },
      upstreamUrl: { title: "Zdalne upstream" },
      port: { title: "Lokalny port" },
      stateFilePath: { title: "Plik stanu" },
      updatedAt: { title: "Ostatnia aktualizacja" },
      lastError: { title: "Ostatni błąd" },
      steps: { title: "Kroki instalacji" },
      github: { title: "Status GitHub" },
      setup: { title: "Status konfiguracji" },
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe zapytanie o status instalatora.",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagane logowanie.",
      },
      forbidden: {
        title: "Tylko lokalnie",
        description:
          "Instalator działa wyłącznie na lokalnej instancji przy pierwszym uruchomieniu.",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Nie znaleziono stanu instalatora.",
      },
      network: {
        title: "Błąd sieci",
        description: "Żądanie sieciowe nie powiodło się.",
      },
      server: {
        title: "Błąd serwera",
        description: "Nie udało się odczytać lokalnego statusu instalacji.",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieoczekiwany błąd.",
      },
      unsavedChanges: {
        title: "Konflikt",
        description: "Stan zmienił się podczas odczytu.",
      },
      conflict: {
        title: "Konflikt",
        description: "Konflikt stanu instalatora.",
      },
    },
  },
  post: {
    title: "Wykonaj akcję instalatora",
    titleShort: "Akcja instalatora",
    description:
      "Odśwież lokalne sprawdzenia lub skonfiguruj opcjonalne prywatne repozytorium GitHub.",
    tags: {
      installer: "Instalator",
    },
    request: {
      action: {
        label: "Akcja",
        description: "Akcja instalatora do wykonania.",
      },
      repoName: {
        label: "Nazwa prywatnego repozytorium",
        description: "Nazwa repozytorium na Twoim koncie GitHub.",
        placeholder: "next-vibe-private",
      },
    },
    response: {
      actionMessage: { title: "Wynik akcji" },
    },
    success: {
      title: "Gotowe",
      description: "Akcja instalatora zakończona pomyślnie.",
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowa akcja lub nazwa repozytorium.",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagane logowanie.",
      },
      forbidden: {
        title: "Tylko lokalnie",
        description:
          "Akcje instalatora są dostępne tylko na lokalnej instancji.",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Nie znaleziono wymaganego lokalnego narzędzia.",
      },
      network: {
        title: "Błąd sieci",
        description:
          "Nie udało się połączyć z GitHub. Sprawdź połączenie i spróbuj ponownie.",
      },
      server: {
        title: "Błąd serwera",
        description: "Akcja instalatora nie powiodła się.",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieoczekiwany błąd.",
      },
      unsavedChanges: {
        title: "Konflikt",
        description: "Stan zmienił się w trakcie operacji.",
      },
      conflict: {
        title: "Repozytorium już istnieje",
        description: "Konflikt nazwy repozytorium na GitHub.",
      },
    },
  },
  errors: {
    localOnly:
      "Instalator jest dostępny wyłącznie na lokalnej instancji podczas pierwszego uruchomienia.",
    invalidRepoName:
      "Użyj liter, cyfr, kropek, myślników lub podkreśleń (maks. 100 znaków).",
    ghNotInstalled:
      "GitHub CLI (gh) nie jest zainstalowane. Skorzystaj z instrukcji ręcznej poniżej albo pomiń ten krok.",
    ghAuthStartFailed:
      "Nie udało się uruchomić logowania urządzeniem GitHub. Uruchom 'gh auth login --web' w terminalu albo użyj konfiguracji ręcznej.",
    ghNotSignedIn: "Najpierw zaloguj się na GitHub, a potem spróbuj ponownie.",
    ghCreateFailed:
      "Nie udało się utworzyć prywatnego repozytorium ani wypchnąć kodu. Sprawdź uprawnienia konta GitHub i spróbuj ponownie.",
  },
  actions: {
    refreshed: "Sprawdzenia środowiska zostały odświeżone.",
    githubAuthPending:
      "Wpisz jednorazowy kod na GitHub i kliknij Sprawdź ponownie.",
    githubAuthReady: "Zalogowano w GitHub jako {{username}}.",
    githubAuthWaiting:
      "Czekamy na dokończenie logowania GitHub w przeglądarce.",
    githubRepoCreated:
      "Prywatne repozytorium zostało połączone i zsynchronizowane.",
    githubSkipped:
      "Pominięto konfigurację GitHub. Możesz wrócić do niej później.",
    githubReset: "Ponownie otwarto konfigurację GitHub.",
  },
  widget: {
    progressOf: "{{done}} z {{total}} kroków gotowych",
    title: "Lokalna instalacja jest gotowa.",
    titleIncomplete: "Dokończ lokalną instalację",
    subtitle:
      "next-vibe działa już na Twoim komputerze. Opcjonalnie połącz prywatne repozytorium GitHub, a potem przejdź do kreatora konfiguracji.",
    subtitleIncomplete:
      "Sprawdź kroki poniżej, popraw zaznaczone pozycje i przejdź do kreatora konfiguracji.",
    checkoutLabel: "Folder",
    stateFileLabel: "Plik stanu",
    recheck: "Sprawdź ponownie",
    rechecking: "Sprawdzanie...",
    copy: "Kopiuj",
    copied: "Skopiowano",
    steps: {
      git: {
        title: "Git",
        missingDetail: "Nie znaleziono Git w zmiennej PATH.",
        missingRecovery:
          "Zainstaluj git, otwórz nowy terminal i uruchom instalator ponownie.",
      },
      bun: {
        title: "Środowisko Bun",
        missingDetail: "Nie znaleziono Bun w zmiennej PATH.",
        missingRecovery:
          "Zainstaluj Bun ze strony https://bun.sh i uruchom instalator ponownie.",
      },
      clone: {
        title: "Kopia next-vibe",
        clonedDetail: "Sklonowano do {{dir}}",
        existingDetail: "Zachowano istniejący folder {{dir}}",
        unknownDetail: "Uruchomiono z {{dir}}",
      },
      dependencies: {
        title: "Zależności i CLI",
        readyDetail: "Pakiety zainstalowane, vibe CLI gotowe do pracy.",
        missingDetail: "Folder node_modules jest niekompletny.",
        missingRecovery: "Uruchom 'bun install' w folderze projektu.",
      },
      github: {
        title: "Prywatne repozytorium GitHub",
        optionalTag: "Opcjonalne",
        connectedDetail: "Origin wskazuje na {{url}}",
        skippedDetail:
          "Pominięto na teraz. Aktualizacje nadal pobierasz z next-vibe.",
        pendingDetail: "Opcjonalnie zachowaj własną prywatną kopię na GitHub.",
      },
      server: {
        title: "Lokalny serwer",
        readyDetail: "Działa pod adresem http://localhost:{{port}}",
      },
    },
    githubCard: {
      title: "Prywatne repozytorium GitHub",
      badge: "Opcjonalne",
      body: "Utwórz własne prywatne repozytorium, aby Twoje zmiany pozostały prywatne na GitHub, zachowując upstream do aktualizacji next-vibe.",
      connectedTitle: "Prywatne repozytorium połączone",
      connectedOpen: "Otwórz na GitHub",
      skippedNotice:
        "Konfiguracja GitHub została pominięta. Możesz połączyć prywatne repozytorium w dowolnym momencie.",
      reopenButton: "Skonfiguruj GitHub",
      skipButton: "Pomiń na teraz",
      signedInAs: "Zalogowano w GitHub jako {{username}}",
      repoNameLabel: "Nazwa prywatnego repozytorium",
      repoNameHelp:
        "Zostanie utworzone jako prywatne na Twoim koncie GitHub. Upstream pozostanie połączony z next-vibe.",
      createButton: "Utwórz prywatne repozytorium",
      creatingButton: "Tworzenie i wysyłanie...",
      signInButton: "Zaloguj przez GitHub",
      startingSignIn: "Uruchamianie logowania...",
      deviceTitle: "Potwierdź logowanie na GitHub",
      deviceBody:
        "Skopiuj jednorazowy kod poniżej, otwórz stronę autoryzacji GitHub i zatwierdź dostęp. Ta strona nie zapisuje tokenów.",
      deviceOpenLink: "Otwórz stronę logowania GitHub",
      deviceCheckButton: "Zalogowałem się, sprawdź ponownie",
      manualTitle: "Konfiguracja ręczna (bez GitHub CLI)",
      manualBody:
        "GitHub CLI (gh) nie jest zainstalowane. Utwórz puste prywatne repozytorium na GitHub, a następnie uruchom te trzy polecenia w folderze projektu.",
      manualNewRepoLink: "Utwórz prywatne repozytorium na GitHub",
      manualShowCommands: "Pokaż polecenia git",
      manualHideCommands: "Ukryj polecenia git",
    },
    handover: {
      continueToSetup: "Przejdź do kreatora konfiguracji",
      openApp: "Otwórz aplikację",
      hint: "Dalej: ustaw dane administratora i połącz konto unbottled.ai lub własne klucze API.",
      completeHint:
        "Pierwsza konfiguracja na tej instancji jest już zakończona.",
    },
  },
};
