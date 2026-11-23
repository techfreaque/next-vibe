import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Framework next-vibe : Une définition, toutes les surfaces",
    description:
      "Framework TypeScript open source. Un seul definition.ts devient interface web, commande CLI, outil MCP, écran natif, outil IA et tâche cron. Plus une API compatible OpenAI et Anthropic.",
    category: "Framework",
    imageAlt: "Le framework next-vibe pour les développeurs",
    keywords:
      "next-vibe, framework TypeScript, serveur MCP, CLI, outils IA, Zod, Drizzle, API compatible OpenAI",
  },
  hero: {
    eyebrow: "Open source · MIT + GPL v3",
    title: "Un definition.ts.",
    titleAccent: "Toutes les surfaces.",
    subtitle:
      "next-vibe est un framework TypeScript où une seule définition d'endpoint devient interface web, commande CLI, outil MCP, écran natif, outil IA, tâche cron et sept autres surfaces. Même validation, mêmes types, zéro code de liaison.",
    ctaQuickstart: "Démarrer en quatre commandes",
    ctaGithub: "Voir sur GitHub",
    stat1Label: "endpoints typés dans le dépôt",
    stat2Label: "surfaces par endpoint",
    stat3Label: "langues par texte",
    stat4Label: "définition par fonctionnalité",
  },
  example: {
    eyebrow: "Un vrai endpoint",
    title: "Suivez le formulaire de contact.",
    intro:
      "L'endpoint de contact du dépôt, en service en bas de cette page. Deux fichiers à lire. Six de ses treize surfaces ci-dessous.",
    source: "Lire le code complet sur GitHub",
    live: "Essayer le formulaire en direct",
    becomes: "Ce qu'il devient",
    more: "Plus sept autres",
    moreSurfaces: {
      webApi: "API REST",
      websocket: "Événements WebSocket",
      electron: "App Electron",
      adminPanel: "Panneau admin",
      vibeFrame: "Widget intégrable",
      remoteSkill: "Skill d'agent",
      vibeBoard: "Nœud d'analyse",
    },
    surfaces: {
      web: {
        title: "Interface web",
        body: "Le formulaire en bas de cette page. Champs, validation et message de succès viennent de la définition.",
      },
      cli: {
        title: "Commande CLI",
        body: "vibe contact-form. Un flag par champ, aide avec exemples incluse.",
      },
      mcp: {
        title: "Outil MCP",
        body: "Tout client MCP appelle contact-form via vibe mcp. Le schéma d'entrée vient directement de Zod.",
      },
      ai: {
        title: "Outil IA",
        body: "Les modèles peuvent l'appeler. requiresConfirmation fait valider l'utilisateur avant l'envoi.",
      },
      native: {
        title: "Écran natif",
        body: "L'app Expo affiche le même widget avec des champs natifs.",
      },
      cron: {
        title: "Tâche cron",
        body: "Tout endpoint peut tourner selon un planning. Même handler, aucun second chemin de code.",
      },
    },
    callsTitle: "Quatre points d'entrée",
    callsBody:
      "De vrais appels. CLI, MCP et IA atteignent le handler de contact ci-dessus. L'onglet Cron montre une vraie tâche planifiée du dépôt.",
  },
  pattern: {
    eyebrow: "Le modèle",
    title: "Une fonctionnalité, un dossier.",
    subtitle:
      "definition.ts et route.ts sont obligatoires. Widget, e-mails, table et traductions sont rangés à côté. Aucun registre central à maintenir à la main.",
    deleteLine:
      "Supprimez le dossier et lancez vibe gen. La fonctionnalité disparaît de toutes les surfaces d'un coup.",
  },
  hood: {
    eyebrow: "Sous le capot",
    title: "La plomberie, faite une fois.",
    intro:
      "Le framework gère validation, authentification, logs, i18n et temps réel. Votre dossier contient la logique métier.",
    platform: {
      title: "Rôles et marqueurs de plateforme",
      body: "allowedRoles décide qui peut appeler un endpoint. Les marqueurs de plateforme décident où il apparaît : AI_TOOL_OFF le cache aux modèles, PRODUCTION_OFF le tient hors production. Vérifié sur chaque surface.",
    },
    data: {
      title: "Zod, Drizzle, PostgreSQL",
      body: "Zod valide entrées et sorties et génère chaque schéma d'outil. Les repositories gèrent la persistance via Drizzle. Les migrations vivent dans le dépôt. Par défaut, tout tourne sur PGlite embarqué, sans Docker. Pointez DATABASE_URL vers n'importe quel Postgres quand il le faut.",
    },
    realtime: {
      title: "Temps réel typé",
      body: "Les endpoints déclarent schémas d'événements et portées de canal. Les clients s'abonnent via WebSocket aux tokens en streaming et à l'avancement des tâches. Le pub/sub tourne en processus ou sur Redis.",
    },
    remote: {
      title: "Instances connectées",
      body: "Les instances se connectent, exécutent des outils chez le pair et synchronisent ce que vous autorisez. Chaque côté applique ses propres permissions. C'est ainsi qu'une installation auto-hébergée utilise les modèles d'unbottled.ai.",
    },
  },
  typescript: {
    title: "Pas d'any. Pas d'unknown. Pas de throw.",
    subtitle:
      "Les types concordent de bout en bout, sans exception. vibe check l'impose avant toute mise en ligne.",
    patterns: {
      any: {
        name: "pas d'any",
        description:
          "Écrivez la vraie interface. Recourir à any, c'est avouer un trou dans l'architecture.",
      },
      unknown: {
        name: "pas d'unknown",
        description: "Même règle. unknown, c'est any par un détour.",
      },
      object: {
        name: "pas d'object nu",
        description: "Décrivez la forme attendue. object ne dit rien.",
      },
      asX: {
        name: "pas de as X",
        description:
          "Les casts mentent au compilateur. Corrigez les types à la source.",
      },
      throwStatements: {
        name: "pas de throw",
        description:
          "Retournez ResponseType<T> via success(data) ou fail({ message, errorType }). Les erreurs sont des données.",
      },
      hardcodedStrings: {
        name: "pas de texte en dur",
        description:
          "Chaque texte visible est une clé de traduction. Le linter repère les littéraux.",
      },
    },
    vibeCheck:
      "vibe check lance Oxlint, ESLint et le vérificateur TypeScript en parallèle. Zéro erreur, sinon rien ne part.",
  },
  quickstart: {
    eyebrow: "Démarrage rapide",
    title: "Quatre commandes. Puis le navigateur prend le relais.",
    intro:
      "Cloner, installer, lancer. Un assistant gère l'accès admin et votre fournisseur IA. Aucun fichier de configuration.",
    selfHost: "Guide d'auto-hébergement",
    docs: "Docs des patterns sur GitHub",
  },
  api: {
    eyebrow: "API hébergée",
    title: "Ou appelez simplement l'API {{appName}}.",
    intro:
      "Sans installation. Compatible OpenAI et Anthropic : gardez votre SDK, changez l'URL de base et la clé.",
    endpoints: {
      chat: "OpenAI Chat Completions",
      responses: "OpenAI Responses",
      messages: "Anthropic Messages",
      models: "Liste des modèles avec tarifs",
    },
    access:
      "{{modelCount}} modèles derrière une seule clé, facturés en crédits {{appName}}. Les clés API se débloquent avec n'importe quel abonnement ou pack de crédits.",
    docs: "Lire la doc de l'API",
    keys: "Créer une clé API",
  },
  examples: {
    eyebrow: "Dans ce dépôt",
    title: "Pas seulement du chat IA.",
    subtitle:
      "Des domaines métier entiers vivent dans ce dépôt, tous bâtis sur le même modèle.",
    items: {
      aiPlatform: {
        label: "Plateforme IA",
        title: "{{appName}}",
        body: "{{modelCount}} modèles, chat, mémoire, agents, facturation et MCP. Exactement ce code, en production.",
      },
      commerce: {
        label: "Commerce",
        title: "Produits et caisse",
        body: "Produits, point de vente, stock et achats.",
      },
      finance: {
        label: "Finance",
        title: "Comptabilité et paiements",
        body: "Plan comptable, taux de TVA, factures, paiements Stripe et crypto.",
      },
      crm: {
        label: "CRM",
        title: "Leads et messagerie",
        body: "Leads, newsletter, boîte e-mail et SMS.",
      },
    },
  },
  maturity: {
    eyebrow: "État honnête",
    title: "Ce qui tourne aujourd'hui.",
    stable: {
      title: "En production",
      body: "{{appName}} tourne sur ce code : web, CLI, MCP, outils IA, cron, temps réel, paiements. Les builds de production tournent sur Next.js. En local, TanStack Start avec Vite par défaut.",
    },
    beta: {
      title: "Bêta",
      body: "Écrans React Native, synchronisation entre instances et skills distants fonctionnent, avec quelques aspérités.",
    },
    honest: {
      title: "Attendez-vous à du changement",
      body: "Une équipe, un rythme rapide, des choix assumés. Pas encore de semver, et la doc court derrière le code. Épinglez un commit ou forkez.",
    },
  },
  contact: {
    eyebrow: "L'endpoint, en direct",
    title: "Des questions, ou un grand projet ?",
    description:
      "Mise en place, intégrations sur mesure, revue d'architecture. Ce formulaire est l'endpoint de contact du haut de la page, rendu par le framework.",
  },
  code: {
    copy: "Copier",
    copied: "Copié",
    wrap: "Retour à la ligne",
    terminal: "Terminal",
    cli: "CLI",
    mcp: "MCP",
    ai: "Outil IA",
    cron: "Cron",
    anthropic: "Anthropic (curl)",
  },
};
