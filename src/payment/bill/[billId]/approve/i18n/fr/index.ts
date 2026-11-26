import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  receiveBill: "Marquer la facture comme reçue",
  supplierDocument: {
    confirmMissing: "Confirmer l’absence de justificatif fournisseur",
    confirmSeparate: "Confirmer qu’il s’agit d’une dépense distincte",
    missingHelp:
      "Vérifiez le justificatif bancaire. L’approbation comptabilise le montant TTC sans déduction de TVA.",
    required:
      "Associez le justificatif fournisseur ou confirmez qu’il est indisponible. L’approbation sur preuve bancaire exige le montant TTC vérifié, sans écriture de TVA.",
    possibleDuplicate:
      "Un brouillon bancaire ou un justificatif fournisseur présente des données similaires. Associez le justificatif ou confirmez que la dépense est distincte.",
  },
  reverseCharge: {
    title: "Autoliquidation (facultatif)",
    base: "Base imposable dans la devise de la facture",
    rate: "Taux de TVA (%)",
    help: "Pour une facture reçue par une petite entreprise allemande, renseignez ces deux valeurs après confirmation de l’autoliquidation. La TVA sera comptabilisée en charge et en dette fiscale.",
    invalid:
      "Indiquez la base et le taux confirmés pour une facture reçue sous le régime allemand des petites entreprises.",
    cost: "TVA autoliquidée non déductible",
  },
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
      existingPosting:
        "Rapprochez l’écriture existante de cette facture avant de la valider.",
      lineTotalsReview:
        "Les lignes diffèrent du montant net, de la TVA ou du total enregistré. Vérifiez la facture fournisseur d’origine avant de l’approuver.",
      billLines:
        "Ajoutez des lignes dont le total est positif et utilisez des comptes de charges actifs de cette entreprise.",
      posting:
        "Vérifiez les montants, la devise de l’entreprise, la période comptable et les comptes d’imputation.",
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
        "Un brouillon passe à l’état Reçue. Valider une facture reçue crée une écriture comptable.",
      confirmButton: "Oui, approuver",
      cancelButton: "Annuler",
      approved: "Statut de la facture mis à jour",
    },
  },
};
