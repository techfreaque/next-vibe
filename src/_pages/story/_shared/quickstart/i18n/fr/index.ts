import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  requirements: {
    label: "Il vous faut",
    os: "macOS, Linux ou Windows",
    git: "git",
    bun: "Bun 1.3+",
  },
  prereqs: {
    step: "Une fois par machine",
    title: "Installer git et Bun",
    platformLabel: "Votre système",
    gitXcode: "git (Xcode Command Line Tools)",
    gitBrew: "ou avec Homebrew",
    gitApt: "git + unzip, Debian / Ubuntu",
    gitDnf: "git + unzip, Fedora",
    gitPacman: "git + unzip, Arch",
    gitWinget: "git",
    bun: "Bun",
    bunWindows: "Bun (PowerShell)",
    check: "Vérifier : 1.3 ou plus récent",
    newTerminal:
      "Ouvrez ensuite un nouveau terminal pour que git et bun soient dans le PATH.",
  },
  terminal: {
    step: "Ensuite",
    title: "Lancer",
    copyAll: "Tout copier",
    copy: "Copier",
    copied: "Copié",
    clone: "Récupérer le code",
    install: "Ouvrez le dossier next-vibe dans le terminal, puis installez",
    dev: "Démarrer. Base de données, migrations et données de départ se font toutes seules.",
    fallback:
      "Le shell ne trouve pas vibe ? Ouvrez un nouveau terminal ou lancez bun run dev.",
    port: "Le port 3000 est déjà utilisé ? Démarrez sur un autre : vibe dev --port=4000, puis ouvrez localhost:4000.",
    postgres:
      "Par défaut : Postgres embarqué (PGlite), sans Docker. Envie d'un vrai Postgres ? Changez DATABASE_URL dans les paramètres ; vibe dev le lance dans Docker au prochain démarrage.",
  },
  browser: {
    step: "Enfin",
    title: "Tout le reste se passe dans le navigateur",
    open: {
      title: "Ouvrez localhost:3000",
      body: "Cliquez sur Se connecter, en haut à droite.",
    },
    admin: {
      title: "Choisissez le compte ADMIN",
      body: "Dans l'encadré Connexion rapide (dev). L'assistant de configuration s'ouvre.",
    },
    account: {
      title: "Fixez votre accès admin",
      body: "Votre e-mail, votre mot de passe. Les clés de sécurité sont déjà générées.",
    },
    provider: {
      title: "Choisissez votre IA",
      body: "Connectez votre compte unbottled.ai ou collez votre propre clé de fournisseur. Terminez. Discutez.",
    },
  },
};
