import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Oferty",
  tags: { payment: "płatność", estimate: "oferta" },
  post: {
    title: "Duplikuj ofertę",
    titleShort: "Duplikuj wycenę",
    description: "Sklonuj tę ofertę jako nowy szkic",
    form: {
      title: "Duplikuj ofertę",
      description: "Sklonuj tę ofertę jako nowy szkic",
    },
    response: {
      success: "Sukces",
      message: "Komunikat statusu",
      newEstimateId: "Nowe ID oferty",
      estimateNumber: "Nowy numer oferty",
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
        description: "Akcja niemożliwa w bieżącym statusie",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Są niezapisane zmiany",
      },
    },
    success: {
      title: "Oferta zduplikowana",
      description: "Nowy szkic oferty został utworzony",
    },
  },
  estimateId: {
    label: "ID oferty",
    description: "Oferta do zduplikowania",
  },
  widget: {
    back: "Wróć",
    submit: "Duplikuj ofertę",
    viewDuplicate: "Zobacz duplikat",
    duplicateNote:
      "Zostanie utworzony nowy szkic oferty z tymi samymi pozycjami i szczegółami.",
  },
};
