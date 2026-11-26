import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Facturation",
  tags: {
    payment: "paiement",
    invoice: "facture",
    ar: "créances",
  },
  post: {
    title: "Annuler la facture",
    titleShort: "Annuler la facture",
    description:
      "Annule une facture en brouillon ou ouverte. Une facture payée ne peut pas être annulée. Si une écriture comptable existe, elle est contrepassée.",
    form: {
      title: "Annuler la facture",
      description: "Cette action est irréversible.",
    },
    response: {
      success: "Facture annulée",
      message: "Message d'état",
    },
    errors: {
      appliedPayments:
        "Une facture avec des paiements ou des avoirs imputés ne peut pas être annulée.",
      reversalPosting:
        "Vérifiez l’écriture d’origine et l’ouverture de la période comptable avant d’annuler.",
      unauthorized: {
        title: "Non autorisé",
        description: "Authentification requise",
      },
      validation: {
        title: "Erreur de validation",
        description: "Paramètres invalides",
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
        title: "Annulation impossible",
        description: "Une facture payée ne peut pas être annulée",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Des modifications ne sont pas enregistrées",
      },
    },
    success: {
      title: "Succès",
      description: "Facture annulée",
    },
  },
  invoiceId: {
    label: "ID de facture",
    description: "ID de la facture à annuler",
    placeholder: "Saisir l'ID de facture",
  },
  widget: {
    invoice: "Facture",
    total: "Total de la facture",
    customer: "Client",
    openInvoice: "Ouvrir la facture",
    retry: "Réessayer",
    loading: "Chargement de la facture…",
    unavailable: "Facture indisponible",
    reversal:
      "Une contrepassation datée d’aujourd’hui solde la créance ouverte.",
    cancelOnly: "La facture sera annulée.",
    ineligible:
      "Vous pouvez annuler un brouillon ou une facture impayée sans paiement ni avoir affecté.",
    back: "Retour",
    submit: "Annuler la facture",
    warning:
      "Cette action est irréversible. La facture sera définitivement annulée.",
    confirm: "Annuler la facture",
    voided: "Facture annulée",
    backToList: "Retour aux factures",
  },
};
