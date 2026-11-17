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
  post: {
    title: "Voter pour un message",
    titleShort: "Voter",
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
        description: "Vous n'avez pas l'autorisation de voter pour ce message",
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
};
