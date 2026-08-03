import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  sms: {
    error: {
      invalid_phone_format:
        "Nieprawidłowy format numeru telefonu. Proszę podać prawidłowy numer telefonu.",
      invalid_phone_format_reason:
        "Nieprawidłowy format numeru telefonu: {{reason}}",
      delivery_failed:
        "Nie udało się dostarczyć SMS-a do {{phoneNumber}}: {{error}}",
      delivery_failed_http:
        "Nie udało się dostarczyć SMS-a do {{phoneNumber}}: {{error}} (HTTP {{status}})",
      delivery_failed_code:
        "Nie udało się dostarczyć SMS-a do {{phoneNumber}}: {{error}} (kod {{code}})",
      delivery_failed_status:
        "Nie udało się dostarczyć SMS-a do {{phoneNumber}} (HTTP {{status}})",
      unexpected_error: "Nieoczekiwany błąd podczas wysyłania SMS-a: {{error}}",
      all_failed:
        "Wszystkie {{totalResults}} wiadomości SMS nie zostały wysłane",
      batch_delivery_failed:
        "Nie udało się dostarczyć {{errorCount}} wiadomości SMS",
      partial_failure:
        "Niektóre wiadomości SMS nie powiodły się. Udane: {{successCount}}, Nieudane: {{failureCount}}",
      rendering_failed: "Nie udało się renderować szablonu SMS: {{error}}",
      send_failed: "Nie udało się wysłać SMS-a: {{error}}",
      batch_send_failed: "Masowe wysyłanie SMS-ów nie powiodło się: {{error}}",
      missing_aws_access_key: "Brak klucza dostępu AWS",
      missing_aws_secret_key: "Brak tajnego klucza AWS",
      missing_aws_region: "Brak regionu AWS",
      missing_recipient: "Brak numeru telefonu odbiorcy",
      empty_message: "Wiadomość SMS nie może być pusta",
      aws_sns_api_error: "Błąd API AWS SNS: {{error}}",
      aws_sns_api_error_http: "Błąd API AWS SNS: {{error}} (HTTP {{status}})",
      aws_sns_error: "Wystąpił błąd AWS SNS",
      unknown_error: "Nieznany błąd",
      unknown_provider_error: "Nieznany błąd {{provider}}",
      error_code: "Błąd {{code}}",
      unknown_code: "nieznany",
    },
  },
};
