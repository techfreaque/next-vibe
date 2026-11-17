import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Chat",
  tags: {
    messages: "Messages",
  },
  search: {
    get: {
      title: "Recherche globale de messages",
      titleShort: "Rechercher des messages",
      description:
        "Rechercher des messages dans tous les fils grâce à la recherche plein texte",
      container: {
        title: "Recherche globale de messages",
        description: "Recherchez des messages dans tous vos fils",
      },
      query: {
        label: "Requête de recherche",
        description: "Texte à rechercher dans les messages",
      },
      sections: {
        filters: {
          title: "Filtres",
          description: "Filtres facultatifs pour affiner les résultats",
        },
        pagination: {
          title: "Pagination",
          description: "Paramètres de navigation entre les pages",
        },
      },
      rootFolderId: {
        label: "Dossier racine",
        description:
          "Limiter la recherche à un type de dossier racine (private, shared, public, background)",
      },
      role: {
        label: "Rôle du message",
        description:
          "Filtrer par rôle du message (user, assistant, system, tool, error)",
      },
      startDate: {
        label: "Date de début",
        description: "Inclure uniquement les messages créés après cette date",
      },
      endDate: {
        label: "Date de fin",
        description: "Inclure uniquement les messages créés avant cette date",
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
            title: "Résultat",
            messageId: {
              content: "ID du message",
            },
            threadId: {
              content: "ID du fil",
            },
            threadTitle: {
              content: "Titre du fil",
            },
            role: {
              content: "Rôle",
            },
            headline: {
              content: "Extrait",
            },
            createdAt: {
              content: "Créé le",
            },
            rootFolderId: {
              content: "Dossier racine",
            },
          },
        },
        total: {
          content: "Nombre de résultats",
        },
        page: {
          content: "Page actuelle",
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
            "Vous n'avez pas l'autorisation d'effectuer cette recherche",
        },
        notFound: {
          title: "Introuvable",
          description: "Aucun résultat ne correspond à votre requête",
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
        description: "Recherche globale de messages terminée",
      },
    },
  },
};
