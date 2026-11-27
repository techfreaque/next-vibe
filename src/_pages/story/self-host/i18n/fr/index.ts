import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title:
      "Auto-héberger {{appName}} : IA, comptabilité et CRM sur votre serveur",
    description:
      "{{appName}} sur votre propre machine. git clone, bun i, vibe dev. Les {{modelCount}} modèles d'IA via votre compte {{appName}}, plus comptabilité, CRM et newsletters. Vos données restent dans votre base.",
    category: "Auto-hébergement",
    imageAlt: "Auto-héberger {{appName}} sur votre machine",
    keywords:
      "auto-hébergement, self-host, chat IA auto-hébergé, next-vibe, {{appName}}, open source, IA privée, IA locale, IA non censurée, comptabilité auto-hébergée, ERP open source, CRM auto-hébergé",
  },
  hero: {
    badge: "Gratuit et open source",
    title: "Votre serveur.",
    titleHighlight: "Votre IA. Vos comptes.",
    subtitle:
      "Lancez {{appName}} sur votre machine. Connectez votre compte {{appName}} et les {{modelCount}} modèles fonctionnent. Aucune clé de fournisseur. Comptabilité, CRM, newsletters et agents sont dans la même app.",
    ctaStart: "Lancer l'installation",
    ctaGithub: "Voir sur GitHub",
  },
  diagram: {
    link: "Une seule connexion",
    instance: {
      label: "Tourne chez vous",
      title: "Votre instance",
      points: {
        chats: "Chats, comptabilité et clients dans votre propre Postgres",
        files: "Fichiers envoyés et médias générés sur votre disque",
        tools: "Thea, les tâches cron et tous les outils IA",
        admin: "Votre admin, vos règles.",
      },
    },
    account: {
      label: "Tourne sur {{appName}}",
      title: "Votre compte",
      points: {
        models: "{{modelCount}} modèles, facturés sur vos crédits",
        keys: "Aucune clé de fournisseur",
      },
    },
  },
  suite: {
    eyebrow: "Ce que vous installez",
    title: "Bien plus qu'une app de chat.",
    intro:
      "Un code. Une base de données. Un admin. Chaque module est livré dans la même installation.",
    link: "Voir toute la suite de gestion",
    cards: {
      ai: {
        title: "Chat IA",
        body: "{{modelCount}} modèles, mémoire, recherche web et chats incognito. Plus image, vidéo, musique et voix.",
      },
      agents: {
        title: "Un agent qui travaille",
        body: "Thea, l'agent intégré, exécute des tâches planifiées et utilise SSH, un navigateur et votre messagerie comme outils.",
      },
      books: {
        title: "Comptabilité et ERP",
        body: "Grand livre en partie double, factures clients et fournisseurs, achats, stock et caisse.",
      },
      customers: {
        title: "Clients",
        body: "CRM avec import CSV, newsletters en double opt-in, une boîte unique pour e-mail, SMS, Telegram et WhatsApp.",
      },
      payments: {
        title: "Paiements",
        body: "Paiement par Stripe et crypto pour des offres d'abonnement, avec webhooks et remboursements.",
      },
      build: {
        title: "Vos propres fonctions",
        body: "Un fichier de définition devient une page web, une commande CLI, un outil MCP et un outil IA.",
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
          body: "Saisissez l'e-mail et le mot de passe de votre compte {{appName}}. C'est tout.",
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
          title: "L'historique reste chez vous",
          body: "Les fils sont stockés dans votre base. Seuls les appels aux modèles passent par {{appName}}. La synchro reste coupée tant que vous ne l'activez pas.",
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
      api: {
        title: "Votre API, en prime",
        body: "Chaque module est une commande CLI et un outil MCP sur votre instance. Scriptez-le ou branchez-y votre agent.",
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
  server: {
    eyebrow: "Mise en production",
    title: "Passez-le sur un serveur.",
    intro:
      "Même clonage, même installation. Puis un build de production à la place du serveur de dev.",
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
      db: "Postgres embarqué (PGlite) par défaut. En production, pointez DATABASE_URL vers votre propre Postgres.",
    },
  },
  developers: {
    title: "Envie de construire dessus ?",
    body: "Chaque module, c'est du TypeScript normal dans le dépôt. Forkez-le, étendez-le ou écrivez le vôtre.",
    cta: "Voir comment marche next-vibe",
  },
  help: {
    title: "Bloqué, ou installation pour une équipe ?",
    description:
      "Aide à l'installation, déploiements d'équipe, intégrations sur mesure. Un humain lit chaque message.",
  },
};
