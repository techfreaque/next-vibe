import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    payment: "paiement",
    bill: "facture-fournisseur",
    ap: "comptabilité-fournisseurs",
  },
  post: {
    title: "Nouvelle facture fournisseur",
    titleShort: "Nouvelle facture fournisseur",
    description:
      "Saisissez le fournisseur et les lignes, puis enregistrez le brouillon.",
    form: {
      title: "Nouvelle facture fournisseur",
      description: "Saisissez les informations de la facture reçue",
    },
    errors: {
      vendor: "Sélectionnez un fournisseur actif de cette entreprise.",
      supplier: "Saisissez un nom ou choisissez un fournisseur.",
      dates: "Saisissez une date de facture et une échéance valides.",
      amounts: "Vérifiez les lignes et respectez le plafond de la facture.",
      expenseAccount:
        "Choisissez un compte de charges actif de cette entreprise.",

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
      supplier: "Fournisseur",
      dates: "Dates et devise",
      items: "Lignes de facture",
      itemsDescription:
        "Lignes facultatives. Saisissez un taux de TVA décimal de 0 à 1.",
      itemsHint: "Ajoutez les biens ou services facturés.",
      item: "Description",
      quantity: "Quantité",
      unitPrice: "Prix unitaire",
      manualTaxRate: "Autre taux",
      taxRate: "TVA %",
      lineTotal: "Total de la ligne",
      addItem: "Ajouter une ligne",
      removeItem: "Supprimer la ligne",
      itemError: "Vérifiez la description, la quantité, le prix et la TVA.",
      summary: "Récapitulatif de la facture",
      net: "Hors taxe",
      tax: "TVA",
      total: "Total",
      chooseVendor: "Choisir un fournisseur",
      vendorSource: "Depuis l’annuaire fournisseurs",
      terms: "Appliquer le délai du fournisseur",
      manualVendor: "Saisir le fournisseur manuellement",
      selectCompanyFirst: "Sélectionnez d’abord une entreprise.",

      back: "Retour",
      submit: "Enregistrer le brouillon",
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
  vendorId: {
    label: "Choisir un fournisseur",
    description: "Depuis l’annuaire fournisseurs",
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
    placeholder: "Choisir la date de facture",
  },
  dueDate: {
    label: "Date d'échéance",
    description: "Date limite de paiement",
    placeholder: "Choisir la date d’échéance",
  },
  currency: {
    code: "{{code}}",
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
