import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Les modèles d'IA non censurés, un par un | {{appName}}",
    description:
      "Tous les modèles d'IA non censurés d'unbottled.ai : modèles grand public sans refus, et UncensoredLM, entraîné sur des livres bannis. Forces et limites.",
    category: "Guide des modèles",
    imageAlt: "Guide des modèles non censurés de {{appName}}",
    keywords:
      "{{appName}}, modèles d'IA non censurés, modèles abliterés, abliteré vs non censuré, Venice, GLM non censuré, DeepSeek non censuré, Gab Arya, FreedomGPT, UncensoredLM, jeu de rôle non censuré, IA de jeu de rôle sombre, IA non censurée pour la politique, IA liberté d'expression",
  },
  hero: {
    backToBlog: "Retour au blog",
    category: "Guide des modèles",
    readTime: "7 min de lecture",
    title: "Les modèles non censurés, un par un.",
    subtitle:
      "Aucun modèle n'est le meilleur en tout. Voici ce que chaque modèle non censuré fait bien, où il pèche, et comment choisir le bon pour la tâche.",
  },
  intro: {
    lead: "Nous proposons actuellement {{uncensoredCount}} modèles non censurés. Ils ne sont pas interchangeables. Chacun vient d'un labo différent, repose sur une base différente et excelle dans des domaines différents.",
    p2: "Voici la visite honnête. De vrais fournisseurs, de vraies forces, de vraies faiblesses. Et deux sortes de non-censure. La plupart des modèles ici sont des modèles grand public dont on a retiré les refus : même entraînement, même vision du monde, ils arrêtent simplement d'esquiver. UncensoredLM est l'autre sorte : entraîné sur des livres et des documents bannis de l'internet grand public, avec des positions politiques à contre-courant. Cette différence décide lequel emmener sur la politique, les opinions hors du courant dominant et la fiction la plus sombre. Pour tout le reste, choisissez selon le travail à faire, pas selon l'étiquette la plus tapageuse.",
  },
  whatItMeans: {
    title: "Ce que « non censuré » veut vraiment dire ici",
    p1: "Chaque modèle de la plateforme porte un niveau de contenu : grand public, ouvert ou non censuré. Les modèles non censurés répondent sans le théâtre des refus ni le préambule moralisateur. Ils y arrivent de deux façons. La plupart sont des modèles grand public dont on a supprimé le réflexe de refus, par abliteration (la direction du refus est retirée des poids) ou par un fine-tuning de décensure. Même intelligence, mêmes données d'entraînement, même vision du monde. Ils arrêtent juste de dire non. L'autre voie, c'est une vision du monde différente. UncensoredLM vient d'uncensored.ai et il est entraîné sur des livres et des documents bannis de l'internet grand public. Interrogez-le sur la politique et vous obtiendrez des positions que les modèles grand public ne vous donneront pas, débridés ou non.",
    callout:
      "Débridé ou vision du monde différente. Un modèle abliteré est un modèle grand public qui répond à tout : interrogez-le sur la politique et il répondra comme son labo d'origine, l'esquive en moins. UncensoredLM voit le monde autrement, attendez-vous donc à des positions politiques à contre-courant. Prenez le premier pour la puissance sans les refus. Prenez le second pour l'autre côté du débat.",
    p2: "C'est vous qui choisissez le niveau. Personne ne le choisit à votre place. Un modèle non censuré ne répond ainsi que parce que vous l'avez sélectionné, et vous pouvez revenir à un modèle grand public dans la même discussion, sur le même compte.",
  },
  groups: {
    builtUncensored: {
      title: "Celui qui a sa propre vision du monde",
      intro:
        "UncensoredLM est à part. Ce n'est pas un modèle grand public débridé qui garde la vision du monde de son modèle d'origine. Il est entraîné sur des livres et des documents bannis de l'internet grand public, ce qui le place en tête sur trois usages : les questions politiques et controversées, les opinions que le courant dominant ne formule pas, et le jeu de rôle sombre et tabou.",
    },
    creative: {
      title: "Pour le jeu de rôle et la fiction sombre",
      intro:
        "Des personnages qui restent dans leur rôle, des scènes qui vont là où va l'histoire. UncensoredLM domine sur le sombre et le tabou. Les alternatives l'emportent sur les longues campagnes, l'entrée d'images ou le prix.",
      topPickReason:
        "Jeu de rôle et fiction sombres et tabous, écrits sans détour. Pas de scènes adoucies, pas d'aparté moral soudain, pas de personnage qui sort de son rôle pour vous faire la leçon. Ses données d'entraînement sortent du consensus prudent, donc rien ne pousse l'histoire vers plus de sagesse. Une limite : 32K de contexte, donc sur les très longues campagnes il oublie les premières scènes.",
    },
    viewpoint: {
      title: "Pour la politique, la controverse ou un autre point de vue",
      intro:
        "Une plateforme de liberté d'expression, c'est aussi proposer des modèles que les autres refusent. UncensoredLM est en tête ici. Gab Arya assume ouvertement un penchant à droite. FreedomGPT reste cash.",
      topPickReason:
        "Des questions politiques et controversées traitées dans votre cadre. Des positions hétérodoxes défendues jusqu'au bout. L'avocat du diable joué sérieusement, sans retour forcé à la ligne consensuelle ni morale. Il n'est pas neutre et énonce les affirmations contestées aussi nettement que les faits établis : vérifiez donc ses faits.",
    },
    reasoning: {
      title: "Quand il faut qu'il réfléchisse",
      intro:
        "Raisonnement, code, analyse. De solides modèles de base dont on a retiré les refus. Le plus d'intelligence de toute la gamme non censurée.",
    },
    fast: {
      title: "Quand il faut aller vite et pas cher",
      intro:
        "Faible coût par message, réponses rapides, grand contexte, et les trois lisent les images. Les bêtes de somme du quotidien.",
    },
  },
  cards: {
    goodLabel: "Points forts",
    weakLabel: "Points faibles",
    pageLink: "Voir la page de {{model}}",
    topPickLabel: "Premier choix",
    alternativesLabel: "Alternatives",
    uncensoredLm: {
      maker: "Uncensored.ai",
      basis:
        "Signé Uncensored.ai, entraîné sur des livres et des documents bannis de l'internet grand public. 32K de contexte, texte uniquement.",
      good: "Jeu de rôle et fiction sombres et tabous. Questions politiques et controversées. Opinions hors du courant dominant, défendues dans votre cadre. Pas de morale, pas de retour forcé à la ligne consensuelle. Appelle des outils.",
      weak: "Les très longues campagnes (32K de contexte), le code et les images. Il est expérimental et énonce les affirmations contestées aussi nettement que les faits établis : vérifiez donc les faits qu'il vous donne.",
    },
    freedomgpt: {
      maker: "Age of AI",
      basis: "Lignée à poids ouverts. 32K de contexte.",
      good: "Des réponses directes et rapides, sans sermon. Le chatbot qui a ouvert la catégorie liberté d'expression, réglé pour parler franc.",
      weak: "La profondeur. Les outils, le code et les longs argumentaires ne sont pas son terrain. Pour une vision du monde différente, et pas seulement moins de refus, UncensoredLM va plus loin.",
    },
    arya: {
      maker: "Gab",
      basis: "Modèle de base non communiqué. 131K de contexte.",
      good: "Un assistant orienté à droite, selon la présentation qu'en fait son créateur. Choisissez-le quand vous voulez délibérément ce penchant. Long contexte, appelle des outils.",
      weak: "L'éventail. Il argumente d'un seul côté, par conception. Sa base et son entraînement ne sont pas communiqués : considérez les détails comme non vérifiés. Pas un codeur.",
    },
    venice: {
      maker: "Venice.ai",
      basis:
        "Dolphin Mistral 24B, édition Venice. 128K de contexte, lit les images.",
      good: "Un généraliste non censuré bon marché, avec l'un des taux de refus les plus bas du marché. Fiction, discussion libre, entrée d'images, 128K de contexte.",
      weak: "Refus retirés, vision du monde conservée : c'est un fine-tune de Mistral, et ça se voit sur les scènes sombres et la politique. Le code et l'analyse poussée. Les appels d'outils passent par une méthode basée sur le prompt.",
    },
    veniceRoleplay: {
      maker: "Venice.ai",
      basis: "24B réglé pour le jeu de rôle. 128K de contexte, lit les images.",
      good: "Les longues campagnes. 128K de contexte gardent les premières scènes à portée, et il est réglé pour tenir la voix d'un personnage. Lit les images pour les illustrations de personnages et les références de scène.",
      weak: "Refus retirés, vision du monde conservée : son cadre d'origine peut adoucir les contenus les plus sombres. Tout ce qui est analytique : c'est un conteur, pas un assistant.",
    },
    deepseekFlash: {
      maker: "DeepSeek (via Venice)",
      basis:
        "DeepSeek V4.1 Flash, refus retirés. 1M de contexte, lit les images.",
      good: "Un contexte énorme pour des univers tentaculaires, à petit prix. Lit les images, appelle des outils et écrit du code quand l'histoire fait une pause.",
      weak: "Refus retirés, le cadre de DeepSeek reste. Sur la politique et les scènes les plus sombres, il peut tergiverser. Un généraliste, pas un conteur dédié.",
    },
    gemma: {
      maker: "Google (via Venice)",
      basis:
        "Gemma 4 26B MoE, filtre retiré. 256K de contexte, lit les images.",
      good: "Rapide, bon marché, multimodal. Une grande fenêtre de contexte pour un modèle non censuré à ce prix.",
      weak: "Le raisonnement profond. Il répond vite, il ne réfléchit pas longtemps. L'entraînement de Google façonne encore sa façon de présenter les sujets brûlants.",
    },
    qwen: {
      maker: "Alibaba (via Venice)",
      basis: "Qwen 3.6 Plus, refus retirés. 256K de contexte, lit les images.",
      good: "Le meilleur codeur et analyste de la gamme non censurée. Raisonne bien, lit les images, tient un long contexte.",
      weak: "Le prix. Cette puissance coûte plus cher par message que les modèles flash. Les refus ont disparu, pas les données d'entraînement d'Alibaba : attendez-vous à son cadre d'origine sur la politique.",
    },
    mimo: {
      maker: "Xiaomi (via NanoGPT)",
      basis:
        "MiMo V2.6 Flash, direction du refus ablatée. 1M de contexte, lit les images.",
      good: "Bon marché et rapide, multimodal, appelle des outils, avec une fenêtre de contexte énorme. Solide pour le travail non filtré à gros volume.",
      weak: "Il sacrifie un peu de profondeur à la vitesse. Pas le bon choix pour le raisonnement le plus difficile.",
    },
    glm53: {
      maker: "Z.AI (via NanoGPT)",
      basis:
        "Modèle de raisonnement GLM 5.3 complet, non censuré. 1M de contexte.",
      good: "Code, écriture et outils au niveau des modèles de pointe, non censurés, pour une fraction du prix d'un modèle phare abliteré. Le poids lourd.",
      weak: "La vitesse. C'est un gros modèle, encore marqué expérimental. Il ne refuse plus, mais sur les questions politiques il peut encore tergiverser comme le GLM d'origine.",
    },
    glm53Flash: {
      maker: "Z.AI (via NanoGPT)",
      basis: "MoE 320B, non censuré. 1M de contexte, lit les images.",
      good: "Rapide, bon marché, multimodal, 1M de contexte. Le modèle de tous les jours pour le travail non filtré.",
      weak: "Le raisonnement le plus ardu. Pour ça, prenez le GLM 5.3 complet.",
    },
  },
  why: {
    title: "Pourquoi le choix compte",
    intro: "Le choix n'est pas une fonctionnalité annexe. C'est tout l'enjeu.",
    p1: "Le refus d'un modèle est la réponse d'un autre. Une question médicale, un cas juridique limite, un texte de fiction, un rapport de sécurité, un point de vue hors du courant dominant : un modèle filtré unique décide à votre place de ce que vous avez le droit de demander. Un éventail de modèles vous rend cette décision.",
    p2: "La gamme non censurée est aussi tout simplement une meilleure boîte à outils. UncensoredLM pour le jeu de rôle sombre, la fiction taboue, la politique et les opinions que le courant dominant évite. Venice Role Play pour les longues campagnes. Qwen pour le code que d'autres modèles signalent. GLM 5.3 pour le raisonnement de pointe. Un modèle flash pour le volume à bas coût. Gab Arya quand vous voulez délibérément un penchant à droite. Des tâches différentes, des outils différents. Vous gardez aussi les modèles grand public, sur le même compte, pour quand un filtre est exactement ce que le travail demande.",
    callout:
      "Non censuré ne veut pas dire irresponsable. Vous répondez de ce que vous générez, et la loi s'applique toujours. Ce qui change ici, c'est qui tient le curseur : vous, pas le fournisseur du modèle.",
  },
  howToPick: {
    title: "Comment choisir en pratique",
    p1: "Partez de la tâche. Politique, questions controversées, point de vue hors consensus, fiction sombre ou taboue : UncensoredLM, celui qui a sa propre vision du monde. Campagnes trop longues pour 32K, ou scènes qui demandent des images : Venice Role Play. Généraliste bon marché : Venice Uncensored. Code ou analyse sans refus : Qwen 3.6 Plus Uncensored ou GLM 5.3 Uncensored complet. Gros volume, faible coût, multimodal : GLM 5.3 Flash, Gemma 4 ou MiMo.",
    p2: "Vous voulez délibérément un penchant à droite : Gab Arya, selon la présentation de son créateur. Du franc-parler direct : FreedomGPT Liberty. Vous hésitez ? Mettez-en deux côte à côte et comparez-les sur votre propre prompt.",
    compareLink: "Comparer {{a}} et {{b}}",
  },
  cta: {
    title: "Choisissez un modèle. Réglez votre filtre.",
    subtitle:
      "Tous les modèles non censurés présentés ici sont disponibles dans le chat. Comparez-les sur votre propre question, ou lancez simplement la conversation.",
    chat: "Démarrer une discussion",
    models: "Parcourir tous les modèles",
  },
};
