import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    payment: "paiement",
    bill: "facture-fournisseur",
    ap: "comptabilité-fournisseurs",
  },
  post: {
    title: "Créer une facture fournisseur",
    titleShort: "Créer une facture",
    description: "Enregistrer une facture reçue d'un fournisseur",
    form: {
      title: "Nouvelle facture fournisseur",
      description: "Saisissez les informations de la facture reçue",
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Vérifiez tous les champs et réessayez",
      },
      unauthorized: {
        title: "Non connecté",
        description: "Connectez-vous pour créer des factures",
      },
      forbidden: {
        title: "Accès refusé",
        description: "Rôle Comptable ou Admin requis",
      },
      conflict: { title: "Conflit", description: "Conflit de données" },
      server: {
        title: "Erreur serveur",
        description: "Impossible de créer la facture. Réessayez.",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inattendue s'est produite",
      },
      network: {
        title: "Erreur réseau",
        description: "Vérifiez votre connexion et réessayez",
      },
      notFound: { title: "Introuvable", description: "Ressource introuvable" },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Vous avez des modifications non enregistrées",
      },
    },
    success: {
      title: "Facture créée",
      description: "Facture fournisseur enregistrée",
    },
    widget: {
      back: "Retour",
      submit: "Enregistrer la facture",
      viewButton: "Voir la facture",
      addAnotherButton: "En ajouter une autre",
    },
    response: {
      id: "ID de la facture",
      companyId: "ID de l'entreprise",
      supplierName: "Fournisseur",
      billNumber: "N° de facture",
      billDate: "Date de facture",
      dueDate: "Date d'échéance",
      currency: "Devise",
      subtotal: "Sous-total HT",
      taxAmount: "TVA",
      total: "Total TTC",
      status: "Statut",
      createdAt: "Créée le",
      updatedAt: "Modifiée le",
    },
  },
  enums: {
    billStatus: {
      DRAFT: "Brouillon",
      RECEIVED: "Reçue",
      APPROVED: "Approuvée",
      PAID: "Payée",
      DISPUTED: "Contestée",
    },
  },
  companyId: {
    label: "Entreprise",
    description: "L'entreprise destinataire de cette facture",
    placeholder: "UUID de l'entreprise",
  },
  supplierName: {
    label: "Nom du fournisseur",
    description: "Nom du fournisseur qui a émis cette facture",
    placeholder: "Acme SARL",
  },
  supplierVatNumber: {
    label: "N° TVA du fournisseur",
    description: "Numéro de TVA intracommunautaire ou d'identification fiscale",
    placeholder: "FR12345678901",
  },
  billNumber: {
    label: "N° de facture",
    description: "Numéro de référence de la facture du fournisseur",
    placeholder: "INV-2024-001",
  },
  billDate: {
    label: "Date de facture",
    description: "Date d'émission de la facture",
    placeholder: "2024-01-01",
  },
  dueDate: {
    label: "Date d'échéance",
    description: "Date limite de paiement",
    placeholder: "2024-01-31",
  },
  currency: {
    label: "Devise",
    description: "Devise de la facture",
    placeholder: "EUR",
  },
  notes: {
    label: "Notes",
    description: "Notes internes sur cette facture",
    placeholder: "Notes facultatives",
  },
};
