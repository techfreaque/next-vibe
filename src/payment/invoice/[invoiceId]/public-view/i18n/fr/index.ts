import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Paiements",
  tags: { payment: "paiement", invoice: "facture" },
  get: {
    title: "Voir la facture",
    titleShort: "Voir la facture",
    description: "Consultation publique de la facture via un lien sécurisé",
    form: {
      title: "Facture",
      description: "Consultez le détail de votre facture",
    },
    response: {
      id: "ID de facture",
      invoiceNumber: "Numéro de facture",
      currency: "Devise",
      status: "Statut",
      amount: "Montant",
      dueDate: "Échéance",
      notes: "Notes",
      createdAt: "Date d'émission",
      companyName: "Entreprise",
      companyEmail: "E-mail de l'entreprise",
      lineId: "ID de ligne",
      lineDescription: "Description",
      productId: "Produit",
      quantity: "Quantité",
      unitPrice: "Prix unitaire",
      taxRate: "Taux de TVA",
      taxAmount: "TVA",
      lineTotal: "Total de la ligne",
      sortOrder: "Ordre",
      lineCreatedAt: "Créée le",
      lineUpdatedAt: "Mise à jour le",
    },
    errors: {
      unauthorized: {
        title: "Non autorisé",
        description: "Authentification requise",
      },
      validation: {
        title: "Lien invalide",
        description: "Le lien de la facture est invalide ou mal formé",
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
      forbidden: {
        title: "Accès refusé",
        description: "Lien de facture invalide ou expiré",
      },
      notFound: { title: "Introuvable", description: "Facture introuvable" },
      conflict: {
        title: "Conflit",
        description: "Conflit sur l'état de la facture",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Des modifications ne sont pas enregistrées",
      },
    },
    success: { title: "Facture", description: "Le détail de votre facture" },
  },
  invoiceId: { label: "ID de facture", description: "La facture à consulter" },
  token: {
    label: "Jeton d'accès",
    description: "Jeton d'accès sécurisé reçu dans l'e-mail de votre facture",
  },
  widget: {
    submit: "Voir la facture",
  },
};
