import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Prywatność rachunku bankowego",
  description:
    "Sprawdź mieszane operacje bankowe, zanim trafią do księgowości.",
  connection: "Połączenie bankowe",
  empty: "To połączenie nie ma oczekujących pozycji.",
  selectConnection:
    "Wybierz połączenie bankowe, aby zobaczyć ustawienia prywatności.",
  policy: "Ustawienia prywatności",
  policyDescription: "Zdecyduj, które operacje mogą trafić do księgowości.",
  mode: "Tryb",
  retention: "Przechowywanie w dniach",
  rules: "Reguły",
  suggestions: "Sugerowani dostawcy",
  inbox: "Do sprawdzenia",
  decision: "Decyzja w sprawie operacji",
  decisionDescription:
    "Wybierz firmową, aby ją zaimportować, lub prywatną, aby usunąć szczegóły.",
  operation: "Operacja na regule",
  ruleField: "Pole dopasowania",
  ruleMatch: "Typ dopasowania",
  literal: "Tekst do dopasowania",
  outcome: "Wynik",
  ruleSupplier: "Dostawca w podsumowaniu (opcjonalnie)",
  chooseSupplier: "Wybierz dostawcę",
  clearSupplier: "Usuń dostawcę",
  identity: "Identyfikator operacji",
  always: "Zawsze stosuj tę decyzję wobec tego kontrahenta",
  apply: "Zastosuj",
  saved: "Zapisano",
  ruleSaved: "Zapisano regułę",
  ruleFailed: "Zapisano decyzję. Nie udało się zapisać reguły.",
  addSuggestion: "Dodaj regułę firmową",
  editPolicy: "Edytuj ustawienia",
  editRule: "Dodaj lub zmień regułę",
  approving: "Oczekuje na import firmowy",
  privateAction: "Zachowaj operację jako prywatną",
  businessAction: "Przekaż do księgowości",
  expires: "Wygasa {{date}}",
  businessExplanation:
    "W trybie firmowym nowe niedopasowane operacje trafiają do księgowości.",
  modes: {
    mixed: "Konto mieszane",
    business: "Konto wyłącznie firmowe",
  },
  outcomes: {
    business: "Firmowa",
    private: "Prywatna",
  },
  ruleFields: {
    counterparty: "Kontrahent",
    iban: "IBAN",
    description: "Opis",
  },
  matches: {
    equals: "Dokładnie",
    contains: "Zawiera",
    startsWith: "Zaczyna się od",
  },
  operations: {
    policy: "Zmień ustawienia",
    set: "Dodaj lub zastąp regułę",
    remove: "Usuń regułę",
  },
  errors: {
    forbidden: "To połączenie bankowe nie należy do Ciebie.",
    invalid: "Sprawdź pola i spróbuj ponownie.",
    conflict: "Operacja uległa zmianie lub jej dane wygasły.",
    unavailable: "Nie udało się wykonać operacji prywatności.",
    import: "Nie udało się zaimportować zatwierdzonej operacji.",
  },
};
