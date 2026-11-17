import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Chat",
  tags: {
    messages: "Messages",
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
  chat: {
    enums: {
      role: {
        user: "Utilisateur",
        assistant: "Assistant",
        system: "Système",
        tool: "Outil",
        error: "Erreur",
      },
    },
  },
  get: {
    title: "Récupérer un message",
    titleShort: "Message",
    description: "Récupérer un message précis par son ID",
    container: {
      title: "Détails du message",
      description: "Voir les informations du message",
    },
    threadId: {
      label: "ID du fil",
      description: "ID du fil contenant le message",
    },
    messageId: {
      label: "ID du message",
      description: "ID du message à récupérer",
    },
    rootFolderId: {
      label: "Dossier racine",
      description: "Dossier racine du fil (utilisé pour le routage client)",
    },
    response: {
      title: "Message",
      description: "Détails du message",
      message: {
        title: "Message",
        id: {
          content: "ID du message",
        },
        threadId: {
          content: "ID du fil",
        },
        role: {
          content: "Rôle",
        },
        content: {
          content: "Contenu",
        },
        parentId: {
          content: "ID du message parent",
        },
        authorId: {
          content: "ID de l'auteur",
        },
        isAI: {
          content: "IA",
        },
        model: {
          content: "Modèle",
        },
        tokens: {
          content: "Tokens",
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
        description: "Paramètres de requête invalides",
      },
      network: {
        title: "Erreur réseau",
        description: "Impossible de se connecter au serveur",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Vous devez être connecté pour voir les messages",
      },
      forbidden: {
        title: "Accès refusé",
        description: "Vous n'avez pas l'autorisation de voir ce message",
      },
      notFound: {
        title: "Introuvable",
        description: "Message introuvable",
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
      threadNotFound: {
        title: "Fil introuvable",
        description: "Le fil indiqué n'existe pas",
      },
      messageNotFound: {
        title: "Message introuvable",
        description: "Le message indiqué n'existe pas",
      },
    },
    backButton: {
      label: "Retour",
    },
    success: {
      title: "Succès",
      description: "Message récupéré",
    },
  },
  patch: {
    title: "Modifier le message",
    titleShort: "Modifier le message",
    description: "Modifier le contenu d'un message",
    container: {
      title: "Modifier le message",
      description: "Modifier le contenu du message",
    },
    form: {
      title: "Modifier le message",
      description: "Modifier le contenu du message",
    },
    sections: {
      message: {
        title: "Contenu du message",
        description: "Modifier le message",
      },
    },
    threadId: {
      label: "ID du fil",
      description: "ID du fil contenant le message",
    },
    messageId: {
      label: "ID du message",
      description: "ID du message à modifier",
    },
    rootFolderId: {
      label: "Dossier racine",
      description: "Dossier racine du fil (utilisé pour le routage client)",
    },
    content: {
      label: "Contenu",
      description: "Nouveau contenu du message",
      placeholder: "Saisissez le contenu du message...",
    },
    role: {
      label: "Rôle",
      description: "Rôle du message (user, assistant, system)",
    },
    response: {
      title: "Message modifié",
      description: "Détails du message modifié",
      message: {
        title: "Message",
        id: {
          content: "ID du message",
        },
        threadId: {
          content: "ID du fil",
        },
        role: {
          content: "Rôle",
        },
        content: {
          content: "Contenu",
        },
        parentId: {
          content: "ID du message parent",
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
        description: "Données du message invalides",
      },
      network: {
        title: "Erreur réseau",
        description: "Impossible de se connecter au serveur",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Vous devez être connecté pour modifier des messages",
      },
      forbidden: {
        title: "Accès refusé",
        description: "Vous n'avez pas l'autorisation de modifier ce message",
      },
      notFound: {
        title: "Introuvable",
        description: "Message introuvable",
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
      threadNotFound: {
        title: "Fil introuvable",
        description: "Le fil indiqué n'existe pas",
      },
      messageNotFound: {
        title: "Message introuvable",
        description: "Le message indiqué n'existe pas",
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
      description: "Message modifié",
    },
  },
  delete: {
    title: "Supprimer le message",
    titleShort: "Supprimer le message",
    description: "Supprimer un message du fil",
    container: {
      title: "Supprimer le message",
      description: "Retirer le message du fil",
    },
    confirmTitle: "Supprimer le message",
    confirmText:
      "Voulez-vous vraiment supprimer ce message ? Cette action est irréversible.",
    backButton: {
      label: "Annuler",
    },
    submitButton: {
      label: "Supprimer",
      loadingText: "Suppression…",
    },
    deleteButton: {
      label: "Supprimer",
      loadingText: "Suppression…",
    },
    threadId: {
      label: "ID du fil",
      description: "ID du fil contenant le message",
    },
    messageId: {
      label: "ID du message",
      description: "ID du message à supprimer",
    },
    rootFolderId: {
      label: "Dossier racine",
      description: "Dossier racine du fil (utilisé pour le routage client)",
    },
    response: {
      success: { content: "Succès" },
      role: { content: "Rôle" },
      content: { content: "Contenu" },
      parentId: { content: "ID du message parent" },
      authorId: { content: "ID de l'auteur" },
      isAI: { content: "IA" },
      model: { content: "Modèle" },
      createdAt: { content: "Créé le" },
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Paramètres de requête invalides",
      },
      network: {
        title: "Erreur réseau",
        description: "Impossible de se connecter au serveur",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Vous devez être connecté pour supprimer des messages",
      },
      forbidden: {
        title: "Accès refusé",
        description: "Vous n'avez pas l'autorisation de supprimer ce message",
      },
      notFound: {
        title: "Introuvable",
        description: "Message introuvable",
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
        description: "Impossible de supprimer un message qui a des réponses",
      },
      threadNotFound: {
        title: "Fil introuvable",
        description: "Le fil indiqué n'existe pas",
      },
      messageNotFound: {
        title: "Message introuvable",
        description: "Le message indiqué n'existe pas",
      },
    },
    success: {
      title: "Succès",
      description: "Message supprimé",
    },
  },
  vote: {
    category: "Chat",
    tags: {
      messages: "Messages",
    },
    post: {
      title: "Voter pour un message",
      description: "Voter pour ou contre un message",
      container: {
        title: "Vote",
        description: "Donnez votre avis sur ce message",
      },
      form: {
        title: "Voter pour un message",
        description: "Voter pour, contre, ou retirer votre vote",
      },
      threadId: {
        label: "ID du fil",
        description: "ID du fil contenant le message",
      },
      messageId: {
        label: "ID du message",
        description: "ID du message à évaluer",
      },
      rootFolderId: {
        label: "Dossier racine",
        description: "Dossier racine du fil (utilisé pour le routage client)",
      },
      vote: {
        label: "Vote",
        description: "Votre vote : pour, contre, ou retrait",
        placeholder: "Choisissez un type de vote...",
        options: {
          upvote: "Vote positif",
          downvote: "Vote négatif",
          remove: "Retirer le vote",
        },
      },
      response: {
        title: "Résultat du vote",
        description: "Décompte des votes mis à jour",
        upvotes: {
          content: "Votes positifs",
        },
        downvotes: {
          content: "Votes négatifs",
        },
        userVote: {
          content: "Votre vote",
        },
      },
      errors: {
        validation: {
          title: "Erreur de validation",
          description: "Données de vote invalides",
        },
        network: {
          title: "Erreur réseau",
          description: "Impossible de se connecter au serveur",
        },
        unauthorized: {
          title: "Non autorisé",
          description: "Vous devez être connecté pour voter",
        },
        forbidden: {
          title: "Accès refusé",
          description:
            "Vous n'avez pas l'autorisation de voter pour ce message",
          incognitoNotAllowed:
            "Les fils incognito ne sont pas accessibles sur le serveur",
        },
        notFound: {
          title: "Introuvable",
          description: "Message introuvable",
        },
        server: {
          title: "Erreur serveur",
          description: "Impossible d'enregistrer le vote",
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
          description: "Conflit de vote",
        },
      },
      success: {
        title: "Vote enregistré",
        description: "Votre vote a bien été enregistré",
      },
    },
  },
};
