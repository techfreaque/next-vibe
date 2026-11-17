import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Import de données",
  tags: {
    leads: "Leads",
    management: "Gestion",
  },

  post: {
    title: "Arrêter la tâche d'import",
    titleShort: "Arrêter l'import",
    description: "Arrêter une tâche d'import en cours",
    jobId: {
      label: "ID de la tâche",
      description: "Identifiant unique de la tâche d'import à arrêter",
    },
    form: {
      title: "Arrêter la tâche d'import",
      description: "Arrêter la tâche d'import en cours",
    },
    response: {
      title: "Résultat de l'arrêt",
      description: "Résultat de l'opération d'arrêt",
      success: {
        content: "Statut de réussite",
      },
      message: {
        content: "Message d'arrêt",
      },
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "L'ID de tâche fourni est invalide",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Authentification requise pour arrêter des tâches",
      },
      forbidden: {
        title: "Accès refusé",
        description: "Vous n'avez pas l'autorisation d'arrêter cette tâche",
      },
      notFound: {
        title: "Tâche introuvable",
        description: "Aucune tâche d'import trouvée avec cet ID",
      },
      server: {
        title: "Erreur serveur",
        description: "Une erreur s'est produite lors de l'arrêt de la tâche",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inattendue s'est produite",
      },
      network: {
        title: "Erreur réseau",
        description: "Impossible de joindre le serveur",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Vous avez des modifications non enregistrées",
      },
      conflict: {
        title: "Conflit d'arrêt",
        description:
          "Impossible d'arrêter une tâche qui n'est pas en cours de traitement",
      },
    },
    success: {
      title: "Succès",
      description: "Tâche d'import arrêtée",
    },
  },
  widget: {
    title: "Arrêter la tâche d'import",
    successMessage: "Tâche arrêtée",
  },
};
