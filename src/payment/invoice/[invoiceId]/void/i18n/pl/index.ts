import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Rozliczenia",
  tags: {
    payment: "płatność",
    invoice: "faktura",
    ar: "należności",
  },
  post: {
    title: "Anuluj fakturę",
    titleShort: "Anuluj fakturę",
    description:
      "Anuluj fakturę w trybie szkicu lub otwartą. Opłaconych faktur nie można anulować. Jeśli istnieje zapis księgowy, zostanie cofnięty.",
    form: {
      title: "Anuluj fakturę",
      description: "Tej operacji nie można cofnąć.",
    },
    response: {
      success: "Faktura anulowana",
      message: "Komunikat statusu",
    },
    errors: {
      appliedPayments:
        "Nie można anulować faktury z przypisanymi płatnościami lub korektami.",
      reversalPosting:
        "Przed anulowaniem sprawdź pierwotny zapis i otwarty okres księgowy.",
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
        title: "Anulowanie niemożliwe",
        description: "Opłaconych faktur nie można anulować",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Są niezapisane zmiany",
      },
    },
    success: {
      title: "Sukces",
      description: "Faktura została pomyślnie anulowana",
    },
  },
  invoiceId: {
    label: "ID faktury",
    description: "ID faktury do anulowania",
    placeholder: "Wprowadź ID faktury",
  },
  widget: {
    invoice: "Faktura",
    total: "Kwota faktury",
    customer: "Klient",
    openInvoice: "Otwórz fakturę",
    retry: "Spróbuj ponownie",
    loading: "Wczytywanie faktury…",
    unavailable: "Faktura niedostępna",
    reversal: "Storno z dzisiejszą datą rozliczy otwartą należność.",
    cancelOnly: "Faktura zostanie anulowana.",
    ineligible:
      "Możesz anulować szkic lub nieopłaconą fakturę bez przypisanych wpłat i korekt.",
    back: "Wróć",
    submit: "Anuluj fakturę",
    warning:
      "Tej operacji nie można cofnąć. Faktura zostanie trwale anulowana.",
    confirm: "Anuluj fakturę",
    voided: "Faktura anulowana",
    backToList: "Powrót do listy",
  },
};
