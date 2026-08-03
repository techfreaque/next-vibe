import type { translations as enTranslations } from "../en";
export const translations: typeof enTranslations = {
  get: {
    title: "Abonnements",
    titleShort: "Abo-Liste",
    description: "Alle Abonnements durchsuchen",
    form: {
      title: "Abo-Verwaltung",
      description: "Abonnements filtern und durchsuchen",
    },
    searchFilters: {
      title: "Suche & Filter",
      description: "Abonnements filtern",
    },
    search: {
      label: "Suche",
      description: "Nach E-Mail oder Name suchen",
      placeholder: "Abonnements suchen...",
    },
    status: {
      label: "Status",
      description: "Nach Status filtern",
      placeholder: "Status wählen...",
    },
    interval: {
      label: "Intervall",
      description: "Nach Abrechnungsintervall filtern",
      placeholder: "Beliebig",
    },
    provider: {
      label: "Anbieter",
      description: "Nach Zahlungsanbieter filtern",
      placeholder: "Beliebig",
    },
    dateFrom: { label: "Von", description: "Startdatum" },
    dateTo: { label: "Bis", description: "Enddatum" },
    sortingOptions: {
      title: "Sortierung",
      description: "Sortierung konfigurieren",
    },
    sortBy: {
      label: "Sortieren nach",
      description: "Sortierfeld",
      placeholder: "Feld wählen...",
    },
    sortOrder: {
      label: "Reihenfolge",
      description: "Sortierrichtung",
      placeholder: "Reihenfolge...",
    },
    response: {
      title: "Abonnements",
      description: "Passende Abonnements",
      subscriptions: {
        id: "ID",
        userEmail: "E-Mail",
        userName: "Name",
        planId: "Plan",
        billingInterval: "Intervall",
        status: "Status",
        createdAt: "Gestartet",
        currentPeriodEnd: "Periodenende",
        cancelAtPeriodEnd: "Kündigung zum Ende",
        canceledAt: "Gekündigt am",
        cancellationReason: "Kündigungsgrund",
        provider: "Anbieter",
        providerSubscriptionId: "Anbieter-ID",
      },
      totalCount: "Gesamtanzahl",
      pageCount: "Seiten",
    },
    page: { label: "Seite" },
    limit: { label: "Pro Seite" },
    errors: {
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Anmeldung erforderlich",
      },
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Parameter",
      },
      forbidden: {
        title: "Zugriff verweigert",
        description: "Admin-Zugang erforderlich",
      },
      server: {
        title: "Serverfehler",
        description: "Abonnements konnten nicht abgerufen werden",
        detail: "Abonnementliste nicht abrufbar: {{error}}",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Unerwarteter Fehler",
      },
      conflict: { title: "Konflikt", description: "Datenkonflikt" },
      network: {
        title: "Netzwerkfehler",
        description: "Verbindung fehlgeschlagen",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Keine Abonnements gefunden",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Ungespeicherte Änderungen",
      },
    },
    success: { title: "Erfolg", description: "Abonnements abgerufen" },
  },
  widget: {
    noSubscriptions: "Keine Abonnements gefunden.",
    noMatchingSubscriptions: "Keine Abonnements entsprechen den Filtern.",
    searchPlaceholder: "Nach E-Mail oder Name suchen...",
    refresh: "Aktualisieren",
    viewStats: "Statistiken",
  },
  enums: {
    subscriptionStatusFilter: {
      all: "Alle",
      active: "Aktiv",
      trialing: "Test",
      pastDue: "Überfällig",
      canceled: "Storniert",
      unpaid: "Unbezahlt",
      paused: "Pausiert",
    },
    billingIntervalFilter: {
      any: "Beliebig",
      monthly: "Monatlich",
      yearly: "Jährlich",
    },
    providerFilter: {
      any: "Beliebig",
      stripe: "Stripe",
      nowpayments: "NowPayments",
    },
    subscriptionSortField: {
      createdAt: "Erstellt am",
      status: "Status",
      interval: "Intervall",
      userEmail: "E-Mail",
    },
    sortOrder: {
      asc: "Aufsteigend",
      desc: "Absteigend",
    },
  },
};
