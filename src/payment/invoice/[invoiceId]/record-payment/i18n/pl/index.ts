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
  accountNodeId: {
    label: "ID węzła konta",
    description: "Opcjonalnie: węzeł księgowy, który otrzymał tę płatność",
    placeholder: "Wprowadź ID węzła",
  },
  widget: {
    back: "Wróć",
    submit: "Zarejestruj płatność",
    paymentRecorded: "Płatność została zarejestrowana.",
    viewInvoice: "Zobacz fakturę",
  },
};
