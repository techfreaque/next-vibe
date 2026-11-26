import { translations as analyticsTranslations } from "next-vibe/unified-ui/analytics/i18n/de";

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  ...analyticsTranslations,
  category: "Empfehlungen",
  tags: {
    referral: "referral",
    admin: "admin",
    analytics: "analytics",
  },
  enums: {
    sort: {
      revenue: "Umsatz",
      commission: "Provision",
      payers: "Zahlende Nutzer",
      signups: "Anmeldungen",
      leads: "Leads",
      clicks: "Klicks",
      conversion: "Klick zu Anmeldung",
      ownerQueue: "Offene Auszahlungen des Inhabers",
      ownerFree: "Frei auszahlbar (niedrigste zuerst)",
      newest: "Neueste Codes",
    },
  },
  get: {
    title: "Empfehlungsübersicht",
    titleShort: "Übersicht",
    description:
      "Alle Empfehlungscodes und Partner auf einen Blick: Klicks, Leads, Anmeldungen, zahlende Nutzer, Umsatz, Provision und Auszahlungswarteschlange, verglichen mit der Vorperiode.",
    fields: {
      search: {
        label: "Suche",
        description: "Code, Bezeichnung oder E-Mail des Inhabers",
        placeholder: "Code, Bezeichnung oder Inhaber-E-Mail",
      },
      ownerUserId: {
        label: "Inhaber",
        description: "Nur Codes dieses Partners (Benutzer-ID)",
      },
      activeOnly: {
        label: "Nur aktive Codes",
        description: "Deaktivierte Codes ausblenden",
      },
      sortBy: {
        label: "Codes sortieren nach",
        description: "Reihenfolge der Code-Tabelle",
      },
      limit: {
        label: "Angezeigte Codes",
        description: "Maximale Zeilenzahl der Code-Tabelle",
      },
    },
    response: {
      window: "Zeitraum",
      kpis: "Kennzahlen",
      trend: "Verlauf",
      codes: "Codes",
      codesTotal: "Codes im Filter",
      overCommittedOwners: "Überzogene Inhaber",
      payouts: "Auszahlungswarteschlange",
    },
    widget: {
      subtitle:
        "Klicks, Anmeldungen, Umsatz und Provision je Partnercode, verglichen mit dem Vorzeitraum.",
      kpi: {
        clicks: "Klicks",
        clicksHint: "Browser-Aufrufe mit Code",
        leads: "Leads",
        leadsHint: "Einem Code zugeordnete Besucher",
        signups: "Anmeldungen",
        signupsHint: "{{rate}} der Klicks",
        payers: "Zahlende Nutzer",
        payersHint: "Geworbene Nutzer mit Zahlung im Zeitraum",
        revenue: "Umsatz",
        revenueHint: "Von geworbenen Nutzern bezahlt",
        commission: "Verdiente Provision",
        commissionHint: "{{pending}} zurückgehalten, {{confirmed}} bestätigt",
        payoutsPaid: "Ausgezahlt",
        payoutsPaidHint: "In diesem Zeitraum abgeschlossen",
        queue: "Auszahlungswarteschlange",
        queueHint: "{{count}} offene Anfragen",
        queueEmpty: "Nichts offen",
      },
      chart: {
        traffic: "Traffic",
        trafficSub: "Klicks und zugeordnete Leads",
        conversions: "Conversions",
        conversionsSub: "Neue Anmeldungen und zahlende Nutzer",
        money: "Umsatz und Provision",
        moneySub: "USD, nach Zahlungsdatum",
      },
      series: {
        clicks: "Klicks",
        leads: "Leads",
        signups: "Anmeldungen",
        payers: "Zahlende Nutzer",
        revenue: "Umsatz",
        commission: "Provision",
      },
      table: {
        title: "Codes",
        subtitle:
          "{{shown}} von {{total}} Codes. Klick auf einen Code öffnet seinen Bericht.",
        dimension: "Code",
        clicks: "Klicks",
        leads: "Leads",
        signups: "Anmeldungen",
        payers: "Zahler",
        conversion: "Klick zu Anmeldung",
        revenue: "Umsatz",
        commission: "Provision",
        signupsChange: "Anmeldungen ggü. Vorperiode",
        ownerQueue: "Offene Auszahlungen",
        ownerFree: "Frei auszahlbar",
        inactive: "inaktiv",
        overCommitted: "überzogen",
        overCommittedOwners: "{{count}} Inhaber überzogen",
        empty: "Keine Codes passen zu diesen Filtern.",
        sort: "Sortierung",
      },
      payouts: {
        title: "Auszahlungen nach Status",
        subtitle:
          "Aktueller Status aller Anfragen. Klick auf einen Status öffnet die Liste.",
        dimension: "Status",
        count: "Anfragen",
        amount: "Betrag",
        open: "Auszahlungen öffnen",
        empty: "Noch keine Auszahlungsanfragen.",
      },
      filters: {
        search: "Suche",
        owner: "Inhaber",
        activeOnly: "Nur aktive",
        searchPlaceholder: "Code, Bezeichnung oder Inhaber-E-Mail",
      },
      loading: "Empfehlungsübersicht wird geladen",
      cli: {
        payouts: "Auszahlungswarteschlange: {{count}} offen, {{amount}}",
      },
    },
  },
  errors: {
    validation: {
      title: "Ungültige Filter",
      description: "Prüfe Zeitraum und Filter",
    },
    unauthorized: {
      title: "Nicht angemeldet",
      description: "Melde dich als Admin an, um Empfehlungsanalysen zu sehen",
    },
    forbidden: {
      title: "Nur für Admins",
      description: "Nur Admins sehen Empfehlungsanalysen",
    },
    notFound: {
      title: "Nicht gefunden",
      description: "Nichts passt zu diesen Filtern",
    },
    conflict: {
      title: "Konflikt",
      description:
        "Die Daten haben sich beim Laden geändert, versuch es erneut",
    },
    server: {
      title: "Serverfehler",
      description: "Empfehlungsübersicht konnte nicht erstellt werden",
    },
    network: {
      title: "Netzwerkfehler",
      description: "Anfrage hat den Server nicht erreicht",
    },
    unknown: {
      title: "Unbekannter Fehler",
      description: "Etwas Unerwartetes ist schiefgelaufen",
    },
    unsavedChanges: {
      title: "Ungespeicherte Änderungen",
      description: "Speichere oder verwirf zuerst deine Änderungen",
    },
  },
  success: {
    title: "Geladen",
    description: "Empfehlungsübersicht geladen",
  },
};
