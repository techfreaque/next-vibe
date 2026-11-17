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
    title: "Approuver la facture",
    titleShort: "Approuver la facture",
    description:
      "Faire avancer le statut de la facture (DRAFT→RECEIVED→APPROVED) et passer l'écriture comptable",
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
      submit: "Approuver la facture",
      confirmTitle: "Approuver cette facture ?",
      confirmDescription:
        "Le statut de la facture va avancer. Une fois approuvée, une écriture comptable sera passée.",
      confirmButton: "Oui, approuver",
      cancelButton: "Annuler",
      approved: "Facture approuvée",
    },
  },
};
