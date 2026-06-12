import type { translations as enTranslations } from "../en";
export const translations: typeof enTranslations = {
  post: {
    title: "Wykonaj polecenie",
    titleShort: "Wykonaj polecenie",
    description:
      "Wykonaj polecenie na maszynie. Tylko ścieżki /ssh/. Trwały terminal — katalog roboczy przenosi się między wywołaniami. Nowe sesje startują w domyślnym punkcie montowania, jeśli skonfigurowany.",
    dynamicTitle: "{{path}}: {{command}}",
    status: {
      loading: "Wykonywanie...",
      done: "Gotowe",
    },
    tags: {
      cortex: "Cortex",
    },
    fields: {
      path: {
        label: "Maszyna",
        description:
          'Ścieżka maszyny SSH. Musi zaczynać się od /ssh/. cortex-list(path="/ssh") pokazuje maszyny i punkty montowania.',
      },
      command: {
        label: "Polecenie",
        description: "Polecenie powłoki do wykonania",
        placeholder: "echo cześć",
      },
      workingDir: {
        label: "Katalog roboczy",
        description:
          "Nadpisz katalog roboczy. Jeśli puste, używany jest bieżący katalog terminala.",
        placeholder: "/home/user/projekt",
      },
      terminalId: {
        label: "ID terminala",
        description:
          "Użyj istniejącej sesji terminala. Jeśli puste, używany jest domyślny terminal.",
      },
      timeoutMs: {
        label: "Limit czasu (ms)",
        description:
          "Maksymalny czas wykonania. Domyślnie 30000ms. Maks. 300000ms.",
        placeholder: "30000",
      },
    },
    submitButton: {
      label: "Uruchom",
      loadingText: "Uruchamianie...",
    },
    response: {
      output: { content: "Wynik" },
      exitCode: { title: "Kod wyjścia" },
      cwd: { content: "Katalog roboczy" },
      terminalId: { content: "ID terminala" },
      backend: { title: "Backend" },
      truncated: { title: "Skrócone" },
    },
    errors: {
      validation: {
        title: "Błędne dane",
        description: "Sprawdź ścieżkę i polecenie",
      },
      network: { title: "Offline", description: "Brak połączenia z serwerem" },
      unauthorized: {
        title: "Niezalogowany",
        description: "Najpierw się zaloguj",
      },
      forbidden: {
        title: "Brak dostępu",
        description: "Brak uprawnień do tej maszyny",
      },
      notFound: {
        title: "Maszyna nie znaleziona",
        description: "Brak połączenia SSH lub zdalnej instancji pod tą ścieżką",
      },
      server: {
        title: "Błąd wykonania",
        description: "Wykonanie polecenia nie powiodło się",
      },
      unknown: { title: "Błąd", description: "Coś poszło nie tak" },
      unsavedChanges: {
        title: "Niezapisane",
        description: "Najpierw zapisz lub odrzuć",
      },
      conflict: {
        title: "Konflikt sesji",
        description: "Sesja terminala jest zajęta",
      },
    },
    success: {
      title: "Polecenie zakończone",
      description: "Polecenie wykonane",
    },
  },
  errors: {
    invalidWorkingDir: "Katalog roboczy musi być ścieżką bezwzględną bez '..'",
    commandTimedOut: "Polecenie przekroczyło limit czasu",
    invalidPath: "Ścieżka musi zaczynać się od /ssh/",
    noConnection: "Nie znaleziono połączenia pod tą ścieżką",
    connectionNotFound: "Połączenie nie znalezione",
    encryptionFailed:
      "Szyfrowanie nie powiodło się - JWT_SECRET_KEY może być nieprawidłowy",
    connectTimeout: "Przekroczono limit czasu połączenia",
    sshAuthFailed: "Uwierzytelnianie SSH nieudane",
    sshConnectionFailed: "Połączenie SSH nieudane",
    fingerprintMismatch:
      "Odcisk serwera zmieniony - możliwe zagrożenie. Usuń i dodaj połączenie ponownie.",
    remoteNotSupported:
      "Zdalne połączenia nie są jeszcze obsługiwane. Użyj bezpośredniego połączenia SSH.",
  },
  log: {
    execComplete: "Polecenie wykonane",
    openedLocal: "Otwarto lokalny terminal",
    failedLocal: "Nie udało się otworzyć lokalnego terminala",
    openedSsh: "Otwarto terminal SSH",
    failedFingerprint: "Nie udało się zapisać odcisku",
    failedPty: "Nie udało się otworzyć SSH PTY",
    escalated: "Długie polecenie przekazane do zadania w tle",
  },
  widget: {
    title: "Terminal",
    back: "Wróć",
    machineLabel: "Maszyna",
    machinePlaceholder: "/ssh/local-machine",
    placeholder: "Wpisz polecenie...",
    runButton: "Uruchom",
    running: "Działa...",
    clearButton: "Wyczyść",
    ctrlEnterHint: "Ctrl+Enter aby uruchomić",
    exitCodeLabel: "Kod wyjścia",
    backendLabel: "Backend",
    cwdLabel: "Katalog roboczy",
    terminalLabel: "Terminal",
    truncatedWarning: "Wynik skrócony",
    emptyOutput: "Brak wyniku",
    outputLabel: "Wynik pojawi się tutaj",
    outputTitle: "Wynik",
    historyTitle: "Historia",
    noHistory: "Brak poleceń",
    manageConnections: "Połączenia",
    viewTerminals: "Terminale",
    successStatus: "Sukces",
    failedStatus: "Błąd",
    picker: {
      browse: "Przeglądaj",
      cancel: "Anuluj",
      machinesTitle: "Wybierz maszynę",
      machines: "Maszyny",
      loading: "Ładowanie...",
      noMachines: "Brak skonfigurowanych maszyn",
      defaultBadge: "Domyślna",
      useDir: "Użyj tego katalogu",
      emptyDir: "Pusty katalog",
    },
  },
};
