import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Guard système",

  title: "Détruire le guard",
  titleShort: "Détruire le guard",
  description: "Détruire les environnements guard et nettoyer les ressources",
  tag: "gestion-guard",
  container: {
    title: "Configuration de destruction du guard",
    description: "Paramètres de destruction des environnements guard",
  },
  fields: {
    projectPath: {
      title: "Chemin du projet",
      description: "Chemin du répertoire du projet",
      placeholder: "/home/user/projects/my-project",
    },
    guardId: {
      title: "ID du guard",
      description: "Identifiant unique du guard",
      placeholder: "guard_my_project_abc123",
    },
    force: {
      title: "Forcer la destruction",
      description: "Forcer la destruction même si le guard tourne",
    },
    cleanupFiles: {
      title: "Nettoyer les fichiers",
      description: "Supprimer tous les fichiers liés au guard",
    },
    dryRun: {
      title: "Simulation",
      description:
        "Afficher ce qui serait détruit sans rien détruire réellement",
    },
    success: {
      title: "Succès",
    },
    output: {
      title: "Sortie",
    },
    destroyedGuards: {
      title: "Guards détruits",
    },
    warnings: {
      title: "Avertissements",
    },
    totalDestroyed: {
      title: "Total détruits",
    },
    username: {
      title: "Nom d'utilisateur",
    },
    wasRunning: {
      title: "Était en cours",
    },
    filesRemoved: {
      title: "Fichiers supprimés",
    },
    userRemoved: {
      title: "Utilisateur supprimé",
    },
  },
  form: {
    title: "Configuration de destruction",
    description: "Paramètres de destruction",
  },
  response: {
    title: "Réponse",
    description: "Données de réponse de la destruction",
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
    server: {
      title: "Erreur serveur",
      description: "Une erreur interne du serveur s'est produite",
    },
    internal: {
      title: "Erreur interne",
      description: "Une erreur interne s'est produite",
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
    destruction_failed: {
      title: "Échec de la destruction du guard : {{error}}",
      description: "Impossible de détruire l'environnement guard",
    },
    guard_not_found: {
      title: "Aucun guard trouvé pour le projet '{{project}}'",
      description: "Aucun environnement guard trouvé pour ce projet",
    },
  },
  success: {
    title: "Succès",
    description: "Opération terminée",
  },
};
