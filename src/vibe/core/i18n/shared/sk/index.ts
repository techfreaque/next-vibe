import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  errorTypes: {
    auth_error: "Chyba overenia totožnosti",
    bad_request: "Chybná požiadavka",
    conflict: "Konflikt",
    purchased_model_required:
      "Tento model vyžaduje zakúpené kredity. Vyber si bezplatný model alebo si dobi kredity.",
    shared_allowance_reached:
      "Spoločný limit bezplatných kreditov je vyčerpaný. Dobi si kredity alebo počkaj na obnovenie limitu.",
    consent_required: "Vyžaduje sa súhlas",
    database_error: "Chyba databázy",
    email_error: "Chyba e-mailu",
    external_service_error: "Chyba externej služby",
    forbidden: "Prístup zamietnutý",
    http_error: "Chyba HTTP",
    internal_error: "Interná chyba",
    invalid_credentials_error: "Neplatné prihlasovacie údaje",
    invalid_data_error: "Neplatné údaje",
    invalid_format_error: "Neplatný formát",
    invalid_input_error: "Neplatný vstup",
    invalid_method_error: "Neplatná metóda",
    invalid_parameter_error: "Neplatný parameter",
    invalid_path_error: "Neplatná cesta",
    invalid_payload_error: "Neplatný obsah požiadavky",
    invalid_query_error: "Neplatný dopyt",
    invalid_request_error: "Neplatná požiadavka",
    invalid_response_error: "Neplatná odpoveď",
    invalid_status_error: "Neplatný stav",
    invalid_token_error: "Neplatný token",
    invalid_url_error: "Neplatná adresa URL",
    no_response_data: "Odpoveď neobsahuje údaje",
    not_found: "Nenašlo sa",
    partial_failure: "Čiastočné zlyhanie",
    payment_failed: "Platba zlyhala",
    payment_required: "Vyžaduje sa platba",
    permission_denied: "Prístup zamietnutý",
    permission_error: "Chyba oprávnení",
    sms_error: "Chyba SMS",
    token_expired_error: "Platnosť tokenu vypršala",
    email_confirmation_required: "Potvrdzovací kód z e-mailu",
    two_factor_required: "Vyžaduje sa dvojfaktorové overenie",
    unauthorized: "Vyžaduje sa prihlásenie",
    unknown_error: "Neznáma chyba",
    validation_error: "Chyba overenia údajov",
  },
  stats: {
    chartType: {
      area: "Plošný",
      bar: "Stĺpcový",
      donut: "Prstencový",
      line: "Čiarový",
      pie: "Koláčový",
    },
    dateRange: {
      custom: "Vlastný rozsah",
      last30Days: "Posledných 30 dní",
      last7Days: "Posledných 7 dní",
      last90Days: "Posledných 90 dní",
      lastMonth: "Minulý mesiac",
      lastQuarter: "Minulý štvrťrok",
      lastWeek: "Minulý týždeň",
      lastYear: "Minulý rok",
      thisMonth: "Tento mesiac",
      thisQuarter: "Tento štvrťrok",
      thisWeek: "Tento týždeň",
      thisYear: "Tento rok",
      today: "Dnes",
      yesterday: "Včera",
    },
    timePeriod: {
      day: "Deň",
      month: "Mesiac",
      quarter: "Štvrťrok",
      week: "Týždeň",
      year: "Rok",
    },
  },
  errors: {
    invalid_request_data: "Neplatné údaje požiadavky",
    invalidLocaleDetail: "Neplatný kód jazyka a regiónu „{{locale}}“",
    invalidRequestDataDetail: "Neplatné údaje požiadavky: {{error}}",
    invalidResponseDetail: "Neplatné údaje odpovede: {{error}}",
    invalidErrorResponseDetail: "Chybová odpoveď má neplatný formát: {{error}}",
    csrfFailedDetail: "Ochrana CSRF zablokovala požiadavku: {{reason}}",
    csrfReasonUnknown: "Overenie tokenu CSRF zlyhalo",
    uploadTooLargeDetail:
      "Súbory majú spolu {{size}} MB. Limit na jednu správu je {{limit}} MB. Odstráň alebo zmenši prílohu a odošli správu znova.",
    internalDetail: "Interná chyba: {{error}}",
    authenticationFailed: "Overenie totožnosti používateľa zlyhalo",
  },
  validation: {
    invalidEmail: "Zadajte platnú e-mailovú adresu.",
    missingFields: "Chýbajú povinné polia ({{count}}):",
    failedOne: "Overenie údajov zlyhalo (1 chyba):",
    failedMany: "Overenie údajov zlyhalo (počet chýb: {{count}}):",
    cliHints:
      "\n\nPríklad:\n  {{example}}\n\nAlebo spustite interaktívne:\n  {{interactive}}\n\nViac informácií:\n  {{help}}",
    report: "{{header}}{{fields}}{{hints}}",
    unexpected: "Neočakávaná chyba pri overovaní údajov: {{error}}",
  },
  shared: {
    permissions: {
      errors: {
        definitionError: "Chyba v definícii koncového bodu: {{reason}}",
        allowedRolesMissing:
          "Chyba v definícii koncového bodu: pole allowedRoles chýba alebo nemá formát zoznamu",
        platformAccessDenied: {
          productionDisabled:
            "Prístup z platformy {{platform}} bol zamietnutý. Koncový bod je v produkcii vypnutý.",
          platformExcluded:
            "Prístup z platformy {{platform}} bol zamietnutý. Koncový bod na tejto platforme nie je dostupný.",
          cliPackageAuthRequired:
            "Prístup z platformy {{platform}} bol zamietnutý. Koncový bod vyžaduje overenie totožnosti, ktoré balík CLI neposkytuje.",
          mcpNotListed:
            "Prístup z platformy {{platform}} bol zamietnutý. Koncový bod nie je v zozname nástrojov MCP.",
        },
        insufficientRoles:
          "Používateľ {{userId}} nemá požadované roly: {{requiredRoles}} (pridelené: {{userRoles}})",
        insufficientRolesNoRoles:
          "Používateľ {{userId}} nemá požadované roly: {{requiredRoles}} (pridelené: žiadne)",
        insufficientRolesPublic:
          "Pri verejnom prístupe chýbajú požadované roly: {{requiredRoles}} (pridelené: {{userRoles}})",
        insufficientRolesPublicNoRoles:
          "Pri verejnom prístupe chýbajú požadované roly: {{requiredRoles}} (pridelené: žiadne)",
      },
    },
    endpoints: {
      definition: {
        loader: {
          errors: {
            endpointNotFound: "Koncový bod sa nenašiel: {{identifier}}",
            loadFailed:
              "Koncový bod {{identifier}} sa nepodarilo načítať: {{error}}",
            batchLoadFailed:
              "Nepodarilo sa načítať {{failedCount}} z {{totalCount}} koncových bodov",
            batchLoadError:
              "Nepodarilo sa načítať {{failedCount}} z {{totalCount}} koncových bodov: {{error}}",
          },
        },
      },
    },
  },
};
