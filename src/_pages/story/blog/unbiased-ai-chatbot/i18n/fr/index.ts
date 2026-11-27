import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "IA sans biais politique ? Aucune n'est neutre | {{appName}}",
    description:
      "L'IA sans biais politique n'existe pas. Pourquoi aucun chatbot n'est neutre, et comment modèles grand public, abliterated et contraires cadrent une question.",
    category: "Guide",
    imageAlt: "Une balance qui pèse les réponses de plusieurs chatbots IA",
    keywords:
      "IA sans biais politique, IA neutre, chatbot IA impartial, IA politiquement neutre, IA objective, ChatGPT est-il biaisé, biais politique des chatbots IA, chatbot IA conservateur, IA aux opinions à contre-courant, IA politique non censurée, demander les deux camps à une IA, {{appName}}",
  },
  hero: {
    backToBlog: "Retour au blog",
    category: "Guide",
    readTime: "7 min de lecture",
    title: "Le chatbot IA neutre n'existe pas. Interrogez-en plusieurs.",
    subtitle:
      "Pourquoi chaque modèle penche, comment {{count}} modèles cadrent la même question différemment, et une méthode en quatre étapes pour entendre tous les camps dans un seul chat.",
  },
  intro: {
    lead: "Chaque chatbot se dit équilibré. Puis il répond à la question d'un camp et fait la leçon à l'autre. Vous le remarquez. Tout le monde le remarque. La plupart en concluent qu'il leur faut l'IA neutre, la seule, la vraie.",
    p2: "Elle n'existe pas. Ce qui existe : des modèles aux angles différents, côte à côte. Sur {{appName}}, vous posez la même question à un modèle grand public, à un modèle abliterated et à un modèle aux opinions politiques à contre-courant, dans un seul chat, et vous jugez par vous-même.",
  },
  neutral: {
    title: "Pourquoi aucune IA n'est neutre",
    intro:
      "Le biais n'est pas un bug que quelqu'un a oublié de corriger. Il s'installe de trois façons.",
    data: "Les données d'entraînement : un modèle apprend de ce qui a été écrit, publié et conservé en ligne. Ce qui a été exclu ou supprimé le façonne autant que ce qui a été inclus.",
    tuning:
      "Le retour humain : après l'entraînement, des personnes notent les réponses et le modèle apprend à leur plaire. Leur idée de ce qui paraît raisonnable devient celle du modèle.",
    rules:
      "Les règles de refus : quelqu'un décide quelles questions sont nuisibles. C'est un jugement, et il frappe certains sujets plus fort que d'autres.",
    sourcesIntro: "Même les laboratoires et les chercheurs le disent :",
    sources: {
      openai: "OpenAI : définir et évaluer le biais politique des LLM",
      paper:
        "Article de recherche : la neutralité politique de l'IA est impossible",
    },
    callout:
      "La solution n'est pas un modèle parfait. C'est plus d'un modèle, et vous comme juge.",
  },
  frames: {
    title: "Quatre angles, une question",
    intro:
      "Les modèles penchent chacun à leur manière. Sachez quel angle vous lisez.",
    mainstream:
      "Les modèles grand public : les assistants des grands laboratoires. Performants et prudents, façonnés par les règles de sécurité de leur laboratoire. Sur les sujets controversés, ils nuancent à l'excès, ou refusent.",
    abliterated:
      "Les modèles abliterated : des modèles grand public ou ouverts, légèrement modifiés pour ne plus esquiver les questions. Ils répondent à tout, mais avec le même entraînement et la même vision du monde que leur modèle de base.",
    own: "{{ownModel}} : entraîné sur des livres et des documents bannis de l'internet grand public. Résultat : un modèle aux opinions politiques à contre-courant. L'autre côté du débat, dit sans détour.",
    gab: "{{gabModel}} : Gab le décrit comme construit autour de valeurs chrétiennes et de principes conservateurs. Un parti pris affiché, ce que la plupart des modèles ne font pas.",
    kindsLink: "Ce qui distingue les modèles abliterated des non censurés",
  },
  lineup: {
    title: "{{count}} modèles, {{count}} angles",
    intro:
      "Une sélection pour les questions controversées : des modèles phares grand public, un modèle phare abliterated, le modèle à contre-courant et un modèle au parti pris affiché. Contexte et prix tirés en direct de notre registre.",
    footnote:
      "Par message désigne un échange de référence sur la route la moins chère. Les modèles non censurés demandent une seule fois une confirmation 18+.",
  },
  table: {
    model: "Modèle",
    context: "Contexte",
    price: "Par message",
    chat: "Essayer",
    chatLink: "Interroger {{model}}",
  },
  method: {
    title: "Entendre tous les camps en quatre étapes",
    intro: "Un chat. Quelques changements de modèle. Votre propre verdict.",
    ask: {
      title: "Posez votre vraie question",
      body: "Pas une version adoucie. Posez-la comme à un ami qui n'est pas d'accord avec vous.",
    },
    switch: {
      title: "Changez de modèle, gardez le chat",
      body: "Choisissez un autre modèle dans le sélecteur et reposez la question. Le chat garde son historique, chaque modèle voit donc la même question.",
    },
    steelman: {
      title: "Demandez à chacun de défendre l'autre camp",
      body: "Demandez le meilleur argument contre sa propre réponse. Un modèle incapable de défendre sérieusement le camp d'en face vous montre son angle.",
    },
    check: {
      title: "Vérifiez les faits vous-même",
      body: "Là où les modèles divergent sur des faits, pas sur des opinions, vérifiez. {{ownModel}} présente les affirmations contestées aussi nettement que les faits établis. Les autres aussi, dans leur propre direction.",
    },
  },
  skills: {
    title: "Des skills qui défendent chaque camp",
    intro:
      "Un skill règle le persona et le modèle en un clic. Ceux-ci sont faits pour les terrains controversés.",
    historian: "Historien impartial : des faits, pas des récits",
    advocate: "Avocat du diable : remet en cause chaque hypothèse",
    debater: "Débatteur : traite les sujets controversés sous tous les angles",
    chan: "4chan : greentext et vannes, la voix du vieil imageboard, sans filtre",
  },
  pairs: {
    title: "{{ownModel}} face au grand public",
    intro:
      "Des pages de comparaison directe : contexte, prix et filtre du modèle à contre-courant face aux grands noms.",
    link: "{{a}} vs {{b}}",
  },
  faq: {
    title: "FAQ",
    exists: {
      q: "Existe-t-il un chatbot IA impartial ?",
      a: "Non. Chaque modèle est façonné par ses données d'entraînement, par les personnes qui ont noté ses réponses et par ses règles de refus. La réponse pratique : interroger plusieurs modèles aux angles différents et comparer. Sur {{appName}}, il suffit d'un chat et de quelques clics.",
    },
    chatgpt: {
      q: "ChatGPT a-t-il un biais politique ?",
      a: "Chaque modèle penche quelque part, et les assistants grand public nuancent à l'excès ou refusent sur les sujets controversés. OpenAI publie ses propres évaluations du biais politique de ses modèles. Posez la même question à un modèle d'un autre angle et la différence saute aux yeux.",
    },
    conservative: {
      q: "Existe-t-il un chatbot IA conservateur ou de droite ?",
      a: "Gab décrit {{gabModel}} comme construit autour de valeurs chrétiennes et de principes conservateurs. {{ownModel}} est entraîné sur des livres et des documents bannis de l'internet grand public. Résultat : un modèle aux opinions politiques à contre-courant. Les deux figurent dans le sélecteur de modèles de {{appName}}.",
    },
    truth: {
      q: "{{ownModel}} dit-il la vérité ?",
      a: "Il vous dit ce que les modèles grand public taisent. Il n'est pas neutre non plus, et il présente les affirmations contestées aussi nettement que les faits établis. Utilisez-le comme l'autre côté du débat et vérifiez les faits qui comptent.",
    },
    side: {
      q: "{{appName}} prend-il parti politiquement ?",
      a: "Non. Nous faisons tourner des modèles grand public, ouverts et non censurés côte à côte, et c'est vous qui choisissez. Ce que les gens lisent, ce sont les gens qui le décident, pas une entreprise.",
    },
    free: {
      q: "Puis-je comparer les modèles gratuitement ?",
      a: "Oui. Vous recevez {{guestCredits}} crédits gratuits par mois sans compte et {{freeCredits}} avec un compte gratuit, {{maxCredits}} avec la newsletter. Changer de modèle dans un chat ne coûte rien de plus.",
    },
    refusalLink: "L'indice de refus : quelle IA répond vraiment",
    jailbreakLink:
      "Pourquoi les jailbreaks de ChatGPT finissent toujours par casser",
    bestLink: "Le meilleur LLM non censuré, choisi selon l'usage",
  },
  cta: {
    title: "Entendez le camp que votre chatbot passe sous silence.",
    subtitle:
      "{{guestCredits}} crédits gratuits par mois, sans compte. Interrogez le modèle à contre-courant, puis changez et comparez.",
    start: "Interroger le modèle à contre-courant",
    models: "Comparer tous les modèles",
  },
};
