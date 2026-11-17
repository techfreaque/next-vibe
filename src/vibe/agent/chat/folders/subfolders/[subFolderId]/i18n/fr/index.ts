import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Chat",
  tags: {
    folders: "Dossiers",
  },

  get: {
    title: "Obtenir le dossier",
    titleShort: "Sous-dossier",
    description: "Récupère un dossier par son ID",
    container: {
      title: "Dossier",
      description: "Détails du dossier",
    },
    id: {
      label: "ID du dossier",
      description: "L'identifiant unique du dossier",
    },
    response: {
      folder: {
        id: { content: "ID" },
        name: { content: "Nom" },
        icon: { content: "Icône" },
        color: { content: "Couleur" },
        parentId: { content: "ID du parent" },
        rootFolderId: { content: "Dossier racine" },
        expanded: { content: "Déplié" },
        sortOrder: { content: "Ordre de tri" },
        createdAt: { content: "Créé le" },
        updatedAt: { content: "Mis à jour le" },
      },
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Les données fournies sont invalides",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Vous devez être connecté pour voir les dossiers",
      },
      forbidden: {
        title: "Accès refusé",
        description: "Vous n'avez pas la permission de voir ce dossier",
      },
      notFound: {
        title: "Introuvable",
        description: "Le dossier demandé est introuvable",
      },
      server: {
        title: "Erreur serveur",
        description:
          "Une erreur s'est produite lors de la récupération du dossier",
      },
      network: {
        title: "Erreur réseau",
        description: "Impossible de se connecter au serveur",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inattendue s'est produite",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Vous avez des modifications non enregistrées",
      },
      conflict: { title: "Conflit", description: "Un conflit s'est produit" },
    },
    success: { title: "Succès", description: "Dossier récupéré" },
  },

  delete: {
    title: "Supprimer le dossier",
    titleShort: "Supprimer le dossier",
    description: "Supprime un dossier par son ID",
    container: {
      title: "Supprimer le dossier",
      description: "Confirmer la suppression du dossier",
    },
    id: {
      label: "ID du dossier",
      description: "L'identifiant unique du dossier à supprimer",
    },
    response: {
      id: { content: "ID" },
      name: { content: "Nom" },
      updatedAt: { content: "Supprimé le" },
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Les données fournies sont invalides",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Vous devez être connecté pour supprimer des dossiers",
      },
      forbidden: {
        title: "Accès refusé",
        description: "Vous n'avez pas la permission de supprimer ce dossier",
      },
      notFound: {
        title: "Introuvable",
        description: "Le dossier demandé est introuvable",
      },
      server: {
        title: "Erreur serveur",
        description:
          "Une erreur s'est produite lors de la suppression du dossier",
      },
      network: {
        title: "Erreur réseau",
        description: "Impossible de se connecter au serveur",
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
        description:
          "Impossible de supprimer le dossier : il contient peut-être encore des éléments",
      },
    },
    success: { title: "Succès", description: "Dossier supprimé" },
    backButton: { label: "Retour" },
    submitButton: {
      label: "Supprimer le dossier",
      loadingText: "Suppression...",
    },
  },

  errors: {
    not_implemented_on_native:
      "{{method}} n'est pas disponible sur la plateforme native",
  },
};
