import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  sms: {
    error: {
      invalid_phone_format:
        "Nieprawidłowy format numeru telefonu. Proszę podać prawidłowy numer telefonu.",
      delivery_failed:
        "Nie udało się dostarczyć SMS-a do {{phoneNumber}}: {{error}}",
      unexpected_error:
        "Wystąpił nieoczekiwany błąd podczas wysyłania SMS-a",
      all_failed: "Wszystkie wiadomości SMS nie powiodły się",
      partial_failure:
        "Niektóre wiadomości SMS nie powiodły się. Udane: {{successCount}}, Nieudane: {{failureCount}}",
      rendering_failed: "Nie udało się renderować szablonu SMS",
      send_failed: "Nie udało się wysłać SMS-a",
      batch_send_failed: "Masowe wysyłanie SMS-ów nie powiodło się",
      missing_aws_access_key: "Brak klucza dostępu AWS",
      missing_aws_secret_key: "Brak tajnego klucza AWS",
      missing_aws_region: "Brak regionu AWS",
      missing_recipient: "Brak numeru telefonu odbiorcy",
      empty_message: "Wiadomość SMS nie może być pusta",
      aws_sns_api_error: "Błąd API AWS SNS: {{error}}",
      aws_sns_error: "Wystąpił błąd AWS SNS",
    },
  },
};
