import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Auto-héberger {{appName}} : votre serveur, tous les modèles",
    description:
      "Faites tourner {{appName}} sur votre machine. git clone, bun i, vibe dev. Connectez votre compte {{appName}} et les {{modelCount}} modèles répondent. Aucune clé de fournisseur.",
    category: "Auto-hébergement",
    imageAlt: "Auto-héberger {{appName}} sur votre machine",
    keywords:
      "auto-hébergement, self-host, chat IA auto-hébergé, next-vibe, {{appName}}, open source, IA privée, IA locale, IA non censurée",
  },
  hero: {
    badge: "Gratuit et open source",
    title: "Votre serveur.",
    titleHighlight: "Tous les modèles.",
    subtitle:
      "{{appName}} sur votre propre machine. Connectez votre compte {{appName}} et les {{modelCount}} modèles répondent. Aucune clé de fournisseur. Vos conversations ne quittent jamais votre base.",
    ctaStart: "Lancer l'installation",
    ctaGithub: "Voir sur GitHub",
  },
  diagram: {
    link: "Une seule connexion",
    instance: {
      label: "Tourne chez vous",
      title: "Votre instance",
      points: {
        chats:
          "Conversations, mémoires et documents dans votre propre Postgres",
        files: "Fichiers envoyés et médias générés sur votre disque",
        tools: "Thea, les tâches cron et tous les outils IA",
        admin: "Votre accès admin. Vos règles.",
      },
    },
    account: {
      label: "Tourne sur {{appName}}",
      title: "Votre compte",
      points: {
        models: "{{modelCount}} modèles, du grand public au non censuré",
        credits: "Facturé sur vos crédits {{appName}}",
        keys: "Aucune clé de fournisseur à gérer",
        unlock: "Débloqué par n'importe quel abonnement ou pack de crédits",
      },
    },
  },
  start: {
    eyebrow: "Installation",
    title: "Cloner. Installer. Lancer.",
    intro:
      "Trois commandes dans le terminal. Tout le reste se passe dans le navigateur. Aucun fichier de config à modifier.",
    terminal: {
      eyebrow: "Dans le terminal",
      title: "Démarrer votre instance",
      copyAll: "Tout copier",
      copy: "Copier",
      copied: "Copié",
      rows: {
        clone: "Récupérer le code",
        cd: "Entrer dans le dossier",
        install: "Installer. Ajoute aussi vibe à votre PATH.",
        dev: "Démarrer. La base et les données initiales se mettent en place seules.",
      },
      facts: {
        docker: "Pas de Docker",
        postgres: "Pas d'install Postgres",
        config: "Pas de .env à bricoler",
      },
      troubleshoot: {
        notFound: {
          problem: "vibe: command not found ?",
          fix: "Ouvrez un nouveau terminal ou lancez",
        },
        port: {
          problem: "Port 3000 déjà pris ?",
          fix: "Prenez un autre port :",
        },
      },
    },
    prereqs: {
      summary: "Nouvelle machine ? Installez d'abord git et Bun",
      body: "Une fois par machine. Il vous faut git et Bun 1.3 ou plus récent. Choisissez votre système.",
      newTerminal:
        "Ouvrez ensuite un nouveau terminal pour que git et bun soient dans votre PATH.",
    },
    browser: {
      eyebrow: "Dans le navigateur",
      title: "L'assistant de configuration fait le reste",
      recommended: "Recommandé",
      steps: {
        open: {
          title: "Ouvrez {{url}}",
          body: "Une instance neuve ouvre l'assistant de configuration toute seule. Cliquez sur « Lancer la configuration ».",
        },
        admin: {
          title: "Créez votre accès admin",
          body: "Votre e-mail, votre mot de passe. Il remplace l'accès par défaut. Les clés de sécurité sont déjà générées.",
        },
        ai: {
          title: "Connectez votre compte {{appName}}",
          body: "Saisissez l'e-mail et le mot de passe de votre compte {{appName}}. Tous les modèles se débloquent avec n'importe quel abonnement ou pack de crédits. Aucune clé.",
        },
        extras: {
          title: "Les extras, quand vous en avez besoin",
          body: "E-mail, paiements Stripe, stockage S3. Tout est optionnel. Passez et revenez plus tard.",
        },
      },
      done: "Terminez la configuration. Discutez.",
    },
  },
  ai: {
    eyebrow: "Connecter l'IA",
    title: "Une connexion. Tous les modèles.",
    intro:
      "Votre instance fait tourner l'appli. {{appName}} fait tourner les modèles.",
    account: {
      badge: "Recommandé",
      title: "Votre compte {{appName}}",
      body: "Connectez-vous une fois dans l'assistant. Chaque conversation tourne sur votre instance, chaque appel de modèle tourne sur {{appName}} et puise dans vos crédits.",
      points: {
        models: {
          title: "{{modelCount}} modèles",
          body: "Grand public, ouverts et non censurés. Le même catalogue que sur {{appName}}.",
        },
        local: {
          title: "Les conversations restent chez vous",
          body: "Les fils vivent dans votre base. Aucune synchronisation sauf si vous l'activez.",
        },
        sync: {
          title: "Votre config vous suit",
          body: "Mémoires, documents, skills et favoris se synchronisent par défaut. Un interrupteur pour chacun.",
        },
        paid: {
          title: "Tout achat débloque l'accès",
          body: "Un abonnement ou n'importe quel pack de crédits. Jusqu'à trois instances par compte.",
        },
      },
      cta: "Créer votre compte {{appName}}",
      pricing: "Voir les offres",
    },
    claude: {
      title: "Claude Code sur cette machine",
      body: "Connecté avec la CLI claude ? L'assistant le détecte. Les modèles Claude tournent sur votre abonnement Claude. Rien à saisir.",
    },
    keys: {
      title: "Vos propres clés de fournisseur",
      body: "Sans compte {{appName}}. Collez une clé à la même étape et payez le fournisseur directement.",
      providers: {
        openrouter: "OpenRouter",
        venice: "Venice AI",
        nanogpt: "NanoGPT",
      },
      cta: "Obtenir une clé OpenRouter",
    },
  },
  own: {
    eyebrow: "Votre serveur, vos règles",
    title: "Votre stack. Votre filtre.",
    subtitle:
      "Votre Postgres, vos fichiers, vos logs. Vous choisissez les modèles et le niveau de filtrage entre vous et eux.",
    cards: {
      bill: {
        title: "Votre facture, votre choix",
        body: "Les modèles se paient sur vos crédits {{appName}} ou directement chez votre propre fournisseur. À vous de voir.",
      },
      filter: {
        title: "Votre niveau de filtrage",
        body: "Modèles grand public, ouverts ou non censurés. Vous décidez par skill et par fil. Aucune équipe de modération dans la boucle.",
      },
      code: {
        title: "Code ouvert, aucun verrou",
        body: "Le même code que {{appName}}, public sur GitHub. Lisez-le, modifiez-le, forkez-le.",
      },
    },
  },
  includes: {
    title: "Tout ce qu'offre le cloud.",
    intro: "Le même code que {{appName}}. Rien de retenu.",
    items: {
      models:
        "{{modelCount}} modèles de chat, plus image, vidéo, musique et voix",
      memory: "Mémoire persistante et conversations incognito",
      search: "Recherche web et lecture de pages",
      thea: "Thea, votre admin IA : exécute des tâches, crée des outils sur demande",
      admin: "Tableau de bord admin et tâches cron",
      tools:
        "SSH, automatisation du navigateur et client e-mail comme outils IA",
    },
  },
  server: {
    eyebrow: "Mise en production",
    title: "Passez-le sur un serveur.",
    intro:
      "Même dépôt, mêmes trois commandes. Puis un build de production à la place du serveur de dev.",
    terminalTitle: "Sur votre serveur",
    rows: {
      start: "Premier démarrage : build de production",
      update: "Après une mise à jour du code : redéploiement sans coupure",
    },
    points: {
      proxy: "Pointez Caddy ou nginx sur le port 3000 pour le HTTPS.",
      env: "Le même assistant à la première visite. Vous préférez les variables d'environnement ? Définissez-les dans votre déploiement et redémarrez.",
      connect:
        "Votre compte {{appName}} se connecte depuis le serveur exactement comme sur votre portable.",
    },
  },
  developers: {
    title: "Envie de construire dessus ?",
    body: "Chaque fonctionnalité est un fichier de définition qui devient une page web, une commande CLI, un outil MCP et un outil IA.",
    cta: "Voir comment marche next-vibe",
  },
  help: {
    title: "Bloqué, ou installation pour une équipe ?",
    description:
      "Aide à l'installation, déploiements d'équipe, intégrations sur mesure. Un humain lit chaque message.",
  },
};
