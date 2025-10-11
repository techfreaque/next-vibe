import type { chartsTranslations as EnglishChartsTranslations } from "../../en/sections/charts";

export const translations: typeof EnglishChartsTranslations = {
  titles: {
    consultation_statistics: "Beratungsstatistiken über die Zeit",
    campaign_statistics: "Kampagnenstatistiken über die Zeit",
    user_statistics: "Benutzerstatistiken über die Zeit",
  },
  subtitles: {
    consultation_metrics: "Beratungsmetriken von {{from}} bis {{to}}",
    user_metrics: "Benutzermetriken von {{from}} bis {{to}}",
  },
  axis: {
    date: "Datum",
    count: "Anzahl",
    number_of_consultations: "Anzahl der Beratungen",
    number_of_users: "Anzahl der Benutzer",
  },
  series: {
    new_consultations: "Neue Beratungen",
    scheduled_consultations: "Geplante Beratungen",
    completed_consultations: "Abgeschlossene Beratungen",
    cancelled_consultations: "Abgebrochene Beratungen",
    new_leads: "Neue Leads",
    signed_up_leads: "Angemeldete Leads",
    consultation_booked: "Beratung gebucht",
    converted_leads: "Konvertierte Leads",
    emails_sent: "E-Mails gesendet",
    emails_opened: "E-Mails geöffnet",
    emails_clicked: "E-Mails angeklickt",
    new_users: "Neue Benutzer",
    active_users: "Aktive Benutzer",
    email_verified_users: "E-Mail-verifizierte Benutzer",
    emails_unsubscribed: "E-Mails abgemeldet",
  },
  errors: {
    unknown_error: "Unbekannter Fehler",
  },
  api: {
    messages: {
      message_prefix: "Nachricht",
    },
    streaming: {
      content_type: "text/plain; charset=utf-8",
      data_prefix: "data: ",
      data_suffix: "\n\n",
    },
  },
  status: {
    not_started: "not_started",
    followup_1: "followup_1",
    followup_2: "followup_2",
    followup_3: "followup_3",
    social_media: "social_media",
    email_campaign: "email_campaign",
    csv_import: "csv_import",
  },
};
