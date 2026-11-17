import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Compétences IA",
  tags: {
    moderation: "Modération",
  },
  get: {
    title: "Compétences signalées",
    titleShort: "Modération",
    description:
      "Liste des compétences signalées, triées par nombre de signalements",
    fields: {
      minReports: {
        label: "Signalements min.",
        description: "Nombre minimum de signalements à inclure (défaut : 1)",
      },
      limit: {
        label: "Limite",
        description: "Nombre maximum de compétences à renvoyer",
      },
      offset: {
        label: "Décalage",
        description: "Nombre de compétences à sauter pour la pagination",
      },
    },
    response: {
      skills: {
        id: { content: "ID de la compétence" },
        name: { content: "Nom" },
        ownerAuthorId: { content: "ID du propriétaire" },
        status: { content: "Statut" },
        reportCount: { content: "Signalements" },
        voteCount: { content: "Votes" },
        trustLevel: { content: "Niveau de confiance" },
        publishedAt: { content: "Publié le" },
        updatedAt: { content: "Mis à jour le" },
      },
      totalCount: { content: "Total" },
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Requête invalide",
      },
      network: { title: "Erreur réseau", description: "Échec de la connexion" },
      unauthorized: {
        title: "Non autorisé",
        description: "Accès administrateur requis",
      },
      forbidden: {
        title: "Accès refusé",
        description: "Accès administrateur requis",
      },
      notFound: {
        title: "Introuvable",
        description: "Aucune compétence trouvée",
      },
      server: {
        title: "Erreur serveur",
        description: "Impossible de charger les compétences signalées",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inattendue s'est produite",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Vous avez des modifications non enregistrées",
      },
      conflict: { title: "Conflit", description: "Conflit de données" },
    },
    success: {
      title: "Compétences chargées",
      description: "Compétences signalées récupérés",
    },
    empty: "Aucune compétence signalée. La communauté se porte bien !",
    action: {
      moderate: "Modérer",
    },
    backButton: {
      label: "Retour",
    },
  },
  patch: {
    title: "Modérer la compétence",
    titleShort: "Modérer la compétence",
    description: "Masquer une compétence signalé ou effacer ses signalements",
    fields: {
      id: {
        label: "ID de la compétence",
        description: "ID de la compétence à modérer",
      },
      action: {
        label: "Action",
        description:
          "hide = passe le statut à UNLISTED, clear = remet le nombre de signalements à 0",
      },
    },
    response: {
      id: { content: "ID de la compétence" },
      status: { content: "Nouveau statut" },
      reportCount: { content: "Nombre de signalements" },
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Requête invalide",
      },
      network: { title: "Erreur réseau", description: "Échec de la connexion" },
      unauthorized: {
        title: "Non autorisé",
        description: "Accès administrateur requis",
      },
      forbidden: {
        title: "Accès refusé",
        description: "Accès administrateur requis",
      },
      notFound: { title: "Introuvable", description: "Compétence introuvable" },
      server: {
        title: "Erreur serveur",
        description: "Impossible de modérer la compétence",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inattendue s'est produite",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Vous avez des modifications non enregistrées",
      },
      conflict: { title: "Conflit", description: "Conflit de données" },
    },
    success: {
      title: "Compétence modérée",
      description: "Action appliquée",
    },
  },
};
