import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Utilisateurs",

  widget: {
    intro:
      "Tous les appareils connectés à votre compte. Déconnectez ceux que vous ne reconnaissez pas.",
    revokeFailed: "Impossible de déconnecter cet appareil. Réessayez.",
    back: "Retour",
    loading: "Chargement des sessions…",
    empty: "Aucune session active",
    emptyHint: "Une session est créée à chaque connexion",
    browserSession: "Session de navigateur",
    revoke: "Déconnecter",
    revoking: "Révocation…",
    currentSession: "Actuelle",
    created: "Créée le",
    expires: "Expire le",
    never: "Jamais",
  },

  list: {
    title: "Appareils connectés",
    titleShort: "Mes sessions",
    description: "Lister toutes les sessions actives de votre compte",
    tag: "Sessions",
    response: {
      sessions: "Sessions",
    },
    success: {
      title: "Sessions récupérées",
      description: "Vos sessions actives ont été récupérées",
    },
    errors: {
      unauthorized: {
        title: "Non autorisé",
        description: "Authentification requise",
      },
      validation: {
        title: "Erreur de validation",
        description: "Requête invalide",
      },
      server: {
        title: "Erreur serveur",
        description: "Erreur interne du serveur",
        detail: "Impossible de charger vos sessions : {{error}}",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inconnue s'est produite",
      },
      network: {
        title: "Erreur réseau",
        description: "Une erreur réseau s'est produite",
      },
      forbidden: { title: "Accès interdit", description: "Accès refusé" },
      notFound: { title: "Introuvable", description: "Ressource introuvable" },
      conflict: { title: "Conflit", description: "Conflit de données" },
    },
  },
  create: {
    title: "Créer un jeton de session",
    titleShort: "Créer un jeton",
    description: "Créer un jeton de session nommé pour un accès programmatique",
    tag: "Sessions",
    form: {
      name: "Nom du jeton",
      namePlaceholder: "par ex. Mon bot agent",
    },
    response: {
      token: "Jeton",
      id: "ID de session",
      name: "Nom",
      message: "Copiez ce jeton : il ne sera plus affiché",
    },
    success: {
      title: "Session créée",
      description: "Votre jeton de session a été créé",
    },
    errors: {
      unauthorized: {
        title: "Non autorisé",
        description: "Authentification requise",
      },
      validation: {
        title: "Erreur de validation",
        description: "Requête invalide",
      },
      server: {
        title: "Erreur serveur",
        description: "Erreur interne du serveur",
        detail: "Impossible de créer le jeton de session : {{error}}",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inconnue s'est produite",
      },
      network: {
        title: "Erreur réseau",
        description: "Une erreur réseau s'est produite",
      },
      forbidden: { title: "Accès interdit", description: "Accès refusé" },
      notFound: { title: "Introuvable", description: "Ressource introuvable" },
      conflict: { title: "Conflit", description: "Conflit de données" },
    },
  },
  revoke: {
    title: "Révoquer la session",
    titleShort: "Révoquer la session",
    description: "Révoquer un jeton de session par son ID",
    tag: "Sessions",
    response: {
      message: "Session révoquée",
    },
    success: {
      title: "Session révoquée",
      description: "La session a été révoquée",
    },
    errors: {
      unauthorized: {
        title: "Non autorisé",
        description: "Authentification requise",
      },
      validation: {
        title: "Erreur de validation",
        description: "Requête invalide",
      },
      server: {
        title: "Erreur serveur",
        description: "Erreur interne du serveur",
        detail: "Impossible de révoquer la session : {{error}}",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inconnue s'est produite",
      },
      network: {
        title: "Erreur réseau",
        description: "Une erreur réseau s'est produite",
      },
      forbidden: { title: "Accès interdit", description: "Accès refusé" },
      notFound: {
        title: "Introuvable",
        description: "Session introuvable",
        detail:
          "Aucune session avec l'ID {{sessionId}} n'appartient à votre compte",
      },
      conflict: { title: "Conflit", description: "Conflit de données" },
    },
  },
};
