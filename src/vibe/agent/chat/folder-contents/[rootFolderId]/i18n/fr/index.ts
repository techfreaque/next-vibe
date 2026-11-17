import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Chat",
  tags: {
    folderContents: "Contenu du dossier",
  },
  config: {
    folders: {
      private: "Privé",
      shared: "Partagé",
      public: "Public",
      background: "Arrière-plan",
      incognito: "Incognito",
      remote: "Distant",
    },
  },
  enums: {
    userRole: {
      public: "Public",
      customer: "Client",
      partnerAdmin: "Admin partenaire",
      partnerEmployee: "Employé partenaire",
      admin: "Admin",
    },
    threadStatus: {
      active: "Actif",
      archived: "Archivé",
      deleted: "Supprimé",
    },
  },
  get: {
    title: "Obtenir le contenu du dossier",
    titleShort: "Contenu du dossier",
    description:
      "Récupère la liste fusionnée des dossiers et des fils pour un niveau de dossier donné",
    rootFolderId: {
      label: "Dossier racine",
      description: "Le dossier racine (privé, partagé, public, etc.)",
    },
    subFolderId: {
      label: "Sous-dossier",
      description: "L'ID du sous-dossier (null pour le niveau racine)",
    },
    threadIds: {
      label: "ID des fils",
      description:
        "Filtrer par ID de fils précis (pour les résultats de recherche)",
    },
    response: {
      items: {
        item: {
          type: { content: "Type d'élément" },
          sortOrder: { content: "Ordre de tri" },
          // Folder fields
          id: { content: "ID" },
          userId: { content: "ID utilisateur" },
          rootFolderId: { content: "Dossier racine" },
          name: { content: "Nom" },
          icon: { content: "Icône" },
          color: { content: "Couleur" },
          parentId: { content: "Dossier parent" },
          expanded: { content: "Déplié" },
          canManage: { content: "Peut gérer" },
          canCreateThread: { content: "Peut créer un fil" },
          canModerate: { content: "Peut modérer" },
          canDelete: { content: "Peut supprimer" },
          canManagePermissions: { content: "Peut gérer les permissions" },
          // Thread fields
          title: { content: "Titre du fil" },
          folderId: { content: "Dossier" },
          status: { content: "Statut" },
          preview: { content: "Aperçu" },
          pinned: { content: "Épinglé" },
          archived: { content: "Archivé" },
          canEdit: { content: "Peut modifier" },
          canPost: { content: "Peut publier" },
          streamingState: { content: "État du streaming" },
          activeShareCount: { content: "Liens de partage actifs" },
          lastSharedAt: { content: "Dernier partage" },
          createdAt: { content: "Créé le" },
          updatedAt: { content: "Mis à jour le" },
        },
      },
      rootFolderPermissions: {
        title: "Permissions du dossier racine",
        description: "Permissions du dossier racine",
        canCreateThread: { content: "Peut créer un fil" },
        canCreateFolder: { content: "Peut créer un dossier" },
      },
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "L'ID de dossier fourni est invalide",
      },
      unauthorized: {
        title: "Non autorisé",
        description:
          "Vous devez être connecté pour voir le contenu de ce dossier",
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
          "Une erreur s'est produite lors de la récupération du contenu du dossier",
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
          "Un conflit s'est produit lors du traitement de votre requête",
      },
    },
    success: {
      title: "Succès",
      description: "Contenu du dossier récupéré",
    },
    backButton: {
      label: "Retour",
    },
  },
};
