import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "À propos : {{appName}}",
    category: "À propos",
    description:
      "Découvrez la mission de {{appName}} : des conversations IA sans censure",
    imageAlt: "À propos de {{appName}}",
    keywords:
      "à propos de {{appName}}, IA non censurée, mission IA, valeurs IA",
    ogTitle: "À propos de {{appName}}, la plateforme d'IA non censurée",
    ogDescription:
      "Notre mission : ouvrir à tous l'accès à une IA non censurée",
    twitterTitle: "À propos de {{appName}}",
    twitterDescription: "Notre mission : des conversations IA sans censure",
  },
  hero: {
    eyebrow: "À propos de {{appName}}",
    title: "Une IA qui vous rend des comptes.",
    subtitle:
      "{{modelCount}} modèles. {{skillCount}} compétences. ~{{toolCount}} outils. SSH, e-mail, automatisation du navigateur, tâches planifiées. Utilisez-la gratuitement sur {{appName}}, ou auto-hébergez la vôtre.",
    ctaPrimary: "Commencer à discuter",
    ctaSecondary: "Lire le journal de bord",
  },
  stats: {
    models: "modèles d'IA",
    skills: "compétences",
    tools: "outils",
    founded: "fondée en",
  },
  backToHome: "Retour à l'accueil",
  title: "À propos de {{appName}}",
  subtitle: "Pionniers des conversations IA sans censure",
  description:
    "Fondée en {{foundedYear}}, {{appName}} vous donne accès aux meilleurs modèles d'IA du monde, sans qu'une équipe de modération décide de ce que vous avez le droit de demander. Vous choisissez le modèle. Vous réglez le filtre.",
  values: {
    title: "Ce sur quoi nous ne transigeons pas",
    description:
      "Quatre règles que chaque fonctionnalité de {{appName}} doit respecter.",
    excellence: {
      title: "Vous choisissez le filtre",
      description:
        "Modèles grand public, open source ou non censurés. Choisissez le niveau pour chaque conversation. Personne ne décide à votre place.",
    },
    innovation: {
      title: "Open source, de A à Z",
      description:
        "{{appName}} tourne sur next-vibe, open source sur GitHub. Lisez le code, forkez-le, faites-le tourner sur votre propre matériel.",
    },
    integrity: {
      title: "Privé par défaut",
      description:
        "Le mode incognito garde vos conversations sur votre appareil (les médias générés sont stockés temporairement pour des raisons techniques). Vos données restent les vôtres. Ce n'est pas un produit que nous vendons.",
    },
    collaboration: {
      title: "Construit en public",
      description:
        "Feuille de route, choix d'architecture, impasses : tout est sur le blog. Vos retours deviennent des fonctionnalités.",
    },
  },
  mission: {
    title: "Votre IA. Vos règles.",
    subtitle: "Ouvrir à tous l'accès à une IA non censurée",
    description:
      "Tous les grands fournisseurs d'IA filtrent ce que vous pouvez demander, et vous ne voyez jamais les règles. Nous pensons que les adultes peuvent décider par eux-mêmes. {{appName}} réunit donc tous les modèles et tous les niveaux de filtrage au même endroit, et vous laisse la main.",
    vision: {
      title: "La vision",
      description:
        "Un seul endroit pour tous les modèles d'IA sérieux (grand public, open source et non censurés) où c'est vous qui décidez de ce qui est interdit.",
    },
    approach: {
      title: "L'approche",
      description:
        "Intégrer vite les meilleurs modèles, les équiper de vrais outils (recherche, mémoire, automatisation) et faire de la confidentialité la règle, pas une option payante.",
    },
    commitment: {
      title: "L'engagement",
      description:
        "Des prix transparents. Aucun dark pattern. Une plateforme que vous pouvez quitter à tout moment en auto-hébergeant exactement le même code.",
    },
  },
  contact: {
    title: "Des questions ? Parlez-nous.",
    description:
      "Retours, partenariats, presse, bugs : un humain lit chaque message.",
    cta: "Nous contacter",
    selfHost: "L'auto-héberger",
  },
  post: {
    title: "À propos",
    description: "Endpoint À propos",
    form: {
      title: "Configuration de la page À propos",
      description: "Configurer les paramètres de la page À propos",
    },
    response: {
      title: "Réponse",
      description: "Données de réponse de la page À propos",
    },
    errors: {
      unauthorized: {
        title: "Non autorisé",
        description: "Authentification requise",
      },
      validation: {
        title: "Erreur de validation",
        description: "Paramètres de requête invalides",
      },
      server: {
        title: "Erreur serveur",
        description: "Une erreur interne du serveur s'est produite",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inconnue s'est produite",
      },
      network: {
        title: "Erreur réseau",
        description: "Une erreur réseau s'est produite",
      },
      forbidden: {
        title: "Accès interdit",
        description: "Accès refusé",
      },
      notFound: {
        title: "Introuvable",
        description: "Ressource introuvable",
      },
      conflict: {
        title: "Conflit",
        description: "Un conflit de données s'est produit",
      },
    },
    success: {
      title: "Succès",
      description: "Opération réussie",
    },
  },
};
