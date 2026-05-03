export const translations = {
  category: "Abonnements",
  tags: {
    admin: "Admin",
    stats: "Statistiken",
    list: "Liste",
    purchases: "Käufe",
    referrals: "Empfehlungen",
  },
  stats: {
    get: {
      title: "Abo-Statistiken",
      description: "Umsatz-, Abo-, Credit- und Empfehlungskennzahlen",
      form: {
        title: "Statistik-Dashboard",
        description: "Geschäftskennzahlen",
      },
      timePeriodOptions: {
        title: "Zeitraum",
        description: "Zeitraum konfigurieren",
      },
      timePeriod: { label: "Zeitraum", description: "Gruppierungsintervall" },
      dateRangePreset: {
        label: "Datumsbereich",
        description: "Vordefinierter Zeitraum",
      },
      response: {
        revenueStats: {
          title: "Umsatz",
          description: "Umsatzkennzahlen",
          mrr: { label: "MRR" },
          arr: { label: "ARR" },
          totalRevenue: { label: "Gesamtumsatz" },
          avgOrderValue: { label: "Ø Bestellwert" },
        },
        subscriptionStats: {
          title: "Abonnements",
          description: "Abo-Zahlen",
          activeCount: { label: "Aktiv" },
          trialingCount: { label: "Testphase" },
          canceledCount: { label: "Gekündigt" },
          churnRate: { label: "Abwanderungsrate" },
        },
        intervalStats: {
          title: "Abrechnungsintervalle",
          description: "Monatlich vs. jährlich",
          monthlyCount: { label: "Monatlich" },
          yearlyCount: { label: "Jährlich" },
          yearlyRevenuePct: { label: "% Jahresumsatz" },
        },
        creditStats: {
          title: "Credits",
          description: "Credit-Kennzahlen",
          totalPurchased: { label: "Gekauft" },
          totalSpent: { label: "Verbraucht" },
          packsSold: { label: "Pakete verkauft" },
          avgPackSize: { label: "Ø Paketgröße" },
        },
        referralStats: {
          title: "Empfehlungen",
          description: "Empfehlungsprogramm",
          totalReferrals: { label: "Gesamt" },
          conversionRate: { label: "Konversion" },
          totalEarned: { label: "Verdient" },
          pendingPayouts: { label: "Ausstehend" },
        },
        growthMetrics: {
          title: "Wachstum",
          description: "Umsatz- und Abo-Trends",
          revenueChart: {
            label: "Umsatzverlauf",
            description: "Umsatztrend",
          },
          subscriptionChart: {
            label: "Abo-Wachstum",
            description: "Aktive Abos",
          },
        },
        businessInsights: {
          title: "Einblicke",
          description: "Generierte Kennzahlen",
          generatedAt: { label: "Erstellt am" },
        },
      },
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
          description: "Statistiken konnten nicht generiert werden",
        },
        unknown: {
          title: "Unbekannter Fehler",
          description: "Ein unerwarteter Fehler ist aufgetreten",
        },
        conflict: { title: "Konflikt", description: "Datenkonflikt" },
        network: {
          title: "Netzwerkfehler",
          description: "Verbindung fehlgeschlagen",
        },
        notFound: {
          title: "Nicht gefunden",
          description: "Statistiken nicht verfügbar",
        },
        unsavedChanges: {
          title: "Ungespeicherte Änderungen",
          description: "Es gibt ungespeicherte Änderungen",
        },
      },
      success: { title: "Erfolg", description: "Statistiken generiert" },
    },
    widget: { refresh: "Aktualisieren" },
  },
  list: {
    get: {
      title: "Abonnement-Liste",
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
    },
  },
  purchases: {
    get: {
      title: "Credit-Käufe",
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
  },
  referrals: {
    get: {
      title: "Empfehlungs-Dashboard",
      description: "Empfehlungscodes, Einnahmen und Auszahlungen",
      form: {
        title: "Empfehlungsverwaltung",
        description: "Empfehlungsprogramm verwalten",
      },
      searchFilters: {
        title: "Suche & Filter",
        description: "Empfehlungsdaten filtern",
      },
      search: {
        label: "Suche",
        description: "Nach E-Mail suchen",
        placeholder: "Empfehlungen suchen...",
      },
      payoutStatus: {
        label: "Auszahlungsstatus",
        description: "Nach Status filtern",
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
        title: "Empfehlungen",
        description: "Empfehlungsprogramm-Daten",
        summary: {
          title: "Zusammenfassung",
          description: "Empfehlungsstatistiken",
          totalCodes: { label: "Codes gesamt" },
          totalSignups: { label: "Anmeldungen" },
          totalEarned: { label: "Verdient" },
          totalPaidOut: { label: "Ausgezahlt" },
          pendingPayouts: { label: "Ausstehend" },
        },
        codes: {
          code: "Code",
          ownerEmail: "Besitzer",
          ownerName: "Name",
          currentUses: "Klicks",
          totalSignups: "Anmeldungen",
          totalEarned: "Verdient",
          isActive: "Aktiv",
          createdAt: "Erstellt",
        },
        payoutRequests: {
          id: "ID",
          userEmail: "Nutzer",
          amountCents: "Betrag",
          currency: "Währung",
          status: "Status",
          walletAddress: "Wallet",
          adminNotes: "Notizen",
          rejectionReason: "Ablehnungsgrund",
          createdAt: "Angefragt",
          processedAt: "Bearbeitet",
        },
        totalCount: "Gesamt",
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
          description: "Empfehlungsdaten konnten nicht abgerufen werden",
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
          description: "Keine Empfehlungsdaten gefunden",
        },
        unsavedChanges: {
          title: "Ungespeicherte Änderungen",
          description: "Ungespeicherte Änderungen",
        },
      },
      success: {
        title: "Erfolg",
        description: "Empfehlungsdaten abgerufen",
      },
    },
    post: {
      title: "Auszahlungsaktion",
      description: "Auszahlung genehmigen, ablehnen oder abschließen",
      form: {
        title: "Auszahlungsaktion",
        description: "Auszahlung bearbeiten",
      },
      requestId: {
        label: "Anfrage-ID",
        description: "Zu bearbeitende Auszahlung",
        placeholder: "ID eingeben...",
      },
      action: {
        label: "Aktion",
        description: "Auszuführende Aktion",
        placeholder: "Aktion wählen...",
      },
      adminNotes: {
        label: "Admin-Notizen",
        description: "Optionale Notizen",
        placeholder: "Notizen...",
      },
      rejectionReason: {
        label: "Ablehnungsgrund",
        description: "Pflicht bei Ablehnung",
        placeholder: "Grund eingeben...",
      },
      response: {
        title: "Ergebnis",
        description: "Aktionsergebnis",
        success: "Erfolg",
        message: "Nachricht",
      },
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
          description: "Auszahlung konnte nicht bearbeitet werden",
        },
        unknown: {
          title: "Unbekannter Fehler",
          description: "Unerwarteter Fehler",
        },
        conflict: {
          title: "Konflikt",
          description: "Auszahlung bereits bearbeitet",
        },
        network: {
          title: "Netzwerkfehler",
          description: "Verbindung fehlgeschlagen",
        },
        notFound: {
          title: "Nicht gefunden",
          description: "Auszahlung nicht gefunden",
        },
        unsavedChanges: {
          title: "Ungespeicherte Änderungen",
          description: "Ungespeicherte Änderungen",
        },
      },
      success: { title: "Erfolg", description: "Auszahlung bearbeitet" },
    },
    widget: {
      noReferrals: "Keine Empfehlungscodes gefunden.",
      noPayouts: "Keine Auszahlungsanfragen.",
      approve: "Genehmigen",
      reject: "Ablehnen",
      complete: "Abschließen",
      sectionCodes: "Empfehlungscodes",
      sectionPayouts: "Auszahlungsanfragen",
      refresh: "Aktualisieren",
    },
  },
  enums: {
    subscriptionStatusFilter: {
      all: "Alle",
      active: "Aktiv",
      trialing: "Testphase",
      pastDue: "Überfällig",
      canceled: "Gekündigt",
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
    sortOrder: { asc: "Aufsteigend", desc: "Absteigend" },
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
      stripeSubscription: "Abo-Gutschrift",
      adminGrant: "Admin-Zuweisung",
      referralEarning: "Empfehlungsverdienst",
    },
    purchaseSortField: {
      createdAt: "Erstellt am",
      amount: "Menge",
      type: "Typ",
      userEmail: "E-Mail",
    },
    payoutStatusFilter: {
      all: "Alle",
      pending: "Ausstehend",
      approved: "Genehmigt",
      rejected: "Abgelehnt",
      processing: "In Bearbeitung",
      completed: "Abgeschlossen",
      failed: "Fehlgeschlagen",
    },
    referralSortField: {
      createdAt: "Erstellt am",
      earnings: "Einnahmen",
      signups: "Anmeldungen",
    },
    payoutAction: {
      approve: "Genehmigen",
      reject: "Ablehnen",
      complete: "Abschließen",
    },
  },
};
