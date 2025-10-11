import type { calendarTranslations as EnglishCalendarTranslations } from "../../../../en/sections/consultations/admin/calendar";

export const calendarTranslations: typeof EnglishCalendarTranslations = {
  title: "Beratungskalender",
  filters: {
    status: "Nach Status filtern",
    businessType: "Nach Geschäftstyp filtern",
    month: "Monat",
    year: "Jahr",
  },
  view: {
    month: "Monatsansicht",
    week: "Wochenansicht",
    day: "Tagesansicht",
    today: "Heute",
    previous: "Vorherige",
    next: "Nächste",
  },
  event: {
    time: "Zeit",
    user: "Benutzer",
    status: "Status",
    businessType: "Geschäftstyp",
    message: "Nachricht",
    noEvents: "Keine Beratungen für diesen Zeitraum geplant",
  },
};
