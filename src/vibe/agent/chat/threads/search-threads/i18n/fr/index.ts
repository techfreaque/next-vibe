import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Chat",
  enums: {
    threadStatus: {
      active: "Actif",
      archived: "Archivé",
      deleted: "Supprimé",
    },
  },
  tags: {
    threads: "Fils de discussion",
  },
  search: {
    get: {
      title: "Rechercher des fils",
      titleShort: "Rechercher des fils",
      description:
        "Rechercher dans les titres, aperçus et prompts système des fils grâce à la recherche plein texte",
      container: {
        title: "Recherche de fils",
        description: "Recherchez des fils, classés par pertinence",
      },
      query: {
        label: "Requête de recherche",
        description:
          "Saisissez vos termes. Prend en charge les expressions entre guillemets et les opérateurs AND/OR",
        placeholder: "Rechercher des fils...",
      },
      sections: {
        pagination: {
          title: "Pagination",
          description: "Gérer la pagination des résultats",
        },
      },
      page: {
        label: "Page",
        description: "Numéro de page (à partir de 1)",
      },
      limit: {
        label: "Résultats par page",
        description: "Nombre de résultats par page (1-100)",
      },
      sortBy: {
        label: "Trier par",
        description: "Trier les résultats par pertinence ou par date",
        options: {
          relevance: "Pertinence",
          date: "Date (plus récents d'abord)",
        },
      },
      includeArchived: {
        label: "Inclure les archivés",
        description: "Inclure les fils archivés dans les résultats",
      },
      response: {
        results: {
          title: "Résultats de recherche",
          description: "Fils correspondant à votre recherche",
          thread: {
            id: {
              label: "ID du fil",
            },
            title: {
              label: "Titre",
            },
            preview: {
              label: "Aperçu",
            },
            rank: {
              label: "Score de pertinence",
              description:
                "Plus le score est élevé, meilleure est la correspondance",
            },
            headline: {
              label: "Extrait",
              description: "Extrait mettant en évidence les termes trouvés",
            },
            status: {
              label: "Statut",
            },
            createdAt: {
              label: "Créé le",
            },
            updatedAt: {
              label: "Mis à jour le",
            },
          },
        },
        totalResults: {
          label: "Nombre de résultats",
          description: "Nombre total de fils correspondant à la recherche",
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
          description: "Vous devez être connecté pour rechercher des fils",
        },
        forbidden: {
          title: "Accès refusé",
          description: "Vous n'avez pas l'autorisation de rechercher des fils",
        },
        notFound: {
          title: "Introuvable",
          description: "Aucun fil trouvé",
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
        description: "Recherche terminée",
      },
    },
  },
};
