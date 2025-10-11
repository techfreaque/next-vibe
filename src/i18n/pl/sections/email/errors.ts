import type { errorsTranslations as EnglishErrorsTranslations } from "../../../en/sections/email/errors";

export const errorsTranslations: typeof EnglishErrorsTranslations = {
  batch_send_failed: "Nie udało się wysłać wielu e-maili: {{errors}}",
  sending_failed: "Wysyłanie e-maila nie powiodło się: {{error}}",
  rejected_recipient: "Odrzucony odbiorca: {{email}}",
  no_recipients_accepted:
    "Żaden odbiorca nie został zaakceptowany przez serwer SMTP",
  recipient_not_accepted:
    "Odbiorca {{email}} nie został zaakceptowany przez serwer SMTP",
  email_sending_failed: "Wysyłanie e-maila nie powiodło się",
  email_failed_subject: "E-mail nie powiódł się",
  system_sender: "System",
  email_render_exception: "Błąd renderowania szablonu e-mail",
  unknown_recipient: "Nieznany odbiorca",
  smtp_connection_failed: "Połączenie SMTP nie powiodło się",
  template_rendering_failed: "Nie można było wyrenderować szablonu e-mail",
  rendering_failed: "Nie udało się wyrenderować szablonu e-mail",
  send_failed: "Nie udało się wysłać e-mail",
  authentication_failed: "Uwierzytelnienie e-mail nie powiodło się",
  quota_exceeded: "Przekroczono limit wysyłania e-maili",
};
