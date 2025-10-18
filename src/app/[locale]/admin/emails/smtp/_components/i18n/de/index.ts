import { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  admin: {
    status: {
      active: "Aktiv",
      inactive: "Inaktiv",
      suspended: "Gesperrt",
      error: "Fehler",
      testing: "Test",
    },
    purpose: {
      system: "System",
      campaign: "Kampagne",
      transactional: "Transaktional",
      notification: "Benachrichtigung",
      none: "Keine",
    },
    health: {
      healthy: "Gesund",
      warning: "Warnung",
      critical: "Kritisch",
      unknown: "Unbekannt",
      degraded: "Beeinträchtigt",
    },
    security: {
      none: "Keine",
      tls: "TLS",
      ssl: "SSL",
      starttls: "STARTTLS",
    },
    form: {
      basicInfo: "Grundinformationen",
      basicInfoDescription: "Grundlegende Kontodetails und Zweck konfigurieren",
      connectionSettings: "Verbindungseinstellungen",
      connectionSettingsDescription:
        "SMTP-Server-Verbindungsdetails konfigurieren",
      emailSettings: "E-Mail-Einstellungen",
      emailSettingsDescription: "Absender-E-Mail und Anzeigename konfigurieren",
      advancedSettings: "Erweiterte Einstellungen",
      advancedSettingsDescription:
        "Timeouts, Limits und Priorität konfigurieren",
      selectionCriteria: "Auswahlkriterien",
      selectionCriteriaDescription:
        "Automatische Kontoauswahlregeln konfigurieren",
    },
    fields: {
      name: "Kontoname",
      namePlaceholder: "Kontoname eingeben",
      description: "Beschreibung",
      descriptionPlaceholder: "Kontobeschreibung eingeben",
      purpose: "Zweck",
      purposePlaceholder: "Kontozweck auswählen",
      host: "SMTP-Host",
      hostPlaceholder: "smtp.example.com",
      port: "Port",
      portPlaceholder: "587",
      securityType: "Sicherheitstyp",
      securityTypePlaceholder: "Sicherheitstyp auswählen",
      username: "Benutzername",
      usernamePlaceholder: "SMTP-Benutzername eingeben",
      password: "Passwort",
      passwordPlaceholder: "SMTP-Passwort eingeben",
      fromEmail: "Von E-Mail",
      fromEmailPlaceholder: "noreply@example.com",
      replyToEmail: "Antwort-an E-Mail",
      replyToEmailPlaceholder: "support@example.com",
      replyToName: "Antwort-an Name",
      replyToNamePlaceholder: "Support-Team",
      isDefault: "Standardkonto",
      isDefaultDescription:
        "Dieses Konto als Standard für seinen Zweck verwenden",
      priority: "Priorität",
      priorityPlaceholder: "1-100 (höher = mehr Priorität)",
      connectionTimeout: "Verbindungs-Timeout (ms)",
      connectionTimeoutPlaceholder: "30000",
      responseTimeout: "Antwort-Timeout (ms)",
      responseTimeoutPlaceholder: "60000",
      maxConnections: "Max. Verbindungen",
      maxConnectionsPlaceholder: "5",
      rateLimitPerHour: "Ratenlimit (E-Mails/Stunde)",
      rateLimitPerHourPlaceholder: "100",
      rateLimitPerDay: "Ratenlimit (E-Mails/Tag)",
      rateLimitPerDayPlaceholder: "1000",
      maxRetries: "Max. Wiederholungen",
      maxRetriesPlaceholder: "3",
      retryDelay: "Wiederholungsverzögerung (ms)",
      retryDelayPlaceholder: "5000",
      weight: "Gewicht",
      weightPlaceholder: "1-100 (höher = wahrscheinlicher ausgewählt)",
      failoverPriority: "Failover-Priorität",
      failoverPriorityPlaceholder:
        "0-100 (höher = zuerst bei Failover verwendet)",
      isExactMatch: "Nur exakte Übereinstimmung",
      isExactMatchDescription:
        "Dieses Konto nur für exakte Kriterienübereinstimmungen verwenden",
      isFailover: "Failover-Konto",
      isFailoverDescription:
        "Dieses Konto verwenden, wenn primäre Konten fehlschlagen",
      campaignTypes: "Kampagnentypen",
      campaignTypesDescription:
        "Auswählen, welche Kampagnentypen dieses Konto verwenden können",
      campaignTypesPlaceholder: "Kampagnentyp-Beschränkungen konfigurieren",
      countries: "Länder",
      countriesDescription:
        "Auswählen, welche Länder dieses Konto verwenden können",
      countriesPlaceholder: "Länderbeschränkungen konfigurieren",
      languages: "Sprachen",
      languagesDescription:
        "Auswählen, welche Sprachen dieses Konto verwenden können",
      languagesPlaceholder: "Sprachbeschränkungen konfigurieren",
      // New multi-select fields
      emailJourneyVariants: "E-Mail-Journey-Varianten",
      emailJourneyVariantsDescription:
        "Wählen Sie aus, welche E-Mail-Journey-Varianten dieses Konto verwenden können",
      emailJourneyVariantsPlaceholder: "Journey-Varianten auswählen",
      emailCampaignStages: "E-Mail-Kampagnenphasen",
      emailCampaignStagesDescription:
        "Wählen Sie aus, welche Kampagnenphasen dieses Konto verwenden können",
      emailCampaignStagesPlaceholder: "Kampagnenphasen auswählen",
    },
    // Campaign type options
    campaignTypes: {
      leadCampaign: "Lead-Kampagne",
      newsletter: "Newsletter",
      transactional: "Transaktional",
      notification: "Benachrichtigung",
      system: "System",
    },
    // Email journey variant options
    emailJourneyVariants: {
      personalApproach: "Persönlicher Ansatz",
      resultsFocused: "Ergebnisorientiert",
      personalResults: "Persönliche Ergebnisse",
    },
    // Email campaign stage options
    emailCampaignStages: {
      notStarted: "Nicht gestartet",
      initial: "Initial",
      followup1: "Nachfassung 1",
      followup2: "Nachfassung 2",
      followup3: "Nachfassung 3",
      nurture: "Pflege",
      reactivation: "Reaktivierung",
    },
    // Rate limiting and error messages
    errors: {
      rateLimit: {
        exceeded: {
          title: "Ratenlimit überschritten",
          description:
            "Konto {{accountName}} hat sein stündliches Limit von {{limit}} E-Mails überschritten (aktuell: {{current}})",
        },
        dailyExceeded: {
          title: "Tägliches Ratenlimit überschritten",
          description:
            "Konto {{accountName}} hat sein tägliches Limit von {{dailyLimit}} E-Mails überschritten (aktuell: {{current}})",
        },
      },
    },
    create: {
      title: "SMTP-Konto erstellen",
      description: "Neues SMTP-Konto zum Senden von E-Mails hinzufügen",
      submit: "Konto erstellen",
      submitting: "Erstelle...",
    },
    edit: {
      title: "SMTP-Konto bearbeiten",
      description: "SMTP-Kontokonfiguration aktualisieren",
      submit: "Konto aktualisieren",
      submitting: "Speichere...",
    },
  },
  filter: {
    search: {
      label: "Suchen",
      placeholder: "Konten suchen...",
    },
    purpose: {
      label: "Zweck",
      placeholder: "Nach Zweck filtern",
      all: "Alle Zwecke",
      system: "System",
      campaign: "Kampagne",
      transactional: "Transaktional",
      notification: "Benachrichtigung",
    },
    status: {
      label: "Status",
      placeholder: "Nach Status filtern",
      all: "Alle Status",
      active: "Aktiv",
      inactive: "Inaktiv",
      error: "Fehler",
      testing: "Test",
    },
    health: {
      label: "Gesundheit",
      placeholder: "Nach Gesundheit filtern",
      all: "Alle Gesundheitszustände",
      healthy: "Gesund",
      degraded: "Beeinträchtigt",
      unhealthy: "Ungesund",
      unknown: "Unbekannt",
    },
  },
  list: {
    title: "SMTP-Konten",
    titleWithCount: "SMTP-Konten ({{count}})",
    description: "Verwalten Sie Ihre SMTP-E-Mail-Konten und -Konfigurationen",
    loading: "SMTP-Konten werden geladen...",
    no_results: "Keine SMTP-Konten gefunden, die Ihren Kriterien entsprechen",
    noResults: "Keine SMTP-Konten gefunden, die Ihren Kriterien entsprechen",
    results: {
      showing: "Zeige {{start}}-{{end}} von {{total}} Konten",
    },
    table: {
      title: "Alle SMTP-Konten",
      name: "Kontoname",
      host: "Host",
      purpose: "Zweck",
      status: "Status",
      health: "Gesundheit",
      usage: "Nutzung",
      priority: "Priorität",
      actions: "Aktionen",
      fromEmail: "Von E-Mail",
      default: "Standard",
      weight: "Gewicht: {{weight}}",
      todayLimit: "Heute / Limit",
      totalSent: "Gesamt: {{count}} gesendet",
      unlimited: "Unbegrenzt",
    },
    filters: {
      title: "Filter",
    },
    actions: {
      create: "Konto erstellen",
      createFirst: "Erstes Konto erstellen",
      refresh: "Aktualisieren",
      clearFilters: "Filter löschen",
      showFilters: "Filter anzeigen",
      hideFilters: "Filter ausblenden",
      back: "Zurück zu SMTP-Konten",
      delete: "Konto löschen",
    },
    pagination: {
      showing: "Zeige {{start}}-{{end}} von {{total}} Konten",
      pageOf: "Seite {{current}} von {{total}}",
      previous: "Vorherige",
      next: "Nächste",
    },
  },
  search: {
    placeholder: "SMTP-Konten suchen...",
    error: {
      validation: {
        title: "Suchvalidierungsfehler",
        description: "Bitte geben Sie gültige Suchkriterien an.",
      },
      unauthorized: {
        title: "Nicht autorisierte Suche",
        description:
          "Sie haben keine Berechtigung, SMTP-Konten zu durchsuchen.",
      },
      server: {
        title: "Such-Serverfehler",
        description:
          "Ein Serverfehler ist beim Durchsuchen der SMTP-Konten aufgetreten.",
      },
      unknown: {
        title: "Suchfehler",
        description:
          "Ein unerwarteter Fehler ist beim Durchsuchen der SMTP-Konten aufgetreten.",
      },
    },
    success: {
      title: "Suche erfolgreich",
      description: "Suche erfolgreich abgeschlossen.",
    },
  },
};
