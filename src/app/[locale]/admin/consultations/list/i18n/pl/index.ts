import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  list: {
    title: "Lista konsultacji",
    description: "Wyświetl i zarządzaj wszystkimi konsultacjami",
    filters: {
      status: "Filtruj według statusu",
      dateRange: "Zakres dat",
      businessType: "Typ działalności",
      searchPlaceholder: "Szukaj konsultacji...",
      clearFilters: "Wyczyść filtry",
      applyFilters: "Zastosuj filtry",
    },
    table: {
      columns: {
        user: "Użytkownik",
        email: "E-mail",
        phone: "Telefon",
        status: "Status",
        businessType: "Typ działalności",
        preferredDate: "Preferowana data",
        scheduledDate: "Zaplanowana data",
        message: "Wiadomość",
        createdAt: "Utworzono",
        actions: "Akcje",
      },
      actions: {
        edit: "Edytuj",
        delete: "Usuń",
        schedule: "Zaplanuj",
        complete: "Oznacz jako ukończone",
        cancel: "Anuluj",
      },
      pagination: {
        showing: "Pokazuje",
        of: "z",
        results: "wyników",
        previous: "Poprzednia",
        next: "Następna",
        page: "Strona",
      },
    },
    states: {
      loading: "Ładowanie konsultacji...",
      noResults: "Nie znaleziono konsultacji",
      error: "Błąd podczas ładowania konsultacji",
    },
  },
};
