import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "DeepSeek non censuré : DeepSeek abliterated en ligne | {{appName}}",
    description:
      "Où se cache la censure de DeepSeek, pourquoi un autre hébergeur ne règle que la moitié, et les versions non censurées à tester en ligne. Sans GPU, sans compte.",
    category: "Guide des modèles",
    imageAlt:
      "DeepSeek non censuré : DeepSeek d'origine à côté de ses versions abliterated",
    keywords:
      "DeepSeek non censuré, DeepSeek sans censure, DeepSeek abliterated, DeepSeek sans filtre, DeepSeek V4.1 Flash Uncensored, censure DeepSeek, DeepSeek Tiananmen, DeepSeek non censuré en ligne, alternative au jailbreak DeepSeek, {{appName}}",
  },
  hero: {
    backToBlog: "Retour au blog",
    category: "Guide des modèles",
    readTime: "7 min de lecture",
    title: "DeepSeek non censuré. Ce qui enlève vraiment le filtre.",
    subtitle:
      "{{count}} versions non censurées de DeepSeek face au DeepSeek d'origine. À partir de {{buildPrice}} le message, dans le navigateur.",
  },
  intro: {
    lead: "DeepSeek est rapide, bon marché et redoutable en code. Posez-lui la mauvaise question et il se tait, change de sujet ou efface sa propre réponse.",
    p2: "Ce comportement a deux sources, et la plupart des solutions n'en traitent qu'une. Ci-dessous : où se trouve la censure, les trois façons de la contourner, et les versions non censurées de DeepSeek qui tournent en ce moment sur {{appName}}, prix en direct.",
  },
  where: {
    title: "Où se trouve la censure de DeepSeek",
    intro: "Deux couches. Elles ne s'enlèvent pas de la même façon.",
    app: "La couche appli. L'appli et le site de DeepSeek ajoutent une modération par-dessus le modèle. Les réponses sur les sujets sensibles en Chine s'arrêtent en pleine phrase ou sont remplacées par une formule toute faite.",
    weights:
      "Les poids. Le modèle lui-même a été entraîné à esquiver certains sujets et à en refuser d'autres, comme tout modèle grand public. Ça le suit partout où il tourne.",
    hosts:
      "Les autres hébergeurs. Comme DeepSeek publie ses poids, d'autres entreprises font tourner le même modèle sans la couche appli. Les suppressions en direct cessent. Les refus appris restent.",
    callout:
      "Faire tourner DeepSeek ailleurs retire le filtre de l'appli. Seule une version modifiée retire les refus appris par le modèle.",
  },
  ways: {
    title: "Trois façons d'avoir DeepSeek sans filtre",
    intro: "Du plus laborieux au plus simple.",
    localTitle: "1. Faire tourner les poids ouverts vous-même",
    local:
      "Les modèles DeepSeek complets sont bien trop gros pour un GPU domestique. La plupart des petits téléchargements estampillés DeepSeek sont des distillations : une base Qwen ou Llama entraînée sur des sorties de DeepSeek. Utile, mais c'est un autre modèle, avec d'autres refus.",
    hostedTitle: "2. Le DeepSeek d'origine chez un autre hébergeur",
    hosted:
      "Fini les suppressions en direct, les esquives apprises restent. Très bien pour le code et le quotidien. Pas la solution si ce sont les refus qui vous gênent.",
    buildTitle: "3. Une version non censurée",
    build:
      "Quelqu'un a pris les poids de DeepSeek et retiré le comportement de refus, en général par abliteration. Même modèle, même vitesse, même fenêtre de contexte. Il arrête d'esquiver. Hébergé, donc rien à installer.",
    noGpuLink: "Un LLM non censuré en ligne, sans GPU",
  },
  models: {
    title: "Les modèles DeepSeek sur la plateforme",
    intro:
      "D'abord les versions non censurées, puis les modèles d'origine dont elles viennent. En direct depuis notre catalogue.",
    colModel: "Modèle",
    colContext: "Contexte",
    colStrengths: "Points forts",
    colPrice: "Par message",
    colChat: "Essayer",
    chatLink: "Discuter avec {{model}}",
    footnote:
      "Prix d'un message de référence, notre marge de {{markup}} % comprise. L'étiquette sous chaque nom indique comment la version a été obtenue.",
  },
  builds: {
    title: "Les {{count}} versions non censurées de DeepSeek",
    intro: "Même famille, d'autres mains.",
    venice:
      "Servie par Venice.ai, refus retirés, appels d'outils intacts. Points forts : {{strengths}}. Un message de référence coûte {{price}}.",
    csf: "Une version abliterated du développeur indépendant jcartu, avec raisonnement et appels d'outils. Points forts : {{strengths}}. Un message de référence coûte {{price}}.",
    chatLink: "Discuter avec {{model}}",
    abliteration:
      "L'abliteration repère dans les activations du modèle la direction qui déclenche un refus et la retire des poids. Le reste de ce que le modèle a appris ne bouge pas. C'est pourquoi un DeepSeek abliterated code toujours comme DeepSeek.",
    explainerLink: "Modèles abliterated et non censurés, expliqués",
  },
  compare: {
    title: "D'origine contre non censuré, côte à côte",
    intro:
      "Contexte, prix, points forts et refus sur une seule page. Puis envoyez le même prompt aux deux.",
    link: "{{a}} contre {{b}}",
  },
  limits: {
    title: "Ce qu'une version non censurée ne change pas",
    intro: "Retirer les refus règle un problème. Pas tous.",
    knowledge:
      "Les connaissances. Le modèle sait ce que contenaient ses données d'entraînement. Retirer un refus n'ajoute pas les faits qu'il n'a jamais vus.",
    slant:
      "L'orientation. L'abliteration retire les refus, pas les penchants des données d'entraînement. Si vous voulez un modèle qui contredit le courant dominant exprès : {{ownModel}} est entraîné sur des livres et des documents bannis de l'internet grand public, ce qui en fait un modèle aux opinions politiques à contre-courant.",
    mistakes:
      "Les erreurs. Un modèle non censuré se trompe aussi souvent que l'original. Vérifiez ce qui compte.",
    callout:
      "Les modèles non censurés se débloquent après une confirmation unique de majorité. Ce que vous faites des réponses vous regarde.",
  },
  faq: {
    title: "FAQ",
    censored: {
      q: "DeepSeek est-il censuré ?",
      a: "Oui, sur deux couches. L'appli de DeepSeek modère les réponses sur les sujets sensibles en Chine, et le modèle lui-même a appris à esquiver ou refuser certaines demandes. Les autres hébergeurs retirent la première couche. Seule une version non censurée retire la seconde.",
    },
    exists: {
      q: "Existe-t-il un DeepSeek non censuré ?",
      a: "Oui. {{appName}} fait tourner {{count}} versions non censurées de DeepSeek, à commencer par {{buildName}}. Elles gardent les compétences et la fenêtre de contexte de DeepSeek, sans les esquives.",
    },
    local: {
      q: "Puis-je faire tourner DeepSeek non censuré en local ?",
      a: "Seulement avec du matériel sérieux. Les modèles complets demandent bien plus de mémoire qu'un PC de jeu. Les petits téléchargements DeepSeek sont surtout des distillations sur d'autres bases. Les versions hébergées évitent la question du matériel.",
    },
    china: {
      q: "DeepSeek non censuré répond-il aux questions sur la Chine ?",
      a: "Les esquives apprises sur ces sujets sont exactement le genre de refus que l'abliteration retire. La qualité de la réponse dépend toujours de ce que le modèle a appris. Posez la même question à {{stockName}} et à une version non censurée, puis comparez.",
    },
    api: {
      q: "Puis-je utiliser DeepSeek non censuré via une API ?",
      a: "Oui. Les mêmes versions tournent sur des endpoints compatibles OpenAI et Anthropic. Votre premier achat débloque les clés API, les formules démarrent à {{apiSubPrice}} par mois.",
    },
    free: {
      q: "Puis-je l'essayer gratuitement ?",
      a: "Oui. {{guestCredits}} crédits gratuits par mois sans compte, {{freeCredits}} avec un compte gratuit. De quoi envoyer de nombreux messages aux versions les moins chères.",
    },
    directoryLink: "Tous les modèles abliterated, avec contexte et prix",
    bestLink: "Le meilleur LLM non censuré, choisi par tâche",
    refusalLink: "Refusal Index : qui répond, qui refuse",
  },
  cta: {
    title: "Le cerveau de DeepSeek. Sans les esquives.",
    subtitle:
      "{{guestCredits}} crédits gratuits par mois, sans compte. Commencez avec {{buildName}}.",
    start: "Discuter avec DeepSeek non censuré",
    models: "Comparer tous les modèles",
  },
};
