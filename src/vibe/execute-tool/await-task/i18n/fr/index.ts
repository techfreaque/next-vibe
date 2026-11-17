import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    awaitTask: "Attendre une tâche",
  },
  post: {
    title: "Attendre une tâche",
    titleShort: "Attendre une tâche",
    description:
      "Attendre une tâche lancée en arrière-plan. Renvoie immédiatement si elle est déjà terminée, sinon met le flux IA en pause jusqu'à la fin de la tâche.",
    fields: {
      taskId: {
        label: "ID de la tâche",
        description:
          "L'ID de tâche renvoyé par execute-tool (mode detach ou wakeUp).",
      },
      status: {
        title: "Statut",
        description: "Statut actuel de la tâche.",
      },
      result: {
        title: "Résultat",
        description: "Sortie de l'outil (présente une fois la tâche terminée).",
      },
      waiting: {
        title: "En attente",
        description: "True quand le flux est en pause en attendant la tâche.",
      },
      originalToolName: {
        title: "Outil",
        description: "L'outil qui a été lancé.",
      },
      originalArgs: {
        title: "Arguments",
        description: "Les arguments d'entrée de l'outil lancé.",
      },
    },
    dynamicTitle: "Attente : {{toolName}}",
    widget: {
      noToolName: "Aucun nom d'outil disponible.",
      resolving: "Résolution de l'outil...",
      unknownTool: "Outil inconnu : {{toolName}}",
    },
    status: {
      waiting: "En attente",
      complete: "Terminé",
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "taskId invalide",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Authentification requise",
      },
      internal: {
        title: "Erreur interne",
        description: "Impossible d'enregistrer l'attente sur la tâche",
      },
      forbidden: {
        title: "Accès refusé",
        description: "Vous n'avez pas la permission d'attendre cette tâche",
      },
      notFound: {
        title: "Introuvable",
        description: "Tâche introuvable",
      },
      network: {
        title: "Erreur réseau",
        description: "Une erreur réseau est survenue",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inconnue est survenue",
      },
      unsaved: {
        title: "Modifications non enregistrées",
        description: "Des modifications ne sont pas enregistrées",
      },
      conflict: {
        title: "Conflit",
        description: "Conflit d'état de la tâche",
      },
    },
    success: {
      title: "Terminé",
      description: "Tâche terminée",
    },
  },
};
