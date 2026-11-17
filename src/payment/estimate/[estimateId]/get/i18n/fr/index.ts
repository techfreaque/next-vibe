import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Devis",
  tags: { payment: "paiement", estimate: "devis" },
  post: {
    title: "Consulter un devis",
    titleShort: "Consulter un devis",
    description: "Consulter un devis avec toutes ses lignes",
    form: {
      title: "Consulter un devis",
      description: "Consulter un devis avec toutes ses lignes",
    },
    response: { success: "Succès", message: "Message de statut" },
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
        description: "Erreur interne du serveur",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inconnue s'est produite",
      },
      network: {
        title: "Erreur réseau",
        description: "Une erreur réseau s'est produite",
      },
      forbidden: { title: "Accès interdit", description: "Accès refusé" },
      notFound: { title: "Introuvable", description: "Devis introuvable" },
      conflict: {
        title: "Conflit",
        description: "Action impossible avec le statut actuel",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Des modifications ne sont pas enregistrées",
      },
    },
    success: {
      title: "Succès",
      description: "Devis récupéré avec toutes ses lignes",
    },
  },
  estimateId: { label: "ID du devis", description: "Le devis concerné" },
  widget: {
    back: "Retour",
    submit: "Rechercher le devis",
    estimateNumber: "Devis",
    valid: "Valable jusqu'au",
    customer: "Client",
    lineItems: "Lignes",
    description: "Désignation",
    qty: "Qté",
    unitPrice: "Prix unitaire",
    tax: "TVA",
    total: "Total",
    subtotal: "Sous-total",
    sendEstimate: "Envoyer",
    acceptEstimate: "Accepter",
    declineEstimate: "Refuser",
    convertToInvoice: "Convertir en facture",
    duplicate: "Dupliquer",
    status: {
      draft: "Brouillon",
      sent: "Envoyé",
      accepted: "Accepté",
      declined: "Refusé",
      expired: "Expiré",
      converted: "Converti",
    },
  },
};
