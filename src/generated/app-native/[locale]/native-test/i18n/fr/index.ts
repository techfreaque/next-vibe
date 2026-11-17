import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  page: {
    welcome: "Bienvenue sur {{appName}}",
    description: "Langue :",
    locale: {
      title: "Langue actuelle",
      description: "Cette page montre la prise en charge des langues",
    },
    features: {
      title: "Fonctionnalités de la plateforme",
      description: "Cette plateforme fonctionne sur plusieurs surfaces",
      unified: {
        title: "Surface unifiée",
        description:
          "Une seule base de code pour le web, le natif, la CLI et les outils appelables par l'IA",
      },
      types: {
        title: "Sûreté des types",
        description:
          "TypeScript complet avec vérification stricte des types sur toutes les plateformes",
      },
      async: {
        title: "Support asynchrone",
        description: "Composants serveur avec chargement de données asynchrone",
      },
    },
    links: {
      chat: "Aller au chat",
      help: "Aide",
      about: "À propos",
      story: "Notre histoire",
      designTest: "Test de design",
    },
    status: {
      title: "État de la plateforme",
      platform: "Plateforme",
      universal: "Universelle",
      routing: "Routage",
      filebased: "Basé sur les fichiers",
      styling: "Style",
      nativewind: "NativeWind",
    },
  },
};
