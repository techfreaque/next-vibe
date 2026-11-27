import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  common: {
    newChat: "Nouveau chat",
    delete: "Supprimer",
    cancel: "Annuler",
    settings: "Paramètres",
    close: "Fermer",
    toggleSidebar: "Afficher/masquer la barre latérale",
    noChatsFound: "Aucun chat trouvé",
  },
  actions: {
    rename: "Renommer",
    unpin: "Désépingler",
    pin: "Épingler en haut",
    unarchive: "Désarchiver",
    archive: "Archiver",
    manageSharing: "Gérer le partage",
    moveToFolder: "Déplacer vers un dossier",
    unfiled: "Retirer du dossier",
  },
  folderList: {
    managePermissions: "Gérer les autorisations",
    today: "Aujourd'hui",
    lastWeek: "7 derniers jours",
    lastMonth: "30 derniers jours",
    older: "Plus ancien",
  },
  threadList: {
    deleteDialog: {
      title: "Supprimer le fil",
      description:
        "Voulez-vous vraiment supprimer « {{title}} » ? Cette action est irréversible : tous les messages de ce fil seront définitivement supprimés.",
    },
  },
  suggestedPrompts: {
    title: "Comment puis-je vous aider ?",
    privateTitle: "Votre assistant IA privé",
    privateDescription:
      "Conversations enregistrées sur votre compte et synchronisées sur tous vos appareils.",
    sharedTitle: "Travaillez à plusieurs avec l'IA",
    sharedDescription:
      "Créez des conversations et partagez-les avec votre équipe grâce à des liens sécurisés.",
    publicTitle: "Rejoignez le forum IA public",
    publicDescription:
      "Conversations publiques visibles par tous. Partagez vos idées, débattez ouvertement.",
    incognitoTitle: "Chat IA anonyme",
    incognitoDescription:
      "Stocké uniquement dans votre navigateur. Jamais enregistré sur votre compte ni synchronisé.",
    backgroundTitle: "Vos agents IA travaillent",
    backgroundDescription:
      "Les sous-agents et agents autonomes en arrière-plan exécutent leurs tâches ici pendant que vous faites autre chose. Les résultats arrivent automatiquement.",
  },
  config: {
    appName: "unbottled.ai",
  },
  components: {
    sidebar: {
      login: "Se connecter",
      signup: "S'inscrire",
      logout: "Se déconnecter",
      footer: {
        account: "Compte",
        expandAccount: "Afficher la section compte",
        collapseAccount: "Masquer la section compte",
      },
    },
    credits: {
      label: "Crédits",
      credit: "{{count}} crédit",
      credits: "{{count}} crédits",
    },
    navigation: {
      subscription: "Abonnement et crédits",
      partnerDashboard: "Espace partenaire",
      apiKeys: "Clés API",
      referral: "Programme de parrainage",
      settings: "Mon profil et paramètres",
      leadMagnet: "Lead magnet",
      help: "Avis et support",
      about: "À propos",
      websiteBlog: "Articles",
      newsletter: "Newsletter : {{freeCreditsMax}} crédits gratuits par mois",
      admin: "Tableau de bord admin",
    },
    confirmations: {
      deleteMessage: "Voulez-vous vraiment supprimer ce message ?",
    },
    signInGate: {
      title: "Connectez-vous pour ouvrir ce fil",
      description:
        "Cette conversation se trouve dans un dossier privé ou partagé. Connectez-vous avec un compte qui y a accès.",
      signIn: "Se connecter",
      signUp: "Créer un compte gratuit",
      incognito: "Lancer plutôt un chat privé",
    },
  },
};
