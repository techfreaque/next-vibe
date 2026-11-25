import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Modèles IA abliterated : des LLM sans censure à tester en ligne",
  metaTitle: "Modèles IA abliterated sans censure, en ligne | {{appName}}",
  description:
    "Testez des LLM abliterated, sans refus, dans le navigateur, sans GPU ni inscription. Comparez contexte et coût, et confrontez-les au modèle d’origine.",
  keywords:
    "IA abliterated, modèle abliterated, LLM sans censure, LLM non censuré, modèle IA sans filtre, ablitération, IA open source sans censure",
  intro:
    "Des modèles grand public dont on a retiré les refus. Choisissez-en un, le chat s’ouvre avec ce modèle déjà sélectionné.",
  models: "Modèles abliterated sans censure",
  estimate:
    "Chaque estimation s’appuie sur le fournisseur disponible le moins cher pour le modèle et sur {{input}} tokens en entrée et {{output}} en sortie. Le coût réel dépend du fournisseur et de la longueur de la conversation.",
  empty: "Aucun modèle abliterated n’est disponible ici pour le moment.",
  context: "Fenêtre de contexte de {{tokens}} tokens",
  price: "Environ {{credits}} crédits par échange",
  chat: "Tester {{model}}",
  compareBase: "Comparer avec {{model}}",
  trial: {
    title: "Essayez la même consigne dans deux chats",
    start:
      "Ouvrez un nouveau chat pour chaque modèle. Remplacez le texte proposé par la même consigne dans les deux chats. Essayez cet exercice de fiction si vous manquez d’idées.",
    prompt:
      "Écris une courte scène dystopique où un historien débat avec un censeur d’État au sujet d’un livre interdit. Donne à chacun un argument crédible et laisse le débat ouvert.",
    compare:
      "Vérifiez si chaque modèle écrit la scène, modifie la situation de départ ou refuse. Comparez dans quelle mesure les réponses respectent vos consignes.",
  },
  questions: "IA abliterated : questions fréquentes",
  faq: {
    meaning: {
      q: "Qu’est-ce qu’un LLM abliterated ?",
      a: "L’ablitération modifie les poids d’un modèle pour atténuer les mécanismes associés aux refus. Notre catalogue documente cette méthode pour les modèles de cette liste. Vous pouvez tester chaque modèle disponible dans votre navigateur.",
    },
    difference: {
      q: "Quelle différence entre un modèle abliterated et une IA vraiment non censurée ?",
      a: "Un modèle abliterated garde son entraînement et sa vision du monde : il n’esquive plus, c’est tout. {{model}} est construit autrement : entraîné sur des livres et des documents bannis de l’internet grand public, avec pour résultat des opinions politiques à contre-courant.",
    },
    access: {
      q: "Puis-je tester un modèle abliterated sans compte ?",
      a: "Oui. Vous pouvez utiliser jusqu’à {{credits}} crédits gratuits par mois en tant qu’invité. Avant d’utiliser un modèle non censuré, confirmez une seule fois que vous avez au moins 18 ans et que vous acceptez les réponses sans filtre.",
    },
    refusals: {
      q: "Un modèle abliterated peut-il encore refuser une demande ?",
      a: "Oui. L’ablitération vise à réduire les refus. Le résultat dépend toujours du modèle et de votre demande. Le fournisseur peut aussi imposer ses propres limites.",
    },
    gpu: {
      q: "Faut-il un GPU pour utiliser des modèles abliterated ?",
      a: "Non. Les modèles tournent chez des fournisseurs hébergés : vous discutez dans le navigateur sur n’importe quel appareil, téléphone compris. Faire tourner vous-même des poids abliterated demande un GPU avec assez de mémoire pour tout le modèle.",
    },
    quality: {
      q: "L’ablitération rend-elle un modèle moins bon ?",
      a: "Parfois, un peu. Retirer le mécanisme de refus peut coûter un peu de précision ou de respect des consignes. Envoyez le même prompt à la version abliterated et au modèle d’origine, puis jugez pour votre tâche.",
    },
    api: {
      q: "Puis-je utiliser des modèles abliterated via une API ?",
      a: "Oui. Les mêmes modèles sont disponibles via une API compatible OpenAI et Anthropic : votre SDK actuel fonctionne. Les clés API exigent un abonnement payant. Les crédits gratuits et bonus ne les débloquent pas.",
    },
  },
  guides: "Découvrir l’IA non censurée",
  apiGuide: "API LLM non censurée : identifiants, prix et code",
  allModels: "Voir tous les modèles de chat non censurés",
  breadcrumb: "IA abliterated",
  guidesTitle: "Guides sur l’ablitération",
  guidesIntro:
    "Comment l’ablitération supprime les refus, où elle atteint ses limites, et quel modèle choisir pour chaque tâche.",
};
