import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Votre IA confie le travail à Claude Code | {{appName}}",
    description:
      "L'outil coding-agent permet à votre IA de déléguer de vraies modifications de code à Claude Code ou OpenCode : en arrière-plan, ou en session live dans une vraie fenêtre de terminal qui rend compte une fois le travail fini. Désormais d'une instance à l'autre.",
    category: "Agent de code",
    imageAlt:
      "Agent de code interactif : Claude Code dans une fenêtre de terminal",
    keywords:
      "agent de code, coding agent, Claude Code, OpenCode, terminal IA, MCP complete-task, IA auto-hébergée, next-vibe, {{appName}}",
  },
  hero: {
    backToBlog: "Retour au blog",
    category: "Agent de code",
    readTime: "5 min de lecture",
    title: "Votre IA ouvre un terminal et confie le travail à Claude Code.",
    subtitle:
      "Les IA de chat parlent du code. Les agents de code le modifient. L'outil coding-agent relie les deux, et en mode interactif, vous regardez le travail se faire dans une vraie fenêtre de terminal.",
  },
  intro: {
    p1: "Vous demandez à votre IA de corriger un test qui échoue. Elle peut expliquer la correction. Elle ne peut pas modifier votre dépôt, lancer la suite de tests et itérer jusqu'au vert. Claude Code et OpenCode, si.",
    p2: "L'outil coding-agent confie la tâche à l'un d'eux, sur la machine où se trouve le code, et rapatrie le résultat dans votre conversation.",
  },
  modes: {
    title: "Deux modes",
    intro: "Lancer et récupérer, ou regarder et piloter.",
    batch: {
      label: "Par défaut",
      title: "Batch",
      body: "Tourne en arrière-plan. Récupère tout ce que l'agent affiche et le renvoie dans la conversation. S'arrête au bout de 30 minutes.",
    },
    interactive: {
      label: "Regarder et piloter",
      title: "Interactif",
      body: "Ouvre une vraie fenêtre de terminal avec une session live. Suivez le travail, répondez à ses questions, réorientez-le. Pas de limite de temps : le résultat arrive dans votre fil quand la session rend compte.",
    },
  },
  handBack: {
    title: "Comment le résultat retrouve son chemin",
    intro:
      "La session de terminal est un processus séparé. Voici comment sa réponse arrive quand même dans le bon fil.",
    step1Title: "Votre IA appelle l'outil",
    step1Body: "Avec votre prompt et le mode interactif activé.",
    step2Title: "Une tâche suivie est créée",
    step2Body: "Le fil attend cette tâche, pas le terminal.",
    step3Title: "Une fenêtre de terminal s'ouvre",
    step3Body:
      "Terminal sur macOS, votre $TERMINAL ou le premier émulateur trouvé sur Linux, une nouvelle console PowerShell sur Windows.",
    step4Title: "L'agent reçoit ses consignes",
    step4Body:
      "Le prompt contient une ligne de plus : une fois terminé, appeler complete-task sur le serveur MCP de cette instance avec cet id de tâche.",
    step5Title: "Le résultat arrive dans votre fil",
    step5Body: "complete-task transmet la sortie et la conversation reprend.",
    codeCaption: "La ligne ajoutée à chaque prompt interactif de Claude Code :",
  },
  whatsNew: {
    title: "Nouveau : ça fonctionne d'une instance à l'autre",
    intro:
      "Thea, dans le cloud, peut maintenant demander à Hermes, sur votre machine, de lancer une session de code.",
    item1:
      "Sur l'instance distante, la session tourne comme tâche d'arrière-plan suivie : rien n'est bloqué pendant que vous travaillez dans le terminal.",
    item2:
      "Quand la session rend compte via complete-task, le vrai résultat est relayé vers l'instance qui l'a demandé.",
    item3:
      "Sur Windows, une vraie fenêtre de console s'ouvre. La commande est d'abord écrite dans un script PowerShell, pour que les prompts avec guillemets, accolades ou retours à la ligne restent intacts.",
    item4:
      "Une session lancée par la machine locale peut rendre compte de n'importe quelle tâche appartenant à sa propre instance.",
    item5:
      "Pas de canal live pour rendre compte ? Le mode interactif bascule en batch, et l'appelant obtient quand même une réponse.",
  },
  tryIt: {
    title: "Essayez",
    p1: "L'outil est réservé aux admins et n'existe que sur les instances auto-hébergées : il exécute une CLI de code avec tous les droits dans le dossier de votre projet. Claude Code ou OpenCode doit être installé et connecté sur cette machine.",
    p2: "Ensuite, demandez dans le chat, ou appelez-le directement depuis le terminal :",
  },
  cta: {
    title: "Donnez des mains à votre IA.",
    subtitle:
      "Auto-hébergez next-vibe, connectez-vous une fois à Claude Code, et laissez votre IA livrer des modifications de code sur sa propre machine.",
    selfHost: "Guide d'auto-hébergement",
    framework: "Découvrir next-vibe",
  },
};
