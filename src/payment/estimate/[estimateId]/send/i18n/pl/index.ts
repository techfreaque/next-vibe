import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Oferty",
  tags: { payment: "płatność", estimate: "oferta" },
  post: {
    title: "Oznacz ofertę jako wysłaną",
    titleShort: "Oznacz ofertę jako wysłaną",
    description: "Oznacz ofertę jako wysłaną do klienta",
    form: {
      title: "Oznacz ofertę jako wysłaną",
      description: "Oznacz ofertę jako wysłaną do klienta",
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
      description: "Oznacz ofertę jako wysłaną do klienta",
    },
  },
  estimateId: {
    label: "ID oferty",
    description: "Oferta, na której wykonywana jest akcja",
  },
  widget: {
    back: "Wróć",
    submit: "Oznacz jako wysłaną",
    sent: "Oferta oznaczona jako wysłana do klienta.",
    sendNote: "Potwierdź wysłanie oferty do klienta.",
  },
};
