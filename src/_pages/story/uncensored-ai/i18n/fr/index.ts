import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "IA sans censure : le chat IA sans filtre, dans votre navigateur",
  metaTitle:
    "IA sans censure : chat IA sans filtre, essai gratuit | {{appName}}",
  description:
    "Une IA non censurée, sans filtre et sans inscription. Modèles abliterated et vraiment non censurés dans le navigateur, crédits gratuits pour les invités. Comparez les coûts et lancez-vous.",
  keywords:
    "IA sans censure, IA non censurée, chat IA sans filtre, ChatGPT sans filtre, IA sans filtre gratuit, chatbot sans censure, IA sans limite, IA abliterated",
  intro:
    "Pas d’inscription, pas de leçon de morale. Choisissez un modèle d’IA sans filtre pour votre question ou commencez par le moins cher. C’est vous qui décidez de ce que vous lisez.",
  tryModel: "Essayer {{model}}",
  chooseModel: "Comparer les modèles",
  choose:
    "Pour une question courte, essayez un modèle économique en haut de la liste. Pour un long document ou une longue conversation, une fenêtre de contexte plus large permet au modèle de traiter davantage de texte à la fois.",
  start:
    "Ouvrez le chat du modèle choisi. Si on vous le demande, confirmez que vous avez au moins 18 ans et acceptez les conditions, puis remplacez la question proposée par la vôtre.",
  models: "Les modèles d’IA non censurés disponibles",
  order:
    "Les modèles sont classés par coût estimé croissant, pour {{input}} jetons en entrée et {{output}} en sortie au tarif disponible le plus bas. Une conversation plus longue peut coûter davantage.",
  empty:
    "Aucun modèle de chat sans censure n’est disponible sur cette instance pour le moment.",
  context: "Fenêtre de contexte : {{tokens}} jetons",
  price: "Coût estimé par échange : {{credits}} crédits",
  chat: "Discuter avec {{model}}",
  questions: "IA sans censure : vos questions",
  faq: {
    access: {
      q: "Peut-on utiliser une IA sans censure gratuitement ?",
      a: "Sans compte, vous pouvez recevoir jusqu’à {{credits}} crédits gratuits par mois. Le nombre de messages dépend du modèle et de la longueur de la conversation.",
    },
    outOfCredits: {
      q: "Que se passe-t-il quand j’ai épuisé mes crédits sans compte ?",
      a: "Vous pouvez attendre le mois suivant ou créer un compte gratuit et confirmer votre adresse e-mail. Une fois l’adresse confirmée, vous pouvez recevoir jusqu’à {{credits}} crédits gratuits par mois. Les crédits déjà dépensés sans compte au cours du même mois sont déduits de ce total.",
    },
    chatgpt: {
      q: "Existe-t-il un ChatGPT sans filtre ?",
      a: "Non. Les modèles GPT d’OpenAI gardent leurs filtres partout, ici aussi. Les prompts de jailbreak ne tiennent que jusqu’à la prochaine mise à jour. La voie fiable, c’est un autre modèle : choisissez-en un dans la catégorie sans censure et posez votre question directement.",
    },
    kinds: {
      q: "Abliterated ou vraiment non censuré : quelle différence ?",
      a: "Les modèles abliterated sont des modèles grand public dont on a retiré les refus. Même entraînement, même vision du monde : ils répondent, c’est tout. {{model}} est un vrai modèle non censuré : entraîné sur des livres et des documents bannis de l’internet grand public, avec pour résultat des opinions politiques à contre-courant. La fiche de chaque modèle indique son type.",
    },
    filters: {
      q: "Une IA vraiment sans aucune limite, ça existe ?",
      a: "Ici, vous choisissez un modèle de la catégorie sans censure. Les modèles grand public comme GPT gardent leurs propres filtres. Un modèle sans censure peut encore refuser une demande ou se tromper. Vérifiez vous-même les faits importants.",
    },
    privacy: {
      q: "Mes conversations restent-elles privées ?",
      a: "Les chats en mode incognito restent dans votre navigateur, pas sur nos serveurs. Le fournisseur d’IA reçoit chaque message pour y répondre. Aucun traqueur tiers, aucun pixel publicitaire. Avec un compte, vous exportez vos données en JSON ou supprimez votre compte depuis les paramètres.",
    },
    legal: {
      q: "Une IA non censurée, est-ce légal ?",
      a: "Utiliser un modèle qui refuse moins n’est pas interdit. Ce que vous faites des réponses ou ce que vous publiez reste soumis aux mêmes lois que n’importe quel autre texte. Avant le premier modèle non censuré, vous confirmez une seule fois avoir au moins 18 ans.",
    },
    local: {
      q: "Faut-il une carte graphique pour utiliser ces modèles ?",
      a: "Un navigateur et une connexion internet suffisent. Le fournisseur traite votre demande. Pour exécuter entièrement un modèle sur votre machine, vous devez l’installer en local.",
    },
  },
  guides: "Comparer les modèles et les plateformes",
  chatgptGuide: "ChatGPT sans filtre : l’alternative",
  abliteratedChat: "Essayer en chat un modèle modifié par ablitération",
  compare: "Comparer les plateformes de chat IA sans censure",
  benchmark: "Voir comment les modèles répondent aux mêmes questions",
  breadcrumb: "IA non censurée",
  guidesTitle: "Guides sur l’IA sans censure et sans filtre",
  guidesIntro:
    "Quel modèle pour quelle tâche, ce que l’ablitération change dans un modèle, et comment discuter ou appeler une API sans GPU ni compte.",
  comparisons: "Comparatifs face à face",
  comparisonsIntro:
    "Deux modèles par page, côte à côte. Voyez ce qui les distingue avant de choisir.",
  versus: "{{a}} vs {{b}}",
};
