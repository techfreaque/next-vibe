import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    bank: "bank",
    reconciliation: "uzgadnianie",
  },
  fields: {
    exactAmount: "Dokładna kwota",
    status: "Status",
    company: "Firma",
    account: "Konto bankowe",
    csv: "Wyciąg CSV",
    line: "Pozycja bankowa",
    transactionId: "Identyfikator transakcji",
    bookedDate: "Data księgowania",
    amount: "Kwota",
    currency: "Waluta",
    journalLine: "Pozycja księgowa",
    entryNumber: "Zapis księgowy",
    description: "Opis",
    journalDate: "Data zapisu",
    confirm: "Potwierdź dopasowanie",
    imported: "Zaimportowano",
    skipped: "Pominięte duplikaty",
    matchedAt: "Dopasowano",
    page: "Strona",
    pageSize: "Pozycji na stronie",
    total: "Razem",
  },
  ui: {
    csvFormat: "Format CSV",
    commaFormat: "Przecinek jako separator, kropka dziesiętna",
    semicolonFormat: "Średnik jako separator, przecinek dziesiętny",
    sameDay: "Ta sama kwota i data",
    upload: "Wybierz plik CSV",
    dropCsv: "Lub upuść tutaj plik CSV",
    pasteCsv: "Wklej tekst CSV",
    supportedFormat: "Obsługiwany format",
    mapping: "Przypisz kolumny",
    chooseColumn: "Wybierz kolumnę CSV",
    preview: "Podgląd (pierwsze 5 operacji)",
    matchRow: "Dopasuj",
    unmatched: "Do dopasowania",
    csvHelp:
      "Przypisz stały identyfikator, datę (RRRR-MM-DD lub DD.MM.RRRR), kwotę ze znakiem w wybranym formacie dziesiętnym i kod waluty wielkimi literami. Kwoty dodatnie oznaczają wpływy. Jedna operacja w wierszu, bez separatorów tysięcy.",
    unsupported:
      "Najpierw przekonwertuj pliki CAMT XML, OFX/QFX, MT940, arkusze, PDF i CSV z innym separatorem lub wielowierszowymi rekordami.",
    chooseScope: "Wybierz firmę i aktywne konto bankowe.",
    empty: "Brak niedopasowanych pozycji",
    emptyHint: "Zaimportuj wyciąg, aby rozpocząć uzgadnianie.",
    review: "Sprawdź dopasowania",
    noCandidates: "Brak pasujących pozycji księgowych",
    noCandidatesHint: "Sprawdź konto bankowe, walutę i kwotę zapisu.",
    alreadyMatched: "Ta pozycja jest już dopasowana.",
    importAction: "Importuj CSV",
    listAction: "Pokaż pozycje bankowe",
    back: "Wstecz",
    previous: "Poprzednia",
    next: "Następna",
    matchAction: "Dopasuj ten zapis",
    confirmHint:
      "Powiązanie zapisuje, kto potwierdził dopasowanie. Nie tworzy zapisu księgowego ani przelewu.",
  },
  errors: {
    validation: {
      title: "Sprawdź dane",
      description:
        "Wybierz firmę i aktywne księgowe konto bankowe w jej walucie.",
    },
    network: {
      title: "Błąd połączenia",
      description: "Sprawdź połączenie i spróbuj ponownie.",
    },
    unauthorized: {
      title: "Zaloguj się",
      description: "Zaloguj się, aby uzgadniać wyciągi.",
    },
    forbidden: {
      title: "Brak dostępu",
      description: "Twoja rola w firmie nie pozwala na tę operację.",
    },
    notFound: {
      title: "Pozycja bankowa lub konto niedostępne",
      description: "Sprawdź wybraną firmę i konto bankowe.",
    },
    server: {
      title: "Operacja bankowa nie powiodła się",
      description: "Spróbuj ponownie. Po błędzie dane pozostają bez zmian.",
    },
    unknown: {
      title: "Nieoczekiwany błąd bankowy",
      description: "Spróbuj ponownie.",
    },
    unsavedChanges: {
      title: "Niezapisane zmiany",
      description: "Zmiany nadal znajdują się w formularzu.",
    },
    conflict: {
      title: "Konflikt uzgadniania",
      description: "Odśwież wyciąg i sprawdź wybrany zapis.",
    },
  },
  check: {
    encoding: "Zapisz plik jako CSV w kodowaniu UTF-8.",
    mappingHeader:
      "Wybierz separator i podaj w nagłówku co najmniej cztery nazwane kolumny.",
    mapping: "Wybierz inną kolumnę dla każdego wymaganego pola.",
    columns: "Wiersz {{row}} musi mieć te same kolumny co nagłówek.",
    value: "W wierszu {{row}} wartość pola {{field}} jest nieprawidłowa.",
    size: "Użyj pliku CSV do 256 KB i 1000 pozycji.",
    header: "Użyj dokładnie nagłówków transactionId,date,amount,currency.",
    empty: "Dodaj co najmniej jedną pozycję transakcji.",
    row: "Sprawdź identyfikator, datę, kwotę ze znakiem i walutę w wierszu {{row}}.",
    duplicate:
      "Wiersz {{row}} zawiera powtórzony identyfikator z innymi danymi.",
    storedDuplicate:
      "Zapisana pozycja ma już ten identyfikator z innymi danymi.",
    currency: "Wszystkie pozycje muszą używać waluty firmy.",
    journalTaken: "Wybrana pozycja księgowa jest już dopasowana.",
    journalMatch:
      "Wybierz niedopasowany zapis na tym samym koncie bankowym, o tej samej kwocie i walucie.",
    confirmation: "Potwierdź dopasowanie przed zapisaniem.",
  },
  import: {
    title: "Import wyciągu bankowego",
    description: "Prześlij lub wklej CSV z jednego rachunku bankowego.",
    success: "Wyciąg przetworzony",
  },
  list: {
    title: "Niedopasowane pozycje bankowe",
    description: "Sprawdź pozycje wyciągu i połącz je z zapisami księgowymi.",
    success: "Pozycje bankowe wczytane",
  },
  candidates: {
    title: "Znajdź zapis księgowy",
    description: "Sprawdź zaksięgowane pozycje o tej samej kwocie i kierunku.",
    success: "Dopasowania wczytane",
  },
  match: {
    title: "Potwierdź dopasowanie bankowe",
    description: "Powiąż tę pozycję wyciągu z zapisem księgowym.",
    success: "Pozycja bankowa dopasowana",
  },
};
