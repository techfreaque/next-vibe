import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Oferty",
  tags: {
    payment: "płatność",
    estimate: "oferta",
    ar: "należności",
  },
  post: {
    title: "Utwórz ofertę",
    titleShort: "Utwórz wycenę",
    description: "Utwórz nową ofertę handlową w stanie roboczym",
    form: {
      title: "Nowa oferta",
      description: "Wypełnij szczegóły oferty",
    },
    response: {
      success: "Oferta utworzona",
      message: "Komunikat statusu",
      estimate: {
        title: "Oferta",
        subtitle: "Utworzona oferta",
        id: "ID oferty",
        companyId: "ID firmy",
        estimateNumber: "Numer oferty",
        status: "Status",
        customerId: "ID klienta",
        customerEmail: "E-mail klienta",
        customerName: "Nazwa klienta",
        currency: "Waluta",
        validUntil: "Ważna do",
        title_field: "Tytuł",
        notes: "Uwagi",
        terms: "Warunki",
        subtotal: "Suma częściowa",
        taxAmount: "Kwota podatku",
        total: "Łącznie",
        invoiceId: "ID faktury",
        createdAt: "Utworzono",
        updatedAt: "Zaktualizowano",
      },
    },
    errors: {
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagane uwierzytelnienie",
      },
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry oferty",
      },
      server: {
        title: "Błąd serwera",
        description: "Wewnętrzny błąd serwera",
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
        description: "Wymagane uprawnienia księgowego lub administratora",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Firma nie znaleziona",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Są niezapisane zmiany",
      },
    },
    success: {
      title: "Sukces",
      description: "Oferta utworzona jako szkic",
    },
    widget: {
      back: "Wróć",
      submit: "Utwórz ofertę",
      viewButton: "Zobacz ofertę",
    },
  },
  companyId: {
    label: "ID firmy",
    description: "Firma wystawiająca tę ofertę",
    placeholder: "Wprowadź ID firmy",
  },
  customerId: {
    label: "ID klienta",
    description: "Opcjonalne: UUID klienta",
    placeholder: "Wprowadź ID klienta",
  },
  customerEmail: {
    label: "E-mail klienta",
    description: "Adres e-mail klienta",
    placeholder: "klient@przykład.pl",
  },
  customerName: {
    label: "Nazwa klienta",
    description: "Nazwa klienta",
    placeholder: "Wprowadź nazwę klienta",
  },
  currency: {
    label: "Waluta",
    description: "Waluta oferty",
    placeholder: "EUR",
  },
  validUntil: {
    label: "Ważna do",
    description: "Data ważności oferty",
    placeholder: "Wybierz datę wygaśnięcia",
  },
  title: {
    label: "Tytuł",
    description: "Krótki tytuł oferty",
    placeholder: "np. Oferta na przeprojektowanie strony",
  },
  notes: {
    label: "Uwagi",
    description: "Opcjonalne uwagi widoczne na ofercie",
    placeholder: "np. Ceny ważne przez 30 dni",
  },
  terms: {
    label: "Warunki",
    description: "Warunki płatności lub dostawy",
    placeholder: "np. 50% zaliczki, 50% przy dostawie",
  },
  lines: {
    label: "Pozycje",
    description: "Pozycje zawarte w ofercie",
  },
};
