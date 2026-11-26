import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Rozliczenia",
  enums: {
    manualPaymentMethod: {
      cash: "Gotówka",
      bankTransfer: "Przelew bankowy",
      other: "Inne",
    },
  },
  tags: {
    payment: "płatność",
    invoice: "faktura",
  },
  post: {
    title: "Zarejestruj płatność ręczną",
    titleShort: "Zarejestruj płatność",
    description:
      "Zarejestruj ręczną płatność do faktury. Oznacza jako opłaconą, gdy w pełni rozliczona.",
    form: {
      title: "Zarejestruj płatność",
      description: "Wprowadź dane płatności dla tej faktury",
    },
    response: {
      success: "Płatność zarejestrowana",
      message: "Komunikat statusu",
    },
    errors: {
      receiptKeyConflict: "Ten klucz jest już przypisany do innej płatności.",
      paymentPrecision:
        "Wpisz dodatnią kwotę z maksymalnie dwoma miejscami po przecinku.",
      paymentStatus:
        "Rejestruj płatności do otwartych faktur z dodatnią kwotą.",
      overpayment: "Płatność przekracza kwotę pozostałą do zapłaty.",
      fullPayment: "W przypadku faktury bez firmy wpisz całą pozostałą kwotę.",
      issuancePosting:
        "Przed płatnością zaksięguj należność zgodną z kwotą faktury.",
      paymentAccount: "Wybierz aktywne konto bankowe lub kasowe tej firmy.",
      paymentPosting: "Sprawdź datę płatności, walutę firmy i konta księgowe.",
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagana autoryzacja",
      },
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry płatności",
      },
      server: {
        title: "Błąd serwera",
        description: "Wystąpił wewnętrzny błąd serwera",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd",
      },
      network: {
        title: "Błąd sieci",
        description: "Wystąpił błąd sieci",
      },
      forbidden: {
        title: "Zabronione",
        description: "Dostęp zabroniony",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Faktura nie istnieje",
      },
      conflict: {
        title: "Konflikt",
        description: "Faktura jest już opłacona lub unieważniona",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Są niezapisane zmiany",
      },
    },
    success: {
      title: "Sukces",
      description: "Płatność ręczna zarejestrowana",
    },
  },
  invoiceId: {
    label: "ID faktury",
    description: "ID faktury, do której rejestrujesz płatność",
    placeholder: "Wprowadź ID faktury",
  },
  amount: {
    label: "Zapłacona kwota",
    description: "Otrzymana kwota",
    placeholder: "0,00",
  },
  method: {
    label: "Metoda płatności",
    description: "Jak wpłynęła płatność",
    placeholder: "Wybierz metodę",
  },
  paidAt: {
    label: "Data płatności",
    description: "Kiedy płatność wpłynęła",
    placeholder: "Wybierz datę",
  },
  receiptKey: {
    label: "Klucz płatności",
    description:
      "Ponów tę płatność z tym samym kluczem. Dla kolejnego wpływu użyj nowego klucza.",
  },
  accountNodeId: {
    label: "Konto płatności",
    description: "Wybierz konto bankowe lub kasę, do której wpłynęła płatność.",
    placeholder: "Wybierz konto",
    automatic: "Użyj konta domyślnego",
  },
  widget: {
    details: "Szczegóły płatności",
    back: "Wróć",
    submit: "Zarejestruj płatność",
    paymentRecorded: "Płatność została zarejestrowana.",
    viewInvoice: "Zobacz fakturę",
    amountDue: "{{amount}} do zapłaty",
    notOpenTitle: "Ta faktura nie jest otwarta",
    notOpenMessage:
      "Płatność zapiszesz tylko na wystawionej, nieopłaconej fakturze. Najpierw wystaw fakturę albo otwórz właściwą.",
  },
};
