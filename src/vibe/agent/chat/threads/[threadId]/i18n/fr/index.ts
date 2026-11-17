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
  config: {
    folders: {
      private: "Chats privés",
      shared: "Chats partagés",
      public: "Chats publics",
      incognito: "Chats incognito",
      background: "Fils en arrière-plan",
      remote: "Chats distants",
    },
  },
  tags: {
    threads: "Fils de discussion",
  },
  errors: {
    not_implemented_on_native:
      "{{method}} n'est pas disponible sur l'application native. Utilisez la version web pour cette opération.",
  },
  get: {
    title: "Récupérer un fil de discussion",
    titleShort: "Fil",
    description: "Récupérer un fil de discussion précis par son ID",
    container: {
      title: "Détails du fil",
      description: "Voir les informations détaillées du fil",
    },
    id: {
      label: "ID du fil",
      description: "Identifiant unique du fil",
      placeholder: "Saisissez l'ID du fil...",
    },
    rootFolderId: {
      label: "Dossier racine",
      description: "Dossier racine du fil (utilisé pour le routage client)",
    },
    response: {
      thread: {
        title: "Détails du fil",
        description: "Informations complètes du fil",
        id: {
          content: "ID du fil",
        },
        userId: {
          content: "ID utilisateur",
        },
        leadId: {
          content: "ID du lead",
        },
        threadTitle: {
          content: "Titre",
        },
        rootFolderId: {
          content: "ID du dossier racine",
        },
        folderId: {
          content: "ID du dossier",
        },
        status: {
          content: "Statut",
        },
        defaultModel: {
          content: "Modèle par défaut",
        },
        defaultTone: {
          content: "Compétence par défaut",
        },
        systemPrompt: {
          content: "Prompt système",
        },
        pinned: {
          content: "Épinglé",
        },
        archived: {
          content: "Archivé",
        },
        tags: {
          content: "Tags",
        },
        published: {
          content: "Publié",
        },
        streamingState: {
          content: "État du streaming",
        },
        searchVector: {
          content: "Vecteur de recherche",
        },
        preview: {
          content: "Aperçu",
        },
        metadata: {
          content: "Métadonnées",
        },
        createdAt: {
          content: "Créé le",
        },
        updatedAt: {
          content: "Mis à jour le",
        },
      },
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "ID de fil invalide",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Vous devez être connecté pour voir les fils",
      },
      forbidden: {
        title: "Accès refusé",
        description: "Vous n'avez pas l'autorisation de voir ce fil",
      },
      notFound: {
        title: "Fil introuvable",
        description: "Le fil demandé est introuvable",
      },
      server: {
        title: "Erreur serveur",
        description: "Une erreur interne du serveur s'est produite",
        detail: "Erreur serveur : {{error}}",
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
        description: "Un conflit s'est produit",
      },
    },
    success: {
      title: "Succès",
      description: "Fil récupéré",
    },
  },
  patch: {
    title: "Modifier un fil de discussion",
    titleShort: "Modifier le fil",
    description: "Modifier un fil de discussion existant",
    container: {
      title: "Modifier le fil",
      description: "Modifier les paramètres du fil",
    },
    id: {
      label: "ID du fil",
      description: "Identifiant unique du fil à modifier",
      placeholder: "Saisissez l'ID du fil...",
    },
    sections: {
      updates: {
        title: "Modifications du fil",
        description: "Champs à modifier",
      },
    },
    threadTitle: {
      label: "Titre",
      description: "Titre du fil",
      placeholder: "Saisissez le titre du fil...",
    },
    rootFolderId: {
      label: "Dossier racine",
      description: "Dossier racine du fil (utilisé pour le routage client)",
    },
    folderId: {
      label: "Dossier",
      description: "Dossier où placer le fil",
    },
    status: {
      label: "Statut",
      description: "Statut du fil",
    },
    defaultModel: {
      label: "Modèle par défaut",
      description: "Modèle d'IA par défaut pour ce fil",
    },
    defaultTone: {
      label: "Compétence par défaut",
      description: "Compétence par défaut pour ce fil",
    },
    systemPrompt: {
      label: "Prompt système",
      description: "Prompt système personnalisé pour ce fil",
    },
    pinned: {
      label: "Épinglé",
      description: "Épingler ce fil en haut",
    },
    archived: {
      label: "Archivé",
      description: "Archiver ce fil",
    },
    tags: {
      label: "Tags",
      description: "Tags pour organiser vos fils",
    },
    published: {
      label: "Publié",
      description:
        "Rendre ce fil accessible publiquement via un lien (dossiers SHARED uniquement)",
    },
    response: {
      thread: {
        title: "Fil modifié",
        description: "Détails du fil après modification",
        id: {
          content: "ID du fil",
        },
        userId: {
          content: "ID utilisateur",
        },
        leadId: {
          content: "ID du lead",
        },
        threadTitle: {
          content: "Titre",
        },
        rootFolderId: {
          content: "ID du dossier racine",
        },
        folderId: {
          content: "ID du dossier",
        },
        status: {
          content: "Statut",
        },
        defaultModel: {
          content: "Modèle par défaut",
        },
        defaultTone: {
          content: "Compétence par défaut",
        },
        systemPrompt: {
          content: "Prompt système",
        },
        pinned: {
          content: "Épinglé",
        },
        archived: {
          content: "Archivé",
        },
        tags: {
          content: "Tags",
        },
        published: {
          content: "Publié",
        },
        searchVector: {
          content: "Vecteur de recherche",
        },
        preview: {
          content: "Aperçu",
        },
        metadata: {
          content: "Métadonnées",
        },
        createdAt: {
          content: "Créé le",
        },
        updatedAt: {
          content: "Mis à jour le",
        },
      },
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Données du fil invalides",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Vous devez être connecté pour modifier des fils",
      },
      forbidden: {
        title: "Accès refusé",
        description: "Vous n'avez pas l'autorisation de modifier ce fil",
      },
      notFound: {
        title: "Fil introuvable",
        description: "Le fil à modifier est introuvable",
        detail: "Fil introuvable : {{threadId}}",
      },
      server: {
        title: "Erreur serveur",
        description: "Une erreur interne du serveur s'est produite",
        detail: "Erreur serveur : {{error}}",
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
        description: "Un conflit s'est produit pendant la modification",
      },
    },
    success: {
      title: "Succès",
      description: "Fil modifié",
    },
  },
  delete: {
    title: "Supprimer un fil de discussion",
    titleShort: "Supprimer le fil",
    description: "Supprimer un fil de discussion",
    container: {
      title: "Supprimer le fil",
      description: "Supprimer définitivement le fil",
    },
    id: {
      label: "ID du fil",
      description: "Identifiant unique du fil à supprimer",
      placeholder: "Saisissez l'ID du fil...",
      helpText: "ATTENTION : cette action est irréversible",
    },
    rootFolderId: {
      label: "Dossier racine",
      description: "Dossier racine du fil (utilisé pour le routage client)",
    },
    response: {
      userId: {
        content: "Propriétaire",
      },
      title: {
        content: "Titre",
      },
      folderId: {
        content: "Dossier",
      },
      status: {
        content: "Statut",
      },
      preview: {
        content: "Aperçu",
      },
      createdAt: {
        content: "Créé",
      },
      updatedAt: {
        content: "Mis à jour",
      },
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "ID de fil invalide",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Vous devez être connecté pour supprimer des fils",
      },
      forbidden: {
        title: "Accès refusé",
        description: "Vous n'avez pas l'autorisation de supprimer ce fil",
      },
      notFound: {
        title: "Fil introuvable",
        description: "Le fil à supprimer est introuvable",
        detail: "Fil introuvable : {{threadId}}",
      },
      server: {
        title: "Erreur serveur",
        description: "Une erreur interne du serveur s'est produite",
        detail: "Erreur serveur : {{error}}",
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
          "Impossible de supprimer le fil : des dépendances existent",
      },
    },
    success: {
      title: "Succès",
      description: "Fil supprimé",
    },
  },
  widget: {
    screenshot: {
      capture: "Faire une capture d'écran",
      capturing: "Capture en cours...",
    },
  },
};
