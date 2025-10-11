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

export const consultationTranslations = {
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
  title: "Consultations",
  description: "Manage your consultation appointments and schedule new ones",
  bookNew: "Book New Consultation",
  bookFirst: "Book your first consultation with our experts",

  // List and filtering
  list: {
    title: "Consultation List",
    description: "View and manage all consultations",
    noResults: "No consultations found",
    loading: "Loading consultations...",
    container: {
      title: "Consultations Management",
      description:
        "Comprehensive consultation management with advanced filtering and sorting",
    },
  },

  // Field labels
  fields: {
    id: "Consultation ID",
    userId: "User ID",
    preferredDate: "Preferred Date",
    preferredTime: "Preferred Time",
    status: "Status",
    createdAt: "Created At",
    updatedAt: "Updated At",
    total: "Total Consultations",
  },

  // Filter labels
  filter: {
    search: {
      label: "Search Consultations",
      placeholder: "Search by ID, user, or notes...",
      helpText: "Search across consultation details",
    },
    userId: {
      label: "Filter by User",
      placeholder: "Select user...",
      helpText: "Filter consultations by specific user",
    },
    status: {
      label: "Filter by Status",
      placeholder: "Select status...",
      helpText: "Filter by consultation status",
      all: "All Statuses",
    },
    dateFrom: {
      label: "From Date",
      placeholder: "Select start date...",
      helpText: "Filter consultations from this date",
    },
    dateTo: {
      label: "To Date",
      placeholder: "Select end date...",
      helpText: "Filter consultations until this date",
    },
    limit: {
      label: "Results per Page",
      placeholder: "Select page size...",
      helpText: "Number of consultations to show per page",
    },
    offset: {
      label: "Page Offset",
      placeholder: "Page number...",
      helpText: "Current page offset for pagination",
    },
  },

  // Sort labels - moved inside object to avoid duplicate key
  sortLabels: {
    sortBy: {
      label: "Sort By",
      placeholder: "Select sort field...",
      helpText: "Choose field to sort consultations by",
    },
    sortOrder: {
      label: "Sort Order",
      placeholder: "Select sort direction...",
      helpText: "Choose ascending or descending order",
    },
    createdAt: "Created Date",
    updatedAt: "Last Updated",
    preferredDate: "Preferred Date",
    scheduledDate: "Scheduled Date",
    status: "Status",
    userEmail: "User Email",
  },
};
