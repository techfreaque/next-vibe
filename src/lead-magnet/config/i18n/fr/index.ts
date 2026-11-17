import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  get: {
    tag: "lead-magnet-config",
    title: "Votre liste e-mail",
    titleShort: "Config LM",
    description: "Afficher la configuration actuelle de votre lead magnet",
    response: {
      exists: "Configuration existante",
      config: "Configuration",
    },
    success: {
      title: "Configuration récupérée",
      description: "La configuration de votre lead magnet a été récupérée",
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Les données de la requête sont invalides",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Vous devez être connecté",
      },
      forbidden: {
        title: "Interdit",
        description: "Vous n'avez pas l'autorisation",
      },
      notFound: {
        title: "Introuvable",
        description: "Aucune configuration trouvée",
      },
      conflict: { title: "Conflit", description: "Un conflit est survenu" },
      network: {
        title: "Erreur réseau",
        description: "Une erreur réseau est survenue",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Vous avez des modifications non enregistrées",
      },
      internal: {
        title: "Erreur serveur",
        description: "Une erreur interne est survenue",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inconnue est survenue",
      },
    },
  },
  widget: {
    delete: "Déconnecter",
    confirmDelete: {
      title: "Déconnecter {{provider}} ?",
      description:
        "Les nouveaux abonnés n'arriveront plus dans votre liste. Les contacts déjà capturés restent où ils sont.",
      cancel: "Rester connecté",
      proceed: "Déconnecter",
    },
    back: "Retour",
    loading: "Chargement…",
    pitch: {
      headline: "Transformez vos visiteurs en abonnés",
      body: "Quand quelqu'un consulte la page de votre compétence ou votre profil de créateur, un champ d'abonnement s'affiche. La personne saisit son e-mail, il arrive directement dans votre liste. Pas d'appli en plus, pas d'intermédiaire, pas d'abonnement mensuel pour la capture de base.",
      step1:
        "Quelqu'un visite la page de votre compétence ou votre profil de créateur",
      step2: "La personne remplit le formulaire d'abonnement",
      step3:
        "L'e-mail arrive dans votre liste, sur la plateforme de votre choix",
    },
    noConfig:
      "Connectez une plateforme e-mail pour collecter des abonnés depuis les pages de vos compétences et votre profil de créateur.",
    active: "Actif",
    inactive: "Inactif",
    choosePlatform: "Connecter une plateforme e-mail",
    switchPlatform: "Changer de plateforme",
    selectPlaceholder: "Choisir une plateforme…",
    providers: {
      GETRESPONSE: "GetResponse",
      KLAVIYO: "Klaviyo",
      EMARSYS: "Emarsys",
      ACUMBAMAIL: "Acumbamail",
      CLEVERREACH: "CleverReach",
      CONNECTIF: "Connectif",
      DATANEXT: "DataNext",
      EDRONE: "Edrone",
      EXPERTSENDER: "ExpertSender",
      FRESHMAIL: "FreshMail",
      MAILUP: "MailUp",
      MAPP: "Mapp",
      SAILTHRU: "Sailthru",
      SALESMANAGO: "SALESmanago",
      SHOPIFY: "Shopify",
      SPOTLER: "Spotler",
      YOULEAD: "YouLead",
      ADOBECAMPAIGN: "Adobe Campaign",
      GOOGLE_SHEETS: "Google Sheets",
      PLATFORM_EMAIL: "E-mail (via la plateforme)",
    },
    capturedLeads: "Leads capturés",
  },
  delete: {
    tag: "lead-magnet-config",
    title: "Déconnecter la plateforme e-mail",
    titleShort: "Déconnecter",
    description:
      "Supprimer la configuration de votre lead magnet et arrêter la capture de leads",
    response: {
      deleted: "Déconnecté",
    },
    success: {
      title: "Déconnecté",
      description: "Votre plateforme e-mail a été déconnectée",
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Les données de la requête sont invalides",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Vous devez être connecté",
      },
      forbidden: {
        title: "Interdit",
        description: "Vous n'avez pas l'autorisation",
      },
      notFound: {
        title: "Introuvable",
        description: "Aucune configuration à supprimer",
      },
      conflict: { title: "Conflit", description: "Un conflit est survenu" },
      network: {
        title: "Erreur réseau",
        description: "Une erreur réseau est survenue",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Vous avez des modifications non enregistrées",
      },
      internal: {
        title: "Erreur serveur",
        description: "Une erreur interne est survenue",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inconnue est survenue",
      },
    },
  },
};
