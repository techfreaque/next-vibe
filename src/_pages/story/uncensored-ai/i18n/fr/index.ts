import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Chat IA sans censure dans votre navigateur",
  metaTitle: "Chat IA sans censure et sans compte | {{appName}}",
  description:
    "Essayez un chatbot sans censure dans votre navigateur avec des crédits gratuits sans compte. Comparez le contexte et le coût estimé des modèles ou lancez la discussion.",
  intro:
    "Commencez à discuter sans créer de compte. Choisissez un modèle adapté à votre question ou essayez celui dont le coût estimé par échange est le plus bas.",
  tryModel: "Essayer {{model}}",
  chooseModel: "Comparer les modèles",
  choose:
    "Pour une question courte, essayez un modèle économique en haut de la liste. Pour un long document ou une longue conversation, une fenêtre de contexte plus large permet au modèle de traiter davantage de texte à la fois.",
  start:
    "Ouvrez le chat du modèle choisi. Si on vous le demande, confirmez que vous avez au moins 18 ans et acceptez les conditions, puis remplacez la question proposée par la vôtre.",
  models: "Choisir un modèle de chat",
  order:
    "Les modèles sont classés par coût estimé croissant, pour {{input}} jetons en entrée et {{output}} en sortie au tarif disponible le plus bas. Une conversation plus longue peut coûter davantage.",
  empty:
    "Aucun modèle de chat sans censure n’est disponible sur cette instance pour le moment.",
  context: "Fenêtre de contexte : {{tokens}} jetons",
  price: "Coût estimé par échange : {{credits}} crédits",
  chat: "Discuter avec {{model}}",
  questions: "Avant de commencer",
  faq: {
    access: {
      q: "Puis-je essayer gratuitement un chat IA sans censure ?",
      a: "Sans compte, vous pouvez recevoir jusqu’à {{credits}} crédits gratuits par mois. Le nombre de messages dépend du modèle et de la longueur de la conversation.",
    },
    outOfCredits: {
      q: "Que se passe-t-il quand j’ai épuisé mes crédits sans compte ?",
      a: "Vous pouvez attendre le mois suivant ou créer un compte gratuit et confirmer votre adresse e-mail. Une fois l’adresse confirmée, vous pouvez recevoir jusqu’à {{credits}} crédits gratuits par mois. Les crédits déjà dépensés sans compte au cours du même mois sont déduits de ce total.",
    },
    filters: {
      q: "Que signifie ici « chat IA sans filtre » ?",
      a: "Vous choisissez un modèle de la catégorie sans censure. Les modèles grand public comme GPT gardent leurs propres filtres. Un modèle sans censure peut encore refuser une demande ou se tromper.",
    },
    local: {
      q: "Faut-il une carte graphique pour utiliser ces modèles ?",
      a: "Un navigateur et une connexion internet suffisent. Le fournisseur traite votre demande. Pour exécuter entièrement un modèle sur votre machine, vous devez l’installer en local.",
    },
  },
  guides: "Comparer les modèles et les plateformes",
  abliteratedChat: "Essayer en chat un modèle modifié par ablitération",
  abliteration: "Comprendre l’ablitération des modèles de langage",
  compare: "Comparer les plateformes de chat IA sans censure",
  benchmark: "Voir comment les modèles répondent aux mêmes questions",
};
