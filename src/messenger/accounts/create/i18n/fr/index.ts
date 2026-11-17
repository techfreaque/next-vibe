import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    messaging: "Messagerie",
  },
  countries: {
    global: "International",
    de: "Allemagne",
    pl: "Pologne",
    fr: "France",
    us: "États-Unis",
  },
  languages: {
    en: "Anglais",
    de: "Allemand",
    pl: "Polonais",
    fr: "Français",
  },
  title: "Créer un compte de messagerie",
  titleShort: "Nouveau compte",
  description: "Créer un nouveau compte de messagerie",

  enums: {
    campaignType: {
      leadCampaign: "Campagne prospects",
      newsletter: "Newsletter",
      signupNurture: "Suivi des inscrits",
      retention: "Fidélisation",
      winback: "Reconquête",
      transactional: "Transactionnel",
      notification: "Notification",
      system: "Système",
    },
    emailJourneyVariant: {
      uncensoredConvert: "Conversion non censurée",
      sideHustle: "Revenu complémentaire",
      quietRecommendation: "Recommandation discrète",
      signupNurture: "Suivi des inscrits",
      retention: "Fidélisation",
      winback: "Reconquête",
      newsletterMay2026: "Newsletter mai 2026",
      newsletterNov2026: "Newsletter novembre 2026",
    },
    emailCampaignStage: {
      notStarted: "Non démarrée",
      initial: "Premier envoi",
      followup1: "Relance 1",
      followup2: "Relance 2",
      followup3: "Relance 3",
      nurture: "Suivi",
      reactivation: "Réactivation",
    },
    channel: {
      email: "E-mail",
      sms: "SMS",
      whatsapp: "WhatsApp",
      telegram: "Telegram",
    },
    provider: {
      smtp: "SMTP",
      resend: "Resend",
      ses: "Amazon SES",
      mailgun: "Mailgun",
      sendgrid: "SendGrid",
      mailjet: "Mailjet",
      postmark: "Postmark",
      twilio: "Twilio",
      awsSns: "AWS SNS",
      messagebird: "MessageBird",
      http: "HTTP",
      whatsappBusiness: "WhatsApp Business",
      telegramBot: "Bot Telegram",
    },
    status: {
      active: "Actif",
      inactive: "Inactif",
      error: "Erreur",
      testing: "En test",
    },
    securityType: {
      none: "Aucune",
      tls: "TLS",
      ssl: "SSL",
      starttls: "STARTTLS",
    },
    imapAuthMethod: {
      plain: "Texte brut (Plain)",
      oauth2: "OAuth2",
      xoauth2: "XOAUTH2",
    },
  },

  sections: {
    identity: "Identité du compte",
    identitySubtitle: "Nom et réglages de base de ce compte",
    smtp: "Envoi SMTP",
    smtpSubtitle: "Paramètres du serveur d'envoi des e-mails",
    api: "Identifiants API",
    apiSubtitle: "Clé API et jeton d'accès du fournisseur",
    apiSubtitleSms: "Clé API et ID d'expéditeur du fournisseur",
    apiSubtitleWhatsapp:
      "Jeton de l'API WhatsApp Business et ID du numéro de téléphone",
    apiSubtitleTelegram:
      "Saisissez le jeton de votre bot Telegram obtenu via @BotFather",
    apiTitleSms: "Identifiants du fournisseur SMS",
    apiTitleWhatsapp: "Identifiants WhatsApp Business",
    apiTitleTelegram: "Jeton du bot",
    imap: "Réception IMAP",
    imapSubtitle:
      "À configurer pour recevoir et synchroniser les e-mails entrants (facultatif)",
    routing: "Routage des e-mails",
    routingSubtitle:
      "Choisissez quelles campagnes et quels parcours utilisent ce compte",
    toggleHide: "Masquer",
    toggleShow: "Afficher",
  },

  fields: {
    name: {
      label: "Nom du compte",
      description: "Nom unique pour ce compte",
      placeholder: "ex. SMTP principal, SMS Twilio",
    },
    description: {
      label: "Description",
      description: "Description facultative",
      placeholder: "Décrivez le rôle de ce compte",
    },
    channel: {
      label: "Canal",
      description: "Canal de communication",
    },
    provider: {
      label: "Fournisseur",
      description: "Fournisseur de service pour ce canal",
    },
    status: {
      label: "Statut",
      description: "Statut du compte",
    },
    priority: {
      label: "Priorité",
      description: "Nombre plus élevé = priorité plus haute",
    },
    isDefault: {
      label: "Compte par défaut",
      description: "Utiliser par défaut pour ce canal",
    },
    // SMTP outbound
    smtpHost: {
      label: "Hôte SMTP",
      description: "Nom d'hôte du serveur SMTP",
      placeholder: "smtp.example.com",
    },
    smtpPort: {
      label: "Port SMTP",
      description: "Port du serveur SMTP",
      placeholder: "587",
    },
    smtpSecurityType: {
      label: "Sécurité",
      description: "Type de sécurité de la connexion",
    },
    smtpUsername: {
      label: "Nom d'utilisateur SMTP",
      description: "Nom d'utilisateur pour l'authentification SMTP",
      placeholder: "user@example.com",
    },
    smtpPassword: {
      label: "Mot de passe SMTP",
      description: "Mot de passe pour l'authentification SMTP",
      placeholder: "••••••••",
    },
    smtpFromEmail: {
      label: "E-mail d'expédition",
      description: "Adresse e-mail de l'expéditeur",
      placeholder: "noreply@example.com",
    },
    smtpFromName: {
      label: "Nom d'expéditeur",
      description: "Nom de l'expéditeur affiché dans les clients de messagerie",
      placeholder: "Unbottled",
    },
    smtpConnectionTimeout: {
      label: "Délai de connexion",
      description: "Délai d'expiration de la connexion en millisecondes",
    },
    smtpMaxConnections: {
      label: "Connexions max",
      description: "Nombre maximal de connexions simultanées",
    },
    smtpRateLimitPerHour: {
      label: "Limite d'envoi",
      description: "Nombre maximal d'e-mails par heure",
    },
    // API credentials
    apiKey: {
      label: "Clé API",
      description: "Clé API de ce fournisseur",
      placeholder: "re_xxxxxxxxxxxx",
    },
    apiToken: {
      label: "Jeton API",
      description: "Jeton API principal / SID du compte",
      placeholder: "ACxxxxxxxxxxxx",
    },
    apiSecret: {
      label: "Secret API",
      description: "Identifiant secondaire / jeton d'authentification",
      placeholder: "••••••••",
    },
    fromId: {
      label: "ID d'expéditeur",
      description: "Numéro de téléphone, ID d'expéditeur ou jeton de bot",
      placeholder: "+1234567890",
    },
    webhookUrl: {
      label: "URL du webhook",
      description: "URL du webhook des messages entrants",
      placeholder: "https://example.com/webhook",
    },
    // IMAP inbound
    imapHost: {
      label: "Hôte IMAP",
      description: "Nom d'hôte du serveur IMAP",
      placeholder: "imap.example.com",
    },
    imapPort: {
      label: "Port IMAP",
      description: "Port du serveur IMAP",
      placeholder: "993",
    },
    imapSecure: {
      label: "TLS IMAP",
      description: "Utiliser TLS/SSL pour IMAP",
    },
    imapUsername: {
      label: "Nom d'utilisateur IMAP",
      description: "Nom d'utilisateur pour l'authentification IMAP",
      placeholder: "user@example.com",
    },
    imapPassword: {
      label: "Mot de passe IMAP",
      description: "Mot de passe pour l'authentification IMAP",
      placeholder: "••••••••",
    },
    imapAuthMethod: {
      label: "Méthode d'authentification IMAP",
      description: "Méthode d'authentification IMAP",
    },
    imapSyncEnabled: {
      label: "Activer la synchro",
      description: "Activer la synchronisation IMAP automatique",
    },
    imapSyncInterval: {
      label: "Intervalle de synchro",
      description: "Intervalle de synchronisation en secondes",
    },
    imapMaxMessages: {
      label: "Messages max",
      description: "Nombre maximal de messages synchronisés par dossier",
    },
    // Email routing
    campaignTypes: {
      label: "Types de campagne",
      description: "Types de campagne gérés par ce compte",
      placeholder: "Sélectionner des types de campagne",
    },
    emailJourneyVariants: {
      label: "Variantes de parcours",
      description: "Variantes de parcours e-mail",
      placeholder: "Sélectionner des variantes de parcours",
    },
    emailCampaignStages: {
      label: "Étapes de campagne",
      description: "Étapes de campagne",
      placeholder: "Sélectionner des étapes",
    },
    countries: {
      label: "Pays",
      description: "Pays ciblés",
      placeholder: "Sélectionner des pays",
    },
    languages: {
      label: "Langues",
      description: "Langues ciblées",
      placeholder: "Sélectionner des langues",
    },
    isExactMatch: {
      label: "Correspondance exacte",
      description: "Exiger une correspondance exacte du pays et de la langue",
    },
    weight: {
      label: "Poids",
      description: "Poids pour la répartition de charge",
    },
    isFailover: {
      label: "Secours",
      description: "Utiliser comme compte de secours",
    },
    isSystem: {
      label: "Boîte de la plateforme",
      description:
        "Boîte opérationnelle de la plateforme. Identifiants issus de l'env ; exclue des campagnes.",
    },
    failoverPriority: {
      label: "Priorité de secours",
      description: "Ordre de priorité en cas de bascule",
    },
  },

  response: {
    account: {
      title: "Compte créé",
      description: "Détails du nouveau compte de messagerie",
      id: "ID",
      name: "Nom",
      channel: "Canal",
      provider: "Fournisseur",
      status: "Statut",
      smtpFromEmail: "E-mail d'expédition",
      fromId: "ID d'expéditeur",
      createdAt: "Créé le",
      updatedAt: "Mis à jour le",
    },
  },

  errors: {
    validation: {
      title: "Erreur de validation",
      description: "Données du compte invalides",
    },
    unauthorized: {
      title: "Non autorisé",
      description: "Accès administrateur requis",
    },
    forbidden: {
      title: "Accès refusé",
      description: "Vous n'avez pas accès à cette ressource",
    },
    notFound: {
      title: "Introuvable",
      description: "Ressource introuvable",
    },
    conflict: {
      title: "Nom déjà utilisé",
      description: "Un compte portant ce nom existe déjà",
    },
    server: {
      title: "Erreur serveur",
      description: "Impossible de créer le compte",
      detail: "Échec de la création du compte : {{error}}",
    },
    networkError: {
      title: "Erreur réseau",
      description: "La communication réseau a échoué",
    },
    unsavedChanges: {
      title: "Modifications non enregistrées",
      description: "Vous avez des modifications non enregistrées",
    },
    unknown: {
      title: "Erreur inconnue",
      description: "Une erreur inattendue s'est produite",
    },
  },

  success: {
    title: "Compte créé",
    description: "Compte de messagerie créé",
  },
};
