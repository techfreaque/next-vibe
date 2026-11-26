import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Facturation",
  tags: {
    payment: "paiement",
    invoice: "facture",
    ar: "créances",
  },
  post: {
    title: "Dupliquer la facture",
    titleShort: "Dupliquer la facture",
    description:
      "Copie une facture existante dans un nouveau BROUILLON. Reprend toutes les lignes, le client, l'entreprise et la devise. Reçoit un nouveau numéro de facture et la date du jour.",
    form: {
      title: "Dupliquer la facture",
      description: "Crée un nouveau brouillon à partir de cette facture",
    },
    response: {
      success: "Facture dupliquée",
      message: "Message d'état",
      invoice: {
        title: "Nouvelle facture",
        subtitle: "Brouillon dupliqué",
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
        description: "Un conflit s'est produit",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Des modifications ne sont pas enregistrées",
      },
    },
    success: {
      title: "Succès",
      description: "Facture dupliquée en nouveau brouillon",
    },
  },
  invoiceId: {
    label: "ID de facture",
    description: "ID de la facture à dupliquer",
    placeholder: "Saisir l'ID de facture",
  },
  widget: {
    duplicate: "Dupliquer",
    cancel: "Annuler",
    loading: "Chargement de la facture",
    total: "Total",
    duplicateNote:
      "Un nouveau brouillon est créé avec le même client, la même devise et les mêmes lignes. Il reçoit son numéro à l'émission.",
    back: "Retour",
    submit: "Dupliquer la facture",
    duplicated: "Facture dupliquée",
    invoiceNumber: "Facture n°",
    viewDuplicate: "Voir la copie",
  },
};
