import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Oferty",
  tags: { payment: "płatność", estimate: "oferta" },
  post: {
    title: "Zaakceptuj ofertę",
    titleShort: "Zaakceptuj wycenę",
    description: "Oznacz ofertę jako zaakceptowaną przez klienta",
    form: {
      title: "Zaakceptuj ofertę",
      description: "Oznacz ofertę jako zaakceptowaną przez klienta",
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
      description: "Oznacz ofertę jako zaakceptowaną przez klienta",
    },
  },
  estimateId: {
    label: "ID oferty",
    description: "Oferta, na której wykonywana jest akcja",
  },
  widget: {
    back: "Wróć",
    submit: "Zaakceptuj ofertę",
    accepted: "Oferta oznaczona jako zaakceptowana.",
    confirmMessage:
      "Oferta zostanie oznaczona jako zaakceptowana przez klienta.",
  },
};
