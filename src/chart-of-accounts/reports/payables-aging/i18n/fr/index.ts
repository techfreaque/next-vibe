import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Dettes fournisseurs",
  titleShort: "Balance fournisseurs",
  description: "Vos dettes fournisseurs par nombre de jours de retard.",
  tag: "Balance fournisseurs",
  company: {
    label: "Entreprise",
    description:
      "Choisissez l’entreprise dont vous souhaitez consulter les factures fournisseurs.",
    choose: "Choisir une entreprise",
    empty:
      "Sélectionnez une entreprise pour consulter ses dettes fournisseurs.",
  },
  currency: {
    label: "Devise",
    description:
      "Affiche les factures dans une seule devise. Aucun montant n’est converti.",
    default: "Devise de l’entreprise",
    codes: {
      EUR: "EUR",
      USD: "USD",
      PLN: "PLN",
    },
  },
  agingDate: {
    label: "Date de calcul",
    description: "Date utilisée pour calculer le nombre de jours de retard.",
  },
  columns: {
    supplier: "Fournisseur",
    vat: "Numéro de TVA",
    current: "Non échues",
    days1to30: "1–30 jours",
    days31to60: "31–60 jours",
    days61to90: "61–90 jours",
    over90: "91 jours et plus",
    undated: "Sans échéance",
    total: "Total",
    billNumber: "Numéro de facture",
    billDate: "Date de facture",
    dueDate: "Échéance",
    billAmount: "Montant en centimes",
  },
  approved: {
    title: "Validées et impayées",
    empty: "Aucune facture validée à payer",
    emptyDescription:
      "Les factures validées avec un solde dû apparaîtront ici.",
  },
  received: {
    title: "En attente de validation",
    empty: "Aucune facture en attente de validation",
    emptyDescription:
      "Les factures reçues apparaissent ici jusqu’à leur validation.",
  },
  disputed: {
    title: "Contestées",
    empty: "Aucune facture contestée",
    emptyDescription:
      "Les factures contestées restent en dehors des totaux validés et en attente.",
  },
  widget: {
    showBills: "Voir les factures",
    asOf: "Situation au {{date}}",
    back: "Retour",
    loading: "Chargement des dettes fournisseurs",
    details: "Factures de {{supplier}}",
    unknownSupplier: "Fournisseur inconnu",
    datedBill: "Facture du {{date}}",
    due: "Échéance le {{date}}",
  },
  success: {
    title: "Dettes fournisseurs chargées",
    description:
      "Vous pouvez consulter les factures fournisseurs de l’entreprise sélectionnée.",
  },
  errors: {
    validation: {
      title: "Vérifiez les filtres du rapport",
      description: "Choisissez une date et une devise valides.",
    },
    unauthorized: {
      title: "Connexion requise",
      description: "Connectez-vous pour consulter les dettes fournisseurs.",
    },
    forbidden: {
      title: "Entreprise indisponible",
      description:
        "Vous ne pouvez pas consulter les factures fournisseurs de cette entreprise.",
    },
    notFound: {
      title: "Introuvable",
      description: "L’élément demandé est introuvable.",
    },
    server: {
      title: "Chargement des dettes impossible",
      description: "Essayez de recharger le rapport.",
    },
    network: {
      title: "Connexion indisponible",
      description: "Vérifiez votre connexion puis réessayez.",
    },
    conflict: {
      title: "Conflit dans le rapport",
      description: "Actualisez la page puis relancez le rapport.",
    },
    unknown: {
      title: "Erreur inattendue",
      description: "Réessayez ou contactez l’assistance.",
    },
    unsavedChanges: {
      title: "Modifications non enregistrées",
      description: "Enregistrez ou annulez vos modifications avant de quitter.",
    },
  },
};
