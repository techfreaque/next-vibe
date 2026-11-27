import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Politique de confidentialité : {{appName}}",
    category: "Juridique",
    description:
      "Découvrez comment {{appName}} protège votre vie privée et traite vos données",
    imageAlt: "Politique de confidentialité",
    keywords:
      "politique de confidentialité, protection des données, vie privée, confidentialité {{appName}}",
    ogTitle: "Politique de confidentialité : {{appName}}",
    ogDescription:
      "Découvrez comment {{appName}} protège votre vie privée et traite vos données",
    twitterTitle: "Politique de confidentialité : {{appName}}",
    twitterDescription:
      "Découvrez comment {{appName}} protège votre vie privée et traite vos données",
  },
  printAriaLabel: "Imprimer la politique de confidentialité",
  onThisPage: "Sur cette page",
  printButton: "Imprimer",
  title: "Politique de confidentialité",
  lastUpdated: "Dernière mise à jour : novembre 2026",
  bindingVersionNotice:
    "Cette traduction est fournie à titre informatif. Seule la version allemande de ce document fait foi.",
  introduction:
    "Chez {{appName}}, nous prenons votre vie privée au sérieux. La présente politique de confidentialité explique comment nous collectons, utilisons et protégeons vos données personnelles lorsque vous utilisez notre plateforme de chat IA non censurée.",
  sections: {
    informationCollect: {
      title: "Informations que nous collectons",
      description:
        "Nous collectons les informations que vous nous fournissez directement ainsi que des informations recueillies automatiquement lorsque vous utilisez notre service.",
    },
    personalData: {
      title: "Données personnelles",
      description:
        "Nous pouvons collecter les données personnelles suivantes :",
      items: {
        name: "Nom et coordonnées",
        email: "Adresse e-mail",
        phone: "Numéro de téléphone (facultatif)",
        company: "Nom de l'entreprise (facultatif)",
        billing: "Informations de facturation et de paiement",
        payment: "Moyen de paiement et détails des transactions",
      },
    },
    socialMediaData: {
      title: "Données des réseaux sociaux",
      description:
        "Si vous connectez des comptes de réseaux sociaux, nous pouvons collecter les informations de profil et les données associées, dans la mesure permise par ces plateformes.",
    },
    derivativeData: {
      title: "Données dérivées",
      description:
        "Nous pouvons produire, à partir de votre utilisation, des données anonymisées et agrégées afin d'améliorer nos services.",
    },
    useOfInformation: {
      title: "Utilisation de vos informations",
      description:
        "Nous utilisons les informations collectées à diverses fins, notamment :",
      items: {
        provide: "Fournir et maintenir nos services de chat IA",
        process: "Traiter vos transactions et gérer votre compte",
        send: "Vous envoyer des mises à jour, des newsletters et des communications marketing",
        respond: "Répondre à vos demandes et assurer le support client",
        monitor:
          "Surveiller et analyser les usages afin d'améliorer notre plateforme",
        personalize:
          "Personnaliser votre expérience et vous proposer des contenus pertinents",
      },
    },
    disclosure: {
      title: "Divulgation des informations",
      description:
        "Nous pouvons divulguer vos informations lorsque la loi l'exige ou pour protéger nos droits et notre sécurité.",
    },
    businessTransfers: {
      title: "Changement d'exploitant",
      description:
        "Si le service est transféré à un nouvel exploitant, vos données peuvent lui être transmises.",
    },
    thirdParty: {
      title: "Services tiers",
      description:
        "Nous ne transmettons des données personnelles qu'aux prestataires listés ci-dessous, et seulement dans la mesure où chacun en a besoin pour sa mission. Votre compte, vos conversations et vos fichiers sont stockés sur nos propres serveurs en Allemagne.",
      aiNotice:
        "Quand vous discutez ou générez des médias, la requête part chez le fournisseur du modèle choisi. Elle contient ce dont le modèle a besoin pour répondre : votre message, les messages précédents de la conversation, les pièces jointes, les instructions et souvenirs utilisés par l'IA, ainsi que le nom d'affichage de votre profil. Nous n'envoyons pas votre adresse e-mail. Des intermédiaires comme OpenRouter, NanoGPT et Venice transmettent la requête à l'entreprise qui exploite le modèle, par exemple OpenAI, Anthropic, Google, xAI, DeepSeek ou Mistral. La durée de conservation d'une requête et l'usage qu'un fournisseur peut en faire relèvent de ses propres conditions. Nous n'entraînons aucun modèle d'IA sur vos conversations.",
      transfers:
        "Plusieurs prestataires sont établis hors de l'UE. Lorsqu'un prestataire propose les clauses contractuelles types de la Commission européenne, comme Stripe et OpenRouter, le transfert repose sur celles-ci. Sinon, les données sont transférées selon les conditions du prestataire.",
      labels: {
        purpose: "Finalité",
        data: "Données transmises",
        privacyPolicy: "Politique de confidentialité",
      },
      groups: {
        hosting: "Hébergement et stockage",
        email: "E-mail",
        payments: "Paiements",
        ai: "Modèles d'IA",
        web: "Recherche web et chargement de pages",
      },
      providers: {
        hostinger: {
          purpose:
            "Nous loue les deux serveurs virtuels qui font tourner la plateforme. Nous exploitons nous-mêmes la base de données, le stockage de fichiers (MinIO) et le cache (Redis) sur ces serveurs. Aucun service de stockage cloud séparé n'intervient.",
          data: "Tout ce qui est stocké sur la plateforme : données de compte, conversations, souvenirs, fichiers envoyés et générés, historique des paiements.",
          location: "Serveurs en Allemagne, société en Lituanie (UE)",
        },
        hosttech: {
          purpose:
            "Serveur de messagerie de nos adresses e-mail. Envoie les codes d'inscription, reçus et newsletters, et reçoit les e-mails que vous nous écrivez.",
          data: "Adresse e-mail, nom, contenu des e-mails.",
          location: "Suisse (décision d'adéquation de l'UE)",
        },
        stripe: {
          purpose: "Paiements par carte, abonnements et factures.",
          data: "Nom, adresse e-mail, adresse de facturation, données de paiement, montants, l'identifiant de votre compte. Nous ne voyons jamais votre numéro de carte complet.",
          location:
            "Stripe Payments Europe, Ltd., Irlande (UE) ; société mère aux États-Unis",
        },
        paypal: {
          purpose:
            "Uniquement si vous choisissez PayPal lors du paiement Stripe.",
          data: "Nom, adresse e-mail, données de paiement, montants.",
          location: "PayPal (Europe) S.à r.l. et Cie, S.C.A., Luxembourg (UE)",
        },
        nowpayments: {
          purpose: "Paiements en cryptomonnaies.",
          data: "L'identifiant de votre compte dans le numéro de commande, produit et montant, données de portefeuille et de transaction. Pour les paiements crypto récurrents, aussi votre adresse e-mail.",
          location: "Saint-Vincent-et-les-Grenadines",
        },
        openrouter: {
          purpose:
            "Achemine la plupart des modèles de chat (par exemple d'OpenAI, Anthropic, Google, xAI, DeepSeek, Mistral et Qwen) et certains modèles d'image et de vidéo vers l'entreprise qui les exploite.",
          data: "Contenu de la requête IA décrit ci-dessus. L'entreprise qui exploite le modèle reçoit le même contenu.",
          location: "États-Unis",
        },
        nanogpt: {
          purpose: "Modèles de chat, d'image et de vidéo, synthèse vocale.",
          data: "Contenu de la requête IA, texte que vous faites lire à voix haute.",
          location: "États-Unis",
        },
        venice: {
          purpose: "Modèles de chat, d'image et de vidéo non censurés.",
          data: "Contenu de la requête IA.",
          location: "États-Unis",
        },
        uncensoredAi: {
          purpose: "Modèle de chat UncensoredLM.",
          data: "Contenu de la requête IA.",
          location: "États-Unis",
        },
        freedomgpt: {
          purpose: "Modèles de chat FreedomGPT.",
          data: "Contenu de la requête IA.",
          location: "États-Unis",
        },
        gabAi: {
          purpose: "Modèles de chat Gab AI.",
          data: "Contenu de la requête IA.",
          location: "États-Unis",
        },
        modelslab: {
          purpose: "Modèles d'image, de vidéo et de musique.",
          data: "Votre prompt et les images jointes.",
          location: "Inde",
        },
        edenAi: {
          purpose:
            "Transcription vocale et synthèse vocale. Transmet l'audio ou le texte au moteur vocal utilisé.",
          data: "Enregistrements vocaux que vous transcrivez, texte que vous faites lire à voix haute.",
          location: "France (UE)",
        },
        braveSearch: {
          purpose: "Recherche web quand l'IA cherche sur internet.",
          data: "La requête de recherche rédigée par l'IA. Aucune donnée de compte.",
          location: "États-Unis",
        },
        kagi: {
          purpose:
            "Recherche web et réponses web courtes quand l'IA cherche sur internet.",
          data: "La requête de recherche rédigée par l'IA. Aucune donnée de compte.",
          location: "États-Unis",
        },
        scrappey: {
          purpose: "Charge une page web quand l'IA lit un lien.",
          data: "L'adresse de la page. Aucune donnée de compte.",
          location: "UE",
        },
      },
    },
    legal: {
      title: "Base juridique du traitement",
      description:
        "Nous traitons vos données personnelles sur la base de votre consentement, de la nécessité contractuelle, de nos obligations légales et de notre intérêt légitime à fournir et à améliorer nos services.",
    },
    security: {
      title: "Mesures de sécurité",
      description:
        "Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles appropriées pour protéger vos données personnelles contre tout accès, toute modification, toute divulgation ou toute destruction non autorisés. Toutefois, aucune méthode de transmission sur Internet n'est sûre à 100 %.",
    },
    rights: {
      title: "Vos droits en matière de protection des données",
      description:
        "En vertu de la législation sur la protection des données, vous disposez de certains droits concernant vos données personnelles :",
      items: {
        access: "Droit d'accès à vos données personnelles",
        correction:
          "Droit de rectification des données inexactes ou incomplètes",
        deletion:
          "Droit à l'effacement : supprimez votre compte depuis les paramètres et vos données personnelles sont effacées",
        objection: "Droit d'opposition au traitement de vos données",
        portability:
          "Droit à la portabilité des données : exportez toutes vos données au format JSON depuis les paramètres",
      },
    },
    cookies: {
      title: "Cookies et suivi",
      description:
        "Aucun traceur tiers, aucun pixel publicitaire, aucune empreinte numérique (fingerprinting). Un cookie interne (first-party) permet d'identifier votre navigateur auprès de nous. Pour savoir quels canaux amènent des personnes qui restent, nous enregistrons comment vous êtes arrivé la première fois et la dernière fois via un lien balisé : les balises de campagne du lien (utm_source, utm_medium, utm_campaign, utm_content, utm_term), le domaine du site référent (jamais l'adresse complète), la page d'arrivée (sans sa chaîne de requête) et un éventuel code de parrainage. Nous notons ensuite la date de votre premier chat, de votre inscription, de la confirmation de la newsletter, de votre paiement et de vos renouvellements. Ces données sont associées à votre compte lors de votre inscription, utilisées uniquement de manière agrégée pour évaluer les canaux marketing, jamais vendues ni partagées, et supprimées avec votre compte.",
    },
    guestMedia: {
      title: "Médias créés sans compte",
      description:
        "Les images, fichiers audio et vidéos générés sans compte, y compris en mode incognito, sont stockés sur nos serveurs afin de pouvoir être affichés et téléchargés. Si vous ne créez jamais de compte, ces fichiers sont automatiquement supprimés au bout de 4 mois.",
    },
    thirdPartySites: {
      title: "Sites web tiers",
      description:
        "Notre service peut contenir des liens vers des sites web tiers. Nous ne sommes pas responsables des pratiques de ces sites externes en matière de confidentialité. Nous vous invitons à consulter leurs politiques de confidentialité.",
    },
    children: {
      title: "Protection des enfants",
      description:
        "Notre service ne s'adresse pas aux enfants de moins de 13 ans. Nous ne collectons pas sciemment de données concernant des enfants.",
    },
    changes: {
      title: "Modifications de la présente politique",
      description:
        "Nous pouvons mettre à jour la présente politique de confidentialité de temps à autre. Nous vous informerons de toute modification importante.",
    },
    controller: {
      description:
        "Le responsable du traitement de vos données au sens du RGPD est {{operator}}, {{address}}.",
    },
    gdpr: {
      title: "Conformité au RGPD",
      description:
        "Pour les utilisateurs situés dans l'Union européenne, nous respectons les droits que vous confère le RGPD. Exportez vos données à tout moment depuis les paramètres. Lorsque vous supprimez votre compte, votre profil, vos chats, vos souvenirs (mémoires de l'IA), vos adresses, votre abonnement à la newsletter et vos coordonnées sont effacés, et les données personnelles figurant dans les enregistrements de visiteur associés sont supprimées. Les statistiques agrégées anonymes et le registre des crédits (qui ne vous est plus rattaché) sont conservés. Contactez-nous pour toute demande que les paramètres ne couvrent pas.",
    },
  },
  post: {
    title: "Politique de confidentialité",
    description: "Endpoint de la politique de confidentialité",
    form: {
      title: "Configuration de la politique de confidentialité",
      description:
        "Configurer les paramètres de la politique de confidentialité",
    },
    response: {
      title: "Réponse",
      description: "Données de réponse de la politique de confidentialité",
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
