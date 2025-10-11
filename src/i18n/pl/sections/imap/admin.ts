import type { adminTranslations as EnglishAdminTranslations } from "../../../en/sections/imap/admin";

export const adminTranslations: typeof EnglishAdminTranslations = {
  overview: {
    title: "Przegląd serwera IMAP",
    description: "Monitorowanie statusu i wydajności serwera IMAP",
    dashboard: {
      title: "Panel serwera",
    },
  },
  accounts: {
    title: "Zarządzanie kontami IMAP",
    description: "Zarządzanie i monitorowanie kont IMAP",
    management: {
      title: "Zarządzanie kontami",
    },
  },
  folders: {
    title: "Zarządzanie folderami IMAP",
    description: "Zarządzanie i monitorowanie folderów IMAP",
    management: {
      title: "Zarządzanie folderami",
    },
    stats: {
      title: "Statystyki folderów",
    },
    no_folders: "Brak folderów",
  },
  messages: {
    title: "Zarządzanie wiadomościami IMAP",
    description: "Przeglądanie i zarządzanie wiadomościami IMAP",
    filters: "Filtry wiadomości",
    management: {
      title: "Zarządzanie wiadomościami",
    },
    error: {
      title: "Błąd podczas ładowania wiadomości: {{error}}",
    },
    actions: {
      markAsRead: "Oznacz jako przeczytane",
      markAsUnread: "Oznacz jako nieprzeczytane",
      toggleFlag: "Przełącz flagę",
      delete: "Usuń",
      move: "Przenieś",
      copy: "Kopiuj",
    },
    selected: "{{count}} wiadomości wybrane",
    no_messages: "Nie znaleziono wiadomości",
    pagination: {
      showing: "Pokazuje {{start}}-{{end}} z {{total}} wiadomości",
    },
    statistics: "Statystyki wiadomości",
  },
  config: {
    title: "Konfiguracja serwera IMAP",
    description: "Konfigurowanie ustawień serwera IMAP",
    settings: {
      title: "Ustawienia konfiguracji",
    },
    resilience: {
      title: "Ustawienia odporności",
    },
    monitoring: {
      title: "Ustawienia monitorowania",
    },
    development: {
      title: "Ustawienia rozwoju",
    },
    status: {
      title: "Status konfiguracji",
    },
  },
  sync: {
    title: "Operacje synchronizacji IMAP",
    description: "Monitorowanie i zarządzanie synchronizacją e-mail",
    operations: {
      title: "Operacje synchronizacji",
    },
  },
  health: {
    title: "Monitorowanie zdrowia IMAP",
    description: "Monitorowanie zdrowia serwera i metryk wydajności",
    monitoring: {
      title: "Monitorowanie zdrowia",
    },
    error: {
      title: "Błąd podczas ładowania danych zdrowia",
    },
    errors: "Błędy",
    serverStatus: "Status serwera",
    uptime: "Czas działania",
    lastUpdate: "Ostatnia aktualizacja {{time}}",
    lastHealthCheck: "Ostatnie sprawdzenie zdrowia",
    responseTime: "Czas odpowiedzi",
    memoryUsage: "Użycie pamięci",
    cpuUsage: "Użycie CPU",
    diskUsage: "Użycie dysku",
    activeConnections: "Aktywne połączenia",
    connections: "{{count}} połączeń",
    accounts: "{{healthy}}/{{total}} kont",
    accountHealthSummary: "Podsumowanie zdrowia kont",
    healthyAccounts: "Zdrowe konta",
    failedAccounts: "Nieudane konta",
    syncedAccounts: "Zsynchronizowane konta",
    systemResources: "Zasoby systemowe",
    version: "Wersja",
    lastRestart: "Ostatni restart",
    connectedAccounts: "Połączone konta",
    disconnectedAccounts: "Rozłączone konta",
    statusValues: {
      healthy: "Zdrowy",
      warning: "Ostrzeżenie",
      error: "Błąd",
      offline: "Offline",
    },
    uptimeValues: {
      zero: "0 dni, 0 godzin",
    },
    lastCheckValues: {
      never: "Nigdy",
    },
  },
  status: {
    title: "Status serwera IMAP",
    description: "Monitorowanie statusu serwera i kont w czasie rzeczywistym",
    monitoring: {
      title: "Monitorowanie statusu",
    },
    accountStatusDetails: "Szczegóły statusu konta",
  },
};
