import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Framework next-vibe et API unbottled.ai | Développeurs",
    description:
      "Découvrez comment un endpoint TypeScript alimente le web, le CLI, MCP, le natif et les outils IA. Lancez next-vibe en local ou intégrez l’API unbottled.ai à votre SDK.",
    category: "Outils de développement",
    imageAlt: "next-vibe et unbottled.ai pour les développeurs",
    keywords:
      "next-vibe, framework TypeScript, MCP, API unbottled.ai, OpenAI, Anthropic",
  },
  hero: {
    title: "next-vibe pour les développeurs",
    subtitle:
      "Un framework TypeScript où un seul fichier `definition.ts` alimente une interface web, une commande CLI, un outil MCP, un écran natif et un outil IA.",
    quickstart: "Lancer next-vibe en local",
  },
  example: {
    title: "Un endpoint en pratique",
    intro:
      "Voici l’endpoint du formulaire de contact d’unbottled.ai. Dans cet extrait, `definition.ts` valide le message et choisit le composant d’interface. `route.ts` relie le contrat au code qui traite la demande.",
    source: "Voir le code de l’endpoint sur GitHub",
    form: "Ouvrir le formulaire de contact",
    web: {
      title: "Interface web",
      body: "Sur `/help`, le composant partagé affiche une zone de texte pour le message et une confirmation après l’envoi.",
    },
    cli: {
      title: "Commande CLI",
      body: "`vibe contact-form` tire des champs de la requête ses options, comme `--name` et `--message`.",
    },
    mcp: {
      title: "Outil MCP",
      body: "Un client MCP appelle `execute-tool` avec `toolName: contact-form` et les mêmes paramètres.",
    },
    native: {
      title: "Écran natif",
      body: "L’application Expo peut afficher le même composant avec des champs natifs et un bouton d’envoi adapté au tactile.",
    },
    ai: {
      title: "Outil IA",
      body: "Un agent peut appeler `contact-form` en renseignant les mêmes champs `name` et `message`. L’endpoint demande à l’utilisateur de confirmer avant l’envoi.",
    },
  },
  quickstart: {
    title: "Démarrer en local",
    intro:
      "La configuration PostgreSQL par défaut utilise Linux, Git, Bun, Node.js et Docker.",
    start:
      "`bun run dev` lance `vibe dev`, démarre la base locale, applique les migrations et charge les données initiales. Ouvrez l’URL affichée dans le terminal et connectez-vous en tant qu’admin de développement pour configurer votre fournisseur IA.",
    pglite:
      'Pour démarrer sans Docker, lancez `bun run dev` avec `DATABASE_URL="file:./data.db"` pour utiliser PGlite en mode embarqué.',
    github: "Voir le dépôt GitHub",
    selfHost: "Lire le guide d’auto-hébergement",
  },
  api: {
    title: "Appeler l’API unbottled.ai",
    intro:
      "Utilisez votre SDK OpenAI ou Anthropic avec l’URL de base d’unbottled.ai et une clé d’API. L’API hébergée prend en charge Chat Completions et Responses d’OpenAI, ainsi que Messages d’Anthropic.",
    models:
      "Créez une clé et définissez `UNBOTTLED_API_KEY` dans votre shell. Vous pouvez alors lister les modèles accessibles à votre compte.",
    request: "Lister les modèles",
    docs: "Lire la référence API",
    keys: "Gérer les clés d’API",
  },
  architecture: {
    title: "Dans les rouages de next-vibe",
    platform: {
      title: "Rôles et marqueurs de plateforme",
      body: "Les rôles déterminent qui peut appeler un endpoint. Les marqueurs indiquent où il est accessible. `AI_TOOL_OFF` désactive son utilisation comme outil IA. `MCP_VISIBLE` le rend visible dans la liste des outils du serveur MCP.",
    },
    data: {
      title: "Zod, Drizzle et PostgreSQL",
      body: "Zod valide les entrées et les sorties et fournit les schémas des outils. La couche d’accès aux données utilise Drizzle. Les schémas des tables PostgreSQL et les migrations sont versionnés dans le dépôt.",
    },
    realtime: {
      title: "Événements typés en temps réel",
      body: "Les endpoints déclarent leurs schémas d’événements et la portée de leurs canaux. Les clients reçoivent les tokens et l’avancement des tâches par WebSocket. Le pub/sub tourne dans le processus ou via Redis.",
    },
    remote: {
      title: "Instances distantes",
      body: "Les instances connectées peuvent exécuter des outils sur une autre instance et synchroniser les domaines de données activés. Chaque instance applique ses propres permissions. La connexion s’établit en direct ou via un relais sortant.",
    },
    maturity: {
      title: "État du projet",
      body: "next-vibe est publié sous licence GPL-3.0. En production, unbottled.ai utilise next-vibe sur Next.js. En local, le développement s’appuie par défaut sur TanStack Start et Vite. React Native et la découverte de skills sur des instances distantes sont en bêta.",
    },
  },
  code: {
    copy: "Copier le code",
    copied: "Copié",
    wrap: "Retour à la ligne",
    terminal: "Terminal",
  },
};
