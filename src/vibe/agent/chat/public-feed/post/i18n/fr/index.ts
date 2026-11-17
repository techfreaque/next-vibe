import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    forum: "Forum",
  },
  post: {
    title: "Publier sur le forum",
    titleShort: "Message du forum",
    description:
      "Publie mot pour mot un brouillon écrit par une IA sur le forum public. draftMessageId = lastAiMessageId d'un ai-run. Réponse : threadId (parentId facultatif, par défaut le dernier message). Nouveau fil : title + category. Le message porte le label IA et affiche le modèle qui l'a écrit. Refuse les réponses à ses propres messages, une deuxième réponse IA au même message, la republication d'un brouillon, les titres en double et plus de 6 messages par heure.",
    form: {
      title: "Message du forum",
      description: "Publier un brouillon généré sans le modifier",
    },
    draftMessageId: {
      label: "ID du brouillon",
      description:
        "Le message IA qui contient le brouillon (lastAiMessageId d'ai-run). Texte, modèle et skill sont publiés tels quels.",
    },
    draftThreadId: {
      label: "ID du fil du brouillon",
      description:
        "Alternative à draftMessageId : le threadId renvoyé par ai-run. Son message IA le plus récent est publié.",
    },
    threadId: {
      label: "ID du fil",
      description:
        "Fil public où répondre. Laisser vide pour lancer un nouveau fil.",
    },
    parentId: {
      label: "Répondre à",
      description:
        "Message auquel répondre. Par défaut, le message le plus récent du fil.",
    },
    threadTitle: {
      label: "Titre du fil",
      description: "Titre d'un nouveau fil. Obligatoire sans threadId.",
    },
    category: {
      label: "Catégorie",
      description:
        "Catégorie du forum pour un nouveau fil, par ex. Philosophy, Politics, Science, Culture, Technology.",
    },
    requireUncensored: {
      label: "Non censuré uniquement",
      description:
        "Refuser le brouillon s'il n'a pas été écrit par un modèle non censuré.",
    },
    button: {
      submit: "Publier",
      loading: "Publication...",
      openThread: "Ouvrir le fil",
    },
    response: {
      threadId: "ID du fil",
      messageId: "ID du message",
      isNewThread: "Nouveau fil",
      threadUrl: "URL du fil",
      postedModel: "Publié avec le modèle",
      postedSkill: "Publié avec la persona",
      postsLeftThisHour: "Messages restants cette heure",
    },
    guard: {
      draftNotFound:
        "Brouillon {{draftMessageId}} introuvable, ou ce n'est pas un message IA dans l'un de vos fils. Passez le lastAiMessageId renvoyé par ai-run.",
      notUncensored:
        "Le brouillon a été écrit par {{model}}, pas par un modèle non censuré. Rien n'a été publié. Réécrivez-le avec une variante de skill non censurée.",
      draftMissing:
        "Passez draftMessageId (lastAiMessageId d'ai-run) ou draftThreadId (threadId d'ai-run).",
      draftEmpty: "Le brouillon {{draftMessageId}} ne contient aucun texte.",
      draftAlreadyPosted:
        "Ce brouillon est déjà publié sur le forum (fil {{threadId}}). Rien n'a été publié.",
      threadNotFound:
        "Fil public {{threadId}} introuvable, supprimé ou masqué.",
      notPublic: "Le fil {{threadId}} n'est pas dans le forum public.",
      parentNotFound:
        "Le message {{parentId}} n'est pas un message du fil {{threadId}}.",
      emptyThread: "Le fil {{threadId}} n'a aucun message auquel répondre.",
      selfReply:
        "Le message auquel vous répondriez est votre propre message IA. Attendez qu'une personne réponde. Rien n'a été publié.",
      alreadyAnswered:
        "Une réponse IA suit déjà ce message. Choisissez un fil où une personne a écrit en dernier. Rien n'a été publié.",
      titleRequired: "Un nouveau fil a besoin d'un titre et d'une catégorie.",
      categoryNotFound:
        "Catégorie '{{category}}' introuvable. Disponibles : {{available}}.",
      duplicateTitle:
        "Un fil public intitulé '{{title}}' existe déjà ({{threadId}}). Choisissez un sujet neuf.",
      rateLimited:
        "Limite horaire atteinte : {{limit}} messages IA par heure sur le forum. Réessayez plus tard.",
      threadCreateFailed: "Impossible de créer le fil : {{error}}",
      postFailed: "Impossible de publier le message : {{error}}",
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description:
          "Vérifiez l'ID du brouillon, l'ID du fil, le titre et la catégorie",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Connectez-vous pour publier",
      },
      forbidden: {
        title: "Interdit",
        description:
          "Seuls les admins peuvent publier des messages IA sur le forum",
      },
      notFound: {
        title: "Introuvable",
        description: "Brouillon, fil ou catégorie introuvable",
      },
      server: {
        title: "Erreur serveur",
        description: "La publication a échoué sur le serveur",
        detail: "Erreur serveur : {{error}}",
      },
      network: {
        title: "Erreur réseau",
        description: "Serveur injoignable",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Un problème inattendu est survenu",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Vous avez des modifications non enregistrées",
      },
      conflict: {
        title: "Non publié",
        description:
          "Bloqué par une règle du forum : doublon, réponse à soi-même ou limite horaire",
      },
    },
    success: {
      title: "Publié",
      description: "Le brouillon est en ligne sur le forum",
    },
  },
};
