import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Stripe CLI",
  titleShort: "Stripe CLI",
  description: "Écoute les webhooks Stripe en local",
  category: "Intégration de paiement",
  tags: {
    stripe: "Stripe",
    cli: "Ligne de commande",
    webhook: "Webhook",
  },

  form: {
    title: "Stripe CLI",
    description:
      "Transférez les événements webhook Stripe vers votre serveur local",
    fields: {
      port: {
        label: "Port",
        description:
          "Port local vers lequel transférer les webhooks (par défaut : 3000)",
        placeholder: "3000",
      },
    },
  },

  status: {
    authenticated: "Authentifié et prêt",
    not_authenticated: "Non authentifié : lancez 'stripe login'",
    not_installed: "Stripe CLI n'est pas installé. {{instructions}}",
  },

  errors: {
    validation: {
      title: "Configuration invalide",
      description: "Vérifiez votre configuration Stripe CLI et réessayez",
    },
    network: {
      title: "Erreur réseau",
      description: "Impossible de joindre Stripe",
    },
    unauthorized: {
      title: "Non autorisé",
      description: "Vous n'avez pas l'autorisation d'effectuer cette opération",
    },
    forbidden: {
      title: "Accès interdit",
      description: "Cette opération n'est pas autorisée pour votre compte",
    },
    notFound: {
      title: "Introuvable",
      description: "Stripe CLI n'est pas installé",
    },
    serverError: {
      detail: "L'écoute Stripe CLI a échoué : {{error}}",
      title: "Erreur serveur",
      description: "Une erreur s'est produite pendant l'écoute Stripe",
    },
    unknown: {
      title: "Erreur inconnue",
      description: "Une erreur inattendue s'est produite",
    },
    customerRetrievalFailed: {
      detail:
        "Impossible de charger votre fiche client Stripe : {{error}} (utilisateur {{userId}})",
      title: "Échec de la récupération du client",
      description: "Impossible de récupérer les informations du client Stripe",
    },
    unsavedChanges: {
      title: "Modifications non enregistrées",
      description:
        "Vous avez des modifications de configuration non enregistrées",
    },
    conflict: {
      title: "Conflit d'opération",
      description: "Une autre opération Stripe est déjà en cours",
    },
    execution_failed: "L'opération Stripe CLI a échoué",
    userNotFound: {
      detail: "Aucun compte trouvé pour l'utilisateur {{userId}}",
      title: "Utilisateur introuvable",
      description: "L'utilisateur indiqué est introuvable",
    },
    customerCreationFailed: {
      detail:
        "Impossible de créer votre fiche client Stripe : {{error}} (utilisateur {{userId}})",
      title: "Échec de la création du client",
      description: "Impossible de créer le client Stripe",
    },
    checkoutUnavailable: {
      detail:
        "Le paiement par carte est indisponible de notre côté pour le moment. Nous sommes prévenus et nous nous en occupons. Réessayez plus tard.",
    },
    checkoutCreationFailed: {
      detail: "Impossible de lancer le paiement : {{error}}",
      title: "Échec de la création du paiement",
      description: "Impossible de créer la session de paiement Stripe",
    },
    webhookVerificationFailed: {
      detail: "Impossible de vérifier le webhook Stripe : {{error}}",
      title: "Échec de la vérification du webhook",
      description: "Impossible de vérifier la signature du webhook",
    },
    subscriptionRetrievalFailed: {
      detail: "Impossible de charger l'abonnement depuis Stripe : {{error}}",
      title: "Échec de la récupération de l'abonnement",
      description: "Impossible de récupérer l'abonnement chez Stripe",
    },
    subscriptionCancellationFailed: {
      detail: "Impossible de résilier l'abonnement : {{error}}",
      title: "Échec de la résiliation de l'abonnement",
      description: "Impossible de résilier l'abonnement chez Stripe",
    },
    priceCreationFailed: {
      detail:
        "Impossible de créer le prix Stripe : {{error}} (produit {{productId}})",
      title: "Échec de la création du prix",
      description: "Impossible de créer le prix chez Stripe",
    },
    notConfigured: {
      title: "Stripe non configuré",
      description: "Définissez STRIPE_SECRET_KEY dans votre .env",
    },
    stripeCliNotInstalled: "Stripe CLI n'est pas installé",
    listenerFailed: "Impossible de démarrer l'écoute des webhooks Stripe",
  },

  success: {
    title: "Écoute démarrée",
    description: "Stripe CLI écoute les webhooks",
  },
};
