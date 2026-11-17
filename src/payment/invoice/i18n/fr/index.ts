import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Facturation",
  tags: {
    payment: "paiement",
    invoice: "facture",
    transactions: "transactions",
  },
  defaultItem: "Article de facture",
  success: {
    created: "Facture créée",
  },
  post: {
    title: "Facture",
    titleShort: "Facture",
    description: "Endpoint de facture",
    form: {
      title: "Configuration de la facture",
      description: "Configurez les paramètres de la facture",
    },
    response: {
      success: "Facture créée",
      message: "Message d'état",
      invoice: {
        title: "Détails de la facture",
        description: "Informations de la facture générée",
        id: "ID de facture",
        userId: "ID utilisateur",
        stripeInvoiceId: "ID de facture Stripe",
        invoiceNumber: "Numéro de facture",
        amount: "Montant",
        currency: "Devise",
        status: "Statut",
        invoiceUrl: "URL de la facture",
        invoicePdf: "PDF de la facture",
        dueDate: "Échéance",
        paidAt: "Payée le",
        createdAt: "Créée le",
        updatedAt: "Mise à jour le",
      },
    },
    errors: {
      unauthorized: {
        title: "Non autorisé",
        description: "Authentification requise",
      },
      validation: {
        title: "Erreur de validation",
        description: "Paramètres de requête invalides",
      },
      server: {
        detail: "Impossible de créer la facture : {{error}}",
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
        noStripeCustomer: "Aucun client Stripe n'existe pour votre compte",
        title: "Introuvable",
        description: "Ressource introuvable",
      },
      conflict: {
        title: "Conflit",
        description: "Conflit de données",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Des modifications ne sont pas enregistrées",
      },
    },
    success: {
      title: "Succès",
      description: "Opération réussie",
    },
    widget: {
      back: "Retour",
    },
  },
  customerId: {
    label: "ID client",
    description: "Identifiant client Stripe",
    placeholder: "Saisir l'ID client",
  },
  amount: {
    label: "Montant",
    description: "Montant de la facture",
    placeholder: "Saisir le montant",
  },
  currency: {
    label: "Devise",
    description: "Code de devise",
    placeholder: "Choisir une devise",
    usd: "Dollar américain (USD)",
    eur: "Euro (EUR)",
    pln: "Złoty polonais (PLN)",
  },
  description: {
    label: "Description",
    description: "Description de la facture",
    placeholder: "Saisir une description",
  },
  dueDate: {
    label: "Échéance",
    description: "Date d'échéance du paiement",
    placeholder: "Choisir l'échéance",
  },
  metadata: {
    label: "Métadonnées",
    description: "Métadonnées supplémentaires",
    placeholder: "Saisir les métadonnées en JSON",
  },
};
