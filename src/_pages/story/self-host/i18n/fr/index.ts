import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Auto-héberger {{appName}} avec next-vibe",
    category: "Auto-hébergement",
    description:
      "Faites tourner next-vibe sur votre machine. Connectez votre compte {{appName}} pour utiliser ses modèles et ses crédits, ou ajoutez vos propres clés API.",
    imageAlt: "Auto-héberger {{appName}} avec next-vibe",
    keywords: "auto-hébergement, next-vibe, IA privée, Docker, {{appName}}",
  },
  hero: {
    title: "Faites tourner next-vibe chez vous",
    subtitle:
      "Gardez votre historique et vos fichiers sur une machine que vous contrôlez. Utilisez les modèles et les crédits de votre compte unbottled.ai ou passez directement par vos fournisseurs.",
  },
  account: {
    title: "Utilisez votre compte unbottled.ai",
    intro:
      "Vous hébergez l’application et unbottled.ai exécute les modèles. Les requêtes sont déduites de vos crédits unbottled.ai. Pour vous connecter, il vous faut un compte payant, son adresse e-mail et son mot de passe.",
    start: {
      title: "Démarrez votre instance locale",
      body: "Installez et lancez next-vibe, puis connectez-vous avec votre compte admin local. Un abonnement ou un achat de crédits ouvre l’accès aux connexions distantes.",
      signup: "Créer un compte unbottled.ai",
    },
    connect: {
      title: "Connectez votre compte distant",
      body: "Si le chat vous propose de choisir un assistant, fermez cette fenêtre pour l’instant. Dépliez la section du compte dans la barre latérale du chat. Ouvrez le Tableau de bord admin, choisissez Paramètres système, puis ouvrez l’Assistant de configuration. Cliquez sur Suivant jusqu’à Fournisseur IA, où vous trouverez Unbottled AI Cloud. Gardez https://unbottled.ai comme adresse distante, saisissez vos identifiants, choisissez les données à synchroniser et cliquez sur Se connecter.",
    },
    privacy:
      "Désactivez la synchronisation des souvenirs, documents, compétences, favoris et fils de discussion pour les garder en local. L’assistant active les quatre premières options par défaut. Pour traiter une requête, unbottled.ai reçoit votre message, le contexte nécessaire et les pièces jointes que vous ajoutez.",
    verify: {
      title: "Envoyez un message de test",
      body: "Revenez au chat local et actualisez la page. Si l’application vous propose de choisir un assistant, choisissez-en un. Ouvrez une discussion privée et sélectionnez un modèle du fournisseur connecté. La requête passe par votre compte unbottled.ai.",
    },
    cli: {
      title: "Connectez-vous depuis le terminal",
      body: "Laissez tourner l’application installée depuis le dépôt. Ouvrez un deuxième terminal dans le même dossier et remplacez l’adresse d’exemple et le mot de passe par vos identifiants unbottled.ai. Cette commande coupe les cinq catégories de synchronisation. Avec l’assistant dans le navigateur, votre mot de passe reste hors de l’historique et des arguments du terminal.",
      diagnostics:
        "Affichez les connexions et vérifiez que le fournisseur de modèles est actif.",
    },
  },
  standalone: {
    title: "Utilisez vos propres clés en mode autonome",
    intro:
      "Utilisez votre compte chez votre fournisseur IA et réglez vos dépenses directement auprès de lui. Cette configuration fonctionne sans compte unbottled.ai.",
    start: {
      title: "Préparez next-vibe",
      body: "Installez next-vibe et préparez le fichier .env local. Vous pouvez aussi suivre les étapes Docker plus bas.",
    },
    provider: {
      title: "Ajoutez une clé API",
      body: "Pour OpenRouter, ajoutez cette ligne à .env et remplacez la valeur d’exemple par votre clé. Le fichier .env.example indique les réglages des autres fournisseurs.",
      key: "Obtenir une clé OpenRouter",
    },
    verify: {
      title: "Lancez une discussion",
      body: "Démarrez l’application ou relancez-la si elle tourne déjà. Connectez-vous en tant qu’admin local, choisissez un modèle OpenRouter disponible et envoyez un message.",
    },
  },
  install: {
    title: "Installez next-vibe",
    requirements:
      "Il vous faut Git, Node.js 22 ou une version ultérieure, et Bun dans le PATH. Le projet utilise Bun 1.4.4. Avec PGlite, PostgreSQL tourne dans le même processus que l’application. Docker et un serveur de base de données séparé restent facultatifs.",
    checkout: {
      title: "Installez en une commande",
      body: "Utilisez Bash ou Zsh sous Linux ou macOS, ou PowerShell 7 sous Windows. La commande clone le dépôt, installe les versions de dépendances prévues par le projet et configure la commande vibe.",
      windows:
        "Linux est la plateforme officiellement prise en charge. L’installateur prévoit aussi macOS et Windows. Sous Windows, choisissez un chemin sans espaces. Si l’installation native échoue, suivez les étapes Linux dans WSL.",
    },
    config: {
      title: "Configurez la base et le compte admin",
      body: "Ouvrez .env dans le dossier du projet. Si le fichier manque, créez-le à partir de .env.example. Renseignez l’adresse de base de données ci-dessous et choisissez vos valeurs pour VIBE_ADMIN_USER_EMAIL et VIBE_ADMIN_USER_PASSWORD. Réservez ce serveur de développement à une machine ou à un réseau privé.",
      secrets:
        "Exécutez cette commande deux fois. Utilisez une valeur pour JWT_SECRET_KEY et l’autre pour CRON_SECRET. Gardez-les lors des redémarrages.",
    },
    run: {
      title: "Démarrez next-vibe",
      body: "Exécutez la commande depuis le dossier du projet et laissez le terminal ouvert. Ouvrez l’adresse affichée au démarrage, généralement http://localhost:3000. Connectez-vous avec les identifiants admin locaux définis dans .env.",
    },
  },
  docker: {
    title: "Déployez avec Docker Compose",
    intro:
      "La configuration Compose autonome lance l’application, PostgreSQL, Redis et MinIO sur un hôte Linux x86-64. Il vous faut Docker et une version de Compose qui gère !override et !reset. La construction de l’image de l’application peut mobiliser environ 8 Go de RAM.",
    config: {
      title: "Préparez le dépôt et le fichier .env",
      body: "Si vous avez déjà cloné le dépôt, gardez le même dossier. Sinon, exécutez ces commandes.",
      env: "Copiez .env.example vers .env. Définissez vos identifiants admin locaux et les deux secrets comme indiqué plus haut. Appliquez les réglages ci-dessous et générez une troisième valeur hexadécimale pour le mot de passe de la base. En mode autonome, ajoutez vos clés API avant le démarrage. Connectez votre compte distant tant que l’application utilise l’adresse localhost. Pour la rendre publique, renseignez son adresse d’accès dans NEXT_PUBLIC_APP_URL et configurez HTTPS.",
    },
    run: {
      title: "Construisez les images et lancez les conteneurs",
      body: "Compose construit les images de l’application et de PostgreSQL à partir du dépôt. Une fois l’application démarrée, ouvrez son adresse, connectez-vous en tant qu’admin et suivez l’un des deux parcours ci-dessus.",
    },
  },
  update: {
    title: "Mettez votre instance à jour",
    intro:
      "Avant chaque mise à jour, sauvegardez .env, la base de données et les fichiers importés.",
    source: {
      title: "Installation depuis le code source",
      body: "Arrêtez le serveur local avec Ctrl+C. Dans le même dossier, récupérez les dernières modifications, installez les dépendances et relancez l’application. Le démarrage applique les migrations en attente.",
    },
    docker:
      "Dans le même dossier, récupérez les dernières modifications et reconstruisez les images des conteneurs. Gardez le fichier .env et les dossiers de données en place.",
  },
  troubleshoot: {
    title: "Résolvez les problèmes courants",
    path: {
      title: "Le terminal ne trouve pas vibe",
      body: "Ouvrez un nouveau terminal. Si la commande reste introuvable, lancez le script de démarrage directement depuis le dossier du projet.",
    },
    connect: {
      title: "La connexion distante échoue",
      body: "Vérifiez l’adresse e-mail et le mot de passe du compte distant, assurez-vous que le compte a accès aux connexions distantes et laissez l’application locale tourner. Si votre compte distant exige un code de double authentification, suivez le parcours autonome. Un compte client payant peut connecter jusqu’à trois instances. Dans Connexions distantes, donnez un identifiant unique à une machine déjà connectée avant d’en ajouter une autre. Si l’assistant affiche un message générique, consultez le journal du serveur local ou lancez la connexion depuis le terminal.",
    },
    models: {
      title: "La liste des modèles est vide",
      body: "Pour les modèles distants, vérifiez que la connexion est active. Si vous l’avez créée sans l’assistant, vérifiez aussi qu’elle est définie comme fournisseur d’inférence. En mode autonome, vérifiez la clé dans .env et le solde chez votre fournisseur, puis redémarrez l’application.",
    },
    credits: {
      title: "L’application locale signale un manque de crédits",
      body: "Les deux configurations vérifient le solde local. Dans le Tableau de bord admin de votre instance, ouvrez Utilisateurs, sélectionnez votre compte local et cliquez sur Accorder des crédits. Ce crédit reste dans votre instance. Votre fournisseur ou unbottled.ai continue de facturer les requêtes sur le compte connecté.",
    },
    docker: {
      title: "Le conteneur ne démarre pas",
      body: "Cherchez la première erreur dans le journal de l’application. Si la construction de l’image manque de mémoire, allouez plus de RAM à Docker ou lancez l’application depuis le code source.",
    },
    issue: "Signaler un problème d’installation",
  },
};
