export const translations = {
  post: {
    title: "Wykonaj polecenie",
    description: "Wykonaj polecenie powłoki na lokalnej maszynie lub przez SSH",
    fields: {
      connectionId: {
        label: "Połączenie",
        description:
          "Połączenie SSH. Zostaw puste aby uruchomić lokalnie jako bieżący użytkownik.",
        placeholder: "Lokalnie (bieżący użytkownik)",
      },
      command: {
        label: "Polecenie",
        description: "Polecenie powłoki do wykonania",
        placeholder: "ls -la",
      },
      workingDir: {
        label: "Katalog roboczy",
        description: "Katalog, w którym uruchomić polecenie",
        placeholder: "/home/użytkownik",
      },
      timeoutMs: {
        label: "Timeout (ms)",
        description: "Maksymalny czas oczekiwania na zakończenie polecenia",
        placeholder: "30000",
      },
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry polecenia",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagany dostęp administratora",
      },
      forbidden: {
        title: "Zabronione",
        description: "Brak uprawnień do wykonywania poleceń",
      },
      server: {
        title: "Błąd serwera",
        description: "Nie udało się wykonać polecenia",
      },
      timeout: {
        title: "Timeout",
        description: "Polecenie przekroczyło limit czasu",
      },
      notFound: {
        title: "Połączenie nie znalezione",
        description: "Połączenie SSH nie znalezione",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieoczekiwany błąd",
      },
      unsavedChanges: { title: "Niezapisane zmiany" },
      conflict: { title: "Konflikt", description: "Wystąpił konflikt" },
      network: { title: "Błąd sieci", description: "Wystąpił błąd sieci" },
    },
    success: {
      title: "Polecenie wykonane",
      description: "Polecenie zakończone sukcesem",
    },
  },
  widget: {
    title: "Wykonywacz poleceń",
    runButton: "Uruchom",
    clearButton: "Wyczyść",
    running: "Uruchamianie...",
    localLabel: "Lokalnie (bieżący użytkownik)",
    connectionLabel: "Połączenie",
    workingDirLabel: "Katalog roboczy",
    timeoutLabel: "Timeout",
    outputLabel: "Wyjście",
    stdoutLabel: "stdout",
    stderrLabel: "stderr",
    exitCodeLabel: "Kod wyjścia",
    durationLabel: "Czas trwania",
    backendLabel: "Backend",
    emptyOutput: "Brak wyjścia",
    truncatedWarning: "Wyjście zostało obcięte.",
    historyLabel: "Historia",
    noHistory: "Nie wykonano jeszcze żadnych poleceń",
    placeholder: "Wpisz polecenie...",
  },
};
