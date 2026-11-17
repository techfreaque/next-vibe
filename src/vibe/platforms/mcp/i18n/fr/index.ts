import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tools: {
    category: "Outils MCP",
    tags: {
      mcp: "MCP",
    },
    get: {
      title: "Lister les outils MCP",
      description:
        "Récupérer tous les outils MCP disponibles pour l'utilisateur actuel",
      fields: {
        name: "Nom de l'outil",
        description: "Description",
        inputSchema: "Schéma d'entrée",
      },
      response: {
        title: "Liste des outils MCP",
        description: "Liste des outils MCP disponibles",
      },
      errors: {
        validation: {
          title: "Échec de la validation",
          description: "Paramètres de requête invalides",
        },
        network: {
          title: "Erreur réseau",
          description: "Impossible de se connecter au serveur",
        },
        unauthorized: {
          title: "Non autorisé",
          description: "Authentification requise",
        },
        forbidden: {
          title: "Accès refusé",
          description:
            "Vous n'avez pas la permission d'accéder à cette ressource",
        },
        notFound: {
          title: "Introuvable",
          description: "Ressource introuvable",
        },
        server: {
          title: "Erreur serveur",
          description: "Une erreur interne du serveur s'est produite",
        },
        unknown: {
          title: "Erreur inconnue",
          description: "Une erreur inattendue s'est produite",
        },
        unsavedChanges: {
          title: "Modifications non enregistrées",
          description: "Vous avez des modifications non enregistrées",
        },
        conflict: {
          title: "Conflit",
          description: "Conflit de ressource détecté",
        },
      },
      success: {
        title: "Succès",
        description: "Outils récupérés",
      },
    },
  },
  execute: {
    category: "Exécution MCP",
    tags: {
      mcp: "MCP",
    },
    post: {
      title: "Exécuter un outil MCP",
      titleShort: "Serveur MCP",
      description: "Exécuter un outil MCP par son nom avec des arguments",
      fields: {
        title: "Paramètres d'exécution de l'outil",
        description: "Paramètres pour l'exécution de l'outil",
        name: {
          title: "Nom de l'outil",
          description: "Nom de l'outil à exécuter (ex. core:system:db:ping)",
          placeholder: "core:system:db:ping",
        },
        arguments: {
          title: "Arguments",
          description: "Arguments de l'outil sous forme de paires clé-valeur",
          placeholder: "{}",
        },
      },
      response: {
        title: "Résultat de l'exécution",
        description: "Résultat de l'exécution de l'outil",
        result: {
          content: {
            type: "Type de contenu",
            text: "Contenu",
          },
          isError: "Est une erreur",
        },
      },
      errors: {
        validation: {
          title: "Échec de la validation",
          description: "Nom d'outil ou arguments invalides",
        },
        network: {
          title: "Erreur réseau",
          description: "Impossible de se connecter au serveur",
        },
        unauthorized: {
          title: "Non autorisé",
          description: "Authentification requise",
        },
        forbidden: {
          title: "Accès refusé",
          description: "Vous n'avez pas la permission d'exécuter cet outil",
        },
        notFound: {
          title: "Outil introuvable",
          description: "L'outil indiqué n'existe pas",
        },
        server: {
          title: "Erreur serveur",
          description: "Échec de l'exécution de l'outil",
        },
        unknown: {
          title: "Erreur inconnue",
          description: "Une erreur inattendue s'est produite",
        },
        unsavedChanges: {
          title: "Modifications non enregistrées",
          description: "Vous avez des modifications non enregistrées",
        },
        conflict: {
          title: "Conflit",
          description: "Conflit de ressource détecté",
        },
      },
      success: {
        title: "Succès",
        description: "Outil exécuté",
      },
    },
  },
  serve: {
    category: "Serveur MCP",
    tags: {
      mcp: "MCP",
    },
    post: {
      title: "Démarrer le serveur MCP",
      titleShort: "Serveur MCP",
      description: "Démarrer le serveur Model Context Protocol",
      response: {
        title: "Statut du serveur MCP",
        description: "État du serveur MCP",
      },
      errors: {
        validation: {
          title: "Échec de la validation",
          description: "Paramètres de requête invalides",
        },
        server: {
          title: "Erreur serveur",
          description: "Impossible de démarrer le serveur MCP",
        },
        unauthorized: {
          title: "Non autorisé",
          description: "Authentification requise",
        },
      },
      success: {
        title: "Succès",
        description: "Serveur MCP démarré",
      },
    },
  },
  registry: {
    toolNotFound: "Outil introuvable",
    endpointNotFound: "Endpoint introuvable",
    permissionDenied: "Permission refusée",
    toolExecutionFailed: "Échec de l'exécution de l'outil",
  },
};
