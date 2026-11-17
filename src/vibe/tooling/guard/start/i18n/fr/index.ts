import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Démarrer le guard",
  titleShort: "Démarrer le guard",
  description: "Démarrer les environnements guard des projets VSCode",
  tag: "Démarrer",
  category: "Guard",
  container: {
    title: "Configuration du démarrage",
    description: "Paramètres de démarrage du guard",
  },
  fields: {
    projectPath: {
      title: "Chemin du projet",
      description: "Chemin du projet VSCode",
      placeholder: "/home/user/projects/my-project",
    },
    guardId: {
      title: "ID du guard",
      description: "Identifiant unique de l'environnement guard",
      placeholder: "guard_my_project_abc123",
    },
    startAll: {
      title: "Démarrer tous les guards",
      description: "Démarrer tous les environnements guard disponibles",
    },
    totalStarted: {
      title: "Total démarrés",
    },
    output: {
      title: "Sortie",
    },
    startedGuards: {
      columns: {
        username: "Nom d'utilisateur",
        projectPath: "Chemin du projet",
      },
    },
    summary: {
      title: "Résumé",
    },
    status: {
      title: "Statut",
    },
    hasIssues: {
      title: "Problèmes détectés",
    },
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
    notFound: {
      title: "Introuvable",
      description: "Environnement guard introuvable",
    },
    conflict: {
      title: "Conflit",
      description: "Environnement guard déjà démarré",
    },
    jailSetupFailed:
      "Échec de la configuration de la jail du guard : {{detail}}",
    vscodeSetupFailed:
      "Échec de la configuration de l'intégration VSCode : {{detail}}",
    startFailed: "Erreur interne au démarrage du guard : {{detail}}",
    guardIdLookupUnsupported:
      "La recherche par ID de guard n'est pas encore implémentée. Utilisez plutôt le chemin du projet.",
    notAVscodeProject:
      "Le guard exige un projet VSCode : aucun répertoire .vscode dans {{projectPath}}",
  },
  success: {
    title: "Succès",
    description: "Guard démarré",
  },
};
