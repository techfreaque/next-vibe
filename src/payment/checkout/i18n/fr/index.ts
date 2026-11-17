import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  // Main checkout titles and descriptions
  title: "Créer un paiement d'abonnement",
  titleShort: "Paiement",
  description: "Créer une session de paiement Stripe pour un abonnement",
  category: "Abonnement",

  // Tags
  tags: {
    subscription: "abonnement",
    checkout: "paiement",
    stripe: "stripe",
  },

  // Form configuration
  form: {
    title: "Configuration du paiement",
    description: "Configurer les paramètres de la session de paiement",
    fields: {
      planId: {
        label: "Formule d'abonnement",
        description: "Sélectionnez la formule d'abonnement",
        placeholder: "Choisir une formule",
      },
      billingInterval: {
        label: "Périodicité de facturation",
        description: "Sélectionnez la fréquence de facturation",
        placeholder: "Choisir la périodicité",
      },
      provider: {
        label: "Moyen de paiement",
        description: "Choisissez comment vous voulez payer",
        placeholder: "Sélectionner un moyen de paiement",
      },
      metadata: {
        label: "Métadonnées",
        description: "Métadonnées supplémentaires pour la session de paiement",
        placeholder: "Saisir les métadonnées en JSON",
      },
    },
  },

  // Response fields
  response: {
    success: "Session de paiement créée",
    sessionId: "ID de session Stripe",
    checkoutUrl: "URL de paiement",
    message: "Message de statut",
  },

  // Error types
  errors: {
    validation: {
      title: "Erreur de validation",
      description: "Paramètres de requête invalides",
    },
    network: {
      title: "Erreur réseau",
      description: "Erreur de connexion réseau",
    },
    unauthorized: {
      title: "Non autorisé",
      description: "Authentification requise",
    },
    forbidden: {
      title: "Interdit",
      description: "Accès interdit",
    },
    notFound: {
      title: "Introuvable",
      description: "Ressource introuvable",
    },
    serverError: {
      title: "Erreur serveur",
      description: "Une erreur interne du serveur est survenue",
    },
    unknown: {
      title: "Erreur inconnue",
      description: "Une erreur inconnue est survenue",
    },
    unsavedChanges: {
      title: "Modifications non enregistrées",
      description: "Vous avez des modifications non enregistrées",
    },
    conflict: {
      title: "Conflit",
      description: "Un conflit de données est survenu",
    },
  },

  // Success types
  success: {
    title: "Succès",
    description: "Session de paiement créée",
  },

  // POST endpoint specific translations
  post: {
    title: "Créer une session de paiement",
    description: "Créer une nouvelle session de paiement d'abonnement",
    form: {
      title: "Configuration de la session de paiement",
      description: "Configurer les paramètres de la session de paiement",
    },
    response: {
      title: "Réponse du paiement",
      description: "Données de la session de paiement",
    },
    errors: {
      alreadySubscribed: {
        detail: "Vous avez déjà un abonnement actif (utilisateur {{userId}})",
        title: "Déjà abonné",
        description: "Vous avez déjà un abonnement actif",
      },
      validation: {
        title: "Erreur de validation",
        description: "Paramètres de paiement invalides",
        reason: {
          yearlyNotAvailable:
            "La facturation annuelle existe uniquement pour la formule {{plan}}. Choisissez le mensuel.",
          cryptoStarterYearly:
            "Starter se paie en crypto à l'année. Choisissez l'annuel, ou Plus, Pro ou Ultra.",
        },
      },
      network: {
        title: "Erreur réseau",
        description: "Erreur de connexion réseau",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Authentification requise",
      },
      forbidden: {
        title: "Interdit",
        description: "Accès interdit",
      },
      notFound: {
        detail: "Aucun compte trouvé pour l'utilisateur {{userId}}",
        title: "Introuvable",
        description: "Session de paiement introuvable",
      },
      server: {
        detail: "Impossible de lancer le paiement : {{error}}",
        title: "Erreur serveur",
        description: "Une erreur interne du serveur est survenue",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inconnue est survenue",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Vous avez des modifications non enregistrées",
      },
      conflict: {
        title: "Conflit",
        description: "Un conflit de données est survenu",
      },
    },
    success: {
      title: "Succès",
      description: "Session de paiement créée",
    },
  },

  // General error message
  error: "Une erreur est survenue pendant le paiement",
  errorDetail: "Échec du paiement : {{error}}",

  // Subscription plan labels
  plans: {
    starter: {
      title: "Starter",
    },
    plus: {
      title: "Plus",
    },
    pro: {
      title: "Pro",
    },
    ultra: {
      title: "Ultra",
    },
  },

  enums: {
    paymentProvider: {
      stripe: "Stripe",
      nowpayments: "NowPayments",
    },
  },

  // Billing interval labels
  billing: {
    monthly: "Mensuel",
    yearly: "Annuel",
  },
};
