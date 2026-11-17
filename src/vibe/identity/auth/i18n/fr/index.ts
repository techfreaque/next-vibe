import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Authentification",
  search: {
    tag: "Auth",
  },
  authClient: {
    errors: {
      status_save_failed:
        "Impossible d'enregistrer le statut d'authentification",
      status_remove_failed:
        "Impossible de supprimer le statut d'authentification",
      status_check_failed:
        "Impossible de vérifier le statut d'authentification",
      token_save_failed: "Impossible d'enregistrer le jeton d'authentification",
      token_get_failed: "Impossible de récupérer le jeton d'authentification",
      token_remove_failed:
        "Impossible de supprimer le jeton d'authentification",
      token_save_failed_detail:
        "Impossible d'enregistrer le jeton d'authentification : {{error}}",
      token_get_failed_detail:
        "Impossible de récupérer le jeton d'authentification : {{error}}",
      token_remove_failed_detail:
        "Impossible de supprimer le jeton d'authentification : {{error}}",
    },
  },
  debug: {
    getAuthMinimalUserNext: {
      start:
        "getAuthMinimalUserNext: - Vérification de l'authentification en premier",
      result: "getAuthMinimalUserNext: résultat de getCurrentUserNext",
      authenticated:
        "getAuthMinimalUserNext: utilisateur authentifié, récupération du leadId",
      returningAuth:
        "getAuthMinimalUserNext: renvoi de l'utilisateur authentifié",
      notAuthenticated:
        "getAuthMinimalUserNext: utilisateur non authentifié, renvoi de l'utilisateur public",
    },
    signingJwt: "Signature du JWT",
    jwtSignedSuccessfully: "JWT signé",
    errorSigningJwt: "Erreur lors de la signature du JWT",
    verifyingJwt: "Vérification du JWT",
    invalidTokenPayload: "Contenu du jeton invalide",
    jwtVerifiedSuccessfully: "JWT vérifié",
    errorVerifyingJwt: "Erreur lors de la vérification du JWT",
    userIdNotExistsInDb:
      "L'ID utilisateur n'existe pas dans la base de données",
    sessionNotFound: "Session introuvable",
    sessionExpired: "Session expirée",
    errorValidatingUserSession:
      "Erreur lors de la validation de la session utilisateur",
    errorGettingUserRoles:
      "Erreur lors de la récupération des rôles de l'utilisateur",
    errorCheckingUserAuth:
      "Erreur lors de la vérification de l'authentification de l'utilisateur",
    authenticatingCliUserWithPayload:
      "Authentification de l'utilisateur CLI avec le payload",
    errorAuthenticatingCliUserWithPayload:
      "Erreur lors de l'authentification de l'utilisateur CLI avec le payload",
    creatingCliToken: "Création du jeton CLI",
    errorCreatingCliToken: "Erreur lors de la création du jeton CLI",
    validatingCliToken: "Validation du jeton CLI",
    errorValidatingCliToken: "Erreur lors de la validation du jeton CLI",
    gettingCurrentUserFromNextjs:
      "Récupération de l'utilisateur actuel depuis Next.js",
    errorGettingAuthUserForNextjs:
      "Erreur lors de la récupération de l'utilisateur authentifié pour Next.js",
    settingNextjsAuthCookies:
      "Définition des cookies d'authentification Next.js",
    clearingNextjsAuthCookies:
      "Suppression des cookies d'authentification Next.js",
    gettingCurrentUserFromToken:
      "Récupération de l'utilisateur actuel depuis le jeton",
    errorGettingCurrentUserFromCli:
      "Erreur lors de la récupération de l'utilisateur actuel depuis la CLI",
    errorGettingAuthUserForCli:
      "Erreur lors de la récupération de l'utilisateur authentifié pour la CLI",
    errorGettingUserRolesForCli:
      "Erreur lors de la récupération des rôles de l'utilisateur pour la CLI",
    tokenFromAuthHeader: "Jeton issu de l'en-tête d'authentification",
    tokenFromCookie: "Jeton issu du cookie",
    noTokenFound: "Aucun jeton trouvé",
    errorExtractingToken: "Erreur lors de l'extraction du jeton",
    errorParsingCookies: "Erreur lors de l'analyse des cookies",
  },
  errors: {
    token_generation_failed:
      "Impossible de générer le jeton d'authentification",
    invalid_session: "La session est invalide ou a expiré",
    missing_request_context: "Le contexte de la requête est manquant",
    missing_locale: "La langue est absente de la requête",
    unsupported_platform: "Plateforme non prise en charge",
    session_retrieval_failed: "Impossible de récupérer la session",
    missing_token: "Le jeton d'authentification est manquant",
    invalid_token_signature: "La signature du jeton est invalide",
    invalid_token_signature_detail:
      "La vérification de la signature du jeton a échoué : {{error}}",
    jwt_payload_missing_id: "L'ID utilisateur est absent du payload JWT",
    cookie_set_failed:
      "Impossible de définir le cookie d'authentification : {{error}}",
    cookie_clear_failed:
      "Impossible de supprimer le cookie d'authentification : {{error}}",
    publicPayloadNotSupported:
      "Un payload JWT public n'est pas pris en charge pour l'authentification CLI",
    jwt_signing_failed: "Impossible de signer le jeton JWT : {{error}}",
    authentication_failed: "Échec de l'authentification : {{error}}",
    user_not_authenticated: "L'utilisateur n'est pas authentifié : {{email}}",
    publicUserNotAllowed:
      "L'utilisateur public n'est pas autorisé pour cet endpoint",
    validation_failed: "Échec de la validation",
    failed_to_create_lead: "Impossible de créer le lead",
    native: {
      unsupported:
        "Cette méthode d'authentification n'est pas prise en charge sur React Native",
      storage_failed:
        "Impossible d'enregistrer les données d'authentification : {{error}}",
      clear_failed:
        "Impossible de supprimer les données d'authentification : {{error}}",
    },
    not_implemented_native:
      "Cette fonctionnalité n'est pas encore disponible pour React Native",
    unknownError:
      "Une erreur inconnue s'est produite lors de l'authentification",
  },
  post: {
    title: "Auth",
    description: "Endpoint d'authentification",
    form: {
      title: "Configuration de l'authentification",
      description: "Configurer les paramètres d'authentification",
    },
    response: {
      title: "Réponse",
      description: "Données de réponse de l'authentification",
    },
    errors: {
      unauthorized: {
        title: "Non autorisé",
        description: "Authentification requise",
      },
      validation: {
        title: "Erreur de validation",
        description: "Paramètres de requête invalides",
      },
      missing_locale: {
        title: "Langue manquante",
        description: "Le paramètre de langue est obligatoire",
      },
      server: {
        title: "Erreur serveur",
        description: "Une erreur interne du serveur s'est produite",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inconnue s'est produite",
      },
      network: {
        title: "Erreur réseau",
        description: "Une erreur réseau s'est produite",
      },
      forbidden: {
        title: "Accès interdit",
        description: "Accès refusé",
      },
      notFound: {
        title: "Introuvable",
        description: "Ressource introuvable",
      },
      conflict: {
        title: "Conflit",
        description: "Un conflit de données s'est produit",
      },
      token_generation_failed: {
        title: "Échec de génération du jeton",
        description: "Impossible de générer le jeton d'authentification",
      },
      invalid_session: {
        title: "Session invalide",
        description: "La session est invalide ou a expiré",
      },
      missing_request_context: {
        title: "Contexte de requête manquant",
        description: "Le contexte de la requête est manquant",
      },
      unsupported_platform: {
        title: "Plateforme non prise en charge",
        description: "Plateforme non prise en charge",
      },
      session_retrieval_failed: {
        title: "Échec de récupération de la session",
        description: "Impossible de récupérer la session",
      },
      missing_token: {
        title: "Jeton manquant",
        description: "Le jeton d'authentification est manquant",
      },
      invalid_token_signature: {
        title: "Signature du jeton invalide",
        description: "La signature du jeton est invalide",
      },
      jwt_payload_missing_id: {
        title: "ID manquant dans le payload JWT",
        description: "L'ID utilisateur est absent du payload JWT",
      },
      cookie_set_failed: {
        title: "Échec de définition du cookie",
        description: "Impossible de définir le cookie d'authentification",
      },
      cookie_clear_failed: {
        title: "Échec de suppression du cookie",
        description: "Impossible de supprimer le cookie d'authentification",
      },
    },
    success: {
      title: "Succès",
      description: "Opération réussie",
    },
  },
  check: {
    get: {
      title: "Vérifier l'authentification",
      description: "Vérifier le statut d'authentification actuel",
      response: {
        title: "Statut d'authentification",
        description: "État d'authentification actuel",
        authenticated: "Authentifié",
        tokenValid: "Jeton valide",
      },
    },
  },
  enums: {
    webSocketErrorCode: {
      unauthorized: "Non autorisé",
      forbidden: "Accès interdit",
      invalidToken: "Jeton invalide",
      tokenExpired: "Jeton expiré",
      serverError: "Erreur serveur",
    },
  },
};
