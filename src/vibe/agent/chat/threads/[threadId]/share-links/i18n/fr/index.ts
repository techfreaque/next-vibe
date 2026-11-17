import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Chat",
  tags: {
    sharing: "Partage",
  },
  // Top-level keys used across methods
  empty: "", // For hidden/internal fields
  linkId: {
    label: "ID du lien",
  },
  label: {
    label: "Libellé",
    description: "Libellé facultatif pour identifier ce lien",
    placeholder: "Saisissez un libellé pour ce lien de partage",
  },
  allowPosting: {
    label: "Autoriser les messages",
    description:
      "Autoriser les destinataires à publier des messages dans ce fil",
  },
  requireAuth: {
    label: "Exiger une connexion",
    description: "Les utilisateurs doivent se connecter pour accéder à ce lien",
  },
  shareLink: {
    label: "Libellé",
    shareUrl: "URL de partage",
    active: "Actif",
    allowPosting: "Messages autorisés",
    requireAuth: "Connexion requise",
    accessCount: "Nombre d'accès",
    lastAccessedAt: "Dernier accès",
    createdAt: "Créé le",
    editAction: "Modifier",
    deleteAction: "Révoquer",
  },
  shareLinks: {
    emptyTitle: "Aucun lien de partage",
    emptyDescription:
      "Créez un lien de partage pour partager ce fil avec d'autres personnes",
  },
  get: {
    title: "Récupérer les liens de partage",
    titleShort: "Liens de partage",
    description: "Récupérer tous les liens de partage d'un fil",
    container: {
      title: "Liens de partage",
      description: "Tous les liens de partage de ce fil",
    },
    response: {
      shareLink: {
        title: "Lien de partage",
        id: {
          content: "ID du lien",
        },
        token: {
          content: "Jeton de partage",
        },
        label: {
          content: "Libellé",
        },
        allowPosting: {
          content: "Messages autorisés",
        },
        requireAuth: {
          content: "Connexion requise",
        },
        active: {
          content: "Actif",
        },
        accessCount: {
          content: "Nombre d'accès",
        },
        lastAccessedAt: {
          content: "Dernier accès",
        },
        createdAt: {
          content: "Créé le",
        },
        editAction: {
          text: "Modifier",
        },
        deleteAction: {
          text: "Révoquer",
        },
      },
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Paramètres de requête invalides",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Vous devez être connecté pour voir les liens de partage",
      },
      forbidden: {
        title: "Accès refusé",
        description:
          "Vous n'avez pas l'autorisation de voir ces liens de partage",
      },
      removed: {
        title: "Retiré ou en cours d'examen",
        description: "Ce fil partagé a été signalé et n'est plus disponible.",
      },
      notFound: {
        title: "Introuvable",
        description: "Fil ou lien de partage introuvable",
      },
      server: {
        title: "Erreur serveur",
        description: "Impossible de récupérer les liens de partage",
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
        description: "Cette ressource a été modifiée",
      },
    },
    backButton: {
      label: "Retour",
    },
    success: {
      title: "Succès",
      description: "Liens de partage récupérés",
    },
  },
  post: {
    title: "Créer un lien de partage",
    titleShort: "Lien de partage",
    description: "Créer un nouveau lien de partage pour un fil",
    container: {
      title: "Nouveau lien de partage",
      description: "Configurez votre nouveau lien de partage",
    },
    label: {
      label: "Libellé",
      description: "Libellé facultatif pour identifier ce lien",
      placeholder: "Saisissez un libellé pour ce lien de partage",
    },
    allowPosting: {
      label: "Autoriser les messages",
      description:
        "Autoriser les destinataires à publier des messages dans ce fil",
    },
    requireAuth: {
      label: "Exiger une connexion",
      description:
        "Les utilisateurs doivent se connecter pour accéder à ce lien",
    },
    response: {
      id: {
        content: "ID du lien",
      },
      token: {
        content: "Jeton de partage",
      },
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Paramètres du lien de partage invalides",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Vous devez être connecté pour créer des liens de partage",
      },
      forbidden: {
        title: "Accès refusé",
        description:
          "Seuls les fils du dossier Partagé peuvent être partagés par lien",
      },
      notFound: {
        title: "Introuvable",
        description: "Fil introuvable",
      },
      server: {
        title: "Erreur serveur",
        description: "Impossible de créer le lien de partage",
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
        description: "Cette ressource a été modifiée",
      },
    },
    backButton: {
      label: "Retour",
    },
    submitButton: {
      label: "Créer le lien",
      loadingText: "Création…",
    },
    success: {
      title: "Succès",
      description: "Lien de partage créé",
    },
  },
  patch: {
    title: "Modifier le lien de partage",
    titleShort: "Modifier le lien",
    description: "Modifier un lien de partage existant",
    container: {
      title: "Modifier le lien de partage",
      description: "Modifier les paramètres du lien de partage",
    },
    linkId: {
      label: "ID du lien",
      description: "ID du lien à modifier",
    },
    label: {
      label: "Libellé",
      description: "Libellé facultatif pour identifier ce lien",
      placeholder: "Saisissez un libellé pour ce lien de partage",
    },
    allowPosting: {
      label: "Autoriser les messages",
      description:
        "Autoriser les destinataires à publier des messages dans ce fil",
    },
    requireAuth: {
      label: "Exiger une connexion",
      description:
        "Les utilisateurs doivent se connecter pour accéder à ce lien",
    },
    deleteAction: {
      text: "Révoquer le lien",
    },
    response: {
      id: {
        content: "ID du lien",
      },
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Paramètres de modification invalides",
      },
      unauthorized: {
        title: "Non autorisé",
        description:
          "Vous devez être connecté pour modifier des liens de partage",
      },
      forbidden: {
        title: "Accès refusé",
        description: "Vous n'avez pas l'autorisation de modifier ce lien",
      },
      notFound: {
        title: "Introuvable",
        description: "Lien de partage introuvable",
      },
      server: {
        title: "Erreur serveur",
        description: "Impossible de modifier le lien de partage",
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
        description: "Cette ressource a été modifiée",
      },
    },
    backButton: {
      label: "Retour",
    },
    submitButton: {
      label: "Enregistrer les modifications",
      loadingText: "Enregistrement…",
    },
    success: {
      title: "Succès",
      description: "Lien de partage modifié",
    },
  },
  delete: {
    title: "Révoquer le lien de partage",
    titleShort: "Révoquer le lien",
    description: "Révoquer un lien de partage actif",
    container: {
      title: "Révoquer le lien de partage",
      description: "Le lien sera désactivé définitivement",
    },
    linkId: {
      label: "ID du lien",
      description: "ID du lien à révoquer",
    },
    response: {
      id: {
        content: "ID du lien",
      },
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "ID de lien invalide",
      },
      unauthorized: {
        title: "Non autorisé",
        description:
          "Vous devez être connecté pour révoquer des liens de partage",
      },
      forbidden: {
        title: "Accès refusé",
        description: "Vous n'avez pas l'autorisation de révoquer ce lien",
      },
      notFound: {
        title: "Introuvable",
        description: "Lien de partage introuvable",
      },
      server: {
        title: "Erreur serveur",
        description: "Impossible de révoquer le lien de partage",
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
        description: "Cette ressource a été modifiée",
      },
    },
    backButton: {
      label: "Retour",
    },
    submitButton: {
      label: "Révoquer le lien",
      loadingText: "Révocation…",
    },
    success: {
      title: "Succès",
      description: "Lien de partage révoqué",
    },
  },
  widget: {
    shareDialog: {
      title: "Partager",
      copyLink: "Copier le lien",
    },
    visibility: {
      publicTitle: "Toute personne ayant le lien peut voir",
      publicDescription:
        "Le fil est dans le dossier Partagé : le lien est actif.",
      privateTitle: "Privé",
      privateDescription: "Vous seul pouvez accéder à ce fil.",
      makePublic: "Rendre public",
      makePrivate: "Rendre privé",
      toggling: "Enregistrement...",
    },
    emailShare: {
      placeholder: "Inviter par e-mail",
      send: "Envoyer",
    },
    common: {
      close: "Terminé",
    },
  },
};
