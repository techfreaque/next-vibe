import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  possibleDuplicateBookings:
    "Die Buchungen könnten sich mit einem früheren Import überschneiden. Prüfen Sie das Bankkonto im Hauptbuch vor einem neuen Versuch. Es wurden keine Buchungen gespeichert.",
  privacyBeforeImport:
    "Legen Sie den Datenschutz fest, bevor Sie Buchungen in der Vorschau prüfen oder importieren.",
  previewResult: "Ergebnis der Vorschau",
  importResult: "Importergebnis",
  bookingDay: "Buchungstag {{date}}",
  bookingWindow: "Buchungszeitraum vom {{from}} bis {{to}}",
  providerBookings: "Buchungen des Anbieters geprüft",
  eligibleBookings: "Zulässige geschäftliche Buchungen",
  savedBookings: "Gespeicherte Buchungen",
  previewPrivacyResult:
    "Verworfene Buchungen erfüllten Ihre Datenschutzregeln nicht. Beim Speichern werden passende Rechnungen zugeordnet. Uneindeutige Fälle bleiben ohne Zuordnung.",
  importPrivacyResult:
    "Verworfene Buchungen erfüllten Ihre Datenschutzregeln nicht. Uneindeutige Rechnungszuordnungen bleiben offen.",
  setup: "Bankverbindung einrichten",
  setupHint:
    "Speichern Sie das Bankkonto und das Startdatum. Legen Sie danach den Datenschutz fest. Die Einrichtung liest keine Umsätze.",
  privacyAction: "Datenschutz festlegen",
  privacyRequired:
    "Speichern Sie die Datenschutzeinstellungen, bevor Sie Bankumsätze abrufen.",
  setupSaved:
    "Bankverbindung gespeichert. Sie können jetzt Lieferantenregeln festlegen.",
  supplierTotals: "Zugeordnete Lieferantenbeträge im Zeitraum",
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
  maintenance: "Bankverbindungen pflegen",
  maintenanceHint:
    "Abgelaufene private Daten löschen, Kontoinhaber an auslaufende Freigaben erinnern und aktivierte Verbindungen aktualisieren.",
  completed: "Aktualisierte Verbindungen",
  failedFeeds: "Zu prüfende Verbindungen",
  notified: "Gesendete Erinnerungen",
  matchedOnly: "Nur Treffer für Lieferantenregeln übernehmen",
  discardedCount: "Verworfen",
  autoMatched: "Belegen zugeordnet",
  discardHint:
    "Umsätze ohne Treffer werden ohne Speicherung verworfen. Deaktivieren Sie die Option, um den privaten Prüfeingang zu nutzen.",
  company: "Unternehmen",
  account: "Bankkonto im Hauptbuch",
  start: "Erster Buchungstag",
  daily: "Täglich abrufen",
  connect: "Bank verbinden",
  review: "Umsätze prüfen",
  held: "Zur Prüfung",
  privateCount: "Privat",
  connected: "Bank verbunden.",
  failed: "Die Verbindung ist fehlgeschlagen. Verbinden Sie die Bank erneut.",
  check: "Anwendung prüfen",
  active: "Die Anwendung ist für Kontoinformationen freigeschaltet.",
  inactive: "Die Anwendung ist für Kontoinformationen nicht freigeschaltet.",
  appUnavailable: "Anwendungsstatus nicht verfügbar.",
  linking:
    "Die Verknüpfung im Anbieterportal schaltet das Konto frei. Erteilen Sie hier einmalig den Zugriff. Bereits erteilte Freigaben erscheinen automatisch.",
  pick: "Wählen Sie ein Konto für die Vorschau der gebuchten Umsätze.",
  apply: "Import ausführen",
  previewAction: "Importvorschau",
  dailyHint:
    "Wählen Sie das Startdatum und prüfen Sie die Lieferantentreffer vor dem Import.",
  title: "Verbundene Bankkonten",
  description:
    "Prüfen oder importieren Sie gebuchte Umsätze eines freigegebenen Bankkontos.",
  select: "Bankverbindung wählen",
  preview: "Nur Vorschau",
  sync: "Bankumsätze abrufen",
  connection: "Bankverbindung",
  consentUntil: "Einwilligung gültig bis",
  period: "Buchungszeitraum",
  imported: "Importiert",
  skipped: "Bereits importiert",
  unavailable:
    "Diese Bankverbindung ist nicht verfügbar. Prüfen Sie Verbindung und Kontoberechtigungen.",
  consent: "Die Einwilligung ist abgelaufen. Erneuern Sie sie bei der Bank.",
  rateLimit: "Die Bank ist ausgelastet. Versuchen Sie es später erneut.",
  invalidResponse:
    "Der Kontoauszug ist unvollständig. Der Importstand wurde beibehalten.",
  windowTooLarge:
    "Der Zeitraum enthält zu viele Buchungen. Importieren Sie einen kleineren Auszug.",
  empty: "Keine verbundenen Bankkonten",
  noBookings: "Keine Buchungen in diesem Zeitraum.",
  newBookings: "Neue Buchungen",
  through: "Letzter importierter Buchungstag",
};
