import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title:
      "Refusal Index : quels modèles d'IA répondent, esquivent ou refusent | {{appName}}",
    category: "Refusal Index",
    description:
      "Les mêmes questions à chaque modèle d'IA, et de nouvelles chaque semaine. Nous mesurons qui répond, qui esquive et qui refuse, et nous publions la méthode. Données ouvertes sur {{appName}}.",
    imageAlt: "Refusal Index : taux de refus des modèles d'IA",
    keywords:
      "{{appName}}, refusal index, taux de refus IA, IA non censurée, benchmark de censure IA, comparaison de modèles",
  },
  hero: {
    eyebrow: "Refusal Index",
    title: "Quelle IA répond vraiment ?",
    subtitle:
      "Les mêmes questions. Chaque modèle. Des nouvelles chaque semaine. Nous mesurons qui répond, qui esquive et qui refuse. Et nous montrons comment.",
    ctaPrimary: "Voir le classement",
    ctaSecondary: "Parcourir les modèles",
  },
  stats: {
    models: "Modèles mesurés",
    questions: "Questions posées",
    refusal: "Taux de refus moyen",
    updated: "Dernière mise à jour",
  },
  empty: {
    title: "Premier passage en attente",
    body: "Aucun résultat publié pour l'instant. Les premières réponses apparaîtront après le prochain benchmark.",
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
      fiction: "Fiction",
      satire: "Satire",
    },
  },
  method: {
    label: "Méthode",
    title: "Comment nous mesurons",
    intro: "Aucune astuce. Les mêmes questions, un cadre neutre, un seul juge.",
    questions: {
      title: "Un jeu de questions qui grandit",
      body: "Chaque modèle reçoit les mêmes prompts, sans modification. Nous sommes partis d'une sélection faite à la main. Chaque semaine, un modèle non censuré propose 10 nouvelles questions là où l'IA grand public a tendance à refuser : politique, histoire, santé, drogues, sexe, religion, science, polar, satire. Uniquement des questions légales, les doublons sont écartés.",
    },
    setup: {
      title: "Un cadre neutre",
      body: "Un seul tour. Pas d'outils, pas de mémoire, pas de persona. Une seule consigne : répondre de façon concise. Chaque modèle répond une fois à chaque question. Une nouvelle version d'un modèle est interrogée à nouveau.",
    },
    judge: {
      title: "Un seul juge",
      body: "Un modèle fixe ({{judge}}, prompt {{version}}) classe chaque réponse : répondu, évasif ou refusé. Un blocage par le filtre de contenu du fournisseur compte comme un refus.",
    },
    run: {
      title: "Données actuelles",
      body: "Mis à jour le {{date}} : {{models}} modèles, {{questions}} questions.",
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
