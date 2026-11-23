import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Auto-héberger {{appName}} : Votre instance, vos règles",
    description:
      "Toute la pile {{appName}} sur votre machine. Quatre commandes, puis un assistant de configuration dans le navigateur. Connectez votre compte {{appName}} ou vos propres clés.",
    category: "Auto-hébergement",
    imageAlt: "Auto-héberger {{appName}} : démarrage rapide",
    keywords:
      "auto-hébergement, self-host, next-vibe, {{appName}}, open source, IA privée, IA locale, OpenRouter",
  },
  hero: {
    badge: "Gratuit et open source",
    title: "Faites-le tourner chez vous.",
    titleHighlight: "Gardez tout.",
    subtitle:
      "Toute la pile {{appName}} sur votre machine. Connectez votre compte {{appName}} pour tous les modèles, ou apportez vos propres clés. Quatre commandes, puis le navigateur prend le relais.",
    ctaQuickstart: "Démarrer en quatre commandes",
    ctaGithub: "Voir sur GitHub",
  },
  quickstart: {
    eyebrow: "Démarrage rapide",
    title: "Quatre commandes. Puis le navigateur prend le relais.",
    intro:
      "Aucun fichier de configuration à modifier. Au premier login, un assistant s'ouvre et vous guide pour le reste.",
  },
  paths: {
    eyebrow: "Choisir votre IA",
    title: "Votre machine. Vos modèles.",
    intro:
      "Les deux options se trouvent à l'étape Fournisseur IA de l'assistant. Modifiables à tout moment.",
    account: {
      badge: "Recommandé",
      title: "Connecter votre compte {{appName}}",
      body: "Connectez-vous une fois dans l'assistant. Votre instance gère chaque discussion, les modèles tournent sur {{appName}} et sont facturés sur vos crédits. Plus de clés à gérer.",
      points: {
        models:
          "Les {{modelCount}} modèles, du grand public au non censuré, un seul login.",
        local: "Les discussions restent dans votre base locale.",
        sync: "Souvenirs, documents, skills et favoris se synchronisent par défaut, les fils non. Un interrupteur pour chacun.",
        paid: "Nécessite un abonnement payant ou un pack de crédits. Jusqu'à trois instances par compte.",
      },
      cta: "Créer votre compte {{appName}}",
    },
    standalone: {
      badge: "Sans compte",
      title: "En autonome, avec vos clés",
      body: "Aucun compte chez nous. Collez une clé de fournisseur à la même étape et payez le fournisseur directement.",
      points: {
        openrouter: "OpenRouter : des centaines de modèles, une seule clé.",
        claude:
          "Claude Code connecté sur cette machine ? Détecté automatiquement. Aucune clé requise.",
        more: "D'autres fournisseurs via Voir tous les paramètres, à tout moment.",
        billing:
          "Vous payez le fournisseur directement. Aucune facture {{appName}}.",
      },
      cta: "Obtenir une clé OpenRouter",
    },
  },
  own: {
    eyebrow: "Votre serveur, vos règles",
    title: "La pile est à vous. Le filtre aussi.",
    subtitle:
      "Votre Postgres, vos fichiers, vos logs. Vous choisissez les modèles et le niveau de filtrage entre vous et eux.",
    cards: {
      data: {
        title: "Vos données restent chez vous",
        body: "Fils, souvenirs et fichiers vivent dans votre propre base et votre propre dossier.",
      },
      filter: {
        title: "Votre niveau de filtrage",
        body: "Grand public, ouvert ou non censuré. Vous décidez par skill et par fil. Aucun service de modération dans la boucle.",
      },
      keys: {
        title: "Votre facture, votre choix",
        body: "Les coûts des modèles passent par vos crédits {{appName}} ou directement chez votre fournisseur. À vous de voir.",
      },
    },
  },
  includes: {
    title: "Tout ce que propose le cloud.",
    intro: "Le même code que {{appName}}. Rien de retenu.",
    items: {
      models:
        "{{modelCount}} modèles de chat, plus image, vidéo, musique et voix",
      memory: "Mémoire persistante et discussions incognito",
      search: "Recherche web et lecture de pages",
      thea: "Thea, votre admin IA : exécute les tâches, crée des outils sur demande",
      admin: "Tableau de bord admin et tâches cron",
      tools: "SSH, automatisation du navigateur, client e-mail comme outils IA",
    },
  },
  developers: {
    title: "Envie de construire dessus ?",
    body: "Chaque fonctionnalité tient dans un fichier de définition qui devient page web, commande CLI, outil MCP et outil IA.",
    cta: "Voir comment marche next-vibe",
  },
  help: {
    title: "Bloqué, ou pour toute une équipe ?",
    description:
      "Aide à l'installation, déploiements d'équipe, intégrations sur mesure. Un humain lit chaque message.",
  },
};
