import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Buchungsprüfung",
  description:
    "Prüfe aktive Journalbuchungen und die Belegverknüpfungen ausgestellter Kundenrechnungen sowie freigegebener oder bezahlter Eingangsrechnungen.",
  tag: "Buchhaltung prüfen",
  company: {
    label: "Unternehmen",
    description: "Wähle das Unternehmen, dessen Buchungen du prüfen möchtest.",
    choose: "Unternehmen auswählen",
    empty:
      "Wähle ein Unternehmen, um Journal und Belegverknüpfungen zu prüfen.",
  },
  filters: {
    issue: "Prüfbefund",
    all: "Alle Befunde",
    matches: "Passende Befunde",
  },
  issues: {
    missingLines: "Fehlende Buchungszeilen",
    invalidLegs: "Fehlerhafte Buchungszeilen",
    invoiceLink: "Buchung zu Kundenrechnung",
    billLink: "Buchung zu Eingangsrechnung",
  },
  reasons: {
    fewLines:
      "Die Buchung hat weniger als zwei Zeilen. Öffne die Buchung und prüfe den Ursprungsbeleg.",
    invalidLegs:
      "Mindestens eine Währung ist nicht ausgeglichen oder eine Zeile hat einen ungültigen Betrag, ein falsches Konto oder eine falsche Buchungsrichtung. Prüfe die Buchung.",
    noBacklink:
      "Der Beleg ist mit keiner Journalbuchung verknüpft. Prüfe den Ursprung vor dem Buchen oder Erfassen einer Zahlung.",
    wrongPosting:
      "Die verknüpfte Buchung fehlt, gehört zu einem anderen Ursprung oder ist nicht mehr aktiv. Prüfe den Buchungsverlauf des Belegs.",
    controlLeg:
      "Die verknüpfte Buchung hat einen fehlerhaften Saldo, eine falsche Währung oder einen abweichenden Betrag auf dem Forderungs- oder Verbindlichkeitskonto. Prüfe den Ursprung vor dem Erfassen einer Zahlung.",
  },
  columns: {
    record: "Eintrag",
    date: "Datum",
    reason: "Prüfbefund",
    counterparty: "Geschäftspartner",
    open: "Eintrag öffnen",
  },
  records: {
    journal: "Journalbuchung",
    invoice: "Kundenrechnung",
    bill: "Eingangsrechnung",
    journalDate: "Buchungsdatum",
    invoiceDate: "Rechnung angelegt am",
    billDate: "Rechnungsdatum",
    dateInfo: "{{label}} {{date}}",
    openJournal: "Buchung öffnen",
    openInvoice: "Kundenrechnung öffnen",
    openBill: "Eingangsrechnung öffnen",
  },
  pagination: {
    pageLabel: "Seite",
    pageSize: "Einträge je Seite",
    totalPages: "Seiten insgesamt",
    previous: "Zurück",
    next: "Weiter",
    pageInfo: "Seite {{page}} von {{total}}",
    firstPage: "Erste Seite",
    emptyPage: "Diese Seite enthält keine Einträge",
  },
  widget: {
    loading: "Buchungsprüfung wird geladen",
    empty: "Keine passenden Buchungsbefunde",
    coverage:
      "Geprüft werden aktive Ursprungsbuchungen, ausgestellte Kundenrechnungen sowie freigegebene und bezahlte Eingangsrechnungen mit positivem Betrag.",
    back: "Zurück",
  },
  success: {
    title: "Prüfung abgeschlossen",
    description: "Journal und Belegverknüpfungen wurden geprüft.",
  },
  errors: {
    validation: {
      title: "Berichtsfilter prüfen",
      description:
        "Wähle einen gültigen Befundfilter, eine Seite und eine Seitengröße.",
    },
    unauthorized: {
      title: "Anmeldung erforderlich",
      description: "Melde dich an, um Buchungen zu prüfen.",
    },
    forbidden: {
      title: "Unternehmen nicht verfügbar",
      description:
        "Du hast keinen Zugriff auf die Buchhaltung dieses Unternehmens.",
    },
    notFound: {
      title: "Nicht gefunden",
      description: "Der angeforderte Eintrag wurde nicht gefunden.",
    },
    server: {
      title: "Buchungsprüfung konnte nicht geladen werden",
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
