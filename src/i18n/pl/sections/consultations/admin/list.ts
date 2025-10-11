import type { listTranslations as EnglishListTranslations } from "../../../../en/sections/consultations/admin/list";

export const listTranslations: typeof EnglishListTranslations = {
  title: "Lista Konsultacji",
  search: "Szukaj konsultacji...",
  filters: {
    status: "Status",
    all: "Wszystkie Statusy",
    dateFrom: "Od Daty",
    dateTo: "Do Daty",
    userEmail: "E-mail Użytkownika",
    sortBy: "Sortuj Według",
    sortOrder: "Kolejność Sortowania",
    ascending: "Rosnąco",
    descending: "Malejąco",
  },
  table: {
    user: "Użytkownik",
    status: "Status",
    preferredDate: "Preferowana Data",
    scheduledDate: "Zaplanowana Data",
    message: "Wiadomość",
    businessType: "Typ Biznesu",
    createdAt: "Utworzono",
    actions: "Akcje",
    view: "Zobacz",
    edit: "Edytuj",
    noResults: "Nie znaleziono konsultacji",
    loading: "Ładowanie konsultacji...",
  },
  pagination: {
    showing: "Pokazuje {{start}} do {{end}} z {{total}} konsultacji",
    previous: "Poprzednia",
    next: "Następna",
    page: "Strona {{page}} z {{totalPages}}",
  },
};
