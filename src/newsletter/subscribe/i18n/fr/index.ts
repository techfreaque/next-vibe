import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Newsletter",
  enum: {
    preferences: {
      marketing: "Marketing",
      productNews: "Actualités produit",
      companyUpdates: "Nouvelles de l'entreprise",
      industryInsights: "Analyses du secteur",
      events: "Événements",
    },
    creditBonus: {
      active: "Bonus actif",
      pendingConfirmation: "Confirmez votre e-mail pour le débloquer",
      claimedElsewhere: "Déjà obtenu par un autre compte",
      accountRequired: "Compte gratuit requis",
    },
  },
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
    creditBonus: "Bonus de crédits gratuits",
    bonusCredits: "Crédits bonus par mois",
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
      detail: "Échec de l'abonnement : {{error}}",
    },
  },
  post: {
    title: "Abonnement à la newsletter",
    titleShort: "S'abonner",
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
        description: "Cette adresse e-mail est déjà abonnée à notre newsletter",
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
    sms_failed_continuing: "Échec des notifications SMS, traitement poursuivi",
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
      subject: "Bienvenue chez {{appName}} : toute l'actu de l'IA non censurée",
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
      confirm_title:
        "Plus qu'un clic : +{{bonusCredits}} crédits gratuits chaque mois",
      confirm_text:
        "Confirmez cette adresse et votre compte reçoit {{bonusCredits}} crédits gratuits en plus, chaque mois, tant que vous restez abonné.",
      confirm_button: "Confirmer et débloquer +{{bonusCredits}} crédits",
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
};
