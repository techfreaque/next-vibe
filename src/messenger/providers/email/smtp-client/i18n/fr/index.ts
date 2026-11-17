import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tag: "Client SMTP",
  category: "Services e-mail",
  components: {
    email: {
      tagline: "La plateforme d'IA de la liberté d'expression",
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
          "Quelque chose à nous dire ? Répondez à cet e-mail. Nous lisons vraiment.",
        feedbackBody:
          "Signalez un bug, proposez une fonctionnalité ou dites-nous ce qui manque. Un retour utile vous rapporte {{credits}} crédits : un mois entier offert.",
        feedbackLink: "Répondre avec votre avis →",
        footerSeparator: " · ",
        legalOperator:
          "{{companyName}} est exploité par {{owner}}, {{address}}.",
        legalContact: "Contact",
        legalNotice: "Mentions légales",
      },
    },
    post: {
      title: "Composants",
      description: "Endpoint des composants",
      form: {
        title: "Configuration des composants",
        description: "Paramétrez les composants",
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
  },
  emailSending: {
    email: {
      defaultSenderName: "Système",
      errors: {
        sending_failed:
          "Échec de l'envoi de l'e-mail à {{recipient}} : {{error}}",
        invalid_locale:
          "Envoi impossible à {{recipient}} : « {{locale}} » n'est pas une locale valide",
      },
    },
  },
  emailHandling: {
    email: {
      errors: {
        rendering_failed: "Échec du rendu du modèle d'e-mail : {{error}}",
        send_failed: "Échec de l'envoi de l'e-mail : {{error}}",
        email_failed_subject: "Échec de l'e-mail",
        unknown_recipient: "Destinataire inconnu",
        unknown_sender: "Système",
        email_render_exception:
          "Une exception est survenue lors du rendu de l'e-mail",
        batch_send_failed: "Échec de l'envoi groupé d'e-mails",
        batch_send_failed_item: "Échec de l'envoi groupé : {{error}}",
        batch_send_failed_all: "Échec de l'envoi groupé d'e-mails : {{errors}}",
      },
    },
  },
  sending: {
    errors: {
      unauthorized: {
        title: "Non autorisé",
        description: "Authentification requise pour les envois SMTP",
      },
      server: {
        title: "Erreur serveur",
        description: "Une erreur est survenue sur le serveur SMTP",
        detail: "Échec de l'envoi SMTP : {{error}}",
        detail_account:
          "Échec SMTP sur {{accountName}} ({{accountId}}) : {{error}}",
        detail_attempt:
          "Le compte SMTP {{accountId}} a échoué à la tentative {{attempt}} : {{error}}",
        detail_exhausted:
          "Le compte SMTP {{accountId}} a épuisé toutes ses tentatives",
      },
      rejected: {
        title: "E-mail à {{recipient}} rejeté : {{reason}}",
        defaultReason: "E-mail rejeté par le serveur",
      },
      no_recipients: {
        title: "Aucun destinataire accepté pour {{recipient}}",
        defaultReason: "Aucun destinataire accepté",
      },
      rate_limit: {
        title:
          "Limite horaire atteinte sur {{accountName}} : {{current}}/{{limit}} envoyés, {{remainingCapacity}} restants",
      },
      capacity: {
        title: "Échec de la vérification de capacité : {{error}}",
      },
      no_account: {
        title: "Aucun compte SMTP disponible",
        detail_criteria:
          "Aucun compte SMTP pour {{campaignType}} / {{journeyVariant}} / {{campaignStage}} / {{country}} / {{language}}",
        detail_campaign:
          "Aucun compte SMTP pour le type de campagne {{campaignType}}",
        detail_account: "Compte SMTP {{accountId}} introuvable",
      },
    },
  },
  emailMetadata: {
    errors: {
      server: {
        title: "Erreur serveur des métadonnées e-mail",
        description: "Impossible d'enregistrer les métadonnées de l'e-mail",
        detail_store:
          "Impossible d'enregistrer les métadonnées pour {{recipient}} : {{error}}",
        detail_engagement:
          "Impossible de mettre à jour l'engagement du message {{emailId}} : {{error}}",
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
      healthy: "Opérationnel",
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
      updatedAt: "Mis à jour le",
      priority: "Priorité",
      totalEmailsSent: "Total des e-mails envoyés",
      lastUsedAt: "Dernière utilisation",
    },
    campaignType: {
      leadCampaign: "Campagne de leads",
      newsletter: "Newsletter",
      signupNurture: "Accompagnement après inscription",
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
      updatedAt: "Mis à jour le",
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
      leastUsed: "Le moins utilisé",
    },
    testResult: {
      success: "Succès",
      authFailed: "Échec de l'authentification",
      connectionFailed: "Échec de la connexion",
      timeout: "Délai dépassé",
      unknownError: "Erreur inconnue",
    },
  },
};
