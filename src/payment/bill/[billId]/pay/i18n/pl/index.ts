import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { payment: "płatność", bill: "faktura", ap: "zobowiązania" },
  enums: {
    billStatus: {
      DRAFT: "Szkic",
      RECEIVED: "Otrzymana",
      APPROVED: "Zatwierdzona",
      PAID: "Opłacona",
      DISPUTED: "Sporna",
    },
  },
  post: {
    title: "Opłać fakturę",
    titleShort: "Opłać rachunek",
    description:
      "Oznacz zatwierdzoną fakturę jako opłaconą i utwórz zapis płatności",
    billId: { label: "ID faktury", description: "Faktura do opłacenia" },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe dane",
      },
      unauthorized: {
        title: "Nie zalogowano",
        description: "Zaloguj się, aby opłacać faktury",
      },
      forbidden: {
        title: "Brak dostępu",
        description: "Wymagana rola Księgowy lub Administrator",
      },
      conflict: {
        title: "Nieprawidłowy status",
        description: "Faktura musi być zatwierdzona przed opłaceniem",
      },
      server: {
        title: "Błąd serwera",
        description: "Nie można zarejestrować płatności",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieoczekiwany błąd",
      },
      network: { title: "Błąd sieci", description: "Sprawdź połączenie" },
      notFound: {
        title: "Faktura nie znaleziona",
        description: "Ta faktura nie istnieje",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany",
      },
    },
    success: {
      title: "Faktura opłacona",
      description: "Faktura oznaczona jako opłacona",
    },
    response: {
      status: "Status",
      paidAt: "Opłacono",
    },
    widget: {
      back: "Wróć",
      submit: "Oznacz jako opłacone",
      paymentRecorded: "Płatność zarejestrowana",
    },
  },
  accountNodeId: {
    label: "Konto bankowe / kasowe",
    description: "Konto użyte do zapłaty (bank lub kasa)",
    placeholder: "UUID konta",
  },
  paidAt: {
    label: "Data płatności",
    description: "Data dokonania płatności",
    placeholder: "2024-01-31",
  },
};
