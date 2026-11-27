import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Développeurs : framework next-vibe, API IA non censurée, MCP",
    description:
      "Écrivez un endpoint, obtenez une interface web, une commande CLI, un outil MCP et un outil IA. Open source. Clonez, installez, lancez. En plus : une API compatible OpenAI et Anthropic pour les modèles grand public et non censurés. Avec des modules de comptabilité, facturation, CRM et caisse.",
    category: "Développeurs",
    imageAlt:
      "unbottled.ai pour les développeurs : API, MCP et auto-hébergement",
    keywords:
      "API IA non censurée, API compatible OpenAI, API compatible Anthropic, API modèle abliterated, API UncensoredLM, serveur MCP, IA auto-hébergée, next-vibe",
  },
  hero: {
    eyebrow: "Pour les développeurs",
    title: "Un seul definition.ts.",
    titleAccent: "Toutes les surfaces.",
    subtitle:
      "next-vibe est le framework TypeScript open source qui fait tourner {{appName}}. Chat IA, comptabilité, caisse, stock et CRM tournent dessus. Un endpoint devient interface web, commande CLI, outil MCP et outil IA. Zéro code de liaison.",
    ctaFramework: "Voir le principe",
    ctaKeys: "Utiliser l'API",
    stats: {
      endpoints: "endpoints typés dans le dépôt",
      surfaces: "surfaces issues d'une définition",
      languages: "langues intégrées",
      models: "modèles de chat, une seule clé",
    },
  },
  paths: {
    api: {
      label: "Appeler l'API",
      title: "{{modelCount}} modèles, une seule clé",
      body: "Votre code OpenAI ou Anthropic, notre URL de base. Modèles grand public et non censurés sur la même clé.",
      link: "Démarrage rapide",
    },
    selfHost: {
      label: "Auto-héberger",
      title: "Faites tourner toute la plateforme",
      body: "Chat, comptabilité, caisse, stock, CRM. Clonez, installez, lancez.",
      link: "L'installer",
    },
    framework: {
      label: "Construire dessus",
      title: "Une définition, toutes les surfaces",
      body: "Écrivez un endpoint une fois. Vous obtenez une interface web, une commande CLI, un outil MCP, un outil IA et plus encore.",
      link: "Voir le principe",
    },
  },
  modules: {
    eyebrow: "Dans le dépôt",
    title: "Des produits entiers, le même principe.",
    intro:
      "Comptabilité, facturation, CRM et messagerie suivent le même principe que le formulaire de contact ci-dessus. Chaque endpoint est une commande CLI, un outil MCP et un outil IA, sauf si sa définition le désactive. Ouvrez n'importe quel dossier : definition, repository, route.",
    endpoints: "{{count}} endpoints",
    business: "Gérez votre entreprise avec",
    source: "Parcourir les modules sur GitHub",
    tryLine: "Même principe, vraies commandes",
    items: {
      accounting: "Comptabilité en partie double",
      documents: "Factures, achats, devis",
      purchasing: "Achats",
      pos: "Caisse",
      inventory: "Stock",
      crm: "CRM et prospects",
      newsletter: "Newsletter",
      messaging: "Boîte de réception et messagerie",
    },
  },
  quickstart: {
    eyebrow: "Démarrage rapide",
    title: "Première réponse en trois étapes.",
    intro:
      "L'API parle OpenAI Chat Completions et Responses, ainsi qu'Anthropic Messages. Votre code tourne ici après trois changements : l'URL de base, la clé et un id de modèle tiré de `GET /v1/models`.",
    step1: {
      title: "Débloquez l'API et créez une clé",
      description:
        "N'importe quel abonnement dès {{subPrice}} par mois la débloque. Ouvrez ensuite les clés d'API, nommez une clé et copiez-la. Elle ne s'affiche qu'une fois.",
      ctaPlans: "Voir les abonnements",
      ctaKeys: "Ouvrir les clés d'API",
    },
    step2: {
      title: "Pointez votre client vers nous",
      description:
        "Les clients OpenAI prennent la première URL. Claude Code et les SDK Anthropic prennent la seconde.",
      baseUrl: "URL de base OpenAI",
      baseUrlNote:
        "N'importe quelle locale fonctionne dans le chemin. Elle change seulement la langue des messages d'erreur.",
      anthropicBaseUrl: "URL de base Anthropic",
      anthropicNote:
        "Pas de `/v1` à la fin : les clients Anthropic ajoutent eux-mêmes `/v1/messages`.",
    },
    step3: {
      title: "Envoyez une requête",
      description:
        "Insérez votre clé et lancez. `{{model}}` est un id de modèle. `GET /v1/models` liste tous les ids que votre clé peut appeler.",
      response: "Exemple de réponse",
    },
    agents: {
      title: "Les agents de code marchent tout de suite",
      body: "Configurations testées, à copier-coller :",
      link: "Configurer un agent de code",
    },
    reference: "Référence complète de l'API",
  },
  pricing: {
    eyebrow: "Tarifs",
    title: "Un abonnement la débloque. Vous payez à l'appel, en crédits.",
    intro:
      "Les mêmes tarifs que l'app de chat. Pas de supplément API, pas de frais par utilisateur, un seul solde.",
    unlockTitle: "Débloque l'API",
    unlockPlan: "N'importe quel abonnement, dès {{subPrice}} par mois",
    unlockGrant:
      "Des crédits attribués par notre équipe, comme les crédits testeurs",
    neverTitle: "Ne la débloque jamais",
    never:
      "L'offre gratuite : quota mensuel, bonus d'inscription et de newsletter, gains de parrainage. Sans abonnement ni crédits attribués, chaque appel `/v1` répond 402 `paid_plan_required`.",
    billTitle: "Comment un appel est facturé",
    bill: "Le coût du fournisseur plus notre marge, en crédits. `GET /v1/models` donne le prix de chaque modèle en crédits par million de tokens d'entrée et de sortie. Chaque réponse indique `usage.credits_charged`, en streaming aussi avec `stream_options.include_usage`.",
    topup:
      "Besoin de plus ? Les abonnés rechargent avec des packs de crédits dès {{packPrice}}. Les crédits des packs n'expirent jamais.",
    facts: {
      credit: "1 crédit = 1 centime de dollar US",
      rate: "Aucune limite fixe (facturation à la requête)",
      keys: "Jusqu'à {{maxKeys}} clés par compte",
      preflight: "Crédits insuffisants : 402 avant toute exécution",
    },
    modelsTitle: "Chaque prix vient de l'API elle-même",
    modelsResponse: "Exemple de réponse",
  },
  uncensored: {
    eyebrow: "Modèles non censurés",
    title: "Deux façons d'être non censuré. Les deux sur l'API.",
    intro:
      "La plupart des IA non censurées sont des modèles grand public dont on a coupé les refus ou qu'on a entraînés à ne plus refuser. Nous les proposons, plus un modèle entraîné autrement dès le départ. Vous choisissez à chaque requête, via l'id du modèle.",
    abliterated: {
      label: "Abliterated et fine-tunés",
      title: "Des modèles grand public qui n'esquivent plus",
      body: "Refus coupés dans les poids ou éliminés par entraînement. Mêmes connaissances, des réponses franches.",
    },
    worldview: {
      label: "Vraiment non censuré",
      title: "Un modèle avec sa propre vision du monde",
      body: "{{model}} est entraîné sur des livres et des documents bannis de l'internet grand public. Résultat : un modèle aux opinions politiques à contre-courant.",
    },
    more: "+{{count}} autres",
    consent:
      "Confirmez une fois sur la page des clés d'API que vous avez 18 ans ou plus. D'ici là, les modèles non censurés répondent 403 `uncensored_consent_required`, et rien n'est facturé.",
    allModels: "Tous les modèles non censurés",
    catalog: "Parcourir le catalogue de modèles",
  },
  mcp: {
    eyebrow: "MCP et CLI",
    title: "Votre agent connaît déjà votre app.",
    intro:
      "`bun i` écrit la config MCP pour Claude Code, Cursor, VS Code, OpenCode et Codex. Ouvrez le dépôt dans votre agent : les outils sont là.",
    points: {
      stdio: "MCP via stdio. Aucun serveur en plus, aucun port.",
      roles:
        "Mêmes rôles et même validation que l'interface web. Les modèles n'atteignent que ce que votre rôle autorise.",
      connect:
        "Connectez l'instance à votre compte {{appName}} et ses agents tournent sur nos modèles.",
      help: "Chaque commande se documente elle-même : `vibe <command> --help`.",
    },
    configNote:
      "L'entrée `atlas` que `bun i` écrit, raccourcie. Le vrai fichier contient aussi un serveur `hermes` et utilise le chemin de votre clone.",
  },
  selfHost: {
    eyebrow: "Auto-hébergement",
    title: "Faites tout tourner vous-même.",
    intro:
      "La plateforme derrière {{appName}} est open source. Clonez, installez, lancez. Puis le navigateur prend le relais. Pas de Docker, pas de fichiers de config.",
    terminal: "Terminal",
    db: "Postgres embarqué (PGlite) par défaut. Quand il ne suffit plus, pointez `DATABASE_URL` vers votre propre Postgres.",
    guide: "Guide d'auto-hébergement",
    github: "Le code sur GitHub",
  },
  framework: {
    eyebrow: "Le framework",
    title: "Suivez un endpoint.",
    intro:
      "Le formulaire de contact de ce dépôt, raccourci mais réel. Une seule définition devient interface web, commande CLI, outil MCP, écran natif, outil IA et tâche cron.",
    tabAdd: "Ajoutez le vôtre",
    call: {
      title: "Appelez-le",
      cli: "CLI",
      mcp: "MCP",
      ai: "Outil IA",
      cron: "Cron",
    },
    becomes: "Le formulaire de contact devient",
    more: "Plus {{count}} autres surfaces",
    source: "Code source complet sur GitHub",
    live: "En direct en bas de page",
    docs: "Documentation des patterns sur GitHub",
    deleteLine:
      "Une fonctionnalité, c'est un dossier. Supprimez-le, lancez `vibe gen`, et elle disparaît de toutes les surfaces d'un coup.",
    moreSurfaces: {
      webApi: "API REST",
      websocket: "Événements WebSocket",
      adminPanel: "Panneau d'admin",
      vibeFrame: "Widget intégrable",
    },
    surfaces: {
      web: {
        title: "Interface web",
        body: "Le formulaire en bas de cette page. Champs, validation et message de succès viennent de la définition.",
      },
      cli: {
        title: "Commande CLI",
        body: "`vibe contact-form`, un flag par champ, aide intégrée.",
      },
      mcp: {
        title: "Outil MCP",
        body: "Les agents y accèdent via `vibe mcp`, par l'outil `execute-tool`. Schéma d'entrée tiré directement de Zod.",
      },
      ai: {
        title: "Outil IA",
        body: "Les modèles peuvent l'appeler. Avec `requiresConfirmation`, l'utilisateur valide d'abord.",
      },
      native: {
        title: "Écran natif",
        body: "L'app Expo affiche le même widget avec des champs natifs. Beta.",
      },
      cron: {
        title: "Tâche cron",
        body: "N'importe quel endpoint tourne selon un planning. Même handler, pas de second chemin de code.",
      },
    },
    maturity: {
      stable: {
        title: "En production",
        body: "{{appName}} tourne sur ce code : web, CLI, MCP, outils IA, cron, temps réel, paiements.",
      },
      beta: {
        title: "Bêta",
        body: "Écrans React Native, synchronisation entre instances et skills distants fonctionnent, avec quelques aspérités.",
      },
      churn: {
        title: "Ça bouge vite",
        body: "Une seule équipe, qui avance vite. Pas encore de semver, et la doc a du retard sur le code. Épinglez un commit ou forkez.",
      },
    },
  },
  faq: {
    title: "Les questions des développeurs",
    free: {
      q: "Y a-t-il une offre API gratuite ?",
      a: "Non. L'API se débloque avec n'importe quel abonnement, dès {{subPrice}} par mois, ou avec des crédits attribués par notre équipe. Le quota de chat gratuit ne la débloque pas.",
    },
    sdks: {
      q: "Quels SDK et outils fonctionnent ?",
      a: "Les SDK officiels OpenAI et Anthropic, toute bibliothèque compatible OpenAI, et les agents de code comme Claude Code, Codex CLI, OpenCode, Aider, Cline et Continue. Changez l'URL de base et la clé.",
    },
    uncensored: {
      q: "Puis-je appeler des modèles non censurés via l'API ?",
      a: "Oui. Confirmez une fois sur la page des clés d'API que vous avez 18 ans ou plus, puis appelez-les comme n'importe quel autre modèle. Les modèles abliterated et UncensoredLM utilisent les mêmes endpoints.",
    },
    media: {
      q: "Images, voix, vidéo et musique aussi ?",
      a: "Même clé. `/v1/images`, `/v1/audio`, `/v1/videos` et `/v1/music` suivent les formats OpenAI quand il en existe un. La référence de l'API couvre chaque endpoint.",
    },
    limits: {
      q: "Quelles sont les limites de débit ?",
      a: "Aucune limite de débit fixe. L'usage est facturé à la requête sur vos crédits, avec une protection anti-abus généreuse (plafonds élevés de rafale et de flux simultanés). Les 429 des fournisseurs de modèles sont transmis avec leur en-tête `Retry-After`. Vous prévoyez un très gros volume ? Utilisez le formulaire de contact ci-dessous.",
    },
    selfHost: {
      q: "L'auto-hébergement est-il gratuit ?",
      a: "Oui. Le code est open source : MIT pour l'app, GPL v3 pour le framework. Apportez vos propres clés de fournisseur, ou connectez l'instance à votre compte {{appName}} et payez ce que vous consommez.",
    },
  },
  contact: {
    eyebrow: "L'endpoint, en direct",
    title: "Des questions, ou un gros projet en vue ?",
    description:
      "Installation, intégrations sur mesure, revue d'architecture. L'équipe qui l'a construit vous répond. Ce formulaire est l'endpoint de contact de la section framework.",
  },
  code: {
    copy: "Copier",
    copied: "Copié",
    wrap: "Retour à la ligne",
    anthropic: "Anthropic",
  },
};
