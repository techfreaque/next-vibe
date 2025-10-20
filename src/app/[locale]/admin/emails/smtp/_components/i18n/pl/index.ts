import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  admin: {
    status: {
      active: "Aktywne",
      inactive: "Nieaktywne",
      suspended: "Zawieszone",
      error: "Błąd",
      testing: "Test",
    },
    purpose: {
      system: "System",
      campaign: "Kampania",
      transactional: "Transakcyjne",
      notification: "Powiadomienie",
      none: "Brak",
    },
    health: {
      healthy: "Zdrowe",
      warning: "Ostrzeżenie",
      critical: "Krytyczne",
      unknown: "Nieznane",
      degraded: "Pogorszone",
    },
    security: {
      none: "Brak",
      tls: "TLS",
      ssl: "SSL",
      starttls: "STARTTLS",
    },
    form: {
      basicInfo: "Podstawowe informacje",
      basicInfoDescription: "Skonfiguruj podstawowe szczegóły konta i cel",
      connectionSettings: "Ustawienia połączenia",
      connectionSettingsDescription:
        "Skonfiguruj szczegóły połączenia serwera SMTP",
      emailSettings: "Ustawienia e-mail",
      emailSettingsDescription:
        "Skonfiguruj e-mail nadawcy i nazwę wyświetlaną",
      advancedSettings: "Ustawienia zaawansowane",
      advancedSettingsDescription:
        "Skonfiguruj limity czasu, ograniczenia i priorytet",
      selectionCriteria: "Kryteria wyboru",
      selectionCriteriaDescription:
        "Skonfiguruj automatyczne reguły wyboru konta",
    },
    fields: {
      name: "Nazwa konta",
      namePlaceholder: "Wprowadź nazwę konta",
      description: "Opis",
      descriptionPlaceholder: "Wprowadź opis konta",
      purpose: "Cel",
      purposePlaceholder: "Wybierz cel konta",
      host: "Host SMTP",
      hostPlaceholder: "smtp.example.com",
      port: "Port",
      portPlaceholder: "587",
      securityType: "Typ zabezpieczeń",
      securityTypePlaceholder: "Wybierz typ zabezpieczeń",
      username: "Nazwa użytkownika",
      usernamePlaceholder: "Wprowadź nazwę użytkownika SMTP",
      password: "Hasło",
      passwordPlaceholder: "Wprowadź hasło SMTP",
      fromEmail: "Od e-mail",
      fromEmailPlaceholder: "noreply@example.com",
      replyToEmail: "Odpowiedz na e-mail",
      replyToEmailPlaceholder: "support@example.com",
      replyToName: "Odpowiedz na nazwa",
      replyToNamePlaceholder: "Zespół wsparcia",
      isDefault: "Konto domyślne",
      isDefaultDescription: "Użyj tego konta jako domyślnego dla jego celu",
      priority: "Priorytet",
      priorityPlaceholder: "1-100 (wyższy = więcej priorytetu)",
      connectionTimeout: "Limit czasu połączenia (ms)",
      connectionTimeoutPlaceholder: "30000",
      responseTimeout: "Limit czasu odpowiedzi (ms)",
      responseTimeoutPlaceholder: "60000",
      maxConnections: "Maks. połączenia",
      maxConnectionsPlaceholder: "5",
      rateLimitPerHour: "Limit szybkości (e-maile/godzina)",
      rateLimitPerHourPlaceholder: "100",
      rateLimitPerDay: "Limit szybkości (e-maile/dzień)",
      rateLimitPerDayPlaceholder: "1000",
      maxRetries: "Maks. ponowne próby",
      maxRetriesPlaceholder: "3",
      retryDelay: "Opóźnienie ponownej próby (ms)",
      retryDelayPlaceholder: "5000",
      weight: "Waga",
      weightPlaceholder: "1-100 (wyższy = bardziej prawdopodobny wybór)",
      failoverPriority: "Priorytet failover",
      failoverPriorityPlaceholder:
        "0-100 (wyższy = używany pierwszy w failover)",
      isExactMatch: "Tylko dokładne dopasowanie",
      isExactMatchDescription:
        "Używaj tego konta tylko dla dokładnych dopasowań kryteriów",
      isFailover: "Konto failover",
      isFailoverDescription: "Używaj tego konta gdy główne konta zawodzą",
      campaignTypes: "Typy kampanii",
      campaignTypesDescription:
        "Wybierz które typy kampanii mogą używać tego konta",
      campaignTypesPlaceholder: "Skonfiguruj ograniczenia typów kampanii",
      countries: "Kraje",
      countriesDescription: "Wybierz które kraje mogą używać tego konta",
      countriesPlaceholder: "Skonfiguruj ograniczenia krajów",
      languages: "Języki",
      languagesDescription: "Wybierz które języki mogą używać tego konta",
      languagesPlaceholder: "Skonfiguruj ograniczenia językowe",
      // New multi-select fields
      emailJourneyVariants: "Warianty podróży e-mail",
      emailJourneyVariantsDescription:
        "Wybierz które warianty podróży e-mail mogą używać tego konta",
      emailJourneyVariantsPlaceholder: "Wybierz warianty podróży",
      emailCampaignStages: "Etapy kampanii e-mail",
      emailCampaignStagesDescription:
        "Wybierz które etapy kampanii mogą używać tego konta",
      emailCampaignStagesPlaceholder: "Wybierz etapy kampanii",
    },
    // Campaign type options
    campaignTypes: {
      leadCampaign: "Kampania leadów",
      newsletter: "Newsletter",
      transactional: "Transakcyjne",
      notification: "Powiadomienie",
      system: "System",
    },
    // Email journey variant options
    emailJourneyVariants: {
      personalApproach: "Podejście osobiste",
      resultsFocused: "Skoncentrowane na wynikach",
      personalResults: "Osobiste wyniki",
    },
    // Email campaign stage options
    emailCampaignStages: {
      notStarted: "Nie rozpoczęte",
      initial: "Początkowe",
      followup1: "Kontynuacja 1",
      followup2: "Kontynuacja 2",
      followup3: "Kontynuacja 3",
      nurture: "Pielęgnacja",
      reactivation: "Reaktywacja",
    },
    // Rate limiting and error messages
    errors: {
      rateLimit: {
        exceeded: {
          title: "Przekroczono limit szybkości",
          description:
            "Konto {{accountName}} przekroczyło swój godzinny limit {{limit}} e-maili (aktualnie: {{current}})",
        },
        dailyExceeded: {
          title: "Przekroczono dzienny limit szybkości",
          description:
            "Konto {{accountName}} przekroczyło swój dzienny limit {{dailyLimit}} e-maili (aktualnie: {{current}})",
        },
      },
    },
    create: {
      title: "Utwórz konto SMTP",
      description: "Dodaj nowe konto SMTP do wysyłania e-maili",
      submit: "Utwórz konto",
      submitting: "Tworzenie...",
    },
    edit: {
      title: "Edytuj konto SMTP",
      description: "Zaktualizuj konfigurację konta SMTP",
      submit: "Zaktualizuj konto",
      submitting: "Zapisywanie...",
    },
  },
  filter: {
    search: {
      label: "Szukaj",
      placeholder: "Szukaj kont...",
    },
    purpose: {
      label: "Cel",
      placeholder: "Filtruj według celu",
      all: "Wszystkie cele",
      system: "System",
      campaign: "Kampania",
      transactional: "Transakcyjne",
      notification: "Powiadomienie",
    },
    status: {
      label: "Status",
      placeholder: "Filtruj według statusu",
      all: "Wszystkie statusy",
      active: "Aktywne",
      inactive: "Nieaktywne",
      error: "Błąd",
      testing: "Test",
    },
    health: {
      label: "Zdrowie",
      placeholder: "Filtruj według zdrowia",
      all: "Wszystkie stany zdrowia",
      healthy: "Zdrowe",
      degraded: "Pogorszone",
      unhealthy: "Niezdrowe",
      unknown: "Nieznane",
    },
  },
  list: {
    title: "Konta SMTP",
    titleWithCount: "Konta SMTP ({{count}})",
    description: "Zarządzaj kontami e-mail SMTP i konfiguracjami",
    loading: "Ładowanie kont SMTP...",
    no_results: "Nie znaleziono kont SMTP spełniających kryteria",
    noResults: "Nie znaleziono kont SMTP spełniających kryteria",
    results: {
      showing: "Pokazuje {{start}}-{{end}} z {{total}} kont",
    },
    table: {
      title: "Wszystkie konta SMTP",
      name: "Nazwa konta",
      host: "Host",
      purpose: "Cel",
      status: "Status",
      health: "Zdrowie",
      usage: "Użycie",
      priority: "Priorytet",
      actions: "Akcje",
      fromEmail: "Od e-mail",
      default: "Domyślne",
      weight: "Waga: {{weight}}",
      todayLimit: "Dzisiaj / Limit",
      totalSent: "Łącznie: {{count}} wysłanych",
      unlimited: "Nieograniczony",
    },
    filters: {
      title: "Filtry",
    },
    actions: {
      create: "Utwórz konto",
      createFirst: "Utwórz pierwsze konto",
      refresh: "Odśwież",
      clearFilters: "Wyczyść filtry",
      showFilters: "Pokaż filtry",
      hideFilters: "Ukryj filtry",
      back: "Powrót do kont SMTP",
      cancel: "Anuluj",
      delete: "Usuń konto",
      creating: "Tworzenie...",
    },
    pagination: {
      showing: "Pokazuje {{start}}-{{end}} z {{total}} kont",
      pageOf: "Strona {{current}} z {{total}}",
      previous: "Poprzednia",
      next: "Następna",
    },
  },
  search: {
    placeholder: "Szukaj kont SMTP...",
    error: {
      validation: {
        title: "Błąd walidacji wyszukiwania",
        description: "Proszę podać prawidłowe kryteria wyszukiwania.",
      },
      unauthorized: {
        title: "Nieautoryzowane wyszukiwanie",
        description: "Nie masz uprawnień do przeszukiwania kont SMTP.",
      },
      server: {
        title: "Błąd serwera wyszukiwania",
        description: "Wystąpił błąd serwera podczas przeszukiwania kont SMTP.",
      },
      unknown: {
        title: "Błąd wyszukiwania",
        description:
          "Wystąpił nieoczekiwany błąd podczas przeszukiwania kont SMTP.",
      },
    },
    success: {
      title: "Wyszukiwanie zakończone sukcesem",
      description: "Wyszukiwanie zakończone pomyślnie.",
    },
  },
};
