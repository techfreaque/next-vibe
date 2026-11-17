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
          "Les abonnements sont facturés au mois ou à l'année ; les formules annuelles reçoivent leurs crédits mensuels chaque mois. Les packs de crédits sont des recharges uniques réservées aux abonnés actifs et n'expirent jamais. Nous acceptons les cartes, PayPal, Apple Pay et Google Pay via Stripe ainsi que les cryptomonnaies via NowPayments.",
      },
      cancellation: {
        title: "Résiliation",
        content:
          "Vous pouvez résilier votre abonnement à tout moment. La résiliation prend effet à la fin de la période de facturation en cours. Les packs de crédits ne sont pas remboursables, sauf si le droit légal de rétractation s'applique (voir la section Droit de rétractation des consommateurs).",
      },
    },
    withdrawal: {
      title: "Droit de rétractation des consommateurs",
      intro:
        "Si vous êtes un consommateur (article 13 du Code civil allemand, BGB), vous disposez d'un droit légal de rétractation pour les contrats portant sur des packs de crédits et des abonnements que vous concluez avec nous via {{appName}}, dans les conditions prévues par les informations sur la rétractation ci-dessous.",
      notice: {
        title: "Informations sur le droit de rétractation",
        right:
          "Vous avez le droit de vous rétracter du présent contrat sans donner de motif dans un délai de quatorze jours. Le délai de rétractation est de quatorze jours à compter du jour de la conclusion du contrat.",
        exercise:
          "Pour exercer le droit de rétractation, vous devez nous notifier ({{operator}}, {{address}}, e-mail : {{email}}) votre décision de vous rétracter du présent contrat au moyen d'une déclaration dénuée d'ambiguïté (par exemple, une lettre envoyée par la poste ou un e-mail). Vous pouvez utiliser le modèle de formulaire de rétractation ci-dessous, mais ce n'est pas obligatoire. Un simple e-mail suffit.",
        deadline:
          "Pour que le délai de rétractation soit respecté, il suffit que vous transmettiez votre communication relative à l'exercice du droit de rétractation avant l'expiration du délai de rétractation.",
      },
      effects: {
        title: "Effets de la rétractation",
        refund:
          "En cas de rétractation de votre part du présent contrat, nous vous rembourserons tous les paiements reçus de vous, sans retard excessif et au plus tard quatorze jours à compter du jour où nous avons reçu la notification de votre rétractation du présent contrat. Nous procéderons au remboursement en utilisant le même moyen de paiement que celui que vous avez utilisé pour la transaction initiale, sauf accord exprès contraire avec vous ; en aucun cas ce remboursement n'occasionnera de frais pour vous.",
        compensation:
          "Si vous avez demandé que la prestation de services commence pendant le délai de rétractation, vous devez nous payer un montant raisonnable correspondant à la part des services déjà fournis jusqu'au moment où vous nous informez de l'exercice du droit de rétractation pour ce contrat, par rapport à l'ensemble des services prévus par le contrat.",
        end: "Fin des informations sur le droit de rétractation",
      },
      expiry: {
        title: "Remarques sur l'expiration anticipée du droit de rétractation",
        digitalContent:
          "Pour un contrat de fourniture de contenu numérique non fourni sur un support matériel, le droit de rétractation expire en vertu de l'article 356, paragraphe 5, du BGB lorsque nous avons commencé l'exécution du contrat après que vous avez expressément consenti à ce que nous commencions l'exécution avant l'expiration du délai de rétractation, que vous avez confirmé avoir pris connaissance du fait que votre consentement entraîne la perte de votre droit de rétractation dès le début de l'exécution, et que nous vous avons remis une confirmation du contrat.",
        services:
          "Pour un contrat de prestation de services, le droit de rétractation expire en vertu de l'article 356, paragraphe 4, du BGB lorsque nous avons pleinement exécuté le service et n'en avons commencé l'exécution qu'après que vous y avez expressément consenti et avez confirmé en même temps avoir pris connaissance du fait que votre droit de rétractation expire dès que nous avons pleinement exécuté le contrat.",
        credits:
          "Lorsque votre droit de rétractation n'a pas expiré en vertu de ces dispositions, les règles suivantes s'appliquent aux crédits : nous remboursons intégralement le prix correspondant aux crédits non utilisés issus du contrat rétracté, et ces crédits sont retirés de votre compte lors de la rétractation. Pour les crédits déjà utilisés, nous facturons, dans la mesure permise par la loi, un montant proportionnel calculé selon le rapport entre les crédits utilisés et les crédits acquis au titre du contrat. La rétractation d'un abonnement met également fin à l'abonnement.",
      },
      form: {
        title: "Modèle de formulaire de rétractation",
        intro:
          "(Veuillez compléter et renvoyer le présent formulaire uniquement si vous souhaitez vous rétracter du contrat.)",
        recipient:
          "À l'attention de {{operator}}, {{address}}, e-mail : {{email}}",
        statement:
          "Je/Nous (*) vous notifie/notifions (*) par la présente ma/notre (*) rétractation du contrat portant sur la fourniture du contenu numérique (*)/la prestation de services (*) ci-dessous :",
        orderedOn: "Commandé le (*)/reçu le (*)",
        name: "Nom du (des) consommateur(s)",
        address: "Adresse du (des) consommateur(s)",
        signature:
          "Signature du (des) consommateur(s) (uniquement en cas de notification du présent formulaire sur papier)",
        date: "Date",
        footnote: "(*) Rayez la mention inutile.",
        accountHint:
          "Pour que nous puissions identifier rapidement votre achat, indiquez l'adresse e-mail de votre compte. Ce n'est pas une condition de validité de la rétractation.",
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
