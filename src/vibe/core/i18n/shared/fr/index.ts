import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  errorTypes: {
    auth_error: "Erreur d'authentification",
    bad_request: "Requête incorrecte",
    conflict: "Conflit",
    purchased_model_required:
      "Ce modèle nécessite des crédits payants. Choisissez un modèle gratuit ou achetez des crédits.",
    shared_allowance_reached:
      "Les crédits gratuits partagés sont épuisés. Achetez des crédits ou attendez le renouvellement du quota.",
    consent_required: "Consentement requis",
    database_error: "Erreur de base de données",
    email_error: "Erreur d'e-mail",
    external_service_error: "Erreur d'un service externe",
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
    invalid_query_error: "Requête de recherche invalide",
    invalid_request_error: "Requête invalide",
    invalid_response_error: "Réponse invalide",
    invalid_status_error: "Statut invalide",
    invalid_token_error: "Jeton invalide",
    invalid_url_error: "URL invalide",
    no_response_data: "Aucune donnée de réponse",
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
    invalidLocaleDetail: "Langue invalide « {{locale}} »",
    invalidRequestDataDetail: "Données de requête invalides : {{error}}",
    invalidResponseDetail: "Données de réponse invalides : {{error}}",
    invalidErrorResponseDetail: "Réponse d'erreur mal formée : {{error}}",
    csrfFailedDetail: "Requête bloquée par la protection CSRF : {{reason}}",
    csrfReasonUnknown: "La validation du jeton CSRF a échoué",
    uploadTooLargeDetail:
      "Envoi trop lourd : {{size}} Mo. Un message accepte jusqu'à {{limit}} Mo de fichiers. Retirez ou réduisez un fichier, puis renvoyez.",
    internalDetail: "Erreur interne : {{error}}",
    authenticationFailed: "L'authentification de l'utilisateur a échoué",
  },
  validation: {
    missingFields: "Champs obligatoires manquants ({{count}}) :",
    failedOne: "Échec de la validation (1 erreur) :",
    failedMany: "Échec de la validation ({{count}} erreurs) :",
    cliHints:
      "\n\nExemple :\n  {{example}}\n\nOu en mode interactif :\n  {{interactive}}\n\nPlus d'infos :\n  {{help}}",
    report: "{{header}}{{fields}}{{hints}}",
    unexpected: "La validation a échoué de façon inattendue : {{error}}",
  },
  shared: {
    permissions: {
      errors: {
        definitionError: "Erreur de définition de l'endpoint : {{reason}}",
        allowedRolesMissing:
          "Erreur de définition de l'endpoint : allowedRoles est absent ou n'est pas une liste",
        platformAccessDenied: {
          productionDisabled:
            "Accès refusé sur {{platform}} : cet endpoint est désactivé en production",
          platformExcluded:
            "Accès refusé sur {{platform}} : cet endpoint n'est pas exposé sur cette plateforme",
          cliPackageAuthRequired:
            "Accès refusé sur {{platform}} : cet endpoint exige une authentification que le paquet CLI ne peut pas fournir",
          mcpNotListed:
            "Accès refusé sur {{platform}} : cet endpoint n'est pas listé sur MCP",
        },
        insufficientRoles:
          "Il manque à l'utilisateur {{userId}} les rôles requis : {{requiredRoles}} (rôles actuels : {{userRoles}})",
        insufficientRolesNoRoles:
          "Il manque à l'utilisateur {{userId}} les rôles requis : {{requiredRoles}} (rôles actuels : aucun)",
        insufficientRolesPublic:
          "Il manque à l'utilisateur public les rôles requis : {{requiredRoles}} (rôles actuels : {{userRoles}})",
        insufficientRolesPublicNoRoles:
          "Il manque à l'utilisateur public les rôles requis : {{requiredRoles}} (rôles actuels : aucun)",
      },
    },
    endpoints: {
      definition: {
        loader: {
          errors: {
            endpointNotFound: "Endpoint introuvable : {{identifier}}",
            loadFailed:
              "Impossible de charger l'endpoint {{identifier}} : {{error}}",
            batchLoadFailed:
              "Impossible de charger {{failedCount}} endpoints sur {{totalCount}}",
            batchLoadError:
              "Impossible de charger {{failedCount}} endpoints sur {{totalCount}} : {{error}}",
          },
        },
      },
    },
  },
};
