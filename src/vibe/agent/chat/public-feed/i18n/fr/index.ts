import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    publicFeed: "Fil public",
  },
  get: {
    title: "Fil de la communauté",
    titleShort: "Fil de la communauté",
    description: "Fils publics partagés avec la communauté",
    sortMode: {
      label: "Tri",
      description: "Comment trier le fil (populaires, récents, en hausse)",
    },
    page: {
      label: "Page",
      description: "Numéro de la page à récupérer",
    },
    limit: {
      label: "Limite",
      description: "Nombre de fils par page",
    },
    search: {
      label: "Recherche",
      description: "Rechercher des fils par titre",
    },
    feed: {
      empty: "Aucun fil public pour l'instant. Lancez-en un.",
      emptySearch: "Aucun résultat pour cette recherche.",
      justNow: "à l'instant",
      hoursAgo: "il y a {{count}} h",
      daysAgo: "il y a {{count}} j",
      messages: "{{count}} messages",
      participants: "{{count}} participants",
      score: "Score",
    },
    response: {
      title: "Réponse du fil",
      description: "Liste enrichie des fils publics",
      items: {
        item: {
          title: "Élément du fil",
          id: { content: "ID du fil" },
          threadTitle: { content: "Titre" },
          preview: { content: "Aperçu" },
          folderId: { content: "ID du dossier" },
          folderName: { content: "Catégorie" },
          authorId: { content: "ID de l'auteur" },
          authorName: { content: "Auteur" },
          messageCount: { content: "Messages" },
          authorCount: { content: "Participants" },
          upvotes: { content: "Votes positifs" },
          downvotes: { content: "Votes négatifs" },
          score: { content: "Score" },
          modelNames: { content: "Modèles utilisés" },
          streamingState: { content: "État du streaming" },
          createdAt: { content: "Créé le" },
          updatedAt: { content: "Mis à jour le" },
        },
      },
      totalCount: { content: "Nombre total" },
      pageCount: { content: "Nombre de pages" },
      currentPage: { content: "Page actuelle" },
      pageSize: { content: "Taille de page" },
    },
    errors: {
      validationFailed: {
        title: "Erreur de validation",
        description: "Paramètres de requête invalides",
      },
      validation: {
        title: "Erreur de validation",
        description: "Paramètres de requête invalides",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Vous devez être connecté pour voir le fil",
      },
      forbidden: {
        title: "Accès refusé",
        description: "Vous n'avez pas la permission de voir le fil",
      },
      notFound: {
        title: "Introuvable",
        description: "Aucun fil trouvé",
      },
      server: {
        title: "Erreur serveur",
        description: "Une erreur interne du serveur s'est produite",
        detail: "Erreur serveur : {{error}}",
      },
      serverError: {
        title: "Erreur serveur",
        description: "Une erreur interne du serveur s'est produite",
      },
      network: {
        title: "Erreur réseau",
        description: "Impossible de se connecter au serveur",
      },
      networkError: {
        title: "Erreur réseau",
        description: "Impossible de se connecter au serveur",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inattendue s'est produite",
      },
      unknownError: {
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
      description: "Fil récupéré",
    },
  },
  sortMode: {
    hot: "Populaires",
    new: "Récents",
    rising: "En hausse",
  },
};
