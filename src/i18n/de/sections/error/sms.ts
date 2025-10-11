import type { smsTranslations as EnglishSmsTranslations } from "../../../en/sections/error/sms";

export const smsTranslations: typeof EnglishSmsTranslations = {
  errors: {
    invalid_parameters: "Ungültige SMS-Parameter",
    recipient_required: "Empfänger-Telefonnummer (to) ist erforderlich",
    from_required:
      "Absender-Telefonnummer ist erforderlich (entweder in Parametern oder SMS_FROM_NUMBER Umgebungsvariable)",
    empty_message: "Nachrichteninhalt darf nicht leer sein",
    twilio_api_error: "Twilio API-Fehler {{errorCode}}: {{errorMessage}}",
    twilio_error: "Twilio-Fehler: {{error}}",
    messagebird_api_error: "MessageBird API-Fehler: {{errorMessage}}",
    messagebird_error: "MessageBird-Fehler: {{error}}",
    http_api_error: "HTTP SMS API-Fehler {{status}}: {{message}}",
    http_error: "HTTP SMS API-Fehler: {{error}}",
    missing_phone_number: "Telefonnummer ist für SMS erforderlich",
    marketing_consent_required:
      "Marketing-Einverständnis ist für SMS erforderlich",
    verification_requires_phone:
      "Telefonnummer ist für Verifizierungs-SMS erforderlich",
  },
};
