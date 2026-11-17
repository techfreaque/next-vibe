import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Newsletter",
  status: {
    title: "Statut de la newsletter",
    description:
      "Vérifier le statut d'abonnement à la newsletter d'une adresse e-mail",
    category: "Newsletter",
    tags: {
      status: "Statut",
    },
    form: {
      title: "Vérifier le statut newsletter",
      description:
        "Saisissez une adresse e-mail pour vérifier son statut d'abonnement à la newsletter",
    },
    email: {
      label: "Adresse e-mail",
      description: "L'adresse e-mail dont vérifier le statut d'abonnement",
      placeholder: "utilisateur@exemple.fr",
      helpText: "Saisissez l'adresse e-mail à vérifier",
    },
    response: {
      subscribed: "Statut de l'abonnement",
      status: "Statut actuel",
    },
    errors: {
      validation: {
        title: "E-mail invalide",
        description: "Indiquez une adresse e-mail valide",
      },
      internal: {
        title: "Erreur interne",
        description:
          "Une erreur est survenue lors de la vérification du statut d'abonnement",
      },
      unauthorized: {
        title: "Non autorisé",
        description:
          "Vous n'êtes pas autorisé à vérifier ce statut d'abonnement",
      },
      notFound: {
        title: "Introuvable",
        description:
          "Aucune information d'abonnement pour cette adresse e-mail",
      },
    },
    success: {
      title: "Statut récupéré",
      description: "Statut d'abonnement à la newsletter récupéré",
    },
  },
  subscribe: {
    category: "Newsletter",
    tags: {
      newsletter: "Newsletter",
      subscription: "Abonnement",
    },
    email: {
      label: "Adresse e-mail",
      description: "Votre adresse e-mail pour l'abonnement à la newsletter",
      placeholder: "utilisateur@exemple.fr",
      helpText: "Nous l'utilisons pour vous envoyer la newsletter",
    },
    name: {
      label: "Nom",
      description: "Votre nom (facultatif)",
      placeholder: "Jean Dupont",
      helpText: "Pour personnaliser votre newsletter",
    },
    preferences: {
      label: "Préférences newsletter",
      description:
        "Choisissez les types de newsletters que vous souhaitez recevoir",
      placeholder: "Choisir vos préférences",
      helpText: "Vous pouvez modifier ces préférences à tout moment",
    },
    leadId: {
      label: "ID du lead",
      description: "Identifiant de lead facultatif",
      placeholder: "123e4567-e89b-12d3-a456-426614174000",
      helpText: "Usage interne uniquement",
    },
    response: {
      success: "Abonnement à la newsletter réussi",
      message: "Message de confirmation",
      leadId: "Identifiant du lead",
      subscriptionId: "ID de l'abonnement",
      userId: "ID utilisateur",
      alreadySubscribed:
        "Cette adresse e-mail est déjà abonnée à notre newsletter",
    },
    errors: {
      email_generation_failed: "Impossible de générer l'e-mail",
      badRequest: {
        title: "Requête invalide",
        description: "Les paramètres de la requête sont invalides",
      },
      internal: {
        title: "Erreur interne",
        description:
          "Une erreur est survenue lors du traitement de votre abonnement",
      },
    },
    post: {
      title: "Abonnement à la newsletter",
      description: "S'abonner aux nouvelles et notifications de la newsletter",
      form: {
        title: "Abonnement à la newsletter",
        description: "Configurez vos préférences d'abonnement à la newsletter",
      },
      response: {
        title: "Réponse d'abonnement",
        description: "Données de confirmation de l'abonnement à la newsletter",
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
        internal: {
          title: "Erreur interne",
          description:
            "Une erreur est survenue lors du traitement de votre abonnement",
        },
        forbidden: {
          title: "Interdit",
          description: "Accès interdit",
        },
        conflict: {
          title: "Déjà abonné",
          description:
            "Cette adresse e-mail est déjà abonnée à notre newsletter",
        },
        badRequest: {
          title: "Requête invalide",
          description: "Les paramètres de la requête sont invalides",
        },
      },
      success: {
        title: "Abonnement confirmé",
        description: "Vous êtes maintenant abonné à notre newsletter",
      },
    },
    repository: {
      starting: "Début de l'abonnement à la newsletter",
      linking_to_lead: "Liaison de l'abonnement newsletter au lead",
      lead_found: "Lead trouvé pour l'abonnement newsletter",
      lead_updated: "Lead mis à jour avec les données d'abonnement newsletter",
      lead_update_failed:
        "Impossible de mettre à jour le lead avec les données newsletter",
      lead_not_found: "Lead introuvable ou non éligible à la mise à jour",
      lead_linking_error:
        "Erreur lors de la liaison du lead depuis la newsletter",
      missing_lead_id: "Tentative d'abonnement à la newsletter sans leadId",
      already_subscribed: "Utilisateur déjà abonné à la newsletter",
      reactivating: "Réactivation de l'abonnement à la newsletter",
      creating_new: "Création d'un nouvel abonnement à la newsletter",
      created_successfully: "Abonnement à la newsletter créé",
      subscription_failed: "Échec de l'abonnement à la newsletter",
    },
    sms: {
      no_phone_number:
        "Aucun numéro de téléphone disponible pour le SMS de bienvenue newsletter",
      sending_welcome: "Envoi du SMS de bienvenue à l'abonné de la newsletter",
      welcome_error: "Erreur lors de l'envoi du SMS de bienvenue newsletter",
      no_admin_phone:
        "Aucun numéro de téléphone admin configuré, notification SMS ignorée",
      sending_admin_notification:
        "Envoi du SMS de notification admin pour l'abonnement newsletter",
      admin_notification_error:
        "Erreur lors de l'envoi du SMS de notification admin",
      welcome: {
        message:
          "Bonjour {{name}} ! Bienvenue dans notre newsletter. Les prochaines nouvelles arrivent bientôt !",
      },
      admin_notification: {
        message:
          "Nouvel abonnement newsletter : {{displayName}} ({{email}}) vient de s'abonner",
      },
    },
    route: {
      sms_failed_continuing:
        "Échec des notifications SMS, traitement poursuivi",
    },
    emailTemplates: {
      welcome: {
        name: "E-mail de bienvenue newsletter",
        description:
          "E-mail de bienvenue envoyé aux nouveaux abonnés de la newsletter",
        category: "newsletter",
        preview: {
          email: {
            label: "Adresse e-mail",
            description: "Adresse e-mail de l'abonné",
          },
          name: {
            label: "Nom de l'abonné",
            description: "Nom de l'abonné (facultatif)",
          },
          leadId: {
            label: "ID du lead",
            description: "Identifiant de suivi du lead pour l'analytics",
          },
          userId: {
            label: "ID utilisateur",
            description: "Identifiant du compte utilisateur (facultatif)",
          },
        },
      },
    },
    emailTemplate: {
      welcome: {
        title: "Bienvenue dans la newsletter {{appName}} !",
        subject:
          "Bienvenue chez {{appName}} : toute l'actu de l'IA non censurée",
        preview:
          "Vous êtes abonné ! Recevez les dernières nouvelles sur l'IA non censurée, les nouveaux modèles et des conseils exclusifs.",
        greeting_with_name: "Bonjour {{name}} !",
        greeting: "Bonjour !",
        message:
          "Bienvenue dans la newsletter {{appName}} ! Vous faites maintenant partie de notre communauté de passionnés d'IA qui veulent des conversations honnêtes et non censurées.",
        what_to_expect: "Voici ce que vous recevrez :",
        benefit_1: "Les annonces et nouveautés des modèles d'IA",
        benefit_2: "Des astuces pour tirer le meilleur de l'IA non censurée",
        benefit_3:
          "Des offres exclusives et un accès anticipé aux nouvelles fonctionnalités",
        benefit_4: "Les temps forts et les réussites de la communauté",
        frequency:
          "Un e-mail toutes les quelques semaines. Jamais de spam, toujours du contenu utile.",
        unsubscribe_text: "Vous ne souhaitez plus recevoir ces e-mails ?",
        unsubscribe_link: "Se désabonner",
      },
      admin_notification: {
        title: "Nouvel abonnement newsletter",
        subject: "Nouvel abonnement newsletter",
        preview: "Un nouvel utilisateur s'est abonné à la newsletter",
        message: "Un nouvel utilisateur s'est abonné à la newsletter.",
        subscriber_details: "Détails de l'abonné",
        email: "E-mail",
        name: "Nom",
        preferences: "Préférences",
        view_in_admin: "Voir dans le panneau d'admin",
      },
    },
  },
  unsubscribe: {
    category: "Newsletter",
    tags: {
      newsletter: "Newsletter",
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
      },
    },
    post: {
      title: "Désabonnement de la newsletter",
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
    sync: {
      failed: "Échec de la synchronisation des désabonnements newsletter",
      error: "Erreur de synchronisation des désabonnements newsletter",
      tag: "Synchro newsletter",
      post: {
        title: "Synchronisation des désabonnements newsletter",
        titleShort: "Synchro désabos",
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
  },
  email: {
    welcome: {
      title: "Bienvenue dans notre newsletter",
      preview: "Bienvenue dans notre newsletter ! Merci de vous être abonné",
      greeting: "Bonjour",
      greeting_with_name: "Bonjour {{name}}",
      message:
        "Bienvenue dans la newsletter {{appName}} ! Merci de vous être abonné.",
      what_to_expect: "Voici ce que vous trouverez dans notre newsletter :",
      benefit_1: "Les dernières nouveautés et fonctionnalités du produit",
      benefit_2: "Analyses et tendances du secteur",
      benefit_3: "Contenus et conseils exclusifs",
      benefit_4: "Offres spéciales et promotions",
      frequency: "Une newsletter par semaine avec les dernières nouveautés.",
      unsubscribe_text: "Vous pouvez vous désabonner à tout moment en cliquant",
      unsubscribe_link: "ici",
      subject: "Bienvenue dans notre newsletter !",
    },
    admin_notification: {
      title: "Nouvel abonnement newsletter",
      preview: "Un nouvel utilisateur s'est abonné à la newsletter",
      message: "Un nouvel utilisateur s'est abonné à votre newsletter.",
      subscriber_details: "Détails de l'abonné",
      email: "E-mail",
      name: "Nom",
      preferences: "Préférences",
      view_in_admin: "Voir dans le panneau d'admin",
      subject: "Nouvel abonnement newsletter : notification admin",
    },
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
  enum: {
    preferences: {
      marketing: "Marketing",
      productNews: "Actualités produit",
      companyUpdates: "Nouvelles de l'entreprise",
      industryInsights: "Analyses du secteur",
      events: "Événements",
    },
    status: {
      subscribed: "Abonné",
      unsubscribed: "Désabonné",
      pending: "En attente",
      bounced: "Rejeté (bounce)",
      complained: "Signalé comme spam",
    },
    creditBonus: {
      active: "Bonus actif",
      pendingConfirmation: "Confirmez votre e-mail pour le débloquer",
      claimedElsewhere: "Déjà obtenu par un autre compte",
      accountRequired: "Compte gratuit requis",
    },
  },
  hooks: {
    errors: {
      missing_lead_id: "Abonnement newsletter : leadId manquant",
    },
  },
  errors: {
    email_generation_failed: "Impossible de générer l'e-mail",
  },
  error: {
    general: {
      internal_server_error: "Erreur interne du serveur",
    },
    default: "Une erreur est survenue",
  },
  subscription: {
    error: {
      description: "Impossible de s'abonner à la newsletter",
    },
    unsubscribe: {
      error: "Impossible de se désabonner de la newsletter",
      confirmQuestion: "Voulez-vous vraiment vous désabonner ?",
    },
  },
};
