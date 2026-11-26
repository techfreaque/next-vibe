import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  errors: {
    validation: {
      title: "Validierungsfehler",
      description: "Prüfen Sie Land, Umsatzsteuerregelung und Stichtag.",
    },
    unauthorized: {
      title: "Nicht autorisiert",
      description: "Anmeldung erforderlich",
    },
    forbidden: {
      title: "Keine Berechtigung",
      description:
        "Nur Inhaber und Administratoren des Unternehmens dürfen die Umsatzsteuerregelung ändern.",
    },
    notFound: {
      title: "Nicht gefunden",
      description: "Unternehmen nicht gefunden",
    },
    conflict: {
      title: "Stichtag bereits belegt",
      description:
        "Für diesen Stichtag ist bereits eine Umsatzsteuerregelung hinterlegt.",
    },
    server: {
      title: "Serverfehler",
      description: "Ein interner Fehler ist aufgetreten",
    },
    network: {
      title: "Netzwerkfehler",
      description: "Ein Netzwerkfehler ist aufgetreten",
    },
    unknown: {
      title: "Unbekannter Fehler",
      description: "Ein unerwarteter Fehler ist aufgetreten",
    },
    unsavedChanges: {
      title: "Ungespeicherte Änderungen",
      description: "Es gibt ungespeicherte Änderungen",
    },
  },
  reviewDescription:
    "Prüfen Sie, welche Umsatzsteuerregelung am gewählten Tag für dieses Unternehmen gilt.",
  view: "Umsatzsteuerregelung prüfen",
  asOf: "Stichtag",
  change: "Steuerregelung ändern",
  regimes: {
    standard: "Regelbesteuerung",
    german: "Deutschland: Kleinunternehmer (§ 19 UStG)",
    austrian: "Österreich: Kleinunternehmer (§ 6 Abs. 1 Z 27 UStG)",
    slovak: "Slowakei: nicht umsatzsteuerpflichtig registriert",
    slovakSection7: "Slowakei: nach § 7 registriert (kein Umsatzsteuerzahler)",
    slovakSection7a:
      "Slowakei: nach § 7a registriert (kein Umsatzsteuerzahler)",
  },
  title: "Umsatzsteuerregelung des Unternehmens",
  description: "Legen Sie fest, wie Belege ab dem Stichtag besteuert werden.",
  company: "Unternehmen",
  from: "Gültig ab",
  save: "Steuerregelung speichern",
  regime: "Umsatzsteuerregelung",
  saved: "Die Steuerregelung gilt ab dem gewählten Datum.",
  conflict:
    "Wählen Sie einen anderen Stichtag oder prüfen Sie die vorhandene Regelung.",
  foreign:
    "Klären Sie Leistungen aus dem Ausland mit Ihrer Steuerberatung. Auch für Kleinunternehmer kann die Steuerschuldnerschaft des Leistungsempfängers gelten.",
  saleConflict:
    "Die Umsatzsteuer widerspricht der Kleinunternehmerbefreiung. Prüfen Sie die Rechnungspositionen vor der Ausstellung.",
  choose: "Umsatzsteuer-Behandlung wählen",
  back: "Zurück",
  appliesOn: "Umsatzsteuer-Behandlung am {{date}}",
  invoiceText: "Hinweis auf Rechnungen",
  savedTitle: "{{regime}} gilt ab {{date}}",
  pickCompany: {
    title: "Unternehmen wählen",
    message:
      "Sehen Sie, welche Umsatzsteuerregeln an einem Stichtag für seine Rechnungen gelten.",
  },
  hints: {
    standard:
      "Rechnungen weisen Umsatzsteuer zu den Steuersätzen des Unternehmens aus. Vorsteuer ist abziehbar.",
    german:
      "Rechnungen ohne Umsatzsteuer, mit Hinweis auf die Befreiung nach § 19 UStG.",
    austrian:
      "Rechnungen ohne Umsatzsteuer, mit Hinweis auf die österreichische Kleinunternehmerregelung.",
    slovak:
      "Rechnungen ohne Umsatzsteuer, da das Unternehmen nicht für die Umsatzsteuer registriert ist.",
    slovakSection7:
      "Inlandsrechnungen ohne Umsatzsteuer. EU-Warenerwerbe über der Schwelle versteuern Sie selbst mit Ihrer SK-USt-IdNr.",
    slovakSection7a:
      "Inlandsrechnungen ohne Umsatzsteuer. Leistungen an EU-Unternehmen laufen im Reverse-Charge mit Ihrer SK-USt-IdNr.",
  },
};
