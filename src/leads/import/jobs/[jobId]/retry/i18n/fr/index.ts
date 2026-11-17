import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Import de données",
  tags: {
    leads: "Leads",
    management: "Gestion",
  },

  post: {
    title: "Relancer la tâche d'import",
    titleShort: "Relancer l'import",
    description: "Relancer une tâche d'import échouée",
    jobId: {
      label: "ID de la tâche",
      description: "Identifiant unique de la tâche d'import à relancer",
    },
    form: {
      title: "Relancer la tâche d'import",
      description: "Relancer la tâche d'import échouée",
    },
    response: {
      title: "Résultat de la relance",
      description: "Résultat de l'opération de relance",
      success: {
        content: "Statut de réussite",
      },
      message: {
        content: "Message de relance",
      },
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "L'ID de tâche fourni est invalide",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Authentification requise pour relancer des tâches",
      },
      forbidden: {
        title: "Accès refusé",
        description: "Vous n'avez pas l'autorisation de relancer cette tâche",
      },
      notFound: {
        title: "Tâche introuvable",
        description: "Aucune tâche d'import trouvée avec cet ID",
      },
      server: {
        title: "Erreur serveur",
        description: "Une erreur s'est produite lors de la relance de la tâche",
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
        title: "Conflit de relance",
        description: "Impossible de relancer une tâche en cours de traitement",
      },
    },
    success: {
      title: "Succès",
      description: "Tâche d'import relancée",
    },
  },
  widget: {
    title: "Relancer la tâche d'import",
    successMessage: "Relance de la tâche lancée",
  },
};
