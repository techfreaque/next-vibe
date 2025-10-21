import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  sms: {
    error: {
      invalid_phone_format:
        "Ungültiges Telefonnummernformat. Bitte geben Sie eine gültige Telefonnummer an.",
      delivery_failed:
        "SMS konnte nicht an {{phoneNumber}} gesendet werden: {{error}}",
      unexpected_error:
        "Unerwarteter Fehler beim Senden der SMS aufgetreten",
      all_failed: "Alle SMS-Nachrichten konnten nicht gesendet werden",
      partial_failure:
        "Einige SMS-Nachrichten konnten nicht gesendet werden. Erfolgreich: {{successCount}}, Fehlgeschlagen: {{failureCount}}",
      rendering_failed: "SMS-Vorlage konnte nicht gerendert werden",
      send_failed: "SMS konnte nicht gesendet werden",
      batch_send_failed: "Batch-SMS-Versand fehlgeschlagen",
      missing_aws_access_key: "AWS-Zugriffsschlüssel fehlt",
      missing_aws_secret_key: "AWS-Geheimschlüssel fehlt",
      missing_aws_region: "AWS-Region fehlt",
      missing_recipient: "Empfänger-Telefonnummer fehlt",
      empty_message: "SMS-Nachricht darf nicht leer sein",
      aws_sns_api_error: "AWS SNS API-Fehler: {{error}}",
      aws_sns_error: "AWS SNS-Fehler aufgetreten",
    },
  },
};
