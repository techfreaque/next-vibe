import type { configTranslations as EnglishConfigTranslations } from "../../../en/sections/imap/config";

export const configTranslations: typeof EnglishConfigTranslations = {
  resetConfirm:
    "Czy na pewno chcesz zresetować całą konfigurację do wartości domyślnych? Ta akcja nie może zostać cofnięta.",
  server: {
    enabled: "Serwer włączony",
    maxConnections: "Maksymalna liczba połączeń",
    connectionTimeout: "Timeout połączenia (ms)",
    poolIdleTimeout: "Timeout bezczynności puli (ms)",
    keepAlive: "Utrzymuj połączenie",
  },
  sync: {
    enabled: "Synchronizacja włączona",
    interval: "Interwał synchronizacji (sekundy)",
    batchSize: "Rozmiar partii",
    maxMessages: "Maksymalna liczba wiadomości",
    concurrentAccounts: "Równoczesne konta",
  },
  performance: {
    cacheEnabled: "Cache włączony",
    cacheTtl: "TTL cache (ms)",
    cacheMaxSize: "Maksymalny rozmiar cache",
    memoryThreshold: "Próg pamięci (%)",
  },
  resilience: {
    maxRetries: "Maksymalna liczba ponownych prób",
    retryDelay: "Opóźnienie ponownej próby (ms)",
    circuitBreakerThreshold: "Próg wyłącznika",
    circuitBreakerTimeout: "Timeout wyłącznika (ms)",
  },
  monitoring: {
    healthCheckInterval: "Interwał sprawdzania zdrowia (ms)",
    metricsEnabled: "Metryki włączone",
    loggingLevel: "Poziom logowania",
  },
  development: {
    debugMode: "Tryb debugowania",
    testMode: "Tryb testowy",
  },
  messages: {
    validation: {
      failed: "Walidacja konfiguracji nie powiodła się",
    },
    update: {
      success: "Konfiguracja została pomyślnie zaktualizowana",
      failed: "Nie udało się zaktualizować konfiguracji",
    },
    reset: {
      success:
        "Konfiguracja została pomyślnie zresetowana do wartości domyślnych",
      failed: "Nie udało się zresetować konfiguracji",
    },
    export: {
      success: "Konfiguracja została pomyślnie wyeksportowana",
      failed: "Nie udało się wyeksportować konfiguracji",
    },
    import: {
      invalid: "Importowana konfiguracja jest nieprawidłowa",
      failed: "Nie udało się zaimportować konfiguracji",
    },
    errors: {
      unknown_key: "Nieznany klucz konfiguracji",
      invalid_boolean: "musi być wartością logiczną",
      invalid_number: "musi być liczbą",
      invalid_string: "musi być ciągiem znaków",
      min_value: "musi wynosić co najmniej",
      max_value: "może wynosić co najwyżej",
      invalid_enum: "musi być jednym z",
      unknown_error: "Nieznany błąd",
    },
  },
};
