import { translations as adminTranslations } from "../../admin/i18n/en";
import { translations as availabilityTranslations } from "../../availability/i18n/en";
import { translations as createTranslations } from "../../create/i18n/en";
import { translations as listTranslations } from "../../list/i18n/en";
import { translations as scheduleTranslations } from "../../schedule/i18n/en";
import { translations as statusTranslations } from "../../status/i18n/en";

export const translations = {
  admin: adminTranslations,
  availability: availabilityTranslations,
  create: createTranslations,
  list: listTranslations,
  schedule: scheduleTranslations,
  status: statusTranslations,

  // Enum translations
  enums: {
    consultationStatus: {
      pending: "Pending",
      scheduled: "Scheduled",
      confirmed: "Confirmed",
      completed: "Completed",
      cancelled: "Cancelled",
      noShow: "No Show",
    },
    consultationStatusFilter: {
      all: "All",
      pending: "Pending",
      scheduled: "Scheduled",
      confirmed: "Confirmed",
      completed: "Completed",
      cancelled: "Cancelled",
      noShow: "No Show",
    },
    consultationSortField: {
      createdAt: "Created Date",
      updatedAt: "Updated Date",
      preferredDate: "Preferred Date",
      scheduledDate: "Scheduled Date",
      status: "Status",
      userEmail: "User Email",
    },
    sortOrder: {
      asc: "Ascending",
      desc: "Descending",
    },
    consultationOutcome: {
      successful: "Successful",
      followUpNeeded: "Follow-up Needed",
      notInterested: "Not Interested",
      rescheduled: "Rescheduled",
      noShow: "No Show",
      cancelled: "Cancelled",
      technicalIssues: "Technical Issues",
    },
    consultationType: {
      initial: "Initial Consultation",
      followUp: "Follow-up",
      technical: "Technical Support",
      sales: "Sales",
      support: "Customer Support",
      strategy: "Strategy Session",
    },
    timePeriod: {
      day: "Day",
      week: "Week",
      month: "Month",
      quarter: "Quarter",
      year: "Year",
    },
    dateRangePreset: {
      today: "Today",
      yesterday: "Yesterday",
      last7Days: "Last 7 Days",
      last30Days: "Last 30 Days",
      last90Days: "Last 90 Days",
      lastMonth: "Last Month",
      lastQuarter: "Last Quarter",
      lastYear: "Last Year",
      thisMonth: "This Month",
      thisQuarter: "This Quarter",
      thisYear: "This Year",
    },
    chartType: {
      line: "Line Chart",
      bar: "Bar Chart",
      pie: "Pie Chart",
      area: "Area Chart",
      scatter: "Scatter Chart",
    },
    jsWeekday: {
      sunday: "Sunday",
      monday: "Monday",
      tuesday: "Tuesday",
      wednesday: "Wednesday",
      thursday: "Thursday",
      friday: "Friday",
      saturday: "Saturday",
    },
    isoWeekday: {
      monday: "Monday",
      tuesday: "Tuesday",
      wednesday: "Wednesday",
      thursday: "Thursday",
      friday: "Friday",
      saturday: "Saturday",
      sunday: "Sunday",
    },
    weekStartDay: {
      sunday: "Sunday",
      monday: "Monday",
    },
  },

  // Email error translations
  email: {
    errors: {
      confirmation: {
        title: "Confirmation Email Failed",
        description: "Failed to send consultation confirmation email",
      },
      update: {
        title: "Update Email Failed",
        description: "Failed to send consultation update email",
      },
      reminder: {
        title: "Reminder Email Failed",
        description: "Failed to send consultation reminder email",
      },
      cancellation: {
        title: "Cancellation Email Failed",
        description: "Failed to send consultation cancellation email",
      },
    },
  },
};
