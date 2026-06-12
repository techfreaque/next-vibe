import type { translations as enTranslations } from "../en";
export const translations: typeof enTranslations = {
  category: "SSH",

  enums: {
    authType: {
      password: "Hasło",
      privateKey: "Klucz prywatny (PEM)",
      keyAgent: "Agent SSH",
      local: "Lokalny komputer",
    },
  },

  get: {
    title: "Połączenia",
    titleShort: "Połączenia",
    description:
      "Wszystkie dostępne maszyny — lokalna powłoka, serwery SSH i zdalne instancje",
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagany dostęp administratora",
      },
      forbidden: { title: "Zabronione", description: "Brak uprawnień" },
      server: {
        title: "Błąd serwera",
        description: "Nie udało się wylistować połączeń",
      },
      notFound: { title: "Nie znaleziono", description: "Nie znaleziono" },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieoczekiwany błąd",
      },
      unsavedChanges: { title: "Niezapisane zmiany" },
      conflict: { title: "Konflikt", description: "Wystąpił konflikt" },
      network: { title: "Błąd sieci", description: "Wystąpił błąd sieci" },
      timeout: { title: "Timeout", description: "Przekroczono limit czasu" },
    },
    success: {
      title: "Połączenia wylistowane",
      description: "Wszystkie połączenia maszynowe pobrane",
    },
    response: {
      connections: {
        title: "Połączenia",
      },
    },
  },
  widget: {
    title: "Połączenia",
    back: "Wróć",
    addSsh: "Dodaj SSH",
    connectRemote: "Połącz remote",
    openTerminal: "Terminal",
    viewRemote: "Szczegóły",
    defaultBadge: "Domyślne",
    localType: "Lokalny",
    sshType: "SSH",
    remoteType: "Remote",
    healthHealthy: "Połączony",
    healthWarning: "Wolny",
    healthCritical: "Nieosiągalny",
    healthDisconnected: "Offline",
    noConnections: "Brak skonfigurowanych maszyn",
    noConnectionsHint:
      "Dodaj połączenie SSH lub połącz zdalną instancję, aby rozpocząć.",
    emptyState:
      "Brak połączeń. Dodaj jedno, aby połączyć się ze zdalnymi maszynami.",
  },
};
