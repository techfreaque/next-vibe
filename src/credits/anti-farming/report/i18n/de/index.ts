import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { antiFarming: "Anti-Farming", admin: "Admin" },
  get: {
    title: "Gratis-Credit-Farming-Bericht",
    titleShort: "Farming-Bericht",
    description:
      "Wer Gratis-Credits abgreift. Top-Subnetze nach geblockten Versuchen und nach beanspruchten Gratis-Pools, Top-E-Mail-Domains bei doppelten und Wegwerf-Anmeldungen, dazu die aktiven Limits.",
    fields: {
      days: {
        label: "Zeitraum (Tage)",
        description:
          "So viele Tage zurück für geblockte Versuche, Gast-Pools und E-Mail-Domains. Konto-Pools zählen immer den laufenden UTC-Monat.",
      },
    },
    response: {
      window: "Zeitraum",
      thresholds: "Aktive Limits",
      totals: "Geblockte Versuche",
      subnetsByBlocked: "Top-Subnetze nach geblockten Versuchen",
      subnetsByClaims: "Top-Subnetze nach beanspruchten Gratis-Pools",
      emailDomains: "Top-E-Mail-Domains",
    },
    success: {
      title: "Farming-Bericht bereit",
      description: "Anti-Farming-Bericht erstellt",
    },
    errors: {
      unauthorized: {
        title: "Nicht angemeldet",
        description: "Bitte zuerst anmelden",
      },
      forbidden: { title: "Kein Zugriff", description: "Nur für Admins" },
      server: {
        title: "Serverfehler",
        description: "Farming-Bericht konnte nicht erstellt werden",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Etwas ist schiefgelaufen",
      },
      validation: {
        title: "Ungültige Anfrage",
        description: "Tage müssen zwischen 1 und 365 liegen",
      },
      notFound: { title: "Nicht gefunden", description: "Nichts gefunden" },
      conflict: { title: "Konflikt", description: "Anfrage kollidiert" },
      network: {
        title: "Netzwerkfehler",
        description: "Anfrage hat den Server nicht erreicht",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Erst Änderungen speichern",
      },
    },
  },
  widget: {
    refresh: "Aktualisieren",
    loading: "Farming-Bericht wird geladen...",
    windowLine:
      "Letzte {{days}} Tage (seit {{from}}). Konto-Pools: {{month}} (UTC).",
    kpi: {
      total: "Geblockt gesamt",
      subnetAccountLimit: "Konto-Limit erreicht",
      subnetGuestLimit: "Gast-Limit erreicht",
      duplicateEmail: "Doppelte E-Mail",
      disposableEmail: "Wegwerf-E-Mail",
    },
    col: {
      subnet: "Subnetz",
      blocked: "Geblockt",
      accountGranted: "Konto ja",
      accountBlocked: "Konto nein",
      guestGranted: "Gast ja",
      guestBlocked: "Gast nein",
      lastSeen: "Zuletzt",
      domain: "Domain",
      duplicate: "Doppelt",
      disposable: "Wegwerf",
      total: "Gesamt",
    },
    colHint:
      "Konto = Konto-Pools diesen Monat, Gast = Gast-Pools im Zeitraum. ja = Gratis-Credits erhalten, nein = Subnetz-Kontingent voll.",
    empty: {
      subnets: "Keine Subnetz-Aktivität in diesem Zeitraum.",
      domains: "Keine doppelten oder Wegwerf-Anmeldungen in diesem Zeitraum.",
    },
    limits: {
      accountPerSubnet: "Konto-Pools pro Subnetz und Monat",
      guestPerSubnet: "Gast-Pools pro Subnetz und Tag",
      guestIpWindow: "Gäste einer IP teilen sich einen Pool für (Stunden)",
      signupLookback:
        "Gast-Verbrauch zählt bei Anmeldung rückwirkend (Stunden)",
      subnetPrefix: "Subnetzgröße",
    },
  },
};
