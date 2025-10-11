import { translations as adminTranslations } from "../../admin/i18n/pl";
import { translations as availabilityTranslations } from "../../availability/i18n/pl";
import { translations as createTranslations } from "../../create/i18n/pl";
import { translations as listTranslations } from "../../list/i18n/pl";
import { translations as scheduleTranslations } from "../../schedule/i18n/pl";
import { translations as statusTranslations } from "../../status/i18n/pl";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  admin: adminTranslations,
  availability: availabilityTranslations,
  create: createTranslations,
  list: listTranslations,
  schedule: scheduleTranslations,
  status: statusTranslations,

  // Enum translations
  enums: {
    consultationStatus: {
      pending: "Oczekujące",
      scheduled: "Zaplanowane",
      confirmed: "Potwierdzone",
      completed: "Zakończone",
      cancelled: "Anulowane",
      noShow: "Nieobecność",
    },
    consultationStatusFilter: {
      all: "Wszystkie",
      pending: "Oczekujące",
      scheduled: "Zaplanowane",
      confirmed: "Potwierdzone",
      completed: "Zakończone",
      cancelled: "Anulowane",
      noShow: "Nieobecność",
    },
    consultationSortField: {
      createdAt: "Data utworzenia",
      updatedAt: "Data aktualizacji",
      preferredDate: "Preferowana data",
      scheduledDate: "Zaplanowana data",
      status: "Status",
      userEmail: "E-mail użytkownika",
    },
    sortOrder: {
      asc: "Rosnąco",
      desc: "Malejąco",
    },
    consultationOutcome: {
      successful: "Udane",
      followUpNeeded: "Wymagana kontynuacja",
      notInterested: "Niezainteresowany",
      rescheduled: "Przełożone",
      noShow: "Nieobecność",
      cancelled: "Anulowane",
      technicalIssues: "Problemy techniczne",
    },
    consultationType: {
      initial: "Pierwsza konsultacja",
      followUp: "Konsultacja kontynuacyjna",
      technical: "Wsparcie techniczne",
      sales: "Sprzedaż",
      support: "Obsługa klienta",
      strategy: "Sesja strategiczna",
    },
    timePeriod: {
      day: "Dzień",
      week: "Tydzień",
      month: "Miesiąc",
      quarter: "Kwartał",
      year: "Rok",
    },
    dateRangePreset: {
      today: "Dzisiaj",
      yesterday: "Wczoraj",
      last7Days: "Ostatnie 7 dni",
      last30Days: "Ostatnie 30 dni",
      last90Days: "Ostatnie 90 dni",
      lastMonth: "Ostatni miesiąc",
      lastQuarter: "Ostatni kwartał",
      lastYear: "Ostatni rok",
      thisMonth: "Ten miesiąc",
      thisQuarter: "Ten kwartał",
      thisYear: "Ten rok",
    },
    chartType: {
      line: "Wykres liniowy",
      bar: "Wykres słupkowy",
      pie: "Wykres kołowy",
      area: "Wykres obszarowy",
      scatter: "Wykres punktowy",
    },
    jsWeekday: {
      sunday: "Niedziela",
      monday: "Poniedziałek",
      tuesday: "Wtorek",
      wednesday: "Środa",
      thursday: "Czwartek",
      friday: "Piątek",
      saturday: "Sobota",
    },
    isoWeekday: {
      monday: "Poniedziałek",
      tuesday: "Wtorek",
      wednesday: "Środa",
      thursday: "Czwartek",
      friday: "Piątek",
      saturday: "Sobota",
      sunday: "Niedziela",
    },
    weekStartDay: {
      sunday: "Niedziela",
      monday: "Poniedziałek",
    },
  },

  // Email error translations
  email: {
    errors: {
      confirmation: {
        title: "E-mail potwierdzający nie powiódł się",
        description:
          "Nie udało się wysłać e-maila potwierdzającego konsultację",
      },
      update: {
        title: "E-mail aktualizacyjny nie powiódł się",
        description:
          "Nie udało się wysłać e-maila aktualizacyjnego konsultacji",
      },
      reminder: {
        title: "E-mail przypominający nie powiódł się",
        description:
          "Nie udało się wysłać e-maila przypominającego o konsultacji",
      },
      cancellation: {
        title: "E-mail anulujący nie powiódł się",
        description: "Nie udało się wysłać e-maila anulującego konsultację",
      },
    },
  },
};
