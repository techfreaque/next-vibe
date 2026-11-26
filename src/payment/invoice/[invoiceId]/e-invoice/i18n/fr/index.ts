import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Facture électronique (Peppol)",
  titleShort: "Facture électronique",
  description:
    "Exportez une facture ou un avoir émis au format Peppol BIS Billing 3.0 (UBL, EN 16931).",
  invoiceId: {
    label: "Facture",
    description: "La facture ou l'avoir émis à exporter",
  },
  response: {
    invoiceNumber: "Numéro du document",
    isCreditNote: "Avoir",
    fileName: "Nom du fichier",
    ready: "Prêt à l'envoi",
    missingFields: "Informations manquantes",
    xml: "XML",
  },
  widget: {
    back: "Retour",
    submit: "Préparer la facture électronique",
    invoice: "Facture {{number}}",
    creditNote: "Avoir {{number}}",
    ready: "Prêt. Toutes les mentions obligatoires EN 16931 sont présentes.",
    missing: "Complétez ces informations avant d'envoyer le fichier :",
    download: "Télécharger le XML",
    copy: "Copier le XML",
    copied: "XML copié",
    copyFailed: "Impossible de copier le XML",
    preview: "Afficher le XML",
    disclaimer: "Nous fournissons des outils, pas de conseil fiscal.",
  },
  fields: {
    bt1: "Numéro du document",
    bt2: "Date d'émission",
    bt5: "Devise",
    bt9: "Date d'échéance",
    bt27: "Nom de votre entreprise",
    bt31: "Votre numéro de TVA",
    bt34: "Votre adresse électronique (numéro de TVA, identifiant fiscal ou numéro d'immatriculation)",
    bt40: "Pays de votre entreprise",
    bt44: "Nom du client",
    bt48: "Numéro de TVA du client",
    bt49: "Adresse électronique du client (numéro de TVA, identifiant fiscal ou numéro d'immatriculation)",
    bt55: "Adresse du client avec le pays",
    bt153: "Une désignation sur chaque ligne",
    bg25: "Au moins une ligne",
  },
  errors: {
    validation: {
      title: "Requête invalide",
      description: "Vérifiez la référence de la facture.",
    },
    network: {
      title: "Erreur réseau",
      description: "La facture électronique n'a pas pu être chargée.",
    },
    unauthorized: {
      title: "Connexion requise",
      description:
        "Veuillez vous connecter pour exporter des factures électroniques.",
    },
    forbidden: {
      title: "Accès refusé",
      description: "Vous n'avez pas accès à ce document.",
    },
    notFound: {
      title: "Document introuvable",
      description: "Cette facture n'existe pas.",
    },
    server: {
      title: "Échec de l'export",
      description:
        "La facture électronique n'a pas pu être générée. Veuillez réessayer.",
    },
    unknown: {
      title: "Erreur inconnue",
      description: "Une erreur s'est produite.",
    },
    unsavedChanges: {
      title: "Modifications non enregistrées",
      description: "Enregistrez d'abord vos modifications.",
    },
    conflict: {
      title: "Pas encore émise",
      description:
        "Émettez la facture avant de l'exporter en facture électronique.",
    },
  },
  success: {
    title: "Facture électronique prête",
    description: "Le fichier Peppol est prêt.",
  },
  tags: {
    payment: "paiement",
    invoice: "facture",
    eInvoice: "facture électronique",
  },
};
