import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  errors: {
    failedToLoadBrowserIdentity:
      "Impossible de charger l'identité du navigateur. Veuillez actualiser la page.",
  },
  meta: {
    title: "Inscription : {{appName}}",
    description:
      "Créez votre compte {{appName}} et discutez avec des modèles d'IA grand public et non censurés. Crédits gratuits inclus.",
    category: "Authentification",
    imageAlt: "Inscription à {{appName}}",
    keywords: "inscription, s'inscrire, créer un compte, {{appName}}",
    ogTitle: "S'inscrire sur {{appName}}",
    ogDescription:
      "Rejoignez {{appName}} et discutez dès aujourd'hui avec des modèles d'IA grand public et non censurés",
    twitterTitle: "S'inscrire sur {{appName}}",
    twitterDescription:
      "Créez votre compte et lancez vos conversations sur {{appName}}",
  },
  post: {
    title: "Inscription",
    description: "Endpoint d'inscription",
    form: {
      title: "Configuration de l'inscription",
      description: "Configurer les paramètres d'inscription",
    },
    response: {
      title: "Réponse",
      description: "Données de réponse de l'inscription",
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
