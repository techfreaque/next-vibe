import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Alternatives à Character.AI pour le jeu de rôle (2026)",
    category: "Jeu de rôle avec l’IA",
    description:
      "Comparez les alternatives à Character.AI pour le jeu de rôle, la fiction et les compagnons IA, dont Janitor AI, SpicyChat, DreamGen, SillyTavern et {{appName}}.",
    imageAlt:
      "Alternatives à Character.AI pour le jeu de rôle et les compagnons IA",
    keywords:
      "alternative à Character AI, Character AI sans filtre, jeu de rôle IA, Janitor AI, SillyTavern",
  },
  hero: {
    backToBlog: "Retour au blog",
    category: "Jeu de rôle avec l’IA",
    readTime: "9 min de lecture",
    title: "Alternatives à Character.AI pour le jeu de rôle",
    subtitle:
      "Trouvez des personnages prêts à jouer, un compagnon qui se souvient de vous ou un modèle à choisir. Tarifs vérifiés le {{date}}.",
  },
  intro: {
    lead: "Avec Janitor AI, choisissez un personnage et lancez la scène. SillyTavern vous laisse configurer toute l’installation. Kindroid et Nomi conviennent si vous cherchez un compagnon qui garde vos échanges en mémoire.",
    p2: "Nous développons {{appName}}. Nous le présentons en premier pour le choix du modèle et l’import de personnages. Les tarifs des autres services sont en dollars américains. Ils proviennent des pages officielles et des fiches éditeur consultées le {{date}}.",
  },
  characterAi: { title: "Ce que propose Character.AI aujourd’hui" },
  switch: {
    title: "Pourquoi chercher une alternative",
    intro: "Trois raisons ressortent de discussions publiques.",
    reasons: {
      filtering: {
        body: "Des scènes interrompues. Dans son point communautaire d’août 2025, Character.AI a reconnu que, selon des utilisateurs, le filtre intervenait trop souvent.",
        source: "Point communautaire sur Reddit",
      },
      continuity: {
        body: "Le fil du récit se perd. Une personne cherchait des dialogues crédibles, une meilleure mémoire et assez de place pour écrire ses propres répliques dans les scènes lentes.",
        source: "Discussion sur le jeu de rôle et la mémoire sur Reddit",
      },
      oldSite: {
        body: "La disparition de l’ancien site. Dans un échange sur les raisons de rester ou de partir, une personne explique avoir fait le changement définitif à ce moment-là.",
        source: "Discussion sur les départs de Character.AI sur Reddit",
      },
    },
  },
  criteria: {
    title: "Les points à vérifier avant de changer",
    intro:
      "Jouez la même scène dans deux applications. Revenez le lendemain et posez une question sur un détail du début.",
    filter:
      "Vérifiez les sujets autorisés et la présence éventuelle d’un contrôle d’âge.",
    memory:
      "Vérifiez si les souvenirs enregistrés, les résumés ou les fiches d’univers ramènent les anciens détails dans le contexte.",
    price:
      "Comptez les messages ou crédits consommés par votre modèle préféré, y compris les nouvelles tentatives.",
    privacy:
      "Vérifiez où l’historique est conservé et qui traite vos messages.",
    characters:
      "Choisissez entre un catalogue, une fiche modifiable et un compagnon que vous retrouvez régulièrement.",
  },
  table: {
    title: "Character.AI et ses alternatives dans un tableau",
  },
  us: {
    title: "1. {{appName}} : importez un personnage et choisissez son modèle",
    intro:
      "Lancez une scène dans le navigateur ou créez un personnage sous forme de compétence réutilisable.",
    models:
      "Parmi les {{modelCount}} modèles de chat, {{uncensored}} sont non censurés, {{mainstream}} grand public et {{open}} ouverts. Changez de modèle en pleine scène.",
    characters:
      "La compétence Jeu de rôle aide le modèle à tenir son rôle. Retrouvez les compétences publiées ou créez votre propre personnage dans l’éditeur ou avec le créateur de compétences.",
    consent:
      "Pour utiliser les modèles non censurés, confirmez une fois que vous avez au moins 18 ans et acceptez les réponses sans filtre.",
    import:
      "Importez un personnage à partir d’un lien public Character.AI ou Talkie. La copie crédite le créateur d’origine.",
    privacy:
      "Le chat incognito fonctionne sans compte. L’historique reste dans le navigateur. Le fournisseur du modèle reçoit chaque message pour y répondre.",
    price:
      "{{guestCredits}} crédits par mois en accès invité ou {{freeCredits}} avec un compte gratuit. Abonnements à partir de {{subPrice}} par mois. L’utilisation des modèles consomme des crédits.",
    weak: "Character.AI et Janitor AI offrent plus de choix pour découvrir des personnages. Un forfait fixe peut aussi être plus prévisible si vous jouez beaucoup.",
    skillsLink: "Parcourir les compétences intégrées et communautaires",
    roleplayLink: "Ouvrir la compétence Jeu de rôle",
    creatorLink: "Créer un personnage avec le créateur de compétences",
  },
  list: {
    title: "Neuf alternatives en détail",
    intro:
      "Choisissez selon votre façon de jouer. Les sources figurent sous chaque service.",
    heading: "{{number}}. {{name}} : {{bestFor}}",
    filter: "Règles de contenu.",
    price: "Tarif.",
    pro: "Atout.",
    con: "Limite.",
    versusLink: "{{appName}} face à {{name}}",
  },
  options: {
    characterAi: {
      summary:
        "Character.AI héberge des personnages publics et personnalisés pour des scènes à l’écrit, avec des voix et des appels. Les utilisateurs autorisés à chatter peuvent envoyer des messages standard illimités gratuitement.",
      pricing:
        "Messages standard gratuits. Les offres aux États-Unis sont {{plans}}. Lite donne accès à certaines fonctions premium et garde des publicités. Plus ajoute toutes les fonctions de mémoire et supprime les publicités.",
      filter:
        "Les contenus pornographiques sont interdits. Le chat ouvert avec les personnages est réservé aux adultes.",
      privacy: "Réglage de l’entraînement des modèles",
      pro: "Un vaste choix de personnages de fandoms et des voix et appels intégrés.",
      con: "Le paiement ajoute des fonctions. Les règles sur les contenus explicites continuent de s’appliquer.",
    },
    janitorAi: {
      bestFor: "les personnages de la communauté",
      summary:
        "Des millions de personnages communautaires, des personas modifiables et la possibilité de connecter un modèle externe.",
      pricing:
        "Chat standard illimité. L’App Store américain affiche {{plans}}.",
      filter:
        "Les personnages Limitless peuvent aborder des thèmes adultes. L’application démarre en mode restreint.",
      privacy: "Les proxys externes peuvent recevoir les messages",
      pro: "Un grand catalogue et des échanges standard gratuits sans plafond. Janitor+ multiplie le contexte par cinq et donne accès aux réponses prioritaires et aux variantes de modèles premium.",
      con: "En gratuit, le contexte couvre environ 9 000 jetons. Un proxy externe peut demander de la configuration et coûter en plus.",
    },
    sillyTavern: {
      bestFor: "garder la main en local",
      summary:
        "Une interface libre et gratuite pour modèles locaux ou hébergés. Elle importe les fiches de personnage et prend en charge les fiches d’univers et les préréglages.",
      pricing:
        "Logiciel gratuit. Un modèle local utilise votre matériel. Les API hébergées facturent séparément.",
      filter: "Le filtrage dépend du modèle et du service qui l’exécute.",
      privacy: "Historique local. Les API hébergées reçoivent les messages.",
      pro: "Vous maîtrisez les fiches, le contexte et le modèle. L’ensemble peut tourner chez vous.",
      con: "Installation et maintenance à votre charge. Un modèle local demande du matériel adapté.",
    },
    chub: {
      bestFor: "les fiches d’univers et les intrigues à embranchements",
      summary:
        "Catalogue de fiches avec une interface hébergée, des entrées d’univers activées par mots-clés et des scènes à plusieurs personnages.",
      pricing:
        "Chub indique offrir parfois des crédits d’essai ponctuels. L’abonnement aux modèles de Chub coûte {{plans}}. Les modèles externes ont leurs propres tarifs.",
      filter:
        "Chub présente ses modèles comme non censurés. Les fournisseurs externes fixent leurs propres règles.",
      privacy:
        "Un chat partagé peut devenir public. Les API externes reçoivent les messages.",
      pro: "Explorez plusieurs branches, ajoutez une fiche d’univers et exportez vos échanges en JSONL pour SillyTavern ou en texte.",
      con: "Pour jouer régulièrement, il faut un abonnement ou configurer un modèle. Les crédits d’essai sont limités et distribués de façon ponctuelle.",
      free: "Crédits d’essai ponctuels",
    },
    crushOn: {
      bestFor: "le jeu de rôle adulte prêt à l’emploi",
      summary:
        "Des personnages communautaires, des scènes de groupe, des voix et plusieurs modèles sans clé API à fournir.",
      pricing:
        "Échanges illimités sur les modèles gratuits et 100 crédits par mois pour les modèles Pro. Les offres mensuelles sont {{plans}}.",
      filter:
        "Le jeu de rôle adulte est possible. Les modèles avancés ont leurs propres conditions d’accès et limites de crédits.",
      privacy:
        "La politique consultée ne précise pas l’accès des créateurs aux échanges",
      pro: "Lancez une scène de groupe à partir du catalogue et changez de modèle au cours du dialogue.",
      con: "Pro et Ultra ont des règles distinctes. Un abonnement laisse des limites sur certains modèles.",
    },
    spicyChat: {
      bestFor: "les personnages adultes et les personas",
      summary:
        "Service hébergé de jeu de rôle adulte avec des personnages communautaires, plusieurs personas et des outils de mémoire payants.",
      pricing:
        "Contexte gratuit de 4 096 jetons. Les offres annuelles aux États-Unis sont {{plans}}. Les offres mensuelles sont à vérifier sur le site.",
      filter:
        "Le jeu de rôle adulte est pris en charge. Les personnages publics sont modérés.",
      privacy: "Service hébergé. Le dialogue en cours sert de contexte.",
      pro: "Les abonnés passent la file et modifient les souvenirs. Les offres supérieures ajoutent mémoire sémantique et images dans le chat.",
      con: "En gratuit, attendez-vous à des files et à des publicités. La synthèse vocale et les réglages de génération sont réservés au dernier niveau.",
    },
    kindroid: {
      bestFor: "un compagnon joignable en direct",
      summary:
        "Créez un compagnon avec sa propre histoire, une mémoire durable, des selfies et des appels audio ou vidéo.",
      pricing:
        "Aperçu ponctuel de 50 messages, ou 15 dans certaines régions. L’App Store américain affiche {{plans}}. L’offre web peut être moins chère.",
      filter:
        "Pour adultes. Kindroid indique intervenir au niveau du compte en cas de risques graves dans le monde réel.",
      privacy: "Chiffrement au repos et en transit",
      pro: "Appels, messages spontanés, chats de groupe et selfies enrichissent les échanges avec le même compagnon.",
      con: "Une fois l’aperçu ou l’abonnement terminé, le compte passe en lecture seule. La mémoire supplémentaire coûte plus cher.",
      free: "Aperçu ponctuel",
    },
    nomi: {
      bestFor: "un compagnon avec des messages gratuits chaque jour",
      summary:
        "Compagnon avec mémoire à long terme, selfies et chats de groupe. Les offres payantes ajoutent la voix.",
      pricing:
        "50 messages gratuits par jour. Le forfait Standard propose plusieurs durées ({{plans}}).",
      filter:
        "Pour adultes. Nomi décrit les échanges écrits comme non filtrés. Les images ont leurs propres limites.",
      privacy: "Nomi dit ne pas vendre ni louer les données personnelles",
      pro: "Retrouvez le même compagnon au fil du temps ou réunissez-en plusieurs dans un groupe.",
      con: "Les messages gratuits sont plafonnés chaque jour. La voix nécessite un abonnement.",
    },
    venice: {
      bestFor: "les personnages, le chat privé et la création visuelle",
      summary:
        "Venice réunit des personnages, du chat général, plusieurs modèles et de la génération d’images.",
      pricing:
        "Les modèles de base offrent gratuitement 10 demandes de texte et 15 demandes d’image par jour. {{plans}}. Les personnages personnalisés nécessitent Pro.",
      filter:
        "Le filtre pour contenus adultes est activé par défaut. Les abonnés Pro éligibles peuvent le désactiver.",
      privacy: "Historique conservé sur l’appareil par défaut",
      pro: "Personnages et génération d’images dans la même application, avec sauvegarde chiffrée en option sur les offres payantes.",
      con: "L’accès gratuit au texte est limité. Les modèles premium et certaines fonctions multimédias consomment des crédits.",
    },
    nanoGpt: {
      bestFor: "choisir son modèle et payer à l’usage",
      summary:
        "Chat web et API pour différents modèles de texte et de création. Utilisez un préréglage ou vos propres instructions de personnage.",
      pricing:
        "Un modèle web gratuit. Premier dépôt dès 0,10 USD en cryptomonnaie ou 1 USD par carte. {{plans}}. PRO inclut une sélection de modèles ouverts.",
      filter:
        "Pour adultes. Les restrictions varient selon le modèle et le fournisseur.",
      privacy:
        "Historique local par défaut. Politiques variables selon le fournisseur.",
      pro: "Payez à l’usage. L’API fonctionne aussi avec une interface comme SillyTavern.",
      con: "Vous devez apporter votre personnage ou votre interface. La plupart des modèles débitent votre solde.",
    },
  },
  import: {
    title: "Emportez un personnage Character.AI",
    intro:
      "Commencez une nouvelle histoire avec les éléments que son créateur a rendus publics.",
    steps: {
      account: {
        title: "Connectez-vous",
        body: "Le compte gratuit vous permet de modifier le personnage après l’import.",
      },
      create: {
        title: "Ouvrez l’éditeur de personnage",
        body: "Sur la page des compétences, créez une compétence personnalisée et choisissez l’import par lien.",
      },
      paste: {
        title: "Collez le lien public",
        body: "L’import reprend les champs visibles de Character.AI ou Talkie, comme le nom, l’avatar, le premier message et la description. La définition peut suivre si elle est publique.",
      },
      model: {
        title: "Choisissez un modèle",
        body: "Lancez une discussion avec votre copie. Vous pouvez changer de modèle dans le même fil.",
      },
    },
    callout:
      "La copie crédite le créateur et renvoie à l’original. Vos anciens échanges restent sur le service d’origine.",
  },
  privacy: {
    title: "Où passent vos messages",
    intro: "Voici comment fonctionne le mode incognito de {{appName}}.",
    incognito:
      "Le navigateur conserve l’historique. Videz son stockage pour effacer la conversation.",
    transit:
      "Notre service transmet chaque message au fournisseur du modèle hébergé. Nous relevons les crédits utilisés pour la facturation.",
    callout:
      "Pour tout faire en local, associez SillyTavern à un modèle qui tourne sur votre machine.",
  },
  stay: {
    title: "Quand rester sur Character.AI",
    intro:
      "Character.AI convient aux échanges modérés avec des personnages que vous connaissez déjà.",
    library:
      "Vous avez vos personnages favoris et utilisez les appels intégrés.",
    flat: "Les messages standard gratuits et illimités vous importent davantage que le choix du modèle.",
    callout:
      "Gardez Character.AI si ses outils et ses règles cadrent avec vos histoires.",
  },
  faq: {
    title: "Questions fréquentes",
    best: {
      q: "Quelle est la meilleure alternative à Character.AI ?",
      a: "Janitor AI pour le catalogue, SillyTavern pour le contrôle local, Kindroid ou Nomi pour un compagnon régulier. {{appName}} permet d’importer un personnage public et de changer de modèle.",
    },
    free: {
      q: "Existe-t-il une alternative gratuite à Character.AI ?",
      a: "Janitor AI offre le chat standard sans plafond. Nomi offre 50 messages par jour. SillyTavern est gratuit et demande un modèle séparé. {{appName}} donne {{guestCredits}} crédits mensuels en accès invité ou {{freeCredits}} avec un compte gratuit.",
    },
    import: {
      q: "Puis-je transférer mes personnages et mes discussions Character.AI ?",
      a: "Avec un compte gratuit, {{appName}} importe les champs disponibles à partir d’un lien public Character.AI ou Talkie. Les définitions privées et les anciennes discussions restent sur le service d’origine.",
    },
    nsfw: {
      q: "Quelles alternatives acceptent le jeu de rôle adulte à l’écrit ?",
      a: "Janitor AI via Limitless, CrushOn et SpicyChat l’autorisent selon leurs règles. Dans SillyTavern, cela dépend du modèle et de son hébergeur. {{appName}} déverrouille les modèles non censurés après confirmation de la majorité.",
    },
    private: {
      q: "Quelle alternative à Character.AI peut fonctionner en local ?",
      a: "SillyTavern peut tourner avec un modèle local et garder les discussions sur votre machine. Venice et le mode incognito de {{appName}} laissent l’historique sur l’appareil tandis que le fournisseur hébergé traite les messages.",
    },
    account: {
      q: "Puis-je essayer {{appName}} sans compte ?",
      a: "Oui. Utilisez vos crédits invités en mode incognito. Connectez-vous pour importer un personnage ou retrouver vos chats enregistrés sur d’autres appareils.",
    },
    memory: {
      q: "Quelles alternatives conviennent aux longues scènes ?",
      a: "Les fiches d’univers de Chub et SillyTavern rappellent les détails utiles. Kindroid et Nomi misent sur la mémoire du compagnon. Revenez à une scène du début pour voir ce que le modèle a retenu avant de payer.",
    },
    roleplayLink: "Jeu de rôle avec une IA sans filtre",
    kindsLink: "Ce qui distingue les modèles non censurés",
  },
  partners: {
    body: "Vous animez une communauté de jeu de rôle ? Le programme partenaire de {{appName}} verse {{referralPercent}} % de chaque paiement que vous apportez.",
    link: "Voir le programme partenaire",
  },
  cta: {
    title: "Choisissez un modèle et lancez votre scène",
    subtitle:
      "Récupérez {{guestCredits}} crédits gratuits par mois en accès invité.",
    start: "Lancer un jeu de rôle",
    skills: "Parcourir les compétences",
  },
};
