import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Chat",
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
    messages: "Messages",
  },
  loadingOlderMessages: "Chargement des messages plus anciens...",
  loadingNewerMessages: "Chargement des messages plus récents...",
  scrollUpForOlderMessages:
    "Faites défiler vers le haut pour les messages plus anciens",
  showOlderMessages: "Afficher les messages plus anciens",
  showNewerMessages: "Afficher les messages plus récents",
  transcribing: "Transcription de l'audio...",
  uploadingAttachments: "Envoi des fichiers...",
  gapFill: {
    transcribingAudio: "Transcription de l'audio…",
    analyzingImage: "Analyse de l'image…",
    describingVideo: "Description de la vidéo…",
    processingMedia: "Traitement du média…",
    variantUsing: "via {{model}}",
    variantCost: "{{cost}} crédits",
    transcription: "Transcription",
    imageDescription: "Description de l'image",
    videoDescription: "Description de la vidéo",
    showTranscription: "Afficher la transcription",
    hideTranscription: "Masquer la transcription",
    showImageDescription: "Afficher la description de l'image",
    hideImageDescription: "Masquer la description de l'image",
    showVideoDescription: "Afficher la description de la vidéo",
    hideVideoDescription: "Masquer la description de la vidéo",
  },
  errorCode: "Code d'erreur",
  errorActions: {
    retry: "Réessayer",
    tryAnotherModel: "Essayer un autre modèle",
  },
  streamInterrupted: {
    label: "Génération interrompue",
    hint: "Réponse partielle enregistrée. Envoyez un nouveau message pour continuer.",
  },
  errorFeedback: {
    autoReported: "Erreur signalée automatiquement",
    helpFix: "Aidez-nous à corriger ce problème",
    autoContext: "[Rapport d'erreur généré automatiquement]",
    errorLabel: "Erreur",
    causeLabel: "Cause",
    userContextLabel: "Ajoutez du contexte ici (facultatif)",
    separator: "·",
  },
  compacting: {
    title: "Historique compacté",
    loading: "Compactage de l'historique...",
    summarizing: "Résumé de la conversation...",
    failed: "Échec du compactage",
  },
  get: {
    title: "Lister les messages du fil",
    titleShort: "Messages",
    description: "Récupérer tous les messages d'un fil de discussion",
    container: {
      title: "Messages",
      description: "Liste des messages du fil",
    },
    threadId: {
      label: "ID du fil",
      description: "ID du fil dont récupérer les messages",
    },
    rootFolderId: {
      label: "Dossier racine",
      description: "Dossier racine du fil (utilisé pour le routage client)",
    },
    leafMessageId: {
      label: "ID du message feuille",
      description: "ID du message feuille de la branche actuelle",
    },
    response: {
      title: "Messages",
      description: "Liste des messages du fil",
      messages: {
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
          skill: {
            content: "Compétence",
          },
          tokens: {
            content: "Tokens",
          },
          sequenceId: {
            content: "ID de séquence",
          },

          toolCalls: {
            content: "Appels d'outils",
          },
          createdAt: {
            content: "Créé le",
          },
          updatedAt: {
            content: "Mis à jour le",
          },
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
        description: "Vous n'avez pas l'autorisation de voir ces messages",
        incognitoNotAllowed:
          "Les fils incognito ne sont pas accessibles sur le serveur",
      },
      notFound: {
        title: "Introuvable",
        description: "Fil introuvable",
      },
      server: {
        title: "Erreur serveur",
        description: "Une erreur interne du serveur s'est produite",
        detail: "Erreur serveur : {{error}}",
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
      description: "Messages récupérés",
    },
  },
  post: {
    title: "Créer un message",
    titleShort: "Créer un message",
    description: "Créer un nouveau message dans un fil de discussion",
    form: {
      title: "Nouveau message",
      description: "Créer un message dans le fil",
    },
    sections: {
      message: {
        title: "Détails du message",
        description: "Contenu et paramètres du message",
      },
    },
    threadId: {
      label: "ID du fil",
      description: "ID du fil auquel ajouter le message",
    },
    rootFolderId: {
      label: "Dossier racine",
      description: "Dossier racine du fil (utilisé pour le routage client)",
    },
    id: {
      label: "ID du message",
      description: "ID du message généré par le client",
    },
    content: {
      label: "Contenu",
      description: "Contenu du message",
      placeholder: "Saisissez le contenu du message...",
    },
    role: {
      label: "Rôle",
      description: "Rôle du message (user, assistant, system)",
    },
    parentId: {
      label: "Message parent",
      description: "ID du message parent pour créer une branche",
    },
    model: {
      label: "Modèle",
      description: "Modèle d'IA à utiliser pour la réponse",
    },
    skill: {
      label: "Compétence",
      description: "Compétence ou persona de l'IA pour ce message",
    },
    metadata: {
      label: "Métadonnées",
      description: "Métadonnées du message (pièces jointes, tokens, etc.)",
    },
    response: {
      title: "Message créé",
      description: "Détails du message créé",
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
        parentNotFound: "Message parent introuvable",
      },
      network: {
        title: "Erreur réseau",
        description: "Impossible de se connecter au serveur",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Vous devez être connecté pour créer des messages",
      },
      forbidden: {
        title: "Accès refusé",
        description: "Vous n'avez pas l'autorisation de créer des messages",
        incognitoNotAllowed:
          "Les fils incognito ne sont pas accessibles sur le serveur",
      },
      notFound: {
        title: "Introuvable",
        description: "Fil introuvable",
      },
      server: {
        title: "Erreur serveur",
        description: "Une erreur interne du serveur s'est produite",
        detail: "Erreur serveur : {{error}}",
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
      createFailed: {
        title: "Impossible de créer le message",
        description: "Une erreur s'est produite lors de la création du message",
      },
    },
    success: {
      title: "Succès",
      description: "Message créé",
    },
  },
  enums: {
    role: {
      user: "Utilisateur",
      assistant: "Assistant",
    },
  },
  debugView: {
    systemPromptTitle: "Prompt système",
    copied: "Copié !",
    systemMessageHint: "Message système (masqué pour les utilisateurs)",
    systemPromptLabel: "prompt système · en tête · en cache",
    upcomingContextLabel: "contexte assistant à venir · dernier message",
  },
  widget: {
    common: {
      send: "Envoyer",
      sending: "Envoi...",
      cancel: "Annuler",
      close: "Fermer",
      copyButton: {
        copied: "Copié !",
        copyToClipboard: "Copier dans le presse-papiers",
        copyAsMarkdown: "Copier en Markdown",
        copyAsText: "Copier en texte brut",
      },
      viewModeToggle: {
        linearView: "Vue linéaire",
        threadedView: "Vue arborescente",
        flatView: "Vue à plat",
        debugView: "Vue debug",
      },
      userMessageActions: {
        branch: "Créer une branche",
        retry: "Réessayer",
        deleteMessage: "Supprimer le message",
        cancelLoading: "Annuler le chargement",
        stopAudio: "Arrêter l'audio",
        playAudio: "Écouter ({{cost}} crédits)",
      },
      assistantMessageActions: {
        answerAsAI: "Répondre en tant qu'IA",
        cancelLoading: "Annuler le chargement",
        stopAudio: "Arrêter l'audio",
        playAudio: "Écouter ({{cost}} crédits)",
        actualCostUsed: "Coût réel",
        credits: "Crédits",
        tokens: "Tokens",
        tokensUsed: "Tokens utilisés",
        inputTokens: "Entrée",
        outputTokens: "Sortie",
        cachedTokens: "En cache",
        cachedPercent: "{{percent}} % en cache",
        cachedPercentTitle:
          "{{percent}} % des tokens d'entrée venaient du cache, ce qui réduit le coût",
        cached: "en cache",
        pipeline: "Pipeline",
        timeToFirstToken: "{{seconds}} s avant le premier token",
        timeToFirstTokenTitle: "Délai avant le premier token",
        streamingTime: "{{seconds}} s de streaming",
        streamingTimeTitle: "Durée totale du streaming",
        cacheWriteTokens: "Écriture cache",
        cacheWrite: "{{tokens}} écrits en cache",
        cacheWriteTitle:
          "{{tokens}} tokens écrits en cache pour cette requête (facturés au tarif d'écriture cache)",
        deleteMessage: "Supprimer le message",
        upvote: "Vote positif",
        downvote: "Vote négatif",
      },
      generatedMediaActions: {
        copy: "Copier",
        copied: "Copié",
        download: "Télécharger",
        showPrompt: "Afficher le prompt",
        hidePrompt: "Masquer le prompt",
      },
    },
    messages: {
      assistant: "Assistant",
      anonymous: "Anonyme",
      you: "Vous",
      edited: "modifié",
      branch: {
        previous: "Branche précédente",
        next: "Branche suivante",
      },
      authorWithId: "{{name}} ({{id}})",
    },
    linearView: {
      answerModal: {
        title: "Répondre en tant qu'IA",
        description: "Générer une réponse IA à ce message",
        inputPlaceholder: "Ajoutez du contexte pour l'IA...",
        confirmLabel: "Générer",
      },
      retryModal: {
        title: "Réessayer avec un autre modèle",
        description: "Régénérer cette réponse avec un autre modèle",
        confirmLabel: "Réessayer",
      },
    },
    threadedView: {
      replyModal: {
        title: "Répondre",
        description: "Envoyer un message en réponse à ce post",
        inputPlaceholder: "Écrivez votre réponse...",
        confirmLabel: "Répondre",
      },
      actions: {
        reply: "Répondre",
        replyToMessage: "Répondre à ce message",
        branch: "Créer une branche",
        branchMessage: "Modifier et créer une branche",
        retry: "Réessayer",
        retryWithDifferent: "Réessayer avec un autre modèle",
        answerAsAI: "Répondre en tant qu'IA",
        generateAIResponse: "Générer une réponse IA",
        cancelLoading: "Annuler le chargement",
        stop: "Arrêter",
        stopAudio: "Arrêter l'audio",
        playAudio: "Écouter ({{cost}} crédits)",
        delete: "Supprimer",
        deleteMessage: "Supprimer le message",
        share: "Partager",
        copyPermalink: "Copier le permalien",
        upvote: "Vote positif",
        downvote: "Vote négatif",
        play: "Lire",
        cancel: "Annuler",
        parent: "Aller au parent",
      },
      answerModal: {
        title: "Répondre en tant qu'IA",
        description: "Générer une réponse IA à ce message",
        inputPlaceholder: "Ajoutez du contexte pour l'IA...",
        confirmLabel: "Générer",
      },
      retryModal: {
        title: "Réessayer avec un autre modèle",
        description: "Régénérer cette réponse avec un autre modèle",
        confirmLabel: "Réessayer",
      },
      anonymous: "Anonyme",
      assistantFallback: "Assistant",
      userFallback: "Utilisateur",
      youLabel: "Vous",
      authorWithId: "{{name}} ({{id}})",
      reply: "réponse",
      replies: "réponses",
      expandReplies: "Déplier les réponses",
      collapseReplies: "Replier les réponses",
      continueThread: "Continuer le fil ({{count}} {{replyText}})",
    },
    flatView: {
      replyModal: {
        title: "Répondre",
        description: "Envoyer un message en réponse à ce post",
        inputPlaceholder: "Écrivez votre réponse...",
        confirmLabel: "Répondre",
      },
      actions: {
        reply: "Répondre",
        replyToMessage: "Répondre à ce message",
        branch: "Créer une branche",
        branchMessage: "Modifier et créer une branche",
        retry: "Réessayer",
        retryWithDifferent: "Réessayer avec un autre modèle",
        answerAsAI: "Répondre en tant qu'IA",
        generateAIResponse: "Générer une réponse IA",
        delete: "Supprimer",
        deleteMessage: "Supprimer le message",
        copyReference: "Copier la référence",
        upvote: "Vote positif",
        downvote: "Vote négatif",
      },
      answerModal: {
        title: "Répondre en tant qu'IA",
        description: "Générer une réponse IA à ce message",
        inputPlaceholder: "Ajoutez du contexte pour l'IA...",
        confirmLabel: "Générer",
      },
      retryModal: {
        title: "Réessayer avec un autre modèle",
        description: "Régénérer cette réponse avec un autre modèle",
        confirmLabel: "Réessayer",
      },
      anonymous: "Anonyme",
      assistantFallback: "Assistant",
      youLabel: "Vous",
      replyingTo: "En réponse à",
      replies: "Réponses :",
      clickToCopyRef: "Cliquez pour copier la référence",
      postsById: "{{count}} posts de cet ID",
      idLabel: "ID : {{id}}",
    },
    debugView: {
      systemMessageHint: "Message système (masqué pour les utilisateurs)",
    },
    userProfile: {
      recentPosts: "Posts récents",
      noPostsYet: "Aucun post pour l'instant",
      postCount: "{{count}} posts",
    },
    screenshot: {
      capture: "Faire une capture d'écran",
      capturing: "Capture en cours...",
    },
    shareDialog: {
      title: "Partager le fil",
    },
    messageEditor: {
      titles: {
        branch: "Modifier et créer une branche",
        reply: "Répondre",
        cancel: "Annuler",
      },
      hint: {
        branch: "Modifier crée une nouvelle branche",
        reply: "Écrivez votre réponse",
      },
    },
    input: {
      keyboardShortcuts: {
        press: "Appuyez sur",
        enter: "Entrée",
        shiftEnter: "Maj+Entrée",
        forNewLine: "pour aller à la ligne",
      },
    },
    voiceMode: {
      callMode: "Mode appel",
      callModeDescription: "L'IA répondra à voix haute",
      tapToRecord: "Touchez pour enregistrer",
    },
    batchToolConfirmation: {
      title: "Confirmer les appels d'outils groupés",
    },
    queue: {
      badge: "En file d'attente",
      cancelTooltip: "Retirer de la file et remettre dans la zone de saisie",
    },
  },
  flatView: {
    timestamp: {
      sun: "dim.",
      mon: "lun.",
      tue: "mar.",
      wed: "mer.",
      thu: "jeu.",
      fri: "ven.",
      sat: "sam.",
      format:
        "{{day}}/{{month}}/{{year}}({{dayName}}){{hours}}:{{mins}}:{{secs}}",
    },
  },
};
