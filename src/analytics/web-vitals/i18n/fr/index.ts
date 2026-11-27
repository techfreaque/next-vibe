import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Analytique",
  tags: {
    performance: "Performance",
    seo: "SEO",
  },

  enums: {
    metric: {
      lcp: "Largest Contentful Paint",
      inp: "Interaction to Next Paint",
      cls: "Cumulative Layout Shift",
      ttfb: "Time to First Byte",
      fcp: "First Contentful Paint",
    },
    rating: {
      good: "Bon",
      needsImprovement: "À améliorer",
      poor: "Mauvais",
    },
    device: {
      mobile: "Mobile",
      desktop: "Ordinateur",
    },
    pageType: {
      storyHome: "Accueil",
      storyPage: "Page story",
      blogIndex: "Liste du blog",
      blogPost: "Article de blog",
      storyCompare: "Page comparatif",
      models: "Liste des modèles",
      modelDetail: "Page modèle",
      modelCompare: "Modèle contre modèle",
      modelChangelog: "Journal des modèles",
      skill: "Page skill",
      skills: "Liste des skills",
      docs: "Docs",
      help: "Aide",
      pricing: "Tarifs",
      create: "Création de médias",
      threads: "Chat",
      account: "Compte",
      tools: "Outils",
      other: "Autre",
    },
  },

  fields: {
    metric: "Métrique",
    value: "Valeur",
    rating: "Note",
    navigationType: "Type de navigation",
    path: "Chemin de la page",
    device: "Appareil",
    metrics: "Mesures",
    days: "Jours",
    pageType: "Type de page",
    samples: "Mesures",
    p75: "p75",
    goodShare: "Bon",
    poorShare: "Mauvais",
  },

  post: {
    title: "Envoyer les Web Vitals",
    titleShort: "Envoyer les vitals",
    description:
      "Enregistre les Core Web Vitals réels (LCP, INP, CLS, TTFB, FCP) d’une page vue.",
    recorded: "Enregistré",
    success: {
      title: "Vitals enregistrés",
      description: "Les mesures sont enregistrées.",
    },
  },

  get: {
    title: "Web Vitals",
    titleShort: "Web Vitals",
    description:
      "Core Web Vitals des vrais visiteurs par type de page : p75 et part des visites bonnes et mauvaises.",
    empty: "Aucune mesure sur cette période.",
    since: "Depuis",
    total: "Mesures",
    targets:
      "Objectifs au p75 : LCP sous 2,5 s, INP sous 200 ms, CLS sous 0,1.",
    success: {
      title: "Web Vitals chargés",
      description: "Mesures des vrais visiteurs par type de page.",
    },
  },

  errors: {
    validation: {
      title: "Mesures invalides",
      description: "Vérifiez les valeurs envoyées.",
    },
    network: {
      title: "Erreur réseau",
      description: "La requête n’a pas atteint le serveur.",
    },
    unauthorized: {
      title: "Connexion requise",
      description: "Connectez-vous pour voir ce rapport.",
    },
    forbidden: {
      title: "Accès refusé",
      description: "Réservé aux admins.",
    },
    notFound: {
      title: "Introuvable",
      description: "Rien trouvé.",
    },
    server: {
      title: "Erreur serveur",
      description: "Les mesures n’ont pas pu être traitées.",
    },
    unknown: {
      title: "Erreur inconnue",
      description: "Un imprévu s’est produit.",
    },
    unsavedChanges: {
      title: "Modifications non enregistrées",
      description: "Enregistrez ou annulez d’abord vos modifications.",
    },
    conflict: {
      title: "Conflit",
      description: "Les données ont changé entre-temps.",
    },
  },
};
