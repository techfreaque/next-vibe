import type { chartsTranslations as EnglishChartsTranslations } from "../../en/sections/charts";

export const chartsTranslations: typeof EnglishChartsTranslations = {
  titles: {
    consultation_statistics: "Statystyki konsultacji w czasie",
    campaign_statistics: "Statystyki kampanii w czasie",
    user_statistics: "Statystyki użytkowników w czasie",
  },
  subtitles: {
    consultation_metrics: "Metryki konsultacji od {{from}} do {{to}}",
    user_metrics: "Metryki użytkowników od {{from}} do {{to}}",
  },
  axis: {
    date: "Data",
    count: "Liczba",
    number_of_consultations: "Liczba konsultacji",
    number_of_users: "Liczba użytkowników",
  },
  series: {
    new_consultations: "Nowe konsultacje",
    scheduled_consultations: "Zaplanowane konsultacje",
    completed_consultations: "Zakończone konsultacje",
    cancelled_consultations: "Anulowane konsultacje",
    new_leads: "Nowi potencjalni klienci",
    signed_up_leads: "Zarejestrowani potencjalni klienci",
    consultation_booked: "Konsultacja zarezerwowana",
    converted_leads: "Przekonwertowani potencjalni klienci",
    emails_sent: "Wysłane e-maile",
    emails_opened: "Otwarte e-maile",
    emails_clicked: "Kliknięte e-maile",
    new_users: "Nowi użytkownicy",
    active_users: "Aktywni użytkownicy",
    email_verified_users: "Użytkownicy z potwierdzonym e-mailem",
    emails_unsubscribed: "Wypisani z e-maili",
  },
  errors: {
    unknown_error: "Nieznany błąd",
  },
  api: {
    messages: {
      message_prefix: "Wiadomość",
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
