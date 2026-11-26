import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    pos: "Caisse",
    order: "Vente",
    removePayment: "Retirer un paiement",
  },
  enums: {
    paymentMethod: {
      cash: "Espèces",
      card: "Carte",
      transfer: "Virement",
      other: "Autre",
    },
  },
  post: {
    title: "Retirer un paiement",
    titleShort: "Retirer le paiement",
    description:
      "Annulez un paiement sur une vente ouverte, par exemple après une erreur de saisie.",
    orderId: {
      label: "Vente",
      description: "La vente ouverte qui porte ce paiement",
    },
    paymentId: {
      label: "Paiement",
      description: "Le paiement à retirer de la vente",
    },
    response: {
      orderId: "Vente",
      paymentId: "Paiement retiré",
      sessionId: "Session de caisse",
      currency: "Devise",
      totalPaid: "Déjà payé",
      outstanding: "Reste à payer",
      remainingPayments: "Paiements restants",
    },
    widget: {
      back: "Retour à la vente",
      pickPayment: "Choisissez le paiement à retirer",
      noPayments: "Cette vente n'a aucun paiement à retirer.",
      notOpen: "Seuls les paiements d'une vente ouverte peuvent être retirés.",
      loading: "Chargement de la vente",
      change: "Rendu {{amount}}",
      selected: "Sélectionné",
      amount: "Montant",
      confirmTitle: "Retirer ce paiement ?",
      confirmDescription:
        "La vente reste ouverte. Encaissez ensuite le bon paiement.",
      confirm: "Retirer le paiement",
      cancel: "Annuler",
      stillDue: "Reste à payer",
      paidSoFar: "Déjà payé",
      nothingPaid: "Plus aucun paiement sur cette vente.",
    },
    success: {
      title: "Paiement retiré",
      description: "La vente attend un nouveau paiement.",
    },
  },
  errors: {
    validation: {
      title: "Vérifiez le paiement",
      description: "Choisissez un paiement de cette vente.",
    },
    unauthorized: {
      title: "Connexion requise",
      description: "Connectez-vous pour modifier les ventes.",
    },
    forbidden: {
      title: "Accès refusé",
      description: "Vous ne pouvez pas modifier les ventes de cette société.",
    },
    notFound: {
      title: "Paiement introuvable",
      description: "Ce paiement n'est plus sur la vente.",
    },
    conflict: {
      title: "Vente non ouverte",
      description:
        "Un paiement ne peut être retiré que si la vente et la session de caisse sont ouvertes.",
    },
    server: {
      title: "Paiement non retiré",
      description: "Une erreur est survenue. Réessayez.",
    },
    unknown: {
      title: "Paiement non retiré",
      description: "Une erreur est survenue. Réessayez.",
    },
    network: {
      title: "Pas de connexion",
      description: "Vérifiez votre connexion et réessayez.",
    },
    unsavedChanges: {
      title: "Modifications non enregistrées",
      description: "Terminez ou annulez d'abord vos modifications.",
    },
  },
};
