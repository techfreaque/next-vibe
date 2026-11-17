import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Construire avec next-vibe - {{appName}}",
    category: "Développeurs",
    description:
      "next-vibe transforme chaque endpoint en formulaire web, commande CLI, outil MCP, écran natif et compétence appelable par une IA, tout à la fois. Automatisez tout ce qu'un humain peut faire sur un ordinateur.",
    imageAlt: "next-vibe, la plateforme pour développeurs de {{appName}}",
    keywords:
      "next-vibe, automatisation IA, plateforme développeurs, automatisation d'entreprise, intégration ERP, automatisation de production, {{appName}}",
    ogTitle: "Construire avec next-vibe - {{appName}}",
    ogDescription:
      "Une seule base de code. Toutes les surfaces. Automatisez des lignes de production, des ERP, des workflows de bureau : tout ce qu'un humain peut faire sur un ordinateur.",
    twitterTitle: "Construire avec next-vibe - {{appName}}",
    twitterDescription:
      "Une seule base de code. Toutes les surfaces. Automatisez des lignes de production, des ERP, des workflows de bureau : tout ce qu'un humain peut faire sur un ordinateur.",
  },

  hero: {
    eyebrow: "Carrières",
    title: "Pas d'offres d'emploi. Le travail est ouvert.",
    subtitle:
      "Aucun poste listé ici. Le travail est ouvert : livrez next-vibe à des clients, automatisez de vraies entreprises, gagnez de l'argent avec les compétences que vous publiez. Tout ce qu'il vous faut est sur GitHub.",
    ctaPrimary: "Commencer à construire",
    ctaSecondary: "Lire la doc",
  },

  audience: {
    title: "Qui construit avec next-vibe",
    items: {
      freelancers: {
        title: "Freelances et agences",
        description:
          "Livrez à vos clients des outils propulsés par l'IA sans développer séparément backend, CLI et interface. Une seule base de code, toutes les surfaces.",
      },
      businessDevs: {
        title: "Développeurs métier",
        description:
          "Branchez votre ERP, votre CRM ou n'importe quel système interne sur des workflows IA. Les données entrent, les décisions sortent. Sans code de liaison.",
      },
      industrialDevs: {
        title: "Industriel et embarqué",
        description:
          "Automatisez la configuration des appareils sur les lignes de production. Déclenchez des compétences IA quand un capteur réagit. Mesurez avec Vibe Sense, agissez avec Autopilot.",
      },
      enterpriseDevs: {
        title: "Équipes en entreprise",
        description:
          "Remplacez des outils éparpillés par une plateforme unifiée. Interface web, CLI, MCP, app native : le même endpoint, zéro duplication.",
      },
    },
  },

  useCases: {
    title: "Ce que vous pouvez construire",
    items: {
      erpIntegration: {
        title: "Intégration ERP et systèmes métier",
        description:
          "Envoyez vos données de production à une compétence IA qui classe les défauts, met à jour le stock ou déclenche des réapprovisionnements. Votre endpoint fait le pont.",
      },
      desktopAutomation: {
        title: "Automatisation complète du poste de travail",
        description:
          "next-vibe peut prendre la main sur tout le bureau, navigateur compris. Remplissage de formulaires, scraping, navigation, opérations sur les fichiers : scripté une fois, exécuté partout.",
      },
      productionLine: {
        title: "Automatisation de lignes de production",
        description:
          "Configurez les appareils à distance via un endpoint. Déclenchez des contrôles qualité via Vibe Sense. Quand une mesure franchit un seuil, une compétence IA réagit.",
      },
      autopilotScheduling: {
        title: "Actions IA planifiées",
        description:
          "Autopilot exécute vos compétences selon un planning. Interroger une source de données toutes les heures, résumer les logs de la nuit, envoyer des alertes dès qu'une anomalie apparaît.",
      },
      vibeSenseMonitoring: {
        title: "Pipelines mesurer → décider → agir",
        description:
          "Vibe Sense mesure tout : production d'une machine, santé d'une API, longueur d'une file d'attente. Envoyez la mesure à une compétence. La compétence décide. Un endpoint agit.",
      },
      skillEconomy: {
        title: "Vendez ce que vous construisez",
        description:
          "Emballez votre automatisation dans une compétence. Partagez le lien. Touchez 10 % de chaque paiement de chaque utilisateur inscrit par ce lien. Chaque mois, tant qu'il paie.",
      },
    },
  },

  architecture: {
    title: "Une définition. Toutes les surfaces.",
    subtitle:
      "Écrivez un definition.ts par fonctionnalité. Tout le reste est généré.",
    surfaces: {
      web: "Formulaire web",
      cli: "Commande CLI",
      mcp: "Outil MCP",
      native: "Écran natif",
      cron: "Tâche cron",
      ai: "Compétence appelable par une IA",
    },
    description:
      "La plateforme est détectée à l'exécution. Le même endpoint qui affiche une interface web pour un humain devient un outil appelable par un agent IA. Sans code supplémentaire.",
  },

  referral: {
    title: "Construisez. Partagez. Gagnez.",
    description:
      "Chaque compétence que vous partagez contient votre lien de parrainage. 10 % de chaque paiement des utilisateurs que vous amenez. Plus 5 % quand le lien de quelqu'un d'autre amène un utilisateur vers votre compétence. Chaque mois, tant qu'ils paient.",
    cta: "Comment fonctionne l'économie des compétences",
  },

  cta: {
    title: "Commencez par un seul endpoint.",
    subtitle:
      "Ajoutez next-vibe à un projet existant en quelques minutes. Ou partez du scaffold et déployez dès aujourd'hui un outil complet sur toutes les surfaces.",
    primary: "Commencer",
    secondary: "Lire les articles",
  },

  post: {
    title: "Construire avec next-vibe",
    description: "Endpoint de la plateforme pour développeurs",
    form: {
      title: "Configuration",
      description: "Configurer les paramètres",
    },
    response: {
      title: "Réponse",
      description: "Données de réponse",
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
