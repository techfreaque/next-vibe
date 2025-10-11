import type { consultationTranslations as EnglishConsultationTranslations } from "../../../en/sections/consultation";
import { actionsTranslations } from "./actions";
import { bookingTranslations } from "./booking";
import { businessDataTranslations } from "./businessData";
import { emailTranslations } from "./email";
import { errorTranslations } from "./error";
import { errorsTranslations } from "./errors";
import { formTranslations } from "./form";
import { historyTranslations } from "./history";
import { scheduleTranslations } from "./schedule";
import { schedulerTranslations } from "./scheduler";
import { sortTranslations } from "./sort";
import { statusTranslations } from "./status";
import { successTranslations } from "./success";
import { timeSlotsTranslations } from "./timeSlots";
import { upcomingTranslations } from "./upcoming";
import { validationTranslations } from "./validation";

export const consultationTranslations: typeof EnglishConsultationTranslations =
  {
    actions: actionsTranslations,
    booking: bookingTranslations,
    businessData: businessDataTranslations,
    email: emailTranslations,
    error: errorTranslations,
    errors: errorsTranslations,
    form: formTranslations,
    history: historyTranslations,
    schedule: scheduleTranslations,
    scheduler: schedulerTranslations,
    sort: sortTranslations,
    status: statusTranslations,
    success: successTranslations,
    timeSlots: timeSlotsTranslations,
    upcoming: upcomingTranslations,
    validation: validationTranslations,
    title: "Konsultacje",
    description: "Zarządzaj swoimi wizytami konsultacyjnymi i planuj nowe",
    bookNew: "Zarezerwuj Nową Konsultację",
    bookFirst: "Zarezerwuj swoją pierwszą konsultację z naszymi ekspertami",

    // List and filtering
    list: {
      title: "Lista Konsultacji",
      description: "Wyświetl i zarządzaj wszystkimi konsultacjami",
      noResults: "Nie znaleziono konsultacji",
      loading: "Ładowanie konsultacji...",
      container: {
        title: "Zarządzanie Konsultacjami",
        description:
          "Kompleksowe zarządzanie konsultacjami z zaawansowanymi funkcjami filtrowania i sortowania",
      },
    },

    // Field labels
    fields: {
      id: "ID Konsultacji",
      userId: "ID Użytkownika",
      preferredDate: "Preferowana Data",
      preferredTime: "Preferowany Czas",
      status: "Status",
      createdAt: "Utworzono",
      updatedAt: "Zaktualizowano",
      total: "Łączna liczba konsultacji",
    },

    // Filter labels
    filter: {
      search: {
        label: "Szukaj Konsultacji",
        placeholder: "Szukaj według ID, użytkownika lub notatek...",
        helpText: "Przeszukuj szczegóły konsultacji",
      },
      userId: {
        label: "Filtruj według Użytkownika",
        placeholder: "Wybierz użytkownika...",
        helpText: "Filtruj konsultacje według konkretnego użytkownika",
      },
      status: {
        label: "Filtruj według Statusu",
        placeholder: "Wybierz status...",
        helpText: "Filtruj według statusu konsultacji",
        all: "Wszystkie Statusy",
      },
      dateFrom: {
        label: "Od Daty",
        placeholder: "Wybierz datę początkową...",
        helpText: "Filtruj konsultacje od tej daty",
      },
      dateTo: {
        label: "Do Daty",
        placeholder: "Wybierz datę końcową...",
        helpText: "Filtruj konsultacje do tej daty",
      },
      limit: {
        label: "Wyników na Stronę",
        placeholder: "Wybierz rozmiar strony...",
        helpText: "Liczba konsultacji do wyświetlenia na stronie",
      },
      offset: {
        label: "Przesunięcie Strony",
        placeholder: "Numer strony...",
        helpText: "Aktualne przesunięcie strony dla paginacji",
      },
    },

    // Sort labels - moved inside object to avoid duplicate key
    sortLabels: {
      sortBy: {
        label: "Sortuj według",
        placeholder: "Wybierz pole sortowania...",
        helpText: "Wybierz pole do sortowania konsultacji",
      },
      sortOrder: {
        label: "Kolejność sortowania",
        placeholder: "Wybierz kierunek sortowania...",
        helpText: "Wybierz kolejność rosnącą lub malejącą",
      },
      createdAt: "Data utworzenia",
      updatedAt: "Ostatnia aktualizacja",
      preferredDate: "Preferowana data",
      scheduledDate: "Zaplanowana data",
      status: "Status",
      userEmail: "Email użytkownika",
    },
  };
