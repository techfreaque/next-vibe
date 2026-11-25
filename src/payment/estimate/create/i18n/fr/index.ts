import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Devis",
  tags: {
    payment: "paiement",
    estimate: "devis",
    ar: "comptabilité-clients",
  },
  post: {
    title: "Créer un devis",
    titleShort: "Créer un devis",
    description: "Créer un nouveau devis commercial au statut brouillon",
    form: {
      title: "Nouveau devis",
      description: "Renseignez les informations du devis",
    },
    response: {
      success: "Devis créé",
      message: "Message de statut",
      estimate: {
        title: "Devis",
        subtitle: "Devis créé",
        id: "ID du devis",
        companyId: "ID de l'entreprise",
        estimateNumber: "N° de devis",
        status: "Statut",
        customerId: "ID du client",
        customerEmail: "E-mail du client",
        customerName: "Nom du client",
        currency: "Devise",
        validUntil: "Valable jusqu'au",
        title_field: "Objet",
        notes: "Notes",
        terms: "Conditions",
        subtotal: "Sous-total HT",
        taxAmount: "Montant de TVA",
        total: "Total TTC",
        invoiceId: "ID de la facture",
        createdAt: "Créé le",
        updatedAt: "Modifié le",
      },
    },
    errors: {
      unauthorized: {
        title: "Non autorisé",
        description: "Authentification requise",
      },
      validation: {
        title: "Erreur de validation",
        description: "Paramètres du devis invalides",
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
        description: "Vous devez être admin ou comptable de cette entreprise",
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
      title: "Succès",
      description: "Devis créé au statut brouillon",
    },
    widget: {
      otherRate: "Autre taux",
      item: "Désignation",
      quantity: "Quantité",
      price: "Prix unitaire",
      vatRate: "TVA %",
      add: "Ajouter une ligne",
      remove: "Supprimer la ligne",
      empty: "Ajoutez les biens ou services proposés.",
      summary: "Récapitulatif",

      back: "Retour",
      submit: "Créer le devis",
      viewButton: "Voir le devis",
    },
  },
  companyId: {
    label: "ID de l'entreprise",
    description: "L'entreprise qui émet ce devis",
    placeholder: "Saisissez l'ID de l'entreprise",
  },
  customerId: {
    label: "ID du client",
    description: "Facultatif : UUID du client",
    placeholder: "Saisissez l'ID du client",
  },
  customerEmail: {
    label: "E-mail du client",
    description: "Adresse e-mail du client",
    placeholder: "client@example.com",
  },
  customerName: {
    label: "Nom du client",
    description: "Nom du client",
    placeholder: "Saisissez le nom du client",
  },
  currency: {
    code: "{{code}}",
    label: "Devise",
    description: "Devise du devis",
    placeholder: "Devise de l’entreprise",
  },
  validUntil: {
    label: "Valable jusqu'au",
    description: "Date de fin de validité de ce devis",
    placeholder: "Choisissez la date d'expiration",
  },
  title: {
    label: "Objet",
    description: "Intitulé court de ce devis",
    placeholder: "ex. Refonte du site web",
  },
  notes: {
    label: "Notes",
    description: "Notes facultatives affichées sur le devis",
    placeholder: "ex. Prix valables 30 jours",
  },
  terms: {
    label: "Conditions",
    description: "Conditions de paiement ou de livraison",
    placeholder: "ex. 50 % à la commande, 50 % à la livraison",
  },
  lines: {
    label: "Lignes",
    description: "Prestations et articles inclus dans ce devis",
  },
};
