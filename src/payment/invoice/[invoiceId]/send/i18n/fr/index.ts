import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Facturation",
  tags: {
    payment: "paiement",
    invoice: "facture",
  },
  post: {
    title: "Envoyer la facture",
    titleShort: "Envoyer la facture",
    description:
      "Marque un brouillon de facture comme envoyé : son statut passe à Ouverte",
    form: {
      title: "Envoyer la facture",
      description: "Envoie la facture au client",
    },
    response: {
      success: "Facture envoyée",
      message: "Message d'état",
      viewUrl: "URL de consultation client",
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
        title: "Conflit",
        description: "La facture n'est pas à l'état de brouillon",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Des modifications ne sont pas enregistrées",
      },
    },
    success: {
      title: "Succès",
      description: "Facture marquée comme envoyée",
    },
  },
  invoiceId: {
    label: "ID de facture",
    description: "ID de la facture à envoyer",
    placeholder: "Saisir l'ID de facture",
  },
  widget: {
    back: "Retour",
    submit: "Envoyer la facture",
    sent: "Facture envoyée",
    viewUrl: "Lien de consultation client",
  },
};
