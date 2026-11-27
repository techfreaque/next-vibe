import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Paiements",
  tags: {
    subscription: "Abonnement",
    billing: "Facturation",
  },

  get: {
    title: "Transférer votre forfait",
    titleShort: "Transférer",
    description:
      "Indique si votre forfait par carte peut passer au nouveau prestataire de paiement, et quand la facturation y commence.",
  },
  post: {
    title: "Lancer le transfert",
    titleShort: "Transférer",
    description:
      "Ouvre le paiement chez le nouveau prestataire pour votre forfait actuel. Votre ancien forfait par carte s'arrête une fois le nouveau payé. Aucun double prélèvement.",
  },

  response: {
    offer: "Offre",
    targetProvider: "Nouveau prestataire",
    plan: "Forfait",
    billingInterval: "Fréquence de facturation",
    pastDue: "Paiement en retard",
    deadline: "Forfait actif jusqu'au",
    billingStartAt: "Nouvelle facturation à partir du",
    firstPeriodEnd: "Fin de la première nouvelle période",
    carryOver: "Report du temps payé",
    checkoutUrl: "Lien de paiement",
    sessionId: "Session de paiement",
  },

  widget: {
    badge: "Action requise",
    title: "Transférez votre forfait en un clic",
    description:
      "Notre prestataire de paiement par carte n'encaisse plus pour nous. Votre forfait et vos crédits sont en sécurité.",
    deadline:
      "Votre forfait est actif jusqu'au {{date}}. Transférez-le avant pour qu'il continue.",
    carryExtend:
      "Vous payez maintenant, et votre première nouvelle période dure jusqu'au {{date}}. Les jours déjà payés sont conservés.",
    carryDeferred:
      "Rien n'est prélevé aujourd'hui. La facturation chez le nouveau prestataire commence le {{date}}, à la fin de votre temps payé.",
    pastDue:
      "Votre dernier renouvellement n'est pas passé. Transférez maintenant pour garder votre forfait.",
    unsupportedPlan:
      "Le nouveau paiement par carte ne propose pas encore ce forfait en mensuel. Choisissez la facturation annuelle ou payez en crypto.",
    cta: "Transférer mon forfait",
    ctaLoading: "Ouverture du paiement...",
    otherOptions: "Autres moyens de paiement",
    noDoubleCharge:
      "Votre ancien forfait par carte s'arrête dès que le nouveau est payé. Vous ne payez jamais deux fois.",
    checkoutReady: "Le paiement est prêt.",
    openCheckout: "Ouvrir le paiement",
    notEligible: "Aucun forfait par carte à transférer.",
  },

  enums: {
    carryOver: {
      extendFirstPeriod:
        "Prélèvement immédiat, le temps payé prolonge la première période",
      deferredStart: "La facturation commence à la fin du temps payé",
    },
    status: {
      pending: "Paiement lancé",
      completed: "Transféré",
      cancelFailed: "Transféré, échec de l'annulation de l'ancien forfait",
    },
    cancelMode: {
      atPeriodEnd: "En fin de période",
      immediate: "Immédiatement",
    },
    offer: {
      available: "Disponible",
      planNotSupported: "Forfait non pris en charge",
      notEligible: "Non éligible",
    },
    notice: {
      sending: "Envoi en cours",
      sent: "Envoyé",
      failed: "Échec",
    },
  },

  errors: {
    validation: {
      title: "Requête invalide",
      description: "Vérifiez la requête et réessayez.",
    },
    unauthorized: {
      title: "Connexion requise",
      description: "Connectez-vous pour transférer votre forfait.",
    },
    forbidden: {
      title: "Non autorisé",
      description: "Ce compte ne peut pas transférer de forfait.",
    },
    notFound: {
      title: "Aucun forfait par carte",
      description: "Ce compte n'a aucun forfait par carte à transférer.",
    },
    conflict: {
      title: "Rien à transférer",
      description:
        "Le transfert n'est pas ouvert pour l'instant, ou ce forfait ne peut pas être transféré. Votre forfait reste actif.",
    },
    unsupportedPlan: {
      title: "Forfait non pris en charge",
      description:
        "Le nouveau prestataire ne peut pas vendre ce forfait avec cette fréquence de facturation.",
    },
    server: {
      title: "Un problème est survenu",
      description:
        "Impossible d'ouvrir le paiement. Réessayez dans une minute.",
    },
    network: {
      title: "Erreur réseau",
      description: "Serveur injoignable. Vérifiez votre connexion.",
    },
    unknown: {
      title: "Erreur inattendue",
      description: "Un problème inattendu est survenu. Réessayez.",
    },
    unsavedChanges: {
      title: "Modifications non enregistrées",
      description: "Enregistrez ou annulez d'abord vos modifications.",
    },
  },

  success: {
    title: "Paiement prêt",
    description: "Finalisez le paiement pour transférer votre forfait.",
  },
};
