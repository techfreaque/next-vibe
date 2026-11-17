import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Exécution des tâches",
  tags: {
    execute: "Exécution",
  },
  errors: {
    executeTask: "Impossible d'exécuter la tâche",
    forbidden: "Vous n'avez pas l'autorisation d'exécuter cette tâche",
    alreadyRunning: "La tâche est déjà en cours d'exécution",
    notFound: "Tâche {{taskId}} introuvable",
  },
  post: {
    title: "Exécuter une tâche",
    titleShort: "Exécuter la tâche",
    description:
      "Déclenche une tâche par son ID et renvoie le résultat de façon synchrone",
    container: {
      title: "Exécution de la tâche",
      description: "Exécuter une tâche précise et attendre son résultat",
    },
    fields: {
      taskId: {
        label: "ID de la tâche",
        description: "ID de la tâche à exécuter",
      },
      success: {
        title: "Succès",
      },
      message: {
        title: "Message",
      },
    },
    response: {
      taskId: "ID de la tâche",
      taskName: "Nom de la tâche",
      executedAt: "Exécutée le",
      duration: "Durée (ms)",
      status: "Statut",
      output: "Sortie",
    },
    errors: {
      unauthorized: {
        title: "Non autorisé",
        description: "Authentification requise",
      },
      internal: {
        title: "Erreur interne",
        description: "Une erreur interne du serveur est survenue",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inconnue est survenue",
      },
      network: {
        title: "Erreur réseau",
        description: "Une erreur réseau est survenue",
      },
      forbidden: {
        title: "Interdit",
        description: "Vous n'avez pas l'autorisation d'exécuter cette tâche",
      },
      notFound: {
        title: "Introuvable",
        description: "Tâche introuvable",
      },
      conflict: {
        title: "Conflit",
        description: "La tâche est déjà en cours d'exécution",
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
    submitButton: {
      label: "Exécuter la tâche",
      loadingText: "Exécution...",
    },
    success: {
      title: "Succès",
      description: "Tâche exécutée avec succès",
    },
  },
};
