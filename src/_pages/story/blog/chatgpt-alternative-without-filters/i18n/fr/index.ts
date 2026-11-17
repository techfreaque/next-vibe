import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Alternative à ChatGPT sans filtres | {{appName}}",
    description:
      "Une alternative à ChatGPT sans filtres : {{modelCount}} modèles, du grand public au non censuré. Vous choisissez le niveau de filtrage à chaque discussion. Gratuit pour commencer, sans compte.",
    category: "Guide",
    imageAlt: "{{appName}} : une alternative à ChatGPT sans filtres",
    keywords:
      "alternative à ChatGPT, alternative à ChatGPT sans filtres, alternative à ChatGPT non censurée, ChatGPT sans restrictions, chat IA sans filtre, IA non censurée, UncensoredLM, IA non censurée pour la politique, {{appName}}, Claude, GPT, Gemini, DeepSeek, Venice",
  },
  hero: {
    backToBlog: "Retour au blog",
    category: "Guide",
    readTime: "7 min de lecture",
    title:
      "Une alternative à ChatGPT sans filtres. C'est vous qui réglez le niveau.",
    subtitle:
      "Claude, GPT et Gemini à côté de modèles open source et non censurés, dans un seul chat sur {{appName}}. La version honnête : ce qui change, ce qui ne change pas, et ce que ça coûte.",
  },
  intro: {
    lead: "Vous avez posé une question normale. ChatGPT a répondu par un avertissement, une leçon de morale ou un refus poli. Un détail médical, une scène de polar, une question de sécurité informatique, une opinion politique hors consensus. Ce refus est une décision de politique interne, prise à votre place avant même que vous tapiez un mot.",
    p2: "Voici à quoi ressemble concrètement une alternative sans filtres sur {{appName}} : {{modelCount}} modèles, trois niveaux de filtrage, un seul solde. Et deux sortes de non-censuré : des modèles grand public qui ont cessé de refuser, et un modèle qui a sa propre vision du monde. Ce qu'il fait bien, où il montre ses limites, et quand ChatGPT reste le meilleur choix.",
  },
  exists: {
    title: "Existe-t-il un ChatGPT sans filtres ?",
    p1: "Pas chez OpenAI. Les modèles GPT suivent les règles d'utilisation d'OpenAI, où que vous les utilisiez. Claude et Gemini suivent les règles de leurs propres éditeurs. Toute appli qui promet un GPT sans filtre en promet trop.",
    p2: "Une vraie alternative place d'autres modèles à côté d'eux. {{appName}} fait tourner les modèles grand public et, dans le même chat, des modèles open source aux filtres légers et des modèles non censurés sans aucun filtre. La plupart sont des modèles grand public dont on a retiré les refus. Un seul, UncensoredLM, a sa propre vision du monde. C'est vous qui décidez lequel répond.",
  },
  tiers: {
    title: "Que veut vraiment dire « sans filtres » ?",
    intro: "Chaque modèle a un niveau de contenu. Il y en a trois.",
    mainstream:
      "Grand public ({{count}} modèles) : Claude, GPT, Gemini, Mistral. Les filtres de sécurité des grands labos. Ils déclinent les sujets sensibles.",
    open: "Open source ({{count}} modèles) : DeepSeek, Kimi, GLM, Qwen, Grok, MiniMax et d'autres. Filtres légers. Ils abordent la plupart des sujets délicats.",
    uncensored:
      "Non censuré ({{count}} modèles), de deux sortes. Des versions non censurées de GLM, Qwen, Gemma et DeepSeek, plus Venice : des modèles grand public dont on a retiré les refus, avec la même vision du monde. Et UncensoredLM : entraîné sur des livres et des documents bannis de l'internet grand public, sa propre vision du monde. Aucun filtre. C'est vous qui fixez les limites.",
    vendorRefusals:
      "Les modèles grand public gardent ici aussi les filtres de leur éditeur. GPT sur {{appName}} refuse ce que GPT refuse partout. La différence, c'est ce qu'il y a à côté.",
    twoKinds:
      "Le non-censuré existe en deux versions. La plupart des modèles sont partis d'un modèle grand public ou open source dont on a supprimé le réflexe de refus, par abliteration (on retire la « direction du refus » des poids du modèle) ou par un fine-tuning de décensure. Ils arrêtent de dire non. Leurs données d'entraînement et leur vision du monde restent les mêmes : en politique, ils répondent comme le voit le modèle de base, simplement sans esquiver, et dans la fiction sombre ils peuvent adoucir la scène. Débloqués, pas transformés. UncensoredLM est l'autre sorte. Uncensored.ai l'entraîne sur des livres et des documents bannis de l'internet grand public. Résultat : une autre vision du monde, des opinions politiques à contre-courant, pas de sermon, pas de retour forcé vers la ligne consensuelle.",
    modelsLink: "Parcourir tous les modèles par niveau de filtrage",
  },
  switch: {
    title: "Puis-je changer de modèle en pleine discussion ?",
    intro:
      "Oui. Vous choisissez le modèle à chaque message, pas pour tout le compte.",
    p1: "Commencez un fil avec Claude. Vous tombez sur un refus. Choisissez un modèle non censuré et envoyez le message suivant. Le fil garde son historique, et le nouveau modèle le lit en entier.",
    p2: "Ça marche aussi dans l'autre sens. Faites un premier jet avec un modèle non censuré, puis confiez le résultat à un modèle de pointe pour la structure et la finition.",
    caveat:
      "Le filtre est dans le modèle, pas dans le fil. Un modèle grand public qui lit un brouillon non censuré peut quand même refuser de le poursuivre.",
  },
  picks: {
    title: "Quel modèle utiliser à la place de ChatGPT ?",
    intro:
      "Partez de la tâche. Chaque nom renvoie à la page du modèle, avec prix et specs.",
    builtUncensored: {
      title:
        "Politique, autres points de vue, jeu de rôle sombre : sa propre vision du monde",
      body: "UncensoredLM est le seul modèle ici qui ne soit pas un modèle grand public débloqué. Il a sa propre vision du monde. Les questions politiques et controversées obtiennent des réponses que les modèles grand public ne vous donneront pas. Les opinions hétérodoxes sont défendues jusqu'au bout. Le jeu de rôle sombre ou tabou reste sombre. Pas de moralisation, pas de retour au consensus. La limite : 32K de contexte, texte uniquement, pas fait pour le code, et il énonce les affirmations contestées aussi nettement que les faits établis. Vérifiez ce qu'il vous dit.",
    },
    everyday: {
      title: "Travail quotidien, filtres grand public",
      body: "Rédaction, recherche, code, analyse. Le plus proche de ChatGPT, avec le même type de filtres.",
    },
    open: {
      title: "Intelligents, moins de refus",
      body: "Des modèles open source solides aux filtres légers. Ils répondent à la plupart des questions qu'un modèle grand public esquive et tiennent la route en code et en raisonnement.",
    },
    unfiltered: {
      title: "Aucun refus, du vrai raisonnement",
      body: "Les poids lourds parmi les modèles débarrassés de leurs refus. De solides modèles de base sans refus : code, analyse et longs textes sur des sujets que d'autres modèles signalent. Même entraînement, même vision du monde : pour des opinions politiques à contre-courant, commencez plutôt par UncensoredLM.",
    },
    fiction: {
      title: "Jeu de rôle et fiction sombre",
      body: "UncensoredLM est en tête pour les scènes sombres et taboues : ses données d'entraînement sortent du consensus prudent, rien n'adoucit l'histoire. Venice Role Play pour les longues campagnes (128K de contexte) et l'entrée d'images. Venice Uncensored comme polyvalent bon marché.",
    },
    cheap: {
      title: "Pas cher et rapide",
      body: "Gros volume à petit prix. Trois modèles flash débarrassés de leurs refus, plus Claude Haiku quand un filtre ne vous gêne pas.",
    },
    compare:
      "Vous hésitez entre deux ? Comparez prix, fenêtre de contexte et capacités côte à côte. Commencez par UncensoredLM face au modèle de ChatGPT, face à Venice Role Play et face à un modèle phare débarrassé de ses refus.",
    compareLink: "Comparer {{a}} et {{b}}",
    guideLink: "Lire le guide de tous les modèles non censurés",
  },
  privacy: {
    title: "Un chat IA sans filtre est-il privé ?",
    intro: "Ça dépend du dossier. Voici exactement ce qui se passe.",
    incognito:
      "Les discussions incognito sont stockées dans le stockage local de votre navigateur. La conversation n'est pas enregistrée sur nos serveurs (les médias générés sont stockés temporairement pour des raisons techniques). Effacez les données de votre navigateur et tout disparaît.",
    transit:
      "Chaque message passe tout de même par notre serveur pour rejoindre le fournisseur du modèle qui rédige la réponse. C'est le cas de toute IA hébergée. La consommation de crédits est enregistrée pour que la facturation fonctionne.",
    memory:
      "La mémoire est désactivée en incognito. La mémoire persistante nécessite un compte gratuit et le dossier privé.",
    private:
      "Les discussions privées sont enregistrées sur le serveur et visibles uniquement par votre compte. Ouvrez-les depuis n'importe quel appareil où vous êtes connecté.",
    callout:
      "En bref : l'incognito garde votre historique hors de nos serveurs. Il ne cache pas vos messages au modèle qui y répond.",
  },
  pricing: {
    title: "Combien ça coûte ?",
    intro: "Des crédits. Un seul solde pour tous les modèles.",
    free: "Gratuit : {{guestCredits}} crédits par mois sans compte, {{freeCredits}} avec un compte gratuit, {{maxCredits}} avec un compte et la newsletter. Assez pour essayer plusieurs modèles sur vos propres prompts.",
    sub: "Formules mensuelles : quatre tailles, dès {{subCredits}} crédits pour {{subPrice}}.",
    pack: "Packs de crédits : une recharge pour les abonnés, {{packCredits}} crédits pour {{packPrice}}. Ils n'expirent jamais. Carte, PayPal ou crypto.",
    oneBalance:
      "Le même solde couvre la génération d'images, de vidéos et de musique, la saisie et la lecture vocales, et la recherche web.",
    metered:
      "Chaque message coûte des crédits selon le modèle. Les modèles flash coûtent une fraction d'un modèle de pointe. Chaque page de modèle affiche le prix.",
    link: "Voir les formules et les packs de crédits",
  },
  chatgptBetter: {
    title: "Quand ChatGPT est-il le meilleur choix ?",
    intro: "Parfois. Voici quand.",
    oneVendor:
      "Vous n'utilisez que des modèles OpenAI et ne tombez jamais sur un refus. Dans ce cas, un seul éditeur, une seule appli, un seul abonnement, c'est plus simple.",
    flatRate:
      "Vous voulez un forfait fixe sans jamais penser au coût par message. Les crédits sont décomptés à l'usage, et une utilisation quotidienne intensive des modèles de pointe finit par chiffrer.",
    firstFeatures:
      "Vous voulez les nouveautés d'un labo dès le jour de leur sortie. Les labos lancent souvent leurs nouvelles fonctionnalités d'abord dans leurs propres applis.",
    wantFilter:
      "Vous voulez le filtre. Le compte d'un enfant ou un lieu de travail aux règles strictes a besoin de garde-fous. Vous pouvez rester ici sur le niveau grand public, mais un produit verrouillé peut mieux convenir.",
  },
  limits: {
    title: "Quels sont les inconvénients ?",
    intro:
      "Sans filtres, il y a des compromis. Connaissez-les avant de changer.",
    smaller:
      "La plupart des modèles non censurés sont plus petits que les modèles de pointe. Plusieurs sont conçus pour la conversation et la fiction, pas pour l'analyse poussée. UncensoredLM est fait pour des réponses franches, pas pour le code. Sur le raisonnement le plus exigeant et les longues tâches de code, les meilleurs modèles grand public restent devant.",
    tools:
      "Tous les modèles non censurés ne prennent pas en charge les appels d'outils. Vérifiez la page du modèle avant de compter sur la recherche web ou d'autres outils.",
    vendor:
      "Les modèles grand public gardent leurs propres refus. Si Claude dit non, changez de modèle au lieu de négocier avec lui.",
    responsibility:
      "Pas de filtre, pas de filet de sécurité. Ce que vous générez et publiez relève de votre responsabilité, et la loi de votre pays s'applique toujours.",
  },
  faq: {
    title: "FAQ",
    free: {
      q: "{{appName}} est-il gratuit ?",
      a: "Sans compte : {{guestCredits}} crédits gratuits par mois. Compte gratuit : {{freeCredits}}. Compte + newsletter : {{maxCredits}}. Au-delà : une formule, dès {{subPrice}} par mois.",
    },
    account: {
      q: "Ai-je besoin d'un compte ?",
      a: "Non. Le chat incognito fonctionne sans. Il vous faut un compte pour la mémoire et pour les discussions enregistrées sur le serveur.",
    },
    api: {
      q: "Puis-je utiliser ces modèles dans mes propres outils ?",
      a: "Oui. Chaque formule payante inclut une API compatible OpenAI. Une seule clé, tous les modèles, non censurés compris.",
    },
    openSource: {
      q: "{{appName}} est-il open source ?",
      a: "Oui. Le code est open source sous licences MIT et GPL v3, et vous pouvez faire tourner votre propre instance.",
    },
    apiLink: "Configurer l'API dans vos outils de code",
    selfHostLink: "Héberger votre propre instance",
  },
  partners: {
    body: "Vous animez une chaîne, une newsletter ou une communauté autour de l'IA ? Le programme partenaire {{appName}} vous reverse une part récurrente de chaque paiement que vous apportez.",
    link: "Voir le programme partenaire",
  },
  cta: {
    title: "Choisissez votre filtre. Posez votre question.",
    subtitle:
      "{{guestCredits}} crédits gratuits par mois, sans compte. Grand public, open source ou non censuré : changez quand vous voulez.",
    chat: "Lancer un chat sans filtre",
    models: "Comparer tous les modèles",
  },
};
