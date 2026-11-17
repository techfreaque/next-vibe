import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Chat",
  tags: {
    folders: "Dossiers",
  },

  get: {
    title: "Obtenir les permissions du dossier racine",
    titleShort: "Accès au dossier",
    description: "Calcule les permissions d'un dossier racine",
    container: {
      title: "Permissions du dossier racine",
      description: "Voir les permissions des dossiers racines",
    },
    rootFolderId: {
      label: "Dossier racine",
      description: "L'ID du dossier racine dont vérifier les permissions",
      options: {
        private: "Privé",
        shared: "Partagé",
        public: "Public",
        background: "Arrière-plan",
        incognito: "Incognito",
        remote: "Distant",
      },
    },
    response: {
      canCreateThread: {
        content: "Peut créer un fil",
      },
      canCreateFolder: {
        content: "Peut créer un dossier",
      },
    },
    success: {
      title: "Succès",
      description: "Permissions du dossier racine récupérées",
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "ID de dossier racine invalide",
      },
      network: {
        title: "Erreur réseau",
        description: "Impossible de se connecter au serveur",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Vous devez être connecté pour vérifier les permissions",
      },
      forbidden: {
        title: "Accès refusé",
        description:
          "Vous n'avez pas la permission d'accéder à cette ressource",
      },
      notFound: {
        title: "Introuvable",
        description: "Dossier racine introuvable",
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
    },
  },
};
