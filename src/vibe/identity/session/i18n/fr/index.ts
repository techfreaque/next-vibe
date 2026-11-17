import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  enums: {
    sessionErrorReason: {
      noTokenInCookies: "Aucun jeton dans les cookies",
    },
  },
  errors: {
    session_not_found: "Session introuvable pour le jeton {{token}}",
    session_token_missing: "Aucun jeton de session trouvé ({{reason}})",
    session_lookup_failed:
      "Impossible de rechercher la session {{token}} : {{error}}",
    current_session_failed:
      "Impossible de lire la session actuelle : {{error}}",
    expired_sessions_delete_failed:
      "Impossible de supprimer les sessions expirées",
    session_creation_failed:
      "Impossible de créer une session pour l'utilisateur {{userId}}",
    session_creation_database_error:
      "Erreur de base de données lors de la création de la session pour l'utilisateur {{userId}} : {{error}}",
    user_sessions_delete_failed:
      "Impossible de supprimer la session {{sessionId}} : {{error}}",
    expired: "Session expirée le {{expiresAt}}",
  },
  post: {
    title: "Session",
    description: "Endpoint de session",
    form: {
      title: "Configuration de la session",
      description: "Configurer les paramètres de session",
    },
    response: {
      title: "Réponse",
      description: "Données de réponse de la session",
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
    },
    success: {
      title: "Succès",
      description: "Opération réussie",
    },
  },
};
