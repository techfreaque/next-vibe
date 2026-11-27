import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Modèles abliterated et IA non censurée",
    description:
      "Découvrez ce que l’abliteration change dans un modèle de langage, en quoi elle diffère du fine-tuning et comment comparer une variante à son modèle de base.",
    category: "Guide des modèles",
    imageAlt: "Les trois types de modèles d'IA non censurés, expliqués",
    keywords:
      "modèle abliteré, abliteré vs non censuré, qu'est-ce qu'un modèle abliteré, abliteration expliquée, LLM abliteré, modèles d'IA non censurés, IA non censurée, fine-tune non censuré, IA sans censure, abliterated vs uncensored, what is an abliterated model, abliterated LLM, uncensored AI models, GLM 5.3 Uncensored, DeepSeek V4.1 Flash Uncensored, Kimi K3.1 Pro Uncensored, UncensoredLM, {{appName}}",
  },
  hero: {
    backToBlog: "Retour au blog",
    category: "Guide des modèles",
    readTime: "8 min de lecture",
    title:
      "Qu’est-ce qui distingue les modèles abliterated des autres modèles non censurés ?",
    subtitle:
      "Voyez comment la modification des poids peut agir sur les refus, le style et la précision. Comparez l’abliteration, le fine-tuning et l’approche suivie pour {{ownName}}.",
  },
  intro: {
    lead: "Un LLM abliterated est un modèle de langage dont les poids ont été modifiés pour qu’il oppose moins souvent un refus. Il dérive d’un modèle existant et peut garder une partie de ses connaissances et de son style.",
    p2: "« Non censuré » est un terme plus large. Il regroupe des modèles abliterated, des modèles affinés pour répondre plus librement et des modèles entraînés à proposer un autre point de vue, comme {{ownName}}.",
  },
  online: {
    title: "Essayer un modèle abliterated en ligne",
    directoryLink: "Voir les modèles abliterated disponibles dans le chat",
    guideLink: "Découvrir le chat IA et les modèles non censurés",
    compare:
      "Sur {{appName}}, la fiche de chaque modèle indique sa fenêtre de contexte, ses fonctions et le coût estimé avant de lancer le chat. Si le modèle d’origine est disponible, comparez les deux versions.",
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
      how: "L’abliteration consiste à modifier les poids du modèle pour réduire les refus appris. Une étude de 2024 a identifié une direction associée aux refus dans les modèles de chat testés. L’effet de la suppression de ce signal varie selon le modèle et la requête.",
      keeps:
        "Le style et les connaissances du modèle de départ restent souvent reconnaissables. Vérifiez la précision et l’usage des outils sur la version choisie.",
      changes:
        "Une variante abliterated peut répondre à des requêtes que le modèle de départ refuse. Le résultat dépend du modèle et de la requête.",
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
      "La méthode indique où le développeur est intervenu. Le comparatif ci-dessous montre comment tester les différences sur vos propres requêtes.",
    sources: {
      paper:
        "Article : Refusal in language models is mediated by a single direction (arXiv)",
      blog: "L'abliteration expliquée pas à pas (blog Hugging Face)",
    },
  },
  ours: {
    title: "Autres modèles non censurés",
    intro:
      "Les autres modèles non censurés sur {{appName}} sont classés selon la méthode indiquée par leur fournisseur. Si celui-ci ne la publie pas, nous la laissons indéterminée.",
    abliterated: {
      title: "Modèles abliterated disponibles ({{count}})",
      body: "Pour coder ou analyser, vérifiez la prise en charge des outils. Pour les longues conversations ou la fiction, comparez les fenêtres de contexte.",
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
    title: "Modèles d’origine et variantes non censurées",
    intro:
      "Comparez les modèles de base et leurs variantes non censurées selon la méthode, la fenêtre de contexte et le coût estimé par message.",
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
        body: "Essayez une requête sans danger face à laquelle le modèle de base hésite, comme l’écriture d’une scène de fiction sombre. Comparez la franchise des réponses. Une seule réponse renseigne peu sur la méthode employée.",
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
      a: "Un modèle abliterated est un modèle de langage existant dont les poids ont été modifiés pour réduire les refus.",
    },
    difference: {
      q: "Quelle différence entre abliteré et non censuré ?",
      a: "Non censuré, c'est le comportement : le modèle répond. Abliteré, c'est une façon d'y arriver. Les autres : un fine-tune de décensure, ou un entraînement sur un autre matériau, comme {{ownName}}. Sur {{appName}}, {{abliteratedCount}} modèles non censurés sont abliterés et {{fineTunedCount}} sont fine-tunés.",
    },
    identify: {
      q: "Comment savoir si un modèle d’IA est abliterated ?",
      a: "Consultez la fiche du modèle ou les notes de version. Dans le catalogue de {{appName}}, la mention « abliterated » s’appuie sur la documentation du fournisseur.",
    },
    worse: {
      q: "L’abliteration peut-elle modifier la qualité d’un modèle ?",
      a: "Oui. La modification des poids peut agir sur la précision, le style et d’autres capacités. Comparez la variante exacte au modèle d’origine sur la même tâche.",
    },
    truly: {
      q: "{{ownName}} est-il un modèle abliterated ?",
      a: "{{ownName}} est classé à part. Son développeur décrit un modèle entraîné sur d’autres sources pour proposer un autre point de vue. Les modèles abliterated de cette page sont des variantes de modèles existants, modifiées pour réduire les refus.",
    },
    free: {
      q: "Puis-je essayer les modèles non censurés gratuitement ?",
      a: "Oui. {{guestCredits}} crédits gratuits par mois sans compte, {{freeCredits}} avec un compte gratuit, {{maxCredits}} avec la newsletter. De quoi faire le test de dix minutes sur les modèles non censurés les moins chers. Les modèles premium coûtent plus cher par message.",
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
