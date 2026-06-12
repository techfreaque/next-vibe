import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Oferty",
  tags: { payment: "płatność", estimate: "oferta" },
  post: {
    title: "Pobierz ofertę",
    titleShort: "Pokaż wycenę",
    description: "Pobierz ofertę z wszystkimi pozycjami",
    form: {
      title: "Pobierz ofertę",
      description: "Pobierz ofertę z wszystkimi pozycjami",
    },
    response: { success: "Sukces", message: "Komunikat statusu" },
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
        description: "Oferta nie znaleziona",
      },
      conflict: {
        title: "Konflikt",
        description: "Akcja niemożliwa w bieżącym statusie",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Są niezapisane zmiany",
      },
    },
    success: {
      title: "Sukces",
      description: "Pobierz ofertę z wszystkimi pozycjami",
    },
  },
  estimateId: {
    label: "ID oferty",
    description: "Oferta, na której wykonywana jest akcja",
  },
  widget: {
    back: "Wróć",
    submit: "Wyszukaj ofertę",
    estimateNumber: "Oferta",
    valid: "Ważna do",
    customer: "Klient",
    lineItems: "Pozycje",
    description: "Opis",
    qty: "Ilość",
    unitPrice: "Cena jedn.",
    tax: "VAT",
    total: "Razem",
    subtotal: "Suma cz.",
    sendEstimate: "Wyślij",
    acceptEstimate: "Zaakceptuj",
    declineEstimate: "Odrzuć",
    convertToInvoice: "Przekształć w fakturę",
    duplicate: "Duplikuj",
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
