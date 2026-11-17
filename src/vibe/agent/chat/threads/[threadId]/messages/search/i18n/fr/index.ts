import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Chat",
  tags: {
    messages: "Messages",
  },
  search: {
    get: {
      title: "Rechercher des messages",
      titleShort: "Rechercher des messages",
      description:
        "Rechercher des messages dans un fil précis grâce à la recherche plein texte",
      container: {
        title: "Recherche de messages",
        description: "Recherchez des messages dans ce fil",
      },
      threadId: {
        label: "ID du fil",
        description: "ID du fil dans lequel chercher",
      },
      query: {
        label: "Requête de recherche",
        description: "Texte à rechercher dans les messages",
      },
      sections: {
        pagination: {
          title: "Pagination",
          description: "Paramètres de navigation entre les pages",
        },
      },
      page: {
        label: "Page",
        description: "Numéro de la page à récupérer",
      },
      limit: {
        label: "Limite",
        description: "Nombre de résultats par page",
      },
      response: {
        results: {
          message: {
            title: "Message",
            id: {
              content: "ID du message",
            },
            content: {
              content: "Contenu",
            },
            role: {
              content: "Rôle",
            },
            rank: {
              content: "Score de pertinence",
            },
            headline: {
              content: "Extrait",
            },
            createdAt: {
              content: "Créé le",
            },
          },
        },
        totalCount: {
          content: "Nombre de résultats",
        },
      },
      errors: {
        validationFailed: {
          title: "Échec de la validation",
          description: "Paramètres de recherche invalides",
        },
        network: {
          title: "Erreur réseau",
          description: "Impossible de se connecter au serveur",
        },
        unauthorized: {
          title: "Non autorisé",
          description: "Vous devez être connecté pour rechercher des messages",
        },
        forbidden: {
          title: "Accès refusé",
          description:
            "Vous n'avez pas l'autorisation de rechercher des messages dans ce fil",
        },
        notFound: {
          title: "Fil introuvable",
          description: "Le fil indiqué n'existe pas ou vous n'y avez pas accès",
        },
        serverError: {
          title: "Erreur serveur",
          description:
            "Une erreur interne du serveur s'est produite pendant la recherche",
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
      },
      success: {
        title: "Succès",
        description: "Recherche de messages terminée",
      },
    },
  },
};
