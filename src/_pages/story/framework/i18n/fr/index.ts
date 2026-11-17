import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Framework next-vibe",
  description:
    "Le framework SaaS open source qui fait tourner {{appName}}. Définissez-le une fois, il existe partout.",
  meta: {
    title: "Framework next-vibe",
    description:
      "Framework SaaS open source, pensé pour l'IA. Une seule définition d'endpoint, treize plateformes.",
    category: "Framework",
    imageAlt: "Documentation du framework next-vibe",
    keywords:
      "next-vibe, framework, SaaS, open source, IA, full-stack, TypeScript",
  },
  hero: {
    eyebrow: "Open source · MIT + GPL v3",
    title: "Une définition.",
    titleAccent: "Treize plateformes.",
    subtitle:
      "next-vibe transforme une seule définition TypeScript en treize plateformes à la fois : interface web interactive, commande CLI, outil MCP, écran mobile, tâche cron, WebSocket, panneau d'admin, et plus encore. Typage complet, zéro dérive, zéro répétition.",
    ctaGithub: "Mettre une étoile sur GitHub",
    ctaDocs: "Lire la doc des patterns",
    stat1Label: "endpoints typés",
    stat2Value: "0",
    stat2Label: "erreur de type à l'exécution",
    stat3Label: "plateformes par endpoint",
    stat4Value: "2",
    stat4Label: "fichiers requis",
  },
  problem: {
    eyebrow: "Le problème",
    title: "Vous avez construit la même chose treize fois.",
    subtitle:
      "Chaque fonctionnalité exige sa propre interface web, sa commande CLI, son outil MCP, son écran mobile, sa tâche cron, son handler WebSocket, son panneau d'admin, et plus encore. La même validation, la même i18n, la même gestion d'erreurs, juste habillées différemment. À chaque fois.",
    callout: "next-vibe construit les treize à partir d'un seul fichier.",
  },
  pattern: {
    eyebrow: "Le pattern",
    title: "Deux fichiers requis. Toutes les plateformes.",
    subtitle:
      "Chaque fonctionnalité vit dans un dossier. Seuls definition.ts et route.ts sont requis. Tout le reste est optionnel.",
    definitionTitle: "definition.ts : le contrat",
    definitionBody:
      "Déclarez une seule fois vos champs, schémas Zod, libellés, types d'erreurs et exemples. Ce fichier est l'unique source de vérité : le framework le lit à l'exécution, sur chaque plateforme.",
    routeTitle: "repository.ts : la logique",
    routeBody:
      "La logique métier vit ici : requêtes en base, contrôles d'accès, gestion des erreurs avec success()/fail(). Le route.ts n'est qu'un mince délégateur. Validation, logs et enregistrement sur les plateformes se font automatiquement.",
    widgetTitle: "widget.tsx : l'interface (optionnel)",
    widgetBody:
      "Sans widget, le framework affiche automatiquement vos champs partout. Ajoutez widget.tsx pour livrer une interface interactive entièrement sur mesure : le même composant s'affiche dans les panneaux d'admin, les widgets intégrés et les écrans mobiles.",
    deleteLine:
      "Supprimez le dossier. La fonctionnalité disparaît de toutes les plateformes d'un coup.",
  },
  surfaces: {
    items: {
      webApi: {
        label: "API web",
        description: "Endpoint REST, entièrement validé et typé",
      },
      reactUi: {
        label: "Interface React",
        description: "Une interface interactive dédiée, sans JSX à écrire",
      },
      cli: {
        label: "CLI",
        description:
          "Chaque endpoint est une commande aux options générées automatiquement",
      },
      aiTool: {
        label: "Outil IA",
        description: "Schéma de function calling généré automatiquement",
      },
      mcpServer: {
        label: "Serveur MCP",
        description:
          "Connectez Claude Desktop, Cursor, n'importe quel client MCP",
      },
      reactNative: {
        label: "React Native",
        description: "Écrans iOS et Android à partir de la même définition",
      },
      cron: {
        label: "Tâche cron",
        description:
          "Planifiez n'importe quel endpoint avec une expression cron",
      },
      websocket: {
        label: "WebSocket",
        description:
          "Envoyez des mises à jour aux clients connectés une fois la tâche terminée",
      },
      electron: {
        label: "Electron",
        description: "App de bureau native via les mêmes contrats d'endpoint",
      },
      adminPanel: {
        label: "Panneau d'admin",
        description:
          "Interface d'admin générée automatiquement, sans code dédié",
      },
      vibeFrame: {
        label: "Widget VibeFrame",
        description: "Widget iframe intégrable sur n'importe quel site",
      },
      remoteSkill: {
        label: "Compétence d'agent",
        description:
          "Appelable par des agents IA comme une compétence structurée",
      },
      vibeBoard: {
        label: "Nœud Vibe Sense",
        description:
          "Un nœud dans un graphe de flux de données en direct, même endpoint",
      },
    },
  },
  typescript: {
    eyebrow: "La suprématie de TypeScript",
    title: "Pas de any. Pas de unknown. Pas de throw.",
    subtitle:
      "Les types doivent concorder entièrement, sans exception. Ce n'est pas une préférence de style. C'est une règle structurelle, imposée à la compilation par vibe check.",
    patterns: {
      any: {
        name: "pas de any",
        description:
          "Remplacez-le par une vraie interface typée. Si vous avez besoin de any, votre architecture a un trou.",
      },
      unknown: {
        name: "pas de unknown",
        description:
          "Même règle. unknown, c'est any avec des étapes en plus. Définissez le type.",
      },
      object: {
        name: "pas de object nu",
        description:
          "Un object nu ne veut rien dire. Écrivez la forme que vous attendez vraiment.",
      },
      asX: {
        name: "pas de as X",
        description:
          "Les assertions de type mentent au compilateur. Corrigez plutôt l'architecture.",
      },
      throwStatements: {
        name: "pas de throw",
        description:
          "Utilisez ResponseType<T> avec success(data) ou fail({message, errorType}). Les erreurs sont des données.",
      },
      hardcodedStrings: {
        name: "pas de chaînes en dur",
        description:
          "Chaque chaîne a besoin d'une clé de traduction. Le vérificateur repère les littéraux non traduits.",
      },
    },
    vibeCheck:
      "vibe check lance Oxlint (Rust), ESLint et la vérification de types TypeScript en parallèle. Zéro erreur exigée avant livraison.",
  },
  examples: {
    eyebrow: "Construit avec next-vibe",
    title: "Du tableau de bord de voiture à la plateforme d'IA.",
    subtitle:
      "Même base de code, n'importe quelle surface. Ce sont de vrais produits qui tournent sur next-vibe : un PC de voiture, des boutiques en ligne, des sites de réservation, et {{appName}} lui-même. Un seul framework, des produits radicalement différents.",
    items: {
      headunit: {
        label: "Tableau de bord embarqué",
        title: "Un autoradio complet",
        body: "Navigation, climatisation, radio, Spotify, appels Bluetooth et diagnostic du véhicule en direct, plus Android Auto, sur un PC de voiture à écran tactile. Construit comme un fork de next-vibe.",
      },
      shop: {
        label: "E-commerce",
        title: "Des boutiques en ligne qui vendent",
        body: "Vitrine, panier, paiement, stock et caisse à partir d'une seule installation. Une vraie boutique tourne dessus aujourd'hui.",
      },
      booking: {
        label: "Réservations",
        title: "Sites de praticiens et de réservation",
        body: "Rendez-vous, dossiers clients, facturation et site public : la colonne vertébrale d'un cabinet. La même stack que la boutique.",
      },
      aiPlatform: {
        label: "Plateforme d'IA",
        title: "{{appName}}",
        body: "{{modelCount}} modèles, chat, mémoire persistante, agents, facturation et MCP : le produit phare. Exactement cette base de code, en production.",
      },
    },
  },
  quickstart: {
    eyebrow: "Démarrer",
    title: "Forkez, demandez, livrez.",
    subtitle: "Vous êtes au niveau de {{appName}} dès le premier jour.",
    step1: {
      label: "Forker et cloner",
      description: "Forkez sur GitHub, puis clonez votre fork en local.",
    },
    step2: {
      label: "Lancer le serveur",
      description:
        "En développement local, vibe dev lance PostgreSQL dans Docker, exécute les migrations, insère les données initiales et active le rechargement à chaud. En production, vibe build && vibe start fait le premier déploiement. Ensuite, vibe rebuild met la production à jour sans aucune interruption.",
    },
    step3: {
      label: "Se connecter en admin",
      description:
        "Ouvrez l'app et cliquez sur « Login as Admin » : l'assistant de configuration vous guide pour les clés API et le mot de passe admin.",
    },
    step4: {
      label: "Demander à l'IA",
      description:
        "Ouvrez le chat {{appName}} ou Claude Code et décrivez la fonctionnalité voulue. L'IA écrit tous les fichiers (définition, route, widget, i18n) et lance vibe check automatiquement.",
    },
    docsLink: "Documentation des patterns",
    githubLink: "github.com/techfreaque/next-vibe",
  },
  oneDef: {
    eyebrow: "Une seule définition",
    title: "Écrivez-le une fois. Faites-le tourner partout.",
    subtitle:
      "Voici un vrai endpoint de ce dépôt : il lit la fenêtre active sur un bureau Linux. Trois fichiers. Aucun code de liaison. Il apparaît comme page web, commande CLI, outil MCP, outil IA et tâche cron.",
    defTitle: "definition.ts",
    defBody:
      "Chemin, alias, rôles, schéma Zod, widget, erreurs, exemples. Tout ce dont chaque surface a besoin, au même endroit.",
    routeTitle: "route.ts",
    routeBody:
      "Relie la définition à une fonction du repository. Ce handler est ce que chaque surface appelle.",
    surfacesTitle: "Ce que vous obtenez sans écrire une ligne de plus",
    cli: {
      title: "Commande CLI",
      body: "L'alias devient une commande. La sortie est rendue par le même widget, mise en page pour le terminal.",
    },
    mcp: {
      title: "Outil MCP",
      body: "Pointez n'importe quel client MCP vers vibe mcp. Les schémas viennent directement des champs Zod.",
    },
    ai: {
      title: "Outil appelable par une IA",
      body: "Les modèles reçoivent un schéma de function calling généré à partir de la définition. Les rôles décident qui peut l'appeler.",
    },
    cron: {
      title: "Tâche cron",
      body: "Le même handler, désormais planifié. Voici le vrai fichier de tâche de notre job d'expiration des crédits.",
    },
    more: "Plus une page web sur /tools/<alias>, une route REST typée et un écran natif. Le widget s'affiche sur chacun d'eux. Supprimez le dossier de l'endpoint, et toutes les surfaces disparaissent avec lui.",
    addTitle: "Ajoutez le vôtre en cinq lignes de shell",
    addBody:
      "Créez le dossier, écrivez les trois fichiers, régénérez, vérifiez. Si vibe check affiche 0 erreur, ça marche partout.",
  },
  enterprise: {
    eyebrow: "Entreprise",
    title: "Vous construisez quelque chose de grand ?",
    description:
      "Nous aidons les équipes pour l'installation, les intégrations sur mesure, la revue d'architecture et le suivi du développement. Même base de code, votre déploiement.",
  },
};
