import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    payment: "paiement",
    bill: "facture-fournisseur",
    ap: "comptabilité-fournisseurs",
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
  post: {
    title: "Vérifier le statut de la facture",
    titleShort: "Vérifier le statut de la facture",
    description:
      "Met à jour le statut d’une facture fournisseur en brouillon ou reçue.",
    billId: {
      label: "ID de la facture",
      description: "La facture à approuver",
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "ID de facture invalide",
      },
      unauthorized: {
        title: "Non connecté",
        description: "Connectez-vous pour approuver des factures",
      },
      forbidden: {
        title: "Accès refusé",
        description: "Rôle Comptable ou Admin requis",
      },
      conflict: {
        title: "Déjà approuvée",
        description: "Cette facture est déjà approuvée ou payée",
      },
      server: {
        title: "Erreur serveur",
        description: "Impossible d'approuver la facture",
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
      title: "Facture approuvée",
      description: "Statut de la facture mis à jour",
    },
    response: {
      status: "Nouveau statut",
      journalEntryId: "ID de l'écriture comptable",
    },
    widget: {
      back: "Retour",
      submit: "Confirmer le changement de statut",
      confirmTitle: "Approuver cette facture ?",
      confirmDescription:
        "Un brouillon passe au statut Reçue. Une facture reçue passe au statut Approuvée. Une écriture est créée si la comptabilité est configurée.",
      confirmButton: "Oui, approuver",
      cancelButton: "Annuler",
      approved: "Statut de la facture mis à jour",
    },
  },
};
