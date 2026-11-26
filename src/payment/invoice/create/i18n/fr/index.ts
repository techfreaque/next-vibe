import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Facturation",
  tags: {
    payment: "paiement",
    invoice: "facture",
    ar: "créances-clients",
  },
  post: {
    title: "Nouvelle facture",
    titleShort: "Nouvelle facture",
    description: "Préparez une facture pour votre client.",
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
      draftSaved: "Brouillon de facture enregistré",
      draftSavedNumber: "Brouillon de facture nº {{number}} enregistré",
      details: "Détails de la facture",
      draftHint:
        "Enregistrez un brouillon pour le vérifier avant de l’émettre.",
      items: "Lignes",
      itemsDescription:
        "Lignes de brouillon facultatives. Utilisez un taux de TVA décimal entre 0 et 1.",
      itemsHint:
        "Ajoutez des biens ou des services pour calculer le total de la facture.",
      item: "Description",
      quantity: "Quantité",
      unitPrice: "Prix unitaire",
      manualTaxRate: "Autre taux",
      taxRate: "TVA %",
      addItem: "Ajouter une ligne",
      removeItem: "Supprimer la ligne",
      itemError:
        "Saisissez une description, une quantité positive, un prix et un taux de TVA entre 0 et 100 %.",
      itemsTotalError: "Le total est trop élevé pour une seule facture.",
      summary: "Récapitulatif",
      net: "Hors taxe",
      tax: "TVA",
      total: "Total",
      customerSelected: "Client sélectionné",
      clearCustomer: "Retirer le client",
      lineTotal: "Total de la ligne",
      companyCurrencyValue: "Devise de l’entreprise : {{currency}}",
      companyCurrency: "La devise de l’entreprise s’applique par défaut.",
      back: "Retour",
      submit: "Enregistrer le brouillon",
      saving: "Enregistrement du brouillon…",
      retrySave: "Réessayer d’enregistrer le brouillon",
      saveFailed: "Impossible d’enregistrer le brouillon de facture",
      saveFailedHint:
        "Vos saisies sont toujours dans le formulaire. Vérifiez-les, puis enregistrez de nouveau le brouillon.",
      viewButton: "Voir la facture",
    },
  },
  companyId: {
    label: "Entreprise",
    description: "L'entreprise qui émet cette facture",
    placeholder: "Saisir l'ID de l'entreprise",
  },
  customerId: {
    label: "Client",
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
    code: "{{code}}",
    label: "Devise",
    description: "Devise de la facture",
    placeholder: "Devise de l’entreprise",
  },
  notes: {
    label: "Notes",
    description: "Notes facultatives affichées sur la facture",
    placeholder: "ex. Conditions de paiement : 30 jours",
  },
  supplyDate: {
    label: "Date de livraison",
    description:
      "Jour de la livraison des biens ou de la prestation. Par défaut, la date d’émission.",
  },
  vatTreatment: {
    label: "Traitement TVA",
    description:
      "TVA nationale, autoliquidation ou exonération. L’autoliquidation et les opérations UE exigent le numéro de TVA du client.",
    options: {
      DOMESTIC: "Vente nationale avec TVA",
      REVERSE_CHARGE_DOMESTIC: "Autoliquidation nationale",
      EU_SERVICES_REVERSE_CHARGE:
        "Services à une entreprise de l’UE (autoliquidation)",
      EU_GOODS_EXEMPT: "Biens à une entreprise de l’UE (exonéré)",
      EXPORT_EXEMPT: "Export hors UE (exonéré)",
      EXEMPT: "Opération exonérée de TVA",
    },
  },
};
