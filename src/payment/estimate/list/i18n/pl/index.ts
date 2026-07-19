import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Oferty",
  enums: {
    estimateStatus: {
      DRAFT: "Szkic",
      SENT: "Wysłana",
      ACCEPTED: "Zaakceptowana",
      DECLINED: "Odrzucona",
      EXPIRED: "Wygasła",
      CONVERTED: "Przekonwertowana",
    },
  },
  tags: {
    payment: "płatność",
    estimate: "oferta",
    list: "lista",
  },
  get: {
    title: "Oferty",
    titleShort: "Wyceny",
    description: "Pobierz paginowaną listę ofert firmy",
    form: {
      title: "Filtry ofert",
      description: "Filtruj i paginuj oferty",
    },
    response: {
      totalCount: "Łączna liczba",
      id: "ID oferty",
      estimateNumber: "Numer oferty",
      status: "Status",
      customerId: "ID klienta",
      customerName: "Nazwa klienta",
      currency: "Waluta",
      total: "Łącznie",
      validUntil: "Ważna do",
      lineCount: "Liczba pozycji",
      createdAt: "Utworzono",
      updatedAt: "Zaktualizowano",
    },
    errors: {
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagane uwierzytelnienie",
      },
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry",
      },
      server: { title: "Błąd serwera", description: "Wewnętrzny błąd serwera" },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd",
      },
      network: { title: "Błąd sieci", description: "Wystąpił błąd sieci" },
      forbidden: { title: "Zabronione", description: "Dostęp zabroniony" },
      notFound: {
        title: "Nie znaleziono",
        description: "Firma nie znaleziona",
      },
      conflict: { title: "Konflikt", description: "Wystąpił konflikt" },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Są niezapisane zmiany",
      },
    },
    success: {
      title: "Sukces",
      description: "Oferty pobrane",
    },
  },
  companyId: {
    label: "ID firmy",
    description: "Filtruj po firmie",
    placeholder: "Wprowadź ID firmy",
  },
  status: {
    label: "Status",
    description: "Filtruj po statusie",
    placeholder: "Wszystkie statusy",
  },
  customerId: {
    label: "ID klienta",
    description: "Filtruj po kliencie",
    placeholder: "Wprowadź ID klienta",
  },
  page: {
    label: "Strona",
    description: "Numer strony",
  },
  pageSize: {
    label: "Rozmiar strony",
    description: "Elementy na stronę",
  },
  widget: {
    back: "Wróć",
    title: "Oferty",
    newEstimate: "Nowa oferta",
    loading: "Ładowanie ofert...",
    noEstimates: "Brak ofert.",
    noEstimatesHint: "Utwórz pierwszą ofertę.",
    empty: {
      title: "Brak ofert.",
      hint: "Utwórz pierwszą ofertę, aby zacząć.",
      cta: "Nowa oferta",
    },
    valid: "Ważna do",
    lines: "pozycji",
    line: "pozycja",
    view: "Podgląd",
    status: {
      draft: "Szkic",
      sent: "Wysłana",
      accepted: "Zaakceptowana",
      declined: "Odrzucona",
      expired: "Wygasła",
      converted: "Przekształcona",
    },
  },
};
