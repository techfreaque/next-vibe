import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  sms: {
    error: {
      invalid_phone_format:
        "Formát telefónneho čísla je neplatný. Zadajte platné číslo.",
      invalid_phone_format_reason:
        "Neplatný formát telefónneho čísla: {{reason}}",
      delivery_failed:
        "Nepodarilo sa doručiť SMS na číslo {{phoneNumber}}: {{error}}",
      delivery_failed_http:
        "Nepodarilo sa doručiť SMS na číslo {{phoneNumber}}: {{error}} (HTTP {{status}})",
      delivery_failed_code:
        "Nepodarilo sa doručiť SMS na číslo {{phoneNumber}}: {{error}} (kód {{code}})",
      delivery_failed_status:
        "Nepodarilo sa doručiť SMS na číslo {{phoneNumber}} (HTTP {{status}})",
      unexpected_error: "Neočakávaná chyba pri odosielaní SMS: {{error}}",
      all_failed:
        "Nepodarilo sa odoslať žiadnu SMS. Celkový počet správ: {{totalResults}}.",
      batch_delivery_failed: "Nedoručené SMS: {{errorCount}}",
      partial_failure:
        "Niektoré SMS sa nepodarilo odoslať. Odoslané: {{successCount}}. Neodoslané: {{failureCount}}.",
      rendering_failed:
        "Správu sa nepodarilo vytvoriť zo šablóny SMS: {{error}}",
      send_failed: "Nepodarilo sa poslať SMS: {{error}}",
      batch_send_failed: "Dávku SMS sa nepodarilo odoslať: {{error}}",
      missing_aws_access_key: "Chýba prístupový kľúč AWS",
      missing_aws_secret_key: "Chýba tajný kľúč AWS",
      missing_aws_region: "Chýba región AWS",
      missing_recipient: "Chýba telefónne číslo príjemcu",
      empty_message: "SMS nemôže byť prázdna",
      aws_sns_api_error: "Chyba API služby AWS SNS: {{error}}",
      aws_sns_api_error_http:
        "Chyba API služby AWS SNS: {{error}} (HTTP {{status}})",
      aws_sns_error: "Nastala chyba AWS SNS",
      unknown_error: "Neznáma chyba",
      unknown_provider_error: "Neznáma chyba poskytovateľa {{provider}}",
      error_code: "Chyba {{code}}",
      unknown_code: "neznáme",
    },
  },
};
