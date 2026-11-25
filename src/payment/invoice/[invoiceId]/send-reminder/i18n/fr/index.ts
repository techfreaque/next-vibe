import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Facturation",
  tags: {
    payment: "paiement",
    invoice: "facture",
    ar: "créances",
  },
  post: {
    title: "Préparer une relance de paiement",
    titleShort: "Préparer une relance",
    description:
      "Préparez une relance avec le solde échu et un message facultatif.",
    form: {
      title: "Préparer une relance",
      description: "Vérifiez le solde avant de transmettre la relance.",
    },
    response: {
      success: "Brouillon de relance prêt",
      message: "Message d'état",
    },
    errors: {
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
        title: "Pas en retard",
        description:
          "La facture doit être ouverte, échue et présenter un solde à régler.",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Des modifications ne sont pas enregistrées",
      },
    },
    success: {
      title: "Brouillon de relance prêt",
      description:
        "La relance est enregistrée dans l’historique de la facture. Vous pouvez la transmettre au client.",
    },
  },
  invoiceId: {
    label: "ID de facture",
    description: "ID de la facture en retard",
    placeholder: "Saisir l'ID de facture",
  },
  message: {
    label: "Message personnalisé",
    description: "Message facultatif à inclure dans la relance",
    placeholder: "Ajoutez un mot personnel à la relance...",
  },
  widget: {
    copy: "Copier la relance",
    copied: "Relance copiée",
    copyFailed: "Échec de la copie. Réessayer",
    download: "Télécharger la relance",
    subject: "Relance pour la facture {{number}}",
    body: "Le solde à régler est de {{amount}}. Le paiement était attendu le {{date}}.",
    back: "Retour",
    submit: "Préparer une relance",
    reminderSent:
      "La relance est enregistrée dans l’historique de la facture. Vous pouvez la transmettre au client.",
    viewInvoice: "Voir la facture",
  },
};
