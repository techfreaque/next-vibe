import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Konfiguracja IMAP",
  description: "Zarządzaj ustawieniami konfiguracji klienta IMAP",
  category: "Punkt końcowy API",
  tags: {
    config: "Config",
  },
  form: {
    title: "Formularz konfiguracji IMAP",
    description: "Skonfiguruj ustawienia klienta IMAP",
  },
  response: {
    serverEnabled: "Serwer włączony",
    maxConnections: "Maks. połączeń",
    connectionTimeout: "Timeout połączenia",
    poolIdleTimeout: "Timeout bezczynności puli",
    keepAlive: "Keep Alive",
    syncEnabled: "Synchronizacja włączona",
    syncInterval: "Interwał synchronizacji",
    batchSize: "Rozmiar partii",
    maxMessages: "Maks. wiadomości",
    concurrentAccounts: "Równoczesne konta",
    cacheEnabled: "Cache włączony",
    cacheTtl: "Cache TTL",
    cacheMaxSize: "Maks. rozmiar cache",
    memoryThreshold: "Próg pamięci",
    maxRetries: "Maks. ponownych prób",
    retryDelay: "Opóźnienie ponownej próby",
    circuitBreakerThreshold: "Próg wyłącznika",
    circuitBreakerTimeout: "Timeout wyłącznika",
    healthCheckInterval: "Interwał sprawdzenia zdrowia",
    metricsEnabled: "Metryki włączone",
    loggingLevel: "Poziom logowania",
    rateLimitEnabled: "Limit szybkości włączony",
    rateLimitRequests: "Żądania limit szybkości",
    rateLimitWindow: "Okno limit szybkości",
    debugMode: "Tryb debugowania",
    testMode: "Tryb testowy",
  },
  serverEnabled: {
    label: "Serwer włączony",
    description: "Włącz lub wyłącz serwer IMAP",
  },
  maxConnections: {
    label: "Maks. połączeń",
    description: "Maksymalna liczba równoczesnych połączeń",
  },
  connectionTimeout: {
    label: "Timeout połączenia",
    description: "Timeout połączenia w milisekundach",
  },
  syncEnabled: {
    label: "Synchronizacja włączona",
    description: "Włącz lub wyłącz automatyczną synchronizację",
  },
  syncInterval: {
    label: "Interwał synchronizacji",
    description: "Interwał czasowy między operacjami synchronizacji w minutach",
  },
  batchSize: {
    label: "Rozmiar partii",
    description: "Liczba wiadomości do przetworzenia w każdej partii",
  },
  loggingLevel: {
    label: "Poziom logowania",
    description: "Ustaw poziom szczegółowości logowania",
    placeholder: "Wybierz poziom logowania",
  },
  debugMode: {
    label: "Tryb debugowania",
    description: "Włącz tryb debugowania dla szczegółowego logowania",
  },
  errors: {
    internal: {
      title: "Błąd wewnętrzny",
      description: "Wystąpił wewnętrzny błąd serwera",
    },
    unauthorized: {
      title: "Brak autoryzacji",
      description: "Nie masz uprawnień do dostępu do tego zasobu",
    },
  },
  update: {
    title: "Aktualizuj konfigurację IMAP",
    description: "Zaktualizuj ustawienia konfiguracji klienta IMAP",
    form: {
      title: "Aktualizuj konfigurację",
      description: "Zmodyfikuj ustawienia konfiguracji IMAP",
    },
    response: {
      message: "Konfiguracja IMAP została pomyślnie zaktualizowana",
      success: "Konfiguracja została pomyślnie zaktualizowana",
    },
    errors: {
      internal: {
        title: "Aktualizacja nie powiodła się",
        description: "Nie udało się zaktualizować konfiguracji IMAP",
      },
      validation: {
        title: "Błąd walidacji",
        description: "Podano nieprawidłowe dane konfiguracji",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Nie masz uprawnień do aktualizacji tej konfiguracji",
      },
    },
  },
};
