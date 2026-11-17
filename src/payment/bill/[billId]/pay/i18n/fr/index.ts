import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    payment: "paiement",
    bill: "facture-fournisseur",
    ap: "comptabilité-fournisseurs",
  },
  post: {
    title: "Payer la facture",
    titleShort: "Payer la facture",
    description:
      "Marquer une facture approuvée comme payée et passer l'écriture de règlement",
    billId: {
      label: "ID de la facture",
      description: "La facture à marquer comme payée",
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Saisie invalide",
      },
      unauthorized: {
        title: "Non connecté",
        description: "Connectez-vous pour payer des factures",
      },
      forbidden: {
        title: "Accès refusé",
        description: "Rôle Comptable ou Admin requis",
      },
      conflict: {
        title: "Statut invalide",
        description: "La facture doit être APPROVED avant le paiement",
      },
      server: {
        title: "Erreur serveur",
        description: "Impossible d'enregistrer le paiement",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inattendue s'est produite",
      },
      network: {
        title: "Erreur réseau",
        description: "Vérifiez votre connexion",
      },
      notFound: {
        title: "Facture introuvable",
        description: "Cette facture n'existe pas",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Vous avez des modifications non enregistrées",
      },
    },
    success: {
      title: "Facture payée",
      description: "Facture marquée comme payée",
    },
    response: {
      status: "Statut",
      paidAt: "Payée le",
    },
    widget: {
      back: "Retour",
      submit: "Marquer comme payée",
      paymentRecorded: "Paiement enregistré",
    },
  },
  enums: {
    billStatus: {
      DRAFT: "Brouillon",
      RECEIVED: "Reçue",
      APPROVED: "Approuvée",
      PAID: "Payée",
      DISPUTED: "Contestée",
    },
  },
  accountNodeId: {
    label: "Compte banque / caisse",
    description: "Compte utilisé pour le paiement (banque ou caisse)",
    placeholder: "UUID du compte",
  },
  paidAt: {
    label: "Date de paiement",
    description: "Date à laquelle le paiement a été effectué",
    placeholder: "2024-01-31",
  },
};
