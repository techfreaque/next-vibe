import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  errorTypes: {
    auth_error: "Błąd uwierzytelniania",
    bad_request: "Nieprawidłowe żądanie",
    database_error: "Błąd bazy danych",
    email_error: "Błąd e-mail",
    external_service_error: "Błąd usługi zewnętrznej",
    forbidden: "Zabronione",
    http_error: "Błąd HTTP",
    internal_error: "Błąd wewnętrzny",
    invalid_credentials_error: "Nieprawidłowe dane logowania",
    invalid_data_error: "Nieprawidłowe dane",
    invalid_format_error: "Nieprawidłowy format",
    invalid_input_error: "Nieprawidłowe dane wejściowe",
    invalid_method_error: "Nieprawidłowa metoda",
    invalid_parameter_error: "Nieprawidłowy parametr",
    invalid_path_error: "Nieprawidłowa ścieżka",
    invalid_payload_error: "Nieprawidłowy ładunek",
    invalid_query_error: "Nieprawidłowe zapytanie",
    invalid_request_error: "Nieprawidłowe żądanie",
    invalid_response_error: "Nieprawidłowa odpowiedź",
    invalid_status_error: "Nieprawidłowy status",
    invalid_token_error: "Nieprawidłowy token",
    invalid_url_error: "Nieprawidłowy adres URL",
    no_response_data: "Brak danych odpowiedzi",
    not_found: "Nie znaleziono",
    partial_failure: "Częściowe niepowodzenie",
    payment_failed: "Płatność nie powiodła się",
    payment_required: "Wymagana płatność",
    permission_denied: "Odmowa dostępu",
    permission_error: "Błąd uprawnień",
    sms_error: "Błąd SMS",
    token_expired_error: "Token wygasł",
    two_factor_required: "Wymagane uwierzytelnianie dwuskładnikowe",
    unauthorized: "Nieautoryzowany",
    unknown_error: "Nieznany błąd",
    validation_error: "Błąd walidacji",
  },
  stats: {
    chartType: {
      area: "Obszar",
      bar: "Słupkowy",
      donut: "Pierścieniowy",
      line: "Liniowy",
      pie: "Kołowy",
    },
    dateRange: {
      custom: "Niestandardowy",
      last30Days: "Ostatnie 30 dni",
      last7Days: "Ostatnie 7 dni",
      last90Days: "Ostatnie 90 dni",
      lastMonth: "Ostatni miesiąc",
      lastQuarter: "Ostatni kwartał",
      lastWeek: "Ostatni tydzień",
      lastYear: "Ostatni rok",
      thisMonth: "Bieżący miesiąc",
      thisQuarter: "Bieżący kwartał",
      thisWeek: "Bieżący tydzień",
      thisYear: "Bieżący rok",
      today: "Dziś",
      yesterday: "Wczoraj",
    },
    timePeriod: {
      day: "Dzień",
      month: "Miesiąc",
      quarter: "Kwartał",
      week: "Tydzień",
      year: "Rok",
    },
  },
  errors: {
    invalid_request_data: "Nieprawidłowe dane żądania",
    invalidLocaleDetail: 'Nieprawidłowy locale "{{locale}}"',
    invalidRequestDataDetail: "Nieprawidłowe dane żądania: {{error}}",
    invalidResponseDetail: "Nieprawidłowe dane odpowiedzi: {{error}}",
    invalidErrorResponseDetail: "Błędna odpowiedź błędu: {{error}}",
    csrfFailedDetail: "Żądanie zablokowane przez ochronę CSRF: {{reason}}",
    csrfReasonUnknown: "Weryfikacja tokenu CSRF nie powiodła się",
    internalDetail: "Błąd wewnętrzny: {{error}}",
    authenticationFailed: "Uwierzytelnianie użytkownika nie powiodło się",
  },
  validation: {
    missingFields: "Brakuje wymaganych pól ({{count}}):",
    failedOne: "Walidacja nie powiodła się (1 błąd):",
    failedMany: "Walidacja nie powiodła się (błędów: {{count}}):",
    cliHints:
      "\n\nPrzykład:\n  {{example}}\n\nAlbo uruchom interaktywnie:\n  {{interactive}}\n\nWięcej informacji:\n  {{help}}",
    report: "{{header}}{{fields}}{{hints}}",
    unexpected: "Walidacja nieoczekiwanie nie powiodła się: {{error}}",
  },
  shared: {
    permissions: {
      errors: {
        definitionError: "Błąd definicji punktu końcowego: {{reason}}",
        allowedRolesMissing:
          "Błąd definicji punktu końcowego: brakuje allowedRoles albo nie jest listą",
        platformAccessDenied: {
          productionDisabled:
            "Odmowa dostępu na {{platform}}: ten punkt końcowy jest wyłączony na produkcji",
          platformExcluded:
            "Odmowa dostępu na {{platform}}: ten punkt końcowy nie jest udostępniony na tej platformie",
          cliPackageAuthRequired:
            "Odmowa dostępu na {{platform}}: ten punkt końcowy wymaga uwierzytelnienia, którego pakiet CLI nie zapewnia",
          mcpNotListed:
            "Odmowa dostępu na {{platform}}: ten punkt końcowy nie jest wystawiony na MCP",
        },
        insufficientRoles:
          "Użytkownik {{userId}} nie ma wymaganych ról: {{requiredRoles}} (posiada: {{userRoles}})",
        insufficientRolesNoRoles:
          "Użytkownik {{userId}} nie ma wymaganych ról: {{requiredRoles}} (posiada: brak)",
        insufficientRolesPublic:
          "Dostęp publiczny nie ma wymaganych ról: {{requiredRoles}} (posiada: {{userRoles}})",
        insufficientRolesPublicNoRoles:
          "Dostęp publiczny nie ma wymaganych ról: {{requiredRoles}} (posiada: brak)",
      },
    },
    endpoints: {
      definition: {
        loader: {
          errors: {
            endpointNotFound: "Nie znaleziono punktu końcowego: {{identifier}}",
            loadFailed:
              "Nie udało się załadować punktu końcowego {{identifier}}: {{error}}",
            batchLoadFailed:
              "Nie udało się załadować {{failedCount}} z {{totalCount}} punktów końcowych",
            batchLoadError:
              "Nie udało się załadować {{failedCount}} z {{totalCount}} punktów końcowych: {{error}}",
          },
        },
      },
    },
  },
};
