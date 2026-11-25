import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Facturation",
  tags: {
    payment: "paiement",
    invoice: "facture",
    ar: "comptabilité-clients",
    creditNote: "avoir",
  },
  post: {
    title: "Créer un avoir",
    titleShort: "Avoir",
    description:
      "Émettez un avoir total ou partiel sur une facture comptabilisée. L’avoir corrige la créance, le produit et la TVA correspondants.",
    form: {
      title: "Créer un avoir",
      description: "Émettre un avoir sur une facture existante",
    },
    response: {
      success: "Avoir créé",
      message: "Message de statut",
      creditNote: {
        title: "Avoir",
        subtitle: "Détails de l'avoir créé",
        id: "ID de l'avoir",
        invoiceId: "ID de la facture d'origine",
        companyId: "ID de l'entreprise",
        currency: "Devise",
        status: "Statut",
        amount: "Montant",
        reason: "Motif",
        createdAt: "Créé le",
        updatedAt: "Modifié le",
      },
    },
    errors: {
      creditLines:
        "Saisissez des quantités positives et utilisez les taux de TVA de la facture d’origine.",
      creditLimit:
        "L’avoir dépasse le montant hors taxe, la TVA ou le total restant de la facture d’origine.",
      originalPosting:
        "Rapprochez l’écriture de la facture d’origine avant d’émettre un avoir.",
      posting:
        "Vérifiez la devise de l’entreprise, l’ouverture de la période et les comptes d’imputation d’origine.",
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
        title: "Accès interdit",
        description: "Accès refusé",
      },
      notFound: {
        title: "Introuvable",
        description: "Facture introuvable",
      },
      conflict: {
        title: "Avoir impossible",
        description:
          "Seules les factures OPEN ou PAID peuvent faire l'objet d'un avoir",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Des modifications ne sont pas enregistrées",
      },
    },
    success: {
      title: "Succès",
      description: "Avoir créé et écriture comptable passée",
    },
    widget: {
      back: "Retour",
      submit: "Créer l'avoir",
    },
  },
  invoiceId: {
    label: "ID de la facture",
    description: "La facture concernée par l'avoir",
    placeholder: "Saisissez l'ID de la facture",
  },
  companyId: {
    label: "ID de l'entreprise",
    description: "Entreprise qui émet l'avoir",
    placeholder: "Saisissez l'ID de l'entreprise",
  },
  reason: {
    label: "Motif",
    description: "Raison de l'émission de cet avoir",
    placeholder: "Décrivez le motif de l'avoir",
  },
  lineItems: {
    label: "Lignes",
    description:
      "Lignes d'avoir partiel facultatives. Sans lignes, l'avoir porte sur la totalité.",
    placeholder: "",
  },
};
