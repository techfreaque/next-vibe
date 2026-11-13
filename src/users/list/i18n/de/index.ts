import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tag: "Nutzer",
  get: {
    title: "Nutzer",
    titleShort: "Nutzer",
    description:
      "Jedes Konto mit Umsatz, Credit-Verbrauch und letzter Aktivität. Suchen, nach Umsatz, Aktivität, Anmeldedatum oder Herkunft filtern, nach jeder Geldspalte sortieren.",
    fields: {
      search: {
        label: "Suche",
        description: "E-Mail, Name oder Anfang einer Nutzer-ID",
        placeholder: "E-Mail, Name oder ID suchen...",
      },
      roles: {
        label: "Rollen",
        description: "Nutzer mit einer dieser Rollen",
        placeholder: "Jede Rolle",
      },
      accountState: {
        label: "Kontostatus",
        description: "Aktiv, inaktiv, gesperrt, verifiziert oder unverifiziert",
        placeholder: "Jeder Status",
      },
      payer: {
        label: "Zahlend oder gratis",
        description: "Zahlend = mindestens eine erfolgreiche Zahlung",
        placeholder: "Zahlend oder gratis",
      },
      subscription: {
        label: "Abo",
        description: "Aktuell aktives Abo, jemals abonniert oder nie",
        placeholder: "Jedes Abo",
      },
      lastActive: {
        label: "Zuletzt aktiv",
        description:
          "Aktivität = Credit-Verbrauch (eigene oder verknüpfte Lead-Wallets) oder neuer Login",
        placeholder: "Beliebig",
      },
      signupFrom: {
        label: "Angemeldet ab",
        description: "Erster einbezogener Anmeldetag",
      },
      signupTo: {
        label: "Angemeldet bis",
        description: "Letzter einbezogener Anmeldetag",
      },
      creditsMin: {
        label: "Credits mindestens",
        description: "Minimales Wallet-Guthaben",
      },
      creditsMax: {
        label: "Credits höchstens",
        description: "Maximales Wallet-Guthaben",
      },
      source: {
        label: "Herkunft",
        description:
          "Erstkontakt-Kanal, UTM-Quelle/Medium/Kampagne, Referrer-Host oder Empfehlungscode",
        placeholder: "google, ref:, newsletter...",
      },
      referralActivity: {
        label: "Als Empfehler",
        description: "Nutzer mit Empfehlungslink und was er gebracht hat",
        placeholder: "Beliebig",
      },
      sortBy: {
        label: "Sortieren nach",
        description: "Sortierspalte",
      },
      sortOrder: {
        label: "Reihenfolge",
        description: "Aufsteigend oder absteigend",
      },
      page: {
        label: "Seite",
        description: "Seitennummer, beginnt bei 1",
      },
      limit: {
        label: "Pro Seite",
        description: "Nutzer pro Seite (max. 200)",
      },
    },
    response: {
      users: "Nutzer",
      summary: "Übersicht",
    },
    errors: {
      unauthorized: {
        title: "Nicht angemeldet",
        description: "Melde dich an, um Nutzer zu sehen",
      },
      validation: {
        title: "Ungültige Filter",
        description: "Prüfe die Filterwerte und versuche es erneut",
      },
      forbidden: {
        title: "Nur für Admins",
        description: "Dafür brauchst du die Admin-Rolle",
      },
      server: {
        title: "Nutzer konnten nicht geladen werden",
        description: "Der Server konnte die Nutzerliste nicht laden",
      },
      unknown: {
        title: "Unerwarteter Fehler",
        description: "Beim Laden der Nutzer ist etwas schiefgelaufen",
      },
      conflict: {
        title: "Konflikt",
        description: "Die Anfrage widerspricht den aktuellen Daten",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Server nicht erreichbar",
      },
      notFound: {
        title: "Keine Nutzer",
        description: "Keine Nutzer passen zu diesen Filtern",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Du hast ungespeicherte Änderungen",
      },
    },
    success: {
      title: "Nutzer geladen",
      description: "Nutzerliste geladen",
    },
  },
  enums: {
    sortOrder: {
      asc: "Aufsteigend",
      desc: "Absteigend",
    },
    role: {
      admin: "Admin",
      customer: "Kunde",
      partnerAdmin: "Partner-Admin",
      partnerEmployee: "Partner-Mitarbeiter",
      public: "Öffentlich",
    },
    subscription: {
      any: "Beliebig",
      hasActive: "Aktuell aktiv",
      hadAny: "Jemals abonniert",
      never: "Nie abonniert",
    },
    referrer: {
      any: "Beliebig",
      hasCode: "Hat Empfehlungslink",
      hasClicks: "Link hat Klicks",
      hasSignups: "Link hat Anmeldungen",
      hasSubscribers: "Link hat zahlende Abonnenten",
    },
    sortField: {
      createdAt: "Anmeldedatum",
      lastActive: "Zuletzt aktiv",
      credits: "Credit-Guthaben",
      totalPaid: "Gesamtumsatz",
      creditsSpent: "Verbrauchte Credits",
      email: "E-Mail",
      name: "Name",
    },
    accountState: {
      active: "Aktiv",
      inactive: "Inaktiv",
      banned: "Gesperrt",
      verified: "E-Mail verifiziert",
      unverified: "E-Mail unverifiziert",
    },
    payer: {
      any: "Zahlend oder gratis",
      paid: "Zahlend",
      free: "Nie bezahlt",
    },
    lastActive: {
      any: "Beliebig",
      day: "Letzte 24 Stunden",
      week: "Letzte 7 Tage",
      month: "Letzte 30 Tage",
      dormant: "Seit 30+ Tagen inaktiv",
      never: "Nie aktiv",
    },
  },
  widget: {
    creditsAny: "Beliebig",
    titleWithCount: "Nutzer ({{count}})",
    loading: "Nutzer werden geladen...",
    never: "Nie",
    referredBy: "über {{email}}",
    actions: {
      stats: "Statistik",
      refresh: "Aktualisieren",
      newUser: "Neuer Nutzer",
      clearFilters: "Filter zurücksetzen",
      moreFilters: "Filter",
    },
    kpi: {
      matching: "Treffer",
      paying: "Zahlend",
      payingShare: "{{percent}}% der Treffer",
      revenue: "Gesamtumsatz",
      revenueHint: "Erfolgreiche Zahlungen, USD",
      credits: "Credit-Bestand",
      creditsHint: "Summe aller Wallet-Guthaben",
    },
    quick: {
      paying: "Zahlend",
      free: "Nie bezahlt",
      activeWeek: "Aktiv 7 T.",
      dormant: "Inaktiv 30+ T.",
      never: "Nie aktiv",
    },
    columns: {
      user: "Nutzer",
      joined: "Seit",
      lastActive: "Zuletzt aktiv",
      credits: "Credits",
      spent: "Verbraucht",
      paid: "Bezahlt",
      subscription: "Abo",
      source: "Herkunft",
      id: "ID",
    },
    flags: {
      admin: "Admin",
      banned: "Gesperrt",
      unverified: "Unverifiziert",
    },
    empty: {
      none: "Noch keine Nutzer",
      filtered: "Keine Nutzer passen zu diesen Filtern",
      filteredHint: "Lockere einen Filter oder setze alle zurück.",
    },
    pagination: {
      showing: "{{start}}-{{end}} von {{total}}",
    },
    text: {
      header: "{{total}} Nutzer | {{paying}} zahlend | {{paid}} Gesamtumsatz",
      pageHint: "Seite {{page}}/{{pages}}. Weiter: --page={{next}}",
      detailHint: "Details: vibe users-view --userId=<ID>",
    },
  },
};
