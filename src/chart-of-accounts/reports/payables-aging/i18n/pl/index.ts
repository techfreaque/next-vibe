import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Zobowiązania wobec dostawców",
  titleShort: "Zobowiązania",
  description: "Zobowiązania wobec dostawców według liczby dni opóźnienia.",
  tag: "Zobowiązania",
  company: {
    label: "Firma",
    description: "Wybierz firmę, której faktury zakupu chcesz sprawdzić.",
    choose: "Wybierz firmę",
    empty: "Wybierz firmę, aby sprawdzić jej zobowiązania wobec dostawców.",
  },
  currency: {
    label: "Waluta",
    description: "Pokazuje faktury w jednej walucie. Kwoty nie są przeliczane.",
    default: "Waluta firmy",
    codes: {
      EUR: "EUR",
      USD: "USD",
      PLN: "PLN",
    },
  },
  agingDate: {
    label: "Data raportu",
    description: "Data, względem której liczone są dni po terminie.",
  },
  columns: {
    supplier: "Dostawca",
    vat: "Numer VAT",
    current: "Przed terminem",
    days1to30: "1–30 dni",
    days31to60: "31–60 dni",
    days61to90: "61–90 dni",
    over90: "91+ dni",
    undated: "Bez terminu",
    total: "Razem",
    billNumber: "Numer faktury",
    billDate: "Data faktury",
    dueDate: "Termin płatności",
    billAmount: "Kwota w groszach",
  },
  approved: {
    title: "Zatwierdzone i niezapłacone",
    empty: "Brak faktur do zapłaty",
    emptyDescription:
      "Tutaj pojawią się zatwierdzone faktury z nieuregulowaną kwotą.",
  },
  received: {
    title: "Do zatwierdzenia",
    empty: "Brak faktur do zatwierdzenia",
    emptyDescription: "Otrzymane faktury pozostają tutaj do zatwierdzenia.",
  },
  disputed: {
    title: "Sporne",
    empty: "Brak spornych faktur",
    emptyDescription:
      "Faktury sporne nie wchodzą do sum faktur zatwierdzonych ani oczekujących.",
  },
  widget: {
    showBills: "Pokaż faktury",
    asOf: "Stan na {{date}}",
    back: "Wróć",
    loading: "Wczytywanie zobowiązań",
    details: "Faktury od {{supplier}}",
    unknownSupplier: "Nieznany dostawca",
    datedBill: "Faktura z {{date}}",
    due: "Termin {{date}}",
  },
  success: {
    title: "Wczytano zobowiązania",
    description: "Faktury zakupu wybranej firmy są gotowe do sprawdzenia.",
  },
  errors: {
    validation: {
      title: "Sprawdź filtry raportu",
      description: "Wybierz prawidłową datę oraz walutę.",
    },
    unauthorized: {
      title: "Zaloguj się",
      description: "Zaloguj się, aby wyświetlić zobowiązania.",
    },
    forbidden: {
      title: "Firma niedostępna",
      description: "Nie masz dostępu do faktur zakupu tej firmy.",
    },
    notFound: {
      title: "Nie znaleziono",
      description: "Nie udało się znaleźć żądanego elementu.",
    },
    server: {
      title: "Nie udało się wczytać zobowiązań",
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
