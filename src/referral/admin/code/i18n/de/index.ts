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
  get: {
    title: "Empfehlungscode-Bericht",
    titleShort: "Code-Bericht",
    description:
      "Ein Empfehlungscode komplett: wem er gehört, wie aus Klicks Leads, Anmeldungen und zahlende Nutzer werden, welchen Umsatz er bringt, welche Provision er auslöst und was an den Inhaber ausgezahlt wurde.",
    fields: {
      code: {
        label: "Empfehlungscode",
        description:
          "Der Code für den Bericht (Groß- und Kleinschreibung egal)",
        placeholder: "Empfehlungscode eingeben",
      },
    },
    response: {
      window: "Zeitraum",
      header: "Code",
      kpis: "Kennzahlen",
      funnel: "Funnel",
      trend: "Verlauf",
      balance: "Guthaben des Inhabers",
      earningsByLevel: "Provision nach Ebene",
      referredUsers: "Geworbene Nutzer",
      referredTotal: "Geworbene Nutzer gesamt",
      payouts: "Auszahlungen an den Inhaber",
    },
    widget: {
      periodTitle: "Dieser Zeitraum",
      owner: "Inhaber",
      ownerEmail: "E-Mail des Inhabers",
      openOwner: "Inhaber öffnen",
      label: "Bezeichnung",
      noLabel: "Keine Bezeichnung",
      bonus: "Anmeldebonus",
      bonusValue: "+{{credits}} Credits mit dem ersten Plan",
      noBonus: "Keiner",
      status: "Status",
      active: "Aktiv",
      inactive: "Inaktiv",
      created: "Erstellt",
      uses: "Zugeordnete Anmeldungen",
      editBonus: "Bonus ändern",
      reassign: "Code neu zuweisen",
      kpi: {
        clicks: "Klicks",
        leads: "Leads",
        signups: "Anmeldungen",
        signupsHint: "{{rate}} der Klicks",
        payers: "Zahlende Nutzer",
        payersHint: "Geworbene Nutzer mit Zahlung im Zeitraum",
        revenue: "Umsatz",
        commission: "Ausgelöste Provision",
        commissionHint:
          "{{pending}} zurückgehalten bis zum Ende der Widerrufsfrist, {{confirmed}} bestätigt",
      },
      funnel: {
        title: "Funnel",
        subtitle: "Dieser Zeitraum",
        clicks: "Klicks",
        leads: "Leads",
        signups: "Anmeldungen",
        payers: "Zahlende Nutzer",
      },
      chart: {
        conversions: "Conversions",
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
      balance: {
        title: "Guthaben des Inhabers (gesamt)",
        confirmed: "Bestätigte Einnahmen",
        pending: "Zurückgehalten (Rückerstattungsfrist)",
        paidOut: "Ausgezahlt",
        open: "In der Auszahlungswarteschlange",
        available: "Verfügbar vor offenen Anfragen",
        free: "Frei auszahlbar nach Warteschlange",
        overCommitted:
          "Offene Anfragen übersteigen das bestätigte Guthaben. Nicht alle freigeben.",
      },
      levels: {
        title: "Provision nach Ebene",
        subtitle: "Ausgelöst von Nutzern dieses Codes, dieser Zeitraum",
        dimension: "Ebene",
        direct: "Direkt (Code-Inhaber)",
        upline: "Upline {{level}}",
        count: "Zahlungen",
        total: "Verdient",
        pending: "Zurückgehalten",
        confirmed: "Bestätigt",
        canceled: "Storniert",
        empty: "Keine Provision in diesem Zeitraum.",
      },
      users: {
        title: "Geworbene Nutzer",
        subtitle:
          "Gesamter Zeitraum, größte Zahler zuerst. {{shown}} von {{total}}.",
        dimension: "Nutzer",
        signedUp: "angemeldet am {{date}}",
        payments: "Zahlungen",
        revenue: "Umsatz",
        commission: "Provision",
        unpaid: "keine Zahlung",
        empty: "Mit diesem Code hat sich noch niemand angemeldet.",
      },
      payouts: {
        title: "Auszahlungen an den Inhaber",
        subtitle: "Alle Anfragen dieses Partners",
        dimension: "Anfrage",
        amount: "Betrag",
        requested: "angefragt am {{date}}",
        processed: "bearbeitet am {{date}}",
        openAll: "In Auszahlungen öffnen",
        empty: "Dieser Partner hat noch nie eine Auszahlung angefragt.",
      },
      notFound: "Code {{code}} existiert nicht.",
      pickCode:
        "Wähle einen Code aus der Übersichtstabelle oder gib ihn oben ein.",
      pickTitle: "Kein Code gewählt",
      browseCodes: "Codes durchsuchen",
      subtitle:
        "Klicks, Anmeldungen, Umsatz, Provision und Partnerguthaben für einen Code.",
      loading: "Code-Bericht wird geladen",
    },
  },
  errors: {
    validation: {
      title: "Ungültige Eingabe",
      description: "Prüfe Code und Zeitraum",
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
      title: "Code nicht gefunden",
      description: "Kein passender Empfehlungscode",
    },
    conflict: {
      title: "Konflikt",
      description:
        "Die Daten haben sich beim Laden geändert, versuch es erneut",
    },
    server: {
      title: "Serverfehler",
      description: "Code-Bericht konnte nicht erstellt werden",
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
    codeNotFound: "Empfehlungscode {{code}} existiert nicht",
  },
  success: {
    title: "Geladen",
    description: "Code-Bericht geladen",
  },
};
