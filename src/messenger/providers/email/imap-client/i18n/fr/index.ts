import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Client IMAP",
  tag: "Client IMAP",
  tags: {
    health: "Santé",
    monitoring: "Surveillance",
    sync: "Synchronisation",
    accounts: "Comptes",
    folders: "Dossiers",
    messages: "Messages",
    config: "Configuration",
  },
  messages: {
    tag: "Messages",
    id: {
      widget: {
        markRead: "Marquer comme lu",
        markUnread: "Marquer comme non lu",
        flag: "Signaler",
        unflag: "Retirer le signalement",
      },
    },
    errors: {
      server: { title: "Erreur serveur" },
      notFound: { title: "Message introuvable" },
      accountNotFound: { title: "Compte introuvable" },
      syncFailed: { title: "Échec de la synchronisation" },
      syncSuccess: { message: "Messages synchronisés" },
      list: {
        get: {
          errors: {
            server: { title: "Erreur serveur lors du listage des messages" },
          },
        },
      },
    },
  },
  sync: {
    category: "Client IMAP",

    title: "Synchronisation IMAP",
    description: "Service de synchronisation IMAP",
    container: {
      title: "Configuration de la synchronisation IMAP",
      description: "Paramétrez la synchronisation IMAP",
    },
    accountIds: {
      label: "ID des comptes",
      description: "ID des comptes IMAP à synchroniser",
      placeholder: "Saisir les ID de comptes, séparés par des virgules",
    },
    force: {
      label: "Forcer la synchronisation",
      description: "Synchroniser même si une synchronisation est récente",
    },
    dryRun: {
      label: "Simulation",
      description: "Exécuter un test sans rien modifier",
    },
    maxMessages: {
      label: "Messages max.",
      description: "Nombre maximal de messages à synchroniser par dossier",
      placeholder: "Saisir le nombre maximal de messages",
    },
    post: {
      title: "Synchroniser",
      description: "Endpoint de synchronisation",
      form: {
        title: "Configuration de la synchronisation",
        description: "Paramétrez la synchronisation",
      },
      response: {
        title: "Réponse",
        description: "Données de réponse de la synchronisation",
        result: {
          title: "Résultats de la synchronisation",
          description: "Résultats détaillés de la synchronisation",
          accountsProcessed: "Comptes traités",
          foldersProcessed: "Dossiers traités",
          messagesProcessed: "Messages traités",
          messagesAdded: "Messages ajoutés",
          messagesUpdated: "Messages mis à jour",
          messagesDeleted: "Messages supprimés",
          duration: "Durée",
        },
        errors: {
          error: {
            title: "Erreur de synchronisation",
            description: "Détails de l'erreur",
            code: "Code d'erreur",
            message: "Message d'erreur",
          },
        },
      },
      errors: {
        unauthorized: {
          title: "Non autorisé",
          description: "Authentification requise",
        },
        validation: {
          title: "Erreur de validation",
          description: "Paramètres de requête non valides",
        },
        server: {
          title: "Erreur serveur",
          description: "Une erreur interne du serveur est survenue",
        },
        unknown: {
          title: "Erreur inconnue",
          description: "Une erreur inconnue est survenue",
        },
        network: {
          title: "Erreur réseau",
          description: "Une erreur réseau est survenue",
        },
        forbidden: {
          title: "Accès refusé",
          description: "Accès interdit",
        },
        notFound: {
          title: "Introuvable",
          description: "Ressource introuvable",
        },
        conflict: {
          title: "Conflit",
          description: "Un conflit de données est survenu",
        },
      },
      success: {
        title: "Succès",
        description: "Opération terminée",
      },
    },
    errors: {
      unauthorized: {
        title: "Non autorisé",
        description: "Authentification requise",
      },
      validation: {
        title: "Erreur de validation",
        description: "Paramètres de requête non valides",
      },
      server: {
        title: "Erreur serveur",
        description: "Une erreur interne du serveur est survenue",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inconnue est survenue",
      },
      forbidden: {
        title: "Accès refusé",
        description: "Accès interdit",
      },
    },
    success: {
      title: "Succès",
      description: "Opération terminée",
    },
    widget: {
      title: "Synchronisation IMAP complète",
      options: "Options de synchronisation",
      noAccounts: "Aucun compte IMAP configuré",
      result: "Résultat de la synchronisation",
      duration: "Durée",
      errors: "Erreurs",
      accountsProcessed: "Comptes traités",
      foldersProcessed: "Dossiers traités",
      messagesProcessed: "Messages traités",
      messagesAdded: "Messages ajoutés",
      messagesUpdated: "Messages mis à jour",
      messagesDeleted: "Messages supprimés",
      submit: "Lancer la synchronisation",
      submitting: "Synchronisation...",
    },
  },
  imapErrors: {
    accounts: {
      post: {
        error: {
          duplicate: {
            title: "Ce compte existe déjà",
          },
          server: {
            title: "Erreur serveur lors de la création du compte",
          },
        },
      },
      get: {
        error: {
          not_found: {
            title: "Compte introuvable",
          },
          server: {
            title: "Erreur serveur lors de la récupération du compte",
          },
        },
      },
      put: {
        error: {
          not_found: {
            title: "Compte introuvable",
          },
          duplicate: {
            title: "Un compte avec cet e-mail existe déjà",
          },
          server: {
            title: "Erreur serveur lors de la mise à jour du compte",
          },
        },
      },
      delete: {
        error: {
          not_found: {
            title: "Compte introuvable",
          },
          server: {
            title: "Erreur serveur lors de la suppression du compte",
          },
        },
        success: {
          title: "Compte supprimé",
        },
      },
    },
    folders: {
      get: {
        error: {
          not_found: {
            title: "Dossier introuvable",
          },
          server: {
            title: "Erreur serveur lors de la récupération du dossier",
          },
        },
      },
      sync: {
        error: {
          missing_account: {
            title: "Compte introuvable pour la synchronisation du dossier",
          },
        },
      },
    },
    messages: {
      get: {
        error: {
          not_found: {
            title: "Message introuvable",
          },
          server: {
            title: "Erreur serveur lors de la récupération du message",
          },
        },
      },
    },
    connection: {
      failed: "Échec de la connexion",
      timeout: {
        title: "Délai de connexion dépassé",
      },
      test: {
        failed: "Échec du test de connexion",
      },
      close: {
        failed: "Impossible de fermer la connexion",
      },
      folders: {
        list: {
          failed: "Impossible de lister les dossiers",
        },
      },
      messages: {
        list: {
          failed: "Impossible de lister les messages",
        },
      },
    },
    sync: {
      failed: "Échec de la synchronisation",
      account: {
        failed: "Échec de la synchronisation du compte : {{error}}",
      },
      folder: {
        failed: "Échec de la synchronisation du dossier",
      },
      message: {
        failed: "Échec de la synchronisation du message",
      },
      post: {
        error: {
          server: {
            title: "Erreur serveur pendant la synchronisation",
          },
        },
      },
    },
    validation: {
      account: {
        username: {
          required: "Le nom d'utilisateur est obligatoire",
        },
        port: {
          invalid: "Numéro de port non valide",
        },
        host: {
          invalid: "Hôte non valide",
        },
      },
    },
  },
  imap: {
    "example.com": "imap.example.com",
    "gmail.com": "imap.gmail.com",
    connection: {
      test: {
        success: "Test de connexion réussi",
        failed: "Échec du test de connexion",
        timeout: "Délai du test de connexion dépassé",
      },
    },
    sync: {
      messages: {
        accounts: {
          success: "Tous les comptes ont été synchronisés",
          successWithErrors: "Comptes synchronisés avec des erreurs",
        },
        account: {
          success: "Compte synchronisé",
          successWithErrors: "Compte synchronisé avec des erreurs",
        },
        folders: {
          success: "Dossiers synchronisés",
          successWithErrors: "Dossiers synchronisés avec des erreurs",
        },
        messages: {
          success: "Messages synchronisés",
          successWithErrors: "Messages synchronisés avec des erreurs",
        },
      },
      errors: {
        default: "Échec de la synchronisation IMAP",
        account_failed: "Échec de la synchronisation du compte : {{error}}",
        folder_sync_failed:
          "Échec de la synchronisation du dossier : {{error}}",
        message_sync_error: "Erreur de synchronisation du message",
        message_sync_failed: "Échec de la synchronisation du message",
      },
    },
  },
  enums: {
    loggingLevel: {
      error: "Erreur",
      warn: "Avertissement",
      info: "Info",
      debug: "Débogage",
    },
    syncStatus: {
      pending: "En attente",
      syncing: "Synchronisation",
      synced: "Synchronisé",
      error: "Erreur",
    },
    overallSyncStatus: {
      idle: "Inactif",
      running: "En cours",
      completed: "Terminé",
      failed: "Échec",
      cancelled: "Annulé",
    },
    sortOrder: {
      asc: "Croissant",
      desc: "Décroissant",
    },
    authMethod: {
      plain: "Simple",
      oauth2: "OAuth2",
      xoauth2: "XOAuth2",
    },
    imapAuthMethod: {
      plain: "Simple",
      oauth2: "OAuth2",
      xoauth2: "XOAuth2",
    },
    specialUseType: {
      inbox: "Boîte de réception",
      sent: "Envoyés",
      drafts: "Brouillons",
      trash: "Corbeille",
      junk: "Indésirables",
      archive: "Archives",
    },
    folderSortField: {
      name: "Nom",
      displayName: "Nom affiché",
      messageCount: "Nombre de messages",
      unseenCount: "Nombre de non lus",
      createdAt: "Créé le",
    },
    accountSortField: {
      name: "Nom",
      email: "E-mail",
      host: "Hôte",
      enabled: "Activé",
      lastSyncAt: "Dernière synchronisation",
      createdAt: "Créé le",
    },
    connectionStatus: {
      disconnected: "Déconnecté",
      connecting: "Connexion en cours",
      connected: "Connecté",
      error: "Erreur",
      timeout: "Délai dépassé",
    },
    syncStatusFilter: {
      all: "Tous les statuts de synchronisation",
    },
    accountStatusFilter: {
      all: "Tous les statuts de compte",
      enabled: "Activé",
      disabled: "Désactivé",
    },
    accountFilter: {
      all: "Tous les comptes",
    },
    messageSortField: {
      subject: "Objet",
      senderName: "Nom de l'expéditeur",
      senderEmail: "E-mail de l'expéditeur",
      recipientEmail: "E-mail du destinataire",
      recipientName: "Nom du destinataire",
      isRead: "Statut de lecture",
      isFlagged: "Signalé",
      messageSize: "Taille du message",
      sentAt: "Envoyé le",
      createdAt: "Créé le",
    },
    messageStatusFilter: {
      all: "Tous les messages",
      read: "Lus",
      unread: "Non lus",
      flagged: "Signalés",
      unflagged: "Non signalés",
      draft: "Brouillons",
      deleted: "Supprimés",
      hasAttachments: "Avec pièces jointes",
      noAttachments: "Sans pièce jointe",
    },
    healthStatus: {
      healthy: "Opérationnel",
      warning: "Avertissement",
      error: "Erreur",
      maintenance: "Maintenance",
    },
    performanceStatus: {
      good: "Bon",
      warning: "Avertissement",
      error: "Erreur",
    },
  },
};
