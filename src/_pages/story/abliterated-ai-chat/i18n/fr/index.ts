import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Modèles IA abliterated à tester en ligne",
  metaTitle: "Modèles IA abliterated à tester en ligne | {{appName}}",
  description:
    "Comparez les LLM abliterated par fenêtre de contexte et coût estimé. Essayez-les dans votre navigateur et comparez-les au modèle de base quand il est disponible.",
  intro:
    "Testez des modèles modifiés pour refuser moins de demandes. Choisissez-en un et ouvrez un chat dans votre navigateur avec ce modèle déjà sélectionné.",
  models: "Modèles abliterated disponibles",
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
  questions: "Questions fréquentes",
  faq: {
    meaning: {
      q: "Qu’est-ce qu’un LLM abliterated ?",
      a: "L’ablitération modifie les poids d’un modèle pour atténuer les mécanismes associés aux refus. Notre catalogue documente cette méthode pour les modèles de cette liste. Vous pouvez tester chaque modèle disponible dans votre navigateur.",
    },
    access: {
      q: "Puis-je tester un modèle abliterated sans compte ?",
      a: "Oui. Vous pouvez utiliser jusqu’à {{credits}} crédits gratuits par mois en tant qu’invité. Avant d’utiliser un modèle non censuré, confirmez une seule fois que vous avez au moins 18 ans et que vous acceptez les réponses sans filtre.",
    },
    refusals: {
      q: "Un modèle abliterated peut-il encore refuser une demande ?",
      a: "Oui. L’ablitération vise à réduire les refus. Le résultat dépend toujours du modèle et de votre demande. Le fournisseur peut aussi imposer ses propres limites.",
    },
  },
  guides: "Découvrir l’IA non censurée",
  allModels: "Voir tous les modèles de chat non censurés",
  breadcrumb: "IA abliterated",
  guidesTitle: "Guides sur l’ablitération",
  guidesIntro:
    "Comment l’ablitération supprime les refus, où elle atteint ses limites, et quel modèle choisir pour chaque tâche.",
};
