import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Rozliczenia",
  tags: {
    payment: "płatność",
    invoice: "faktura",
    lines: "pozycje",
  },
  post: {
    title: "Usuń pozycję faktury",
    titleShort: "Usuń linię",
    description: "Usuń pozycję z faktury w trybie szkicu",
    form: {
      title: "Usuń pozycję",
      description: "Trwale usuwa tę pozycję z faktury",
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
        description: "Faktura nie jest w trybie szkicu",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Są niezapisane zmiany",
      },
    },
    success: {
      title: "Sukces",
      description: "Pozycja usunięta z faktury",
    },
  },
  lineId: {
    label: "ID pozycji",
    description: "ID pozycji do usunięcia",
    placeholder: "Wprowadź ID pozycji",
  },
  widget: {
    back: "Wróć",
    submit: "Usuń pozycję",
    warning: "Ta pozycja zostanie trwale usunięta z faktury.",
    confirm: "Usuń pozycję",
    removed: "Pozycja usunięta",
  },
};
