import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    threads: "Fils de discussion",
  },
  enums: {
    threadStatus: {
      active: "Actif",
      archived: "Archivé",
      deleted: "Supprimé",
    },
  },
  errors: {
    count_failed: "Impossible de compter les conversations : {{error}}",
  },
  get: {
    title: "Fils de discussion",
    titleShort: "Fils",
    description:
      "Récupérer une liste paginée de fils de discussion, avec filtres",
    container: {
      title: "Liste des fils",
      description: "Parcourir et filtrer les fils de discussion",
    },
    sections: {
      pagination: {
        title: "Pagination",
        description: "Paramètres de navigation entre les pages",
      },
      filters: {
        title: "Filtres",
        description: "Filtrer les fils selon des critères",
      },
    },
    page: {
      label: "Page",
      description: "Numéro de la page à récupérer",
    },
    limit: {
      label: "Limite",
      description: "Nombre de fils par page",
    },
    rootFolderId: {
      label: "Dossier racine",
      description:
        "Filtrer par dossier racine (private, shared, public, incognito)",
    },
    subFolderId: {
      label: "Sous-dossier",
      description: "Filtrer par ID de sous-dossier (facultatif)",
    },
    status: {
      label: "Statut",
      description: "Filtrer par statut du fil",
    },
    search: {
      label: "Recherche",
      description: "Rechercher des fils par titre ou contenu",
      placeholder: "Rechercher des fils...",
    },
    isPinned: {
      label: "Épinglés uniquement",
      description: "Afficher uniquement les fils épinglés",
    },
    dateFrom: {
      label: "Du",
      description: "Fils créés après cette date",
    },
    dateTo: {
      label: "Au",
      description: "Fils créés avant cette date",
    },
    response: {
      title: "Liste des fils",
      description: "Liste paginée des fils",
      threads: {
        thread: {
          title: "Fil",
          id: {
            content: "ID du fil",
          },
          threadTitle: {
            content: "Titre",
          },
          rootFolderId: {
            content: "Dossier racine",
          },
          folderId: {
            content: "ID du sous-dossier",
          },
          status: {
            content: "Statut",
          },
          preview: {
            content: "Aperçu",
          },
          pinned: {
            content: "Épinglé",
          },
          archived: {
            content: "Archivé",
          },
          streamingState: {
            content: "État du streaming",
          },
          createdAt: {
            content: "Créé le",
          },
          updatedAt: {
            content: "Mis à jour le",
          },
          canEdit: {
            content: "Peut modifier",
          },
          canPost: {
            content: "Peut publier",
          },
          canModerate: {
            content: "Peut modérer",
          },
          canDelete: {
            content: "Peut supprimer",
          },
          canManagePermissions: {
            content: "Peut gérer les autorisations",
          },
        },
      },
      totalCount: {
        content: "Total",
      },
      pageCount: {
        content: "Nombre de pages",
      },
      page: {
        content: "Page actuelle",
      },
      limit: {
        content: "Éléments par page",
      },
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Paramètres de requête invalides",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Vous devez être connecté pour voir les fils",
      },
      forbidden: {
        title: "Accès refusé",
        description: "Vous n'avez pas l'autorisation de voir les fils",
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
      description: "Fils récupérés",
    },
  },
  post: {
    title: "Nouveau fil",
    titleShort: "Nouveau fil",
    description: "Créer un nouveau fil de discussion",
    form: {
      title: "Créer un fil",
      description: "Configurer le nouveau fil",
    },
    sections: {
      thread: {
        title: "Détails du fil",
        description: "Informations de base du fil",
      },
    },
    id: {
      label: "ID du fil",
      description: "ID du fil généré par le client",
    },
    threadTitle: {
      label: "Titre",
      description: "Titre du fil",
      placeholder: "Saisissez le titre du fil...",
      default: "Nouveau chat",
    },
    rootFolderId: {
      label: "Dossier racine",
      description: "Dossier racine (private, shared, public, incognito)",
    },
    subFolderId: {
      label: "Sous-dossier",
      description: "Sous-dossier où placer le fil (facultatif)",
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
      placeholder: "Saisissez le prompt système...",
    },
    response: {
      title: "Fil créé",
      description: "Détails du fil créé",
      thread: {
        title: "Fil",
        id: {
          content: "ID du fil",
        },
        threadTitle: {
          content: "Titre",
        },
        rootFolderId: {
          content: "Dossier racine",
        },
        subFolderId: {
          content: "ID du sous-dossier",
        },
        status: {
          content: "Statut",
        },
        createdAt: {
          content: "Créé le",
        },
        updatedAt: {
          content: "Mis à jour le",
        },
        canEdit: {
          content: "Peut modifier",
        },
        canPost: {
          content: "Peut publier",
        },
        canModerate: {
          content: "Peut modérer",
        },
        canDelete: {
          content: "Peut supprimer",
        },
        canManagePermissions: {
          content: "Peut gérer les autorisations",
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
        description: "Vous devez être connecté pour créer des fils",
      },
      forbidden: {
        title: "Accès refusé",
        description: "Vous n'avez pas l'autorisation de créer des fils",
        incognitoNotAllowed:
          "Les fils incognito ne peuvent pas être créés sur le serveur",
        cannotCreateHere: "Vous ne pouvez pas créer de fil à cet endroit",
      },
      notFound: {
        title: "Introuvable",
        description: "Ressource introuvable",
        folderNotFound: "Dossier introuvable",
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
        description: "Un fil portant ce nom existe déjà",
      },
    },
    success: {
      title: "Succès",
      description: "Fil créé",
    },
  },
  widget: {
    common: {
      noChatsFound: "Aucun chat trouvé",
      delete: "Supprimer",
      cancel: "Annuler",
    },
    actions: {
      menu: "Actions du fil",
      rename: "Renommer",
      unpin: "Désépingler",
      pin: "Épingler en haut",
      unarchive: "Désarchiver",
      archive: "Archiver",
      manageSharing: "Gérer le partage",
      moveToFolder: "Déplacer vers un dossier",
      unfiled: "Sans dossier",
    },
    folderList: {
      managePermissions: "Gérer les autorisations",
      today: "Aujourd'hui",
      lastWeek: "7 derniers jours",
      lastMonth: "30 derniers jours",
      older: "Plus ancien",
    },
    threadList: {
      deleteDialog: {
        title: "Supprimer le fil",
        description:
          "Voulez-vous vraiment supprimer « {{title}} » ? Cette action est irréversible : tous les messages de ce fil seront définitivement supprimés.",
      },
    },
    suggestedPrompts: {
      starters: {
        explain: {
          label: "Expliquer simplement",
          prompt:
            "Explique-moi l'inflation comme si j'avais 12 ans. Court et concret.",
        },
        search: {
          label: "Chercher sur le web",
          prompt:
            "Quelles ont été les plus grosses actus tech de la semaine ? Fais une recherche et donne-moi tes sources.",
        },
        image: {
          label: "Créer une image",
          prompt:
            "Génère l'image d'un chalet douillet dans une tempête de neige, la nuit, avec une lumière chaude aux fenêtres.",
        },
        honest: {
          label: "Avoir l'avis franc",
          prompt:
            "Donne-moi les meilleurs arguments pour et contre la crypto. Sans détour, sans avertissements.",
        },
      },
      takeTour: "Faire la visite en 1 minute",
      backgroundTitle: "Vos agents IA travaillent",
      backgroundDescription:
        "Les sous-agents et agents autonomes en arrière-plan exécutent leurs tâches ici pendant que vous faites autre chose. Les résultats arrivent automatiquement.",
    },
    emptyState: {
      changeCompanion: "Changer de compagnon ou de modèle. Actuel : {{name}}",
      folder: {
        private: { label: "Privé", note: "Synchronisé avec votre compte." },
        incognito: {
          label: "Incognito",
          note: "Uniquement dans ce navigateur. Jamais synchronisé.",
        },
        shared: {
          label: "Partagé",
          note: "Toute personne ayant le lien peut le lire.",
        },
        public: { label: "Public", note: "Visible par tous." },
        cron: {
          label: "Arrière-plan",
          note: "Les agents y travaillent en autonomie.",
        },
        remote: {
          label: "Distant",
          note: "S'exécute sur votre instance connectée.",
        },
      },
      use: {
        everyday: {
          good: "Recherche, rédaction et tâches du quotidien",
          weak: "Prudent sur la politique",
        },
        politics: {
          good: "Réponses franches sur la politique et les sujets tabous",
          weak: "Texte uniquement, moins pointu sur les tâches complexes",
        },
        security: {
          good: "Sécurité offensive et défensive",
          weak: "Prudent sur la politique",
        },
        writing: {
          good: "Rédaction soignée, code et analyse",
          weak: "Esquive ou refuse les sujets sensibles",
        },
        images: {
          good: "Lit les captures d'écran, photos et vidéos",
          weak: "Prudent sur les sujets sensibles",
        },
        classic: {
          good: "Polyvalent et fiable pour le code et la planification",
          weak: "Prudent sur les sujets sensibles",
        },
        bold: {
          good: "Réponses franches et tranchées",
          weak: "Pas le bon choix pour la politique",
        },
        general: {
          good: "Questions générales",
          weak: "Pas le bon choix pour la politique",
        },
      },
      mode: {
        autoModel: "Choisi automatiquement",
        goodAt: "Points forts :",
        weakAt: "Points faibles :",
      },
      spotlight: {
        title: "Choisissez comment {{name}} travaille.",
        subtitle:
          "Chaque mode utilise un modèle différent. Ou écrivez directement pour commencer.",
        now: "Mode actuel",
        runsOn: "Tourne sur",
        allModes: "Tous les modes",
        more: "Plus de modes",
        fix: {
          politics: "Politique ? Passez à {{mode}}",
          complex: "Tâche complexe ? Passez à {{mode}}",
        },
      },
      single: {
        title: "{{name}} utilise un seul modèle.",
        action: "Passez à {{companion}} pour plus de modes",
      },
      companion: {
        title: "Qui doit répondre ?",
        subtitle:
          "Chaque compagnon a sa propre personnalité et un ensemble de modèles pour différentes tâches.",
        skip: "Ou écrivez directement pour commencer sans compagnon.",
        skipModel: "Ou écrivez directement. {{model}} répond, sans persona.",
        about: {
          thea: "Chaleureuse et réfléchie. Prend le temps d'en parler.",
          hermes: "Direct et rapide. Fait le travail.",
        },
      },
      custom: {
        title: "Votre compétence personnalisée est prête.",
        subtitle:
          "Changez de compétence ou de modèle depuis le sélecteur sous la zone de message.",
      },
    },
  },
  publicFeed: {
    timestamp: {
      justNow: "À l'instant",
      hoursAgo: "il y a {{hours}} h",
      daysAgo: "il y a {{days}} j",
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
};
