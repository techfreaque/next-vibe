import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Système",
  tags: {
    remoteSync: "Synchronisation distante",
  },
  taskReport: {
    post: {
      title: "Rapport de tâche",
      titleShort: "Rapport",
      description:
        "Recevoir les résultats d'exécution de tâches provenant d'instances distantes.",
      taskId: {
        label: "ID de la tâche",
        description: "ID de la tâche concernée par le rapport",
      },
      executionId: {
        label: "ID d'exécution",
        description: "ID de l'exécution concernée",
      },
      status: {
        label: "Statut",
        description: "Statut final de l'exécution de la tâche",
      },
      durationMs: {
        label: "Durée (ms)",
        description: "Durée d'exécution en millisecondes",
      },
      summary: {
        label: "Résumé",
        description: "Résumé lisible du résultat de l'exécution",
      },
      error: {
        label: "Erreur",
        description: "Message d'erreur si l'exécution a échoué",
      },
      serverTimezone: {
        label: "Fuseau horaire du serveur",
        description: "Fuseau horaire du serveur d'exécution",
      },
      executedByInstance: {
        label: "Exécutée par",
        description: "ID de l'instance qui a exécuté la tâche",
      },
      output: {
        label: "Sortie",
        description: "Données de sortie structurées de la tâche",
      },
      startedAt: {
        label: "Démarrée le",
        description: "Horodatage ISO du début de l'exécution",
      },
      wakeUpContext: {
        label: "Contexte de reprise",
        description:
          "Contexte de reprise du fil renvoyé depuis la requête de lancement : permet à l'appelant de reprendre sans enregistrement local de la tâche",
      },
      processed: {
        label: "Traité",
        description: "Indique si le rapport a été accepté",
      },
      errors: {
        validation: {
          title: "Erreur de validation",
          description: "Contenu du rapport invalide",
        },
        unauthorized: {
          title: "Non autorisé",
          description: "Authentification requise",
        },
        internal: {
          title: "Erreur de traitement",
          description: "Une erreur est survenue lors du traitement du rapport",
        },
        forbidden: {
          title: "Accès refusé",
          description: "Vous n'avez pas la permission d'envoyer des rapports",
        },
        notFound: {
          title: "Introuvable",
          description: "Tâche introuvable",
        },
        network: {
          title: "Erreur réseau",
          description: "Impossible de joindre l'endpoint de rapport",
        },
        unknown: {
          title: "Erreur inconnue",
          description: "Une erreur inattendue est survenue",
        },
        unsaved: {
          title: "Modifications non enregistrées",
          description: "Des modifications ne sont pas enregistrées",
        },
        conflict: {
          title: "Conflit",
          description: "Conflit de rapport détecté",
        },
      },
      success: {
        title: "Rapport accepté",
        description: "Rapport de tâche traité avec succès",
      },
    },
  },
};
