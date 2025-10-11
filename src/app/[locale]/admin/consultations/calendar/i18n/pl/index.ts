import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  calendar: {
    title: "Widok kalendarza",
    navigation: {
      today: "Dzisiaj",
      previousMonth: "Poprzedni miesiąc",
      nextMonth: "Następny miesiąc",
    },
    filters: {
      showFilters: "Pokaż filtry",
      hideFilters: "Ukryj filtry",
      status: "Filtr statusu",
      dateRange: "Zakres dat",
    },
    view: {
      loading: "Ładowanie kalendarza...",
      noConsultations: "Brak zaplanowanych konsultacji w tym okresie",
      dayView: "Widok dnia",
      monthView: "Widok miesiąca",
      consultationDetails: "Szczegóły konsultacji",
    },
    consultation: {
      scheduled: "Zaplanowane",
      pending: "Oczekujące",
      completed: "Ukończone",
      cancelled: "Anulowane",
      noShow: "Niestawienie się",
      editConsultation: "Edytuj konsultację",
      viewDetails: "Zobacz szczegóły",
    },
  },
};
