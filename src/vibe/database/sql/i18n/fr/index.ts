import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Opérations de base de données",

  tag: "sql",
  post: {
    title: "Exécuter du SQL",
    titleShort: "Lancer SQL",
    description: "Exécuter des requêtes SQL sur la base de données",
    form: {
      title: "Configuration de la requête SQL",
      description: "Configurer les paramètres de la requête SQL",
    },
    response: {
      title: "Réponse de la requête",
      description: "Résultats de l'exécution de la requête SQL",
    },
    errors: {
      unauthorized: {
        title: "Non autorisé",
        description: "Authentification requise pour exécuter du SQL",
      },
      validation: {
        title: "Erreur de validation",
        description: "Requête SQL ou paramètres invalides",
      },
      server: {
        title: "Erreur serveur",
        description: "Erreur interne du serveur pendant l'exécution SQL",
      },
      internal: {
        title: "Erreur interne",
        description: "L'exécution de la requête SQL a échoué",
      },
      database: {
        title: "Erreur de base de données",
        description:
          "Erreur de base de données pendant l'exécution de la requête",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inconnue est survenue pendant l'exécution SQL",
      },
      network: {
        title: "Erreur réseau",
        description: "Erreur réseau pendant l'exécution SQL",
      },
      forbidden: {
        title: "Accès refusé",
        description: "Permissions insuffisantes pour exécuter du SQL",
      },
      notFound: {
        title: "Introuvable",
        description: "Ressources SQL introuvables",
      },
      conflict: {
        title: "Conflit",
        description: "Conflit SQL détecté",
      },
    },
    success: {
      title: "Requête exécutée",
      description: "Requête SQL exécutée avec succès",
    },
  },
  fields: {
    query: {
      title: "Requête SQL",
      description: "La requête SQL à exécuter",
    },
    queryFile: {
      title: "Chemin du fichier de requête",
      description: "Chemin d'un fichier SQL à exécuter",
      placeholder: "/path/to/query.sql",
    },
    dryRun: {
      title: "Simulation",
      description: "Prévisualiser la requête sans l'exécuter",
    },
    verbose: {
      title: "Sortie détaillée",
      description: "Afficher des informations détaillées sur la requête",
    },
    limit: {
      title: "Limite de lignes",
      description: "Nombre maximal de lignes à renvoyer (1-1000)",
    },
    success: {
      title: "Statut de réussite",
    },
    output: {
      title: "Sortie",
    },
    results: {
      title: "Résultats de la requête",
    },
    rowCount: {
      title: "Nombre de lignes",
    },
    queryType: {
      title: "Type de requête",
    },
  },
};
