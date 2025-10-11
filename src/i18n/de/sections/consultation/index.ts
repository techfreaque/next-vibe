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

export const translations: typeof EnglishConsultationTranslations = {
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
  title: "Beratungen",
  description: "Verwalten Sie Ihre Beratungstermine und planen Sie neue",
  bookNew: "Neue Beratung buchen",
  bookFirst: "Buchen Sie Ihre erste Beratung mit unseren Experten",

  // List and filtering
  list: {
    title: "Beratungsliste",
    description: "Alle Beratungen anzeigen und verwalten",
    noResults: "Keine Beratungen gefunden",
    loading: "Beratungen werden geladen...",
    container: {
      title: "Beratungsverwaltung",
      description:
        "Umfassende Beratungsverwaltung mit erweiterten Filter- und Sortierfunktionen",
    },
  },

  // Field labels
  fields: {
    id: "Beratungs-ID",
    userId: "Benutzer-ID",
    preferredDate: "Bevorzugtes Datum",
    preferredTime: "Bevorzugte Uhrzeit",
    status: "Status",
    createdAt: "Erstellt am",
    updatedAt: "Aktualisiert am",
    total: "Beratungen insgesamt",
  },

  // Filter labels
  filter: {
    search: {
      label: "Beratungen suchen",
      placeholder: "Nach ID, Benutzer oder Notizen suchen...",
      helpText: "Durchsuchen Sie Beratungsdetails",
    },
    userId: {
      label: "Nach Benutzer filtern",
      placeholder: "Benutzer auswählen...",
      helpText: "Beratungen nach bestimmtem Benutzer filtern",
    },
    status: {
      label: "Nach Status filtern",
      placeholder: "Status auswählen...",
      helpText: "Nach Beratungsstatus filtern",
      all: "Alle Status",
    },
    dateFrom: {
      label: "Von Datum",
      placeholder: "Startdatum auswählen...",
      helpText: "Beratungen ab diesem Datum filtern",
    },
    dateTo: {
      label: "Bis Datum",
      placeholder: "Enddatum auswählen...",
      helpText: "Beratungen bis zu diesem Datum filtern",
    },
    limit: {
      label: "Ergebnisse pro Seite",
      placeholder: "Seitengröße auswählen...",
      helpText: "Anzahl der Beratungen pro Seite",
    },
    offset: {
      label: "Seiten-Offset",
      placeholder: "Seitennummer...",
      helpText: "Aktueller Seiten-Offset für Paginierung",
    },
  },

  // Sort labels
  sortLabels: {
    sortBy: {
      label: "Sortieren nach",
      placeholder: "Sortierfeld auswählen...",
      helpText: "Wählen Sie das Feld zum Sortieren der Beratungen",
    },
    sortOrder: {
      label: "Sortierreihenfolge",
      placeholder: "Sortierrichtung auswählen...",
      helpText: "Aufsteigende oder absteigende Reihenfolge wählen",
    },
    createdAt: "Erstellungsdatum",
    updatedAt: "Zuletzt aktualisiert",
    preferredDate: "Bevorzugtes Datum",
    scheduledDate: "Geplantes Datum",
    status: "Status",
    userEmail: "Benutzer-E-Mail",
  },
};
