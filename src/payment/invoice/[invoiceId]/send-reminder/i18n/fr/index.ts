import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Facturation",
  tags: {
    payment: "paiement",
    invoice: "facture",
    ar: "créances",
  },
  post: {
    title: "Envoyer une relance de paiement",
    titleShort: "Envoyer une relance",
    description:
      "Envoie une relance de paiement pour une facture en retard. La facture doit être au statut OUVERTE et son échéance dépassée. La relance est consignée dans une note client.",
    form: {
      title: "Envoyer une relance",
      description: "Prévenez le client que son paiement est en retard",
    },
    response: {
      success: "Relance envoyée",
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
          "Une relance n'est possible que pour une facture ouverte dont l'échéance est dépassée",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Des modifications ne sont pas enregistrées",
      },
    },
    success: {
      title: "Succès",
      description: "Relance de paiement envoyée et consignée",
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
    back: "Retour",
    submit: "Envoyer la relance",
    reminderSent: "Relance envoyée. Le client a été prévenu.",
    viewInvoice: "Voir la facture",
  },
};
