import { translations as adminTranslations } from "../../admin/i18n/de";
import { translations as availabilityTranslations } from "../../availability/i18n/de";
import { translations as createTranslations } from "../../create/i18n/de";
import { translations as listTranslations } from "../../list/i18n/de";
import { translations as scheduleTranslations } from "../../schedule/i18n/de";
import { translations as statusTranslations } from "../../status/i18n/de";
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
      pending: "Ausstehend",
      scheduled: "Geplant",
      confirmed: "Bestätigt",
      completed: "Abgeschlossen",
      cancelled: "Abgesagt",
      noShow: "Nicht erschienen",
    },
    consultationStatusFilter: {
      all: "Alle",
      pending: "Ausstehend",
      scheduled: "Geplant",
      confirmed: "Bestätigt",
      completed: "Abgeschlossen",
      cancelled: "Abgesagt",
      noShow: "Nicht erschienen",
    },
    consultationSortField: {
      createdAt: "Erstellungsdatum",
      updatedAt: "Aktualisierungsdatum",
      preferredDate: "Bevorzugtes Datum",
      scheduledDate: "Geplantes Datum",
      status: "Status",
      userEmail: "Benutzer-E-Mail",
    },
    sortOrder: {
      asc: "Aufsteigend",
      desc: "Absteigend",
    },
    consultationOutcome: {
      successful: "Erfolgreich",
      followUpNeeded: "Nachfassen erforderlich",
      notInterested: "Nicht interessiert",
      rescheduled: "Neu geplant",
      noShow: "Nicht erschienen",
      cancelled: "Abgesagt",
      technicalIssues: "Technische Probleme",
    },
    consultationType: {
      initial: "Erstberatung",
      followUp: "Nachfolgetermin",
      technical: "Technischer Support",
      sales: "Vertrieb",
      support: "Kundensupport",
      strategy: "Strategiesitzung",
    },
    timePeriod: {
      day: "Tag",
      week: "Woche",
      month: "Monat",
      quarter: "Quartal",
      year: "Jahr",
    },
    dateRangePreset: {
      today: "Heute",
      yesterday: "Gestern",
      last7Days: "Letzte 7 Tage",
      last30Days: "Letzte 30 Tage",
      last90Days: "Letzte 90 Tage",
      lastMonth: "Letzter Monat",
      lastQuarter: "Letztes Quartal",
      lastYear: "Letztes Jahr",
      thisMonth: "Dieser Monat",
      thisQuarter: "Dieses Quartal",
      thisYear: "Dieses Jahr",
    },
    chartType: {
      line: "Liniendiagramm",
      bar: "Balkendiagramm",
      pie: "Kreisdiagramm",
      area: "Flächendiagramm",
      scatter: "Streudiagramm",
    },
    jsWeekday: {
      sunday: "Sonntag",
      monday: "Montag",
      tuesday: "Dienstag",
      wednesday: "Mittwoch",
      thursday: "Donnerstag",
      friday: "Freitag",
      saturday: "Samstag",
    },
    isoWeekday: {
      monday: "Montag",
      tuesday: "Dienstag",
      wednesday: "Mittwoch",
      thursday: "Donnerstag",
      friday: "Freitag",
      saturday: "Samstag",
      sunday: "Sonntag",
    },
    weekStartDay: {
      sunday: "Sonntag",
      monday: "Montag",
    },
  },

  // Email error translations
  email: {
    errors: {
      confirmation: {
        title: "Bestätigungs-E-Mail fehlgeschlagen",
        description:
          "Bestätigungs-E-Mail für Beratung konnte nicht gesendet werden",
      },
      update: {
        title: "Update-E-Mail fehlgeschlagen",
        description: "Update-E-Mail für Beratung konnte nicht gesendet werden",
      },
      reminder: {
        title: "Erinnerungs-E-Mail fehlgeschlagen",
        description:
          "Erinnerungs-E-Mail für Beratung konnte nicht gesendet werden",
      },
      cancellation: {
        title: "Stornierung-E-Mail fehlgeschlagen",
        description:
          "Stornierung-E-Mail für Beratung konnte nicht gesendet werden",
      },
    },
  },
};
