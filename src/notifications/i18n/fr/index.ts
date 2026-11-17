import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Notifications",

  tags: {
    notifications: "notifications",
    list: "liste",
    unread: "non lues",
    read: "lues",
  },

  enums: {
    type: {
      taskComplete: "Tâche terminée",
      taskFailed: "Tâche échouée",
      earning: "Gain",
      dreamerResult: "Résultat Dreamer",
      creditLow: "Crédits bas",
      system: "Système",
    },
  },

  templates: {
    taskComplete: {
      title: "{{name}} est terminé",
      body: "Votre tâche en arrière-plan est terminée. Ouvrez le résultat.",
    },
    taskFailed: {
      title: "{{name}} a échoué",
      body: "Votre tâche en arrière-plan a rencontré une erreur. Ouvrez-la pour en voir la cause.",
    },
    earning: {
      title: "Vous avez gagné {{amount}} crédits",
      body: "Un gain de parrainage a passé sa période de blocage. Vous pouvez maintenant le dépenser.",
    },
    dreamerResult: {
      title: "{{name}} a un résultat",
      body: "Votre exécution Dreamer est terminée.",
    },
    creditLow: {
      title: "Vos crédits s'épuisent",
      body: "Il vous reste {{amount}} crédits. Rechargez avant que votre prochaine exécution ne bloque.",
    },
    system: {
      title: "{{name}}",
      body: "",
    },
    fallbackTaskName: "Tâche en arrière-plan",
  },

  list: {
    get: {
      title: "Notifications",
      titleShort: "Notifications",
      description:
        "Tout ce qui s'est terminé pendant votre absence. Les non lues d'abord.",
      emptyTitle: "Rien de nouveau",
      emptyHint: "Les tâches terminées et les gains apparaissent ici.",
      markAllRead: "Tout marquer comme lu",
      unread: "Non lues",
      response: {
        notifications: {
          id: "ID",
          type: "Type",
          title: "Titre",
          body: "Message",
          link: "Lien",
          read: "Lue",
          createdAt: "Reçue le",
        },
        unreadCount: "Non lues",
      },
      paginationInfo: {
        label: "Pagination",
      },
    },
  },

  unreadCount: {
    get: {
      title: "Nombre de notifications non lues",
      titleShort: "Non lues",
      description:
        "Le nombre de notifications que vous n'avez pas encore ouvertes.",
      response: {
        unreadCount: "Notifications non lues",
      },
    },
  },

  read: {
    post: {
      title: "Marquer les notifications comme lues",
      titleShort: "Marquer comme lu",
      description:
        "Marquez une notification, ou toutes, comme lues. Envoyez un id ou all=true.",
      id: {
        label: "ID de la notification",
        description: "La notification à marquer comme lue",
      },
      all: {
        label: "Tout marquer comme lu",
        description: "Vider toute la liste des non lues",
      },
      response: {
        updatedCount: "Marquées comme lues",
      },
      submit: {
        label: "Marquer comme lu",
        loading: "Mise à jour...",
      },
    },
  },

  bell: {
    label: "Notifications",
    empty: "Vous êtes à jour.",
    markAllRead: "Tout marquer comme lu",
    viewAll: "Tout voir",
    loading: "Chargement...",
    unreadBadge: "{{count}} notifications non lues",
  },

  errors: {
    validation: {
      title: "Erreur de validation",
      description: "Envoyez un id de notification, ou all=true",
    },
    network: {
      title: "Erreur réseau",
      description: "Erreur de connexion réseau",
    },
    unauthorized: {
      title: "Non autorisé",
      description: "Connectez-vous pour voir vos notifications",
    },
    forbidden: {
      title: "Accès interdit",
      description: "Accès refusé",
    },
    notFound: {
      title: "Introuvable",
      description: "Notification introuvable",
    },
    server: {
      title: "Erreur serveur",
      description: "Une erreur interne du serveur s'est produite",
    },
    serverError: {
      title: "Erreur serveur",
      description: "Une erreur interne du serveur s'est produite",
      detail: "Un problème est survenu de notre côté : {{error}}",
    },
    unknown: {
      title: "Erreur inconnue",
      description: "Une erreur inconnue s'est produite",
    },
    unsavedChanges: {
      title: "Modifications non enregistrées",
      description: "Vous avez des modifications non enregistrées",
    },
    conflict: {
      title: "Conflit",
      description: "Conflit d'état de la notification",
    },
    idOrAllRequired: "Envoyez un id de notification, ou all=true.",
  },

  success: {
    title: "Succès",
    description: "Opération réussie",
  },
};
