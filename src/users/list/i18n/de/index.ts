import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tag: "Nutzer",
  get: {
    title: "Nutzer",
    titleShort: "Nutzer",
    description:
      "Jedes Konto mit Umsatz, Credit-Verbrauch und letzter Aktivität. Suchen, nach Umsatz, Aktivität, Anmeldedatum oder Herkunft filtern, nach jeder Geldspalte sortieren.",
    fields: {
      hasSpentCredits: "Credits genutzt",
      requiredState: {
        label: "Erforderlicher Status",
        description: "Das Konto muss auch diesen Status haben",
      },
      accountLocale: {
        label: "Kontosprache",
        description: "Exakte Sprachkennung, zum Beispiel de-DE",
      },
      attributedRefCode: {
        label: "Zugeordneter Empfehlungscode",
        description:
          "Angerechneter Empfehlungscode, sonst der Code des ersten Besuchs",
      },
      search: {
        label: "Konten suchen",
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
        description: "Aktivität = Credit-Verbrauch, Login oder Zahlung",
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
      audience: {
        label: "Zielgruppe",
        description:
          "Nur Menschen blendet Admins und Testadressen aus (example.com, .invalid, .test-Fixtures)",
        placeholder: "Alle",
      },
      channel: {
        label: "Kanal",
        description:
          "Erstkontakt-Kanal, exakt (google, youtube, direct). none = Konten ohne Journey",
        placeholder: "youtube",
      },
      channelType: {
        label: "Kanaltyp",
        description: "Wie der Erstkontakt zu uns kam",
        placeholder: "Jeder Typ",
      },
      refCode: {
        label: "Ref-Code",
        description:
          "Empfehlungscode aus dem ersten Besuch oder der gutgeschriebenen Empfehlung, exakt",
        placeholder: "FRIEND2024",
      },
      plan: {
        label: "Tarif",
        description: "Aktives oder Test-Abo in diesem Tarif",
        placeholder: "Jeder Tarif",
      },
      activeFrom: {
        label: "Credits genutzt ab",
        description: "Credit-Verbrauch an oder nach diesem Tag",
      },
      activeTo: {
        label: "Credits genutzt bis",
        description: "Credit-Verbrauch an oder vor diesem Tag",
      },
      spentMin: {
        label: "Mindestens verbraucht",
        description:
          "Verbrauchte Credits gesamt. Mit Nie bezahlt kombinieren, um Gratis-Verbrenner zu finden",
      },
      paidFrom: {
        label: "Bezahlt ab",
        description: "Erfolgreiche Zahlung an oder nach diesem Tag",
      },
      paidTo: {
        label: "Bezahlt bis",
        description: "Erfolgreiche Zahlung an oder vor diesem Tag",
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
    audience: {
      all: "Alle",
      humans: "Nur Menschen",
    },
    channelType: {
      campaign: "Kampagne",
      referral: "Empfehlung",
      organic: "Organisch",
      direct: "Direkt",
    },
    plan: {
      subscription: "Starter",
      plus: "Plus",
      pro: "Pro",
      ultra: "Ultra",
    },
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
    spent30d: "{{count}} in 30 T.",
    notTracked: "nicht erfasst",
    oneOff: "Nur Credits",
    refCode: "ref:{{code}}",
    chips: {
      paid: "Bezahlt",
      signedUp: "Registriert",
      spentCredits: "Credits genutzt",
      remove: "Filter {{label}} entfernen",
    },
    creditsAny: "Beliebig",
    titleWithCount: "Nutzer ({{count}})",
    loading: "Nutzer werden geladen...",
    never: "Nie",
    referredBy: "über {{email}}",
    actions: {
      open: "Öffnen",
      select: "Auswählen",
      openUser: "Konto von {{email}} öffnen",
      selectUser: "{{email}} auswählen",
      stats: "Signup-Report",
      refresh: "Aktualisieren",
      newUser: "Neuer Nutzer",
      clearFilters: "Filter zurücksetzen",
      moreFilters: "Filter",
    },
    kpi: {
      activeSpentHint: "{{credits}} Credits in 30 Tagen verbraucht",
      matchingHint:
        "Registrierungen pro Woche, letzte 12 volle Wochen. Letzte Woche: {{last}}, diese Woche bisher: {{count}}",
      verified: "E-Mail bestätigt",
      verifiedHint: "{{count}} Konten",
      active: "Aktiv 30 T.",
      matching: "Treffer",
      paying: "Zahlend",
      payingShare: "{{percent}}% der Treffer",
      revenue: "Gesamtumsatz",
      revenueHint: "Erfolgreiche Zahlungen, USD",
      credits: "Credit-Bestand",
      creditsHint: "Summe aller Wallet-Guthaben",
    },
    quick: {
      freeBurn: "Gratis-Verbrauch {{min}}+ ({{count}})",
      banned: "Gesperrt ({{count}})",
      humans: "Nur Menschen",
      paying: "Zahlend ({{count}})",
      free: "Nie bezahlt",
      activeWeek: "Aktiv 7 T.",
      dormant: "Inaktiv 30+ T.",
      never: "Nie aktiv",
    },
    columns: {
      flags: "Markierungen",
      user: "Nutzer",
      joined: "Seit",
      lastActive: "Zuletzt aktiv",
      credits: "Guthaben",
      spent: "Verbraucht (gesamt)",
      paid: "Bezahlt",
      subscription: "Abo",
      source: "Herkunft",
      id: "ID",
    },
    compact: {
      joined: "dabei seit {{date}}",
      active: "aktiv {{when}}",
      neverActive: "nie aktiv",
      paid: "bezahlt {{amount}}",
      free: "nie bezahlt",
      spent: "{{count}} Credits verbraucht",
    },
    flags: {
      freeBurn: "Gratis-Verbrauch",
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
      previous: "Vorherige Seite",
      next: "Nächste Seite",
      showing: "{{start}}-{{end}} von {{total}}",
    },
    text: {
      subheader:
        "{{verified}} bestätigt | {{active}} aktiv 30 T. | {{banned}} gesperrt | Registrierungen/Woche (12 W.): {{weekly}}",
      header: "{{total}} Nutzer | {{paying}} zahlend | {{paid}} Gesamtumsatz",
      pageHint: "Seite {{page}}/{{pages}}. Weiter: --page={{next}}",
      detailHint: "Details: vibe users-view --userId=<ID>",
    },
  },
};
