import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Contrôle des écritures",
  description:
    "Vérifiez les écritures actives et le lien comptable des factures clients émises et des factures fournisseurs validées ou payées.",
  tag: "Contrôler la comptabilité",
  company: {
    label: "Entreprise",
    description:
      "Choisissez l’entreprise dont vous souhaitez contrôler les écritures.",
    choose: "Choisir une entreprise",
    empty:
      "Sélectionnez une entreprise pour vérifier son journal et les liens avec les factures.",
  },
  filters: {
    issue: "Anomalie",
    all: "Toutes les anomalies",
    matches: "Anomalies correspondantes",
  },
  issues: {
    missingLines: "Lignes d’écriture manquantes",
    invalidLegs: "Lignes d’écriture incorrectes",
    invoiceLink: "Liens des factures clients",
    billLink: "Liens des factures fournisseurs",
  },
  reasons: {
    fewLines:
      "L’écriture contient moins de deux lignes. Ouvrez-la et vérifiez la pièce d’origine.",
    invalidLegs:
      "Au moins une devise présente un déséquilibre ou une ligne utilise un montant, un compte ou un sens incorrect. Ouvrez l’écriture pour contrôler ses lignes.",
    noBacklink:
      "Aucune écriture de journal n’est liée à cette facture. Contrôlez la pièce avant de comptabiliser ou de saisir un paiement.",
    wrongPosting:
      "L’écriture liée manque, appartient à une autre pièce ou n’est plus active. Examinez l’historique comptable de la facture.",
    controlLeg:
      "L’écriture liée présente un solde, une devise ou un montant de tiers incorrect. Examinez la pièce avant de saisir un paiement.",
  },
  columns: {
    record: "Élément",
    date: "Date",
    reason: "Anomalie constatée",
    counterparty: "Tiers",
    open: "Ouvrir l’élément",
  },
  records: {
    journal: "Écriture comptable",
    invoice: "Facture client",
    bill: "Facture fournisseur",
    journalDate: "Date d’écriture",
    invoiceDate: "Facture créée le",
    billDate: "Date de facture",
    dateInfo: "{{label}} {{date}}",
    openJournal: "Ouvrir l’écriture",
    openInvoice: "Ouvrir la facture client",
    openBill: "Ouvrir la facture fournisseur",
  },
  pagination: {
    pageLabel: "Page",
    pageSize: "Éléments par page",
    totalPages: "Nombre de pages",
    previous: "Précédent",
    next: "Suivant",
    pageInfo: "Page {{page}} sur {{total}}",
    firstPage: "Première page",
    emptyPage: "Cette page ne contient aucun élément",
  },
  widget: {
    loading: "Chargement du contrôle",
    empty: "Aucune anomalie correspondante",
    coverage:
      "Le contrôle couvre les écritures d’origine actives et les factures de montant positif émises, validées ou payées selon leur type.",
    back: "Retour",
  },
  success: {
    title: "Contrôle terminé",
    description: "Les écritures et les liens comptables ont été vérifiés.",
  },
  errors: {
    validation: {
      title: "Vérifiez les filtres du rapport",
      description:
        "Choisissez un filtre, un numéro de page et une taille de page valides.",
    },
    unauthorized: {
      title: "Connexion requise",
      description: "Connectez-vous pour contrôler les écritures comptables.",
    },
    forbidden: {
      title: "Entreprise indisponible",
      description:
        "Vous ne pouvez pas consulter les écritures de cette entreprise.",
    },
    notFound: {
      title: "Introuvable",
      description: "L’élément demandé est introuvable.",
    },
    server: {
      title: "Chargement du contrôle impossible",
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
