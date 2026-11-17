import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Statut du pulse",
  tags: {
    status: "Statut",
  },
  get: {
    title: "Statut du pulse",
    titleShort: "Statut du pulse",
    description: "Obtenir l'état de santé du pulse",
    container: {
      title: "Santé du pulse",
      description:
        "Surveiller la santé et les statistiques d'exécution du pulse",
    },
    fields: {
      status: {
        title: "Statut",
        label: "Statut du pulse",
        description: "État de santé actuel du pulse",
      },
      lastPulseAt: {
        title: "Dernier pulse le",
        label: "Dernier pulse",
        description: "Horodatage de la dernière exécution du pulse",
      },
      successRate: {
        title: "Taux de réussite",
        label: "Taux de réussite",
        description: "Pourcentage d'exécutions du pulse réussies",
      },
      totalExecutions: {
        title: "Exécutions totales",
        label: "Exécutions totales",
        description: "Nombre total d'exécutions du pulse",
      },
    },
    examples: {
      basic: {
        title: "Requête de statut simple",
      },
      success: {
        title: "Réponse de statut réussie",
      },
    },
    errors: {
      unauthorized: {
        title: "Non autorisé",
        description: "Authentification requise",
      },
      internal: {
        title: "Erreur interne",
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
      unsaved: {
        title: "Modifications non enregistrées",
        description: "Certaines modifications ne sont pas enregistrées",
      },
      validation: {
        title: "Erreur de validation",
        description: "Paramètres de requête invalides",
      },
    },
    success: {
      title: "Succès",
      description: "Opération terminée avec succès",
    },
  },
};
