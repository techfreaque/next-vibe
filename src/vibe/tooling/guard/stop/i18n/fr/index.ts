import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Guard système",

  title: "Arrêter le guard",
  titleShort: "Arrêter le guard",
  description: "Arrêter les environnements guard des projets VSCode",
  tag: "guard",

  container: {
    title: "Configuration de l'arrêt du guard",
    description: "Paramètres d'arrêt des environnements guard",
  },

  fields: {
    projectPath: {
      title: "Chemin du projet",
      description: "Chemin du répertoire du projet",
      placeholder: "/path/to/your/project",
    },
    guardId: {
      title: "ID du guard",
      description: "ID du guard à arrêter",
      placeholder: "guard_project_abc123",
    },
    username: {
      title: "Nom d'utilisateur",
    },
    wasRunning: {
      title: "Était en cours",
    },
    nowRunning: {
      title: "En cours maintenant",
    },
    pid: {
      title: "ID du processus",
    },
    forceStopped: {
      title: "Arrêt forcé",
    },
    stopAll: {
      title: "Arrêter tous les guards",
      description: "Arrêter tous les environnements guard en cours",
    },
    force: {
      title: "Forcer l'arrêt",
      description: "Forcer l'arrêt même si le guard ne répond pas",
    },
    success: {
      title: "Opération réussie",
    },
    output: {
      title: "Sortie de la commande",
    },
    stoppedGuards: {
      title: "Guards arrêtés",
    },
    totalStopped: {
      title: "Total arrêtés",
    },
  },

  errors: {
    validation: {
      title: "Erreur de validation",
      description: "Paramètres de requête invalides",
    },
    internal: {
      title: "Erreur interne",
      description: "Une erreur interne du serveur s'est produite",
    },
    unauthorized: {
      title: "Non autorisé",
      description: "Authentification requise",
    },
    forbidden: {
      title: "Interdit",
      description: "Accès interdit",
    },
    notFound: {
      title: "Introuvable",
      description: "Ressource introuvable",
    },
    conflict: {
      title: "Conflit",
      description: "Conflit de données",
    },
    missingTarget:
      "Erreur de validation : indiquez projectPath, guardId ou stopAll.",
    stopFailed: "Erreur interne à l'arrêt du guard : {{detail}}",
  },

  success: {
    title: "Succès",
    description: "Arrêt du guard terminé",
  },
};
