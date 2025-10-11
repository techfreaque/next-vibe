import type { calendarTranslations as EnglishCalendarTranslations } from "../../../../en/sections/consultations/admin/calendar";

export const calendarTranslations: typeof EnglishCalendarTranslations = {
  title: "Kalendarz Konsultacji",
  filters: {
    status: "Filtruj według Statusu",
    businessType: "Filtruj według Typu Biznesu",
    month: "Miesiąc",
    year: "Rok",
  },
  view: {
    month: "Widok Miesiąca",
    week: "Widok Tygodnia",
    day: "Widok Dnia",
    today: "Dzisiaj",
    previous: "Poprzedni",
    next: "Następny",
  },
  event: {
    time: "Czas",
    user: "Użytkownik",
    status: "Status",
    businessType: "Typ Biznesu",
    message: "Wiadomość",
    noEvents: "Brak zaplanowanych konsultacji w tym okresie",
  },
};
