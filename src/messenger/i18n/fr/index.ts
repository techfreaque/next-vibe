import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "E-mail",
  countries: {
    global: "International",
    de: "Allemagne",
    pl: "Pologne",
    fr: "France",
    us: "États-Unis",
  },
  languages: {
    en: "Anglais",
    de: "Allemand",
    pl: "Polonais",
    fr: "Français",
  },
  enums: {
    // SMTP Client Enums
    smtpSecurityType: {
      none: "Aucune",
      tls: "TLS",
      ssl: "SSL",
      starttls: "STARTTLS",
    },
    smtpAccountStatus: {
      active: "Actif",
      inactive: "Inactif",
      error: "Erreur",
      testing: "En test",
    },
    smtpHealthStatus: {
      healthy: "Sain",
      degraded: "Dégradé",
      unhealthy: "Défaillant",
      unknown: "Inconnu",
    },
    smtpSortField: {
      name: "Nom",
      status: "Statut",
      createdAt: "Créé le",
      updatedAt: "Modifié le",
      priority: "Priorité",
      totalEmailsSent: "Total d'e-mails envoyés",
      lastUsedAt: "Dernière utilisation",
    },
    smtpCampaignType: {
      leadCampaign: "Campagne prospects",
      newsletter: "Newsletter",
      signupNurture: "Suivi après inscription",
      retention: "Fidélisation",
      winback: "Reconquête",
      transactional: "Transactionnel",
      notification: "Notification",
      system: "Système",
    },
    smtpLoadBalancingStrategy: {
      roundRobin: "Round robin",
      weighted: "Pondéré",
      priority: "Priorité",
      leastUsed: "Moins utilisé",
    },
    loadBalancingStrategy: {
      roundRobin: "Round robin",
      weighted: "Pondéré",
      priority: "Priorité",
      leastUsed: "Moins utilisé",
    },
    smtpTestResult: {
      success: "Succès",
      authFailed: "Échec de l'authentification",
      connectionFailed: "Échec de la connexion",
      timeout: "Délai dépassé",
      unknownError: "Erreur inconnue",
    },
    testResult: {
      success: "Succès",
      authFailed: "Échec de l'authentification",
      connectionFailed: "Échec de la connexion",
      timeout: "Délai dépassé",
      unknownError: "Erreur inconnue",
    },
    smtpStatusFilter: {
      any: "Tous",
    },
    smtpHealthStatusFilter: {
      any: "Tous",
    },
    smtpCampaignTypeFilter: {
      any: "Tous",
    },
    smtpSelectionRuleSortField: {
      name: "Nom",
      priority: "Priorité",
      campaignType: "Type de campagne",
      journeyVariant: "Variante de parcours",
      campaignStage: "Étape de campagne",
      country: "Pays",
      language: "Langue",
      createdAt: "Créé le",
      updatedAt: "Modifié le",
      emailsSent: "E-mails envoyés",
      successRate: "Taux de réussite",
      lastUsedAt: "Dernière utilisation",
    },
    selectionRuleSortField: {
      name: "Nom",
      priority: "Priorité",
      campaignType: "Type de campagne",
      journeyVariant: "Variante de parcours",
      campaignStage: "Étape de campagne",
      country: "Pays",
      language: "Langue",
      createdAt: "Créé le",
      updatedAt: "Modifié le",
      emailsSent: "E-mails envoyés",
      successRate: "Taux de réussite",
      lastUsedAt: "Dernière utilisation",
    },
    smtpSelectionRuleStatusFilter: {
      any: "Tous",
      active: "Actif",
      inactive: "Inactif",
      default: "Par défaut",
      failover: "Secours",
    },
    selectionRuleStatusFilter: {
      any: "Tous",
      active: "Actif",
      inactive: "Inactif",
      default: "Par défaut",
      failover: "Secours",
    },
    // Email Messages Enums
    emailStatus: {
      pending: "En attente",
      sent: "Envoyé",
      delivered: "Distribué",
      opened: "Ouvert",
      clicked: "Cliqué",
      bounced: "Rejeté",
      failed: "Échec",
      unsubscribed: "Désabonné",
    },
    emailType: {
      transactional: "Transactionnel",
      marketing: "Marketing",
      notification: "Notification",
      system: "Système",
      leadCampaign: "Campagne prospects",
      userCommunication: "Communication utilisateur",
    },
    emailProvider: {
      resend: "Resend",
      sendgrid: "SendGrid",
      mailgun: "Mailgun",
      ses: "Amazon SES",
      smtp: "SMTP",
      mailjet: "Mailjet",
      postmark: "Postmark",
      other: "Autre",
    },
    emailSortField: {
      subject: "Objet",
      recipientEmail: "E-mail du destinataire",
      recipientName: "Nom du destinataire",
      type: "Type",
      status: "Statut",
      sentAt: "Envoyé le",
      createdAt: "Créé le",
    },
    emailStatusFilter: {
      any: "Tous",
    },
    emailTypeFilter: {
      any: "Tous",
    },
    emailRetryRange: {
      noRetries: "Aucune tentative",
      oneToTwo: "1 à 2 tentatives",
      threeToFive: "3 à 5 tentatives",
      sixPlus: "6 tentatives ou plus",
    },
    // IMAP Client Enums
    imapSyncStatus: {
      pending: "En attente",
      syncing: "Synchronisation",
      synced: "Synchronisé",
      error: "Erreur",
    },
    imapOverallSyncStatus: {
      idle: "Inactif",
      running: "En cours",
      completed: "Terminé",
      failed: "Échec",
      cancelled: "Annulé",
    },
    imapSortOrder: {
      asc: "Croissant",
      desc: "Décroissant",
    },
    imapAuthMethod: {
      plain: "Simple",
      oauth2: "OAuth2",
      xoauth2: "XOAuth2",
    },
    imapSpecialUseType: {
      inbox: "Boîte de réception",
      sent: "Envoyés",
      drafts: "Brouillons",
      trash: "Corbeille",
      junk: "Indésirables",
      archive: "Archives",
    },
    imapFolderSortField: {
      name: "Nom",
      displayName: "Nom affiché",
      messageCount: "Nombre de messages",
      unseenCount: "Nombre de non lus",
      createdAt: "Créé le",
    },
    imapAccountSortField: {
      name: "Nom",
      email: "E-mail",
      host: "Hôte",
      enabled: "Activé",
      lastSyncAt: "Dernière synchro",
      createdAt: "Créé le",
    },
    imapConnectionStatus: {
      disconnected: "Déconnecté",
      connecting: "Connexion en cours",
      connected: "Connecté",
      error: "Erreur",
      timeout: "Délai dépassé",
    },
    imapSyncStatusFilter: {
      all: "Tous",
    },
    imapAccountStatusFilter: {
      all: "Tous",
      enabled: "Activés",
      disabled: "Désactivés",
    },
    imapAccountFilter: {
      all: "Tous",
    },
    imapMessageSortField: {
      subject: "Objet",
      senderName: "Nom de l'expéditeur",
      senderEmail: "E-mail de l'expéditeur",
      recipientEmail: "E-mail du destinataire",
      recipientName: "Nom du destinataire",
      isRead: "Lu",
      isFlagged: "Suivi",
      messageSize: "Taille du message",
      sentAt: "Envoyé le",
      createdAt: "Créé le",
    },
    imapMessageStatusFilter: {
      all: "Tous",
      read: "Lus",
      unread: "Non lus",
      flagged: "Suivis",
      unflagged: "Non suivis",
      draft: "Brouillon",
      deleted: "Supprimés",
      hasAttachments: "Avec pièces jointes",
      noAttachments: "Sans pièces jointes",
    },
    imapHealthStatus: {
      healthy: "Sain",
      warning: "Avertissement",
      error: "Erreur",
      maintenance: "Maintenance",
    },
    imapPerformanceStatus: {
      good: "Bon",
      warning: "Avertissement",
      error: "Erreur",
    },
    bulkMessageAction: {
      markRead: "Marquer comme lu",
      markUnread: "Marquer comme non lu",
      flag: "Suivre",
      unflag: "Ne plus suivre",
      delete: "Supprimer",
    },
    imapLoggingLevel: {
      error: "Erreur",
      warn: "Avertissement",
      info: "Info",
      debug: "Débogage",
    },
    // Email Service Enums
    emailServicePriority: {
      low: "Basse",
      normal: "Normale",
      high: "Haute",
      urgent: "Urgente",
    },
    emailServiceStatus: {
      idle: "Inactif",
      processing: "En traitement",
      completed: "Terminé",
      failed: "Échec",
      retrying: "Nouvelle tentative",
    },
    // SMS Service Enums
    smsProvider: {
      twilio: "Twilio",
      awsSns: "AWS SNS",
      messagebird: "MessageBird",
      plivo: "Plivo",
    },
    smsStatus: {
      pending: "En attente",
      sent: "Envoyé",
      delivered: "Distribué",
      failed: "Échec",
      rejected: "Refusé",
      undelivered: "Non distribué",
    },
    smsTemplateType: {
      notification: "Notification",
      verification: "Vérification",
      marketing: "Marketing",
      alert: "Alerte",
      reminder: "Rappel",
    },
  },
  errors: {
    no_email: "Aucune adresse e-mail fournie",
    email_generation_failed: "Impossible de générer l'e-mail",
  },
  email: {
    errors: {
      send: {
        title: "Échec de l'envoi de l'e-mail",
      },
    },
  },
  smsService: {
    title: "Service SMS",
    description: "Envoyer des SMS via différents fournisseurs",
    category: "Service SMS",
    tag: "Service SMS",
    errors: {
      unauthorized: {
        title: "Non autorisé",
        description: "Vous n'êtes pas autorisé à envoyer des SMS",
      },
      forbidden: {
        title: "Interdit",
        description: "L'accès au service SMS est interdit",
      },
      validation: {
        title: "Erreur de validation",
        description: "Données de requête SMS invalides",
      },
      internal: {
        title: "Erreur interne",
        description: "Une erreur interne du serveur s'est produite",
      },
      conflict: {
        title: "Conflit",
        description:
          "La requête SMS entre en conflit avec des données existantes",
      },
      notFound: {
        title: "Introuvable",
        description: "Ressource SMS introuvable",
      },
      network: {
        title: "Erreur réseau",
        description: "Erreur réseau lors de l'envoi du SMS",
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
      invalid_phone: {
        title: "Numéro de téléphone invalide",
      },
      send: {
        title: "Échec de l'envoi du SMS",
      },
    },
    send: {
      title: "Envoyer un SMS",
      description: "Envoyer un SMS à un destinataire",
      container: {
        title: "Configuration du SMS",
        description: "Configurer les paramètres d'envoi du SMS",
      },
      to: {
        label: "Numéro de téléphone",
        description: "Numéro de téléphone du destinataire",
        placeholder: "+33612345678",
      },
      message: {
        label: "Message",
        description: "Contenu du SMS",
        placeholder: "Saisissez votre message...",
      },
      campaignType: {
        label: "Type de campagne",
        description: "Choisissez le type de campagne de ce SMS",
        placeholder: "Choisir le type de campagne",
      },
      leadId: {
        label: "ID du prospect",
        description: "Identifiant du prospect associé",
        placeholder: "lead-12345",
      },
      templateName: {
        label: "Nom du modèle",
        description: "Modèle de SMS à utiliser",
        placeholder: "Choisir un modèle",
      },
      response: {
        result: {
          title: "Résultat du SMS",
          description: "Résultat de l'envoi du SMS",
          success: "Succès",
          messageId: "ID du message",
          sentAt: "Envoyé le",
          provider: "Fournisseur",
          cost: "Coût",
        },
      },
      errors: {
        validation: {
          title: "Erreur de validation",
          description: "Données de requête SMS invalides",
        },
        unauthorized: {
          title: "Non autorisé",
          description: "Vous n'êtes pas autorisé à envoyer des SMS",
        },
        forbidden: {
          title: "Interdit",
          description: "L'accès au service SMS est interdit",
        },
        conflict: {
          title: "Conflit",
          description:
            "La requête SMS entre en conflit avec des données existantes",
        },
        notFound: {
          title: "Introuvable",
          description: "Ressource SMS introuvable",
        },
        network: {
          title: "Erreur réseau",
          description: "Erreur réseau lors de l'envoi du SMS",
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
      },
      success: {
        title: "SMS envoyé",
        description: "Votre SMS a bien été envoyé",
      },
    },
  },
  sms: {
    errors: {
      invalid_phone: {
        title: "Numéro de téléphone invalide",
      },
      send: {
        title: "Échec de l'envoi du SMS",
      },
    },
  },
  emailService: {
    tag: "Client SMTP",
    category: "Services e-mail",
    components: {
      email: {
        tagline: "La plateforme d'IA pour la liberté d'expression",
        footer: {
          needHelp: "Besoin d'aide ?",
          helpText: "Besoin d'aide ? Écrivez-nous à",
          unsubscribeText: "Vous ne souhaitez plus recevoir ces e-mails ?",
          unsubscribeLink: "Se désabonner",
          copyright: "© {{currentYear}} {{appName}}. Tous droits réservés.",
          visitWebsite: "Visiter le site",
          allRightsReserved:
            "© {{currentYear}} {{appName}}. Tous droits réservés.",
          feedbackHook:
            "Quelque chose à nous dire ? Répondez à cet e-mail. On lit vraiment.",
          feedbackBody:
            "Signalez un bug, demandez une fonctionnalité ou dites-nous ce qui manque. Un retour utile vous rapporte {{credits}} crédits : un mois entier offert.",
          feedbackLink: "Répondre avec un retour →",
          footerSeparator: " · ",
        },
      },
      post: {
        title: "Composants",
        description: "Endpoint des composants",
        form: {
          title: "Configuration des composants",
          description: "Configurer les paramètres des composants",
        },
        response: {
          title: "Réponse",
          description: "Données de réponse des composants",
        },
        errors: {
          unauthorized: {
            title: "Non autorisé",
            description: "Authentification requise",
          },
          validation: {
            title: "Erreur de validation",
            description: "Paramètres de requête invalides",
          },
          server: {
            title: "Erreur serveur",
            description: "Une erreur interne du serveur s'est produite",
          },
          unknown: {
            title: "Erreur inconnue",
            description: "Une erreur inconnue s'est produite",
          },
          network: {
            title: "Erreur réseau",
            description: "Une erreur réseau s'est produite",
          },
          forbidden: {
            title: "Interdit",
            description: "Accès interdit",
          },
          notFound: {
            title: "Introuvable",
            description: "Ressource introuvable",
          },
          conflict: {
            title: "Conflit",
            description: "Conflit de données",
          },
        },
        success: {
          title: "Succès",
          description: "Opération réussie",
        },
      },
    },
    emailSending: {
      email: {
        defaultSenderName: "Système",
        errors: {
          sending_failed: "Impossible d'envoyer l'e-mail à {{recipient}}",
        },
      },
    },
    emailHandling: {
      email: {
        errors: {
          rendering_failed: "Impossible de générer le modèle d'e-mail",
          send_failed: "Impossible d'envoyer l'e-mail",
          email_failed_subject: "Échec de l'e-mail",
          unknown_recipient: "Destinataire inconnu",
          unknown_sender: "Système",
          email_render_exception: "Exception lors de la génération de l'e-mail",
          batch_send_failed: "Échec de l'envoi groupé",
        },
      },
    },
    sending: {
      errors: {
        unauthorized: {
          title: "Non autorisé",
          description: "Authentification requise pour l'envoi SMTP",
        },
        server: {
          title: "Erreur serveur",
          description: "Une erreur s'est produite sur le serveur SMTP",
        },
        rejected: {
          title: "E-mail refusé",
          defaultReason: "E-mail refusé par le serveur",
        },
        no_recipients: {
          title: "Aucun destinataire accepté",
          defaultReason: "Aucun destinataire accepté",
        },
        rate_limit: {
          title: "Limite d'envoi dépassée",
        },
        capacity: {
          title: "Erreur de capacité",
        },
        no_account: {
          title: "Aucun compte SMTP disponible",
        },
      },
    },
    emailMetadata: {
      errors: {
        server: {
          title: "Erreur serveur des métadonnées e-mail",
          description: "Impossible d'enregistrer les métadonnées de l'e-mail",
        },
      },
    },
    enums: {
      status: {
        active: "Actif",
        inactive: "Inactif",
        error: "Erreur",
        testing: "En test",
      },
      securityType: {
        none: "Aucune",
        tls: "TLS",
        ssl: "SSL",
        starttls: "STARTTLS",
      },
      statusFilter: {
        all: "Tous les statuts",
      },
      healthStatus: {
        healthy: "Sain",
        degraded: "Dégradé",
        unhealthy: "Défaillant",
        unknown: "Inconnu",
      },
      healthStatusFilter: {
        all: "Tous les états de santé",
      },
      sortField: {
        name: "Nom",
        status: "Statut",
        createdAt: "Créé le",
        updatedAt: "Modifié le",
        priority: "Priorité",
        totalEmailsSent: "Total d'e-mails envoyés",
        lastUsedAt: "Dernière utilisation",
      },
      campaignType: {
        leadCampaign: "Campagne prospects",
        newsletter: "Newsletter",
        signupNurture: "Suivi après inscription",
        retention: "Fidélisation",
        winback: "Reconquête",
        transactional: "Transactionnel",
        notification: "Notification",
        system: "Système",
      },
      campaignTypeFilter: {
        all: "Tous les types de campagne",
      },
      selectionRuleSortField: {
        name: "Nom",
        priority: "Priorité",
        campaignType: "Type de campagne",
        journeyVariant: "Variante de parcours",
        campaignStage: "Étape de campagne",
        country: "Pays",
        language: "Langue",
        createdAt: "Créé le",
        updatedAt: "Modifié le",
        emailsSent: "E-mails envoyés",
        successRate: "Taux de réussite",
        lastUsedAt: "Dernière utilisation",
      },
      selectionRuleStatusFilter: {
        all: "Tous",
        active: "Actif",
        inactive: "Inactif",
        default: "Par défaut",
        failover: "Secours",
      },
      loadBalancingStrategy: {
        roundRobin: "Round robin",
        weighted: "Pondéré",
        priority: "Priorité",
        leastUsed: "Moins utilisé",
      },
      testResult: {
        success: "Succès",
        authFailed: "Échec de l'authentification",
        connectionFailed: "Échec de la connexion",
        timeout: "Délai dépassé",
        unknownError: "Erreur inconnue",
      },
    },
  },
  imapClient: {
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
          flag: "Suivre",
          unflag: "Ne plus suivre",
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

      title: "Synchro IMAP",
      description: "Service de synchronisation IMAP",
      container: {
        title: "Configuration de la synchro IMAP",
        description: "Configurer les paramètres de synchronisation IMAP",
      },
      accountIds: {
        label: "ID des comptes",
        description: "ID des comptes IMAP à synchroniser",
        placeholder: "Saisissez les ID séparés par des virgules",
      },
      force: {
        label: "Forcer la synchro",
        description: "Synchroniser même si une synchro récente a eu lieu",
      },
      dryRun: {
        label: "Simulation",
        description: "Exécuter un test sans rien modifier",
      },
      maxMessages: {
        label: "Messages max",
        description: "Nombre maximal de messages à synchroniser par dossier",
        placeholder: "Saisissez le nombre maximal de messages",
      },
      post: {
        title: "Synchro",
        description: "Endpoint de synchronisation",
        form: {
          title: "Configuration de la synchro",
          description: "Configurer les paramètres de synchronisation",
        },
        response: {
          title: "Réponse",
          description: "Données de réponse de la synchro",
          result: {
            title: "Résultats de la synchro",
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
              title: "Erreur de synchro",
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
            description: "Paramètres de requête invalides",
          },
          server: {
            title: "Erreur serveur",
            description: "Une erreur interne du serveur s'est produite",
          },
          unknown: {
            title: "Erreur inconnue",
            description: "Une erreur inconnue s'est produite",
          },
          network: {
            title: "Erreur réseau",
            description: "Une erreur réseau s'est produite",
          },
          forbidden: {
            title: "Interdit",
            description: "Accès interdit",
          },
          notFound: {
            title: "Introuvable",
            description: "Ressource introuvable",
          },
          conflict: {
            title: "Conflit",
            description: "Conflit de données",
          },
        },
        success: {
          title: "Succès",
          description: "Opération réussie",
        },
      },
      errors: {
        unauthorized: {
          title: "Non autorisé",
          description: "Authentification requise",
        },
        validation: {
          title: "Erreur de validation",
          description: "Paramètres de requête invalides",
        },
        server: {
          title: "Erreur serveur",
          description: "Une erreur interne du serveur s'est produite",
        },
        unknown: {
          title: "Erreur inconnue",
          description: "Une erreur inconnue s'est produite",
        },
        forbidden: {
          title: "Interdit",
          description: "Accès interdit",
        },
      },
      success: {
        title: "Succès",
        description: "Opération réussie",
      },
      widget: {
        title: "Synchro IMAP complète",
        options: "Options de synchro",
        noAccounts: "Aucun compte IMAP configuré",
        result: "Résultat de la synchro",
        duration: "Durée",
        errors: "Erreurs",
        accountsProcessed: "Comptes traités",
        foldersProcessed: "Dossiers traités",
        messagesProcessed: "Messages traités",
        messagesAdded: "Messages ajoutés",
        messagesUpdated: "Messages mis à jour",
        messagesDeleted: "Messages supprimés",
        submit: "Lancer la synchro",
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
              title: "Compte introuvable pour la synchro du dossier",
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
        failed: "Échec de la synchro",
        account: {
          failed: "Échec de la synchro du compte",
        },
        folder: {
          failed: "Échec de la synchro du dossier",
        },
        message: {
          failed: "Échec de la synchro du message",
        },
        post: {
          error: {
            server: {
              title: "Erreur serveur pendant la synchro",
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
            invalid: "Numéro de port invalide",
          },
          host: {
            invalid: "Hôte invalide",
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
          default: "Échec de la synchro IMAP",
          account_failed: "Échec de la synchro du compte",
          folder_sync_failed: "Échec de la synchro du dossier",
          message_sync_error: "Erreur de synchro du message",
          message_sync_failed: "Échec de la synchro du message",
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
        lastSyncAt: "Dernière synchro",
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
        all: "Tous les statuts de synchro",
      },
      accountStatusFilter: {
        all: "Tous les statuts de compte",
        enabled: "Activés",
        disabled: "Désactivés",
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
        isFlagged: "Suivi",
        messageSize: "Taille du message",
        sentAt: "Envoyé le",
        createdAt: "Créé le",
      },
      messageStatusFilter: {
        all: "Tous les messages",
        read: "Lus",
        unread: "Non lus",
        flagged: "Suivis",
        unflagged: "Non suivis",
        draft: "Brouillon",
        deleted: "Supprimés",
        hasAttachments: "Avec pièces jointes",
        noAttachments: "Sans pièces jointes",
      },
      healthStatus: {
        healthy: "Sain",
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
  },
  messages: {
    category: "Messages e-mail",
    tag: "Messages",
    tags: {
      stats: "Statistiques",
      analytics: "Analyses",
    },
    id: {
      category: "E-mails",
      tags: {
        emails: "E-mails",
      },
      title: "Détail de l'e-mail",
      description: "Récupérer un e-mail par son identifiant unique",
      container: {
        title: "Détails de l'e-mail",
        description: "Voir les informations détaillées d'un e-mail",
      },
      fields: {
        id: {
          label: "ID de l'e-mail",
          description: "Identifiant unique de l'e-mail à récupérer",
        },
      },
      response: {
        email: {
          title: "Détails de l'e-mail",
          description: "Informations complètes sur l'e-mail demandé",
          id: "ID de l'e-mail",
          subject: "Objet",
          recipientEmail: "E-mail du destinataire",
          recipientName: "Nom du destinataire",
          senderEmail: "E-mail de l'expéditeur",
          senderName: "Nom de l'expéditeur",
          type: "Type d'e-mail",
          status: "Statut",
          templateName: "Nom du modèle",
          emailProvider: "Fournisseur e-mail",
          externalId: "ID externe",
          sentAt: "Envoyé le",
          deliveredAt: "Distribué le",
          openedAt: "Ouvert le",
          clickedAt: "Cliqué le",
          retryCount: "Nombre de tentatives",
          error: "Message d'erreur",
          userId: "ID utilisateur",
          leadId: "ID du prospect",
          createdAt: "Créé le",
          updatedAt: "Modifié le",
        },
      },
      get: {
        errors: {
          validation: {
            title: "Erreur de validation",
            description: "L'ID d'e-mail fourni est invalide",
          },
          unauthorized: {
            title: "Non autorisé",
            description:
              "Vous devez être authentifié pour accéder aux détails de l'e-mail",
          },
          not_found: {
            title: "E-mail introuvable",
            description: "Aucun e-mail ne correspond à cet ID",
          },
          forbidden: {
            title: "Interdit",
            description: "Vous n'avez pas l'autorisation de voir cet e-mail",
          },
          server: {
            title: "Erreur serveur",
            description:
              "Une erreur interne du serveur s'est produite lors de la récupération de l'e-mail",
          },
          unknown: {
            title: "Erreur inconnue",
            description: "Une erreur inattendue s'est produite",
          },
        },
      },
      errors: {
        validation: {
          title: "Erreur de validation",
          description: "L'ID d'e-mail fourni est invalide",
        },
        unauthorized: {
          title: "Non autorisé",
          description:
            "Vous devez être authentifié pour accéder aux détails de l'e-mail",
        },
        notFound: {
          title: "E-mail introuvable",
          description: "Aucun e-mail ne correspond à cet ID",
        },
        forbidden: {
          title: "Interdit",
          description: "Vous n'avez pas l'autorisation de voir cet e-mail",
        },
        server: {
          title: "Erreur serveur",
          description:
            "Une erreur interne du serveur s'est produite lors de la récupération de l'e-mail",
        },
        conflict: {
          title: "Conflit",
          description:
            "Un conflit est survenu lors du traitement de la requête",
        },
        network: {
          title: "Erreur réseau",
          description:
            "Une erreur réseau s'est produite lors de la récupération de l'e-mail",
        },
        unsavedChanges: {
          title: "Modifications non enregistrées",
          description: "Des modifications ne sont pas enregistrées",
        },
        unknown: {
          title: "Erreur inconnue",
          description: "Une erreur inattendue s'est produite",
        },
      },
      success: {
        title: "E-mail récupéré",
        description: "Détails de l'e-mail récupérés",
      },
      widget: {
        parties: "Parties",
        to: "À",
        from: "De",
        timestamps: "Horodatages",
        sentAt: "Envoyé le",
        deliveredAt: "Distribué le",
        openedAt: "Ouvert le",
        clickedAt: "Cliqué le",
        technical: "Détails techniques",
        template: "Modèle",
        provider: "Fournisseur",
        externalId: "ID externe",
        retryCount: "Nombre de tentatives",
        error: "Erreur",
        associations: "Associations",
        lead: "Prospect",
        user: "Utilisateur",
        notFound: "E-mail introuvable",
      },
      enums: {
        status: {
          pending: "En attente",
          sent: "Envoyé",
          delivered: "Distribué",
          opened: "Ouvert",
          clicked: "Cliqué",
          bounced: "Rejeté",
          failed: "Échec",
          unsubscribed: "Désabonné",
        },
        type: {
          transactional: "Transactionnel",
          marketing: "Marketing",
          notification: "Notification",
          system: "Système",
          leadCampaign: "Campagne prospects",
          userCommunication: "Communication utilisateur",
        },
        provider: {
          resend: "Resend",
          sendgrid: "SendGrid",
          mailgun: "Mailgun",
          ses: "Amazon SES",
          smtp: "SMTP",
          mailjet: "Mailjet",
          postmark: "Postmark",
          other: "Autre",
        },
      },
    },
    list: {
      category: "E-mails",
      tags: {
        emails: "E-mails",
      },
      title: "Liste des e-mails",
      description: "Récupérer une liste paginée d'e-mails avec filtres",
      container: {
        title: "Liste des e-mails",
        description: "Configurer la liste des e-mails et voir les résultats",
      },
      filters: {
        title: "Filtres",
        description: "Filtrer et rechercher des e-mails",
      },
      displayOptions: {
        title: "Options d'affichage",
      },
      fields: {
        dateRange: {
          title: "Période",
        },
        page: {
          label: "Page",
          description: "Numéro de page",
          placeholder: "Saisissez le numéro de page",
        },
        limit: {
          label: "Limite",
          description: "Nombre d'éléments par page",
          placeholder: "Saisissez la limite",
        },
        search: {
          label: "Recherche",
          description:
            "Rechercher des e-mails par objet, destinataire ou expéditeur",
          placeholder: "Rechercher des e-mails...",
        },
        status: {
          label: "Statut",
          description: "Filtrer par statut d'e-mail",
          placeholder: "Choisir un statut",
        },
        channel: {
          label: "Canal",
          description: "Filtrer par canal de message",
        },
        type: {
          label: "Type",
          description: "Filtrer par type d'e-mail",
          placeholder: "Choisir un type",
        },
        sortBy: {
          label: "Trier par",
          description: "Champ de tri",
          placeholder: "Choisir le champ de tri",
        },
        sortOrder: {
          label: "Ordre de tri",
          description: "Sens du tri",
          placeholder: "Choisir l'ordre de tri",
        },
        dateFrom: {
          label: "Du",
          description: "Filtrer les e-mails à partir de cette date",
          placeholder: "Choisir la date de début",
        },
        dateTo: {
          label: "Au",
          description: "Filtrer les e-mails jusqu'à cette date",
          placeholder: "Choisir la date de fin",
        },
      },
      response: {
        emails: {
          title: "E-mails",
          emptyState: {
            title: "Aucun e-mail trouvé",
            description: "Aucun e-mail ne correspond à vos filtres",
          },
          item: {
            title: "E-mail",
            description: "Détails de l'e-mail",
            id: "ID",
            subject: "Objet",
            recipientEmail: "E-mail du destinataire",
            recipientName: "Nom du destinataire",
            senderEmail: "E-mail de l'expéditeur",
            senderName: "Nom de l'expéditeur",
            type: "Type",
            status: "Statut",
            templateName: "Nom du modèle",
            emailProvider: "Fournisseur e-mail",
            externalId: "ID externe",
            sentAt: "Envoyé le",
            deliveredAt: "Distribué le",
            openedAt: "Ouvert le",
            clickedAt: "Cliqué le",
            retryCount: "Nombre de tentatives",
            error: "Erreur",
            userId: "ID utilisateur",
            leadId: "ID du prospect",
            createdAt: "Créé le",
            updatedAt: "Modifié le",
            emailCore: {
              title: "Informations principales",
            },
            emailParties: {
              title: "Expéditeur et destinataire",
            },
            emailMetadata: {
              title: "Métadonnées",
            },
            emailEngagement: {
              title: "Suivi de l'engagement",
            },
            technicalDetails: {
              title: "Détails techniques",
            },
            associatedIds: {
              title: "ID associés",
            },
            timestamps: {
              title: "Horodatages",
            },
          },
        },
        pagination: {
          title: "Pagination",
          description: "Informations de pagination",
          page: "Page actuelle",
          limit: "Éléments par page",
          total: "Total des éléments",
          totalPages: "Nombre de pages",
        },
        filters: {
          title: "Filtres appliqués",
          description: "Filtres actuellement appliqués",
          status: "Filtre de statut",
          type: "Filtre de type",
          search: "Recherche",
          dateFrom: "Date de début",
          dateTo: "Date de fin",
        },
      },
      errors: {
        validation: {
          title: "Erreur de validation",
          description: "Les paramètres fournis sont invalides",
        },
        unauthorized: {
          title: "Non autorisé",
          description:
            "Vous devez être authentifié pour accéder à cette ressource",
        },
        forbidden: {
          title: "Interdit",
          description:
            "Vous n'avez pas l'autorisation d'accéder à cette ressource",
        },
        notFound: {
          title: "Introuvable",
          description: "La ressource demandée est introuvable",
        },
        server: {
          title: "Erreur serveur",
          description: "Une erreur interne du serveur s'est produite",
        },
        unknown: {
          title: "Erreur inconnue",
          description: "Une erreur inattendue s'est produite",
        },
        unsaved: {
          title: "Modifications non enregistrées",
          description: "Vous avez des modifications non enregistrées",
        },
        conflict: {
          title: "Conflit",
          description: "La requête entre en conflit avec l'état actuel",
        },
        network: {
          title: "Erreur réseau",
          description: "Une erreur réseau s'est produite",
        },
      },
      success: {
        title: "Succès",
        description: "E-mails récupérés",
      },
      widget: {
        to: "À",
        retries: "Tentatives",
        opened: "Ouvert",
        clicked: "Cliqué",
        stats: "Statistiques",
        graphs: "Graphiques",
        refresh: "Actualiser",
        searchPlaceholder: "Rechercher des e-mails...",
        clearSearch: "Effacer",
        emptyState: "Aucun e-mail trouvé",
        emptyFiltered: "Aucun e-mail ne correspond à vos filtres",
        page: "Page",
        tabs: {
          all: "Tous",
          sent: "Envoyés",
          delivered: "Distribués",
          opened: "Ouverts",
          failed: "Échecs",
          bounced: "Rejetés",
        },
      },
      enums: {
        type: {
          transactional: "Transactionnel",
          marketing: "Marketing",
          notification: "Notification",
          system: "Système",
          leadCampaign: "Campagne prospects",
          userCommunication: "Communication utilisateur",
        },
        typeFilter: {
          any: "Tous les types",
        },
        channel: {
          email: "E-mail",
          sms: "SMS",
          whatsapp: "WhatsApp",
          telegram: "Telegram",
        },
        channelFilter: {
          any: "Tous les canaux",
        },
        sortField: {
          subject: "Objet",
          recipientEmail: "E-mail du destinataire",
          recipientName: "Nom du destinataire",
          type: "Type",
          status: "Statut",
          sentAt: "Envoyé le",
          createdAt: "Créé le",
        },
        sortOrder: {
          asc: "Croissant",
          desc: "Décroissant",
        },
      },
    },
    stats: {
      category: "E-mails",
      tags: {
        stats: "Statistiques",
        analytics: "Analyses",
      },
      dateRange: {
        today: "Aujourd'hui",
        yesterday: "Hier",
        last7Days: "7 derniers jours",
        last30Days: "30 derniers jours",
        last90Days: "90 derniers jours",
        thisWeek: "Cette semaine",
        lastWeek: "Semaine dernière",
        thisMonth: "Ce mois-ci",
        lastMonth: "Mois dernier",
        thisQuarter: "Ce trimestre",
        lastQuarter: "Trimestre dernier",
        thisYear: "Cette année",
        lastYear: "Année dernière",
        custom: "Période personnalisée",
      },
      get: {
        title: "Statistiques e-mail",
        description:
          "Récupérer l'ensemble des statistiques et métriques e-mail",
        form: {
          title: "Requête de statistiques e-mail",
          description: "Paramètres de la requête de statistiques",
        },
        startDate: {
          label: "Date de début",
          description: "Date de début de la période",
        },
        endDate: {
          label: "Date de fin",
          description: "Date de fin de la période",
        },
        accountId: {
          label: "ID du compte",
          description: "Filtrer les statistiques par compte",
        },
        type: {
          label: "Type d'e-mail",
          description: "Filtrer par type d'e-mail",
          options: {
            all: "Tous",
            sent: "Envoyés",
            received: "Reçus",
            draft: "Brouillons",
            trash: "Corbeille",
          },
        },
        groupBy: {
          label: "Regrouper par",
          description: "Mode de regroupement des statistiques",
          options: {
            day: "Par jour",
            week: "Par semaine",
            month: "Par mois",
            account: "Par compte",
            type: "Par type",
          },
        },
        includeDetails: {
          label: "Inclure les détails",
          description: "Inclure une ventilation détaillée dans les résultats",
        },
        status: {
          label: "Statut de l'e-mail",
          description: "Filtrer par statut d'e-mail",
        },
        search: {
          label: "Recherche",
          description: "Rechercher des e-mails par objet ou destinataire",
        },
        timePeriod: {
          label: "Période",
          description: "Granularité temporelle des données historiques",
          hour: "Heure",
          day: "Jour",
          week: "Semaine",
          month: "Mois",
          quarter: "Trimestre",
          year: "Année",
        },
        dateRangePreset: {
          label: "Période prédéfinie",
          description: "Période prédéfinie pour le filtrage",
        },
        dateFrom: {
          label: "Date de début",
          description: "Filtrer les e-mails à partir de cette date",
        },
        dateTo: {
          label: "Date de fin",
          description: "Filtrer les e-mails jusqu'à cette date",
        },
        chartType: {
          label: "Type de graphique",
          description: "Type de visualisation des graphiques",
          line: "Courbes",
          bar: "Barres",
          area: "Aires",
          pie: "Camembert",
          donut: "Anneau",
        },
        includeComparison: {
          label: "Inclure la comparaison",
          description: "Comparer avec la période précédente",
        },
        sortBy: {
          label: "Trier par",
          description: "Champ de tri des e-mails",
        },
        sortOrder: {
          label: "Ordre de tri",
          description: "Ordre de tri (croissant ou décroissant)",
        },
        response: {
          title: "Réponse des statistiques e-mail",
          description: "Statistiques et métriques e-mail complètes",
          totalEmails: "Total des e-mails",
          sentEmails: "E-mails envoyés",
          deliveredEmails: "E-mails distribués",
          openedEmails: "E-mails ouverts",
          clickedEmails: "E-mails cliqués",
          bouncedEmails: "E-mails rejetés",
          failedEmails: "E-mails en échec",
          draftEmails: "Brouillons",
          openRate: "Taux d'ouverture",
          clickRate: "Taux de clic",
          deliveryRate: "Taux de distribution",
          bounceRate: "Taux de rejet",
          failureRate: "Taux d'échec",
          emailsByProvider: "E-mails par fournisseur",
          emailsByTemplate: "E-mails par modèle",
          emailsByStatus: "E-mails par statut",
          emailsByType: "E-mails par type",
          emailsWithUserId: "E-mails avec ID utilisateur",
          emailsWithoutUserId: "E-mails sans ID utilisateur",
          emailsWithLeadId: "E-mails avec ID de prospect",
          emailsWithoutLeadId: "E-mails sans ID de prospect",
          emailsWithErrors: "E-mails avec erreurs",
          emailsWithoutErrors: "E-mails sans erreur",
          averageRetryCount: "Nombre moyen de tentatives",
          maxRetryCount: "Nombre maximal de tentatives",
          averageProcessingTime: "Temps de traitement moyen",
          averageDeliveryTime: "Délai de distribution moyen",
          historicalData: "Données historiques",
          groupedStats: "Statistiques regroupées",
          generatedAt: "Généré le",
          dataRange: "Plage de données",
          recentActivity: "Activité récente",
          topPerformingTemplates: "Modèles les plus performants",
          topPerformingProviders: "Fournisseurs les plus performants",
          metrics: {
            totalEmails: "Total des e-mails",
            sentEmails: "E-mails envoyés",
            deliveredEmails: "E-mails distribués",
            openedEmails: "E-mails ouverts",
            clickedEmails: "E-mails cliqués",
            bouncedEmails: "E-mails rejetés",
            failedEmails: "E-mails en échec",
            deliveryRate: "Taux de distribution",
            openRate: "Taux d'ouverture",
            clickRate: "Taux de clic",
            bounceRate: "Taux de rejet",
            failureRate: "Taux d'échec",
            emails_with_errors: "E-mails avec erreurs",
            average_retry_count: "Nombre moyen de tentatives",
            average_processing_time: "Temps de traitement moyen (ms)",
            average_delivery_time: "Délai de distribution moyen (ms)",
            provider_historical: "Historique par fournisseur",
            template_historical: "Historique par modèle",
            engagement_historical: "Historique de l'engagement",
          },
          retry: {
            no_retries: "Sans nouvelle tentative",
            with_retries: "Avec nouvelles tentatives",
          },
          association: {
            with_user: "Avec utilisateur",
            with_lead: "Avec prospect",
            with_both: "Avec les deux",
            with_neither: "Autonome",
          },
        },
        errors: {
          unauthorized: {
            title: "Non autorisé",
            description:
              "Authentification requise pour accéder aux statistiques e-mail",
          },
          validation: {
            title: "Erreur de validation",
            description: "Paramètres de requête invalides",
          },
          server: {
            title: "Erreur serveur",
            description:
              "Erreur interne du serveur lors de la récupération des statistiques",
          },
          unknown: {
            title: "Erreur inconnue",
            description: "Une erreur inconnue s'est produite",
          },
          network: {
            title: "Erreur réseau",
            description:
              "Erreur réseau lors de la récupération des statistiques",
          },
          forbidden: {
            title: "Interdit",
            description: "L'accès aux statistiques e-mail est interdit",
          },
          notFound: {
            title: "Introuvable",
            description: "Statistiques e-mail introuvables",
          },
          unsavedChanges: {
            title: "Modifications non enregistrées",
            description: "Des modifications doivent d'abord être enregistrées",
          },
          conflict: {
            title: "Conflit",
            description:
              "Conflit de données lors de la récupération des statistiques",
          },
        },
        success: {
          title: "Succès",
          description: "Statistiques e-mail récupérées",
        },
      },
      widget: {
        title: "Statistiques e-mail",
        total: "Total",
        sent: "Envoyés",
        delivered: "Distribués",
        opened: "Ouverts",
        clicked: "Cliqués",
        bounced: "Rejetés",
        failed: "Échecs",
        errors: "Erreurs",
        engagementRates: "Taux d'engagement",
        deliveryRate: "Taux de distribution",
        openRate: "Taux d'ouverture",
        clickRate: "Taux de clic",
        bounceRate: "Taux de rejet",
        failureRate: "Taux d'échec",
        byStatus: "Par statut",
        byType: "Par type",
        avgRetries: "Tentatives moy.",
        avgDeliveryMs: "Délai de distribution moy.",
        viewList: "Voir la liste",
        refresh: "Actualiser",
        search: "Rechercher des e-mails...",
      },
      enums: {
        status: {
          pending: "En attente",
          sent: "Envoyé",
          delivered: "Distribué",
          opened: "Ouvert",
          clicked: "Cliqué",
          bounced: "Rejeté",
          failed: "Échec",
          unsubscribed: "Désabonné",
        },
        statusFilter: {
          any: "Tous les statuts",
        },
        type: {
          transactional: "Transactionnel",
          marketing: "Marketing",
          notification: "Notification",
          system: "Système",
          leadCampaign: "Campagne prospects",
          userCommunication: "Communication utilisateur",
        },
        typeFilter: {
          any: "Tous les types",
        },
        sortField: {
          subject: "Objet",
          recipientEmail: "E-mail du destinataire",
          recipientName: "Nom du destinataire",
          type: "Type",
          status: "Statut",
          sentAt: "Envoyé le",
          createdAt: "Créé le",
        },
        sortOrder: {
          asc: "Croissant",
          desc: "Décroissant",
        },
      },
    },
    enums: {
      status: {
        pending: "En attente",
        sent: "Envoyé",
        delivered: "Distribué",
        opened: "Ouvert",
        clicked: "Cliqué",
        bounced: "Rejeté",
        failed: "Échec",
        unsubscribed: "Désabonné",
      },
      statusFilter: {
        any: "Tous les statuts",
      },
      type: {
        transactional: "Transactionnel",
        marketing: "Marketing",
        notification: "Notification",
        system: "Système",
        leadCampaign: "Campagne prospects",
        userCommunication: "Communication utilisateur",
      },
      typeFilter: {
        any: "Tous les types",
      },
      provider: {
        resend: "Resend",
        sendgrid: "SendGrid",
        mailgun: "Mailgun",
        ses: "Amazon SES",
        smtp: "SMTP",
        mailjet: "Mailjet",
        postmark: "Postmark",
        other: "Autre",
      },
      sortField: {
        subject: "Objet",
        recipientEmail: "E-mail du destinataire",
        recipientName: "Nom du destinataire",
        type: "Type",
        status: "Statut",
        sentAt: "Envoyé le",
        createdAt: "Créé le",
      },
      retryRange: {
        noRetries: "Aucune tentative",
        oneToTwo: "1 à 2 tentatives",
        threeToFive: "3 à 5 tentatives",
        sixPlus: "6 tentatives ou plus",
      },
      syncStatus: {
        pending: "Synchro en attente",
        syncing: "Synchronisation",
        synced: "Synchronisé",
        failed: "Échec de la synchro",
      },
      specialFolder: {
        inbox: "Boîte de réception",
        sent: "Envoyés",
        drafts: "Brouillons",
        trash: "Corbeille",
        spam: "Spam",
        archive: "Archives",
      },
      sortOrder: {
        asc: "Croissant",
        desc: "Décroissant",
      },
    },
  },
  send: {
    title: "Envoyer un message",
    description:
      "Envoyer un message sur n'importe quel canal (e-mail, SMS, WhatsApp, Telegram)",
    category: "Messagerie",
    tag: "Envoi",

    container: {
      title: "Envoyer un message",
      description: "Envoyer via un compte de messagerie configuré",
    },

    accountId: {
      label: "Compte de messagerie",
      description: "Compte utilisé pour l'envoi",
      placeholder: "Choisir l'UUID du compte",
    },
    to: {
      label: "Destinataire",
      description: "Adresse e-mail, numéro de téléphone ou ID de chat",
      placeholder: "user@example.com ou +33612345678",
    },
    toName: {
      label: "Nom du destinataire",
      description: "Nom affiché du destinataire (facultatif)",
      placeholder: "Jean Dupont",
    },
    subject: {
      label: "Objet",
      description:
        "Ligne d'objet (e-mail uniquement, facultative pour les autres canaux)",
      placeholder: "Votre objet...",
    },
    text: {
      label: "Message",
      description:
        "Corps en texte brut : utilisé pour SMS, WhatsApp et Telegram ; version de secours pour l'e-mail",
      placeholder: "Saisissez votre message...",
    },
    html: {
      label: "Contenu HTML",
      description:
        "Corps HTML (e-mail uniquement, facultatif : le texte est utilisé s'il est absent)",
      placeholder: "<p>Saisissez le contenu HTML de l'e-mail...</p>",
    },
    senderName: {
      label: "Nom de l'expéditeur",
      description:
        "Nom affiché de l'expéditeur (e-mail uniquement, facultatif)",
      placeholder: "Votre entreprise",
    },
    replyTo: {
      label: "Répondre à",
      description: "Adresse de réponse (e-mail uniquement, facultative)",
      placeholder: "support@example.com",
    },
    leadId: {
      label: "ID du prospect",
      description: "Prospect associé pour le suivi (facultatif)",
      placeholder: "UUID",
    },
    campaignId: {
      label: "ID de campagne",
      description: "Campagne associée pour le suivi (facultatif)",
      placeholder: "UUID",
    },

    response: {
      title: "Résultat de l'envoi",
      description: "Résultat de l'opération d'envoi",
      messageId: { label: "ID du message" },
      accountName: { label: "Compte" },
      channel: { label: "Canal" },
      provider: { label: "Fournisseur" },
      sentAt: { label: "Envoyé le" },
    },

    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Vérifiez votre saisie et réessayez",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Vous n'avez pas l'autorisation d'envoyer des messages",
      },
      server: {
        title: "Erreur serveur",
        description:
          "Une erreur interne du serveur s'est produite lors de l'envoi",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inattendue s'est produite",
      },
      forbidden: {
        title: "Interdit",
        description: "L'accès à cette ressource est interdit",
      },
      network: {
        title: "Erreur réseau",
        description: "Une erreur réseau s'est produite lors de l'envoi",
      },
      notFound: {
        title: "Compte introuvable",
        description: "Le compte de messagerie indiqué est introuvable",
      },
      conflict: {
        title: "Conflit",
        description: "La requête entre en conflit avec des données existantes",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Vous avez des modifications non enregistrées",
      },
    },

    success: {
      title: "Message envoyé",
      description: "Votre message a bien été envoyé",
    },
  },
  smtpClient: {
    tag: "Client SMTP",
    category: "Services e-mail",
    components: {
      email: {
        tagline: "La plateforme d'IA pour la liberté d'expression",
        footer: {
          needHelp: "Besoin d'aide ?",
          helpText: "Besoin d'aide ? Écrivez-nous à",
          unsubscribeText: "Vous ne souhaitez plus recevoir ces e-mails ?",
          unsubscribeLink: "Se désabonner",
          copyright: "© {{currentYear}} {{appName}}. Tous droits réservés.",
          visitWebsite: "Visiter le site",
          allRightsReserved:
            "© {{currentYear}} {{appName}}. Tous droits réservés.",
          feedbackHook:
            "Quelque chose à nous dire ? Répondez à cet e-mail. On lit vraiment.",
          feedbackBody:
            "Signalez un bug, demandez une fonctionnalité ou dites-nous ce qui manque. Un retour utile vous rapporte {{credits}} crédits : un mois entier offert.",
          feedbackLink: "Répondre avec un retour →",
          footerSeparator: " · ",
        },
      },
      post: {
        title: "Composants",
        description: "Endpoint des composants",
        form: {
          title: "Configuration des composants",
          description: "Configurer les paramètres des composants",
        },
        response: {
          title: "Réponse",
          description: "Données de réponse des composants",
        },
        errors: {
          unauthorized: {
            title: "Non autorisé",
            description: "Authentification requise",
          },
          validation: {
            title: "Erreur de validation",
            description: "Paramètres de requête invalides",
          },
          server: {
            title: "Erreur serveur",
            description: "Une erreur interne du serveur s'est produite",
          },
          unknown: {
            title: "Erreur inconnue",
            description: "Une erreur inconnue s'est produite",
          },
          network: {
            title: "Erreur réseau",
            description: "Une erreur réseau s'est produite",
          },
          forbidden: {
            title: "Interdit",
            description: "Accès interdit",
          },
          notFound: {
            title: "Introuvable",
            description: "Ressource introuvable",
          },
          conflict: {
            title: "Conflit",
            description: "Conflit de données",
          },
        },
        success: {
          title: "Succès",
          description: "Opération réussie",
        },
      },
    },
    emailSending: {
      email: {
        defaultSenderName: "Système",
        errors: {
          sending_failed: "Impossible d'envoyer l'e-mail à {{recipient}}",
        },
      },
    },
    emailHandling: {
      email: {
        errors: {
          rendering_failed: "Impossible de générer le modèle d'e-mail",
          send_failed: "Impossible d'envoyer l'e-mail",
          email_failed_subject: "Échec de l'e-mail",
          unknown_recipient: "Destinataire inconnu",
          unknown_sender: "Système",
          email_render_exception: "Exception lors de la génération de l'e-mail",
          batch_send_failed: "Échec de l'envoi groupé",
        },
      },
    },
    sending: {
      errors: {
        unauthorized: {
          title: "Non autorisé",
          description: "Authentification requise pour l'envoi SMTP",
        },
        server: {
          title: "Erreur serveur",
          description: "Une erreur s'est produite sur le serveur SMTP",
        },
        rejected: {
          title: "E-mail refusé",
          defaultReason: "E-mail refusé par le serveur",
        },
        no_recipients: {
          title: "Aucun destinataire accepté",
          defaultReason: "Aucun destinataire accepté",
        },
        rate_limit: {
          title: "Limite d'envoi dépassée",
        },
        capacity: {
          title: "Erreur de capacité",
        },
        no_account: {
          title: "Aucun compte SMTP disponible",
        },
      },
    },
    emailMetadata: {
      errors: {
        server: {
          title: "Erreur serveur des métadonnées e-mail",
          description: "Impossible d'enregistrer les métadonnées de l'e-mail",
        },
      },
    },
    enums: {
      status: {
        active: "Actif",
        inactive: "Inactif",
        error: "Erreur",
        testing: "En test",
      },
      securityType: {
        none: "Aucune",
        tls: "TLS",
        ssl: "SSL",
        starttls: "STARTTLS",
      },
      statusFilter: {
        all: "Tous les statuts",
      },
      healthStatus: {
        healthy: "Sain",
        degraded: "Dégradé",
        unhealthy: "Défaillant",
        unknown: "Inconnu",
      },
      healthStatusFilter: {
        all: "Tous les états de santé",
      },
      sortField: {
        name: "Nom",
        status: "Statut",
        createdAt: "Créé le",
        updatedAt: "Modifié le",
        priority: "Priorité",
        totalEmailsSent: "Total d'e-mails envoyés",
        lastUsedAt: "Dernière utilisation",
      },
      campaignType: {
        leadCampaign: "Campagne prospects",
        newsletter: "Newsletter",
        signupNurture: "Suivi après inscription",
        retention: "Fidélisation",
        winback: "Reconquête",
        transactional: "Transactionnel",
        notification: "Notification",
        system: "Système",
      },
      campaignTypeFilter: {
        all: "Tous les types de campagne",
      },
      selectionRuleSortField: {
        name: "Nom",
        priority: "Priorité",
        campaignType: "Type de campagne",
        journeyVariant: "Variante de parcours",
        campaignStage: "Étape de campagne",
        country: "Pays",
        language: "Langue",
        createdAt: "Créé le",
        updatedAt: "Modifié le",
        emailsSent: "E-mails envoyés",
        successRate: "Taux de réussite",
        lastUsedAt: "Dernière utilisation",
      },
      selectionRuleStatusFilter: {
        all: "Tous",
        active: "Actif",
        inactive: "Inactif",
        default: "Par défaut",
        failover: "Secours",
      },
      loadBalancingStrategy: {
        roundRobin: "Round robin",
        weighted: "Pondéré",
        priority: "Priorité",
        leastUsed: "Moins utilisé",
      },
      testResult: {
        success: "Succès",
        authFailed: "Échec de l'authentification",
        connectionFailed: "Échec de la connexion",
        timeout: "Délai dépassé",
        unknownError: "Erreur inconnue",
      },
    },
  },

  // Core emails level translations
  tag: "E-mails",
  tags: {
    stats: "Statistiques",
    analytics: "Analyses",
  },
  error: {
    default: "Une erreur s'est produite",
  },
  template: {
    tagline: "L'IA sans garde-fous",
  },
  footer: {
    visitWebsite: "Visiter le site",
    allRightsReserved: "Tous droits réservés",
  },

  // Email Templates
  templates: {
    leads: {
      batch: {
        update: {
          meta: {
            name: "E-mail de mise à jour groupée des prospects",
            description:
              "E-mail envoyé lors d'une mise à jour groupée des prospects",
          },
          preview: {
            totalMatched: "Total trouvés",
            totalMatched_description: "Nombre de prospects correspondants",
            totalProcessed: "Total traités",
            totalProcessed_description: "Nombre de prospects traités",
            totalUpdated: "Total mis à jour",
            totalUpdated_description: "Nombre de prospects mis à jour",
            errorsCount: "Nombre d'erreurs",
            errorsCount_description: "Nombre d'erreurs pendant le traitement",
            dryRun: "Simulation",
            dryRun_description: "Aperçu uniquement, sans modification",
            userId: "ID utilisateur",
            userId_description: "ID de l'utilisateur qui exécute l'action",
          },
        },
      },
      welcome: {
        meta: {
          name: "E-mail de bienvenue prospect",
          description: "E-mail de bienvenue envoyé aux nouveaux prospects",
        },
        preview: {
          leadId: "ID du prospect",
          leadId_description: "Identifiant unique du prospect",
          businessName: "Nom de l'entreprise",
          businessName_description: "Nom de l'entreprise (facultatif)",
          email: "E-mail",
          email_description: "Adresse e-mail du prospect",
          userId: "ID utilisateur",
          userId_description: "ID de l'utilisateur associé (facultatif)",
        },
      },
    },
    contact: {
      form: {
        meta: {
          name: "Envoi du formulaire de contact",
          description: "E-mail envoyé à la soumission du formulaire de contact",
        },
        preview: {
          name: "Nom",
          name_description: "Nom du contact",
          email: "E-mail",
          email_description: "Adresse e-mail du contact",
          company: "Entreprise",
          company_description: "Nom de l'entreprise (facultatif)",
          subject: "Objet",
          subject_description: "Objet du message",
          message: "Message",
          message_description: "Contenu du message",
          isForCompany: "Pour le compte entreprise",
          isForCompany_description:
            "Indique si cet e-mail est envoyé à l'équipe de l'entreprise",
          userId: "ID utilisateur",
          userId_description: "ID de l'utilisateur associé (facultatif)",
          leadId: "ID du prospect",
          leadId_description: "ID du prospect associé (facultatif)",
        },
      },
    },
    newsletter: {
      unsubscribe: {
        meta: {
          name: "Confirmation de désabonnement à la newsletter",
          description:
            "E-mail de confirmation du désabonnement à la newsletter",
        },
        preview: {
          email: "E-mail",
          email_description: "Adresse e-mail désabonnée",
        },
      },
      welcome: {
        meta: {
          name: "E-mail de bienvenue newsletter",
          description:
            "E-mail de bienvenue pour les nouveaux abonnés à la newsletter",
        },
        preview: {
          email: "E-mail",
          email_description: "Adresse e-mail de l'abonné",
          name: "Nom",
          name_description: "Nom de l'abonné (facultatif)",
          leadId: "ID du prospect",
          leadId_description: "ID du prospect associé (facultatif)",
          userId: "ID utilisateur",
          userId_description: "ID de l'utilisateur associé (facultatif)",
        },
      },
    },
    password: {
      reset: {
        confirm: {
          meta: {
            name: "Confirmation de réinitialisation du mot de passe",
            description:
              "E-mail de confirmation après réinitialisation du mot de passe",
          },
          preview: {
            publicName: "Nom public",
            publicName_description: "Nom public de l'utilisateur",
            userId: "ID utilisateur",
            userId_description: "Identifiant unique de l'utilisateur",
          },
        },
        request: {
          meta: {
            name: "Demande de réinitialisation du mot de passe",
            description: "E-mail contenant le lien de réinitialisation",
          },
          preview: {
            publicName: "Nom public",
            publicName_description: "Nom public de l'utilisateur",
            userId: "ID utilisateur",
            userId_description: "Identifiant unique de l'utilisateur",
            passwordResetUrl: "URL de réinitialisation",
            passwordResetUrl_description:
              "URL pour réinitialiser le mot de passe",
          },
        },
      },
    },
    signup: {
      welcome: {
        meta: {
          name: "Bienvenue après inscription",
          description: "E-mail de bienvenue pour les nouveaux inscrits",
        },
        preview: {
          privateName: "Nom privé",
          privateName_description: "Nom privé de l'utilisateur",
          userId: "ID utilisateur",
          userId_description: "Identifiant unique de l'utilisateur",
          leadId: "ID du prospect",
          leadId_description: "ID du prospect associé",
        },
      },
    },
    users: {
      welcome: {
        meta: {
          name: "E-mail de bienvenue utilisateur",
          description: "E-mail de bienvenue envoyé aux nouveaux utilisateurs",
        },
        preview: {
          userId: "ID utilisateur",
          userId_description: "Identifiant unique de l'utilisateur",
          email: "E-mail",
          email_description: "Adresse e-mail de l'utilisateur",
          privateName: "Nom privé",
          privateName_description: "Nom privé de l'utilisateur",
          publicName: "Nom public",
          publicName_description: "Nom public de l'utilisateur",
          leadId: "ID du prospect",
          leadId_description: "ID du prospect associé (facultatif)",
        },
      },
    },
    subscription: {
      success: {
        meta: {
          name: "Abonnement réussi",
          description: "E-mail de confirmation d'abonnement",
        },
        preview: {
          privateName: "Nom privé",
          privateName_description: "Nom privé de l'utilisateur",
          userId: "ID utilisateur",
          userId_description: "Identifiant unique de l'utilisateur",
          leadId: "ID du prospect",
          leadId_description: "ID du prospect associé",
          planName: "Nom de la formule",
          planName_description: "Nom de la formule d'abonnement",
        },
      },
    },
    admin: {
      signup: {
        meta: {
          name: "Admin : nouvelle inscription",
          description:
            "Notification admin lors de l'inscription d'un utilisateur",
        },
        preview: {
          privateName: "Nom privé",
          publicName: "Nom public",
          email: "E-mail",
          userId: "ID utilisateur",
          subscribeToNewsletter: "Inscription à la newsletter",
        },
      },
      subscription: {
        meta: {
          name: "Admin : nouvel abonnement",
          description: "Notification admin lorsqu'un utilisateur s'abonne",
        },
        preview: {
          privateName: "Nom privé",
          publicName: "Nom public",
          email: "E-mail",
          planName: "Nom de la formule",
          statusName: "Statut",
        },
      },
      user_create: {
        meta: {
          name: "Admin : nouvel utilisateur créé",
          description: "Notification admin lors de la création d'un compte",
        },
        preview: {
          privateName: "Nom privé",
          publicName: "Nom public",
          email: "E-mail",
          userId: "ID utilisateur",
          leadId: "ID du prospect",
        },
      },
      contact: {
        meta: {
          name: "Admin : formulaire de contact",
          description:
            "Notification admin lors de l'envoi d'un formulaire de contact",
        },
        preview: {
          name: "Nom de l'expéditeur",
          email: "E-mail de l'expéditeur",
          subject: "Objet",
          message: "Message",
          company: "Entreprise",
          userId: "ID utilisateur",
          leadId: "ID du prospect",
        },
      },
    },
  },

  // Email Preview System
  preview: {
    render: {
      post: {
        title: "Générer l'aperçu de l'e-mail",
        titleShort: "Générer l'aperçu",
        description: "Rendu côté serveur des modèles d'e-mail pour aperçu",
        container: {
          title: "Configuration de l'aperçu e-mail",
        },
        success: {
          title: "Aperçu généré",
          description: "Aperçu de l'e-mail généré",
        },
        fields: {
          templateId: {
            label: "ID du modèle",
            description: "ID du modèle d'e-mail à générer",
          },
          language: {
            label: "Langue",
            description: "Langue du rendu de l'e-mail",
          },
          country: {
            label: "Pays",
            description: "Pays du rendu de l'e-mail",
          },
          props: {
            label: "Props du modèle",
            description: "Propriétés transmises au modèle d'e-mail",
          },
          html: {
            title: "HTML généré",
          },
          subject: {
            title: "Objet de l'e-mail",
          },
          templateVersion: {
            title: "Version du modèle",
          },
        },
        errors: {
          validation: {
            title: "Erreur de validation",
            description: "Données de la requête d'aperçu invalides",
          },
          network: {
            title: "Erreur réseau",
            description: "Erreur réseau lors du rendu de l'aperçu",
          },
          unauthorized: {
            title: "Non autorisé",
            description: "Vous n'êtes pas autorisé à générer des aperçus",
          },
          forbidden: {
            title: "Interdit",
            description: "La génération d'aperçus est interdite",
          },
          notFound: {
            title: "Introuvable",
            description: "Modèle d'e-mail introuvable",
          },
          server: {
            title: "Erreur serveur",
            description: "Impossible de générer l'aperçu de l'e-mail",
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
            description: "Un conflit est survenu pendant le rendu",
          },
        },
      },
      title: "Aperçu de l'e-mail",
      preview: "Aperçu",
      version: "Version",
      submit: "Générer l'aperçu",
      submitting: "Génération...",
    },
    sendTest: {
      post: {
        title: "Envoyer un e-mail de test",
        titleShort: "E-mail de test",
        description:
          "Envoyer un e-mail de test avec des données de modèle personnalisées",
        container: {
          title: "Configuration de l'e-mail de test",
        },
        success: {
          title: "E-mail de test envoyé",
          description: "L'e-mail de test a bien été envoyé",
        },
        fields: {
          templateId: {
            label: "ID du modèle",
            description: "ID du modèle d'e-mail à envoyer",
          },
          recipientEmail: {
            label: "E-mail du destinataire",
            description: "Adresse e-mail qui recevra le test",
          },
          language: {
            label: "Langue",
            description: "Langue du rendu de l'e-mail",
          },
          country: {
            label: "Pays",
            description: "Pays du rendu de l'e-mail",
          },
          props: {
            label: "Props du modèle",
            description: "Propriétés transmises au modèle d'e-mail",
          },
          success: {
            title: "Succès",
          },
          message: {
            title: "Message de résultat",
          },
        },
        errors: {
          validation: {
            title: "Erreur de validation",
            description: "Données de la requête d'e-mail de test invalides",
          },
          network: {
            title: "Erreur réseau",
            description: "Erreur réseau lors de l'envoi de l'e-mail de test",
          },
          unauthorized: {
            title: "Non autorisé",
            description:
              "Vous n'êtes pas autorisé à envoyer des e-mails de test",
          },
          forbidden: {
            title: "Interdit",
            description: "L'envoi d'e-mails de test est interdit",
          },
          notFound: {
            title: "Introuvable",
            description: "Modèle d'e-mail introuvable",
          },
          server: {
            title: "Erreur serveur",
            description: "Impossible d'envoyer l'e-mail de test",
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
            description: "Un conflit est survenu pendant l'envoi",
          },
        },
      },
      error: {
        templateNotFound: "Modèle d'e-mail {{templateId}} introuvable",
        invalidProps: "Props du modèle invalides : {{error}}",
        sendFailed: "Impossible d'envoyer l'e-mail de test : {{error}}",
      },
      success: "E-mail de test envoyé",
      successDetail: "E-mail de test envoyé à {{email}}",
      title: "Envoyer un e-mail de test",
      failed: "Impossible d'envoyer l'e-mail de test",
      submit: "Envoyer l'e-mail de test",
      submitting: "Envoi...",
    },
  },
  messaging: {
    category: "Messagerie",
    tag: "messagerie",
    enums: {
      channel: {
        email: "E-mail",
        sms: "SMS",
        whatsapp: "WhatsApp",
        telegram: "Telegram",
      },
      channelFilter: {
        any: "Tous les canaux",
      },
      provider: {
        twilio: "Twilio",
        awsSns: "AWS SNS",
        messagebird: "MessageBird",
        http: "HTTP",
        whatsappBusiness: "WhatsApp Business",
        telegramBot: "Bot Telegram",
      },
      accountStatus: {
        active: "Actif",
        inactive: "Inactif",
        error: "Erreur",
        testing: "En test",
      },
    },
    send: {
      errors: {
        accountNotFound: "Compte de messagerie {{accountId}} introuvable",
        sendFailed: "Impossible d'envoyer le message",
        unexpected: "Erreur inattendue lors de l'envoi du message : {{error}}",
      },
    },
  },
  providers: {
    errors: {
      smtpSendFailed: "Échec de l'envoi SMTP",
      smtpAccountNotFound: "Compte IMAP introuvable",
      smtpListInboxFailed: "Impossible de lister la boîte de réception",
      smtpListFoldersFailed: "Impossible de lister les dossiers",
      smtpMoveMessageFailed: "Impossible de déplacer le message",
      smtpMarkReadFailed: "Impossible de marquer le message",
      resendKeyNotConfigured: "Clé API Resend non configurée",
      resendSendFailed: "Échec de l'envoi via Resend",
      resendProviderError: "Erreur du fournisseur Resend",
      resendNoInbox: "Resend ne prend pas en charge la boîte de réception",
      resendNoFolders: "Resend ne prend pas en charge les dossiers",
      smsSendFailed: "Échec de l'envoi du SMS",
      whatsappSendFailed: "Échec de l'envoi WhatsApp",
      telegramSendFailed: "Échec de l'envoi Telegram",
      accountNotFound: "Compte de messagerie introuvable",
      notSupported: "Ce fournisseur ne prend pas en charge cette opération",
    },
  },
};
