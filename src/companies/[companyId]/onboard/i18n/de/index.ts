import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  enums: {
    country: {
      AT: "Österreich (AT)",
      DE: "Deutschland (DE)",
      XX: "Allgemeiner Kontenrahmen (Steuersätze selbst festlegen)",
    },
  },
  tags: {
    companies: "unternehmen",
    onboard: "einrichten",
    setup: "einrichtung",
  },
  post: {
    title: "Buchhaltung einrichten",
    titleShort: "Buchhaltung einrichten",
    description:
      "Richte den Kontenrahmen ein und bereite Kassen- und Bankkonten für Buchungen vor.",
    companyId: { label: "Unternehmen", description: "Unternehmen" },
    country: {
      genericPreview:
        "Legt einen allgemeinen Kontenrahmen an. Richte vor dem Ausstellen von Rechnungen die Steuersätze ein.",
      regionalPreview:
        "Verwendet den Kontenrahmen und die Umsatzsteuersätze des ausgewählten Landes.",
      label: "Kontenrahmen",
      description:
        "Wähle für ein Unternehmen mit Sitz in Österreich oder Deutschland den passenden Kontenrahmen. Für alle anderen Länder verwende den allgemeinen Kontenrahmen.",
      placeholder: "Kontenrahmen auswählen",
    },
    period: {
      title: "Erste Buchungsperiode",
      open: "Diese Periode bei der Einrichtung eröffnen",
      description:
        "Vorgeschlagen wird der aktuelle Monat. Passe die Daten für einen anderen Zeitraum oder ein Geschäftsjahr an.",
      name: "Periodenname",
      start: "Startdatum",
      end: "Enddatum",
      proposal: "Vorgeschlagene Periode {{name}}, {{start}} bis {{end}}",
      kept: "Der bestehende Buchungskalender bleibt erhalten.",
      invalid:
        "Gib einen Periodennamen und ein Enddatum am oder nach dem Startdatum ein.",
      opened: "{{name}} ist für Buchungen geöffnet.",
      view: "Buchungsperioden ansehen",
      viewHint: "Prüfe deinen Buchungskalender.",
      createHint: "Wähle den Zeitraum vor der ersten Buchung.",
    },
    errors: {
      validation: { title: "Validierungsfehler", description: "Felder prüfen" },
      unauthorized: {
        title: "Nicht angemeldet",
        description: "Anmelden um Unternehmen einzurichten",
      },
      forbidden: {
        title: "Zugriff verweigert",
        description: "Adminrolle erforderlich",
      },
      conflict: {
        title: "Der bestehende Kontenrahmen stammt aus einem anderen Land",
        description:
          "Prüfe den bestehenden Kontenrahmen, bevor du die Vorlage wechselst.",
      },
      profileMismatch:
        "Wähle den Kontenrahmen passend zum Land im Unternehmensprofil.",
      server: {
        title: "Serverfehler",
        description: "Einrichtung konnte nicht abgeschlossen werden",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
      },
      network: { title: "Netzwerkfehler", description: "Verbindung prüfen" },
      notFound: {
        title: "Unternehmen nicht gefunden",
        description: "Dieses Unternehmen existiert nicht",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Es gibt ungespeicherte Änderungen",
      },
    },
    success: {
      title: "Buchhaltung eingerichtet",
      description:
        "Der Kontenrahmen ist eingerichtet. Du kannst eine Buchungsperiode eröffnen und Belege anlegen.",
    },
    widget: {
      books: "Kontenrahmen einrichten",
      setupCounts:
        "Vorbereitete Konten {{accounts}} · Neue Steuersätze {{rates}}",
      invoiceHint:
        "Lege einen Entwurf für dieses Unternehmen an und prüfe ihn vor dem Ausstellen.",
      submit: "Buchhaltung einrichten",
      company: "Unternehmen: {{name}}",
      back: "Zurück",
      cashAndBankReady: "Kassen- und Bankkonten können bebucht werden.",
      nextHint: "Eröffne vor der ersten Buchung eine Buchungsperiode.",
      period: "Buchungsperiode erstellen",
      invoice: "Rechnungsentwurf erstellen",
    },
    response: {
      accountsCreated: "Konten hinzugefügt",
      accountsSkipped: "Vorhandene Konten",
      taxRatesCreated: "Steuersätze hinzugefügt",
      cashAccountId: "Kassenkonto-ID",
      bankAccountId: "Bankkonto-ID",
      success: "Erfolg",
    },
  },
};
