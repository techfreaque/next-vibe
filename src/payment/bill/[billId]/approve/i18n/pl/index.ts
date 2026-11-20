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
    title: "Sprawdź status faktury",
    titleShort: "Sprawdź status faktury",
    description:
      "Zmienia status wersji roboczej lub otrzymanej faktury od dostawcy.",
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
      submit: "Potwierdź zmianę statusu",
      confirmTitle: "Zatwierdzić tę fakturę?",
      confirmDescription:
        "Szkic otrzyma status Otrzymana. Otrzymana faktura zostanie zatwierdzona. Jeśli księgowość jest skonfigurowana, powstanie zapis księgowy.",
      confirmButton: "Tak, zatwierdź",
      cancelButton: "Anuluj",
      approved: "Status faktury zmieniony",
    },
  },
};
