import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Rozliczenia",
  tags: {
    payment: "płatność",
    invoice: "faktura",
    ar: "należności",
  },
  post: {
    title: "Przygotuj przypomnienie o płatności",
    titleShort: "Przygotuj przypomnienie",
    description:
      "Utwórz szkic przypomnienia z aktualną zaległością i opcjonalną wiadomością.",
    form: {
      title: "Przygotuj przypomnienie",
      description: "Sprawdź kwotę do zapłaty przed wysłaniem szkicu.",
    },
    response: {
      success: "Szkic przypomnienia gotowy",
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
        description: "Faktura nie istnieje",
      },
      conflict: {
        title: "Nie przeterminowana",
        description:
          "Faktura musi być otwarta, po terminie i mieć dodatnie saldo.",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Są niezapisane zmiany",
      },
    },
    success: {
      title: "Szkic przypomnienia gotowy",
      description:
        "Przypomnienie zapisano w historii faktury. Możesz przekazać je klientowi.",
    },
  },
  invoiceId: {
    label: "ID faktury",
    description: "ID przeterminowanej faktury",
    placeholder: "Wprowadź ID faktury",
  },
  message: {
    label: "Własna wiadomość",
    description: "Opcjonalna wiadomość do przypomnienia",
    placeholder: "Dodaj osobistą notatkę do przypomnienia...",
  },
  widget: {
    copy: "Kopiuj przypomnienie",
    copied: "Skopiowano przypomnienie",
    copyFailed: "Nie udało się skopiować. Spróbuj ponownie",
    download: "Pobierz przypomnienie",
    subject: "Przypomnienie o płatności za fakturę {{number}}",
    body: "Do zapłaty pozostało {{amount}}. Termin płatności: {{date}}.",
    back: "Wróć",
    submit: "Przygotuj przypomnienie",
    reminderSent:
      "Przypomnienie zapisano w historii faktury. Możesz przekazać je klientowi.",
    viewInvoice: "Zobacz fakturę",
  },
};
