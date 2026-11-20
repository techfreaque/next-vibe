import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Chat IA avec des modèles abliterated",
  metaTitle: "Modèles IA abliterated à tester en ligne | {{appName}}",
  description:
    "Testez des modèles abliterated dans votre navigateur. Comparez les fenêtres de contexte et le coût estimé par échange, puis ouvrez un chat avec le modèle choisi.",
  intro:
    "Testez des modèles modifiés pour refuser moins de demandes. Choisissez-en un et ouvrez un chat dans votre navigateur avec ce modèle déjà sélectionné.",
  models: "Modèles abliterated disponibles",
  estimate:
    "Chaque estimation s’appuie sur le fournisseur disponible le moins cher pour le modèle et sur {{input}} tokens en entrée et {{output}} en sortie. Le coût réel dépend du fournisseur et de la longueur de la conversation.",
  empty: "Aucun modèle abliterated n’est disponible ici pour le moment.",
  context: "Fenêtre de contexte de {{tokens}} tokens",
  price: "Environ {{credits}} crédits par échange",
  chat: "Tester {{model}}",
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
    access: {
      q: "Puis-je tester un modèle abliterated sans compte ?",
      a: "Oui. Vous disposez de {{credits}} crédits gratuits par mois en tant qu’invité. Avant d’utiliser un modèle non censuré, confirmez une seule fois que vous avez au moins 18 ans et que vous acceptez les réponses sans filtre.",
    },
    refusals: {
      q: "Un modèle abliterated peut-il encore refuser une demande ?",
      a: "Oui. L’ablitération vise à réduire les refus. Le résultat dépend toujours du modèle et de votre demande. Le fournisseur peut aussi imposer ses propres limites.",
    },
  },
  guides: "Découvrir l’IA non censurée",
  methodGuide: "Comprendre ce qui distingue l’ablitération des autres méthodes",
  allModels: "Voir tous les modèles de chat non censurés",
};
