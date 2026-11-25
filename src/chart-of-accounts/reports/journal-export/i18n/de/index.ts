import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Buchungsjournal als CSV",
  description:
    "Exportiere gebuchte Journalzeilen samt Stornos für ein Unternehmen in einer Währung.",
  company: "Unternehmen",
  currency: "Währung",
  currencyHint: "Gib einen dreistelligen Währungscode ein, zum Beispiel EUR.",
  otherCurrency: "Andere Währung",
  debitCount: "Sollzeilen",
  creditCount: "Habenzeilen",
  invalidLine:
    "Eine gespeicherte Buchungszeile hat eine ungültige Soll- oder Habenangabe.",
  from: "Von",
  to: "Bis",
  prepare: "CSV vorbereiten",
  preparing: "CSV wird vorbereitet…",
  download: "CSV herunterladen",
  copy: "CSV kopieren",
  copied: "CSV kopiert",
  copyFailed: "CSV konnte nicht kopiert werden. Versuche es erneut.",
  filename: "Dateiname",
  rowCount: "Buchungszeilen",
  invalidDates:
    "Wähle einen gültigen Zeitraum. Das Enddatum darf nicht vor dem Startdatum liegen.",
  tooLarge:
    "Der Export überschreitet 10.000 Buchungszeilen oder 5 MiB. Wähle einen kürzeren Zeitraum.",
  ready: "CSV bereit",
  headerEntry: "Buchungsnummer",
  headerDate: "Buchungsdatum",
  headerPosted: "Gebucht um (UTC)",
  headerSource: "Quelle",
  headerAccountCode: "Kontonummer",
  headerAccountName: "Kontoname",
  headerDescription: "Buchungstext",
  headerLineDescription: "Zeilentext",
  headerCurrency: "Währung",
  headerDebit: "Soll",
  headerCredit: "Haben",
  errors: {
    unauthorized: {
      title: "Nicht autorisiert",
      description: "Anmeldung erforderlich",
    },
    validation: {
      title: "Validierungsfehler",
      description: "Alle Felder prüfen",
    },
    forbidden: {
      title: "Zugriff verweigert",
      description: "Unzureichende Berechtigungen",
    },
    server: {
      title: "Serverfehler",
      description: "Vorgang fehlgeschlagen. Bitte versuchen Sie es erneut.",
    },
    unknown: {
      title: "Unbekannter Fehler",
      description: "Ein unerwarteter Fehler ist aufgetreten",
    },
    conflict: { title: "Konflikt", description: "Datenkonflikt" },
    network: {
      title: "Netzwerkfehler",
      description: "Server nicht erreichbar",
    },
    notFound: {
      title: "Nicht gefunden",
      description: "Ressource nicht gefunden",
    },
    unsavedChanges: {
      title: "Ungespeicherte Änderungen",
      description: "Sie haben ungespeicherte Änderungen",
    },
  },
  tags: { journal: "journal", export: "export" },
};
