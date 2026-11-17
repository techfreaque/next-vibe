import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Opérations de base de données",

  tag: "studio",
  post: {
    title: "Studio de base de données",
    titleShort: "Studio BDD",
    description: "Ouvrir le studio pour gérer la base de données visuellement",
    form: {
      title: "Configuration du studio",
      description: "Configurer les paramètres du studio de base de données",
    },
    response: {
      title: "Réponse du studio",
      description: "Résultats du lancement du studio de base de données",
    },
    errors: {
      unauthorized: {
        title: "Non autorisé",
        description:
          "Authentification requise pour le studio de base de données",
      },
      validation: {
        title: "Erreur de validation",
        description: "Paramètres du studio invalides",
      },
      server: {
        title: "Erreur serveur",
        description: "Erreur interne du serveur pendant le lancement du studio",
        detail:
          "Drizzle Studio n'a pas démarré après {{seconds}} s : {{error}}",
      },
      internal: {
        title: "Erreur interne",
        description: "Le lancement du studio de base de données a échoué",
      },
      unknown: {
        title: "Erreur inconnue",
        description:
          "Une erreur inconnue est survenue pendant le lancement du studio",
      },
      network: {
        title: "Erreur réseau",
        description: "Erreur réseau pendant le lancement du studio",
      },
      forbidden: {
        title: "Accès refusé",
        description:
          "Permissions insuffisantes pour le studio de base de données",
      },
      notFound: {
        title: "Introuvable",
        description: "Ressources du studio introuvables",
      },
      conflict: {
        title: "Conflit",
        description: "Conflit de port du studio détecté",
      },
    },
    success: {
      title: "Studio lancé",
      description: "Studio de base de données lancé avec succès",
    },
  },
  fields: {
    port: {
      title: "Port",
      description: "Numéro de port du studio de base de données (1024-65535)",
    },
    openBrowser: {
      title: "Ouvrir le navigateur",
      description: "Ouvrir automatiquement le studio dans le navigateur",
    },
    success: {
      title: "Statut de réussite",
    },
    url: {
      title: "URL du studio",
    },
    portUsed: {
      title: "Port réellement utilisé",
    },
    output: {
      title: "Sortie du lancement",
    },
    duration: {
      title: "Durée du lancement",
    },
  },
};
