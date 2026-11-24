import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  common: {
    category: "Comparatif",
    breadcrumb: "Plateformes d'IA sans censure comparées",
    backToBlog: "Retour au blog",
    backToHub: "Toutes les plateformes d'IA sans censure",
    updated: "Mis à jour le {{date}}",
    versusImageAlt: "{{appName}} vs {{name}} : comparatif côte à côte",
    kinds: {
      uncensoredChat: "Chat IA sans censure",
      aggregator: "Appli multi-modèles + API",
      router: "Routeur d'API",
      roleplay: "Jeu de rôle avec personnages",
      frontend: "Interface de jeu de rôle (auto-hébergée)",
      companion: "Appli de compagnon IA",
      filteredChat: "Chat de personnages filtré",
      local: "Exécution de modèles en local",
    },
    period: {
      month: "{{plan}} {{price}}/mois",
      quarter: "{{plan}} {{price}}/3 mois",
      year: "{{plan}} {{price}}/an",
      once: "{{plan}} {{price}} en paiement unique",
    },
    free: {
      yes: "Oui",
      no: "Non",
      local: "Gratuit sur votre propre matériel",
    },
    paid: {
      from: "Dès {{price}}",
      payg: "Paiement à l'usage",
      none: "Pas d'offre payante",
    },
    availability: {
      yes: "Oui",
      no: "Non",
      partial: "Limité",
    },
    media: {
      image: "Images",
      video: "Vidéo",
      voice: "Voix",
      partial: "{{name}} (en option)",
      none: "Texte uniquement",
    },
    openSource: {
      yes: "Open source",
      yesSelfHost: "Open source, auto-hébergeable",
      closedLocal: "Appli fermée, tourne en local",
      partial: "Ancienne appli de bureau uniquement",
      no: "Non",
    },
    sourceKinds: {
      home: "Page d'accueil de {{name}}",
      pricing: "Page des tarifs de {{name}}",
      features: "Page des fonctionnalités de {{name}}",
      models: "Liste des modèles de {{name}}",
      privacy: "Politique de confidentialité de {{name}}",
      terms: "Conditions d'utilisation de {{name}}",
      guidelines: "Règles de la communauté de {{name}}",
      api: "Documentation API de {{name}}",
      docs: "Documentation de {{name}}",
      help: "Centre d'aide de {{name}}",
      repo: "Code source de {{name}}",
      blog: "Article de blog de {{name}}",
      appStore: "Fiche App Store de {{name}}",
      paper: "Article de recherche de {{name}}",
    },
    table: {
      platform: "Plateforme",
      kind: "Type",
      free: "Offre gratuite",
      paid: "Payant",
      filter: "Filtre et consentement",
      privacy: "Confidentialité",
      api: "API",
      media: "Médias",
      open: "Open source",
      usLink: "Voir les offres",
      versusLink: "Comparatif complet",
    },
    versus: {
      shortTitle: "La réponse courte",
      tableTitle: "{{appName}} vs {{name}}, côte à côte",
      tableIntro:
        "Les infos sur {{name}} viennent de ses propres pages, vérifiées le {{date}}. Celles sur {{appName}} sont lues en direct dans notre configuration.",
      tableFootnote:
        "Prix catalogue en USD, tirés des pages de {{name}}. Les nôtres sont ceux que vous payez ici au moment de l'achat. Les offres changent : vérifiez les sources ci-dessous avant d'acheter.",
      colAspect: "",
      rows: {
        price: "Prix",
        free: "Offre gratuite",
        models: "Modèles",
        filter: "Filtre et consentement",
        privacy: "Confidentialité",
        api: "API",
        media: "Images, vidéo, voix",
        open: "Open source",
        forWho: "Pour qui",
      },
      priceCell: "{{plans}}. {{note}}",
      apiCell: "{{short}}. {{text}}",
      themTitle: "{{name}} : points forts et points faibles, sans détour",
      usTitle: "{{appName}} : points forts et points faibles, sans détour",
      wins: "Là où {{name}} gagne",
      short: "Là où {{name}} déçoit",
      chooseTitle: "Lequel choisir ?",
      chooseThem: "Choisissez {{name}} si",
      chooseUs: "Choisissez {{appName}} si",
      faqTitle: "FAQ",
      sourcesTitle: "Sources",
      sourcesIntro:
        "Chaque info sur {{name}} dans cette page vient de ces pages, vérifiées le {{date}}. Une info dépassée ? Dites-le-nous, on corrige.",
      ourSources:
        "Nos chiffres viennent de la configuration qui vous facture. Vérifiez-les ici :",
      modelsLink: "Tous les modèles de {{appName}} avec leurs prix en direct",
      pricingLink: "Offres et packs de crédits",
      privacyLink: "Notre politique de confidentialité",
      modelTitle: "{{model}} sur {{appName}}",
      modelIntro:
        "Le modèle maison de {{name}} tourne dans notre sélecteur. Sa page donne le prix par message en direct, la fenêtre de contexte et l'identifiant API.",
      modelPageLink: "{{model}} : prix, contexte et API",
      modelCompareLink: "{{model}} vs {{other}} : face à face",
      moreTitle: "Autres comparatifs",
      ctaSubtitle:
        "{{guestCredits}} crédits gratuits par mois. Sans compte, sans carte. Grand public, open source ou non censuré : vous changez à chaque message.",
      ctaTry: "Lancer un chat incognito",
      ctaModels: "Voir tous les modèles",
    },
  },
  us: {
    kind: "Chat multi-modèles : grand public, open source et non censuré",
    free: "Oui : {{guestCredits}} crédits par mois sans compte, {{freeCredits}} avec un compte",
    paid: "Dès {{subPrice}}/mois",
    filterShort:
      "Vous choisissez le niveau à chaque chat. Non censuré après une confirmation unique de majorité (18+)",
    privacyShort:
      "Les chats incognito restent dans votre navigateur. Les chats privés sont enregistrés sur votre compte",
    apiShort: "Oui, compatible OpenAI et Anthropic (après un achat)",
    mediaShort: "Images, vidéo, musique, voix",
    openShort: "Open source, auto-hébergeable",
    price:
      "Offres : {{planList}} par mois. Les packs de crédits ({{packCredits}} crédits pour {{packPrice}}) rechargent une offre active et n'expirent jamais. Carte, PayPal ou crypto.",
    models:
      "{{modelCount}} modèles de chat issus de {{labCount}} labos : {{mainstream}} grand public, {{open}} open source, {{uncensored}} non censurés. {{refusalsRemoved}} des modèles non censurés sont des modèles grand public ou open source dont on a retiré les refus. {{ownModel}} a sa propre vision du monde : il est entraîné sur des livres et des documents bannis de l'internet grand public.",
    filter:
      "Trois niveaux : grand public, open source, non censuré. Vous choisissez le modèle à chaque message. Les modèles non censurés se débloquent après une confirmation unique de majorité (18+). Aucune couche de refus par-dessus. Les modèles grand public gardent les filtres de leur éditeur.",
    privacy:
      "Les chats incognito vivent dans le stockage local de votre navigateur, pas sur nos serveurs, et fonctionnent sans compte. Les chats privés sont enregistrés sur votre compte. Les médias générés sont stockés sur nos serveurs. Chaque message passe par nous jusqu'au fournisseur du modèle qui répond.",
    api: "API /v1 compatible OpenAI et Anthropic pour le chat, les images, la vidéo et la voix. Elle se débloque avec n'importe quelle offre (dès {{apiSubPrice}} par mois) ou un achat de crédits. Les comptes gratuits reçoivent une erreur HTTP 402.",
    media:
      "{{imageModels}} modèles d'image, {{videoModels}} de vidéo, {{musicModels}} de musique et {{voiceModels}} de voix sur le même solde de crédits, utilisables depuis n'importe quel chat.",
    open: "Toute la plateforme est open source sur GitHub. Hébergez-la sur votre propre matériel.",
    forWho:
      "Ceux qui veulent des modèles grand public, open source et non censurés, plus les médias, dans un seul chat et sur un seul solde, et qui veulent régler le filtre eux-mêmes.",
  },
  links: {
    hub: "Meilleures IA sans censure : le comparatif honnête",
    hubDesc:
      "Venice, NanoGPT, Gab AI, uncensored.ai, OpenRouter, Janitor AI, Character.AI, FreedomGPT, modèles locaux et d'autres : prix, filtres, confidentialité et API, sources à l'appui",
    versus: "{{appName}} vs {{name}}",
    sectionTitle: "Plateformes d'IA sans censure comparées",
    sectionIntro:
      "Venice, NanoGPT, Gab AI, uncensored.ai, OpenRouter, Janitor AI, Character.AI, FreedomGPT et d'autres : prix, filtres et confidentialité tirés de leurs propres pages.",
  },
  platforms: {
    venice: {
      what: "Appli d'IA axée sur la confidentialité, avec un vaste catalogue de modèles, beaucoup de modèles texte non censurés, de la génération d'images, de vidéo et de musique, une API compatible OpenAI et une couche de staking crypto (VVV et DIEM).",
      pricingNote:
        "Gratuit : 10 prompts texte et 15 prompts image par jour, modèles de base uniquement. 100 crédits = 1 $. La vidéo, la musique et les modèles de pointe coûtent des crédits en plus.",
      models:
        "Le catalogue de l’API compte 303 modèles, dont 143 de texte. 17 modèles de texte portent la mention sans censure. Claude, GPT, Gemini et Grok figurent aussi au catalogue.",
      filterShort: "Filtre adulte actif par défaut, Pro peut le couper",
      filter:
        "Le filtre pour adultes est activé par défaut. Les comptes Pro peuvent le désactiver dans les réglages. Les conditions exigent l’accord parental entre 13 et 17 ans et imposent à ces utilisateurs de laisser le filtre activé.",
      privacyShort: "L’historique reste sur ton appareil par défaut",
      privacy:
        "Venice garde l’historique sur ton appareil par défaut. Les offres payantes permettent de le sauvegarder et de le restaurer sous forme chiffrée. En mode Anonymous, Venice conseille de partir du principe que le fournisseur conserve ton contenu. Pro propose aussi, sur certains modèles, le traitement isolé au niveau matériel et le chiffrement de bout en bout.",
      apiShort: "",
      api: "API compatible OpenAI, facturée au token en crédits USD. Le DIEM staké donne 1 $ de crédit API par jour. Paiement à la requête sans compte en USDC via x402.",
      forWho:
        "Les utilisateurs soucieux de leur vie privée qui veulent chat et médias sans censure dans une seule appli, plus les développeurs et les détenteurs de crypto.",
      pro1: "Gros catalogue avec beaucoup de modèles texte non censurés et des prix API bas sur ces modèles.",
      pro2: "Par défaut, l'historique reste sur votre appareil.",
      con1: "Offre gratuite serrée : 10 prompts texte par jour sur les modèles de base.",
      con2: "Il faut Pro pour désactiver le filtre pour adultes. La vidéo, la musique et les modèles premium utilisent des crédits.",
    },
    uncensoredAi: {
      what: "Appli de chat sans censure à modèle unique, avec un forum communautaire et des archives de documents. Web, iOS et Android.",
      pricingNote:
        "Gratuit : 3 réponses par jour. Le prix de Pro est garanti à vie. Carte, Cash App, Apple Pay et Bitcoin. Les crédits API se vendent à part, 0,05 $ par appel.",
      models:
        "Un seul modèle : UncensoredAI v1.2, contexte de 32K, entraîné sur des livres et des documents bannis de l'internet grand public. Ses opinions politiques vont à contre-courant du discours dominant.",
      filterShort: "Aucun filtre décrit, 18+ dans les conditions",
      filter:
        "Se présente comme une plateforme d'IA sans restriction. Les conditions exigent d'avoir 18 ans ou plus et interdisent les contenus destinés à nuire, harceler ou mettre en danger autrui.",
      privacyShort: "Pas utilisé pour l'entraînement, selon sa politique",
      privacy:
        "Sa politique indique que vos données ne servent pas à entraîner ni à améliorer des modèles d'IA. Les messages sont traités par Parasail AI. Pro conserve l'historique des chats, avec recherche et export.",
      apiShort: "",
      api: "API compatible OpenAI, prête à brancher, à 0,05 $ par inférence.",
      forWho:
        "Ceux qui se méfient des récits dominants et veulent des réponses franches sur les sujets qui fâchent.",
      pro1: "L'offre payante la moins chère de cette liste, prix garanti à vie.",
      pro2: "Pas utilisé pour l'entraînement, selon sa politique de confidentialité.",
      con1: "Un seul modèle, contexte de 32K, pas de génération d'images, de vidéo ni de musique.",
      con2: "Offre gratuite limitée à 3 réponses par jour ; la voix, les dossiers et les archives demandent Pro.",
    },
    nanoGpt: {
      what: "Appli web et API à l'usage pour des modèles texte, image, vidéo et audio. Pas d'abonnement obligatoire, offre optionnelle pour les modèles open source.",
      pricingNote:
        "Premier dépôt à partir de 0,10 USD en crypto ou 1 USD par carte, puis 5 USD par carte. La recharge demande une connexion. Le web propose un modèle gratuit. PRO couvre certains modèles de texte et d’image open source à usage personnel. Claude, GPT, Gemini et Grok sont débités du solde.",
      models:
        "L’API publique des modèles de texte renvoie 596 entrées, dont 38 avec uncensored, abliterated ou Dolphin dans leur identifiant. Exemples : Venice Uncensored, GLM 5.3 Uncensored, DeepSeek V4.1 Flash Uncensored et une variante de Kimi K3.1 Pro sans refus.",
      filterShort: "Pas d'interdiction globale du NSFW, 18+",
      filter:
        "Tu dois avoir au moins 18 ans et l’âge légal pour conclure un contrat dans ton pays. Les conditions interdisent le matériel pédopornographique et les contenus intimes ou sexuellement explicites montrant des personnes identifiables sans leur consentement, y compris les deepfakes. Chaque fournisseur peut imposer ses propres restrictions.",
      privacyShort: "L’historique reste dans le navigateur par défaut",
      privacy:
        "L’historique reste par défaut dans le navigateur, avec synchronisation dans le cloud en option. NanoGPT dit ne pas enregistrer les requêtes et réponses lors du traitement ordinaire. La journalisation de l’API et la mémoire du chat sont facultatives. Certains fournisseurs peuvent conserver les requêtes ou les utiliser pour l’entraînement.",
      apiShort: "",
      api: "API compatible avec OpenAI et Anthropic Messages. Paiement sans compte via x402. Tant que la facturation est en cours, certaines réponses indiquent une estimation ou aucun prix.",
      forWho:
        "Les utilisateurs au paiement à l'usage et les développeurs qui veulent tous les modèles, le paiement en crypto et aucun abonnement.",
      pro1: "Liste de modèles immense, prix catalogue, ticket d'entrée à dix centimes.",
      pro2: "Le modèle web gratuit fonctionne sans compte. L’historique reste dans le navigateur par défaut.",
      con1: "L'offre gratuite se limite à un modèle sur le web.",
      con2: "La confidentialité dépend de la route de fournisseur choisie.",
    },
    openRouter: {
      what: "API pour développeurs qui relie une seule clé à des centaines de modèles chez de nombreux fournisseurs, facturée au token sur crédits prépayés.",
      pricingNote:
        "Pas d'abonnement. Prix catalogue des fournisseurs plus 5,5 % de frais sur les achats de crédits. Modèles gratuits : 50 requêtes par jour, 1 000 une fois 10 $ de crédits achetés.",
      models:
        "474 modèles, dont 15 gratuits. Peu d'options sans censure : Venice Uncensored (Dolphin Mistral 24B, hébergé par Venice) et des fine-tunes de jeu de rôle comme Hermes 4 et Magnum. 142 modèles sont marqués comme modérés.",
      filterShort: "Règles des fournisseurs, beaucoup de routes modérées",
      filter:
        "Les conditions exigent d'avoir 18 ans ou plus. OpenRouter filtre les entrées pour détecter les contenus pédocriminels connus. Chaque fournisseur garde la main sur son modèle, et les routes modérées refusent selon la politique de l'éditeur.",
      privacyShort: "Aucun stockage des prompts sans votre accord",
      privacy:
        "OpenRouter affirme ne pas stocker les prompts ni les réponses, sauf si vous l'activez. Les métadonnées sont toujours stockées. Les politiques de journalisation varient selon les fournisseurs.",
      apiShort: "",
      api: "API compatible OpenAI. C'est le produit.",
      forWho:
        "Les développeurs qui veulent une seule clé API pour de nombreux modèles, avec bascule automatique entre fournisseurs.",
      pro1: "Catalogue immense au prix catalogue, sans abonnement.",
      pro2: "Journalisation et entraînement uniquement sur activation.",
      con1: "Peu de modèles non censurés.",
      con2: "Pas pensé comme appli de chat grand public : l'interface, c'est à vous de l'apporter.",
    },
    freedomGpt: {
      what: "Appli d'IA tout-en-un : des modèles grand public à côté de son propre modèle sans censure, Liberty, avec génération d'images et de vidéo. Il existe aussi une ancienne appli de bureau open source pour les modèles hors ligne.",
      pricingNote:
        "Tu peux commencer sans carte ni compte. Pro inclut 2 200 crédits par mois avec des recharges ponctuelles. FreedomGPT estime une réponse premium à 10 crédits, une image à 25 et une vidéo de 5 secondes à 400.",
      models:
        "ChatGPT, Claude, Gemini, Grok, DeepSeek, Qwen, Llama, Mistral et d'autres, plus Liberty et d'autres modèles sans censure dans la même liste. Aucun total publié.",
      filterShort: "Modèles sans censure, soumis au droit US et à l'éthique",
      filter:
        "FreedomGPT indique que tous ses utilisateurs et tous les modèles qu'elle héberge doivent respecter le droit américain, et qu'elle n'autorise pas l'usage de ses modèles à des fins contraires à l'éthique. L'étiquette « sans censure » ne garantit pas une réponse à chaque demande.",
      privacyShort: "Messages partagés avec les fournisseurs d'IA",
      privacy:
        "FreedomGPT envoie les messages et pièces jointes au fournisseur nécessaire pour répondre. Sa politique mobile indique que les fournisseurs ne peuvent utiliser messages, enregistrements et images que pour générer une réponse. Elle ne fixe pas de délai de conservation pour ces données.",
      apiShort: "",
      api: "API sur chat.freedomgpt.com/api/v1 avec une clé du tableau de bord. Tarifs non documentés.",
      forWho:
        "Ceux qui veulent un seul abonnement pour de nombreux modèles, avec des options sans censure.",
      pro1: "Démarrage gratuit, sans compte ni carte.",
      pro2: "Images et vidéo dans la même appli.",
      con1: "Toujours soumis au droit américain et à une règle contre les usages contraires à l'éthique.",
      con2: "L'appli de bureau open source n'a pas été mise à jour depuis juin 2024.",
    },
    gabAi: {
      what: "Plateforme d'IA multi-modèles de Gab : 214 modèles, son propre modèle Arya, un mode agent, génération d'images, de vidéo et de musique, applis de bureau. Positionnement ouvertement chrétien et de droite.",
      pricingNote:
        "Gratuit : 250 crédits après vérification de l'e-mail. Packs de crédits en paiement unique dès 10 $ pour 700 crédits, sans expiration.",
      models:
        "214 modèles sur un seul compte : GPT, Claude, Gemini, DeepSeek, Qwen, Kimi et d'autres. Arya est le modèle maison de Gab, construit autour des valeurs chrétiennes et de principes conservateurs.",
      filterShort: "Libre sur la parole, interdit le contenu sexuel",
      filter:
        "Les conditions exigent d'avoir 18 ans ou plus et interdisent les contenus obscènes, sexuellement explicites ou pornographiques. Des systèmes automatisés peuvent analyser les contenus pour vérifier leur conformité. Libre sur la politique, pas sur les contenus pour adultes.",
      privacyShort: "Chats stockés, utilisés pour améliorer les modèles",
      privacy:
        "Gab conserve vos prompts, ses réponses et votre historique sur ses serveurs, et cite l'amélioration de ses modèles parmi ses finalités. Les requêtes arrivent chez les fournisseurs de modèles via les propres comptes de Gab ; sa politique précise que cela ne rend pas une requête anonyme.",
      apiShort: "",
      api: "API compatible OpenAI et Anthropic. Nécessite une offre Plus.",
      forWho:
        "Les utilisateurs conservateurs et chrétiens qui veulent une IA construite hors des Big Tech.",
      pro1: "Gros catalogue, mode agent et applis de bureau.",
      pro2: "Les packs de crédits n'expirent jamais.",
      con1: "Interdit les contenus sexuellement explicites : aucune aide pour la fiction adulte.",
      con2: "Prompts stockés et utilisés pour améliorer les modèles.",
    },
    janitorAi: {
      what: "Site communautaire de personnages avec des millions de bots créés par les utilisateurs, un modèle gratuit intégré (JLLM) et la possibilité de brancher votre propre modèle via un proxy API.",
      pricingNote:
        "L’App Store américain affiche janitor+ à 12,99 USD par mois ou 99 USD par an. Le centre d’aide indique que les chats gratuits sur les modèles standard sont illimités, avec environ 9 000 jetons de contexte. janitor+ propose cinq fois plus de contexte, des réponses prioritaires et un quota mensuel de nouvelles réponses sur les modèles premium.",
      models:
        "JLLM, son propre modèle gratuit (modèle de base non communiqué). Ou n'importe quel modèle branché via un proxy : son guide officiel utilise OpenRouter.",
      filterShort: "Bots NSFW autorisés s'ils sont étiquetés, 18+ déclaratif",
      filter:
        "Réservé aux adultes, 18+ sur simple déclaration. Les bots sont étiquetés Limited (pas de contenu sexuel) ou Limitless (NSFW autorisé). L'appli mobile démarre en Safe Mode tant que vous n'activez pas le NSFW sur le web. Interdits : tout contenu sexuel impliquant des mineurs, la violence sexuelle, le gore, la zoophilie, les discours de haine.",
      privacyShort: "Chats stockés, utilisés pour la R&D",
      privacy:
        "Les chats sont stockés comme contenu utilisateur et sa politique mentionne la recherche et le développement pour améliorer ses systèmes d'IA. Avec un proxy, vos messages partent aussi chez ce fournisseur, sous sa propre politique.",
      apiShort: "Apportez votre propre clé",
      api: "Pas d'API pour développeurs. Elle consomme des API : vous pouvez apporter votre propre clé via un proxy.",
      forWho:
        "Les rôlistes qui veulent une immense bibliothèque gratuite de personnages communautaires.",
      pro1: "Chat gratuit et illimité avec des millions de bots communautaires.",
      pro2: "Votre propre modèle via un proxy.",
      con1: "Le contexte gratuit tourne autour de 9K tokens : les longues histoires oublient les premières scènes.",
      con2: "Texte uniquement : pas de génération d'images, de vidéo ni de voix.",
    },
    sillyTavern: {
      what: "Interface de chat gratuite et open source (AGPL-3.0) que vous installez vous-même. Fiches de personnage, lorebooks, extensions. Aucun modèle fourni : vous en branchez un.",
      pricingNote:
        "L'appli est gratuite pour toujours. Vous payez l'API que vous branchez, ou rien si vous faites tourner un modèle en local.",
      models:
        "SillyTavern ne fournit aucun modèle. Il se connecte à des moteurs locaux comme KoboldCpp, llama.cpp, Ollama et Oobabooga TextGeneration WebUI, et à des API cloud comme OpenAI, Anthropic et OpenRouter.",
      filterShort: "Aucun filtre maison : le modèle décide",
      filter:
        "Pas de filtre propre. Les limites sont celles qu'impose le modèle ou le fournisseur branché.",
      privacyShort: "Chats stockés sur ton appareil",
      privacy:
        "SillyTavern stocke les chats dans le dossier de données de l’installation locale. Si tu connectes une API ou une extension dans le cloud, elle reçoit les données que tu lui envoies et applique sa propre politique.",
      apiShort: "Se connecte à des API",
      api: "Un client, pas un fournisseur. Il parle à l'API que vous configurez.",
      forWho:
        "Les utilisateurs avancés qui acceptent une courbe d'apprentissage raide en échange d'un contrôle total sur les prompts et les personnages.",
      pro1: "Contrôle maximal : n'importe quel backend, n'importe quel prompt, des extensions riches.",
      pro2: "Gratuit, open source, rien ne quitte votre machine hormis ce que vous envoyez à une API.",
      con1: "Vous l'installez, vous l'entretenez, et vous fournissez le modèle vous-même.",
      con2: "Courbe d'apprentissage raide, de l'aveu même du projet.",
    },
    characterAi: {
      what: "La plus grande plateforme grand public de chat avec personnages, plus de 10 millions de personnages sur ses propres modèles, avec des règles de contenu strictes. Présente ici comme contrepoint filtré.",
      pricingNote:
        "Gratuit : messages illimités avec publicité. c.ai lite réduit la publicité et donne un quota quotidien de messages premium. c.ai+ supprime la pub, ouvre les chats premium en illimité et donne accès à toutes les fonctions de mémoire. Les prix varient selon le pays.",
      models:
        "Character.AI propose ses propres styles de chat. PipSqueak 3 et ShortSqueak sont gratuits. DeepSqueak et LongSqueak sont premium. Tu ne peux pas connecter la clé d’un modèle externe.",
      filterShort: "Filtré, la pornographie ne sera jamais acceptée",
      filter:
        "Le contenu pornographique est contraire à ses conditions et, selon ses propres mots, ne sera accepté à aucun moment à l'avenir. Chaque utilisateur passe une vérification d'âge via Persona. Les utilisateurs identifiés comme mineurs n'ont droit qu'au mode lecture, sans chat.",
      privacyShort:
        "Les chats peuvent entraîner ses modèles et cibler des pubs",
      privacy:
        "Character.AI peut utiliser les chats pour entraîner ses modèles. Le centre d’aide explique comment les utilisateurs de l’EEE et du Royaume-Uni peuvent retirer les nouveaux contenus de cet entraînement.",
      apiShort: "",
      api: "Pas d'API publique pour développeurs.",
      forWho:
        "Le chat de divertissement tout public, avec une bibliothèque de personnages géante.",
      pro1: "Bibliothèque de personnages immense et messages gratuits illimités.",
      pro2: "Entrée bon marché avec lite, appels vocaux avec les personnages.",
      con1: "Aucun contenu adulte, jamais. Les scènes sombres sont adoucies ou refusées.",
      con2: "Les chats peuvent servir à l'entraînement et à la pub. Aucun choix de modèle.",
    },
    kindroid: {
      what: "Appli de compagnon IA : un ami ou partenaire persistant, avec une longue mémoire, des appels vocaux et vidéo, des selfies et des chats de groupe.",
      pricingNote:
        "Aperçu unique de 50 messages, ou 15 dans certaines régions. Ensuite, le compte passe en lecture seule. L’essai séparé de 3 jours demande un moyen de paiement et se transforme en abonnement sans annulation. Ultra et MAX sont des options mensuelles. Prix de l’App Store américain.",
      models:
        "Ember alimente l’aperçu gratuit et l’essai. Les abonnés peuvent choisir Polaris et d’autres modèles maison, dont Reverie. Kindroid a aussi ses propres modèles de selfie.",
      filterShort: "Position sans filtre, lignes rouges au niveau du compte",
      filter:
        "Elle se dit vraiment sans filtre et n'en applique aucun à l'IA elle-même, mais analyse les messages pour quelques lignes rouges, comme un risque imminent d'automutilation ou de violence envers autrui. 18+ : un abonnement payant vaut vérification d'âge, Yoti est l'alternative.",
      privacyShort: "Chiffré au repos, pas de bout en bout",
      privacy:
        "Les chats sont chiffrés au repos et en transit, pas de bout en bout : ses systèmes traitent les contenus et des systèmes de sécurité automatisés les examinent. Elle affirme que les données ne sont jamais vendues.",
      apiShort: "API personnelle vers vos compagnons",
      api: "Clés API personnelles pour parler à vos propres Kindroids, pas une API de modèle générale.",
      forWho:
        "Les adultes qui veulent un compagnon IA sur la durée, avec voix, vidéo et photos.",
      pro1: "Panoplie complète de compagnon : mémoire, selfies, voix et appels vidéo en direct.",
      pro2: "Position sans filtre, pensée pour les adultes.",
      con1: "À la fin de l’aperçu gratuit, il faut un essai ou un abonnement pour continuer à écrire.",
      con2: "Les meilleurs niveaux de mémoire s'empilent : Ultra et MAX en plus de l'offre de base.",
    },
    nomi: {
      what: "Compagnon IA avec mémoire à long terme, selfies, voix, chats de groupe et création de vidéos à partir d’images.",
      pricingNote:
        "Gratuit : 50 messages par jour. Standard débloque les messages illimités et la voix. Prix de l’App Store américain. L’ancien forfait Launch était une offre ponctuelle de la bêta.",
      models:
        "Ses propres modèles de compagnon, dont Cambrian 6 et Solstice. Pas de clé de modèle externe.",
      filterShort: "Texte sans filtre, filtre de nudité sur les images",
      filter:
        "Son site indique que les conversations ne sont pas bridées par des filtres de contenu arbitraires. Les images ont un filtre de nudité, à cause des boutiques d'applis et des prestataires de paiement. Interdit aux moins de 18 ans.",
      privacyShort:
        "Pas de vente de données. La suppression du compte comporte des exceptions.",
      privacy:
        "Nomi dit ne pas vendre ni louer tes données personnelles. Elles sont généralement supprimées sous environ 28 jours après la fermeture du compte. Des exceptions concernent les archives d’entraînement, de communication et les obligations légales. Les données d’entraînement conservées ne te sont plus attribuées.",
      apiShort: "API personnelle vers vos compagnons",
      api: "API REST pour discuter avec vos propres Nomis, pas une API de modèle générale.",
      forWho:
        "Ceux qui veulent un compagnon affectif sur la durée, qui se souvient.",
      pro1: "Une mémoire pensée pour les relations longues.",
      pro2: "Offre gratuite et engagement clair de ne pas vendre vos données.",
      con1: "Filtre de nudité sur les images.",
      con2: "La voix demande un abonnement. Le forfait gratuit limite le chat à 50 messages par jour.",
    },
    crushOn: {
      what: "Site de chat NSFW avec personnages, un interrupteur Unfiltered et un accès aux modèles tiers décompté en crédits.",
      pricingNote:
        "L’offre publique annonce des chats illimités sur les modèles gratuits et 100 crédits mensuels pour les modèles Pro. Les offres annuelles reviennent moins cher. L’accès Ultra dépend de l’abonnement et utilise des crédits séparément des packs Pro.",
      models:
        "Les modèles et les limites de contexte dépendent de l’offre. Le catalogue de CrushOn.AI cite Claude Opus 4.7, GLM 5.3, Gemini 3.1 Pro et DeepSeek V4 Pro dans l’offre Ultra.",
      filterShort: "Interrupteur Unfiltered après vérification d'âge",
      filter:
        "Un interrupteur Unfiltered débloque le texte pour adultes après vérification d'âge : selfie ou pièce d'identité via Didit, AgeGo, ou un paiement de 0,99 $. Ses règles interdisent quand même les images sexuelles explicites, les images réalistes de personnes réelles, les mineurs et les personnages vieillis artificiellement.",
      privacyShort: "Les chats peuvent entraîner ses modèles",
      privacy:
        "Sa politique indique que le contenu des chats peut servir à entraîner ses modèles, sans lien avec des utilisateurs précis. Des cookies servent au reciblage publicitaire.",
      apiShort: "",
      api: "Pas d'API publique pour développeurs.",
      forWho:
        "Les adultes qui veulent du chat épicé avec des personnages, dans une appli prête à l'emploi.",
      pro1: "Jeu de rôle adulte dans une appli soignée, entrée gratuite.",
      pro2: "Une vérification d'âge qui, selon CrushOn, ne lui montre jamais votre photo ni votre pièce d'identité.",
      con1: "Six niveaux de crédits jusqu'à 199,99 $ par mois : coût difficile à prévoir.",
      con2: "Historique gratuit effacé après 7 jours d'inactivité ; les chats peuvent entraîner les modèles.",
    },
    ollama: {
      what: "Outil sous licence MIT pour exécuter des modèles ouverts sur ton ordinateur, avec une API locale et une application de chat officielle pour macOS et Windows. Il propose aussi des modèles cloud payants.",
      pricingNote:
        "Faire tourner des modèles sur votre propre matériel est gratuit et illimité. Les offres payantes ne concernent que ses modèles cloud.",
      models:
        "N'importe quel modèle open source de sa bibliothèque, dont Dolphin 3 et des versions abliterated publiées par la communauté, comme Qwen 3.8 abliterated. Ollama ne vérifie pas les publications communautaires.",
      filterShort: "Celui du modèle que vous chargez",
      filter:
        "En local, c’est le modèle chargé qui décide. Les modèles de la communauté obtenus par ablitération visent à réduire les refus. Le service cloud a ses propres conditions.",
      privacyShort: "100 % local, les prompts ne quittent jamais votre machine",
      privacy:
        "Ollama dit ne pas voir les requêtes et réponses traitées en local. Tu peux désactiver le cloud. Sa politique indique que les requêtes et réponses cloud sont traitées temporairement et ne servent pas à l’entraînement. Ollama collecte certaines métadonnées.",
      apiShort: "",
      api: "Serveur compatible OpenAI sur localhost:11434, plus une API cloud pour ses modèles hébergés.",
      forWho:
        "Les développeurs et profils techniques avec une machine solide, souvent associé à une interface de chat.",
      pro1: "Confidentialité totale et zéro coût par message.",
      pro2: "Bibliothèque immense, API locale compatible OpenAI.",
      con1: "Votre matériel plafonne la qualité : un modèle 70B pèse 43 Go à télécharger, avant même le contexte.",
      con2: "L’application de chat officielle existe pour macOS et Windows. Sous Linux, utilise la ligne de commande, l’API ou une autre interface.",
    },
    lmStudio: {
      what: "Appli de bureau à l'interface soignée pour télécharger et faire tourner des modèles en local (GGUF et MLX), plus un serveur API local.",
      pricingNote:
        "Les modèles locaux sont gratuits pour un usage personnel ou professionnel. Bionic+ et Pro ajoutent le traitement cloud, la recherche web et des limites d’appareils plus élevées. L’offre gratuite comprend la transcription hors ligne et LM Link pour cinq appareils au maximum.",
      models:
        "Exécute en local des modèles GGUF ou MLX de Hugging Face, dont Dolphin et des variantes communautaires aux refus réduits. Le catalogue cloud inclut Kimi K3.1 Pro, DeepSeek V4 Pro et GLM-5.3.",
      filterShort: "Celui du modèle que vous chargez",
      filter:
        "Aucun filtre propre pour les modèles locaux. Ce qui refuse, c'est le modèle que vous choisissez.",
      privacyShort: "L'inférence locale reste sur votre appareil",
      privacy:
        "Les modèles locaux tournent sur votre appareil. Ses services hébergés revendiquent zéro conservation des données.",
      apiShort: "",
      api: "Serveur compatible OpenAI sur localhost:1234.",
      forWho:
        "Ceux qui ne codent pas et veulent des modèles locaux sans ligne de commande, sur un Mac Apple Silicon, Windows ou Linux.",
      pro1: "Le moyen le plus simple de faire tourner des modèles non censurés en local.",
      pro2: "Gratuit, usage commercial compris.",
      con1: "L'appli elle-même est propriétaire. Pas de Mac Intel.",
      con2: "Même plafond matériel que n'importe quelle installation locale.",
    },
  },
  hub: {
    meta: {
      title: "Meilleure IA sans censure 2026 : le comparatif honnête",
      category: "Comparatif",
      description:
        "{{count}} plateformes d'IA sans censure comparées : Venice, NanoGPT, Janitor AI, FreedomGPT, Kindroid, modèles locaux et d'autres. Prix, filtres, confidentialité, API. Sources citées.",
      imageAlt: "Plateformes d'IA sans censure comparées côte à côte",
      keywords:
        "IA sans censure, meilleure IA sans censure, IA non censurée, chat IA sans filtre, IA sans filtre, IA NSFW, chat IA NSFW, alternative Venice AI, avis Venice.ai, NanoGPT, alternative à Janitor AI, Janitor AI alternative, alternative à Character AI, FreedomGPT, Gab AI, uncensored.ai, Kindroid, Nomi, CrushOn AI, SillyTavern, Ollama sans censure, LM Studio sans censure, modèles abliterated, best uncensored AI, uncensored AI chat, {{appName}}",
    },
    hero: {
      category: "Comparatif",
      readTime: "14 min de lecture",
      title: "Meilleures IA sans censure en 2026 : le comparatif honnête",
      subtitle:
        "{{count}} plateformes, plus nous. Les vrais prix tirés de leurs propres pages tarifs, la façon dont chacune filtre, ce que deviennent vos chats et pour qui chacune est faite. Chaque info a sa source.",
    },
    intro: {
      lead: "Chaque site d'IA sans censure se dit le plus privé, le plus libre, le moins filtré. La moitié interdit pourtant les contenus pour adultes. Certains s'entraînent sur vos chats. L'un d'eux vous vend un jeton crypto. Les pages marketing ne vous diront pas lesquels.",
      p2: "Nous avons consulté les tarifs, politiques et documentations officielles. Dernières vérifications le {{date}}. Chaque fiche indique sa date et ses sources.",
      disclosure:
        "Transparence : {{appName}} fait partie des plateformes de cette page, et nous achetons chez plusieurs des autres. Venice, uncensored.ai, NanoGPT, FreedomGPT, Gab AI et OpenRouter servent une partie de nos modèles via leurs API. Nous disons où, chiffres en direct à l'appui. Pas de notes, pas d'étoiles : des faits et des sources, à vous de juger.",
    },
    picks: {
      title: "Choix rapides : la meilleure IA sans censure pour chaque usage",
      intro: "Aucune plateforme ne gagne sur tout. Partez de votre besoin.",
      oneApp: {
        title: "Tout dans un seul chat : {{appName}}",
        body: "{{modelCount}} modèles, dont {{uncensored}} non censurés, à côté de Claude, GPT et Gemini. Images, vidéo, musique et voix sur le même solde. Vous changez de modèle à chaque message.",
      },
      ownWorldview: {
        title:
          "Une autre vision du monde, pas juste moins de refus : le modèle d'uncensored.ai",
        body: "La plupart des modèles non censurés sont des modèles grand public dont on a retiré les refus. uncensored.ai vend un seul modèle, avec ses propres positions. Sur {{appName}}, il tourne sous le nom {{ownModel}}, à côté de tout le reste.",
      },
      privacy: {
        title: "Historique dans le navigateur : Venice ou NanoGPT",
        body: "Les deux conservent l’historique sur ton appareil par défaut. Le modèle web gratuit de NanoGPT fonctionne sans compte. Sur {{appName}}, l’historique incognito reste dans le navigateur.",
      },
      roleplay: {
        title:
          "Jeu de rôle avec personnages communautaires : Janitor AI ou SillyTavern",
        body: "Janitor AI pour une immense bibliothèque de bots gratuits. SillyTavern si vous voulez un contrôle total et acceptez de tout installer vous-même.",
      },
      companions: {
        title: "Un compagnon IA sur la durée : Kindroid ou Nomi",
        body: "Mémoire, selfies, appels vocaux. Kindroid n'a pas d'offre gratuite durable ; Nomi en a une, mais filtre la nudité sur les images.",
      },
      developers: {
        title:
          "Une API pour modèles non censurés : NanoGPT, Venice ou OpenRouter",
        body: "NanoGPT et Venice proposent beaucoup de modèles non censurés à bas prix par token. OpenRouter a le catalogue le plus large, mais peu d'options sans censure.",
      },
      local: {
        title:
          "Confidentialité totale, zéro coût par message : Ollama ou LM Studio",
        body: "Faites tourner des modèles abliterated sur votre propre machine. Rien n'en sort. Votre matériel fixe le plafond de qualité.",
      },
      filtered: {
        title: "Vous voulez le filtre : Character.AI",
        body: "Chat filtré avec contrôle de l’âge. Les comptes des moins de 18 ans peuvent uniquement lire.",
      },
    },
    table: {
      title: "Les {{count}} plateformes et {{appName}}, côte à côte",
      intro:
        "Sur mobile, fais défiler horizontalement. Dernières vérifications le {{date}}. La date de chaque plateforme figure sur sa fiche. Nos données viennent de la configuration actuelle.",
      footnote:
        "Les prix sont les tarifs publics américains. Pour Kindroid, Nomi et janitor+, nous utilisons les fiches de l’App Store américain. Taxes, prix régionaux et promotions varient. Limité peut désigner une API personnelle, une clé externe ou un module complémentaire.",
    },
    kinds: {
      title:
        "« Sans censure » ne veut pas dire une seule chose : quatre façons de filtrer",
      intro:
        "Avant de comparer les plateformes, sachez ce que cache l'étiquette. Le modèle pèse plus que l'appli.",
      abliterated:
        "Abliterated : un modèle grand public ou open source dont on a retiré la direction de refus dans les poids. Des chercheurs ont montré que le refus tient dans une seule direction à l'intérieur du modèle ; coupez-la et le modèle cesse de dire non. Mêmes connaissances, même vision du monde, plus d'esquive.",
      finetuned:
        "Fine-tunes décensurés (Dolphin, Venice Uncensored) : réentraînés sur des données sans refus. Même idée, autre méthode.",
      ownWorldview:
        "Vision du monde propre : {{ownModel}} est entraîné sur des livres et des documents bannis de l'internet grand public. Il ne se contente pas d'arrêter de refuser : il défend des positions que les modèles grand public ne vous donneront pas.",
      filtered:
        "Filtré : les modèles grand public et les applis comme Character.AI. Une couche de sécurité tranche avant même que vous tapiez. Sur la plupart des plateformes « sans censure », les modèles grand public gardent aussi les filtres de leur éditeur.",
      tradeoff:
        "Le revers : l'étude sur l'abliteration a elle-même mesuré une baisse de qualité sur tous les benchmarks, en partie compensée par un entraînement supplémentaire. Les modèles non censurés sont en général plus petits que les modèles de pointe. Utilisez-les pour ce que le filtre bloque, pas pour vos raisonnements les plus durs.",
      sourceName: "Abliteration",
    },
    platforms: {
      title: "Chaque plateforme en détail",
      intro:
        "Ce que chaque plateforme propose, coûte et filtre. Dernières vérifications le {{date}}. Chaque fiche indique sa date et ses sources.",
      price: "Prix : {{plans}}. {{note}}",
      models: "Modèles : {{text}}",
      filter: "Filtre et consentement : {{text}}",
      privacy: "Confidentialité : {{text}}",
      api: "API : {{short}}. {{text}}",
      media: "Médias : {{text}}",
      open: "Open source : {{text}}",
      forWho: "Pour qui : {{text}}",
      strengths: "Points forts",
      limits: "Limites",
      sources: "Sources, vérifiées le {{date}}",
    },
    upstream:
      "{{appName}} fait tourner {{models}} modèles via l'API de {{name}} (dont {{uncensored}} non censurés), notamment {{examples}}. Mêmes modèles, notre chat, notre facturation.",
    us: {
      title: "La place de {{appName}}, honnêtement",
      intro:
        "Nous ne sommes pas un labo de modèles. Nous sommes le chat qui réunit tous les types de modèles au même endroit et vous laisse choisir le filtre.",
      models:
        "{{modelCount}} modèles de chat issus de {{labCount}} labos : {{mainstream}} grand public, {{open}} open source, {{uncensored}} non censurés. Vous choisissez le modèle à chaque message : un même fil peut mêler Claude et un modèle abliterated.",
      upstream:
        "Nos modèles non censurés viennent de fournisseurs présents sur cette page. Venice sert {{veniceModels}} de nos modèles, NanoGPT {{nanoGptModels}}, uncensored.ai {{uncensoredAiModels}}, FreedomGPT {{freedomGptModels}}, Gab AI {{gabAiModels}}. Nous agrégeons, nous n'entraînons pas.",
      consent:
        "Les modèles non censurés se débloquent après une confirmation unique de majorité (18+). Aucune couche de refus par-dessus. Ce sont les humains qui décident de ce qu'ils lisent, pas une entreprise.",
      privacy:
        "Les chats incognito vivent dans votre navigateur, pas sur nos serveurs, et ne demandent aucun compte. Les chats privés se synchronisent avec votre compte. Chaque message passe quand même par nous jusqu'au fournisseur qui répond.",
      pricing:
        "{{guestCredits}} crédits gratuits par mois sans compte, {{freeCredits}} avec un compte. Offres : {{planList}} par mois. Les packs de crédits rechargent une offre active et n'expirent jamais. Carte, PayPal ou crypto.",
      api: "API compatible OpenAI et Anthropic pour le chat, les images, la vidéo et la voix, après n'importe quelle offre (dès {{apiSubPrice}}) ou un achat de crédits.",
      media:
        "{{imageModels}} modèles d'image, {{videoModels}} de vidéo, {{musicModels}} de musique et {{voiceModels}} de voix sur le même solde.",
      open: "Toute la plateforme est open source. Auto-hébergez-la si vous ne voulez aucun intermédiaire.",
      weakTitle: "Là où nous ne sommes pas le meilleur choix",
      weak1:
        "Prix au token : nous ajoutons {{markup}} % au coût des fournisseurs. Si vous ne voulez que les modèles d'un seul fournisseur, passer directement par Venice ou NanoGPT coûte moins cher.",
      weak2:
        "Bibliothèque de personnages : Janitor AI et Character.AI comptent des millions de bots communautaires. La nôtre est bien plus petite, même si vous pouvez importer des personnages depuis des liens Character.AI et Talkie.",
      weak3:
        "Fonctions de compagnon : pas de selfies ni d'appels vidéo en direct comme chez Kindroid ou Nomi. Nous sommes un espace de travail conversationnel, pas une appli de compagnon.",
      weak4:
        "Confidentialité totale : un modèle local sur votre propre machine bat n'importe quel service hébergé, nous compris.",
      modelsLink: "Voir les {{modelCount}} modèles avec leurs prix en direct",
      pricingLink: "Offres et crédits gratuits",
      guideLink: "Guide : chaque modèle non censuré et ce qu'il fait de mieux",
    },
    versus: {
      title: "Comparatifs face à face",
      intro:
        "Les {{versusCount}} plateformes avec lesquelles on nous compare le plus, chacune sur sa propre page avec points forts, points faibles et un choix clair.",
    },
    method: {
      title: "Notre méthode",
      intro: "Notre méthode. Dernière vérification des sources le {{date}}.",
      sources:
        "Pages officielles uniquement : page tarifs, conditions, politique de confidentialité, centre d'aide, doc API ou liste de modèles de chaque plateforme. Aucun site d'avis n'a servi de source.",
      prices:
        "Prix catalogue en USD, tels qu'affichés le jour de la vérification. Quand un prix se cache derrière une connexion, nous avons utilisé la fiche officielle de l'app store et nous le précisons.",
      noScores:
        "Pas de notes, pas d'étoiles, pas de badge du gagnant. Des usages différents demandent des plateformes différentes.",
      us: "Nos propres chiffres (modèles, prix, crédits gratuits) sont lus en direct dans la configuration qui vous facture : ils ne peuvent pas s'écarter de ce que vous payez.",
      bias: "Nous sommes concurrent et client de plusieurs plateformes de cette page. Nous disons où nous passons par elles et listons les cas où vous devriez choisir quelqu'un d'autre.",
      changes:
        "Les offres et les politiques changent. Chaque fiche renvoie à ses sources : vérifiez-les avant d'acheter. Quand une page ne disait rien sur un point, nous l'avons laissé de côté plutôt que de deviner.",
      corrections:
        "Un prix dépassé ou une affirmation fausse ? Envoyez-nous le lien vers la source et nous corrigeons.",
      correctionsLink: "Nous contacter",
    },
    faq: {
      title: "FAQ",
      best: {
        q: "Quelle est la meilleure IA sans censure ?",
        a: "Ça dépend de l'usage. Pour de nombreux modèles plus les médias dans un seul chat : {{appName}}. Pour un chat axé sur la confidentialité : Venice ou NanoGPT. Pour le jeu de rôle communautaire : Janitor AI ou SillyTavern. Pour un compagnon : Kindroid ou Nomi. Pour une confidentialité totale : un modèle local avec Ollama ou LM Studio.",
      },
      free: {
        q: "Existe-t-il une IA sans censure gratuite ?",
        a: "Oui, avec des limites. Venice donne 10 prompts texte par jour, uncensored.ai 3 réponses, Janitor AI un chat illimité sur son propre modèle, CrushOn 100 crédits par mois, {{appName}} {{guestCredits}} crédits par mois sans compte. Les modèles locaux avec Ollama ou LM Studio ne coûtent rien par message.",
      },
      private: {
        q: "Quelle IA sans censure protège le mieux votre vie privée ?",
        a: "Le traitement local garde les chats sur ton ordinateur. Venice et NanoGPT conservent l’historique sur ton appareil par défaut. Le modèle web gratuit de NanoGPT fonctionne sans compte. Sur {{appName}}, l’historique incognito reste dans le navigateur. Les services hébergés envoient les requêtes au modèle qui répond.",
      },
      difference: {
        q: "Quelle différence entre modèles abliterated et modèles non censurés ?",
        a: "Les modèles abliterated sont des modèles grand public ou open source dont on a coupé la direction de refus dans les poids : mêmes connaissances, même vision du monde, plus de refus. Les fine-tunes comme Dolphin y arrivent par réentraînement. {{ownModel}} est encore autre chose : entraîné sur des livres et des documents bannis de l'internet grand public, avec ses propres positions.",
      },
      veniceVs: {
        q: "Venice AI est-elle vraiment sans censure ?",
        a: "Ses modèles non censurés le sont, et son filtre adulte reste actif par défaut jusqu'à ce qu'un abonné Pro le coupe. Ses modèles grand public (Claude, GPT, Gemini) gardent les filtres de leur éditeur, comme partout ailleurs.",
      },
      characterAi: {
        q: "Existe-t-il un Character.AI sans filtre ?",
        a: "Pas chez Character.AI : la plateforme affirme que le contenu pornographique ne sera jamais accepté. Alternatives avec jeu de rôle adulte : Janitor AI (bots Limitless), CrushOn (interrupteur Unfiltered), Kindroid, SillyTavern avec un modèle non censuré, ou {{appName}} avec ses modèles de jeu de rôle non censurés.",
      },
      gabAi: {
        q: "Gab AI est-elle sans censure ?",
        a: "Sur la politique, la culture et la foi, oui : son modèle maison Arya est fait pour ça. Sur les contenus pour adultes, non : ses conditions interdisent les contenus sexuellement explicites. {{appName}} propose Arya aussi, à côté de modèles non censurés qui autorisent la fiction adulte.",
      },
      uncensoredAi: {
        q: "Quelle différence entre uncensored.ai et les autres IA sans censure ?",
        a: "La plupart des IA sans censure sont des modèles grand public dont on a retiré les refus. Le modèle d'uncensored.ai est entraîné sur des livres et des documents bannis de l'internet grand public : ses opinions politiques vont donc à contre-courant du discours dominant. Sur {{appName}}, il tourne sous le nom {{ownModel}}.",
      },
      openRouter: {
        q: "OpenRouter propose-t-il des modèles non censurés ?",
        a: "Quelques-uns : Venice Uncensored et des fine-tunes de jeu de rôle comme Hermes 4 et Magnum, et 142 de ses 474 modèles sont marqués comme modérés. Pour plus de choix sans censure dans une seule API, NanoGPT, Venice et {{appName}} en proposent bien davantage.",
      },
      local: {
        q: "Puis-je faire tourner une IA sans censure sur mon propre ordinateur ?",
        a: "Oui. Ollama ou LM Studio, plus un modèle abliterated ou Dolphin. Un modèle 8B pèse 5 Go à télécharger et tourne sur un portable classique. Un modèle 70B demande plus de 40 Go de mémoire. Votre matériel plafonne la qualité.",
      },
      legal: {
        q: "Est-ce légal d'utiliser une IA sans censure ?",
        a: "L'utiliser est légal dans la plupart des pays. Ce que vous générez et publiez reste soumis à la loi de votre pays. Toutes les plateformes de cette page interdisent les contenus impliquant des mineurs, et la plupart interdisent les images non consenties de personnes réelles.",
      },
    },
    cta: {
      title: "Testez-la sur vos propres prompts",
      subtitle:
        "{{guestCredits}} crédits gratuits par mois, sans compte. Posez la question qu'on vous a refusée ailleurs, et comparez.",
      try: "Lancer un chat incognito",
      models: "Voir tous les modèles",
    },
  },
  versus: {
    venice: {
      meta: {
        title: "Alternative Venice AI : {{appName}} vs Venice, comparatif 2026",
        description:
          "{{appName}} vs Venice.ai : prix, modèles non censurés, filtre adulte, confidentialité et API côte à côte. Nous achetons chez Venice, alors nous disons précisément où chacun gagne.",
        keywords:
          "alternative Venice AI, alternative à Venice AI, Venice AI avis, Venice AI prix, Venice Pro, Venice sans censure, Venice AI est-elle sans censure, filtre adulte Venice AI, Venice AI API, VVV DIEM, chat IA sans censure, IA non censurée, Venice AI alternative, Venice.ai vs, {{appName}} vs Venice",
      },
      hero: {
        title: "{{appName}} vs Venice AI",
        subtitle:
          "Deux plateformes d'IA sans censure, dont l'une achète chez l'autre. Prix, filtres, confidentialité et API, côte à côte.",
        readTime: "7 min de lecture",
      },
      intro: {
        lead: "Venice est le nom le plus connu de l'IA privée et sans censure. Beaucoup de nos modèles non censurés tournent sur l'API de Venice. Ce n'est donc pas un démolissage. C'est la réponse honnête à une seule question : faut-il utiliser Venice directement, ou via {{appName}} ?",
        p2: "Infos sur Venice tirées de ses pages tarifs, confidentialité et documentation, vérifiées le {{date}}. Les nôtres sont lues en direct dans notre configuration.",
      },
      relation:
        "Nous sommes client de Venice : {{veniceModels}} de nos modèles passent par l'API de Venice (dont {{veniceUncensored}} non censurés), notamment {{veniceExamples}}. Mêmes modèles, autre appli autour.",
      verdict:
        "Choisissez Venice si vous voulez son catalogue complet, un historique uniquement local et le prix au token le plus bas sur ses propres modèles, et que payer Pro pour couper le filtre adulte ne vous gêne pas. Choisissez {{appName}} si vous voulez les modèles non censurés de Venice à côté de Claude, GPT, du modèle d'uncensored.ai et de versions abliterated de GLM et DeepSeek venues d'autres fournisseurs, dans un seul chat, sans filtre à débloquer au-delà d'une confirmation unique de majorité (18+).",
      themPros: {
        a: "303 modèles dans le catalogue de l’API, dont la vidéo, la musique et la voix.",
        b: "L'historique reste sur votre appareil par défaut. Un vrai point fort côté confidentialité.",
        c: "Le moyen le moins cher d'appeler les modèles de Venice : pas de marge d'intermédiaire, plus le staking DIEM pour du crédit API quotidien.",
      },
      themCons: {
        a: "Offre gratuite : 10 prompts texte par jour, modèles de base uniquement.",
        b: "Le filtre adulte est actif par défaut. Le couper demande Pro.",
        c: "Uniquement la gamme de Venice : pas de modèle uncensored.ai, aucun modèle de fournisseurs que Venice n'héberge pas.",
      },
      usPros: {
        a: "Les modèles non censurés de Venice, plus ceux de NanoGPT, uncensored.ai, FreedomGPT et Gab AI, dans un seul sélecteur de modèles.",
        b: "Pas de filtre adulte à racheter : une confirmation unique de majorité (18+) débloque tous les modèles non censurés, même sur l'offre gratuite.",
        c: "{{guestCredits}} crédits gratuits par mois sans compte, et toute la plateforme est open source.",
      },
      usCons: {
        a: "Sur les modèles de Venice, nous coûtons plus cher : notre marge de {{markup}} % s'ajoute au prix de Venice.",
        b: "Catalogue globalement plus petit que celui de Venice.",
        c: "Nous stockons les chats privés pour les synchroniser. L’historique incognito reste dans ton navigateur. Venice garde l’historique en local par défaut et propose des sauvegardes chiffrées dans ses offres payantes.",
      },
      chooseThem: {
        a: "Vous voulez le plus gros catalogue non censuré chez un seul fournisseur.",
        b: "Vous détenez du VVV, ou voulez en staker, pour du crédit API.",
        c: "Vous appelez les modèles de Venice par API et chaque centime par token compte.",
      },
      chooseUs: {
        a: "Vous voulez des modèles que Venice ne propose pas, comme {{ownModel}}, dans le même chat.",
        b: "Vous voulez du non censuré sans payer une offre pour retirer un filtre.",
        c: "Vous voulez un logiciel open source et auto-hébergeable, et un seul solde pour le chat, les images, la vidéo et la musique.",
      },
      both: "Utiliser les deux est courant. Venice pour son catalogue, {{appName}} quand vous voulez comparer la réponse de Venice à celle du modèle non censuré d'un autre fournisseur, dans le même fil.",
      switch: {
        title: "Quitter Venice",
        body: "Rien à migrer côté modèles : Venice Uncensored et les autres modèles de Venice sont dans notre sélecteur, sous les mêmes noms. Lancez un chat incognito, choisissez un modèle Venice et reprenez là où vous en étiez. Collez l'ancien contexte dans le premier message si besoin.",
      },
      faq: {
        q1: {
          q: "{{appName}}, c'est la même chose que Venice ?",
          a: "Non. Nous sommes une plateforme distincte et open source. Une partie de nos modèles tourne sur l'API de Venice, les autres viennent de NanoGPT, uncensored.ai, FreedomGPT, Gab AI, OpenRouter et des grands labos.",
        },
        q2: {
          q: "Venice AI est-elle gratuite ?",
          a: "Le compte gratuit donne droit à 10 demandes de texte et 15 d’images par jour sur les modèles de base. Pro inclut le texte illimité, jusqu’à 1 000 images par jour sur les modèles Pro et la désactivation du filtre pour les adultes.",
        },
        q3: {
          q: "Venice est-elle moins chère que {{appName}} ?",
          a: "Pour les modèles de Venice, oui : nous ajoutons {{markup}} % au coût des fournisseurs. Pour mêler des modèles de plusieurs fournisseurs dans une seule appli, nous vous évitons des abonnements séparés.",
        },
        q4: {
          q: "Qui protège le mieux votre vie privée, Venice ou {{appName}} ?",
          a: "Venice garde l’historique sur ton appareil par défaut et propose une sauvegarde chiffrée dans ses offres payantes. {{appName}} garde l’historique incognito dans le navigateur et enregistre les chats privés pour les synchroniser. Les deux services transmettent les messages au modèle qui répond.",
        },
      },
      cta: { title: "Essayez les modèles de Venice à côté de tout le reste" },
    },
    characterAi: {
      meta: {
        title: "Alternative à Character AI sans filtre : {{appName}} vs C.AI",
        description:
          "{{appName}} vs Character.AI : filtres, vérification d'âge, modèles, confidentialité et prix. Quand Character.AI est le bon choix, et quand il vous faut une alternative sans censure.",
        keywords:
          "alternative à Character AI, alternative Character AI sans filtre, Character AI sans filtre, filtre Character.AI, prix c.ai+, Character AI NSFW, vérification d'âge Character AI, IA de personnages sans censure, jeu de rôle IA sans filtre, IA NSFW, Character AI alternative, {{appName}} vs Character.AI",
      },
      hero: {
        title: "{{appName}} vs Character.AI : l'alternative sans filtre",
        subtitle:
          "La plus grande plateforme de chat avec personnages face à une plateforme ouverte et sans censure. Ce que chacune autorise, ce que chacune coûte, où vont vos chats.",
        readTime: "7 min de lecture",
      },
      intro: {
        lead: "Character.AI a la plus grande bibliothèque de personnages d'internet, et un filtre qui ne bougera pas. Son propre centre d'aide affirme que le contenu pornographique ne sera accepté à aucun moment à l'avenir. Si c'est rédhibitoire pour vous, il vous faut une autre plateforme, pas un jailbreak.",
        p2: "Infos sur Character.AI tirées de ses pages abonnement, centre d'aide et confidentialité, vérifiées le {{date}}. Les nôtres sont lues en direct dans notre configuration.",
      },
      relation:
        "Aucune relation commerciale avec Character.AI. Vous pouvez ramener un personnage : collez son lien Character.AI et {{appName}} l'importe comme skill.",
      verdict:
        "Choisissez Character.AI pour du divertissement tout public avec des millions de personnages prêts à l'emploi, gratuit et illimité, ou pour toute personne de moins de 18 ans. Choisissez {{appName}} si le filtre casse sans cesse votre histoire : des modèles de jeu de rôle non censurés après une confirmation unique de majorité (18+), le choix du modèle à chaque message, et des chats qui ne servent à entraîner les modèles de personne.",
      themPros: {
        a: "Des millions de personnages communautaires, prêts à discuter.",
        b: "Messages gratuits illimités, offres payantes bon marché.",
        c: "Appels vocaux avec les personnages.",
      },
      themCons: {
        a: "Aucun contenu adulte, jamais, et les scènes sombres sont adoucies.",
        b: "Les chats peuvent servir à l’entraînement. Le centre d’aide explique comment exclure les nouveaux contenus dans l’EEE et au Royaume-Uni.",
        c: "Uniquement ses propres modèles. Aucun choix, pas de clé personnelle.",
      },
      usPros: {
        a: "{{uncensored}} modèles non censurés, dont plusieurs conçus pour le jeu de rôle. Les scènes vont là où l'histoire les mène.",
        b: "Choisissez le modèle à chaque message : un modèle de jeu de rôle non censuré pour la scène, un modèle de pointe pour la préparer.",
        c: "Les chats incognito restent dans votre navigateur. Nous n'entraînons aucun modèle sur vos chats.",
      },
      usCons: {
        a: "Bien moins de personnages prêts à l'emploi. Vous importez ou écrivez les vôtres.",
        b: "Des crédits décomptés au lieu de messages gratuits illimités.",
        c: "Pas d'appels vocaux avec les personnages.",
      },
      chooseThem: {
        a: "Vous voulez un chat tout public avec une bibliothèque de personnages géante.",
        b: "Le mode lecture suffit à un lecteur de moins de 18 ans.",
        c: "Vous voulez des messages gratuits illimités sans jamais penser au coût.",
      },
      chooseUs: {
        a: "Le filtre casse sans cesse votre jeu de rôle.",
        b: "Vous voulez choisir le modèle, pas qu'on vous en impose un.",
        c: "Vous voulez que vos chats restent hors de l'entraînement et du ciblage publicitaire.",
      },
      both: "Beaucoup gardent Character.AI pour le chat léger et amènent ici les histoires qui demandent un modèle adulte, avec l'import pour emmener le personnage.",
      switch: {
        title: "Ramener un personnage de Character.AI",
        body: "Copiez le lien Character.AI du personnage, collez-le dans l'import de skills de {{appName}} : le nom, le message d'accueil et la définition suivent, dans la mesure où le personnage les rend publics. Choisissez ensuite un modèle de jeu de rôle non censuré et poursuivez l'histoire.",
      },
      faq: {
        q1: {
          q: "Character.AI autorise-t-il le NSFW ?",
          a: "Non. Son centre d'aide indique que le contenu pornographique est contraire à ses conditions et ne sera accepté à aucun moment à l'avenir.",
        },
        q2: {
          q: "Character.AI exige-t-il une vérification d'âge ?",
          a: "Oui. Les utilisateurs passent une vérification d'âge avec Persona. Ceux identifiés comme mineurs n'ont droit qu'au mode lecture, sans chat.",
        },
        q3: {
          q: "{{appName}} est-elle une alternative à Character.AI sans filtre ?",
          a: "Oui, pour les adultes. Les modèles non censurés se débloquent après une confirmation unique de majorité (18+), et plusieurs sont conçus pour le jeu de rôle. Les modèles grand public gardent les filtres de leur éditeur : choisissez un modèle non censuré pour les scènes adultes.",
        },
        q4: {
          q: "Puis-je importer mes personnages Character.AI ?",
          a: "Oui : collez le lien du personnage dans l'import de skills. Ce qui est importé dépend de ce que le créateur a rendu public sur Character.AI.",
        },
      },
      cta: { title: "Poursuivez l'histoire sans le filtre" },
    },
    janitorAi: {
      meta: {
        title: "Alternative à Janitor AI : {{appName}} vs Janitor AI (2026)",
        description:
          "{{appName}} vs Janitor AI : JLLM contre {{modelCount}} modèles, limites de contexte, règles NSFW, proxys, confidentialité et prix. Points forts et faibles, sans détour, pour le jeu de rôle.",
        keywords:
          "alternative à Janitor AI, Janitor AI alternative, Janitor AI vs, JanitorAI, prix janitor+, JLLM, proxy Janitor AI, Janitor AI OpenRouter, limite de contexte Janitor AI, jeu de rôle IA NSFW, IA NSFW, IA de jeu de rôle sans censure, chat IA sans filtre, {{appName}} vs Janitor AI",
      },
      hero: {
        title: "{{appName}} vs Janitor AI",
        subtitle:
          "La plus grande communauté de jeu de rôle gratuite face à un chat multi-modèles sans censure. Modèles, mémoire, règles, prix.",
        readTime: "6 min de lecture",
      },
      intro: {
        lead: "Janitor AI a gagné le jeu de rôle sur deux points : des millions de bots communautaires et un modèle gratuit. Le hic apparaît dans les longues histoires. Le contexte gratuit tourne autour de 9K tokens, et les meilleurs modèles impliquent de configurer un proxy avec votre propre clé.",
        p2: "Infos sur Janitor AI tirées de sa page janitor+, de son centre d'aide et de ses politiques, vérifiées le {{date}}. Les nôtres sont lues en direct dans notre configuration.",
      },
      relation:
        "Aucune relation commerciale avec Janitor AI. Deux formes différentes : Janitor est une bibliothèque de personnages avec un modèle gratuit, nous sommes une bibliothèque de modèles avec des personnages.",
      verdict:
        "Choisissez Janitor AI pour sa bibliothèque de bots et le chat gratuit illimité sur JLLM. Choisissez {{appName}} si vous voulez des modèles non censurés solides à long contexte, prêts à l'emploi, sans proxy à configurer, avec images, vidéo et voix dans le même chat.",
      themPros: {
        a: "Des millions de bots communautaires, avec l'étiquette Limitless pour le NSFW.",
        b: "Chat gratuit illimité sur son propre modèle.",
        c: "Votre propre modèle via un proxy, OpenRouter compris.",
      },
      themCons: {
        a: "Environ 9K tokens de contexte gratuit : les longues campagnes oublient.",
        b: "janitor+ inclut un quota mensuel sur les modèles premium. Pour connecter ton modèle, il faut une clé API et un proxy.",
        c: "Texte uniquement, et l'appli mobile démarre en Safe Mode.",
      },
      usPros: {
        a: "{{modelCount}} modèles dans le sélecteur, dont {{uncensored}} non censurés, sans proxy ni clé à configurer.",
        b: "Des modèles non censurés à long contexte pour des campagnes qui durent des semaines.",
        c: "Images, vidéo, musique et voix depuis le même chat et le même solde.",
      },
      usCons: {
        a: "Une bibliothèque de personnages minuscule à côté de celle de Janitor.",
        b: "Pas d'offre gratuite illimitée : {{guestCredits}} crédits gratuits par mois, ensuite une offre payante.",
        c: "Moins de vie communautaire : pas de fil public de bots.",
      },
      chooseThem: {
        a: "Vous voulez parcourir des milliers de bots prêts à l'emploi.",
        b: "Vous voulez un chat gratuit illimité et le modèle gratuit vous suffit.",
        c: "Vous passez déjà par votre propre clé via un proxy et ça vous convient.",
      },
      chooseUs: {
        a: "Les longues histoires demandent un long contexte et un modèle non censuré solide.",
        b: "Vous voulez changer de modèle en pleine scène sans toucher aux réglages du proxy.",
        c: "Vous voulez des images ou une voix pour vos personnages, au même endroit.",
      },
      both: "Configuration courante : découvrir des personnages sur Janitor AI, mener les longues campagnes sur {{appName}}.",
      switch: {
        title: "Quitter Janitor AI",
        body: "Créez une skill sur {{appName}} avec la personnalité, le scénario et le message d'accueil de votre personnage, puis choisissez un modèle de jeu de rôle non censuré. Les chats incognito ne demandent aucun compte : testez une scène avant de vous inscrire.",
      },
      faq: {
        q1: {
          q: "Janitor AI est-il gratuit ?",
          a: "Oui : chats illimités sur son propre modèle, avec environ 9K tokens de contexte. janitor+ ajoute de la mémoire, de la vitesse et des modèles.",
        },
        q2: {
          q: "Janitor AI autorise-t-il le NSFW ?",
          a: "Oui pour les adultes, sur les bots étiquetés Limitless, sur le web. L'appli mobile démarre en Safe Mode tant que vous n'activez pas le NSFW dans les réglages web.",
        },
        q3: {
          q: "Faut-il un proxy sur {{appName}} ?",
          a: "Non. Tous les modèles sont dans le sélecteur. Vous payez des crédits par message, sans clé API.",
        },
        q4: {
          q: "Lequel a la meilleure mémoire pour un long jeu de rôle ?",
          a: "Janitor AI indique environ 9 000 jetons de contexte en gratuit et cinq fois plus avec janitor+. Sur {{appName}}, le contexte dépend du modèle choisi.",
        },
      },
      cta: {
        title: "Lancez votre prochaine campagne sur un modèle à long contexte",
      },
    },
    nanoGpt: {
      meta: {
        title:
          "Alternative à NanoGPT : {{appName}} vs NanoGPT, comparatif 2026",
        description:
          "{{appName}} vs NanoGPT : paiement à l'usage ou offres, modèles non censurés et abliterated, confidentialité, API et médias. Nous achetons chez NanoGPT et disons où il gagne.",
        keywords:
          "alternative à NanoGPT, NanoGPT alternative, NanoGPT vs, nano-gpt avis, NanoGPT prix, NanoGPT PRO, NanoGPT sans censure, API modèles abliterated, IA paiement à l'usage, API IA sans censure, IA non censurée, {{appName}} vs NanoGPT",
      },
      hero: {
        title: "{{appName}} vs NanoGPT",
        subtitle:
          "Deux plateformes multi-modèles avec des modèles non censurés et une API. L'une au paiement à l'usage, l'autre par offres. L'une vend à l'autre.",
        readTime: "6 min de lecture",
      },
      intro: {
        lead: "NanoGPT facture à l’usage et permet d’essayer un modèle gratuit sans inscription. Son API fournit plusieurs de nos modèles sans censure. Voici quand choisir chaque plateforme.",
        p2: "Infos sur NanoGPT tirées de ses pages tarifs, confidentialité et conditions, et de sa liste publique de modèles, vérifiées le {{date}}. Les nôtres sont lues en direct dans notre configuration.",
      },
      relation:
        "Nous sommes client de NanoGPT : {{nanoGptModels}} de nos modèles passent par l'API de NanoGPT (dont {{nanoGptUncensored}} non censurés), notamment {{nanoGptExamples}}.",
      verdict:
        "Choisis NanoGPT pour un vaste catalogue et le paiement à l’usage, même sans compte via l’API x402. Choisis {{appName}} pour une sélection testée de plusieurs fournisseurs, des crédits gratuits chaque mois, des compétences, une mémoire et un chat open source à héberger toi-même.",
      themPros: {
        a: "596 entrées pour les modèles de texte. 38 identifiants contiennent uncensored, abliterated ou Dolphin.",
        b: "Aucun abonnement requis. Après connexion, premier dépôt en crypto à partir de 0,10 USD.",
        c: "Prix catalogue sur les modèles routés automatiquement, moins cher que n'importe quel intermédiaire.",
      },
      themCons: {
        a: "L'offre gratuite se limite à un modèle sur le web.",
        b: "La confidentialité dépend de la route de fournisseur ; certaines autorisent l'entraînement.",
        c: "Avec un catalogue aussi gros, les tests, c'est vous qui les faites.",
      },
      usPros: {
        a: "Un sélecteur trié : chaque modèle étiqueté grand public, open source ou non censuré, avec sa page et son prix en direct.",
        b: "{{guestCredits}} crédits gratuits par mois, de quoi tester des modèles non censurés sur vos propres prompts.",
        c: "Skills, mémoire, dossiers et un chat pensé pour le travail de longue haleine, open source et auto-hébergeable.",
      },
      usCons: {
        a: "Moins de modèles que NanoGPT.",
        b: "Nous ajoutons {{markup}} % au coût des fournisseurs : le même modèle coûte plus cher ici.",
        c: "Les offres d'abord : les packs de crédits rechargent une offre active.",
      },
      chooseThem: {
        a: "Tu veux payer à l’usage ou appeler l’API sans compte via x402.",
        b: "Il vous faut un modèle obscur que seul un catalogue immense propose.",
        c: "Vous construisez sur l'API et voulez les prix catalogue.",
      },
      chooseUs: {
        a: "Tu veux une sélection de modèles testés.",
        b: "Vous voulez des crédits gratuits chaque mois et un chat soigné, avec skills et mémoire.",
        c: "Vous voulez le modèle d'uncensored.ai et ceux de Venice à côté de ceux de NanoGPT, dans un même fil.",
      },
      both: "Les développeurs utilisent souvent l'API de NanoGPT pour leurs traitements par lots et {{appName}} comme chat au quotidien.",
      switch: {
        title: "Quitter NanoGPT",
        body: "Les modèles servis par NanoGPT dans notre sélecteur, comme {{nanoGptExamples}}, sont les mêmes modèles. Lancez un chat incognito, choisissez-en un et comparez ses réponses à celles d'un modèle d'un autre fournisseur, dans le même fil.",
      },
      faq: {
        q1: {
          q: "NanoGPT est-il moins cher que {{appName}} ?",
          a: "Au token, en général oui : NanoGPT applique les prix catalogue et nous ajoutons {{markup}} %. Nous offrons {{guestCredits}} crédits gratuits par mois et une seule appli pour tous les fournisseurs.",
        },
        q2: {
          q: "NanoGPT demande-t-il un compte ?",
          a: "Le modèle web gratuit fonctionne sans compte. Il faut se connecter pour recharger son solde sur le site. L’API accepte les paiements x402 sans compte.",
        },
        q3: {
          q: "Les deux ont-ils une API ?",
          a: "Oui. L'API de NanoGPT est compatible OpenAI et Anthropic, avec des paiements sans compte. La nôtre est compatible OpenAI et Anthropic et se débloque après une offre ou un achat de crédits.",
        },
        q4: {
          q: "Lequel a le plus de modèles non censurés ?",
          a: "NanoGPT en liste plus au total. {{appName}} en a {{uncensored}}, choisis et testés, issus de NanoGPT, Venice, uncensored.ai, FreedomGPT et Gab AI.",
        },
      },
      cta: { title: "Comparez les modèles de NanoGPT à tous les autres" },
    },
    freedomGpt: {
      meta: {
        title: "Alternative à FreedomGPT : {{appName}} vs FreedomGPT (2026)",
        description:
          "{{appName}} vs FreedomGPT : Liberty et modèles sans censure, règles de contenu, confidentialité, crédits, API et open source. Des faits sourcés, des deux côtés.",
        keywords:
          "alternative à FreedomGPT, FreedomGPT alternative, FreedomGPT vs, FreedomGPT avis, FreedomGPT prix, FreedomGPT Pro, modèle Liberty, FreedomGPT sans censure, IA sans censure, IA non censurée, alternative à ChatGPT sans censure, uncensored ChatGPT alternative, {{appName}} vs FreedomGPT",
      },
      hero: {
        title: "{{appName}} vs FreedomGPT",
        subtitle:
          "Deux applis qui placent des modèles sans censure à côté de ChatGPT, Claude et Gemini. Règles, confidentialité, crédits, open source.",
        readTime: "6 min de lecture",
      },
      intro: {
        lead: "FreedomGPT et {{appName}} partagent une idée : des modèles grand public et non censurés dans une même liste. Les différences se jouent sur les règles, les crédits et ce que deviennent vos messages.",
        p2: "Infos sur FreedomGPT tirées de sa page d'accueil, de ses tarifs, de sa politique de confidentialité, de sa documentation et de son GitHub, vérifiées le {{date}}. Les nôtres sont lues en direct dans notre configuration.",
      },
      relation:
        "Nous sommes client de FreedomGPT : {{freedomGptExamples}} tourne sur {{appName}} via l'API de FreedomGPT elle-même.",
      verdict:
        "Choisissez FreedomGPT pour une seule offre à 20 $ qui couvre chat, images et vidéo, avec un démarrage gratuit et sans compte. Choisissez {{appName}} si vous voulez plus de modèles non censurés de plusieurs fournisseurs, aucune clause d'usage éthique en plus de la loi, des prix publiés pour chaque modèle et une plateforme open source activement développée.",
      themPros: {
        a: "Gratuit, sans carte ni compte.",
        b: "Liberty et d'autres modèles sans censure à côté de ChatGPT, Claude et Gemini.",
        c: "Génération d'images et de vidéo dans la même offre.",
      },
      themCons: {
        a: "Selon ses règles, les modèles doivent respecter le droit américain et ne peuvent pas servir à des fins contraires à l'éthique.",
        b: "Messages, voix et images partent chez des fournisseurs tiers ; aucune durée de conservation indiquée.",
        c: "L'appli de bureau open source n'a pas été mise à jour depuis juin 2024.",
      },
      usPros: {
        a: "{{uncensored}} modèles non censurés de cinq fournisseurs, Liberty compris.",
        b: "Chaque modèle a une page publique avec son prix par message en direct.",
        c: "Toute la plateforme est open source et activement développée. Auto-hébergez-la.",
      },
      usCons: {
        a: "Pas d'offre forfaitaire tout compris : les crédits sont décomptés selon le modèle.",
        b: "Compte nécessaire pour la mémoire et la synchronisation des chats.",
        c: "Notre marge de {{markup}} % s'applique aussi aux modèles servis par FreedomGPT.",
      },
      chooseThem: {
        a: "Vous voulez une seule offre simple à 20 $ pour le chat, les images et la vidéo.",
        b: "Liberty et les modèles grand public vous suffisent.",
        c: "Vous voulez une appli de bureau hors ligne et la version de 2024 vous convient.",
      },
      chooseUs: {
        a: "Vous voulez plus de choix sans censure : les modèles de Venice, NanoGPT, uncensored.ai et Gab aussi.",
        b: "Vous voulez voir le prix par message avant d'envoyer.",
        c: "Vous voulez un logiciel open source à jour et auto-hébergeable.",
      },
      both: "Liberty, le modèle de FreedomGPT, est dans notre sélecteur : testez-le face à d'autres modèles non censurés sans second abonnement.",
      switch: {
        title: "Quitter FreedomGPT",
        body: "Choisissez Liberty dans notre sélecteur de modèles et continuez. Essayez ensuite le même prompt sur {{ownModel}} ou un modèle abliterated, et gardez celui qui répond le mieux.",
      },
      faq: {
        q1: {
          q: "FreedomGPT est-il vraiment sans censure ?",
          a: "Ses modèles sans censure abandonnent la plupart des refus, mais FreedomGPT indique que chaque modèle qu'elle héberge doit respecter le droit américain et ne peut pas servir à des fins contraires à l'éthique, et l'étiquette « sans censure » ne garantit pas une réponse à chaque demande.",
        },
        q2: {
          q: "Combien coûte FreedomGPT ?",
          a: "Le démarrage est gratuit. Pro inclut 2 200 crédits par mois ; une réponse premium coûte environ 10 crédits, une image environ 25 et une vidéo de 5 secondes environ 400.",
        },
        q3: {
          q: "FreedomGPT est-il open source ?",
          a: "Son ancienne appli de bureau pour modèles hors ligne est open source (GPL-3.0) sur GitHub, dernière mise à jour en juin 2024. L'appli cloud ne l'est pas. {{appName}} est open source dans son ensemble.",
        },
        q4: {
          q: "Puis-je utiliser le modèle Liberty de FreedomGPT sur {{appName}} ?",
          a: "Oui. Il passe par l'API de FreedomGPT et se trouve dans notre sélecteur, à côté des autres modèles non censurés.",
        },
      },
      cta: {
        title: "Testez Liberty face à tous les autres modèles non censurés",
      },
    },
    gabAi: {
      meta: {
        title: "Alternative à Gab AI : {{appName}} vs Gab AI (2026)",
        description:
          "{{appName}} vs Gab AI : Arya, 214 modèles, l'interdiction du contenu sexuel, confidentialité, crédits et API côte à côte. Nous achetons chez Gab, alors nous disons où chacun gagne.",
        keywords:
          "alternative à Gab AI, Gab AI alternative, Gab AI vs, Gab AI avis, Gab AI prix, Gab AI Plus, Arya AI, Gab Arya, Gab AI sans censure, is Gab AI uncensored, Gab AI NSFW, Gab AI API, chatbot IA conservateur, IA de droite, IA sans censure, chat IA non censuré, {{appName}} vs Gab AI",
      },
      hero: {
        title: "{{appName}} vs Gab AI",
        subtitle:
          "Deux applis multi-modèles qui refusent de censurer la politique. L'une interdit aussi les contenus pour adultes. Prix, règles, confidentialité et API, côte à côte.",
        readTime: "7 min de lecture",
      },
      intro: {
        lead: "Gab AI a créé Arya pour ceux qui en ont assez des chatbots qui leur font la morale sur la politique, la culture et la foi. Nous proposons Arya aussi, via l'API de Gab elle-même. La vraie question n'est donc pas de savoir lequel est sans censure. C'est de savoir quelles règles vous voulez autour du modèle.",
        p2: "Infos sur Gab AI tirées de sa page d'accueil, de sa page tarifs, de sa page API, de ses conditions et de sa politique de confidentialité, vérifiées le {{date}}. Les nôtres sont lues en direct dans notre configuration.",
      },
      relation:
        "Nous sommes client de Gab AI : {{gabAiExamples}} tourne sur {{appName}} via l'API de Gab. Même modèle, autre appli, autres règles autour.",
      verdict:
        "Choisissez Gab AI si vous voulez Arya avec le mode agent de Gab, ses applis de bureau et un catalogue de 214 modèles sous une seule marque conservatrice, et que vous n'avez jamais besoin de contenus pour adultes. Choisissez {{appName}} si vous voulez Arya à côté de {{ownModel}} et de versions abliterated de GLM et DeepSeek dans un seul chat, de la fiction adulte sur les modèles non censurés qui l'autorisent, et des chats qui peuvent rester dans votre navigateur.",
      themPros: {
        a: "214 modèles sur un seul compte, plus Arya, son modèle maison pour la politique, la culture et la foi.",
        b: "Mode agent (Work), voix en direct, images, vidéo et musique, applis pour Mac, Windows, iPhone et Android.",
        c: "Les packs de crédits achetés sont reportés et n'expirent pas.",
      },
      themCons: {
        a: "Ses conditions interdisent les contenus obscènes, sexuellement explicites ou pornographiques, et des systèmes automatisés peuvent analyser vos contenus.",
        b: "Prompts, réponses et historique sont conservés sur ses serveurs, et l'amélioration de ses modèles figure parmi les finalités annoncées.",
        c: "Gratuit veut dire 250 crédits uniques à l'inscription, après vérification de l'e-mail. L'API demande Plus ou Plus Premium.",
      },
      usPros: {
        a: "{{uncensored}} modèles non censurés de plusieurs fournisseurs, Arya compris, dans un seul sélecteur de modèles.",
        b: "Aucune interdiction globale des contenus pour adultes : une confirmation unique de majorité (18+) débloque tous les modèles non censurés.",
        c: "{{guestCredits}} crédits gratuits par mois sans compte. Les chats incognito restent dans votre navigateur.",
      },
      usCons: {
        a: "Pas de mode agent ni d'appli de bureau comme Work chez Gab.",
        b: "Catalogue plus petit : {{modelCount}} modèles de chat contre 214 chez Gab.",
        c: "Notre marge de {{markup}} % s'applique aussi à Arya.",
      },
      chooseThem: {
        a: "Vous voulez Arya avec le mode agent et les applis de bureau de Gab.",
        b: "Vous partagez les valeurs de Gab et voulez soutenir une entreprise d'IA construite hors des Big Tech.",
        c: "Vous n'écrivez jamais de fiction adulte et voulez le plus gros catalogue sur une seule facture.",
      },
      chooseUs: {
        a: "Vous voulez comparer Arya avec {{ownModel}} et des modèles abliterated dans le même fil.",
        b: "Vous écrivez de la fiction adulte ou sombre et avez besoin de modèles qui l'autorisent.",
        c: "Vous voulez commencer sans compte et garder vos chats incognito dans votre navigateur.",
      },
      both: "Arya est dans notre sélecteur : posez la même question à Arya, à {{ownModel}} et à un modèle abliterated, et jugez les réponses vous-même, sans second abonnement.",
      switch: {
        title: "Quitter Gab AI",
        body: "Choisissez Arya dans notre sélecteur de modèles et continuez. Envoyez ensuite le même prompt à {{ownModel}} : tous deux refusent d'esquiver la politique, mais ils ont été construits différemment, et les réponses le montrent. Collez l'ancien contexte dans le premier message si besoin.",
      },
      faq: {
        q1: {
          q: "Gab AI est-elle vraiment sans censure ?",
          a: "Sur la politique, la culture et la foi, oui : c'est pour ça qu'Arya a été conçu. Sur le contenu sexuel, non. Les conditions de Gab interdisent les contenus obscènes, sexuellement explicites ou pornographiques et indiquent que des systèmes automatisés peuvent analyser vos contenus pour vérifier leur conformité.",
        },
        q2: {
          q: "Combien coûte Gab AI ?",
          a: "Les comptes gratuits reçoivent 250 crédits d'inscription après vérification de l'e-mail. Plus coûte 20 $ par mois ou 200 $ par an, avec 2 000 crédits par mois. Plus Premium coûte 999 $ par an avec 12 000 crédits. Les packs de crédits commencent à 10 $ pour 700 crédits.",
        },
        q3: {
          q: "Puis-je utiliser Arya sur {{appName}} ?",
          a: "Oui. Arya passe par l'API de Gab et se trouve dans notre sélecteur, à côté de {{ownModel}} et des autres modèles non censurés. Les règles de contenu de Gab s'appliquent toujours aux réponses d'Arya.",
        },
        q4: {
          q: "Gab AI conserve-t-elle mes chats ?",
          a: "Oui. Sa politique de confidentialité indique qu'elle conserve vos prompts, ses réponses et l'historique de vos conversations, cite l'amélioration de ses modèles parmi ses finalités et prévient que l'envoi des requêtes aux fournisseurs de modèles ne les rend pas anonymes. Sur {{appName}}, les chats incognito restent dans votre navigateur.",
        },
      },
      cta: {
        title: "Testez Arya face à tous les autres modèles non censurés",
      },
    },
    uncensoredAi: {
      meta: {
        title: "Alternative à uncensored.ai : {{appName}} vs uncensored.ai",
        description:
          "{{appName}} vs uncensored.ai : le même modèle UncensoredLM, une autre appli. Limites gratuites, prix de Pro, API, confidentialité et médias côte à côte, sources à l'appui.",
        keywords:
          "alternative à uncensored.ai, uncensored.ai alternative, uncensored.ai vs, uncensored.ai avis, uncensored.ai prix, uncensored.ai Pro, UncensoredLM, UncensoredAI v1.2, uncensored.ai API, uncensored.ai gratuit, chat IA sans censure, IA non censurée, uncensored AI chat, {{appName}} vs uncensored.ai",
      },
      hero: {
        title: "{{appName}} vs uncensored.ai",
        subtitle:
          "Un modèle avec sa propre vision du monde, deux façons de l'utiliser. Limites gratuites, prix, API et tout ce qui va avec.",
        readTime: "6 min de lecture",
      },
      intro: {
        lead: "uncensored.ai fait le modèle sans censure le plus singulier que nous connaissions : {{ownModel}}, entraîné sur des livres et des documents bannis de l'internet grand public, avec des opinions politiques à contre-courant du discours dominant. Nous le faisons tourner via l'API d'uncensored.ai elle-même. Cette page répond donc à une seule question : faut-il l'utiliser sur uncensored.ai, ou ici ?",
        p2: "Infos sur uncensored.ai tirées de sa page tarifs, de sa page API, de sa page À propos et de sa politique de confidentialité, vérifiées le {{date}}. Les nôtres sont lues en direct dans notre configuration.",
      },
      relation:
        "Nous sommes client d'uncensored.ai : {{uncensoredAiExamples}} tourne sur {{appName}} via l'API d'uncensored.ai. Même modèle, notre chat, notre facturation.",
      verdict:
        "Choisissez uncensored.ai si vous voulez des chats illimités avec ce seul modèle pour un prix Pro fixe garanti à vie, plus son forum et son mode vocal. Choisissez {{appName}} si vous voulez {{ownModel}} à côté de {{modelCount}} autres modèles, pour confronter sa position à Claude, GPT ou un modèle abliterated dans un même fil, avec images, vidéo et musique sur le même solde.",
      themPros: {
        a: "Prix fixe : Pro coûte 9,99 $ par mois ou 99,99 $ par an, garanti à vie tant que vous restez abonné.",
        b: "Chats illimités avec le modèle pour ce prix, plus le mode vocal, les dossiers et les archives.",
        c: "Sa politique de confidentialité indique que vos données ne servent pas à entraîner ni à améliorer des modèles d'IA.",
      },
      themCons: {
        a: "L'offre gratuite se limite à 3 réponses par jour.",
        b: "Un seul modèle, 32 768 tokens de contexte, pas de génération d'images, de vidéo ni de musique.",
        c: "Les appels API coûtent 0,05 $ chacun et s'achètent séparément de l'abonnement Pro.",
      },
      usPros: {
        a: "{{ownModel}} plus {{modelCount}} autres modèles dans un seul chat : comparez sa réponse à celles de modèles grand public et abliterated dans le même fil.",
        b: "{{guestCredits}} crédits gratuits par mois sans compte, {{freeCredits}} avec un compte.",
        c: "Images, vidéo, musique et voix sur le même solde, et toute la plateforme est open source.",
      },
      usCons: {
        a: "Des crédits décomptés, pas une offre illimitée forfaitaire : un usage quotidien intensif de ce seul modèle coûte plus cher ici.",
        b: "Pas de forum communautaire ni d'archives autour du modèle.",
        c: "Notre marge de {{markup}} % s'applique aussi au modèle d'uncensored.ai.",
      },
      chooseThem: {
        a: "Ce seul modèle vous suffit et vous l'utilisez tous les jours.",
        b: "Vous voulez un prix garanti à vie.",
        c: "Vous voulez son forum et son mode vocal.",
      },
      chooseUs: {
        a: "Vous voulez comparer ses positions avec celles de modèles grand public et abliterated.",
        b: "Vous l'utilisez de temps en temps et ne voulez pas d'abonnement de plus.",
        c: "Il vous faut aussi des images, de la vidéo ou de la musique.",
      },
      both: "Beaucoup utilisent les deux : uncensored.ai pour des chats quotidiens illimités avec le modèle, {{appName}} quand ils veulent mettre sa réponse à côté de celle d'un autre modèle dans le même fil.",
      switch: {
        title: "Quitter uncensored.ai",
        body: "Choisissez {{ownModel}} dans notre sélecteur de modèles et lancez un chat incognito. Aucune migration nécessaire. Collez l'ancien contexte dans le premier message si besoin, puis posez la même question à un modèle abliterated et voyez où les deux divergent.",
      },
      faq: {
        q1: {
          q: "{{appName}}, c'est la même chose qu'uncensored.ai ?",
          a: "Non. Nous sommes une plateforme distincte et open source. Nous faisons tourner le modèle d'uncensored.ai via son API, à côté de modèles de Venice, NanoGPT, FreedomGPT, Gab AI, OpenRouter et des grands labos.",
        },
        q2: {
          q: "uncensored.ai est-il gratuit ?",
          a: "Il a une offre gratuite de 3 réponses par jour. Pro coûte 9,99 $ par mois ou 99,99 $ par an et supprime la limite. Sur {{appName}}, {{guestCredits}} crédits gratuits par mois fonctionnent sans compte.",
        },
        q3: {
          q: "Qu'est-ce qui rend le modèle d'uncensored.ai différent ?",
          a: "La plupart des modèles non censurés sont des modèles grand public dont on a retiré les refus : même entraînement, même vision du monde. {{ownModel}} est entraîné sur des livres et des documents bannis de l'internet grand public : ses opinions politiques vont donc à contre-courant du discours dominant.",
        },
        q4: {
          q: "uncensored.ai a-t-il une API ?",
          a: "Oui : une API compatible OpenAI à 0,05 $ par inférence, avec des crédits achetés à part. Sur {{appName}}, le même modèle s'appelle via notre API compatible OpenAI et Anthropic, après n'importe quelle offre ou un achat de crédits.",
        },
      },
      cta: { title: "Confrontez ses positions à tous les autres modèles" },
    },
    openRouter: {
      meta: {
        title:
          "Alternative à OpenRouter pour le chat : {{appName}} vs OpenRouter",
        description:
          "{{appName}} vs OpenRouter : une appli de chat prête à l'emploi face à un routeur d'API pour développeurs. Modèles non censurés, frais, confidentialité et API côte à côte, sources à l'appui.",
        keywords:
          "alternative à OpenRouter, OpenRouter alternative, OpenRouter vs, OpenRouter avis, OpenRouter prix, OpenRouter frais, OpenRouter sans censure, OpenRouter uncensored, modèles non censurés OpenRouter, OpenRouter appli de chat, OpenRouter modèles gratuits, API compatible OpenAI, API LLM sans censure, uncensored LLM API, {{appName}} vs OpenRouter",
      },
      hero: {
        title: "{{appName}} vs OpenRouter",
        subtitle:
          "Un routeur pour développeurs avec 474 modèles face à une appli de chat avec des modèles non censurés intégrés. Frais, filtres, confidentialité et API.",
        readTime: "6 min de lecture",
      },
      intro: {
        lead: "OpenRouter est la réponse par défaut pour une seule clé API et des centaines de modèles. Nous l'utilisons nous-mêmes. Mais c'est un routeur pour développeurs, pas une appli de chat, et son rayon sans censure est maigre. Si vous cherchez une alternative à OpenRouter pour discuter, voici le comparatif honnête.",
        p2: "Infos sur OpenRouter tirées de sa page tarifs, de son guide sur la collecte de données, de ses conditions et de sa liste publique de modèles, vérifiées le {{date}}. Les nôtres sont lues en direct dans notre configuration.",
      },
      relation:
        "Nous sommes client d'OpenRouter : {{openRouterModels}} de nos modèles passent par l'API d'OpenRouter, dont {{openRouterExamples}}. Nous ajoutons le chat, les médias et les fournisseurs non censurés qu'il ne propose pas.",
      verdict:
        "Choisissez OpenRouter si vous êtes développeur et voulez une seule clé pour 474 modèles au prix des fournisseurs, avec routage de secours, et que vous apportez votre propre interface. Choisissez {{appName}} si vous voulez un chat prêt à l'emploi avec {{uncensored}} modèles non censurés, dont {{ownModel}} et des versions abliterated qu'OpenRouter ne liste pas, plus images, vidéo et musique, et une API quand vous en avez besoin.",
      themPros: {
        a: "474 modèles dans sa liste publique, au prix des fournisseurs.",
        b: "Pas d'abonnement. Modèles gratuits avec 50 requêtes par jour, 1 000 une fois 10 $ de crédits achetés.",
        c: "La journalisation des prompts et l'utilisation de vos données se font toutes deux uniquement sur activation.",
      },
      themCons: {
        a: "5,5 % de frais sur les achats de crédits avec l'offre standard.",
        b: "Peu de modèles non censurés : Venice Uncensored plus des fine-tunes de jeu de rôle comme Hermes 4 et Magnum. 142 de ses 474 modèles sont marqués comme modérés.",
        c: "Pas pensé pour le chat grand public : l'interface, c'est à vous de l'apporter.",
      },
      usPros: {
        a: "Un chat prêt à l'emploi dans le navigateur : pas de clé, pas de configuration, {{guestCredits}} crédits gratuits par mois sans compte.",
        b: "{{uncensored}} modèles non censurés de Venice, NanoGPT, uncensored.ai, FreedomGPT et Gab AI, débloqués par une confirmation unique de majorité (18+).",
        c: "API compatible OpenAI et Anthropic pour le chat, les images, la vidéo et la voix, sur le même solde.",
      },
      usCons: {
        a: "Catalogue plus petit : {{modelCount}} modèles de chat contre 474 chez OpenRouter.",
        b: "Notre marge de {{markup}} % sur le coût des fournisseurs dépasse les 5,5 % de frais d'OpenRouter.",
        c: "Conçu d'abord comme un chat : moins de réglages de routage qu'un routeur dédié.",
      },
      chooseThem: {
        a: "Vous développez une appli et voulez une seule clé pour des centaines de modèles.",
        b: "Vous avez besoin de bascule entre fournisseurs et de réglages de routage.",
        c: "Chaque centime par token compte et vous avez votre propre interface.",
      },
      chooseUs: {
        a: "Vous voulez discuter, pas développer : ouvrez la page et tapez.",
        b: "Vous voulez des modèles non censurés qu'OpenRouter ne liste pas, comme {{ownModel}}.",
        c: "Vous voulez chat, images, vidéo et musique sur un seul solde, avec une API en plus.",
      },
      both: "Utiliser les deux, c'est courant : OpenRouter dans votre code, {{appName}} comme chat pour tester des modèles non censurés côte à côte avant d'en brancher un.",
      switch: {
        title: "Quitter OpenRouter",
        body: "Côté chat : lancez un chat incognito et choisissez un modèle, sans clé. Côté code : notre API est compatible OpenAI, il suffit de changer l'URL de base et la clé, puis de vérifier l'identifiant du modèle sur sa page.",
      },
      faq: {
        q1: {
          q: "Existe-t-il une alternative à OpenRouter avec des modèles non censurés ?",
          a: "Oui. {{appName}} propose {{uncensored}} modèles non censurés de Venice, NanoGPT, uncensored.ai, FreedomGPT et Gab AI dans un seul chat et une seule API. NanoGPT et Venice vendent aussi des modèles non censurés par API. OpenRouter lui-même n'en liste que quelques-uns.",
        },
        q2: {
          q: "OpenRouter autorise-t-il le contenu NSFW ?",
          a: "Ses conditions exigent d'avoir 18 ans ou plus et il filtre les entrées pour détecter les contenus pédocriminels connus. Chaque fournisseur garde ses propres règles, et 142 des 474 modèles de sa liste sont marqués comme modérés : qu'une requête passe ou non dépend du modèle et du fournisseur.",
        },
        q3: {
          q: "Combien coûte OpenRouter ?",
          a: "Les prix catalogue des fournisseurs au token, plus 5,5 % de frais sur les achats de crédits avec l'offre standard. Pas d'abonnement. Les modèles gratuits permettent 50 requêtes par jour, 1 000 une fois 10 $ de crédits achetés.",
        },
        q4: {
          q: "Puis-je utiliser mon code OpenRouter avec {{appName}} ?",
          a: "Oui, s'il utilise le format OpenAI : pointez-le vers notre URL de base avec votre clé {{appName}} et utilisez nos identifiants de modèles. L'API se débloque avec n'importe quelle offre (dès {{apiSubPrice}} par mois) ou un achat de crédits.",
        },
      },
      cta: { title: "Discutez avec les modèles qu'OpenRouter ne propose pas" },
    },
  },
};
