import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Rozliczenia",
  tags: {
    payment: "płatność",
    bill: "faktura dostawcy",
    lines: "pozycje",
  },
  post: {
    title: "Usuń pozycję faktury",
    titleShort: "Usuń linię",
    description: "Usuń pozycję ze szkicu faktury dostawcy",
    form: {
      title: "Usuń pozycję",
      description: "Usuwa tę pozycję ze szkicu.",
    },
    response: {
      success: "Pozycja usunięta",
      message: "Komunikat statusu",
    },
    errors: {
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagana autoryzacja",
      },
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry",
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
        description: "Pozycja faktury nie istnieje",
      },
      conflict: {
        title: "Konflikt",
        description:
          "Pozycję można usunąć tylko z edytowalnego szkicu faktury dostawcy.",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Są niezapisane zmiany",
      },
    },
    success: {
      title: "Sukces",
      description: "Pozycja została usunięta.",
    },
  },
  billId: {
    label: "Faktura dostawcy",
    description: "Faktura dostawcy zawierająca pozycję do usunięcia",
  },
  lineId: {
    label: "ID pozycji",
    description: "ID pozycji do usunięcia",
    placeholder: "Wprowadź ID pozycji",
  },
  widget: {
    verifying: "Sprawdzanie wybranej pozycji…",
    unavailable:
      "Tej pozycji nie można już usunąć. Otwórz ponownie szkic i sprawdź jego pozycje.",
    lineGross: "Kwota brutto pozycji: {{amount}}",

    back: "Wróć",
    submit: "Usuń pozycję",
    warning: "Pozycja zostanie trwale usunięta, a suma szkicu przeliczona.",
    confirm: "Usuń pozycję",
    removed: "Pozycja usunięta",
  },
};
