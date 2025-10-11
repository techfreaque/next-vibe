import type { smsTranslations as EnglishSmsTranslations } from "../../en/sections/sms";

export const smsTranslations: typeof EnglishSmsTranslations = {
  errors: {
    missing_phone_number: "Telefonnummer ist für SMS erforderlich",
    marketing_consent_required:
      "Marketing-Einverständnis ist für SMS erforderlich",
    verification_requires_phone:
      "Telefonnummer ist für Verifizierungs-SMS erforderlich",
    delivery_failed:
      "SMS-Zustellung nach mehreren Versuchen fehlgeschlagen: {{errorMessage}}",
    missing_recipient: "SMS-Empfänger ist erforderlich",
    empty_message: "SMS-Nachricht darf nicht leer sein",
    aws_sns_api_error: "AWS SNS API-Fehler: {{error}}",
    aws_sns_error: "AWS SNS-Fehler: {{error}}",
    twilio_api_error: "Twilio API-Fehler {{errorCode}}: {{error}}",
    twilio_error: "Twilio-Fehler: {{error}}",
    messagebird_api_error: "MessageBird API-Fehler: {{error}}",
    messagebird_error: "MessageBird-Fehler: {{error}}",
    http_api_error: "HTTP SMS API-Fehler {{status}}: {{message}}",
    http_error: "HTTP SMS API-Fehler: {{error}}",
    rendering_failed: "SMS-Vorlage konnte nicht gerendert werden",
    send_failed: "SMS-Versand fehlgeschlagen",
    batch_send_failed: "Batch-SMS-Versand fehlgeschlagen",
  },
  error: {
    no_phone: "Benutzer hat keine Telefonnummer",
    invalid_phone_format:
      "Die angegebene Telefonnummer hat ein ungültiges Format: {{reason}}",
    delivery_failed:
      "SMS-Zustellung nach mehreren Versuchen fehlgeschlagen: {{errorMessage}}",
    unexpected_error:
      "Ein unerwarteter Fehler ist beim SMS-Versand aufgetreten: {{errorMessage}}",
    all_failed:
      "Alle {{totalResults}} SMS-Nachrichten konnten nicht gesendet werden",
    partial_failure:
      "{{failureCount}} von {{totalCount}} SMS-Nachrichten konnten nicht gesendet werden",
  },
  template: {
    notification:
      "{{appName}}: Hallo {{firstName}}! Sie haben eine neue Benachrichtigung. Schauen Sie sie sich unter {{appUrl}} an",
  },
  marketing: {
    new_features:
      "{{appName}}: Wir haben gerade aufregende neue Features veröffentlicht! Loggen Sie sich ein, um sie auszuprobieren.",
  },
  verification: {
    code: "{{appName}}: Ihr Verifizierungscode lautet {{code}}. Er läuft in {{expiresInMinutes}} Minuten ab.",
  },
  onboarding: {
    completion:
      "{{appName}}: Willkommen! Ihr Onboarding ist abgeschlossen. Beginnen Sie mit der Erkundung Ihres Dashboards.",
    welcome:
      "{{appName}}: Willkommen beim Social Media Service Center! Ihre Reise beginnt jetzt.",
    progress:
      "{{appName}}: Onboarding-Fortschritt-Update - Aktueller Schritt: {{step}}. Setzen Sie Ihre Einrichtung fort.",
  },
};
