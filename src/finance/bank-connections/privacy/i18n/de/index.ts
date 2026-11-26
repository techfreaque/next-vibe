import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Privatsphäre bei Bankkonten",
  description:
    "Prüfen Sie gemischte Kontobewegungen vor der Übernahme in die Buchhaltung.",
  connection: "Bankverbindung",
  empty: "Für diese Verbindung gibt es keine offenen Prüfungen.",
  selectConnection:
    "Wählen Sie eine Bankverbindung, um ihre Einstellungen zu öffnen.",
  policy: "Datenschutzeinstellungen",
  policyDescription:
    "Legen Sie fest, welche Bankbewegungen in die Buchhaltung gelangen.",
  mode: "Kontomodus",
  retention: "Aufbewahrung in Tagen",
  rules: "Regeln",
  suggestions: "Vorgeschlagene Lieferanten",
  inbox: "Offene Prüfungen",
  decision: "Entscheidung über die Buchung",
  decisionDescription:
    "Übernehmen Sie die Bewegung als geschäftlich oder löschen Sie die Details als privat.",
  operation: "Regelaktion",
  ruleField: "Prüffeld",
  ruleMatch: "Vergleich",
  literal: "Suchtext",
  outcome: "Ergebnis",
  ruleSupplier: "Lieferant für die Summen (optional)",
  chooseSupplier: "Lieferant auswählen",
  clearSupplier: "Lieferant entfernen",
  identity: "Kennung der Bewegung",
  always: "Diese Entscheidung immer auf genau diesen Zahlungspartner anwenden",
  apply: "Anwenden",
  saved: "Gespeichert",
  ruleSaved: "Regel gespeichert",
  ruleFailed:
    "Die Entscheidung wurde gespeichert. Die Regel konnte nicht gespeichert werden.",
  addSuggestion: "Als Geschäftsregel hinzufügen",
  editPolicy: "Datenschutz bearbeiten",
  editRule: "Regel hinzufügen oder ändern",
  approving: "Geschäftliche Übernahme ausstehend",
  privateAction: "Diese Bewegung privat halten",
  businessAction: "In die Buchhaltung übernehmen",
  expires: "Läuft am {{date}} ab",
  businessExplanation:
    "Im Geschäftskontomodus gelangen neue Bewegungen ohne Regel direkt in die Buchhaltung.",
  modes: {
    mixed: "Gemischtes Konto",
    business: "Reines Geschäftskonto",
  },
  outcomes: {
    business: "Geschäftlich",
    private: "Privat",
  },
  ruleFields: {
    counterparty: "Zahlungspartner",
    iban: "IBAN",
    description: "Beschreibung",
  },
  matches: {
    equals: "Genau gleich",
    contains: "Enthält",
    startsWith: "Beginnt mit",
  },
  operations: {
    policy: "Einstellungen ändern",
    set: "Regel hinzufügen oder ersetzen",
    remove: "Regel entfernen",
  },
  errors: {
    forbidden: "Diese Bankverbindung gehört Ihnen nicht.",
    invalid: "Prüfen Sie die Eingaben und versuchen Sie es erneut.",
    conflict: "Die Bewegung wurde geändert oder der Beleg ist abgelaufen.",
    unavailable: "Der Datenschutzvorgang konnte nicht abgeschlossen werden.",
    import: "Die freigegebene Bewegung konnte nicht übernommen werden.",
  },
};
