import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Endpoint API",
  tags: {
    tasks: "Tâches",
    cron: "Cron",
    bulk: "Lot",
  },
  post: {
    title: "Action groupée sur les tâches",
    titleShort: "Tâches en lot",
    description:
      "Applique une action groupée (supprimer, activer, désactiver, exécuter) à plusieurs tâches cron",
    fields: {
      ids: {
        label: "ID des tâches",
        description: "Liste des ID de tâches concernées",
      },
      action: {
        label: "Action",
        description: "Action à appliquer aux tâches sélectionnées",
        options: {
          delete: "Supprimer",
          enable: "Activer",
          disable: "Désactiver",
          run: "Exécuter maintenant",
        },
      },
      succeeded: {
        label: "Réussies",
        description: "Nombre de tâches traitées avec succès",
      },
      failed: {
        label: "Échouées",
        description: "Nombre de tâches dont le traitement a échoué",
      },
      errors: {
        label: "Erreurs",
        description: "Liste des erreurs par tâche",
      },
    },
    errors: {
      fetchFailed:
        "Impossible de récupérer les ID des tâches pour l'action groupée",
      validation: {
        title: "Échec de la validation",
        description: "Les données de l'action groupée sont invalides",
      },
      unauthorized: {
        title: "Non autorisé",
        description:
          "Vous n'avez pas l'autorisation d'effectuer des actions groupées",
      },
      internal: {
        title: "Erreur interne",
        description: "Une erreur est survenue pendant l'action groupée",
      },
      forbidden: {
        title: "Interdit",
        description: "L'accès à cette ressource est interdit",
      },
      conflict: {
        title: "Conflit",
        description: "Un conflit est survenu pendant l'action groupée",
      },
      network: {
        title: "Erreur réseau",
        description: "Une erreur réseau est survenue",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inconnue est survenue",
      },
      notFound: {
        title: "Introuvable",
        description: "Une ou plusieurs tâches sont introuvables",
      },
      unsaved: {
        title: "Modifications non enregistrées",
        description: "Certaines modifications ne sont pas enregistrées",
      },
    },
    success: {
      completed: {
        title: "Action groupée terminée",
        description:
          "L'action groupée a été appliquée aux tâches sélectionnées",
      },
    },
  },
};
