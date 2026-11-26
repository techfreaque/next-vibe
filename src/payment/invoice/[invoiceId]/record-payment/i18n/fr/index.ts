import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Facturation",
  tags: {
    payment: "paiement",
    invoice: "facture",
  },
  post: {
    title: "Enregistrer un paiement manuel",
    titleShort: "Enregistrer un paiement",
    description:
      "Enregistre un paiement manuel sur une facture. La marque comme payée si elle est entièrement réglée.",
    form: {
      title: "Enregistrer un paiement",
      description:
        "Saisissez les détails du paiement à imputer sur cette facture",
    },
    response: {
      success: "Paiement enregistré",
      message: "Message d'état",
    },
    errors: {
      receiptKeyConflict: "Cette clé est déjà associée à un autre paiement.",
      paymentPrecision:
        "Saisissez un montant positif avec deux décimales au maximum.",
      paymentStatus:
        "Enregistrez les paiements sur des factures ouvertes dont le montant est positif.",
      overpayment: "Le paiement dépasse le solde de la facture.",
      fullPayment:
        "Pour une facture sans entreprise, saisissez la totalité du solde.",
      issuancePosting:
        "Avant d’enregistrer le paiement, comptabilisez une créance égale au total de la facture.",
      paymentAccount:
        "Sélectionnez un compte bancaire ou de caisse actif de cette entreprise.",
      paymentPosting:
        "Vérifiez la date de règlement, la devise de l’entreprise et les comptes d’imputation.",
      unauthorized: {
        title: "Non autorisé",
        description: "Authentification requise",
      },
      validation: {
        title: "Erreur de validation",
        description: "Paramètres de paiement invalides",
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
        description: "Facture introuvable",
      },
      conflict: {
        title: "Conflit",
        description: "La facture est déjà payée ou annulée",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Des modifications ne sont pas enregistrées",
      },
    },
    success: {
      title: "Succès",
      description: "Paiement manuel enregistré",
    },
  },
  enums: {
    manualPaymentMethod: {
      cash: "Espèces",
      bankTransfer: "Virement bancaire",
      other: "Autre",
    },
  },
  invoiceId: {
    label: "ID de facture",
    description: "ID de la facture sur laquelle imputer le paiement",
    placeholder: "Saisir l'ID de facture",
  },
  amount: {
    label: "Montant payé",
    description: "Montant reçu",
    placeholder: "0.00",
  },
  method: {
    label: "Moyen de paiement",
    description: "Comment le paiement a été reçu",
    placeholder: "Choisir un moyen",
  },
  paidAt: {
    label: "Date de paiement",
    description: "Date de réception du paiement",
    placeholder: "Choisir une date",
  },
  receiptKey: {
    label: "Clé de paiement",
    description:
      "Réutilisez la même clé si vous réessayez ce paiement. Utilisez une nouvelle clé pour un autre encaissement.",
  },
  accountNodeId: {
    label: "Compte de règlement",
    description:
      "Choisissez le compte bancaire ou la caisse qui a reçu le règlement.",
    placeholder: "Choisir un compte",
    automatic: "Utiliser le compte par défaut",
  },
  widget: {
    details: "Détails du règlement",
    back: "Retour",
    submit: "Enregistrer le paiement",
    paymentRecorded: "Paiement enregistré.",
    viewInvoice: "Voir la facture",
  },
};
