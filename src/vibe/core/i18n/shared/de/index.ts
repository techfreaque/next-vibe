import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  errorTypes: {
    auth_error: "Authentifizierungsfehler",
    bad_request: "Ungültige Anfrage",
    database_error: "Datenbankfehler",
    email_error: "E-Mail-Fehler",
    external_service_error: "Fehler eines externen Dienstes",
    forbidden: "Verboten",
    http_error: "HTTP-Fehler",
    internal_error: "Interner Fehler",
    invalid_credentials_error: "Ungültige Anmeldedaten",
    invalid_data_error: "Ungültige Daten",
    invalid_format_error: "Ungültiges Format",
    invalid_input_error: "Ungültige Eingabe",
    invalid_method_error: "Ungültige Methode",
    invalid_parameter_error: "Ungültiger Parameter",
    invalid_path_error: "Ungültiger Pfad",
    invalid_payload_error: "Ungültige Nutzlast",
    invalid_query_error: "Ungültige Abfrage",
    invalid_request_error: "Ungültige Anfrage",
    invalid_response_error: "Ungültige Antwort",
    invalid_status_error: "Ungültiger Status",
    invalid_token_error: "Ungültiges Token",
    invalid_url_error: "Ungültige URL",
    no_response_data: "Keine Antwortdaten",
    not_found: "Nicht gefunden",
    partial_failure: "Teilweise fehlgeschlagen",
    payment_failed: "Zahlung fehlgeschlagen",
    payment_required: "Zahlung erforderlich",
    permission_denied: "Zugriff verweigert",
    permission_error: "Berechtigungsfehler",
    sms_error: "SMS-Fehler",
    token_expired_error: "Token abgelaufen",
    two_factor_required: "Zwei-Faktor-Authentifizierung erforderlich",
    unauthorized: "Nicht autorisiert",
    unknown_error: "Unbekannter Fehler",
    validation_error: "Validierungsfehler",
  },
  stats: {
    chartType: {
      area: "Fläche",
      bar: "Balken",
      donut: "Ring",
      line: "Linie",
      pie: "Kreis",
    },
    dateRange: {
      custom: "Benutzerdefiniert",
      last30Days: "Letzte 30 Tage",
      last7Days: "Letzte 7 Tage",
      last90Days: "Letzte 90 Tage",
      lastMonth: "Letzter Monat",
      lastQuarter: "Letztes Quartal",
      lastWeek: "Letzte Woche",
      lastYear: "Letztes Jahr",
      thisMonth: "Dieser Monat",
      thisQuarter: "Dieses Quartal",
      thisWeek: "Diese Woche",
      thisYear: "Dieses Jahr",
      today: "Heute",
      yesterday: "Gestern",
    },
    timePeriod: {
      day: "Tag",
      month: "Monat",
      quarter: "Quartal",
      week: "Woche",
      year: "Jahr",
    },
  },
  errors: {
    invalid_request_data: "Ungültige Anfragedaten",
    invalidLocaleDetail: 'Ungültiges Locale "{{locale}}"',
    invalidRequestDataDetail: "Ungültige Anfragedaten: {{error}}",
    invalidResponseDetail: "Ungültige Antwortdaten: {{error}}",
    invalidErrorResponseDetail: "Fehlerhafte Fehlerantwort: {{error}}",
    csrfFailedDetail: "Anfrage vom CSRF-Schutz blockiert: {{reason}}",
    csrfReasonUnknown: "CSRF-Token-Prüfung fehlgeschlagen",
    internalDetail: "Interner Fehler: {{error}}",
    authenticationFailed: "Benutzer-Authentifizierung fehlgeschlagen",
  },
  validation: {
    missingFields: "Pflichtfelder fehlen ({{count}}):",
    failedOne: "Validierung fehlgeschlagen (1 Fehler):",
    failedMany: "Validierung fehlgeschlagen ({{count}} Fehler):",
    cliHints:
      "\n\nBeispiel:\n  {{example}}\n\nOder interaktiv ausführen:\n  {{interactive}}\n\nWeitere Infos:\n  {{help}}",
    report: "{{header}}{{fields}}{{hints}}",
    unexpected: "Validierung unerwartet fehlgeschlagen: {{error}}",
  },
  shared: {
    permissions: {
      errors: {
        definitionError: "Fehler in der Endpunkt-Definition: {{reason}}",
        allowedRolesMissing:
          "Fehler in der Endpunkt-Definition: allowedRoles fehlt oder ist keine Liste",
        platformAccessDenied: {
          productionDisabled:
            "Zugriff auf {{platform}} verweigert: dieser Endpunkt ist in der Produktion deaktiviert",
          platformExcluded:
            "Zugriff auf {{platform}} verweigert: dieser Endpunkt wird auf dieser Plattform nicht bereitgestellt",
          cliPackageAuthRequired:
            "Zugriff auf {{platform}} verweigert: dieser Endpunkt erfordert eine Authentifizierung, die das CLI-Paket nicht leisten kann",
          mcpNotListed:
            "Zugriff auf {{platform}} verweigert: dieser Endpunkt ist auf MCP nicht gelistet",
        },
        insufficientRoles:
          "Benutzer {{userId}} fehlen erforderliche Rollen: {{requiredRoles}} (vorhanden: {{userRoles}})",
        insufficientRolesNoRoles:
          "Benutzer {{userId}} fehlen erforderliche Rollen: {{requiredRoles}} (vorhanden: keine)",
        insufficientRolesPublic:
          "Öffentlichem Zugriff fehlen erforderliche Rollen: {{requiredRoles}} (vorhanden: {{userRoles}})",
        insufficientRolesPublicNoRoles:
          "Öffentlichem Zugriff fehlen erforderliche Rollen: {{requiredRoles}} (vorhanden: keine)",
      },
    },
    endpoints: {
      definition: {
        loader: {
          errors: {
            endpointNotFound: "Endpunkt nicht gefunden: {{identifier}}",
            loadFailed:
              "Endpunkt {{identifier}} konnte nicht geladen werden: {{error}}",
            batchLoadFailed:
              "{{failedCount}} von {{totalCount}} Endpunkten konnten nicht geladen werden",
            batchLoadError:
              "{{failedCount}} von {{totalCount}} Endpunkten konnten nicht geladen werden: {{error}}",
          },
        },
      },
    },
  },
};
