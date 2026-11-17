import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  pages: {
    error: {
      title: "Une erreur est survenue !",
      message: "Désolé, un problème inattendu s'est produit.",
      errorId: "ID de l'erreur : {{id}}",
      error_message: "Erreur : {{message}}",
      stackTrace: "Trace de la pile : {{stack}}",
      tryAgain: "Réessayer",
      backToHome: "Retour à l'accueil",
    },
    frame: {
      endpointNotFound: "Endpoint « {{endpointId}} » introuvable",
      endpointLoadFailed: "Échec du chargement de l'endpoint",
    },
    notFound: {
      title: "Page introuvable",
      description: "La page que vous cherchez n'existe pas ou a été déplacée.",
      goBack: "Retour",
      goHome: "Accueil",
    },
  },
  meta: {
    title: "404 : page introuvable",
    category: "Erreur",
    description: "La page que vous cherchez n'existe pas",
    imageAlt: "404 introuvable",
    keywords: "404, introuvable, erreur",
  },
  post: {
    title: "[...notFound]",
    description: "Endpoint [...notFound]",
    form: {
      title: "Configuration de [...notFound]",
      description: "Configurer les paramètres de [...notfound]",
    },
    response: {
      title: "Réponse",
      description: "Données de réponse de [...notFound]",
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
