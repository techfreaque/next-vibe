import type { errorsTranslations as EnglishErrorsTranslations } from "../../../en/sections/email/errors";

export const errorsTranslations: typeof EnglishErrorsTranslations = {
  batch_send_failed: "Fehler beim Senden mehrerer E-Mails: {{errors}}",
  sending_failed: "E-Mail-Versand fehlgeschlagen: {{error}}",
  rejected_recipient: "Abgelehnter Empfänger: {{email}}",
  no_recipients_accepted: "Keine Empfänger vom SMTP-Server akzeptiert",
  recipient_not_accepted:
    "Empfänger {{email}} wurde nicht vom SMTP-Server akzeptiert",
  email_sending_failed: "E-Mail-Versand fehlgeschlagen",
  email_failed_subject: "E-Mail fehlgeschlagen",
  system_sender: "System",
  email_render_exception: "Fehler beim Rendern der E-Mail-Vorlage",
  unknown_recipient: "Unbekannter Empfänger",
  smtp_connection_failed: "SMTP-Verbindung fehlgeschlagen",
  rendering_failed: "E-Mail-Vorlage konnte nicht gerendert werden",
  send_failed: "E-Mail-Versand fehlgeschlagen",
  template_rendering_failed: "E-Mail-Vorlage konnte nicht gerendert werden",
  authentication_failed: "E-Mail-Authentifizierung fehlgeschlagen",
  quota_exceeded: "E-Mail-Versandlimit erreicht",
};
