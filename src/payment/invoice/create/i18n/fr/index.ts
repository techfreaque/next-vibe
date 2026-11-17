import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Facturation",
  tags: {
    payment: "paiement",
    invoice: "facture",
    ar: "créances-clients",
  },
  post: {
    title: "Créer une facture client",
    titleShort: "Créer une facture",
    description: "Crée une nouvelle facture client (créance) pour un client",
    form: {
      title: "Nouvelle facture",
      description: "Renseignez les détails de la facture",
    },
    response: {
      success: "Facture créée",
      message: "Message d'état",
      invoice: {
        title: "Facture",
        subtitle: "Facture créée",
        id: "ID de facture",
        companyId: "ID de l'entreprise",
        customerId: "ID client",
        invoiceSequenceNumber: "Numéro de facture",
        currency: "Devise",
        status: "Statut",
        dueDate: "Échéance",
        notes: "Notes",
        amount: "Montant",
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
        description: "Paramètres de facture invalides",
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
        description:
          "Vous devez être administrateur ou comptable de cette entreprise",
      },
      notFound: {
        title: "Introuvable",
        description: "Entreprise introuvable",
      },
      conflict: {
        title: "Conflit",
        description: "Un conflit s'est produit",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Des modifications ne sont pas enregistrées",
      },
    },
    success: {
      title: "Facture créée",
      description: "Facture créée à l'état de brouillon",
    },
    widget: {
      back: "Retour",
      submit: "Créer la facture",
      viewButton: "Voir la facture",
    },
  },
  companyId: {
    label: "ID de l'entreprise",
    description: "L'entreprise qui émet cette facture",
    placeholder: "Saisir l'ID de l'entreprise",
  },
  customerId: {
    label: "ID client",
    description:
      "Facultatif : UUID du client (référence souple à l'utilisateur)",
    placeholder: "Saisir l'ID client",
  },
  dueDate: {
    label: "Échéance",
    description: "Date d'échéance de cette facture",
    placeholder: "Choisir l'échéance",
  },
  currency: {
    label: "Devise",
    description: "Devise de la facture",
    placeholder: "EUR",
  },
  notes: {
    label: "Notes",
    description: "Notes facultatives affichées sur la facture",
    placeholder: "ex. Conditions de paiement : 30 jours",
  },
};
