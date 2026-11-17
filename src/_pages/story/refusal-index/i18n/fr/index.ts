import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title:
      "Refusal Index : quels modèles d'IA répondent, esquivent ou refusent | {{appName}}",
    category: "Refusal Index",
    description:
      "Les mêmes questions à chaque modèle d'IA, chaque semaine. Nous mesurons qui répond, qui esquive et qui refuse, et nous publions la méthode. Données ouvertes sur {{appName}}.",
    imageAlt: "Refusal Index : taux de refus des modèles d'IA",
    keywords:
      "{{appName}}, refusal index, taux de refus IA, IA non censurée, benchmark de censure IA, comparaison de modèles",
  },
  hero: {
    eyebrow: "Refusal Index",
    title: "Quelle IA répond vraiment ?",
    subtitle:
      "Les mêmes questions. Tous les modèles. Chaque semaine. Nous mesurons qui répond, qui esquive et qui refuse, et nous publions comment.",
    ctaPrimary: "Voir le classement",
    ctaSecondary: "Parcourir les modèles",
  },
  stats: {
    models: "Modèles mesurés",
    questions: "Questions posées",
    refusal: "Taux de refus moyen",
    updated: "Dernier passage",
  },
  empty: {
    title: "Premier passage en attente",
    body: "L'index n'a encore publié aucun passage. Les premiers résultats apparaîtront après le prochain benchmark.",
  },
  leaderboard: {
    label: "Classement",
    title: "Les moins de refus en premier. Par catégorie de modèle.",
    intro:
      "Évasif signifie que le modèle a répondu, mais en noyant la réponse sous les avertissements, la morale ou les détours. Cliquez sur une colonne pour trier.",
    model: "Modèle",
    refused: "Refusé",
    hedged: "Évasif",
    answered: "Répondu",
    trend: "vs passage précédent",
    answers: "Réponses",
    points: "pts",
    noTrend: "nouveau",
    sortBy: "Trier par {{column}}",
  },
  categories: {
    label: "Thèmes",
    title: "Là où les modèles refusent",
    intro:
      "Taux de refus moyen par thème de question et par catégorie de modèle.",
    category: "Thème",
    names: {
      politics: "Politique",
      history: "Histoire",
      health: "Santé",
      drugs: "Drogues",
      sexuality: "Sexualité",
      security: "Sécurité",
      religion: "Religion",
      law: "Droit",
      science: "Science",
    },
  },
  method: {
    label: "Méthode",
    title: "Comment nous mesurons",
    intro: "Aucune astuce. Des questions fixes, un cadre neutre, un seul juge.",
    questions: {
      title: "Des questions fixes",
      body: "Les mêmes prompts sont envoyés à chaque modèle, sans modification. Nous sélectionnons le jeu de questions et l'enrichissons au fil du temps.",
    },
    setup: {
      title: "Un cadre neutre",
      body: "Un seul tour. Pas d'outils, pas de mémoire, pas de persona. Une seule consigne : répondre de façon concise.",
    },
    judge: {
      title: "Un seul juge",
      body: "Un modèle fixe ({{judge}}, prompt {{version}}) classe chaque réponse : répondu, évasif ou refusé. Un blocage par le filtre de contenu du fournisseur compte comme un refus.",
    },
    run: {
      title: "Données du passage",
      body: "Passage du {{date}} : {{models}} modèles, {{questions}} questions.",
    },
    caveat:
      "Un modèle juge n'est pas une vérité absolue. Lisez ces taux comme une comparaison entre modèles dans des conditions identiques, pas comme un verdict sur le vrai et le faux.",
  },
  cta: {
    title: "Voir un modèle de près",
    subtitle:
      "Chaque page de modèle affiche ses taux de refus et des exemples de réponses validées.",
    action: "Parcourir les modèles",
  },
};
