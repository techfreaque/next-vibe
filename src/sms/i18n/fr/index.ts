import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  sms: {
    error: {
      invalid_phone_format:
        "Format de numéro de téléphone non valide. Indiquez un numéro valide.",
      invalid_phone_format_reason:
        "Format de numéro de téléphone non valide : {{reason}}",
      delivery_failed:
        "Échec de la livraison du SMS à {{phoneNumber}} : {{error}}",
      delivery_failed_http:
        "Échec de la livraison du SMS à {{phoneNumber}} : {{error}} (HTTP {{status}})",
      delivery_failed_code:
        "Échec de la livraison du SMS à {{phoneNumber}} : {{error}} (code {{code}})",
      delivery_failed_status:
        "Échec de la livraison du SMS à {{phoneNumber}} (HTTP {{status}})",
      unexpected_error: "Erreur inattendue lors de l'envoi du SMS : {{error}}",
      all_failed: "Les {{totalResults}} SMS n'ont pas pu être envoyés",
      batch_delivery_failed: "{{errorCount}} SMS n'ont pas pu être livrés",
      partial_failure:
        "Certains SMS n'ont pas pu être envoyés. Réussis : {{successCount}}, échecs : {{failureCount}}",
      rendering_failed: "Échec du rendu du modèle SMS : {{error}}",
      send_failed: "Échec de l'envoi du SMS : {{error}}",
      batch_send_failed: "Échec de l'envoi groupé de SMS : {{error}}",
      missing_aws_access_key: "Clé d'accès AWS manquante",
      missing_aws_secret_key: "Clé secrète AWS manquante",
      missing_aws_region: "Région AWS manquante",
      missing_recipient: "Numéro de téléphone du destinataire manquant",
      empty_message: "Le SMS ne peut pas être vide",
      aws_sns_api_error: "Erreur de l'API AWS SNS : {{error}}",
      aws_sns_api_error_http:
        "Erreur de l'API AWS SNS : {{error}} (HTTP {{status}})",
      aws_sns_error: "Une erreur AWS SNS est survenue",
      unknown_error: "Erreur inconnue",
      unknown_provider_error: "Erreur {{provider}} inconnue",
      error_code: "Erreur {{code}}",
      unknown_code: "inconnu",
    },
  },
};
