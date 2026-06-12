import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Oferty",
  tags: { payment: "płatność", estimate: "oferta", invoice: "faktura" },
  post: {
    title: "Przekonwertuj ofertę na fakturę",
    titleShort: "Konwertuj na fakturę",
    description: "Przekonwertuj zaakceptowaną ofertę na szkic faktury",
    form: {
      title: "Konwertuj na fakturę",
      description: "Przekonwertuj tę ofertę na fakturę",
    },
    response: {
      success: "Przekonwertowano na fakturę",
      message: "Komunikat statusu",
      invoiceId: "ID utworzonej faktury",
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
        description: "Oferta nie znaleziona",
      },
      conflict: {
        title: "Konflikt",
        description: "Oferta musi być w statusie WYSŁANA lub ZAAKCEPTOWANA",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Są niezapisane zmiany",
      },
    },
    success: {
      title: "Sukces",
      description: "Oferta przekonwertowana na fakturę",
    },
  },
  estimateId: { label: "ID oferty", description: "Oferta do konwersji" },
  widget: {
    back: "Wróć",
    submit: "Przekształć w fakturę",
    converted: "Na podstawie tej oferty utworzono fakturę.",
    viewInvoice: "Zobacz fakturę",
    convertNote:
      "Zostanie utworzony szkic faktury z tymi samymi pozycjami. Oferta zostanie oznaczona jako przekonwertowana.",
  },
};
