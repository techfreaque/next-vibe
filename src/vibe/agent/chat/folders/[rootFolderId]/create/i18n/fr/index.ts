import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Chat",
  tags: {
    folders: "Dossiers",
  },
  title: "Créer un dossier",
  titleShort: "Nouveau dossier",
  description: "Crée un nouveau dossier",
  config: {
    folders: {
      private: "Discussions privées",
      shared: "Discussions partagées",
      public: "Discussions publiques",
      incognito: "Discussions incognito",
    },
  },
  sections: {
    folder: {
      title: "Détails du dossier",
      description: "Informations de base du dossier",
      rootFolderId: {
        label: "Dossier racine",
        description: "Dossier racine (privé, partagé, public, incognito)",
      },
      name: {
        label: "Nom du dossier",
        description: "Nom du dossier",
      },
      icon: {
        label: "Icône",
        description: "Icône du dossier (nom d'icône lucide ou si)",
      },
      color: {
        label: "Couleur",
        description: "Couleur hexadécimale pour le distinguer visuellement",
      },
      parentId: {
        label: "Dossier parent",
        description: "ID du dossier parent pour les dossiers imbriqués",
      },
    },
  },
  response: {
    title: "Dossier créé",
    description: "Détails du dossier créé",
    folder: {
      title: "Dossier",
      id: { content: "ID du dossier" },
      userId: { content: "ID utilisateur" },
      rootFolderId: { content: "Dossier racine" },
      name: { content: "Nom du dossier" },
      icon: { content: "Icône" },
      color: { content: "Couleur" },
      parentId: { content: "ID du dossier parent" },
      expanded: { content: "État déplié" },
      sortOrder: { content: "Ordre de tri" },
      createdAt: { content: "Créé le" },
      updatedAt: { content: "Mis à jour le" },
    },
  },
  errors: {
    validation: {
      title: "Erreur de validation",
      description: "Les données du dossier sont invalides",
    },
    unauthorized: {
      title: "Non autorisé",
      description: "Vous devez être connecté pour créer des dossiers",
    },
    forbidden: {
      title: "Accès refusé",
      description: "Vous n'avez pas la permission de créer des dossiers",
      incognitoNotAllowed:
        "Les dossiers incognito ne peuvent pas être créés sur le serveur",
    },
    notFound: {
      title: "Introuvable",
      description: "La ressource demandée est introuvable",
    },
    server: {
      title: "Erreur serveur",
      description: "Une erreur s'est produite lors de la création du dossier",
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
      description: "Un dossier portant ce nom existe déjà",
    },
  },
  backButton: {
    label: "Retour",
  },
  submitButton: {
    label: "Créer le dossier",
    loadingText: "Création...",
  },
  success: {
    title: "Succès",
    description: "Dossier créé",
  },
};
