import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Alternatives à Gab AI : les chats IA sans censure comparés (2026)",
    description:
      "Comparez Gab AI et Arya à {{appName}}, Grok, Perplexity, Venice et aux modèles locaux. Pour la recherche politique, les échanges privés ou la création.",
    category: "Comparatif",
    imageAlt: "Alternatives à Gab AI comparées côte à côte",
    keywords:
      "alternative à Gab AI, alternatives Gab AI, sites comme Gab AI, Gab AI Arya, Gab AI vs Venice, chatbot IA conservateur, IA sans censure, IA non censurée pour la politique, IA sans biais politique, IA liberté d'expression, {{appName}}",
  },
  hero: {
    backToBlog: "Retour au blog",
    category: "Comparatif",
    readTime: "9 min de lecture",
    title: "Alternatives à Gab AI pour la recherche, le chat et les médias",
    subtitle:
      "{{count}} alternatives et {{appName}}, comparées sur ce que disent leurs propres conditions, tarifs et politiques de confidentialité.",
  },
  intro: {
    lead: "Gab AI a construit une IA qui parle politique, culture et foi sans la leçon de morale des géants de la tech. Ça marche. Les petites lignes : pas de contenu adulte, vos chats sur ses serveurs, et l'API réservée à un forfait payant.",
    p2: "Ci-dessous : ce que Gab AI promet vraiment, où s'arrête sa liberté, et {{count}} alternatives vérifiées sur leurs propres pages. Gab AI au {{gabDate}}, les autres au {{date}}. Nous disons aussi où elles font mieux que nous.",
    relation:
      "En toute transparence : nous sommes clients de Gab AI. {{gabAiExamples}} tourne sur {{appName}} via l'API de Gab elle-même.",
  },
  gab: {
    title: "Ce que propose Gab AI",
    intro:
      "D'après sa page d'accueil, ses tarifs, ses conditions d'utilisation, sa politique de confidentialité et sa page API, lus le {{gabDate}}.",
    models:
      "Modèles : {{gabModels}} modèles sur un seul compte, de GPT, Claude, Gemini, DeepSeek, Qwen, Kimi, GLM et d'autres. Arya est le modèle maison de Gab pour parler sans censure de politique, de culture et de foi.",
    filter:
      "Filtre : les conditions exigent 18 ans et interdisent tout contenu obscène, sexuellement explicite ou pornographique, sauf la nudité à but éducatif ou médical. Des systèmes automatisés peuvent analyser vos contenus pour la sécurité et la conformité.",
    price:
      "Prix : {{gabFree}} crédits d'inscription après vérification de l'e-mail. Plus coûte {{plusMonth}} par mois ou {{plusYear}} par an avec {{plusCredits}} crédits par mois. Plus Premium coûte {{premiumYear}} par an avec {{premiumCredits}} par mois. Packs de crédits dès {{gabPackPrice}} pour {{gabPackCredits}} crédits, reportés d'un mois sur l'autre.",
    gated:
      "Réservé à Plus : Work, son mode agent, et la voix en direct. En gratuit, vidéo et musique demandent des crédits achetés. L'API exige un forfait Plus ou Plus Premium actif.",
    privacy:
      "Confidentialité : Gab voit vos prompts et les réponses et conserve l'historique des conversations. L'amélioration de ses modèles figure parmi les finalités. La politique précise de ne pas supposer que passer par Gab retire les informations identifiantes. Les données sont gardées aussi longtemps que nécessaire au service.",
    apps: "Applis : web, Mac, Windows, iPhone, iPad, Android et une extension de navigateur.",
    why: "Pourquoi on cherche ailleurs : on écrit de la fiction que les conditions de Gab interdisent, on veut des chats hors d'un serveur, un accès API sans abonnement, ou confronter la réponse d'Arya à une autre vision du monde.",
    sourceHome: "Page d'accueil de Gab AI",
    sourcePricing: "Tarifs de Gab AI",
    sourceTerms: "Conditions d'utilisation de Gab AI",
    sourcePrivacy: "Politique de confidentialité de Gab AI",
    sourceApi: "Page API de Gab AI",
  },
  split: {
    title: "Libre sur la politique, strict sur le contenu adulte",
    intro: "La liberté de Gab AI a une frontière nette. La voici.",
    politics:
      "Politique, culture, foi : Arya répond sans les précautions oratoires du courant dominant. C'est le produit, et il tient parole.",
    adult:
      "Fiction pour adultes : interdite par les conditions. Dark romance, scènes explicites, jeu de rôle adulte n'obtiennent aucune aide, et des systèmes automatisés peuvent analyser les contenus pour la conformité.",
    us: "Sur {{appName}}, les deux fonctionnent : des positions à contre-courant avec UncensoredLM ou Arya, et de la fiction adulte avec les modèles sans censure après une confirmation unique de vos 18 ans. La loi s'applique toujours.",
    unbiasedLink:
      "Une IA qui défend les deux camps : les modèles comparés sur la politique",
    writerLink: "Rédacteur IA sans censure : fiction sombre et scènes adultes",
    chanLink: "La skill 4chan : greentext et vannes, sans filtre",
  },
  criteria: {
    title: "Ce qu'il faut comparer avant de changer",
    intro: "Cinq questions tranchent.",
    worldview:
      "Vision du monde : un modèle maison avec une ligne affichée, ou plusieurs que vous pouvez opposer ?",
    filter:
      "Filtre : libre seulement sur la politique, ou aussi sur la fiction et le contenu adulte ? Qui analyse quoi ?",
    privacy:
      "Confidentialité : où vivent vos chats et s'ils servent à améliorer les modèles.",
    price:
      "Prix : crédits gratuits, abonnement ou paiement à l'usage. Et ce que le gratuit verrouille.",
    api: "API : faut-il un abonnement, et quels formats parle-t-elle ?",
  },
  table: {
    title: "Tous côte à côte",
  },
  us: {
    title: "{{appName}} : plusieurs visions du monde, un seul chat",
    intro:
      "{{modelCount}} modèles dans un seul chat avec un seul solde. Vous choisissez le modèle à chaque message, donc vous mettez deux points de vue côte à côte.",
    models:
      "Modèles : {{uncensored}} sans censure à côté de {{mainstream}} modèles grand public et {{open}} modèles ouverts. {{ownModel}} est entraîné sur des livres et des documents bannis de l'internet grand public, ce qui donne un modèle aux opinions politiques à contre-courant.",
    arya: "Arya est là aussi ({{gabAiExamples}}). Posez la question à Arya, puis la même à UncensoredLM ou à une version abliterated de GLM, dans le même fil.",
    aryaOff:
      "Des versions abliterated de GLM, DeepSeek et Kimi à côté de Claude, GPT et Gemini. Posez deux fois la même question et comparez.",
    privacy:
      "Confidentialité : les chats incognito restent dans le stockage local de votre navigateur, sans compte. Les chats privés sont enregistrés dans votre compte uniquement.",
    price:
      "Prix : {{guestCredits}} crédits gratuits par mois sans compte, {{freeCredits}} avec, {{maxCredits}} avec la newsletter. Forfaits dès {{subPrice}} par mois. Les modèles sans censure se débloquent après une confirmation unique de vos 18 ans.",
    api: "API : les mêmes modèles via des endpoints compatibles OpenAI et Anthropic. Tout forfait dès {{apiSubPrice}} par mois la débloque.",
    weak: "Là où nous sommes moins forts : pas de forfait illimité, chaque message coûte des crédits selon le modèle, et Gab affiche {{gabModels}} modèles quand nous en faisons tourner {{modelCount}}. Les packs de Gab fonctionnent sans forfait ; les nôtres complètent un forfait actif et n'expirent jamais.",
    hubLink: "Chat IA sans censure : tous les modèles, avec contexte et prix",
    abliteratedLink: "Les modèles abliterated à utiliser dans le navigateur",
    ownLink: "Voir {{ownModel}}",
    aryaLink: "Voir Gab AI Arya sur {{appName}}",
  },
  list: {
    title: "Les {{count}} alternatives, une par une",
    intro:
      "D'après leurs propres pages, vérifiées le {{date}}. Ce qu'est chacune, ses modèles, ce que permet son filtre, ce que deviennent vos chats.",
    heading: "{{number}}. {{name}} : {{kind}}",
    models: "Modèles :",
    filter: "Filtre :",
    privacy: "Confidentialité :",
    price: "Prix :",
    priceValue: "Gratuit : {{free}}. Payant : {{plans}}.",
    pro: "Point fort :",
    con: "Bémol :",
    forWho: "Choisissez-la si :",
    versusLink: "{{appName}} vs {{name}} : le comparatif complet",
    visit: "Visiter {{name}}",
  },
  privacy: {
    title: "Confidentialité : lisez la politique, pas le slogan",
    intro: "Ce que chacun écrit noir sur blanc.",
    gab: "Gab AI : prompts, réponses et historique restent sur ses serveurs, et l'amélioration des modèles figure parmi les finalités. Il collecte votre adresse IP et votre localisation approximative.",
    us: "{{appName}} en incognito : les chats vivent dans le stockage local de votre navigateur, pas sur nos serveurs. Effacez les données du navigateur et ils disparaissent.",
    local:
      "LM Studio : le modèle tourne sur votre machine et le prompt ne la quitte jamais. Le prix, c'est votre propre matériel.",
    callout:
      "Tout modèle hébergé voit le prompt auquel il répond. Un historique sur l'appareil tient vos chats loin d'un serveur d'entreprise, pas loin du modèle.",
  },
  faq: {
    title: "FAQ",
    best: {
      q: "Quelle est la meilleure alternative à Gab AI ?",
      a: "Tout dépend de ce qui vous manque. Un modèle franc à contre-courant : uncensored.ai. Historique sur l'appareil et un filtre adulte que Pro peut couper : Venice. Modèles sans censure plus images et vidéo dans un forfait : FreedomGPT. Paiement à l'usage : NanoGPT. Confidentialité totale : LM Studio. Arya, UncensoredLM et des modèles abliterated côte à côte dans un seul chat : {{appName}}.",
    },
    free: {
      q: "Existe-t-il une alternative gratuite à Gab AI ?",
      a: "Oui. FreedomGPT démarre gratuitement sans compte, LM Studio est gratuit sur votre propre matériel. {{appName}} offre {{guestCredits}} crédits gratuits par mois sans compte et {{freeCredits}} avec un compte, {{maxCredits}} avec la newsletter, modèles sans censure compris après une confirmation unique de vos 18 ans.",
    },
    arya: {
      q: "Peut-on utiliser Arya ailleurs que sur Gab AI ?",
      a: "Oui. {{appName}} propose {{gabAiExamples}} via l'API de Gab : vous interrogez Arya et confrontez sa réponse à {{ownModel}} ou à un modèle grand public dans le même fil.",
      aOff: "Arya est le modèle maison de Gab. Sur {{appName}}, vous avez {{ownModel}}, entraîné sur des livres et des documents bannis de l'internet grand public, plus des modèles abliterated et grand public dans un seul chat.",
    },
    adult: {
      q: "Gab AI autorise-t-il le contenu adulte ou NSFW ?",
      a: "Non. Ses conditions interdisent tout contenu obscène, sexuellement explicite ou pornographique, et des systèmes automatisés peuvent analyser les contenus pour la conformité. NanoGPT n'a pas d'interdiction générale du NSFW pour les adultes, Venice laisse les abonnés Pro couper son filtre adulte, et {{appName}} ouvre ses modèles sans censure après une confirmation unique de vos 18 ans.",
    },
    private: {
      q: "Quelle alternative protège le mieux la vie privée ?",
      a: "Un outil local comme LM Studio : les prompts ne quittent jamais votre appareil. Côté hébergé, Venice et le mode incognito de {{appName}} gardent l'historique dans le navigateur. Gab AI garde l'historique sur ses serveurs et cite l'amélioration des modèles parmi ses finalités.",
    },
    api: {
      q: "Quelle alternative propose une API sans censure sans abonnement ?",
      a: "NanoGPT et OpenRouter facturent à l'usage, sans abonnement. Venice et uncensored.ai vendent des crédits API. L'API de Gab AI exige un forfait Plus actif. Sur {{appName}}, tout forfait dès {{apiSubPrice}} par mois la débloque.",
    },
    freedomLink: "Alternatives à FreedomGPT, comparées",
    kindsLink:
      "Abliterated, affiné ou vision du monde propre : les trois types",
  },
  cta: {
    title: "Écoutez chaque camp. Puis décidez.",
    subtitle:
      "{{guestCredits}} crédits gratuits par mois, sans compte. Lancez un chat incognito et posez la même question à deux modèles.",
    start: "Lancer un chat incognito",
    models: "Voir les modèles sans censure",
  },
};
