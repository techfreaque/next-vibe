import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Une base de code. 13 plateformes. Zéro compromis.",
    category: "Architecture",
    description:
      "Comment le principe de la Surface Unifiée transforme trois fichiers en appli web, commande CLI, outil MCP, écran natif et tâche cron, automatiquement.",
    imageAlt: "Architecture Surface Unifiée de next-vibe",
    keywords:
      "next-vibe, surface unifiée, pattern d'endpoint, MCP, CLI, TypeScript, framework SaaS, full-stack",
  },
  readingTime: "12 min de lecture",
  category: "Architecture",
  backToBlog: "Retour au blog",

  hero: {
    eyebrow: "Le principe de la Surface Unifiée",
    title: "Une base de code. 13 plateformes. Zéro compromis.",
    subtitle:
      "Comment trois fichiers deviennent un formulaire web, une commande CLI, un outil MCP, un écran natif et une tâche automatisée, en même temps.",
    fileBarLabel:
      "definition.ts → web · cli · mcp · native · cron · 10 de plus",
    theaCardTitle: "Qui est Thea ?",
    fileTreePath: "~/src/explain-to-my-boss/",
    codeBlockLabel: "allowedRoles: [",
    closingBracket: "]",
    vibeCliCommand:
      "vibe analytics/indicators/ema --source=leads_created --period=7",
  },

  intro: {
    hook: "5 802 fichiers TypeScript. ~2,1 millions de lignes. Zéro `any`. Zéro erreur de type à l'exécution. Un seul pattern. Répété 374 fois.",
    para1:
      "C'est la base de code derrière {{appName}}, et le framework qui la fait tourner, next-vibe. La même architecture fait tourner une appli web, une appli mobile, une CLI, une interface d'agent IA, un serveur MCP, un système cron, un bus d'événements websocket et un moteur de flux de données en temps réel.",
    para2:
      "Ce pattern s'appelle la Surface Unifiée. Voici ce que c'est, comment ça marche, et pourquoi, une fois que vous l'aurez vu, vous aurez du mal à revenir en arrière.",
  },

  fileTreeSection: {
    title: "Une fonctionnalité, c'est un dossier",
    intro:
      "Dans next-vibe, chaque fonctionnalité vit dans un dossier. Trois fichiers sont obligatoires. Tout le reste est facultatif.",
    fileTree: {
      line1: "explain-to-my-boss/",
      line2: "  definition.ts    ← ce qu'elle fait",
      line3: "  repository.ts    ← comment elle le fait",
      line4: "  route.ts         ← la fait exister partout",
      line5: "  widget.tsx       ← UI React sur mesure (facultatif)",
      line6: "  widget.cli.tsx   ← UI terminal sur mesure (facultatif)",
    },
    explanation:
      "C'est tout. Un dossier. Trois fichiers obligatoires. Et à partir de ces trois fichiers, la fonctionnalité existe sur jusqu'à 13 plateformes en même temps.",
  },

  platformsSection: {
    title: "13 plateformes à partir de 3 fichiers",
    subtitle:
      "Quand vous ajoutez une fonctionnalité à next-vibe, elle ne devient pas seulement un endpoint d'API. Elle devient tout à la fois.",
    platforms: {
      webApi: {
        label: "API web",
        description: "Endpoint REST, validé automatiquement, entièrement typé",
      },
      reactUi: {
        label: "UI React",
        description:
          "Générée automatiquement à partir de la définition, sans écrire de JSX",
      },
      cli: {
        label: "CLI",
        description:
          "Chaque endpoint est une commande avec des flags générés automatiquement",
      },
      aiTool: {
        label: "Schéma d'outil IA",
        description: "Schéma de function calling généré automatiquement",
      },
      mcpServer: {
        label: "Serveur MCP",
        description:
          "Se branche sur Claude Desktop, Cursor ou n'importe quel client MCP",
      },
      reactNative: {
        label: "React Native",
        description: "Écrans iOS et Android à partir de la même définition",
      },
      cron: {
        label: "Tâche cron",
        description:
          "Planifiez n'importe quel endpoint pour qu'il tourne à intervalles réguliers",
      },
      websocket: {
        label: "Événements WebSocket",
        description:
          "Envoie des mises à jour aux clients connectés une fois le travail fini",
      },
      electron: {
        label: "Bureau Electron",
        description: "Appli de bureau native via les mêmes contrats d'endpoint",
      },
      adminPanel: {
        label: "Panneau d'admin",
        description:
          "UI d'administration générée automatiquement, sans code sur mesure",
      },
      vibeFrame: {
        label: "Widget VibeFrame",
        description: "Widget iframe intégrable sur n'importe quel site",
      },
      remoteSkill: {
        label: "Skill d'agent",
        description: "Appelable par des agents IA comme compétence structurée",
      },
      vibeBoard: {
        label: "Nœud Vibe Sense",
        description:
          "Nœud dans un graphe de flux de données en temps réel, même endpoint",
      },
    },
  },

  deleteFolderQuote:
    "Supprimez le dossier. La fonctionnalité disparaît de partout à la fois.",

  platformMarkersSection: {
    title: "L'accès aux plateformes tient dans un tableau d'enums",
    para1:
      "Vous n'écrivez pas de couche de permissions séparée pour chaque plateforme. L'accès aux plateformes est déclaré dans la définition elle-même : un seul tableau d'enums que chaque plateforme lit nativement à l'exécution.",
    codeComment: "// Ce seul tableau décide où la fonctionnalité apparaît",
    cliOff: "  CLI_OFF,         // bloque la CLI",
    mcpVisible: "  MCP_VISIBLE,     // l'ajoute à la liste d'outils MCP",
    remoteSkill:
      "  REMOTE_SKILL,    // l'ajoute au fichier de skills de l'agent",
    productionOff: "  PRODUCTION_OFF,  // la désactive en prod",
    para2:
      "Même définition. Même endroit. Pas de fichiers de config à synchroniser. Pas de système de permissions séparé par plateforme.",
  },

  noApiSplitQuote:
    "Il n'y a pas une API pour les humains et une API pour l'IA. Il y a juste l'outil.",

  demoSection: {
    title: "La démo en direct : Thea construit un endpoint",
    subtitle:
      "Plutôt que d'expliquer le pattern dans l'abstrait, laissez-moi vous montrer à quoi il ressemble en pratique.",
    theaIntro:
      "Thea est l'IA d'administration de cette plateforme. Elle tourne en production 24 h/24, 7 j/7, et passe par exactement les mêmes contrats d'endpoint que n'importe quel utilisateur : même validation, mêmes permissions, aucune porte dérobée. Et elle peut déléguer du travail à une machine locale.",
    demoStory:
      "J'ai demandé à Thea de construire un nouvel endpoint, explain-to-my-boss, avec Claude Code qui tourne sur mon PC. Vous lui donnez une décision technique. Il vous rend une justification non technique que votre manager croira vraiment. Tous les développeurs en ont eu besoin un jour.",

    flow: {
      step1: {
        actor: "Vous",
        label: "Demandez à Thea",
        description:
          "Tapez la tâche dans le chat : deux champs de saisie, une réponse générée par l'IA, toutes les plateformes, MCP_VISIBLE, widgets React et CLI sur mesure.",
      },
      step2: {
        actor: "Thea",
        label: "Crée une tâche",
        description:
          'Thea raisonne à voix haute, crée une tâche avec targetInstance="hermes" (votre machine locale), puis se met en veille.',
      },
      step3: {
        actor: "Hermes en local",
        label: "Récupère la tâche",
        description:
          "L'instance locale se synchronise toutes les 60 secondes. Aucun port ouvert. C'est votre machine qui initie la connexion.",
      },
      step4: {
        actor: "Claude Code",
        label: "Construit l'endpoint",
        description:
          "Session interactive. Lit d'abord les patterns existants, crée cinq fichiers, lance vibe check. Zéro erreur.",
      },
      step5: {
        actor: "Claude Code",
        label: "Signale la fin",
        description:
          "Appelle complete-task avec l'id de la tâche. Statut : terminé. Résumé joint.",
      },
      step6: {
        actor: "Thea",
        label: "Se réveille",
        description:
          "wakeUp se déclenche. Thea reprend la conversation en cours via websocket, diffuse sa réponse en streaming, la synthèse vocale parle.",
      },
      step7: {
        actor: "Résultat",
        label: "Existe partout",
        description:
          "Formulaire web. Commande CLI. Outil MCP. Écran React Native. Tout est en ligne. À partir de cinq fichiers.",
      },
    },

    proofTitle: "La preuve",
    proofPara:
      "Dès que Claude Code a appelé complete-task, trois choses existaient qui n'existaient pas cinq minutes plus tôt :",
    proof1:
      "Un widget React sur mesure : titre spectaculaire, dégradé animé sur la sortie de l'IA, un faux score d'alignement corporate.",
    proof2:
      "Un widget CLI : bannière ASCII, spinner pendant que l'IA réfléchit, la justification affichée ligne par ligne en vert.",
    proof3:
      "Un outil MCP, explain-to-my-boss_POST, parce que MCP_VISIBLE figurait dans la définition. Claude Desktop peut désormais expliquer vos décisions à votre patron à votre place.",
    proofClosing:
      "Une définition. Cinq fichiers en tout. Trois UI complètement différentes. Le contrat de l'endpoint n'a pas changé. Seule la couche de présentation a changé.",
  },

  underTheHoodSection: {
    title: "Sous le capot",
    definitionTitle: "definition.ts : le contrat vivant",
    definitionPara:
      "La définition n'est pas un générateur de code. C'est un contrat vivant que chaque plateforme lit nativement à l'exécution. Modifiez-la : tout se met à jour. Supprimez le dossier : rien ne casse en aval. Aucun code généré à nettoyer.",
    repositoryTitle: "repository.ts : jamais de throw",
    repositoryPara:
      "Les fonctions du repository ne lèvent jamais d'exception. Les erreurs se propagent comme des données : typées, explicites, et gérables par l'appelant. L'IA peut raisonner sur les cas d'échec. Pas d'exception surprise.",
    repositoryCodeComment:
      "// Renvoie ResponseType<T>, ne lève jamais d'exception",
    routeTitle: "route.ts : tout le pont",
    routePara:
      "route.ts relie la définition au handler. endpointsHandler s'occupe de la validation, de l'authentification, des logs et de l'exposition sur les 13 plateformes. La logique métier proprement dite tient en une ligne.",
    statsTitle: "Les chiffres",
    statEndpoints: "374 endpoints",
    statEndpointsDetail: "Un seul pattern, appliqué 374 fois",
    statAny: "Zéro `any`",
    statAnyDetail: "Imposé à la compilation, pas par convention",
    statLanguages: "Trois langues",
    statLanguagesDetail:
      'Vérifiées à la compilation : t("typo.here") est une erreur de compilation',
    statsClosing: "Ce n'est pas une convention. C'est imposé à la compilation.",
  },

  onePatternQuote: "Un seul pattern. Répété 374 fois.",

  vibeSenseTeaser: {
    eyebrow: "À suivre",
    title: "Vibe Sense : le pipeline, c'est la plateforme",
    description:
      "Chaque nœud d'un graphe Vibe Sense est un endpoint next-vibe ordinaire. Le même createEndpoint(). La même structure en 3 fichiers. Un indicateur EMA est un endpoint. Un évaluateur de seuil est un endpoint. Et parce que c'est un endpoint, vous pouvez l'appeler depuis la CLI, depuis l'IA, depuis n'importe où.",
    calloutLine: "Le pipeline, c'est la plateforme.",
    teaser:
      "Vibe Sense, ce n'est que... davantage d'endpoints. La même chose, appliquée aux séries temporelles. Funnels de leads. Économie des crédits. Croissance des utilisateurs. Votre plateforme qui se surveille elle-même.",
    cta: "Retour au blog",
  },

  closing: {
    title: "Définissez-le une fois. Il existe partout.",
    para: "WordPress a donné à tout le monde le pouvoir de publier. next-vibe vous donne le pouvoir de construire des plateformes qui fonctionnent sur le web, le mobile, la CLI, les agents IA et l'automatisation, qui se surveillent elles-mêmes, raisonnent sur leurs propres données et agissent sur ce qu'elles trouvent.",
    cta: "Mettre une étoile à next-vibe sur GitHub",
    frameworkCta: "Découvrir next-vibe",
  },
};
