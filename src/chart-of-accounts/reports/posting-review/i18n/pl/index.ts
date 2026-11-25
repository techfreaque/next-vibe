import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Kontrola księgowa",
  description:
    "Sprawdź aktywne zapisy dziennika i powiązania wystawionych faktur sprzedaży oraz zatwierdzonych lub opłaconych faktur zakupu.",
  tag: "Sprawdź zapisy",
  company: {
    label: "Firma",
    description: "Wybierz firmę, której zapisy chcesz sprawdzić.",
    choose: "Wybierz firmę",
    empty:
      "Wybierz firmę, aby sprawdzić zapisy dziennika i ich powiązania z dokumentami.",
  },
  filters: {
    issue: "Rodzaj błędu",
    all: "Wszystkie błędy",
    matches: "Pasujące błędy",
  },
  issues: {
    missingLines: "Brak pozycji zapisu",
    invalidLegs: "Błędne pozycje zapisu",
    invoiceLink: "Powiązania faktur sprzedaży",
    billLink: "Powiązania faktur zakupu",
  },
  reasons: {
    fewLines:
      "Zapis ma mniej niż dwie pozycje. Otwórz zapis i sprawdź dokument źródłowy.",
    invalidLegs:
      "Co najmniej jedna waluta się nie bilansuje albo pozycja ma błędną kwotę, konto lub stronę zapisu. Otwórz zapis, aby go sprawdzić.",
    noBacklink:
      "Dokument nie ma powiązanego zapisu dziennika. Sprawdź źródło przed księgowaniem lub rejestracją płatności.",
    wrongPosting:
      "Powiązany zapis nie istnieje, pochodzi z innego źródła lub nie jest już aktywny. Sprawdź historię księgowania dokumentu.",
    controlLeg:
      "Powiązany zapis ma błędne saldo, walutę lub kwotę na koncie rozrachunkowym. Sprawdź źródło przed rejestracją płatności.",
  },
  columns: {
    record: "Pozycja",
    date: "Data",
    reason: "Wynik kontroli",
    counterparty: "Kontrahent",
    open: "Otwórz pozycję",
  },
  records: {
    journal: "Zapis dziennika",
    invoice: "Faktura sprzedaży",
    bill: "Faktura zakupu",
    journalDate: "Data zapisu",
    invoiceDate: "Data utworzenia faktury",
    billDate: "Data faktury zakupu",
    dateInfo: "{{label}} {{date}}",
    openJournal: "Otwórz zapis",
    openInvoice: "Otwórz fakturę sprzedaży",
    openBill: "Otwórz fakturę zakupu",
  },
  pagination: {
    pageLabel: "Strona",
    pageSize: "Pozycji na stronie",
    totalPages: "Liczba stron",
    previous: "Wstecz",
    next: "Dalej",
    pageInfo: "Strona {{page}} z {{total}}",
    firstPage: "Pierwsza strona",
    emptyPage: "Na tej stronie nie ma pozycji",
  },
  widget: {
    loading: "Wczytywanie kontroli księgowej",
    empty: "Brak pasujących błędów księgowania",
    coverage:
      "Kontrola obejmuje aktywne zapisy pierwotne oraz wystawione faktury sprzedaży i zatwierdzone lub opłacone faktury zakupu o dodatniej wartości.",
    back: "Wróć",
  },
  success: {
    title: "Kontrola gotowa",
    description: "Sprawdzono zapisy dziennika i powiązania dokumentów.",
  },
  errors: {
    validation: {
      title: "Sprawdź filtry raportu",
      description:
        "Wybierz prawidłowy filtr niezgodności, stronę i liczbę wierszy.",
    },
    unauthorized: {
      title: "Zaloguj się",
      description: "Zaloguj się, aby sprawdzić księgowania.",
    },
    forbidden: {
      title: "Firma niedostępna",
      description: "Nie masz dostępu do księgowości tej firmy.",
    },
    notFound: {
      title: "Nie znaleziono",
      description: "Nie udało się znaleźć żądanego elementu.",
    },
    server: {
      title: "Nie udało się wczytać kontroli księgowej",
      description: "Spróbuj ponownie wczytać raport.",
    },
    network: {
      title: "Brak połączenia",
      description: "Sprawdź połączenie i spróbuj ponownie.",
    },
    conflict: {
      title: "Konflikt raportu",
      description: "Odśwież stronę i ponownie otwórz raport.",
    },
    unknown: {
      title: "Nieoczekiwany błąd",
      description: "Spróbuj ponownie lub skontaktuj się z pomocą.",
    },
    unsavedChanges: {
      title: "Niezapisane zmiany",
      description: "Zapisz lub odrzuć zmiany przed wyjściem.",
    },
  },
};
