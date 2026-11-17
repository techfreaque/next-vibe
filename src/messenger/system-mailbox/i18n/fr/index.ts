import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Boîte mail de la plateforme",
  tag: "Boîte mail de la plateforme",

  task: {
    description:
      "Rédige le rapport interne quotidien et l'envoie depuis la boîte mail de la plateforme",
  },

  send: {
    title: "Envoyer un e-mail plateforme",
    titleShort: "Envoyer un e-mail",
    description:
      "Envoie un e-mail transactionnel depuis la boîte mail de la plateforme et le classe dans Envoyés",
    container: {
      title: "Envoyer un e-mail plateforme",
      description:
        "Un destinataire, un message. Classé dans Envoyés après livraison.",
    },
    fields: {
      to: {
        label: "Destinataire",
        description: "Une seule adresse e-mail",
        placeholder: "nom@example.com",
      },
      subject: {
        label: "Objet",
        description: "Ligne d'objet",
        placeholder: "De quoi s'agit-il ?",
      },
      body: {
        label: "Message",
        description: "Corps en texte brut",
        placeholder: "Rédigez le message...",
      },
      html: {
        label: "Corps HTML",
        description: "Version HTML simple, facultative",
        placeholder: "<p>HTML facultatif</p>",
      },
    },
    response: {
      messageId: "ID du message",
      from: "De",
      to: "À",
      storedInSent: "Classé dans Envoyés",
      sentFolder: "Dossier Envoyés",
      sentLastHour: "Envoyés dans la dernière heure",
      rateLimitPerHour: "Limite horaire",
    },
    widget: {
      submit: "Envoyer l'e-mail",
      submitting: "Envoi...",
      sent: "E-mail envoyé",
      filed: "Classé dans Envoyés",
      notFiled: "Livré, mais pas classé dans Envoyés",
      yes: "Oui",
      no: "Non",
    },
    success: {
      title: "E-mail envoyé",
      description: "Le message a été remis au serveur de messagerie",
    },
  },

  inbox: {
    title: "Boîte de réception plateforme",
    titleShort: "Réception",
    description:
      "Liste les messages récents de la boîte de réception de la plateforme",
    container: {
      title: "Boîte de réception plateforme",
      description:
        "Les plus récents d'abord. La lecture ne marque jamais un message comme lu.",
    },
    fields: {
      limit: {
        label: "Limite",
        description: "Nombre de messages à renvoyer (1-50)",
        placeholder: "20",
      },
      unreadOnly: {
        label: "Non lus uniquement",
        description: "Ne renvoyer que les messages non lus",
      },
    },
    response: {
      address: "Boîte mail",
      messages: {
        title: "Messages",
        uid: "UID",
        from: "De",
        subject: "Objet",
        date: "Date",
        snippet: "Extrait",
        unread: "Non lu",
      },
    },
    widget: {
      submit: "Actualiser la boîte",
      submitting: "Chargement...",
      empty: "Aucun message",
      emptyDescription: "Aucun message ne correspond à ces filtres.",
      unread: "Non lu",
      noSubject: "(sans objet)",
      open: "Ouvrir",
    },
    success: {
      title: "Boîte de réception chargée",
      description: "Messages récupérés depuis la boîte mail de la plateforme",
    },
  },

  message: {
    title: "Lire un e-mail plateforme",
    titleShort: "Lire l'e-mail",
    description:
      "Récupère un message de la boîte de réception de la plateforme par son UID",
    container: {
      title: "Lire un e-mail plateforme",
      description: "Corps complet d'un message. Ne le marque pas comme lu.",
    },
    fields: {
      uid: {
        label: "UID",
        description: "UID du message tiré de la liste de réception",
        placeholder: "42",
      },
    },
    response: {
      uid: "UID",
      from: "De",
      to: "À",
      subject: "Objet",
      date: "Date",
      messageId: "ID du message",
      unread: "Non lu",
      bodyText: "Corps",
    },
    widget: {
      submit: "Lire le message",
      submitting: "Chargement...",
      unread: "Non lu",
      noSubject: "(sans objet)",
    },
    success: {
      title: "Message chargé",
      description: "Message récupéré depuis la boîte mail de la plateforme",
    },
  },

  report: {
    title: "Rapport d'état quotidien",
    titleShort: "Rapport quotidien",
    description:
      "Rédige le rapport plateforme des dernières 24 h et l'envoie depuis la boîte mail de la plateforme",
    container: {
      title: "Rapport d'état quotidien",
      description:
        "Inscriptions, abonnements, crédits dépensés, funnel, incidents de tâches et erreurs. Texte brut.",
    },
    fields: {
      to: {
        label: "Destinataire",
        description:
          "Laisser vide pour utiliser l'adresse de rapport configurée",
        placeholder: "nom@example.com",
      },
      dryRun: {
        label: "Aperçu uniquement",
        description: "Rédiger le rapport sans l'envoyer",
      },
    },
    response: {
      subject: "Objet",
      body: "Rapport",
      recipient: "Destinataire",
      sent: "Envoyé",
      sections: "Sections incluses",
      skippedSections: "Sections ignorées",
    },
    widget: {
      submit: "Envoyer le rapport",
      submitting: "Rédaction...",
      sent: "Rapport envoyé",
      preview: "Aperçu",
    },
    success: {
      title: "Rapport prêt",
      description: "Le rapport d'état quotidien a été rédigé",
    },
  },

  errors: {
    unauthorized: {
      title: "Non autorisé",
      description: "Authentification requise",
    },
    forbidden: {
      title: "Accès refusé",
      description:
        "Seuls les administrateurs peuvent utiliser la boîte mail de la plateforme",
    },
    server: {
      title: "Erreur serveur",
      description: "La requête vers la boîte mail de la plateforme a échoué",
    },
    unknown: {
      title: "Erreur inconnue",
      description: "Une erreur inconnue est survenue",
    },
    validation: {
      title: "Erreur de validation",
      description: "Paramètres de requête non valides",
    },
    notConfigured:
      "La boîte mail de la plateforme n'est pas configurée. Définissez THEA_MAIL_ADDRESS, THEA_MAIL_HOST et THEA_MAIL_PASSWORD.",
    invalidRecipient:
      "Le destinataire doit être une seule adresse e-mail valide",
    noRecipient:
      "Aucun destinataire. Indiquez-en un ou définissez THEA_MAIL_REPORT_TO.",
    rateLimited:
      "Limite d'envoi horaire atteinte ({{sent}} sur {{limit}}). Réessayez plus tard.",
    smtpFailed: "Le serveur de messagerie a rejeté le message : {{error}}",
    imapFailed: "Impossible de joindre la boîte mail : {{error}}",
    messageNotFound: "Aucun message avec cet UID dans la boîte de réception",
    reportFailed: "Impossible de rédiger le rapport : {{error}}",
  },
};
