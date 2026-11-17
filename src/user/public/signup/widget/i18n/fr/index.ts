import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  passwordStrength: {
    label: "Robustesse du mot de passe",
    weak: "Faible",
    fair: "Moyen",
    good: "Bon",
    strong: "Robuste",
    requirement: {
      minLength: {
        icon: "✗",
        text: "Au moins 8 caractères",
      },
      uppercase: {
        icon: "✗",
        text: "Au moins une majuscule",
      },
      lowercase: {
        icon: "✗",
        text: "Au moins une minuscule",
      },
      number: {
        icon: "✗",
        text: "Au moins un chiffre",
      },
      special: {
        icon: "!",
        text: "Caractère spécial (facultatif, renforce le mot de passe)",
      },
    },
  },
  post: {
    title: "_components",
    description: "Endpoint _components",
    form: {
      title: "Configuration de _components",
      description: "Configurer les paramètres de _components",
    },
    response: {
      title: "Réponse",
      description: "Données de réponse de _components",
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
