import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Mentions légales : {{appName}}",
    category: "Juridique",
    description:
      "Mentions légales et informations sur l'éditeur de {{appName}}",
    imageAlt: "Mentions légales",
    keywords:
      "mentions légales, impressum, informations sur l'éditeur, {{appName}} juridique",
    ogTitle: "Mentions légales : {{appName}}",
    ogDescription:
      "Mentions légales et informations sur l'éditeur de {{appName}}",
    twitterTitle: "Mentions légales : {{appName}}",
    twitterDescription:
      "Mentions légales et informations sur l'éditeur de {{appName}}",
  },
  printAriaLabel: "Imprimer les mentions légales",
  onThisPage: "Sur cette page",
  printButton: "Imprimer",
  title: "Mentions légales",
  lastUpdated: "Dernière mise à jour : novembre 2026",
  bindingVersionNotice:
    "Cette traduction est fournie à titre informatif. Seule la version allemande de ce document fait foi.",
  introduction:
    "Les présentes mentions légales fournissent les informations sur {{appName}} exigées par la législation applicable.",
  sections: {
    companyInfo: {
      title: "Éditeur",
      description: "{{appName}} est exploité par :",
      vat: "TVA : petite entreprise au sens du § 19 de la loi allemande relative à la TVA (UStG), aucune TVA n'est facturée.",
    },
    responsiblePerson: {
      title: "Responsable de la publication",
      description:
        "Informations sur la personne responsable du contenu de ce site web.",
    },
    contactInfo: {
      title: "Coordonnées",
      description:
        "Comment nous joindre pour toute demande juridique ou commerciale.",
    },
    disclaimer: {
      title: "Clause de non-responsabilité",
      copyright: {
        title: "Droit d'auteur",
        content:
          "L'ensemble du contenu de ce site web est protégé par le droit d'auteur. Toute utilisation non autorisée est interdite.",
      },
      liability: {
        title: "Responsabilité",
        content:
          "Nous ne faisons aucune déclaration et n'accordons aucune garantie quant à l'exhaustivité, l'exactitude ou la fiabilité des informations figurant sur ce site web.",
      },
      links: {
        title: "Liens externes",
        content:
          "Notre site web peut contenir des liens vers des sites externes. Nous ne sommes pas responsables du contenu des sites web externes.",
      },
    },
    disputeResolution: {
      title: "Règlement des litiges",
      description:
        "Informations sur la manière dont les litiges sont traités et réglés.",
      content:
        "Nous ne sommes ni tenus ni disposés à participer à une procédure de règlement des litiges devant un organisme de médiation de la consommation.",
    },
  },
  post: {
    title: "Mentions légales",
    description: "Endpoint des mentions légales",
    form: {
      title: "Configuration des mentions légales",
      description: "Configurer les paramètres des mentions légales",
    },
    response: {
      title: "Réponse",
      description: "Données de réponse des mentions légales",
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
        description: "Ressource introuvable",
      },
      conflict: {
        title: "Conflit",
        description: "Un conflit de données s'est produit",
      },
    },
    success: {
      title: "Succès",
      description: "Opération réussie",
    },
  },
};
