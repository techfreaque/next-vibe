import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    payment: "płatność",
    bill: "faktura",
    ap: "zobowiązania",
  },
  get: {
    title: "Faktury zakupowe",
    titleShort: "Rachunki AP",
    description: "Lista faktur dostawców dla firmy",
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Sprawdź parametry filtrów",
      },
      unauthorized: {
        title: "Nie zalogowano",
        description: "Zaloguj się, aby przeglądać faktury",
      },
      forbidden: {
        title: "Brak dostępu",
        description: "Nie jesteś członkiem tej firmy",
      },
      conflict: { title: "Konflikt", description: "Konflikt danych" },
      server: {
        title: "Błąd serwera",
        description: "Nie można załadować faktur",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieoczekiwany błąd",
      },
      network: { title: "Błąd sieci", description: "Sprawdź połączenie" },
      notFound: { title: "Nie znaleziono", description: "Firma nie istnieje" },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany",
      },
    },
    success: {
      title: "Faktury załadowane",
      description: "Faktury dostawców pobrane",
    },
    response: {
      totalCount: "Łącznie",
      id: "ID",
      supplierName: "Dostawca",
      billNumber: "Nr faktury",
      billDate: "Data faktury",
      dueDate: "Termin płatności",
      currency: "Waluta",
      billTotal: "Kwota",
      status: "Status",
      createdAt: "Utworzono",
    },
  },
  companyId: {
    label: "Firma",
    description: "Filtruj wg firmy",
    placeholder: "UUID firmy",
  },
  status: {
    label: "Status",
    description: "Filtruj wg statusu faktury",
    placeholder: "Dowolny status",
  },
  page: { label: "Strona", description: "Numer strony" },
  pageSize: { label: "Na stronie", description: "Wyniki na stronę" },
  enums: {
    billStatus: {
      DRAFT: "Szkic",
      RECEIVED: "Otrzymana",
      APPROVED: "Zatwierdzona",
      PAID: "Opłacona",
      DISPUTED: "Sporna",
    },
  },
  widget: {
    back: "Wróć",
    title: "Faktury zakupowe",
    newBill: "Zarejestruj fakturę",
    loading: "Ładowanie faktur...",
    empty: {
      title: "Brak faktur zakupowych",
      hint: "Zarejestruj fakturę, gdy otrzymasz ją od dostawcy.",
      cta: "Zarejestruj fakturę",
    },
    company: {
      select: "Wybierz firmę",
      selected: "Firma wybrana",
    },
    due: "Termin",
    overdue: "Przeterminowana",
    view: "Podgląd",
  },
};
