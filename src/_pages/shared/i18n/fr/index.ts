import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  error: {
    title: "Erreur",
    message: "Une erreur s'est produite. Veuillez réessayer.",
    general: {
      unknown_validation_error:
        "Une erreur de validation inconnue s'est produite.",
    },
  },
  errorTypes: {
    auth_error: "Erreur d'authentification",
    bad_request: "Requête incorrecte",
    database_error: "Erreur de base de données",
    email_error: "Erreur d'e-mail",
    external_service_error: "Erreur de service externe",
    forbidden: "Accès interdit",
    http_error: "Erreur HTTP",
    internal_error: "Erreur interne",
    invalid_credentials_error: "Identifiants invalides",
    invalid_data_error: "Données invalides",
    invalid_format_error: "Format invalide",
    invalid_input_error: "Saisie invalide",
    invalid_method_error: "Méthode invalide",
    invalid_parameter_error: "Paramètre invalide",
    invalid_path_error: "Chemin invalide",
    invalid_payload_error: "Contenu de requête invalide",
    invalid_query_error: "Requête invalide",
    invalid_request_error: "Demande invalide",
    invalid_response_error: "Réponse invalide",
    invalid_status_error: "Statut invalide",
    invalid_token_error: "Jeton invalide",
    invalid_url_error: "URL invalide",
    no_response_data: "Aucune donnée dans la réponse",
    not_found: "Introuvable",
    partial_failure: "Échec partiel",
    payment_failed: "Échec du paiement",
    payment_required: "Paiement requis",
    permission_denied: "Autorisation refusée",
    permission_error: "Erreur d'autorisation",
    sms_error: "Erreur SMS",
    token_expired_error: "Jeton expiré",
    two_factor_required: "Authentification à deux facteurs requise",
    unauthorized: "Non autorisé",
    unknown_error: "Erreur inconnue",
    validation_error: "Erreur de validation",
  },
  stats: {
    chartType: {
      area: "Aires",
      bar: "Barres",
      donut: "Anneau",
      line: "Courbe",
      pie: "Secteurs",
    },
    dateRange: {
      custom: "Personnalisé",
      last30Days: "30 derniers jours",
      last7Days: "7 derniers jours",
      last90Days: "90 derniers jours",
      lastMonth: "Mois dernier",
      lastQuarter: "Trimestre dernier",
      lastWeek: "Semaine dernière",
      lastYear: "Année dernière",
      thisMonth: "Ce mois-ci",
      thisQuarter: "Ce trimestre",
      thisWeek: "Cette semaine",
      thisYear: "Cette année",
      today: "Aujourd'hui",
      yesterday: "Hier",
    },
    timePeriod: {
      day: "Jour",
      month: "Mois",
      quarter: "Trimestre",
      week: "Semaine",
      year: "Année",
    },
  },
  errors: {
    invalid_request_data: "Données de requête invalides",
    serverError: {
      description: "Une erreur serveur s'est produite. Veuillez réessayer.",
    },
    validationFailed: {
      description: "La validation a échoué. Vérifiez votre saisie.",
    },
  },
  cli: {
    vibe: {
      errors: {
        routeNotFound: "Route introuvable pour l'outil : {{toolName}}",
        routeUnavailableOnServer:
          "{{toolName}} ne fonctionne que dans le CLI vibe. Ce serveur ne le propose pas.",
        executionFailed: "Échec de l'exécution",
        unknownError: "Une erreur inconnue s'est produite",
        unknownErrorDetail: "Une erreur inconnue s'est produite : {{error}}",
      },
    },
  },
  shared: {
    permissions: {
      errors: {
        definitionError: "Erreur dans la définition de l'endpoint",
        platformAccessDenied: "Accès refusé sur {{platform}} : {{reason}}",
        insufficientRoles:
          "L'utilisateur {{userId}} n'a pas les rôles requis : {{requiredRoles}}",
      },
    },
    endpoints: {
      definition: {
        loader: {
          errors: {
            endpointNotFound: "Endpoint introuvable",
            loadFailed: "Impossible de charger l'endpoint",
            batchLoadFailed: "Impossible de charger les endpoints",
          },
        },
      },
    },
  },
  utils: {
    parseJsonWithComments: {
      errors: {
        invalid_json: "JSON invalide",
      },
    },
    time: {
      errors: {
        invalid_time_format: {
          title: "Format d'heure invalide",
        },
        invalid_time_range: {
          title: "Plage horaire invalide",
        },
      },
    },
  },
};
