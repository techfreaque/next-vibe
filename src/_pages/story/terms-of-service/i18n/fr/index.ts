import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Conditions d'utilisation - {{appName}}",
    category: "Juridique",
    description:
      "Consultez les conditions générales d'utilisation de {{appName}}",
    imageAlt: "Conditions d'utilisation",
    keywords:
      "conditions d'utilisation, conditions générales, contrat d'utilisation, conditions {{appName}}",
    ogTitle: "Conditions d'utilisation - {{appName}}",
    ogDescription:
      "Consultez les conditions générales d'utilisation de {{appName}}",
    twitterTitle: "Conditions d'utilisation - {{appName}}",
    twitterDescription:
      "Consultez les conditions générales d'utilisation de {{appName}}",
  },
  printAriaLabel: "Imprimer les conditions d'utilisation",
  onThisPage: "Sur cette page",
  printButton: "Imprimer",
  title: "Conditions d'utilisation",
  lastUpdated: "Dernière mise à jour : novembre 2026",
  bindingVersionNotice:
    "Cette traduction est fournie à titre informatif. Seule la version allemande de ce document fait foi.",
  introduction:
    "Bienvenue sur {{appName}}. En utilisant notre plateforme de chat IA non censurée, vous acceptez les présentes conditions d'utilisation. Veuillez les lire attentivement. {{appName}} est exploité par {{operator}}, Allemagne.",
  sections: {
    agreement: {
      title: "Acceptation des conditions",
      content:
        "En accédant à {{appName}} ou en l'utilisant, vous acceptez d'être lié par les présentes conditions d'utilisation ainsi que par l'ensemble des lois et réglementations applicables. Si vous n'acceptez pas l'une de ces conditions, il vous est interdit d'utiliser ce service.",
    },
    description: {
      title: "Description du service",
      content:
        "{{appName}} donne accès à des modèles de chat IA non censurés provenant de divers fournisseurs. Nous proposons des formules gratuites et payantes, avec des fonctionnalités et des limites d'utilisation différentes. Le service est fourni « en l'état », sans garantie d'aucune sorte.",
    },
    subscriptions: {
      title: "Abonnements et facturation",
      plans: {
        title: "Formules d'abonnement",
        content:
          "Nous proposons une formule d'abonnement et des packs de crédits. Les packs de crédits n'expirent jamais, même après la fin de l'abonnement.",
      },
      billing: {
        title: "Facturation",
        content:
          "Les abonnements sont facturés mensuellement. Les packs de crédits sont des achats uniques qui n'expirent jamais. Nous acceptons les cartes bancaires via Stripe et les cryptomonnaies via NowPayments.",
      },
      cancellation: {
        title: "Résiliation",
        content:
          "Vous pouvez résilier votre abonnement à tout moment. La résiliation prend effet à la fin de la période de facturation en cours. Les packs de crédits ne sont pas remboursables.",
      },
    },
    userAccounts: {
      title: "Comptes utilisateur",
      creation: {
        title: "Création de compte",
        content:
          "Vous devez fournir des informations exactes lors de la création d'un compte. Vous êtes responsable de la sécurité de vos identifiants de connexion.",
      },
      responsibilities: {
        title: "Obligations de l'utilisateur",
        content:
          "Vous êtes responsable de toute activité effectuée depuis votre compte. Vous ne devez pas partager votre compte avec d'autres personnes ni utiliser le service à des fins illégales.",
      },
    },
    userContent: {
      title: "Contenu de l'utilisateur",
      ownership: {
        title: "Propriété du contenu",
        content:
          "Vous conservez tous les droits sur vos conversations et vos données. Nous ne revendiquons aucun droit de propriété sur votre contenu. Vos dossiers privés ne sont accessibles qu'à vous.",
      },
      guidelines: {
        title: "Règles relatives au contenu",
        intro:
          "Bien que nous offrions un accès non censuré à l'IA, vous ne devez pas utiliser le service pour :",
        items: {
          item1: "Vous livrer à des activités illégales",
          item2: "Harceler, menacer ou nuire à autrui",
          item3: "Porter atteinte à des droits de propriété intellectuelle",
          item4: "Tenter de pirater ou de compromettre la plateforme",
        },
      },
    },
    intellectualProperty: {
      title: "Propriété intellectuelle",
      content:
        "La plateforme {{appName}}, y compris son design, ses fonctionnalités et son code, est protégée par le droit de la propriété intellectuelle. Vous ne pouvez pas copier, modifier ni distribuer notre plateforme sans autorisation.",
    },
    limitation: {
      title: "Limitation de responsabilité",
      content:
        "{{appName}} ne saurait être tenu responsable de tout dommage indirect, accessoire, spécial ou consécutif résultant de votre utilisation du service.",
    },
    indemnification: {
      title: "Indemnisation",
      content:
        "Vous acceptez d'indemniser {{appName}} et de le garantir contre toute réclamation, tout dommage ou toute dépense résultant de votre utilisation du service ou d'une violation des présentes conditions.",
    },
    termination: {
      title: "Résiliation du compte",
      content:
        "Nous nous réservons le droit de résilier ou de suspendre votre compte en cas de violation des présentes conditions. Vous pouvez résilier votre compte à tout moment.",
    },
    changes: {
      title: "Modification des conditions",
      content:
        "Nous pouvons mettre à jour les présentes conditions d'utilisation de temps à autre. La poursuite de l'utilisation du service après une modification vaut acceptation des nouvelles conditions.",
    },
    governingLaw: {
      title: "Droit applicable",
      content:
        "Les présentes conditions d'utilisation sont régies par le droit de la République fédérale d'Allemagne. Si vous êtes un consommateur, ce choix de loi ne vous prive pas de la protection que vous assurent les dispositions impératives du droit du pays dans lequel vous avez votre résidence habituelle. Si vous êtes commerçant, personne morale de droit public ou établissement public doté d'un patrimoine distinct (Sondervermögen), le tribunal compétent pour tout litige découlant des présentes conditions est celui du siège de l'exploitant à Simbach am Inn, Allemagne. Dans tous les autres cas, la compétence juridictionnelle légale s'applique.",
    },
  },
  post: {
    title: "Conditions d'utilisation",
    description: "Endpoint des conditions d'utilisation",
    form: {
      title: "Configuration des conditions d'utilisation",
      description: "Configurer les paramètres des conditions d'utilisation",
    },
    response: {
      title: "Réponse",
      description: "Données de réponse des conditions d'utilisation",
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
