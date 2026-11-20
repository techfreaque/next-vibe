import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  sms: {
    error: {
      invalid_phone_format:
        "Formato del numero di telefono non valido. Si prega di fornire un numero di telefono valido.",
      invalid_phone_format_reason:
        "Formato del numero di telefono non valido: {{reason}}",
      delivery_failed: "Non ha consegnato SMS a {{phoneNumber}}: {{error}}",
      delivery_failed_http:
        "Non consegnate SMS a {{phoneNumber}}: {{error}} (HTTP {{status}})",
      delivery_failed_code:
        "Non è possibile consegnare SMS a {{phoneNumber}}: {{error}} (codice {{code}})",
      delivery_failed_status:
        "Non fornito SMS a {{phoneNumber}} (HTTP {{status}})",
      unexpected_error: "Errore inaspettato durante l'invio di SMS: {{error}}",
      all_failed:
        "Tutti i messaggi {{totalResults}} SMS non sono riusciti a inviare",
      batch_delivery_failed:
        "I messaggi {{errorCount}} SMS non sono riusciti a fornire",
      partial_failure:
        "Alcuni messaggi SMS non sono riusciti a inviare. Successo: {{successCount}}, fallito: {{failureCount}}",
      rendering_failed: "Non è riuscito a rendere il modello SMS: {{error}}",
      send_failed: "Non inviare SMS: {{error}}",
      batch_send_failed: "Batch SMS invia guasto: {{error}}",
      missing_aws_access_key: "AWS Access Key manca",
      missing_aws_secret_key: "AWS Secret Key manca",
      missing_aws_region: "AWS Regione manca",
      missing_recipient: "Manca il numero di telefono sensibile",
      empty_message: "Il messaggio SMS non può essere vuoto",
      aws_sns_api_error: "Errore AWS SNS API: {{error}}",
      aws_sns_api_error_http: "Errore AWS SNS API: {{error}} (HTTP {{status}})",
      aws_sns_error: "Si è verificato l'errore AWS SNS",
      unknown_error: "Errore sconosciuto",
      unknown_provider_error: "Errore sconosciuto {{provider}}",
      error_code: "Errore {{code}}",
      unknown_code: "sconosciuto",
    },
  },
};
