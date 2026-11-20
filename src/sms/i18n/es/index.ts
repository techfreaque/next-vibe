import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  sms: {
    error: {
      invalid_phone_format:
        "Formato de número de teléfono inválido. Por favor, proporcione un número de teléfono válido.",
      invalid_phone_format_reason:
        "Formato de número de teléfono inválido: {{reason}}",
      delivery_failed: "Failed to deliver SMS to {{phoneNumber}} : {{error}}",
      delivery_failed_http:
        "Failed to deliver SMS to {{phoneNumber}} : {{error}} (HTTP {{status}})",
      delivery_failed_code:
        "Failed to deliver SMS to {{phoneNumber}} : {{error}} (code {{code}})",
      delivery_failed_status:
        "Failed to deliver SMS to {{phoneNumber}} (HTTP {{status}})",
      unexpected_error: "Error inesperado al enviar SMS : {{error}}",
      all_failed: "Todos los mensajes {{totalResults}} SMS no enviaron",
      batch_delivery_failed: "Los mensajes {{errorCount}} SMS no entregaron",
      partial_failure:
        "Algunos mensajes de SMS no enviaron. Exitoso: {{successCount}}, Failed: {{failureCount}}",
      rendering_failed: "Failed to render SMS template: {{error}}",
      send_failed: "Failed to send SMS : {{error}}",
      batch_send_failed: "Batch SMS enviar falló: {{error}}",
      missing_aws_access_key: "AWS Access Key falta",
      missing_aws_secret_key: "AWS Secret Key está desaparecido",
      missing_aws_region: "AWS Region está desaparecida",
      missing_recipient: "Número de teléfono principal desaparecido",
      empty_message: "El mensaje SMS no puede estar vacío",
      aws_sns_api_error: "AWS SNS API error: {{error}}",
      aws_sns_api_error_http: "AWS SNS API error: {{error}} (HTTP {{status}})",
      aws_sns_error: "error AWS SNS ocurrido",
      unknown_error: "Error desconocido",
      unknown_provider_error: "Error desconocido {{provider}}",
      error_code: "Error {{code}}",
      unknown_code: "desconocida",
    },
  },
};
