import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Guard",
  post: {
    title: "Statut du guard",
    titleShort: "Statut du guard",
    description: "Vérifier le statut des environnements guard",
    tag: "Statut",
    container: {
      title: "Configuration du statut du guard",
      description: "Paramètres de vérification du statut",
    },
    fields: {
      projectPath: {
        title: "Chemin du projet",
        description: "Chemin du projet guard",
        placeholder: "/path/to/project",
      },
      guardId: {
        title: "ID du guard",
        description: "Identifiant unique du guard",
        placeholder: "guard-123",
      },
      username: {
        title: "Nom d'utilisateur",
      },
      status: {
        title: "Statut",
      },
      createdAt: {
        title: "Créé le",
      },
      securityLevel: {
        title: "Niveau de sécurité",
      },
      isolationMethod: {
        title: "Méthode d'isolation",
      },
      isRunning: {
        title: "En cours",
      },
      userHome: {
        title: "Répertoire personnel",
      },
      listAll: {
        title: "Lister tous les guards",
        description: "Lister tous les environnements guard",
      },
      success: {
        title: "Succès",
      },
      output: {
        title: "Sortie",
      },
      guards: {
        title: "Guards",
      },
      totalGuards: {
        title: "Total des guards",
      },
      activeGuards: {
        title: "Guards actifs",
      },
    },
    form: {
      title: "Configuration du statut",
      description: "Paramètres du statut",
    },
    response: {
      title: "Réponse",
      description: "Données de réponse du statut",
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
      internal: {
        title: "Erreur interne",
        description: "Une erreur interne du serveur s'est produite",
      },
      statusFailed:
        "Erreur interne lors de la vérification du statut du guard : {{detail}}",
    },
    success: {
      title: "Succès",
      description: "Opération terminée",
    },
  },
};
