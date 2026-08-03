import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  sms: {
    error: {
      invalid_phone_format:
        "Ungültiges Telefonnummernformat. Bitte geben Sie eine gültige Telefonnummer an.",
      invalid_phone_format_reason:
        "Ungültiges Telefonnummernformat: {{reason}}",
      delivery_failed:
        "SMS konnte nicht an {{phoneNumber}} gesendet werden: {{error}}",
      delivery_failed_http:
        "SMS konnte nicht an {{phoneNumber}} gesendet werden: {{error}} (HTTP {{status}})",
      delivery_failed_code:
        "SMS konnte nicht an {{phoneNumber}} gesendet werden: {{error}} (Code {{code}})",
      delivery_failed_status:
        "SMS konnte nicht an {{phoneNumber}} gesendet werden (HTTP {{status}})",
      unexpected_error: "Unerwarteter Fehler beim SMS-Versand: {{error}}",
      all_failed:
        "Alle {{totalResults}} SMS-Nachrichten konnten nicht gesendet werden",
      batch_delivery_failed:
        "{{errorCount}} SMS-Nachrichten konnten nicht zugestellt werden",
      partial_failure:
        "Einige SMS-Nachrichten konnten nicht gesendet werden. Erfolgreich: {{successCount}}, Fehlgeschlagen: {{failureCount}}",
      rendering_failed: "SMS-Vorlage konnte nicht gerendert werden: {{error}}",
      send_failed: "SMS konnte nicht gesendet werden: {{error}}",
      batch_send_failed: "Batch-SMS-Versand fehlgeschlagen: {{error}}",
      missing_aws_access_key: "AWS-Zugriffsschlüssel fehlt",
      missing_aws_secret_key: "AWS-Geheimschlüssel fehlt",
      missing_aws_region: "AWS-Region fehlt",
      missing_recipient: "Empfänger-Telefonnummer fehlt",
      empty_message: "SMS-Nachricht darf nicht leer sein",
      aws_sns_api_error: "AWS SNS API-Fehler: {{error}}",
      aws_sns_api_error_http: "AWS SNS API-Fehler: {{error}} (HTTP {{status}})",
      aws_sns_error: "AWS SNS-Fehler aufgetreten",
      unknown_error: "Unbekannter Fehler",
      unknown_provider_error: "Unbekannter {{provider}}-Fehler",
      error_code: "Fehler {{code}}",
      unknown_code: "unbekannt",
    },
  },
};
