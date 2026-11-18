import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Auto-héberger {{appName}} - Votre instance, vos règles",
    description:
      "Faites tourner toute la stack {{appName}} sur votre propre serveur. Vos propres clés API, Thea comme administratrice IA, un contrôle total. Gratuit pour toujours.",
    category: "Auto-hébergement",
    imageAlt: "Démarrage rapide pour auto-héberger {{appName}}",
    keywords:
      "auto-hébergement, self-host, next-vibe, {{appName}}, open source, IA, VPS, Docker, Kubernetes",
  },
  hero: {
    badge: "Gratuit pour toujours : MIT + GPL v3",
    title: "Faites-le tourner vous-même.",
    titleHighlight: "Tout vous appartient.",
    subtitle:
      "Toute la stack {{appName}} sur votre propre serveur. Chaque modèle, chaque outil, chaque fonctionnalité. Plus Thea, votre administratrice IA qui surveille et répare votre instance 24 h/24, 7 j/7.",
    ctaQuickstart: "Aller au démarrage rapide",
    ctaGithub: "Mettre une étoile sur GitHub",
  },
  includes: {
    title: "Tout ce qu'offre le cloud. Et plus encore.",
    items: {
      models:
        "{{modelCount}} modèles : utilisez vos propres clés API, payez directement les fournisseurs",
      memory:
        "Mémoire persistante, mode incognito, 4 niveaux de confidentialité",
      search: "Recherche web en direct + récupération de pages complètes",
      thea: "Thea : une administratrice IA qui surveille, s'auto-répare et crée des outils sur demande",
      admin:
        "Tableau de bord admin, DB studio, tableau des tâches cron, surveillance de l'état",
      ssh: "SSH, automatisation du navigateur, client e-mail : les outils de Thea",
      sync: "Synchronisation de l'instance locale avec le cloud {{appName}} (bêta)",
      free: "Gratuit pour toujours : MIT + GPL v3, aucune dépendance à un fournisseur",
    },
  },
  quickstart: {
    title: "Démarrage rapide",
    subtitle: "Trois commandes. En ligne en 5 minutes.",
    step1: {
      title: "Cloner et installer",
      description: "Récupérez le code et installez les dépendances.",
    },
    step2: {
      title: "Lancer le serveur de dev",
      description:
        "Lance PostgreSQL dans Docker, exécute les migrations, insère les données initiales et s'ouvre sur localhost:3000.",
      noDocker:
        'Pas de Docker ? Définissez DATABASE_URL="file:///absolute/path/data.db" dans .env, et vibe dev tourne alors sur PGlite embarqué.',
    },
    step3: {
      title: "Se connecter et configurer",
      description:
        "Cliquez sur « Login as Admin » sur la page de connexion : aucun mot de passe requis en dev. Vous arrivez sur la page des paramètres, où un assistant vous guide pour configurer les clés API et le mot de passe admin.",
    },
    step4: {
      title: "Choisir un fournisseur d'IA",
      optionA: {
        label: "Option A : Claude Code (recommandé)",
        description:
          "Aucune clé API requise. Utilise votre abonnement Claude existant. Choisissez n'importe quel modèle claude-code-* dans le sélecteur de modèle.",
      },
      optionB: {
        label: "Option B : OpenRouter",
        description:
          "Tous les modèles OpenRouter, paiement à l'usage. Obtenez votre clé sur openrouter.ai/keys.",
      },
    },
  },
  vps: {
    title: "Déploiement sur un VPS ?",
    description:
      "Fonctionne sur n'importe quel VPS Linux. Pointez nginx ou Caddy vers le port 3000, c'est tout.",
    docker: "Configuration Docker",
    kubernetes: "Kubernetes",
    kubernetesDescription:
      "Inclut des modèles pour le web, les workers de tâches, Redis, l'ingress et le namespace.",
  },
  localSync: {
    title: "Connectez votre machine locale (bêta)",
    description:
      "Thea peut confier des tâches à Claude Code sur votre machine de dev. Dans le tableau de bord, allez dans Admin → Remote Connections pour ajouter l'URL de votre instance locale. Mémoires et tâches se synchronisent toutes les 60 secondes. Sans redirection de port, sans VPN.",
  },
  own: {
    eyebrow: "Votre serveur, vos règles",
    title: "La stack est à vous. Le filtre aussi.",
    subtitle:
      "Pas de compte chez une entreprise tierce. Votre Postgres, vos clés, vos logs. Vous choisissez les modèles, et vous choisissez le niveau de filtrage entre eux et vous.",
    cards: {
      data: {
        title: "Vos données restent chez vous",
        body: "Fils, mémoires et fichiers vivent dans votre propre Postgres et votre propre stockage. Rien n'est renvoyé ailleurs.",
      },
      filter: {
        title: "Votre niveau de filtrage",
        body: "Modèles grand public, open source ou non censurés. Vous décidez par compétence, par fil, par utilisateur. Aucune équipe de modération dans la boucle.",
      },
      keys: {
        title: "Vos clés",
        body: "Branchez OpenRouter, un modèle local ou Claude Code. Vos dépenses vont à votre fournisseur, sans passer par nous.",
      },
    },
  },
  env: {
    title: "Ce qu'il vous faut",
    intro:
      "Bun, Docker et quelques variables d'environnement. C'est toute la liste pour une instance privée.",
    envLabel: "Configuration minimale",
    composeLabel: "Production sur un VPS",
  },
  instances: {
    title: "Trois instances, trois rôles",
    intro:
      "Une seule base de code tourne en instances séparées. Même code, base de données et rôle différents. C'est ainsi que nous faisons tourner la nôtre.",
    atlas: {
      name: "Atlas",
      body: "L'instance de dev. Rechargement à chaud, base de données jetable. C'est là que le code s'écrit.",
    },
    hermes: {
      name: "Hermes",
      body: "Votre instance du quotidien. Aperçu local sur son propre Postgres. C'est celle où vous vivez.",
    },
    thea: {
      name: "Thea",
      body: "L'instance cloud sur votre VPS. Toujours allumée, elle exécute vos crons et reçoit des tâches des deux autres.",
    },
    note: "Les instances se connectent entre elles. Fils et tâches se synchronisent entre votre portable et votre serveur.",
  },
  fork: {
    title: "Même framework, autre produit",
    body: "next-vibe-headunit est un fork pour PC de voiture. Médias, navigation, climatisation, Bluetooth et radio sont tous des endpoints, et chacun est aussi une commande CLI et un outil IA. Autre produit, les trois mêmes fichiers.",
  },
  enterprise: {
    title: "Besoin d'aide pour l'installation ?",
    description:
      "Nous pouvons vous aider pour le déploiement, les intégrations sur mesure et le suivi du développement.",
  },
};
