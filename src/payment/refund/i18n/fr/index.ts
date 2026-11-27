import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Effectuer un remboursement",
  titleShort: "Remboursement",
  description: "Rembourse une transaction de paiement",
  category: "Remboursements",

  tags: {
    refund: "remboursement",
    transaction: "transaction",
  },

  success: {
    created: "Remboursement effectué",
  },

  reason: {
    requestedByCustomer: "Demandé par le client",
  },

  form: {
    title: "Formulaire de remboursement",
    description: "Saisissez les détails du remboursement",
    fields: {
      transactionId: {
        label: "ID de transaction",
        description: "ID de la transaction à rembourser",
        placeholder: "Saisir l'ID de transaction",
      },
      amount: {
        label: "Montant du remboursement",
        description:
          "Remboursement partiel facultatif dans la devise de la transaction",
        placeholder: "Saisir le montant",
      },
      reason: {
        label: "Motif du remboursement",
        description: "Motif du remboursement",
        placeholder: "Saisir le motif",
      },
      metadata: {
        label: "Métadonnées",
        description: "Métadonnées supplémentaires du remboursement",
        placeholder: "Saisir les métadonnées en JSON",
      },
    },
  },

  widget: {
    transactionDetails: "Transaction enregistrée",
    customerEmail: "E-mail du client",
    customerId: "Identifiant client",
    originalAmount: "Montant initial",
    chooseTransaction: "Rechercher un paiement",
    enterTransaction:
      "Ouvrez un paiement dans les transactions pour vérifier le débit et le montant du remboursement.",
    transactionDate: "Débité le",
    lookupLoading: "Chargement de la transaction enregistrée",
    transactionMissing: "Transaction introuvable",
    lookupFailed: "Impossible de charger la transaction",
    retryLookup: "Relancer la recherche",
    amountExceedsCharge:
      "Saisissez un montant inférieur ou égal au paiement initial.",
    confirmRemaining: "Stripe remboursera le solde restant en {{currency}}.",
    confirmAmount: "Remboursement partiel de {{amount}} ({{currency}}).",
    title: "Examiner le remboursement Stripe",
    amountHelp:
      "Saisissez un montant partiel en {{currency}}. Laissez le champ vide pour rembourser le solde restant.",
    review: "Vérifier le montant",
    confirmTitle: "Confirmer le remboursement Stripe",
    confirmDescription:
      "Stripe remboursera le paiement de {{email}}. Cette action restitue des fonds.",
    confirm: "Émettre le remboursement",
    cancel: "Annuler",
  },

  post: {
    title: "Effectuer un remboursement",
    description: "Rembourse un paiement",
    response: {
      success: "Remboursement effectué",
      message: "Message d'état",
      refund: {
        title: "Détails du remboursement",
        description: "Informations sur le remboursement effectué",
        id: "ID du remboursement",
        userId: "ID utilisateur",
        transactionId: "ID de transaction",
        stripeRefundId: "ID de remboursement Stripe",
        amount: "Montant du remboursement",
        currency: "Devise",
        status: "Statut du remboursement",
        reason: "Motif du remboursement",
        createdAt: "Créé le",
        updatedAt: "Mis à jour le",
      },
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Paramètres de remboursement invalides",
        ineligible: "Cette transaction ne peut pas être remboursée via Stripe.",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Authentification requise",
      },
      forbidden: {
        title: "Interdit",
        description: "Permission refusée",
      },
      notFound: {
        detail: "Aucune transaction trouvée avec l'ID {{transactionId}}",
        title: "Introuvable",
        description: "Transaction introuvable",
      },
      server: {
        detail: "Impossible d'effectuer le remboursement : {{error}}",
        noPaymentIntent:
          "Cette transaction n'est liée à aucun paiement Stripe : elle ne peut pas être remboursée",
        title: "Erreur serveur",
        description: "Une erreur interne du serveur s'est produite",
      },
      network: {
        title: "Erreur réseau",
        description: "Erreur de connexion réseau",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inattendue s'est produite",
      },
      conflict: {
        title: "Conflit",
        description: "Conflit de remboursement détecté",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Des modifications ne sont pas enregistrées",
      },
    },
    success: {
      title: "Succès",
      description: "Remboursement effectué",
    },
  },
};
