import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Configurer {{appName}}",
    description: "Première configuration de votre instance auto-hébergée.",
  },
  stepOf: "Étape {{current}} sur {{total}}",
  steps: {
    admin: "Accès admin",
    ai: "Connecter l'IA",
    extras: "Extras",
    done: "Terminé",
  },
  back: "Retour",
  continue: "Continuer",
  getKey: "Obtenir une clé",
  secretSaved: "Enregistrée. Laissez vide pour la garder.",
  errors: {
    saveFailed:
      "Échec de l'enregistrement. Consultez le terminal où tourne vibe dev et réessayez.",
  },
  restart: {
    title: "Application de vos réglages",
    body: "Votre instance redémarre pour les charger. La page se recharge toute seule dans quelques secondes.",
    slow: "Plus long que d'habitude ?",
    reload: "Recharger la page",
    manualTitle: "Enregistré",
    manualBody:
      "Redémarrez le serveur pour appliquer les nouveaux réglages. Vous pouvez continuer en attendant.",
    continue: "Continuer",
  },
  welcome: {
    title: "Votre instance tourne.",
    body: "Verrouillez-la avec votre propre accès admin, connectez une IA et c'est parti. Deux minutes suffisent.",
    inProgress:
      "La configuration de cette instance a commencé. Connectez-vous en admin pour la terminer.",
    failed:
      "L'accès admin par défaut n'a pas marché. Si vous l'avez déjà changé, connectez-vous avec le vôtre.",
    start: "Lancer la configuration",
    starting: "Démarrage",
    signIn: "Se connecter en admin",
  },
  readOnly: {
    title: "Réglages en lecture seule ici",
    body: "Cette instance lit ses réglages dans l'environnement de déploiement, cette page ne peut donc rien enregistrer. Renseignez-les là où vous déployez, puis redémarrez.",
  },
  admin: {
    title: "Créez votre accès admin",
    body: "Remplace l'accès par défaut. Il sert à vous connecter ici et dans la CLI vibe.",
    email: "E-mail",
    emailHelp: "Votre identifiant de connexion. Rien n'y est envoyé.",
    emailPlaceholder: "vous@exemple.fr",
    password: "Mot de passe",
    passwordHelp: "8 caractères minimum. Stocké chiffré sur cette machine.",
    confirm: "Répétez le mot de passe",
    save: "Enregistrer et continuer",
    errors: {
      email: "Saisissez une adresse e-mail valide.",
      passwordShort: "8 caractères minimum.",
      passwordDefault:
        "Choisissez votre propre mot de passe, pas celui par défaut.",
      mismatch: "Les mots de passe ne correspondent pas.",
    },
  },
  ai: {
    title: "Connecter l'IA",
    body: "Choisissez d'où viennent les modèles. Une option suffit. Vous pourrez en ajouter quand vous voulez.",
    byo: "Ou utilisez vos propres clés",
    moreProviders: "Autres fournisseurs",
    skip: "Passer pour l'instant",
    unbottled: {
      title: "Votre compte unbottled.ai",
      recommended: "Recommandé",
      body: "Une connexion débloque tous les modèles d'unbottled.ai : grand public, ouverts et sans censure. L'usage est payé avec vos crédits unbottled.ai. Aucune clé de fournisseur à gérer.",
      email: "E-mail unbottled.ai",
      password: "Mot de passe unbottled.ai",
      advanced: "Avancé",
      serverUrl: "URL du serveur",
      serverUrlHelp:
        "À changer seulement pour connecter une autre instance next-vibe.",
      failed: "Connexion refusée. Vérifiez votre e-mail et votre mot de passe.",
      connect: "Connecter le compte",
      connecting: "Connexion",
      connected: "Connecté à {{url}}",
      unhealthy:
        "Connexion enregistrée, mais le serveur ne répond pas pour le moment.",
      disconnect: "Déconnecter",
      noAccount: "Pas encore de compte ?",
      createAccount: "En créer un",
    },
    claude: {
      title: "Claude Code",
      detectedBadge: "Détecté",
      missingBadge: "Non installé",
      detected:
        "Trouvé sur cette machine. Les modèles Claude passent par votre abonnement Claude. Rien à saisir.",
      missing:
        "Installez la CLI claude et connectez-vous pour utiliser votre abonnement Claude. Relancez ensuite vibe dev.",
    },
  },
  fields: {
    openRouter: {
      label: "Clé API OpenRouter",
      help: "Des centaines de modèles avec une seule clé.",
    },
    venice: {
      label: "Clé API Venice AI",
      help: "Modèles privés et sans censure.",
    },
    nanoGpt: {
      label: "Clé API NanoGPT",
      help: "Modèles sans censure et abliterated. Paiement en crypto.",
    },
    openAi: {
      label: "Clé API OpenAI",
      help: "Génération d'images avec les modèles gpt-image.",
    },
    smtpHost: {
      label: "Serveur SMTP",
      help: "Votre serveur mail, par exemple smtp.example.com.",
    },
    smtpPort: { label: "Port", help: "En général 587, ou 465 avec TLS." },
    smtpSecure: {
      label: "Utiliser TLS",
      help: "À activer pour le port 465.",
    },
    smtpUser: {
      label: "Identifiant",
      help: "Souvent votre adresse e-mail complète.",
    },
    smtpPass: {
      label: "Mot de passe",
      help: "Gmail et la plupart des grands fournisseurs demandent ici un mot de passe d'application.",
    },
    smtpFromEmail: {
      label: "Adresse d'expédition",
      help: "Les e-mails partent de cette adresse.",
    },
    smtpFromName: {
      label: "Nom d'expéditeur",
      help: "Affiché comme expéditeur, par exemple le nom de votre instance.",
    },
    stripeSecret: {
      label: "Clé secrète",
      help: "Commence par sk_. Les clés de test marchent aussi.",
    },
    stripePublishable: {
      label: "Clé publique",
      help: "Commence par pk_.",
    },
    stripeWebhook: {
      label: "Secret de signature du webhook",
      help: "Commence par whsec_. Confirme que les paiements arrivent bien sur votre instance.",
    },
    storageType: {
      label: "Où stocker les fichiers",
      help: "Fichiers envoyés, images et audio de vos chats.",
      optionFilesystem: "Cette machine",
      optionS3: "Stockage compatible S3",
    },
    s3Endpoint: {
      label: "URL du endpoint",
      help: "Le endpoint S3 de votre fournisseur, par exemple https://s3.amazonaws.com.",
    },
    s3Region: {
      label: "Région",
      help: "Par exemple us-east-1. Certains fournisseurs acceptent auto.",
    },
    s3Bucket: { label: "Bucket", help: "Le bucket doit déjà exister." },
    s3AccessKey: {
      label: "Access key ID",
      help: "Sur la page des clés d'accès de votre fournisseur de stockage.",
    },
    s3SecretKey: {
      label: "Secret access key",
      help: "Affichée une seule fois, à la création de la clé.",
    },
    s3PublicUrl: {
      label: "URL publique",
      help: "Facultatif. Un CDN ou l'adresse publique du bucket pour les liens de fichiers.",
    },
  },
  extras: {
    title: "Extras facultatifs",
    body: "Rien de tout ça n'est nécessaire pour discuter. Passez et revenez quand vous en aurez besoin.",
    configured: "Configuré",
    finish: "Terminer la configuration",
    skipFinish: "Passer et terminer",
    errors: {
      s3Incomplete:
        "Le stockage S3 a besoin du endpoint, de la région, du bucket et des deux clés.",
    },
    sections: {
      email: {
        title: "E-mail",
        body: "Confirmations d'inscription et réinitialisations de mot de passe via votre serveur SMTP.",
      },
      payments: {
        title: "Paiements",
        body: "Vendez des crédits et des abonnements avec Stripe.",
      },
      storage: {
        title: "Stockage des fichiers",
        body: "Les fichiers des chats restent sur cette machine, sauf si vous choisissez S3.",
      },
    },
  },
  done: {
    title: "C'est prêt.",
    body: "Votre instance est configurée et elle vous appartient.",
    admin: "Accès admin : {{email}}",
    aiUnbottled: "IA : votre compte unbottled.ai",
    aiKeys: "IA : vos propres clés de fournisseurs",
    aiClaude: "IA : Claude Code sur cette machine",
    aiNone:
      "Aucune IA connectée pour l'instant. Il faut un fournisseur pour discuter. Ajoutez-le quand vous voulez dans les réglages admin.",
    start: "Commencer à discuter",
    later: "Tout ceci se modifie plus tard dans les réglages admin.",
  },
};
