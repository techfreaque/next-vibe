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
    title: "Zatwierdź fakturę",
    titleShort: "Zatwierdź rachunek",
    description:
      "Zmień status faktury: SZKIC→OTRZYMANA→ZATWIERDZONA i utwórz zapis księgowy",
    billId: { label: "ID faktury", description: "Faktura do zatwierdzenia" },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe ID faktury",
      },
      unauthorized: {
        title: "Nie zalogowano",
        description: "Zaloguj się, aby zatwierdzać faktury",
      },
      forbidden: {
        title: "Brak dostępu",
        description: "Wymagana rola Księgowy lub Administrator",
      },
      conflict: {
        title: "Już zatwierdzona",
        description: "Faktura jest już zatwierdzona lub opłacona",
      },
      server: {
        title: "Błąd serwera",
        description: "Nie można zatwierdzić faktury",
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
      title: "Faktura zatwierdzona",
      description: "Status faktury zaktualizowany pomyślnie",
    },
    response: {
      status: "Nowy status",
      journalEntryId: "ID zapisu księgowego",
    },
    widget: {
      back: "Wróć",
      submit: "Zatwierdź rachunek",
      confirmTitle: "Zatwierdzić tę fakturę?",
      confirmDescription:
        "Status faktury zostanie zmieniony. Po zatwierdzeniu zostanie utworzony zapis księgowy.",
      confirmButton: "Tak, zatwierdź",
      cancelButton: "Anuluj",
      approved: "Faktura zatwierdzona",
    },
  },
};
