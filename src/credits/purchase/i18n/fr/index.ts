import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  enums: {
    paymentProvider: {
      stripe: "Stripe",
      nowpayments: "NowPayments",
    },
  },
  post: {
    title: "Acheter des crédits",
    titleShort: "Acheter des crédits",
    description:
      "Créer une session de paiement Stripe pour l'achat d'un pack de crédits",
    container: {
      title: "Acheter des crédits",
      description:
        "Achetez des packs de crédits pour utiliser les fonctions d'IA",
    },
    quantity: {
      label: "Quantité",
      description: "Nombre de packs de crédits à acheter (1 à 10)",
      placeholder: "Saisissez une quantité (1 à 10)",
    },
    productId: {
      label: "Pack de crédits",
      description: "Choisissez la taille du pack",
      placeholder: "Choisir un pack",
    },
    provider: {
      label: "Choisissez un moyen de paiement",
      description: "Choisissez comment payer votre pack de crédits",
      placeholder: "Choisir un prestataire de paiement",
      stripe: "Carte, PayPal et portefeuilles",
      stripeDescription: "Carte, PayPal, Apple Pay, Google Pay via Stripe",
      nowpayments: "Cryptomonnaie",
      nowpaymentsDescription: "Payez en Bitcoin, Ethereum et plus encore",
      cryptoMinimumDisabled:
        "{{min}} packs minimum pour un paiement en cryptomonnaie",
    },
    checkoutUrl: {
      content: "URL de paiement",
    },
    sessionId: {
      content: "ID de session",
    },
    totalAmount: {
      content: "Montant total (centimes)",
    },
    totalCredits: {
      content: "Total des crédits",
    },
    pack: {
      qtyCredits: "{{count}} crédits",
      title: "Pack de crédits",
      description: "Rechargez votre formule. Les crédits n'expirent jamais.",
      perPack: "/ pack",
      features: {
        credits: "{{count}} crédits inclus",
        expiry: "Les crédits n'expirent jamais",
        bestFor: "S'ajoute à vos crédits mensuels",
      },
      planRequired: {
        title: "Les packs rechargent une formule",
        body: "Démarrez d'abord une formule, puis ajoutez des packs quand vous êtes à court. Formules dès {{price}} par mois.",
        cta: "Voir les formules",
      },
      logIn: "Se connecter",
      signUp: "S'inscrire",
      signInToBuy:
        "Les packs rechargent une formule. Créez un compte gratuit et démarrez d'abord une formule.",
      totalSummary:
        "{{totalCredits}} crédits au total · {{totalPrice}} au total",
    },
    submit: {
      text: "Acheter le pack de crédits",
      loading: "Traitement en cours...",
    },
    redirecting: "Redirection vers le paiement...",
    openCheckout: "Ouvrir le paiement",
    backButton: {
      label: "Retour",
    },
    submitButton: {
      label: "Acheter des crédits",
      loadingText: "Traitement en cours...",
    },
    success: {
      title: "Paiement créé",
      description: "Session de paiement Stripe créée",
    },
    errors: {
      planRequired: {
        title: "Formule requise",
        description:
          "Les packs de crédits rechargent une formule active. Choisissez d'abord une formule, puis ajoutez des packs quand vous voulez.",
      },
      validation: {
        title: "Erreur de validation",
        description: "Quantité d'achat invalide",
      },
      network: {
        title: "Erreur réseau",
        description: "La connexion réseau a échoué",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Vous devez être connecté pour acheter des crédits",
      },
      forbidden: {
        title: "Interdit",
        description: "Vous n'avez pas l'autorisation d'acheter des crédits",
      },
      notFound: {
        title: "Introuvable",
        description: "Ressource introuvable",
      },
      server: {
        title: "Erreur serveur",
        description: "Impossible de créer la session de paiement",
        detail: "Le paiement n'a pas pu démarrer : {{error}}",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inattendue est survenue",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Vous avez des modifications non enregistrées",
      },
      conflict: {
        title: "Conflit",
        description: "Un conflit de ressources est survenu",
      },
    },
  },
  errors: {
    userNotFound: {
      title: "Utilisateur introuvable",
      description: "Le compte utilisateur est introuvable",
    },
    checkoutFailed: {
      title: "Échec du paiement",
      description:
        "Impossible de créer la session de paiement pour l'achat de crédits",
    },
  },
};
