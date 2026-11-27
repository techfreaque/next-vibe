import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Meilleur LLM non censuré 2026 : choisi par tâche | {{appName}}",
    description:
      "Le meilleur LLM non censuré pour raisonner, coder, la fiction sombre ou les avis à contre-courant. GLM 5.3 Uncensored contre DeepSeek V4.1 Flash Uncensored.",
    category: "Guide des modèles",
    imageAlt: "Les meilleurs LLM non censurés, classés par tâche",
    keywords:
      "meilleur LLM non censuré, meilleure IA sans censure, meilleur modèle IA non censuré, meilleur modèle abliterated, LLM non censuré 2026, GLM uncensored vs DeepSeek uncensored, GLM 5.3 uncensored, DeepSeek V4.1 Flash uncensored, meilleur modèle non censuré pour le jeu de rôle, meilleur modèle non censuré pour coder, classement LLM non censurés, {{appName}}",
  },
  hero: {
    backToBlog: "Retour au blog",
    category: "Guide des modèles",
    readTime: "8 min de lecture",
    title:
      "Le meilleur LLM non censuré. Choisi par tâche, pas par effet de mode.",
    subtitle:
      "Un gagnant par tâche parmi {{count}} modèles non censurés en ligne, plus le duel GLM contre DeepSeek. Contexte et prix lus en direct dans notre registre de modèles.",
  },
  intro: {
    lead: "Chaque liste des « meilleurs LLM non censurés » sacre un seul modèle. Puis vous l'essayez sur votre travail et ce n'est pas le bon. Un modèle qui écrit bien la fiction sombre n'est pas celui qu'il vous faut pour du code. Le moins cher n'est pas celui qu'il vous faut pour une argumentation serrée.",
    p2: "Cette liste désigne donc un gagnant par tâche. Chaque choix tourne sur {{appName}} dans un onglet du navigateur, chaque chiffre vient de notre registre, et vous passez de l'un à l'autre dans la même conversation.",
  },
  method: {
    title: "Comment nous avons choisi",
    intro: "Quatre questions par modèle. Aucun score de benchmark inventé.",
    answers:
      "Est-ce qu'il répond ? Chaque modèle ici appartient au niveau non censuré : il prend la question au lieu de vous faire la leçon.",
    base: "Quelle est la force de la base ? Les modèles phares abliterated gardent l'intelligence de leur labo. Les petits fine-tunes en échangent une partie contre du style.",
    context:
      "Combien retient-il ? Le contexte décide s'il garde un long document en tête ou oublie la première page.",
    price:
      "Combien ça coûte ? Prix par message de référence, sur la route publique la moins chère, marge comprise.",
    callout:
      "Vous voulez la preuve qu'un modèle répond ? Notre indice de refus pose les mêmes questions à chaque modèle et compte qui refuse.",
    refusalLink: "L'indice de refus : quelle IA répond vraiment",
  },
  picks: {
    title: "Les gagnants, tâche par tâche",
    intro:
      "Un modèle par tâche, jamais deux fois le même. Si un choix passe hors ligne, le modèle suivant avec le même point fort prend sa place.",
    facts:
      "Contexte de {{context}}. {{price}} par message. Point fort : {{strengths}}.",
    reasoning: {
      title: "{{number}}. Le meilleur pour raisonner et analyser : {{model}}",
      body: "Un modèle de base phare dont on a retiré les refus. Pour les réponses qui demandent une vraie réflexion : une question controversée argumentée jusqu'au bout, un long document disséqué, un plan mis à l'épreuve.",
    },
    everyday: {
      title: "{{number}}. Le meilleur au quotidien : {{model}}",
      body: "Rapide, bon marché et doté d'une mémoire énorme. Le modèle à laisser sélectionné pour les questions courantes, les brouillons rapides et les longues conversations qui coûteraient trop cher sur un modèle phare.",
    },
    coding: {
      title: "{{number}}. Le meilleur pour coder : {{model}}",
      body: "Orienté code et raisonnement, sans les refus qui bloquent la recherche en sécurité, le scraping ou les questions de rétro-ingénierie que les assistants grand public esquivent.",
    },
    fiction: {
      title:
        "{{number}}. Le meilleur pour le jeu de rôle et la fiction sombre : {{model}}",
      body: "Réglé pour le jeu de rôle, y compris le jeu de rôle sombre. Reste dans son personnage, écrit la scène violente ou explicite et ne casse pas l'histoire pour faire la morale.",
    },
    viewpoint: {
      title:
        "{{number}}. Le meilleur pour les avis à contre-courant : {{model}}",
      body: "Le seul choix ici qui n'est pas un modèle grand public débridé. Entraîné sur des livres et des documents bannis de l'internet grand public. Résultat : un modèle aux opinions politiques à contre-courant. Demandez-lui ce que les autres ne diront pas, et vérifiez ses faits.",
    },
    vision: {
      title: "{{number}}. Le meilleur pour les images : {{model}}",
      body: "Lit les images que vous envoyez et y répond sans les refus habituels. Assez bon marché pour passer chaque capture d'écran.",
    },
  },
  versus: {
    title: "{{a}} vs {{b}}",
    intro:
      "Les deux modèles phares abliterated que l'on compare le plus. Même idée, refus retirés, points forts différents.",
    glm: "{{model}} : la version abliterated de GLM-5.3. Choisissez-la quand la réponse demande de la profondeur : raisonnement, analyse, code.",
    deepseek:
      "{{model}} : la version abliterated de DeepSeek V4.1 Flash. Un modèle Flash : moins cher par message, rapide, également orienté jeu de rôle. Choisissez-le pour le volume.",
    verdict:
      "En bref : le travail de réflexion pour GLM, le volume et le jeu de rôle pour DeepSeek. Les deux répondent. Changez en pleine conversation et comparez sur votre propre question.",
    compareLink: "Comparaison complète : {{a}} vs {{b}}",
  },
  all: {
    title: "Les {{count}} modèles non censurés, du moins cher au plus cher",
    intro:
      "Tout le niveau non censuré de {{appName}} en ce moment. Cliquez sur un modèle pour sa page, ou lancez une conversation avec lui.",
    footnote:
      "Par message désigne un échange de référence sur la route la moins chère. Les longues conversations et les longues réponses coûtent plus. Les points forts sont des tags du registre.",
  },
  table: {
    model: "Modèle",
    context: "Contexte",
    strengths: "Point fort",
    price: "Par message",
    chat: "Essayer",
    chatLink: "Discuter avec {{model}}",
  },
  kinds: {
    title: "Deux sortes de non-censuré. Sachez laquelle vous choisissez.",
    intro: "L'étiquette cache une vraie différence.",
    abliterated:
      "Les versions abliterated et affinées : des modèles grand public ou ouverts, légèrement modifiés pour ne plus esquiver les questions. Même entraînement, même vision du monde. Ils répondent, c'est tout.",
    own: "{{ownModel}} : entraîné sur des livres et des documents bannis de l'internet grand public. Résultat : un modèle aux opinions politiques à contre-courant.",
    explainerLink:
      "Ce qu'est l'abliteration et en quoi elle diffère des autres méthodes",
    tourLink: "Chaque modèle non censuré, un par un",
  },
  local: {
    title: "En local ou hébergé ?",
    intro:
      "La plupart des classements partent du principe que vous faites tourner le modèle vous-même. C'est une option parmi d'autres.",
    local:
      "En local : confidentialité totale et aucun prix par message, mais les gros modèles demandent plus de mémoire GPU qu'aucun PC domestique n'en a.",
    hosted:
      "Hébergé : chaque modèle de cette page dans un navigateur, y compris ceux de taille frontière. Le fournisseur voit votre prompt.",
    api: "API : les mêmes modèles via des endpoints compatibles OpenAI et Anthropic. Les clés API se débloquent avec n'importe quel achat.",
    noGpuLink: "Un LLM non censuré en ligne, sans GPU",
    apiLink: "API de LLM non censuré : identifiants, prix, code",
  },
  pairs: {
    title: "D'autres duels",
    intro:
      "Vision du monde propre contre abliterated, et modèles de base contre leurs versions non censurées.",
    link: "{{a}} vs {{b}}",
  },
  faq: {
    title: "FAQ",
    best: {
      q: "Quel est le meilleur LLM non censuré, tous usages confondus ?",
      a: "Pour la plupart des questions difficiles, {{topModel}} : un modèle de base phare dont on a retiré les refus. Pour les avis à contre-courant, {{ownModel}}. Pour du volume pas cher, une version Flash. Sur {{appName}}, vous passez de l'un à l'autre des {{count}} dans la même conversation.",
    },
    free: {
      q: "Quel est le meilleur LLM non censuré gratuit ?",
      a: "En ligne, {{appName}} vous donne {{guestCredits}} crédits gratuits par mois sans compte et {{freeCredits}} avec un compte gratuit, {{maxCredits}} avec la newsletter. Le modèle non censuré le moins cher, {{cheapestModel}}, coûte {{cheapestPrice}} par message. Les modèles non censurés demandent une confirmation 18+ unique.",
    },
    roleplay: {
      q: "Quel est le meilleur modèle non censuré pour le jeu de rôle ?",
      a: "Un modèle réglé pour le jeu de rôle sombre : il reste dans son personnage et écrit les scènes dures. Pour les personnages politiques ou tabous, {{ownModel}} apporte une vision du monde que les modèles grand public n'ont pas.",
    },
    coding: {
      q: "Quel est le meilleur modèle non censuré pour coder ?",
      a: "Une version abliterated d'un bon modèle de code. Elle garde le savoir-faire du modèle de base et perd les refus qui bloquent la recherche en sécurité et d'autres questions que les assistants grand public esquivent.",
    },
    quality: {
      q: "Les modèles abliterated perdent-ils en qualité ?",
      a: "Un peu, selon la méthode. L'abliteration retire la direction du refus dans les poids. Bien faite, elle laisse au modèle presque tout son savoir-faire. Les petits fine-tunes peuvent perdre davantage. Comparez un modèle de base et sa version non censurée côte à côte avant de décider.",
    },
    api: {
      q: "Puis-je utiliser ces modèles non censurés via une API ?",
      a: "Oui. Chaque modèle de texte ici fonctionne via des endpoints compatibles OpenAI et Anthropic. Les clés API se débloquent avec n'importe quel achat.",
    },
    writerLink: "La meilleure IA sans censure pour les auteurs de fiction",
    directoryLink: "Tous les modèles abliterated, hébergés",
    platformsLink: "Les plateformes d'IA sans censure comparées",
  },
  cta: {
    title: "Assez de classements. Posez la vraie question.",
    subtitle:
      "{{guestCredits}} crédits gratuits par mois, sans compte. Commencez par le gagnant, changez quand vous voulez.",
    start: "Discuter avec {{topModel}}",
    models: "Comparer tous les modèles",
  },
};
