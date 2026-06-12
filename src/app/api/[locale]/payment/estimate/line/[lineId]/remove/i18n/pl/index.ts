import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Oferty",
  tags: { payment: "płatność", estimate: "oferta", lines: "pozycje" },
  post: {
    title: "Usuń pozycję oferty",
    titleShort: "Usuń linię",
    description: "Usuń pozycję ze szkicu oferty",
    form: {
      title: "Usuń pozycję oferty",
      description: "Usuń tę pozycję z oferty",
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
        description: "Pozycja nie znaleziona",
      },
      conflict: {
        title: "Konflikt",
        description: "Oferta musi być w statusie szkicu",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Są niezapisane zmiany",
      },
    },
    success: {
      title: "Pozycja usunięta",
      description: "Pozycja została usunięta z oferty",
    },
  },
  lineId: { label: "ID pozycji", description: "Pozycja do usunięcia" },
  widget: {
    back: "Wróć",
    submit: "Usuń pozycję",
    removed: "Pozycja usunięta z oferty.",
    confirmTitle: "Usunąć tę pozycję?",
    confirmDescription:
      "Pozycja zostanie trwale usunięta z oferty. Sumy zostaną przeliczone.",
    confirmButton: "Usuń",
    cancelButton: "Anuluj",
  },
};
