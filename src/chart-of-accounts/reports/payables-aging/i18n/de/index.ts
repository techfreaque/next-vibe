import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Offene Lieferantenposten",
  titleShort: "Lieferantenposten",
  description: "Offene Lieferantenbeträge nach Tagen überfällig.",
  tag: "Lieferantenposten",
  company: {
    label: "Unternehmen",
    description:
      "Wähle das Unternehmen, dessen Eingangsrechnungen du prüfen möchtest.",
    choose: "Unternehmen auswählen",
    empty:
      "Wähle ein Unternehmen, um seine offenen Lieferantenposten zu sehen.",
  },
  currency: {
    label: "Währung",
    description:
      "Zeigt Rechnungen in einer Währung. Beträge werden nicht umgerechnet.",
    default: "Unternehmenswährung",
    codes: {
      EUR: "EUR",
      USD: "USD",
      PLN: "PLN",
    },
  },
  agingDate: {
    label: "Stichtag",
    description: "Zu diesem Datum wird der Zahlungsverzug berechnet.",
  },
  columns: {
    supplier: "Lieferant",
    vat: "USt-IdNr.",
    current: "Nicht überfällig",
    days1to30: "1–30 Tage",
    days31to60: "31–60 Tage",
    days61to90: "61–90 Tage",
    over90: "Ab 91 Tagen",
    undated: "Ohne Fälligkeit",
    total: "Summe",
    billNumber: "Rechnungsnummer",
    billDate: "Rechnungsdatum",
    dueDate: "Fälligkeit",
    billAmount: "Betrag in Cent",
  },
  approved: {
    title: "Freigegeben und unbezahlt",
    empty: "Keine freigegebenen Rechnungen offen",
    emptyDescription:
      "Freigegebene Rechnungen mit offenem Betrag erscheinen hier.",
  },
  received: {
    title: "Freigabe ausstehend",
    empty: "Keine Freigaben ausstehend",
    emptyDescription:
      "Eingegangene Rechnungen erscheinen hier bis zur Freigabe.",
  },
  disputed: {
    title: "Strittig",
    empty: "Keine strittigen Rechnungen",
    emptyDescription:
      "Strittige Rechnungen zählen weder zu den freigegebenen noch zu den ausstehenden Beträgen.",
  },
  widget: {
    asOf: "Stand {{date}}",
    back: "Zurück",
    loading: "Lieferantenposten werden geladen",
    details: "Rechnungen von {{supplier}}",
    unknownSupplier: "Unbekannter Lieferant",
    datedBill: "Rechnung vom {{date}}",
    due: "Fällig am {{date}}",
  },
  success: {
    title: "Lieferantenposten geladen",
    description:
      "Die Eingangsrechnungen des ausgewählten Unternehmens sind zur Prüfung bereit.",
  },
  errors: {
    validation: {
      title: "Berichtsfilter prüfen",
      description: "Wähle ein gültiges Datum und eine gültige Währung.",
    },
    unauthorized: {
      title: "Anmeldung erforderlich",
      description: "Melde dich an, um die Lieferantenposten zu sehen.",
    },
    forbidden: {
      title: "Unternehmen nicht verfügbar",
      description:
        "Du hast keinen Zugriff auf die Eingangsrechnungen dieses Unternehmens.",
    },
    notFound: {
      title: "Nicht gefunden",
      description: "Der angeforderte Eintrag wurde nicht gefunden.",
    },
    server: {
      title: "Lieferantenposten konnten nicht geladen werden",
      description: "Lade den Bericht erneut.",
    },
    network: {
      title: "Keine Verbindung",
      description: "Prüfe deine Verbindung und versuche es erneut.",
    },
    conflict: {
      title: "Berichtskonflikt",
      description: "Aktualisiere die Seite und lade den Bericht erneut.",
    },
    unknown: {
      title: "Unerwarteter Fehler",
      description: "Versuche es erneut oder wende dich an den Support.",
    },
    unsavedChanges: {
      title: "Ungespeicherte Änderungen",
      description: "Speichere oder verwirf deine Änderungen vor dem Verlassen.",
    },
  },
};
