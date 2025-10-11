import type { smsTranslations as EnglishSmsTranslations } from "../../../en/sections/error/sms";

export const smsTranslations: typeof EnglishSmsTranslations = {
  errors: {
    invalid_parameters: "Nieprawidłowe parametry SMS",
    recipient_required: "Numer telefonu odbiorcy (do) jest wymagany",
    from_required:
      "Numer telefonu nadawcy jest wymagany (w parametrach lub zmiennej środowiskowej SMS_FROM_NUMBER)",
    empty_message: "Treść wiadomości nie może być pusta",
    twilio_api_error: "Błąd API Twilio {{errorCode}}: {{errorMessage}}",
    twilio_error: "Błąd Twilio: {{error}}",
    messagebird_api_error: "Błąd API MessageBird: {{errorMessage}}",
    messagebird_error: "Błąd MessageBird: {{error}}",
    http_api_error: "Błąd HTTP SMS API {{status}}: {{message}}",
    http_error: "Błąd HTTP SMS API: {{error}}",
    missing_phone_number: "Numer telefonu jest wymagany dla SMS",
    marketing_consent_required: "Zgoda marketingowa jest wymagana dla SMS",
    verification_requires_phone:
      "Numer telefonu jest wymagany dla SMS weryfikacyjnego",
  },
};
