import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Gestion des tâches",

  description: "Exécute les tâches d'arrière-plan et gère les tâches annexes",
  common: {
    taskName: "Nom de la tâche",
    taskNamesDescription: "Noms des tâches à filtrer",
    detailed: "Détaillé",
    detailedDescription: "Inclure les informations détaillées",
    active: "Actif",
    total: "Total",
    uptime: "Disponibilité",
    id: "ID",
    status: "Statut",
    lastRun: "Dernière exécution",
    nextRun: "Prochaine exécution",
    schedule: "Planification",
  },
  post: {
    title: "Exécuteur de tâches unifié",
    titleShort: "Exécuteur de tâches",
    description:
      "Gérer l'exécuteur de tâches unifié pour les tâches d'arrière-plan et les tâches annexes",
    container: {
      title: "Gestion de l'exécuteur de tâches unifié",
      description:
        "Piloter l'exécuteur de tâches unifié qui gère les tâches d'arrière-plan et les tâches annexes",
    },
    fields: {
      action: {
        label: "Action",
        description: "Action à effectuer sur l'exécuteur de tâches",
        options: {
          start: "Démarrer l'exécuteur",
          stop: "Arrêter l'exécuteur",
          status: "Obtenir le statut",
          restart: "Redémarrer l'exécuteur",
        },
      },
      taskFilter: {
        label: "Filtre de tâches",
        description: "Filtrer les tâches par type",
        options: {
          all: "Toutes les tâches",
          cron: "Tâches cron uniquement",
          side: "Tâches annexes uniquement",
        },
      },
      dryRun: {
        label: "Simulation",
        description: "Simuler l'exécution sans appliquer de modifications",
      },
    },
    response: {
      success: "Opération réussie",
      actionResult: "Résultat de l'action",
      message: "Message de réponse",
      timestamp: "Horodatage",
    },
    reasons: {
      previousInstanceRunning: "L'instance précédente est toujours en cours",
    },
    messages: {
      taskSkipped: "La tâche a été ignorée",
      taskCompleted: "Tâche terminée avec succès",
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
      execution: {
        title: "Erreur d'exécution de la tâche",
        description: "Impossible d'exécuter la tâche",
      },
      taskAlreadyRunning: {
        title: "Tâche déjà en cours",
        description: "La tâche indiquée est déjà en cours d'exécution",
      },
      sideTaskExecution: {
        title: "Erreur d'exécution de la tâche annexe",
        description: "Impossible d'exécuter la tâche annexe",
      },
    },
    success: {
      title: "Succès",
      description: "Opération terminée avec succès",
    },
  },
};
