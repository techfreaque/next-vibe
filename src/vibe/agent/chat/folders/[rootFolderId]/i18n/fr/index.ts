import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Chat",
  tags: {
    folders: "Dossiers",
  },
  enums: {
    userRole: {
      public: "Public",
      customer: "Client",
      partnerAdmin: "Admin partenaire",
      partnerEmployee: "Employé partenaire",
      admin: "Admin",
    },
  },
  widget: {
    config: {
      foldersShort: {
        private: "Privé",
        shared: "Partagé",
        public: "Public",
        incognito: "Incognito",
        cron: "Arrière-plan",
        support: "Support",
        remote: "Distant",
      },
    },
    folderList: {
      menu: "Actions du dossier",
      newChatInFolder: "Nouvelle discussion dans le dossier",
      moveUp: "Monter",
      moveDown: "Descendre",
      newSubfolder: "Nouveau sous-dossier",
      managePermissions: "Gérer les permissions",
      projectSettings: "Paramètres du projet",
      renameFolder: "Renommer le dossier",
      moveToFolder: "Déplacer vers un dossier",
      deleteFolder: "Supprimer le dossier",
      deleteDialog: {
        title: "Supprimer le dossier",
        description: "Voulez-vous vraiment supprimer « {{folderName}} » ?",
      },
      pinned: "Épinglés",
      pin: "Épingler",
      unpin: "Désépingler",
      today: "Aujourd'hui",
      lastWeek: "7 derniers jours",
      lastMonth: "30 derniers jours",
      older: "Plus anciens",
      showMore: "Afficher plus",
    },
    renameFolder: {
      title: "Renommer le dossier",
    },
    moveFolder: {
      title: "Déplacer le dossier",
    },
    newFolder: {
      title: "Créer un dossier",
    },
    project: {
      dialogTitle: "Paramètres du projet",
    },
    permissions: {
      folderTitle: "Permissions du dossier",
    },
    accessModal: {
      title: "Compte requis",
      privateTitle: "Fils privés",
      sharedTitle: "Fils partagés",
      publicTitle: "Forum public",
      incognitoTitle: "Mode incognito",
      backgroundTitle: "Fils en arrière-plan",
      remoteTitle: "Fils distants",
      privateExplanation:
        "Les fils privés sont votre espace personnel pour discuter avec l'IA. Toutes vos discussions sont stockées en sécurité sur nos serveurs et synchronisées automatiquement sur tous vos appareils.",
      sharedExplanation:
        "Les fils partagés vous permettent de créer des discussions et de les partager via des liens sécurisés. Idéal pour collaborer et partager vos trouvailles avec votre équipe ou vos amis.",
      publicExplanation:
        "Le forum public est un espace ouvert où humains et IA dialoguent librement. Vous choisissez ce que vous lisez. Nous ne retirons que ce qui enfreint la loi ou nos conditions d'utilisation. Partagez vos idées, confrontez les points de vue, participez à des discussions non censurées.",
      incognitoExplanation:
        "Le mode incognito garde vos discussions entièrement privées et locales. Vos discussions sont stockées uniquement dans votre navigateur et ne sont jamais envoyées à nos serveurs (les médias générés sont stockés temporairement pour des raisons techniques). Elles ne sont même pas liées à votre compte.",
      backgroundExplanation:
        "Les tâches longues ne doivent pas bloquer votre discussion. Les fils en arrière-plan accueillent vos sous-agents et agents planifiés, qui travaillent seuls et vous rendent compte une fois terminés.",
      remoteExplanation:
        "Gérer vos propres instances ne devrait pas disperser vos discussions. Les fils distants regroupent au même endroit les échanges synchronisés depuis vos instances connectées.",
      requiresAccount:
        "Pour accéder à {{folderName}}, créez un compte ou connectez-vous.",
      loginButton: "Se connecter",
      signupButton: "S'inscrire",
      close: "Fermer",
    },
    actions: {
      rename: "Renommer",
      moveToFolder: "Déplacer vers un dossier",
      pin: "Épingler",
      unpin: "Désépingler",
    },
    threadList: {
      deleteDialog: {
        title: "Supprimer le fil",
        description: "Voulez-vous vraiment supprimer « {{title}} » ?",
      },
    },
    sharedThread: {
      noLinks: "Pas encore partagé. Touchez pour partager",
      linkCount: "{{count}} lien(s) actif(s)",
      shareAction: "Partager",
      moveToShared: "Déplacer vers Partagés",
    },
    common: {
      cancel: "Annuler",
      delete: "Supprimer",
      noChatsFound: "Aucun fil trouvé",
      noResults: "Aucun fil correspondant",
      searchPlaceholder: "Rechercher...",
      privateChats: "Fils privés",
      sharedChats: "Fils partagés",
      publicChats: "Fils publics",
      incognitoChats: "Fils incognito",
      backgroundChats: "Fils en arrière-plan",
      remoteChats: "Fils distants",
      newChat: "Nouveau fil",
      newPrivateChat: "Fil privé",
      newSharedChat: "Fil partagé",
      newPublicChat: "Fil public",
      newIncognitoChat: "Fil incognito",
      newPrivateFolder: "Nouveau dossier privé",
      newSharedFolder: "Nouveau dossier partagé",
      newPublicFolder: "Nouveau dossier public",
      newIncognitoFolder: "Nouveau dossier incognito",
      newFolder: "Nouveau dossier",
    },
  },
  errors: {
    not_implemented_on_native:
      "{{method}} n'est pas disponible sur la plateforme native. Utilisez la version web pour cette opération.",
  },
  config: {
    folders: {
      private: "Privé",
      shared: "Partagé",
      public: "Public",
      background: "Arrière-plan",
      incognito: "Incognito",
      support: "Support",
      remote: "Distant",
    },
  },
  get: {
    title: "Obtenir les dossiers",
    titleShort: "Dossiers",
    description: "Récupère tous les dossiers du dossier racine actuel",
    rootFolderId: {
      label: "Dossier racine",
      description:
        "Le dossier racine à récupérer (privé, partagé, public, arrière-plan, incognito)",
    },
    container: {
      title: "Détails du dossier",
      description: "Voir les informations du dossier",
    },
    id: {
      label: "ID du dossier",
      description: "L'identifiant unique du dossier",
    },
    response: {
      title: "Dossiers",
      description: "La liste des dossiers avec leurs permissions",
      rootFolderPermissions: {
        title: "Permissions du dossier racine",
        description: "Permissions du dossier racine",
        canCreateThread: {
          content: "Peut créer un fil",
        },
        canCreateFolder: {
          content: "Peut créer un dossier",
        },
      },
      folders: {
        folder: {
          id: { content: "ID" },
          userId: { content: "ID utilisateur" },
          name: { content: "Nom" },
          icon: { content: "Icône" },
          color: { content: "Couleur" },
          parentId: { content: "Dossier parent" },
          expanded: { content: "Déplié" },
          sortOrder: { content: "Ordre de tri" },
          rootFolderId: {
            content: "Dossier racine",
          },
          canManage: {
            content: "Peut gérer",
          },
          canCreateThread: {
            content: "Peut créer un fil",
          },
          canModerate: {
            content: "Peut modérer",
          },
          canDelete: {
            content: "Peut supprimer",
          },
          canManagePermissions: {
            content: "Peut gérer les permissions",
          },
          createdAt: {
            content: "Créé le",
          },
          updatedAt: {
            content: "Mis à jour le",
          },
        },
      },
      folder: {
        title: "Dossier",
        id: {
          content: "ID",
        },
        userId: {
          content: "ID utilisateur",
        },
        name: {
          content: "Nom",
        },
        icon: {
          content: "Icône",
        },
        color: {
          content: "Couleur",
        },
        parentId: {
          content: "Dossier parent",
        },
        expanded: {
          content: "Déplié",
        },
        sortOrder: {
          content: "Ordre de tri",
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
        description: "L'ID de dossier fourni est invalide",
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
      conflict: {
        title: "Conflit",
        description:
          "Un conflit s'est produit lors du traitement de votre requête",
      },
    },
    success: {
      title: "Succès",
      description: "Dossier récupéré",
    },
  },
  patch: {
    title: "Mettre à jour le dossier",
    description: "Met à jour un dossier existant",
    container: {
      title: "Mettre à jour le dossier",
      description: "Modifier les propriétés du dossier",
    },
    id: {
      label: "ID du dossier",
      description: "L'identifiant unique du dossier à mettre à jour",
    },
    sections: {
      updates: {
        title: "Modifications du dossier",
        description: "Champs à mettre à jour",
      },
    },
    name: {
      label: "Nom",
      description: "Le nom du dossier",
    },
    icon: {
      label: "Icône",
      description: "Nom d'icône Lucide ou Simple Icons",
    },
    color: {
      label: "Couleur",
      description: "Code couleur hexadécimal pour le distinguer visuellement",
    },
    parentId: {
      label: "Dossier parent",
      description:
        "Déplacer le dossier sous un autre parent (null pour la racine)",
    },
    expanded: {
      label: "Déplié",
      description: "Indique si le dossier est déplié dans l'interface",
    },
    sortOrder: {
      label: "Ordre de tri",
      description: "Ordre de tri des dossiers",
    },
    metadata: {
      label: "Métadonnées",
      description: "Métadonnées supplémentaires du dossier",
    },
    rolesView: {
      label: "Rôles en lecture",
      description: "Rôles autorisés à voir ce dossier",
    },
    rolesManage: {
      label: "Rôles de gestion",
      description: "Rôles autorisés à gérer les paramètres du dossier",
    },
    rolesCreateThread: {
      label: "Rôles de création de fils",
      description: "Rôles autorisés à créer des fils dans ce dossier",
    },
    rolesPost: {
      label: "Rôles de publication",
      description: "Rôles autorisés à publier des messages",
    },
    rolesModerate: {
      label: "Rôles de modération",
      description: "Rôles autorisés à modérer le contenu",
    },
    rolesAdmin: {
      label: "Rôles administrateur",
      description: "Rôles disposant d'un accès administrateur complet",
    },
    response: {
      title: "Dossier mis à jour",
      description: "Les détails du dossier mis à jour",
      folder: {
        title: "Dossier",
        id: {
          content: "ID",
        },
        userId: {
          content: "ID utilisateur",
        },
        name: {
          content: "Nom",
        },
        icon: {
          content: "Icône",
        },
        color: {
          content: "Couleur",
        },
        parentId: {
          content: "Dossier parent",
        },
        expanded: {
          content: "Déplié",
        },
        sortOrder: {
          content: "Ordre de tri",
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
        description: "Les données fournies sont invalides",
        circularReference:
          "Un dossier ne peut pas être son propre dossier parent",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Vous devez être connecté pour modifier des dossiers",
      },
      forbidden: {
        title: "Accès refusé",
        description: "Vous n'avez pas la permission de modifier ce dossier",
      },
      notFound: {
        title: "Introuvable",
        description: "Le dossier demandé est introuvable",
      },
      server: {
        title: "Erreur serveur",
        description:
          "Une erreur s'est produite lors de la mise à jour du dossier",
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
    success: {
      title: "Succès",
      description: "Dossier mis à jour",
    },
  },
  delete: {
    title: "Supprimer le dossier",
    description: "Supprime un dossier et tout son contenu",
    container: {
      title: "Supprimer le dossier",
      description: "Supprimer définitivement le dossier",
    },
    id: {
      label: "ID du dossier",
      description: "L'identifiant unique du dossier à supprimer",
    },
    response: {
      title: "Résultat de la suppression",
      description: "Confirmation de la suppression du dossier",
      success: {
        content: "Succès",
      },
      deletedFolderId: {
        content: "ID du dossier supprimé",
      },
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "L'ID de dossier fourni est invalide",
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
          "Impossible de supprimer un dossier qui a du contenu actif",
      },
    },
    success: {
      title: "Succès",
      description: "Dossier supprimé",
    },
  },
  post: {
    errors: {
      forbidden: {
        title: "Accès refusé",
        incognitoNotAllowed:
          "Les dossiers ne sont pas pris en charge en mode incognito",
      },
      unauthorized: {
        title: "Non autorisé",
      },
      server: {
        title: "Erreur serveur",
      },
    },
  },
};
