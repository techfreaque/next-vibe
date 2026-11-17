import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Newsletter",
  tags: {
    newsletter: "Newsletter",
  },
  emailPlaceholder: "Saisissez votre e-mail",
  subscription: {
    unsubscribe: {
      title: "Se désabonner",
      confirmButton: "Confirmer le désabonnement",
      success: "Vous êtes désabonné",
      error: "Le désabonnement a échoué",
    },
  },
  unsubscribe: {
    page: {
      title: "Se désabonner",
      description:
        "Saisissez votre adresse, cliquez sur le bouton, c'est fait. Sans culpabilisation.",
      subtitle: "Gérez votre abonnement à la newsletter",
      emailProvided: {
        title: "Confirmer le désabonnement",
        description:
          "Cette adresse ne recevra plus notre newsletter. Un seul clic.",
      },
      unsubscribeButton: "Se désabonner",
      unsubscribing: "Désabonnement...",
      status: {
        subscribed: "Cette adresse reçoit notre newsletter.",
        notSubscribed: "Cette adresse n'est pas sur notre liste.",
      },
      subscribeText: "Vous avez changé d'avis ?",
      subscribeLink: "Se réabonner",
      info: {
        title: "Et ensuite ?",
        description: "Ce qu'il faut savoir sur le désabonnement :",
        immediate: {
          title: "Immédiat.",
          description:
            "Vous ne recevrez plus notre newsletter, dès maintenant.",
        },
        resubscribe: {
          title: "Réversible.",
          description:
            "Vous pouvez toujours vous réabonner si vous changez d'avis.",
        },
      },
      alternatives: {
        title: "Avant de partir",
        description: "Pensez à ces alternatives :",
        subscribe: "Réduire plutôt la fréquence des e-mails",
        contact: "Dites-nous ce qu'il faut améliorer",
      },
    },
  },
  email: {
    label: "Adresse e-mail",
    description: "L'adresse e-mail à désabonner de la newsletter",
    placeholder: "utilisateur@exemple.fr",
    unsubscribe: {
      title: "Désabonnement de la newsletter",
      preview: "Vous êtes désabonné de notre newsletter",
      greeting: "Bonjour",
      confirmation: "{{email}} est désabonné de notre newsletter",
      resubscribe_info:
        "Si vous changez d'avis, vous pouvez vous réabonner à tout moment depuis notre site",
      resubscribe_button: "Se réabonner",
      support_message: "Pour toute question, contactez notre équipe support",
      subject: "Confirmation de désabonnement de la newsletter",
      admin_unsubscribe_notification: {
        title: "Notification de désabonnement newsletter",
        preview: "Un utilisateur s'est désabonné de la newsletter",
        message: "Un utilisateur s'est désabonné de la newsletter",
        email: "E-mail",
        date: "Date",
        view_dashboard: "Voir le tableau de bord",
        subject: "Désabonnement newsletter : notification admin",
      },
    },
  },
  response: {
    success: "Désabonnement de la newsletter effectué",
    message: "Message de confirmation",
  },
  errors: {
    email_generation_failed: "Impossible de générer l'e-mail",
    internal: {
      title: "Erreur interne",
      description:
        "Une erreur est survenue lors du traitement de votre demande de désabonnement",
      detail: "Échec du désabonnement : {{error}}",
    },
  },
  post: {
    title: "Désabonnement de la newsletter",
    titleShort: "Se désabonner",
    description: "Se désabonner de la newsletter",
    form: {
      title: "Se désabonner de la newsletter",
      description:
        "Saisissez votre adresse e-mail pour vous désabonner de notre newsletter",
    },
    response: {
      title: "Réponse de désabonnement",
      description: "Confirmation du désabonnement de la newsletter",
    },
    errors: {
      unauthorized: {
        title: "Non autorisé",
        description: "Authentification requise",
      },
      validation: {
        title: "Erreur de validation",
        description: "Adresse e-mail invalide",
      },
      internal: {
        title: "Erreur interne",
        description:
          "Une erreur est survenue lors du traitement de votre demande de désabonnement",
      },
      forbidden: {
        title: "Interdit",
        description: "Accès interdit",
      },
    },
    success: {
      title: "Désabonnement effectué",
      description: "Vous êtes désabonné de notre newsletter",
    },
  },
  oneClick: {
    tag: "Désabonnement en un clic",
    post: {
      title: "Désabonnement en un clic",
      titleShort: "Se désabonner",
      description:
        "Désabonnement via le lien signé en un clic de l'en-tête de l'e-mail (RFC 8058)",
      container: {
        title: "Désabonnement en un clic",
        description:
          "Appelé par les fournisseurs de messagerie. Le jeton signé autorise le désabonnement.",
      },
      token: {
        label: "Jeton",
        description: "Jeton de désabonnement signé, issu de l'e-mail",
      },
      errors: {
        invalidToken: {
          title: "Lien invalide",
          description: "Ce lien de désabonnement n'est pas valide.",
        },
        server: {
          title: "Erreur serveur",
          description: "Le désabonnement a échoué. Réessayez.",
        },
        validation: {
          title: "Erreur de validation",
          description: "Format de jeton invalide",
        },
      },
      success: {
        title: "Désabonné",
        description: "Vous n'êtes plus sur la liste.",
      },
    },
  },
  sync: {
    failed: "Échec de la synchronisation des désabonnements newsletter",
    error: "Erreur de synchronisation des désabonnements newsletter",
    tag: "Synchro newsletter",
    post: {
      title: "Synchronisation des désabonnements newsletter",
      description:
        "Synchronise le statut des leads pour les désabonnements newsletter",
      container: {
        title: "Configuration de la synchronisation des désabonnements",
        description:
          "Configurer les paramètres de synchronisation des désabonnements",
      },
      fields: {
        batchSize: {
          label: "Taille de lot",
          description: "Nombre d'enregistrements traités par lot",
        },
        dryRun: {
          label: "Simulation",
          description: "Exécuter sans rien modifier",
        },
      },
      response: {
        leadsProcessed: "Leads traités",
        leadsUpdated: "Leads mis à jour",
        executionTimeMs: "Temps d'exécution (ms)",
      },
      errors: {
        unauthorized: {
          title: "Non autorisé",
          description: "Authentification requise",
        },
        forbidden: {
          title: "Interdit",
          description: "Accès interdit",
        },
        server: {
          title: "Erreur serveur",
          description:
            "Une erreur est survenue lors de la synchronisation des désabonnements",
        },
        unknown: {
          title: "Erreur inconnue",
          description: "Une erreur inconnue est survenue",
        },
        validation: {
          title: "Erreur de validation",
          description: "Paramètres de requête invalides",
        },
      },
      success: {
        title: "Synchronisation terminée",
        description: "Synchronisation des désabonnements newsletter terminée",
      },
    },
  },
  emailTemplates: {
    unsubscribe: {
      name: "E-mail de désabonnement newsletter",
      description:
        "E-mail de confirmation envoyé aux utilisateurs qui se désabonnent de la newsletter",
      category: "newsletter",
      preview: {
        email: {
          label: "Adresse e-mail",
          description: "L'adresse e-mail désabonnée",
        },
      },
    },
  },
  sms: {
    confirmation: {
      message:
        "Vous êtes désabonné de la newsletter {{appName}}. S'il s'agit d'une erreur, rendez-vous sur notre site pour vous réabonner.",
    },
    admin_notification: {
      message:
        "Désabonnement newsletter : {{email}} s'est désabonné de la newsletter.",
    },
    errors: {
      confirmation_failed: {
        title: "Échec du SMS de confirmation",
        description:
          "Impossible d'envoyer le SMS de confirmation de désabonnement",
      },
      admin_notification_failed: {
        title: "Échec du SMS de notification admin",
        description: "Impossible d'envoyer le SMS de notification admin",
      },
    },
  },
};
