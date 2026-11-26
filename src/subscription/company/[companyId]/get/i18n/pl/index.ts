import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    subscription: "Subskrypcja",
    company: "Firma",
    get: "Pobierz",
  },
  view: {
    empty: "Brak subskrypcji",
    emptyHelp: "Na Twoim koncie nie ma subskrypcji.",
    status: "Status",
    interval: "Okres rozliczeniowy",
    periodStart: "Początek bieżącego okresu",
    periodEnd: "Koniec bieżącego okresu",
    unavailable: "Brak danych",
    provider: "Operator płatności",
    cancellation: "Anulowanie",
    endOfPeriod: "Na koniec okresu",
    scheduled: "Planowane anulowanie",
    canceled: "Anulowano",
    ended: "Zakończono",
    open: "Otwórz szczegóły subskrypcji",
    list: "Wróć do subskrypcji",
  },
  get: {
    title: "Subskrypcja właściciela",
    titleShort: "Subskrypcja właściciela",
    description: "Wyświetl osobistą subskrypcję właściciela firmy.",
    companyId: {
      label: "ID firmy",
      description: "Firma, której subskrypcję należy pobrać",
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe ID firmy",
      },
      unauthorized: {
        title: "Nie zalogowano",
        description: "Zaloguj się, aby wyświetlić subskrypcje firmy",
      },
      forbidden: {
        title: "Brak dostępu",
        description: "Nie masz dostępu do subskrypcji tej firmy",
      },
      conflict: {
        title: "Konflikt",
        description: "Konflikt danych",
      },
      server: {
        title: "Błąd serwera",
        description: "Coś poszło nie tak. spróbuj ponownie",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieoczekiwany błąd",
      },
      network: {
        title: "Błąd sieci",
        description: "Sprawdź połączenie i spróbuj ponownie",
      },
      notFound: {
        title: "Brak subskrypcji",
        description: "Ta firma nie ma żadnej subskrypcji",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany",
      },
    },
    success: {
      title: "Subskrypcja załadowana",
      description: "Subskrypcja firmy pobrana",
    },
  },
};
