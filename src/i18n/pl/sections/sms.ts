import type { smsTranslations as EnglishSmsTranslations } from "../../en/sections/sms";

export const smsTranslations: typeof EnglishSmsTranslations = {
  errors: {
    missing_phone_number: "Numer telefonu jest wymagany do SMS",
    marketing_consent_required: "Zgoda marketingowa jest wymagana do SMS",
    verification_requires_phone:
      "Numer telefonu jest wymagany do SMS weryfikacyjnego",
    delivery_failed:
      "Nie udało się dostarczyć wiadomości SMS po wielu próbach: {{errorMessage}}",
    missing_recipient: "Odbiorca SMS jest wymagany",
    empty_message: "Wiadomość SMS nie może być pusta",
    aws_sns_api_error: "Błąd API AWS SNS: {{error}}",
    aws_sns_error: "Błąd AWS SNS: {{error}}",
    twilio_api_error: "Błąd API Twilio {{errorCode}}: {{error}}",
    twilio_error: "Błąd Twilio: {{error}}",
    messagebird_api_error: "Błąd API MessageBird: {{error}}",
    messagebird_error: "Błąd MessageBird: {{error}}",
    http_api_error: "Błąd HTTP SMS API {{status}}: {{message}}",
    http_error: "Błąd HTTP SMS API: {{error}}",
    rendering_failed: "Nie udało się wyrenderować szablonu SMS",
    send_failed: "Nie udało się wysłać SMS",
    batch_send_failed: "Nie udało się wysłać batch SMS",
  },
  error: {
    no_phone: "Użytkownik nie ma numeru telefonu",
    invalid_phone_format:
      "Podany numer telefonu ma nieprawidłowy format: {{reason}}",
    delivery_failed:
      "Nie udało się dostarczyć wiadomości SMS po wielu próbach: {{errorMessage}}",
    unexpected_error:
      "Wystąpił nieoczekiwany błąd podczas wysyłania SMS: {{errorMessage}}",
    all_failed: "Wszystkie {{totalResults}} wiadomości SMS nie zostały wysłane",
    partial_failure:
      "{{failureCount}} z {{totalCount}} wiadomości SMS nie zostało wysłanych",
  },
  template: {
    notification:
      "{{appName}}: Witaj {{firstName}}! Masz nowe powiadomienie. Sprawdź je na {{appUrl}}",
  },
  marketing: {
    new_features:
      "{{appName}}: Właśnie wydaliśmy ekscytujące nowe funkcje! Zaloguj się, aby je sprawdzić.",
  },
  verification: {
    code: "{{appName}}: Twój kod weryfikacyjny to {{code}}. Wygasa za {{expiresInMinutes}} minut.",
  },
  onboarding: {
    completion:
      "{{appName}}: Witamy! Twoje wdrożenie jest ukończone. Zacznij eksplorować swój panel.",
    welcome:
      "{{appName}}: Witamy w Social Media Service Center! Twoja podróż zaczyna się teraz.",
    progress:
      "{{appName}}: Aktualizacja postępu wdrożenia - Aktualny krok: {{step}}. Kontynuuj konfigurację.",
  },
};
