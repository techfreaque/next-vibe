import type { translations as enTranslations } from "../en";
export const translations: typeof enTranslations = {
  get: {
    title: "Credit-Käufe",
    titleShort: "Admin-Käufe",
    description: "Kaufhistorie der Credit-Pakete",
    form: {
      title: "Kaufhistorie",
      description: "Credit-Pakete durchsuchen",
    },
    searchFilters: {
      title: "Suche & Filter",
      description: "Käufe filtern",
    },
    search: {
      label: "Suche",
      description: "Nach E-Mail suchen",
      placeholder: "Käufe suchen...",
    },
    packType: {
      label: "Pakettyp",
      description: "Nach Typ filtern",
      placeholder: "Beliebig",
    },
    source: {
      label: "Quelle",
      description: "Nach Kaufquelle filtern",
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
      title: "Käufe",
      description: "Credit-Paket-Kaufhistorie",
      purchases: {
        id: "ID",
        userEmail: "E-Mail",
        userName: "Name",
        packType: "Typ",
        source: "Quelle",
        originalAmount: "Menge",
        remaining: "Verbleibend",
        expiresAt: "Ablauf",
        createdAt: "Gekauft",
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
        description: "Käufe konnten nicht abgerufen werden",
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
        description: "Keine Käufe gefunden",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Ungespeicherte Änderungen",
      },
    },
    success: { title: "Erfolg", description: "Käufe abgerufen" },
  },
  widget: {
    noPurchases: "Keine Credit-Käufe gefunden.",
    noMatchingPurchases: "Keine Käufe entsprechen den Filtern.",
    searchPlaceholder: "Nach E-Mail suchen...",
    refresh: "Aktualisieren",
    expired: "Abgelaufen",
    neverExpires: "Unbegrenzt",
  },
  enums: {
    creditPackTypeFilter: {
      any: "Beliebig",
      subscription: "Abonnement",
      permanent: "Dauerhaft",
      bonus: "Bonus",
      earned: "Verdient",
    },
    creditPackSourceFilter: {
      any: "Beliebig",
      stripePurchase: "Stripe-Kauf",
      stripeSubscription: "Abonnement-Guthaben",
      adminGrant: "Admin-Zuweisung",
      referralEarning: "Empfehlungsverdienst",
    },
    purchaseSortField: {
      createdAt: "Erstellt am",
      amount: "Betrag",
      type: "Typ",
      userEmail: "E-Mail",
    },
    sortOrder: {
      asc: "Aufsteigend",
      desc: "Absteigend",
    },
  },
};
