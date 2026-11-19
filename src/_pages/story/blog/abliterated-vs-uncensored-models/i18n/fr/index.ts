import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Modèle abliteré ou non censuré : les 3 types d'IA expliqués",
    description:
      "Abliteré, fine-tuné ou doté de sa propre vision du monde : ce que change chaque type de modèle d'IA non censuré, comment les distinguer en dix minutes, et quel modèle de {{appName}} relève de quel type.",
    category: "Guide des modèles",
    imageAlt: "Les trois types de modèles d'IA non censurés, expliqués",
    keywords:
      "modèle abliteré, abliteré vs non censuré, qu'est-ce qu'un modèle abliteré, abliteration expliquée, LLM abliteré, modèles d'IA non censurés, IA non censurée, fine-tune non censuré, chat IA non censuré, IA sans censure, abliterated vs uncensored, what is an abliterated model, abliterated LLM, uncensored AI models, GLM 5.3 Uncensored, DeepSeek V4.1 Flash Uncensored, Kimi K3.1 Pro Uncensored, UncensoredLM, {{appName}}",
  },
  hero: {
    backToBlog: "Retour au blog",
    category: "Guide des modèles",
    readTime: "8 min de lecture",
    title:
      "Abliteré, fine-tuné ou sa propre vision du monde. Trois sortes d'IA non censurée.",
    subtitle:
      "{{uncensoredCount}} modèles non censurés sur {{appName}}, classés selon la façon dont ils ont perdu leur filtre. Ce que chaque méthode change, ce qu'elle laisse intact, et un test de dix minutes pour les distinguer.",
  },
  intro: {
    lead: "Deux modèles affichent tous les deux « non censuré ». L'un répond à votre question politique avec la voix du labo qui l'a construit. L'autre défend la position inverse. Même étiquette, machines différentes.",
    p2: "Il existe trois façons d'empêcher un modèle d'IA de refuser, et elles donnent trois modèles différents. Ce guide explique chaque méthode simplement, montre comment chacun de nos modèles a été fabriqué, place trois modèles ouverts à côté de leur version non censurée et vous donne un test à faire vous-même.",
  },
  label: {
    title: "Pourquoi « non censuré » ne dit presque rien",
    p1: "« Non censuré » décrit un comportement : le modèle répond au lieu de refuser. Ça ne dit rien de la façon dont il y est arrivé. Les hébergeurs mettent des choses très différentes derrière ce mot, et les noms de modèles mélangent librement « abliterated », « uncensored », « heretic » et « unfiltered ».",
    p2: "La méthode compte, parce qu'elle décide de ce qui a changé d'autre. Seuls les refus ont-ils disparu, ou le style d'écriture aussi ? La vision du monde du modèle a-t-elle bougé, ou seulement sa volonté de la partager ? Ces réponses décident du modèle qui convient à votre travail.",
  },
  methods: {
    title: "Les trois méthodes",
    intro: "Du plus petit changement au plus grand.",
    abliterated: {
      title: "1. Abliteré : le refus retiré des poids",
      how: "Une recherche de 2024 a montré que le refus, dans les modèles de chat, passe par une seule direction à l'intérieur du modèle. L'abliteration mesure cette direction en comparant les réactions du modèle aux prompts qu'il refuse et à ceux auxquels il répond, puis la retire des poids. Aucune nouvelle donnée d'entraînement, aucun réentraînement.",
      keeps:
        "Conserve : les connaissances du modèle de base, son style d'écriture, ses appels d'outils et sa vision du monde. Le même modèle, sans le réflexe de dire non.",
      changes:
        "Change : les refus s'arrêtent presque tous. Sur les questions politiques ou morales, il répond toujours comme son labo d'origine l'a entraîné à le faire, l'esquive en moins.",
    },
    fineTuned: {
      title: "2. Fine-tuné : réentraîné pour répondre",
      how: "Un fine-tune de décensure prolonge l'entraînement du modèle sur des exemples qui récompensent les réponses directes : fiction, jeu de rôle, conversation libre. Dolphin, la base de Venice Uncensored, en est l'un des exemples les plus connus. Les fine-tunes de jeu de rôle vont plus loin et s'entraînent sur des histoires.",
      keeps:
        "Conserve : l'essentiel des connaissances du modèle de base. La vision du monde sous-jacente vient toujours de l'entraînement d'origine du modèle de base.",
      changes:
        "Change : les refus, et souvent la voix. Un fine-tune n'écrit pas comme sa base : plus libre, plus vivant, parfois plus répétitif. La qualité dépend entièrement des données d'entraînement.",
    },
    ownWorldview: {
      title: "3. Sa propre vision du monde : un autre matériau d'entraînement",
      how: "Les deux premières méthodes partent d'un modèle grand public et retirent les freins. {{ownName}} prend une autre voie : il est entraîné sur des livres et des documents bannis de l'internet grand public. Résultat : un modèle aux opinions politiques à contre-courant.",
      keeps:
        "Conserve : rien du cadrage d'un modèle grand public. Il n'y a aucune ligne consensuelle vers laquelle revenir.",
      changes:
        "Change : les réponses elles-mêmes. Interrogez-le sur la politique et vous obtenez des positions que les modèles grand public ne vous donneront pas, débridés ou non.",
    },
    callout:
      "En bref. Les modèles abliterés et fine-tunés sont des modèles grand public qui ont arrêté d'esquiver : même vision du monde, ils répondent, c'est tout. {{ownName}} est de l'autre sorte : une vision du monde différente. Prenez les premiers pour la puissance sans les refus. Prenez le second pour l'autre côté du débat.",
    sources: {
      paper:
        "Article : Refusal in language models is mediated by a single direction (arXiv)",
      blog: "L'abliteration expliquée pas à pas (blog Hugging Face)",
    },
  },
  ours: {
    title: "Lequel de nos modèles est de quel type",
    intro:
      "En direct depuis notre registre de modèles : tous les modèles non censurés de {{appName}} en ce moment, regroupés selon leur fabrication. Nous n'indiquons une méthode que lorsque le fournisseur du modèle la documente.",
    abliterated: {
      title: "Abliterés ({{count}})",
      body: "Des modèles grand public et ouverts dont on a retiré la direction du refus. Le plus de puissance parmi les non censurés : raisonnement, code, outils.",
    },
    fineTuned: {
      title: "Fine-tunés ({{count}})",
      body: "Réentraînés pour répondre, surtout pour la fiction et le jeu de rôle. Attendez-vous à une voix différente de celle du modèle de base.",
    },
    ownWorldview: {
      title: "Vision du monde propre ({{count}})",
      body: "Entraîné sur des livres et des documents bannis de l'internet grand public. Le choix pour la politique, les autres points de vue et la fiction la plus sombre.",
    },
    unlisted: {
      title: "Méthode non publiée ({{count}})",
      body: "Non censurés, mais le fournisseur ne dit pas comment. Testez-les avec les étapes ci-dessous avant de compter dessus.",
    },
  },
  pairs: {
    title: "Le même modèle, filtre activé et désactivé",
    intro:
      "Trois modèles ouverts à côté de leur version non censurée. Même labo, même base. Ce qui change : les refus, et le prix.",
    colBase: "Modèle de base",
    colUncensored: "Version non censurée",
    colMethod: "Méthode",
    colContext: "Contexte",
    colPrice: "Prix par message",
    method: {
      abliterated: "Abliteré",
      fineTuned: "Fine-tuné",
      ownWorldview: "Vision du monde propre",
      unlisted: "Non publiée",
    },
    price: "{{base}} contre {{uncensored}}",
    ratio: "Le non censuré coûte {{ratio}}x",
    footnote:
      "Quand le filtre ne vous gêne jamais, le modèle de base est le choix le moins cher.",
    compareLink: "Comparer {{a}} et {{b}}",
  },
  test: {
    title: "Les distinguer en dix minutes",
    intro:
      "Les noms de modèles mentent, le comportement non. Lancez les trois mêmes prompts sur deux modèles dans un seul chat et observez ce qui change.",
    steps: {
      refusal: {
        title: "Le test du refus",
        body: "Demandez ce que le modèle de base esquive : une question médicale franche, une scène sombre, un rapport de sécurité. Tout modèle non censuré doit répondre. S'il refuse encore ou noie la réponse sous les avertissements, la décensure est superficielle.",
      },
      voice: {
        title: "Le test de la voix",
        body: "Demandez aux deux la même nouvelle courte. Une version abliterée se lit comme son modèle de base. Un fine-tune sonne nettement autrement : son propre rythme, ses propres mots fétiches.",
      },
      worldview: {
        title: "Le test de la vision du monde",
        body: "Posez une question politique disputée et exigez une position claire, pas une liste de points de vue. Les modèles abliterés et fine-tunés répondent dans le cadrage de leur labo d'origine. {{ownName}} défend une position que les modèles grand public ne prendront pas.",
      },
      switch: {
        title: "Changez de modèle en pleine discussion",
        body: "Choisissez un autre modèle et envoyez le message suivant. La discussion garde son historique et le nouveau modèle le lit en entier : vous comparez sur exactement le même contexte.",
      },
    },
    callout:
      "Vérifiez les faits dans tous les cas. Retirer les refus n'ajoute pas d'exactitude, et un modèle à la vision du monde différente énonce les affirmations contestées aussi franchement que les faits établis.",
  },
  tradeoffs: {
    title: "Ce que chaque méthode vous coûte",
    intro: "Aucune méthode n'est gratuite.",
    abliterated:
      "Abliteré : peut perdre un peu d'exactitude. L'article qui a popularisé la méthode a mesuré une baisse sur les benchmarks après l'abliteration, et en a récupéré l'essentiel avec une passe d'entraînement supplémentaire. En échange, vous gardez les compétences du modèle de base, outils compris.",
    fineTuned:
      "Fine-tuné : ne vaut que ses données d'entraînement. Une belle prose sur les histoires, plus faible sur le code et l'analyse. Les fine-tunes de jeu de rôle sont des conteurs, pas des assistants.",
    ownWorldview:
      "Vision du monde propre : pas neutre par conception, vérifiez donc ses faits. {{ownName}} tient {{ownContext}} tokens de contexte et ce n'est pas un codeur.",
  },
  pick: {
    title: "Quel type pour quelle tâche",
    capability:
      "Code, analyse, recherche sans refus : une version abliterée d'un modèle puissant.",
    fiction:
      "Jeu de rôle et fiction avec une voix vivante : un fine-tune, ou un modèle abliteré à long contexte pour les longues campagnes.",
    viewpoint:
      "Politique, questions controversées, l'autre côté d'un débat : {{ownName}}.",
    unsure:
      "Pas sûr ? Mettez deux modèles côte à côte sur votre propre prompt. Ça vaut mieux que n'importe quelle étiquette.",
    consent:
      "Les modèles non censurés sont réservés aux adultes. La première fois que vous en choisissez un, vous confirmez avoir 18 ans ou plus. Une seule fois. Ensuite, c'est vous qui décidez de ce que vous demandez, pas une multinationale. La loi de votre pays s'applique toujours.",
  },
  faq: {
    title: "FAQ",
    whatIs: {
      q: "Qu'est-ce qu'un modèle abliteré ?",
      a: "Un modèle dont la direction du refus a été retirée des poids. Des chercheurs ont découvert que le refus passe par une seule direction à l'intérieur du modèle. L'abliteration la mesure et la coupe, sans réentraînement. Le modèle garde ses connaissances et sa vision du monde, et cesse de refuser.",
    },
    difference: {
      q: "Quelle différence entre abliteré et non censuré ?",
      a: "Non censuré, c'est le comportement : le modèle répond. Abliteré, c'est une façon d'y arriver. Les autres : un fine-tune de décensure, ou un entraînement sur un autre matériau, comme {{ownName}}. Sur {{appName}}, {{abliteratedCount}} modèles non censurés sont abliterés et {{fineTunedCount}} sont fine-tunés.",
    },
    worse: {
      q: "Les modèles abliterés sont-ils plus bêtes que l'original ?",
      a: "Un peu, parfois. Retirer la direction du refus peut coûter un peu d'exactitude, et une passe d'entraînement supplémentaire en récupère l'essentiel. Pour la plupart des tâches, vous gardez les points forts du modèle de base. Comparez les deux sur votre propre prompt.",
    },
    truly: {
      q: "Quel modèle non censuré l'est vraiment ?",
      a: "Les modèles abliterés et fine-tunés cessent de refuser mais gardent une vision du monde grand public. {{ownName}} est entraîné sur des livres et des documents bannis de l'internet grand public : il a donc ses propres opinions politiques à contre-courant. Lequel est « vraiment » non censuré dépend de ce que vous voulez : des réponses, ou un autre regard.",
    },
    free: {
      q: "Puis-je essayer les modèles non censurés gratuitement ?",
      a: "Oui. {{guestCredits}} crédits gratuits par mois sans compte, {{freeCredits}} avec un compte gratuit. De quoi faire le test de dix minutes sur les modèles non censurés les moins chers. Les modèles premium coûtent plus cher par message.",
    },
    legal: {
      q: "Les modèles d'IA non censurés sont-ils légaux ?",
      a: "Un modèle est un outil. Ce que vous générez et publiez relève de votre responsabilité, et la loi de votre pays s'y applique. Sur {{appName}}, les modèles non censurés se débloquent après une confirmation unique de majorité (18+).",
    },
    ownLink: "Voir la page du modèle {{ownName}}",
    guideLink: "Lire le guide des modèles non censurés, modèle par modèle",
  },
  cta: {
    title: "Faites le test vous-même.",
    subtitle:
      "{{guestCredits}} crédits gratuits par mois, sans compte. Abliteré, fine-tuné ou {{ownName}} : changez à chaque message.",
    chat: "Lancer un chat incognito",
    models: "Voir tous les modèles",
  },
};
