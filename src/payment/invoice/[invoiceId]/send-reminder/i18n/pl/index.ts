import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Rozliczenia",
  tags: {
    payment: "płatność",
    invoice: "faktura",
    ar: "należności",
  },
  post: {
    title: "Wyślij przypomnienie o płatności",
    titleShort: "Wyślij przypomnienie",
    description:
      "Wyślij przypomnienie o płatności dla przeterminowanej faktury. Faktura musi być otwarta i po terminie płatności. Przypomnienie jest zapisywane jako notatka klienta.",
    form: {
      title: "Wyślij przypomnienie",
      description: "Powiadom klienta o przeterminowanej płatności",
    },
    response: {
      success: "Przypomnienie wysłane",
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
          "Przypomnienia można wysyłać tylko dla otwartych faktur po terminie płatności",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Są niezapisane zmiany",
      },
    },
    success: {
      title: "Sukces",
      description: "Przypomnienie o płatności wysłane i zarejestrowane",
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
    back: "Wróć",
    submit: "Wyślij przypomnienie",
    reminderSent: "Przypomnienie wysłane. Klient został powiadomiony.",
    viewInvoice: "Zobacz fakturę",
  },
};
