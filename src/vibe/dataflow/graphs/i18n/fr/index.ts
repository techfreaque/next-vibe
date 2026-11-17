import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Vibe Sense",
  tags: {
    vibeSense: "vibe-sense",
  },

  list: {
    title: "Graphes de pipeline",
    titleShort: "Graphes",
    description: "Lister tous les graphes visibles par l'utilisateur actuel",
    fields: {
      search: {
        label: "Recherche",
        description: "Filtrer les graphes par nom ou slug",
        placeholder: "Rechercher des graphes...",
      },
    },
    container: {
      title: "Graphes",
      description: "Tous les graphes de pipeline",
    },
    response: {
      graphs: "Graphes",
      graph: {
        id: "ID",
        slug: "Slug",
        name: "Nom",
        description: "Description",
        ownerType: "Type de propriétaire",
        ownerId: "ID du propriétaire",
        isActive: "Actif",
        createdAt: "Créé le",
      },
    },
    success: {
      title: "Graphes chargés",
      description: "Graphes de pipeline récupérés avec succès",
    },
    errors: {
      unauthorized: {
        title: "Non autorisé",
        description: "Authentification requise pour lister les graphes",
      },
      forbidden: {
        title: "Accès refusé",
        description: "Accès administrateur requis",
      },
      server: {
        title: "Erreur serveur",
        description: "Impossible de charger les graphes",
      },
      unknown: {
        title: "Erreur inconnue",
        description:
          "Une erreur inattendue est survenue lors du chargement des graphes",
      },
      validation: {
        title: "Échec de la validation",
        description: "Paramètres de requête invalides",
      },
      notFound: {
        title: "Introuvable",
        description: "Aucun graphe trouvé",
      },
      conflict: {
        title: "Conflit",
        description: "Conflit de ressources",
      },
      network: {
        title: "Erreur réseau",
        description:
          "La requête réseau a échoué lors du chargement des graphes",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Enregistrez les modifications avant de continuer",
      },
    },
  },

  widget: {
    refresh: "Actualiser",
    createGraph: "Nouveau graphe",
    active: "Actif",
    inactive: "Inactif",
    empty:
      "Aucun graphe pour l'instant. Créez votre premier graphe de pipeline.",
    error: "Impossible de charger les graphes. Veuillez réessayer.",
    archive: "Archiver",
    delete: "Supprimer",
    searchPlaceholder: "Rechercher par nom, slug ou description…",
    noMatchTitle: "Aucun graphe correspondant",
    noMatchHint: "Essayez un autre terme de recherche",
    clearSearch: "Effacer la recherche",
    searchResults: "résultats pour",
    stats: {
      total: "Total des graphes",
      active: "Actifs",
      system: "Système",
      admin: "Admin",
    },
  },

  create: {
    title: "Créer un graphe",
    description: "Créer un nouveau graphe de pipeline",
    fields: {
      name: {
        label: "Nom",
        description: "Nom d'affichage du graphe",
        placeholder: "Mon graphe",
      },
      slug: {
        label: "Slug",
        description: "Identifiant unique (minuscules et tirets uniquement)",
        placeholder: "mon-graphe",
      },
      description: {
        label: "Description",
        description: "Description facultative",
        placeholder: "",
      },
      config: {
        label: "Configuration",
        description: "Configuration DAG du graphe",
      },
    },
    response: {
      id: "ID du graphe",
    },
    success: {
      title: "Graphe créé",
      description: "Graphe de pipeline créé avec succès",
    },
    errors: {
      unauthorized: {
        title: "Non autorisé",
        description: "Authentification requise pour créer des graphes",
      },
      forbidden: {
        title: "Accès refusé",
        description: "Accès administrateur requis",
      },
      server: {
        title: "Erreur serveur",
        description: "Impossible de créer le graphe",
      },
      unknown: {
        title: "Erreur inconnue",
        description:
          "Une erreur inattendue est survenue lors de la création du graphe",
      },
      validation: {
        title: "Échec de la validation",
        description: "Configuration du graphe invalide",
      },
      notFound: {
        title: "Introuvable",
        description: "Ressource introuvable",
      },
      conflict: {
        title: "Conflit",
        description: "Ce slug de graphe existe déjà",
      },
      network: {
        title: "Erreur réseau",
        description: "La requête réseau a échoué lors de la création du graphe",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Enregistrez les modifications avant de continuer",
      },
    },
  },
};
