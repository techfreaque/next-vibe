import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  adjustment: {
    confirmHint:
      "Bestätigen Sie den Abgleich, um die Bankbuchung zu verknüpfen und die angegebenen Korrekturen zu buchen.",
    autoMatch: "Bestätigte Lieferantenzahlungen automatisch abgleichen",
    autoMatched: "Automatisch zugeordnet",
    followup: "Bankumsatz weiterbearbeiten",
    followupHint:
      "Prüfen Sie den vorläufigen Rechnungsentwurf oder lösen Sie eine bestätigte Zuordnung.",
    vendor: "Lieferant",
    expenseAccount: "Aufwandskonto",
    reversalDate: "Stornodatum (JJJJ-MM-TT)",
    reason: "Grund für die Aufhebung",
    openDraft: "Lieferantenrechnung öffnen",
    settings: "Einstellungen für den Bankabgleich",
    settingsHint:
      "Legen Sie Kontowährung, zulässiges Währungspaar, Datumsfenster und Grenzen fest.",
    settingsSaved: "Einstellungen gespeichert",
    save: "Einstellungen speichern",
    foreignCurrency: "Rechnungswährung für Kursdifferenzen",
    absTolerance: "Maximale Kursdifferenz in Kontowährung",
    bpsTolerance: "Maximale Kursdifferenz in Basispunkten",
    days: "Datumsfenster für den Abgleich in Tagen",
    gainAccount: "Konto für Kursgewinne",
    lossAccount: "Konto für Kursverluste",
    feeAccount: "Aufwandskonto für belegte Gebühren",
    invalidSettings:
      "Prüfen Sie Währungspaar, Grenzen und aktive Konten dieses Unternehmens.",
    description: "Ausgleichsbuchung {{reference}}",
    unavailable:
      "Die Ausgleichsbuchung war nicht möglich. Prüfen Sie Datum, offene Periode und Konten.",
    journal: "Ausgleichsbuchung",
    kind: "Art des Abgleichs",
    fxDifference: "Kursgewinn oder Kursverlust",
    release: "Bankabgleich aufheben",
    releaseHint:
      "Lösen Sie die Zuordnung und stornieren Sie die Ausgleichsbuchung in einer offenen Periode.",
    releaseSuccess: "Bankabgleich aufgehoben",
    draft: "Rechnungsentwurf aus Bankumsatz",
    draftHint:
      "Verwenden Sie den Buchungsbetrag als vorläufigen Nachweis. Ergänzen Sie für den Steuerabzug die Originalrechnung.",
    draftReady: "Lieferantenentwurf erstellt",
    confirmDraft: "Vorläufige Lieferantenrechnung erstellen",
    sourceMemo:
      "Kontoauszug {{reference}} als Nachweis. Originalrechnung steht aus.",
  },
  statement: {
    projected: "Bereit zum Import",
    localPreview:
      "Die Dateivorschau zeigt Datum und Betrag vor der Datenschutzprüfung.",
    screenedOut: "Datenschutzfilter",
    screenedOutCount:
      "Die Datenschutzprüfung hat {{count}} Zeilen vom Bankbuch ausgeschlossen.",
    format: "Kontoauszugsformat",
    mapping: "Auszugsspalten zuordnen",
    preview: "Import prüfen",
    previewSuccess: "Importvorschau",
    invalid:
      "Der Auszug konnte im gewählten Format nicht gelesen werden (Zeile {{row}}).",
    decimal: "Dezimaltrennzeichen",
    dotDecimal: "Dezimalpunkt",
    commaDecimal: "Dezimalkomma",
    unmapped: "Keine Spalte",
    overlap:
      "Mögliche Überschneidung mit einem anderen Kontoauszug. Prüfen Sie die ursprünglichen Bankreferenzen.",
    columns: {
      counterpartyIban: "IBAN des Zahlungspartners",
      id: "Bankreferenz",
      date: "Buchungsdatum",
      valueDate: "Wertstellungsdatum",
      amount: "Gebuchter Betrag",
      currency: "Buchungswährung",
      nativeAmount: "Originalbetrag",
      nativeCurrency: "Originalwährung",
      feeAmount: "Belegte Gebühr",
      feeCurrency: "Gebührenwährung",
      description: "Beschreibung",
      counterparty: "Zahlungspartner",
      status: "Status",
    },
    formats: {
      normalized: "Standard-CSV",
      c24: "C24-CSV",
      revolut: "Revolut Privatkunden-CSV",
      revolutBusiness: "Revolut Business-CSV",
      mapped: "Eigene CSV",
      camt053: "CAMT.053",
      mt940: "MT940",
    },
  },
  tags: {
    bank: "Bank",
    reconciliation: "Bankabgleich",
  },
  fields: {
    exactAmount: "Exakter Betrag",
    status: "Status",
    company: "Unternehmen",
    account: "Bankkonto",
    csv: "Kontoauszug",
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
    exactMatch: "Exakter Abgleich",
    csvFormat: "Spaltentrennzeichen",
    commaFormat: "Komma",
    semicolonFormat: "Semikolon",
    sameDay: "Gleicher Betrag, gleicher Tag",
    upload: "Kontoauszug auswählen",
    dropCsv: "Oder Kontoauszug hier ablegen",
    pasteCsv: "Auszugstext einfügen",
    supportedFormat: "Unterstützte Formate",
    mapping: "Spalten zuordnen",
    chooseColumn: "CSV-Spalte auswählen",
    preview: "Vorschau (erste 5 Buchungen)",
    matchRow: "Zuordnen",
    unmatched: "Offen",
    csvHelp:
      "Wählen Sie einen Bankexport oder ordnen Sie die CSV-Spalten zu. Buchungsdatum und Betrag mit Vorzeichen sind Pflicht.",
    unsupported:
      "Verwenden Sie CSV, CAMT.053-XML oder MT940-Text. Wandeln Sie PDF, Tabellen und andere Formate vorher um.",
    chooseScope: "Wählen Sie ein Unternehmen und ein aktives Bankkonto.",
    empty: "Keine offenen Bankzeilen",
    emptyHint: "Importieren Sie zum Abgleich einen Kontoauszug.",
    review: "Passende Buchungen prüfen",
    noCandidates: "Keine passenden Buchungszeilen",
    noCandidatesHint: "Prüfen Sie Bankkonto, Währung und Betrag der Buchung.",
    alreadyMatched: "Diese Zeile ist bereits abgeglichen.",
    importAction: "Kontoauszug importieren",
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
    description:
      "Laden Sie einen Auszug für ein Bankkonto hoch oder fügen Sie ihn ein.",
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
