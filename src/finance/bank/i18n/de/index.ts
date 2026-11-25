import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    bank: "Bank",
    reconciliation: "Bankabgleich",
  },
  fields: {
    exactAmount: "Exakter Betrag",
    status: "Status",
    company: "Unternehmen",
    account: "Bankkonto",
    csv: "Kontoauszug als CSV",
    line: "Bankzeile",
    transactionId: "Transaktions-ID",
    bookedDate: "Buchungsdatum",
    amount: "Betrag",
    currency: "Währung",
    journalLine: "Buchungszeile",
    entryNumber: "Buchung",
    description: "Beschreibung",
    journalDate: "Buchungsdatum im Journal",
    confirm: "Abgleich bestätigen",
    imported: "Importiert",
    skipped: "Dubletten übersprungen",
    matchedAt: "Abgeglichen am",
    page: "Seite",
    pageSize: "Zeilen pro Seite",
    total: "Gesamt",
  },
  ui: {
    csvFormat: "CSV-Format",
    commaFormat: "Komma als Trennzeichen, Dezimalpunkt",
    semicolonFormat: "Semikolon als Trennzeichen, Dezimalkomma",
    sameDay: "Gleicher Betrag, gleicher Tag",
    upload: "CSV-Datei auswählen",
    dropCsv: "Oder CSV hier ablegen",
    pasteCsv: "CSV-Text einfügen",
    supportedFormat: "Unterstütztes Format",
    mapping: "Spalten zuordnen",
    chooseColumn: "CSV-Spalte auswählen",
    preview: "Vorschau (erste 5 Buchungen)",
    matchRow: "Zuordnen",
    unmatched: "Offen",
    csvHelp:
      "Ordnen Sie eine stabile Transaktions-ID, ein Datum (JJJJ-MM-TT oder TT.MM.JJJJ), einen vorzeichenbehafteten Betrag im gewählten Dezimalformat und einen Währungscode in Großbuchstaben zu. Positive Beträge sind Eingänge. Eine Buchung pro Zeile. Keine Tausendertrennzeichen.",
    unsupported:
      "Konvertieren Sie CAMT XML, OFX/QFX, MT940, Tabellen, PDF und CSV mit anderen Trennzeichen oder mehrzeiligen Datensätzen zuerst in dieses Format.",
    chooseScope: "Wählen Sie ein Unternehmen und ein aktives Bankkonto.",
    empty: "Keine offenen Bankzeilen",
    emptyHint: "Importieren Sie zum Abgleich einen Kontoauszug.",
    review: "Passende Buchungen prüfen",
    noCandidates: "Keine passenden Buchungszeilen",
    noCandidatesHint: "Prüfen Sie Bankkonto, Währung und Betrag der Buchung.",
    alreadyMatched: "Diese Zeile ist bereits abgeglichen.",
    importAction: "CSV importieren",
    listAction: "Bankzeilen anzeigen",
    back: "Zurück",
    previous: "Vorherige",
    next: "Nächste",
    matchAction: "Diese Buchung zuordnen",
    confirmHint:
      "Die Zuordnung dokumentiert die Bestätigung. Sie erzeugt keine Buchung und löst keine Überweisung aus.",
  },
  errors: {
    validation: {
      title: "Eingabe prüfen",
      description:
        "Wählen Sie ein Unternehmen und ein aktives, bebuchbares Bankkonto in dessen Währung.",
    },
    network: {
      title: "Netzwerkfehler",
      description: "Prüfen Sie Ihre Verbindung und versuchen Sie es erneut.",
    },
    unauthorized: {
      title: "Anmeldung erforderlich",
      description: "Melden Sie sich für den Bankabgleich an.",
    },
    forbidden: {
      title: "Zugriff verweigert",
      description: "Ihre Unternehmensrolle erlaubt diese Aktion nicht.",
    },
    notFound: {
      title: "Bankzeile oder Konto nicht verfügbar",
      description: "Prüfen Sie Unternehmen und Bankkonto.",
    },
    server: {
      title: "Bankvorgang fehlgeschlagen",
      description:
        "Versuchen Sie es erneut. Bei einem Fehler bleiben die Daten unverändert.",
    },
    unknown: {
      title: "Unerwarteter Bankfehler",
      description: "Versuchen Sie es erneut.",
    },
    unsavedChanges: {
      title: "Ungespeicherte Änderungen",
      description: "Ihre Änderungen stehen noch im Formular.",
    },
    conflict: {
      title: "Konflikt beim Bankabgleich",
      description:
        "Aktualisieren Sie den Kontoauszug und prüfen Sie die Buchung.",
    },
  },
  check: {
    encoding: "Speichern Sie die Datei als UTF-8-CSV.",
    mappingHeader:
      "Wählen Sie das Trennzeichen. Die Kopfzeile braucht mindestens vier benannte Spalten.",
    mapping: "Wählen Sie für jedes Pflichtfeld eine eigene CSV-Spalte.",
    columns: "Zeile {{row}} muss dieselben Spalten wie die Kopfzeile haben.",
    value: "Zeile {{row}} enthält einen ungültigen Wert im Feld {{field}}.",
    size: "Verwenden Sie eine CSV mit höchstens 256 KB und 1.000 Datenzeilen.",
    header:
      "Verwenden Sie genau die CSV-Spalten transactionId,date,amount,currency.",
    empty: "Fügen Sie mindestens eine Transaktionszeile hinzu.",
    row: "Prüfen Sie Transaktions-ID, Datum, vorzeichenbehafteten Betrag und Währung in Zeile {{row}}.",
    duplicate:
      "Zeile {{row}} verwendet dieselbe Transaktions-ID mit abweichenden Daten.",
    storedDuplicate:
      "Eine gespeicherte Zeile nutzt diese Transaktions-ID bereits mit anderen Daten.",
    currency: "Alle Zeilen müssen die Unternehmenswährung verwenden.",
    journalTaken: "Die gewählte Buchungszeile ist bereits zugeordnet.",
    journalMatch:
      "Wählen Sie eine offene Buchungszeile für dasselbe Bankkonto, denselben Betrag und dieselbe Währung.",
    confirmation: "Bestätigen Sie den Abgleich vor dem Speichern.",
  },
  import: {
    title: "Kontoauszug importieren",
    description: "CSV für ein Bankkonto hochladen oder einfügen.",
    success: "Kontoauszug verarbeitet",
  },
  list: {
    title: "Offene Bankzeilen",
    description:
      "Prüfen Sie importierte Bankzeilen und gleichen Sie sie mit gebuchten Einträgen ab.",
    success: "Bankzeilen geladen",
  },
  candidates: {
    title: "Passende Buchung suchen",
    description:
      "Prüfen Sie gebuchte Bankeinträge mit demselben Betrag und derselben Richtung.",
    success: "Passende Buchungen geladen",
  },
  match: {
    title: "Bankabgleich bestätigen",
    description: "Ordnen Sie diese Bankzeile einer gebuchten Zeile zu.",
    success: "Bankzeile abgeglichen",
  },
};
