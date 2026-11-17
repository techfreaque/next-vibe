import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Chat",
  tags: {
    messages: "Messages",
  },
  config: {
    folders: {
      private: "Chats privés",
      shared: "Chats partagés",
      public: "Chats publics",
      incognito: "Chats incognito",
      background: "Fils en arrière-plan",
      remote: "Chats distants",
    },
  },
  get: {
    title: "Récupérer le chemin de conversation",
    titleShort: "Chemin des messages",
    description:
      "Récupérer les messages qui suivent un chemin de conversation précis",
    container: {
      title: "Chemin de conversation",
      description: "Messages de la branche de conversation sélectionnée",
    },
    threadId: {
      label: "ID du fil",
      description: "ID du fil dont récupérer le chemin",
    },
    rootFolderId: {
      label: "Dossier racine",
      description: "Dossier racine du fil (utilisé pour le routage client)",
    },
    leafMessageId: {
      label: "ID du message feuille",
      description:
        "ID du message feuille (le plus profond) dont afficher le chemin. Laissez vide pour le plus récent.",
    },
    before: {
      label: "ID du message de départ",
      description:
        "Charger la portion d'historique précédant ce message (pagination par curseur)",
    },
    response: {
      title: "Messages du chemin",
      description: "Messages du chemin de conversation",
      messages: {
        message: {
          title: "Message",
          id: {
            content: "ID du message",
          },
          threadId: {
            content: "ID du fil",
          },
          role: {
            content: "Rôle",
          },
          content: {
            content: "Contenu",
          },
          parentId: {
            content: "ID du message parent",
          },
          sequenceId: {
            content: "ID de séquence",
          },
          authorId: {
            content: "ID de l'auteur",
          },
          authorName: {
            content: "Nom de l'auteur",
          },
          isAI: {
            content: "IA",
          },
          model: {
            content: "Modèle",
          },
          skill: {
            content: "Compétence",
          },
          errorType: {
            content: "Type d'erreur",
          },
          errorMessage: {
            content: "Message d'erreur",
          },
          errorCode: {
            content: "Code d'erreur",
          },
          metadata: {
            content: "Métadonnées",
          },
          upvotes: {
            content: "Votes positifs",
          },
          downvotes: {
            content: "Votes négatifs",
          },
          searchVector: {
            content: "Vecteur de recherche",
          },
          createdAt: {
            content: "Créé le",
          },
          updatedAt: {
            content: "Mis à jour le",
          },
        },
      },
      hasOlderHistory: {
        content: "Historique plus ancien disponible",
      },
      hasNewerMessages: {
        content: "Messages plus récents disponibles",
      },
      resolvedLeafMessageId: {
        content: "ID du message feuille résolu",
      },
      oldestLoadedMessageId: {
        content: "ID du plus ancien message chargé",
      },
      compactionBoundaryId: {
        content: "ID de la limite de compactage",
      },
      newerChunkAnchorId: {
        content: "ID d'ancrage de la portion plus récente",
      },
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Paramètres de requête invalides",
      },
      network: {
        title: "Erreur réseau",
        description: "Impossible de se connecter au serveur",
      },
      unauthorized: {
        title: "Non autorisé",
        description:
          "Vous devez être connecté pour voir les chemins de conversation",
      },
      forbidden: {
        title: "Accès refusé",
        description:
          "Vous n'avez pas l'autorisation de voir ce chemin de conversation",
      },
      notFound: {
        title: "Introuvable",
        description: "Fil introuvable",
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
        description: "Un conflit s'est produit",
      },
      threadNotFound: {
        title: "Fil introuvable",
        description: "Le fil indiqué n'existe pas",
      },
      noRootMessage: {
        title: "Aucun message racine",
        description: "Le fil n'a pas de message racine",
      },
      getFailed: {
        title: "Échec de la récupération",
        description: "Impossible de récupérer le chemin de conversation",
      },
    },
    success: {
      title: "Succès",
      description: "Chemin de conversation récupéré",
    },
  },
};
