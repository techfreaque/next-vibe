import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Chat",
  tags: {
    moderation: "Modération",
  },
  get: {
    title: "Contenus signalés",
    titleShort: "File de modération",
    description:
      "Publications du fil public et fils partagés signalés ou masqués, les plus urgents en premier",
    fields: {
      minReports: {
        label: "Signalements min.",
        description:
          "Nombre minimum de signalements ouverts à inclure (par défaut : 1)",
      },
      limit: {
        label: "Limite",
        description: "Nombre maximum de fils à renvoyer",
      },
      offset: {
        label: "Décalage",
        description: "Nombre de fils à ignorer pour la pagination",
      },
    },
    response: {
      threads: {
        id: { content: "ID du fil" },
        title: { content: "Titre" },
        rootFolderId: { content: "Dossier" },
        authorId: { content: "ID de l'auteur" },
        authorName: { content: "Auteur" },
        authorBanned: { content: "Auteur banni" },
        moderationStatus: { content: "Statut" },
        reportCount: { content: "Signalements" },
        reasons: { content: "Motifs" },
        latestNote: { content: "Dernière note" },
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
      notFound: { title: "Introuvable", description: "Fil introuvable" },
      server: {
        title: "Erreur serveur",
        description: "Impossible de charger la file de modération",
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
      title: "File chargée",
      description: "Contenus signalés récupérés",
    },
    note: "« {{note}} »",
    empty: "Aucun signalement. La communauté se porte bien.",
    status: {
      visible: "Visible",
      underReview: "En cours d'examen",
      removed: "Supprimé",
      authorBanned: "Auteur banni",
    },
    reasons: {
      spam: "Spam",
      illegal: "Illégal",
      abuse: "Abus",
      csamFlag: "Protection des mineurs",
      other: "Autre",
    },
    action: {
      dismiss: "Rejeter",
      remove: "Supprimer",
      banAuthor: "Supprimer + bannir l'auteur",
    },
    backButton: {
      label: "Retour",
    },
  },
  patch: {
    title: "Modérer le contenu",
    titleShort: "Modérer",
    description:
      "Rejette les signalements et rétablit un fil, le supprime, ou le supprime et bannit son auteur",
    fields: {
      id: {
        label: "ID du fil",
        description: "ID du fil à modérer",
      },
      action: {
        label: "Action",
        description:
          "dismiss = rétablir et effacer les signalements, remove = masquer définitivement, ban = supprimer et bannir l'auteur",
      },
    },
    actions: {
      dismiss: "Rejeter les signalements (rétablir)",
      remove: "Supprimer le contenu",
      banAuthor: "Supprimer et bannir l'auteur",
    },
    response: {
      patchId: { content: "ID du fil" },
      patchStatus: { content: "Nouveau statut" },
      patchReportCount: { content: "Nombre de signalements" },
      authorBanned: { content: "Auteur banni" },
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
      notFound: { title: "Introuvable", description: "Fil introuvable" },
      server: {
        title: "Erreur serveur",
        description: "Impossible de modérer le fil",
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
      noAuthor: {
        title: "Aucun auteur inscrit",
        description:
          "Ce fil a été publié par un invité : il n'y a aucun compte à bannir",
      },
    },
    success: {
      title: "Contenu modéré",
      description: "Action appliquée",
    },
  },
};
