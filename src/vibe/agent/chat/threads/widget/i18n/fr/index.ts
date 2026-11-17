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
      referral: "Programme de parrainage",
      settings: "Mon profil et paramètres",
      leadMagnet: "Lead magnet",
      help: "Avis et support",
      about: "À propos",
      websiteBlog: "Articles",
      newsletter:
        "Newsletter : jusqu'à {{freeCreditsMax}} crédits gratuits par mois",
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
    welcomeTour: {
      authDialog: {
        title: "Débloquez les dossiers Privé et Partagé",
        description:
          "Inscrivez-vous ou connectez-vous pour accéder aux dossiers privés et partagés. Vos chats seront synchronisés sur tous vos appareils.",
        continueTour: "Continuer la visite",
        signUp: "S'inscrire / Se connecter",
      },
      buttons: {
        back: "Retour",
        close: "Fermer",
        last: "Terminer",
        next: "Suivant",
        skip: "Passer",
      },
      welcome: {
        title: "Bienvenue sur {{appName}} !",
        description:
          "Votre plateforme IA respectueuse de la vie privée : {{modelCount}} modèles, un filtrage de contenu que vous contrôlez, et la liberté d'expression comme principe.",
        subtitle: "Faisons un rapide tour pour bien démarrer.",
      },
      aiCompanion: {
        title: "Choisissez votre compagnon IA",
        description:
          "Choisissez parmi {{modelCount}} modèles d'IA : grand public, open source et non censurés.",
        tip: "Cliquez pour ouvrir le sélecteur de modèle et choisir votre compagnon.",
      },
      browseSkills: {
        title: "Découvrez d'autres compétences",
        description:
          "Plus de 40 compétences à explorer : développeurs, chercheurs, rédacteurs, conseillers et bien d'autres. Ajoutez-en une à vos favoris et elle apparaît ici.",
        tip: "Les compétences donnent à votre IA un objectif clair et le bon modèle pour la tâche.",
      },
      meetCompanion: {
        title: "Découvrez votre compagnon",
        description:
          "Votre compagnon existe en plusieurs variantes : brillante pour la réflexion approfondie, futée pour le quotidien, non censurée pour des réponses sans filtre. Cliquez sur l'une d'elles pour lancer une conversation.",
        tip: "Glissez pour réorganiser ou ajoutez d'autres variantes à tout moment.",
      },
      rootFolders: {
        title: "Vos dossiers de chat",
        description:
          "Organisez vos chats dans différents dossiers, chacun avec ses propres règles de confidentialité :",
        private: {
          name: "Privé",
          suffix: "vous seul pouvez le voir",
        },
        incognito: {
          name: "Incognito",
          suffix: "aucun historique enregistré",
        },
        shared: {
          name: "Partagé",
          suffix: "travaillez à plusieurs",
        },
        public: {
          name: "Public",
          suffix: "visible par tous",
        },
        background: {
          name: "Arrière-plan",
          suffix: "des agents IA travaillent pour vous",
        },
      },
      privateFolder: {
        name: "Dossier privé",
        suffix: "",
        description:
          "Vos chats privés ne sont visibles que par vous. Idéal pour les sujets sensibles.",
      },
      incognitoFolder: {
        name: "Dossier incognito",
        suffix: "",
        description:
          "Discutez sans enregistrer l'historique sur le serveur. Les messages restent stockés localement dans votre navigateur jusqu'à ce que vous les effaciez.",
        note: "Aucune donnée n'est stockée sur nos serveurs pendant les sessions incognito (les médias générés sont stockés temporairement pour des raisons techniques).",
      },
      sharedFolder: {
        name: "Dossier partagé",
        suffix: "",
        description:
          "Travaillez avec des personnes précises en leur donnant accès à ce dossier.",
      },
      publicFolder: {
        name: "Dossier public",
        suffix: "",
        description:
          "Partagez vos conversations IA avec le monde entier. Les autres peuvent consulter vos fils et les dupliquer.",
        note: "Tout ce qui se trouve dans Public est visible par tous les utilisateurs et les moteurs de recherche.",
      },
      backgroundFolder: {
        name: "Dossier arrière-plan",
        suffix: "",
        description:
          "Là où vos agents IA travaillent pendant votre absence. Dreamer et Autopilot exécutent des tâches planifiées et déposent leurs résultats ici. Chaque fil reste privé.",
        note: "Vous seul voyez vos fils en arrière-plan. Les agents les créent automatiquement.",
      },
      newChatButton: {
        title: "Lancer un nouveau chat",
        description:
          "Cliquez ici pour démarrer une nouvelle conversation dans n'importe quel dossier.",
      },
      sidebarLogin: {
        title: "Connectez-vous pour en débloquer plus",
        description:
          "Créez un compte gratuit pour accéder aux dossiers Privé et Partagé, synchroniser votre historique sur tous vos appareils et laisser l'IA se souvenir de vous.",
        tip: "L'inscription est gratuite !",
      },
      subscriptionButton: {
        title: "Crédits et abonnement",
        description:
          "Obtenez {{credits}} crédits par mois avec un abonnement à seulement {{price}} par mois. Les comptes gratuits reçoivent {{freeCredits}} crédits par mois, {{freeCreditsMax}} avec la newsletter.",
      },
      chatInput: {
        title: "Écrivez votre message",
        description:
          "Écrivez votre message ici, puis appuyez sur Entrée ou cliquez sur Envoyer pour discuter avec votre compagnon IA.",
        tip: "Maj+Entrée pour aller à la ligne. Vous pouvez aussi joindre des fichiers et des images.",
      },
      voiceInput: {
        title: "Saisie vocale",
        description: "Parlez à votre compagnon IA avec votre micro :",
        options: {
          transcribe: "Transcrire la voix en texte",
          sendAudio: "Envoyer l'audio directement à l'IA",
          pauseResume: "Mettre en pause et reprendre l'enregistrement",
        },
      },
      callMode: {
        title: "Mode appel : l'IA vous répond à voix haute",
        description:
          "Touchez le bouton téléphone et parlez. L'IA écoute, répond à voix haute et reste brève, comme dans une vraie conversation.",
        tip: "Rien à taper. Rien à lire. Parlez, c'est tout.",
      },
      complete: {
        title: "Vous êtes prêt !",
        description:
          "La visite est terminée. Commencez dès maintenant à discuter avec votre compagnon IA.",
        help: "Besoin d'aide ? Cliquez à tout moment sur l'icône point d'interrogation dans la barre latérale.",
      },
      authUnlocked: {
        unlocked: "Débloqué !",
        privateDescription:
          "Votre dossier privé est disponible. Tous les chats qu'il contient ne sont visibles que par vous.",
        privateNote:
          "Les chats privés se synchronisent automatiquement sur tous vos appareils.",
        sharedDescription:
          "Votre dossier partagé est disponible. Invitez d'autres personnes à collaborer sur des conversations IA.",
        sharedNote: "Vous décidez qui a accès à vos dossiers et fils partagés.",
      },
    },
  },
};
