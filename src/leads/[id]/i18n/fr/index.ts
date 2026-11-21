import { regionalCountryNames } from "next-vibe/core/i18n/core/regions";

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  traffic: {
    burstNetwork: "Réseau en pic : {{count}} leads en 30 jours",
    sharedAgent: "User agent partagé : {{count}} leads",
    title: "Trafic et réseau",
    subtitle:
      "Type d'agent, premier contact et nombre de leads partageant ce réseau ou cet agent.",
    agent: "Agent",
    firstTouch: "Premier contact",
    referrer: "Référent",
    landingPath: "Page d'entrée",
    refCode: "Code de parrainage",
    freeCredits: "Crédits gratuits consommés",
    network: "Réseau",
    sameAgent: "Même user agent",
    agentLeadsIn30d: "{{count}} leads en 30 jours",
    openLeads: "Ouvrir les leads",
  },
  category: "Leads",
  tags: {
    leads: "Leads",
    management: "Gestion",
  },

  get: {
    title: "Détails du lead",
    titleShort: "Détails du lead",
    description: "Récupérer les informations détaillées d'un lead",
    backButton: {
      label: "Retour aux leads",
    },
    editButton: {
      label: "Modifier le lead",
    },
    deleteButton: {
      label: "Supprimer le lead",
    },
    id: {
      label: "ID du lead",
      description: "Identifiant unique du lead",
    },
    form: {
      title: "Requête de détails du lead",
      description:
        "Paramètres de requête pour récupérer les informations du lead",
    },
    response: {
      title: "Informations du lead",
      description: "Détails complets et historique du lead",
      basicInfo: {
        title: "Informations de base",
        description: "Identification et statut du lead",
      },
      id: {
        content: "ID du lead",
      },
      email: {
        content: "Adresse e-mail",
      },
      businessName: {
        content: "Entreprise",
      },
      contactName: {
        content: "Nom du contact",
      },
      status: {
        content: "Statut du lead",
      },
      contactDetails: {
        title: "Coordonnées",
        description: "Coordonnées et préférences",
      },
      phone: {
        content: "Numéro de téléphone",
      },
      website: {
        content: "URL du site web",
      },
      country: {
        content: "Pays",
      },
      language: {
        content: "Langue",
      },
      campaignTracking: {
        title: "Suivi de campagne",
        description: "Informations de campagne e-mail et de suivi",
      },
      source: {
        content: "Source du lead",
      },
      currentCampaignStage: {
        content: "Étape de campagne actuelle",
      },
      emailJourneyVariant: {
        content: "Variante du parcours e-mail",
      },
      emailsSent: {
        content: "E-mails envoyés",
      },
      lastEmailSentAt: {
        content: "Dernier e-mail envoyé",
      },
      engagement: {
        title: "Indicateurs d'engagement",
        description: "Données d'engagement et d'interaction e-mail",
      },
      emailsOpened: {
        content: "E-mails ouverts",
      },
      emailsClicked: {
        content: "E-mails cliqués",
      },
      lastEngagementAt: {
        content: "Dernier engagement",
      },
      unsubscribedAt: {
        content: "Désabonné le",
      },
      conversion: {
        title: "Suivi de conversion",
        description: "Suivi de la conversion et des étapes clés du lead",
      },
      convertedUserId: {
        content: "ID de l'utilisateur converti",
      },
      convertedAt: {
        content: "Converti le",
      },
      signedUpAt: {
        content: "Inscrit le",
      },
      subscriptionConfirmedAt: {
        content: "Abonnement confirmé le",
      },
      metadata: {
        title: "Informations complémentaires",
        description: "Notes et métadonnées",
        content: "Métadonnées",
      },
      notes: {
        content: "Notes",
      },
      createdAt: {
        content: "Créé le",
      },
      updatedAt: {
        content: "Mis à jour le",
      },
      identity: {
        title: "Appareil et identité",
        description: "Identité de suivi et informations sur l'appareil",
      },
      ipAddress: {
        content: "Adresse IP",
      },
      userAgent: {
        content: "User agent",
      },
      deviceType: {
        content: "Type d'appareil",
      },
      browser: {
        content: "Navigateur",
      },
      os: {
        content: "Système d'exploitation",
      },
      referralCode: {
        content: "Code de parrainage",
      },
      lifecycle: {
        title: "Cycle de vie",
        description: "Horodatages supplémentaires du cycle de vie",
      },
      bouncedAt: {
        content: "Rejeté le",
      },
      invalidAt: {
        content: "Invalidé le",
      },
      campaignStartedAt: {
        content: "Campagne démarrée le",
      },
      linkedLeads: {
        title: "Leads liés",
        description: "Leads identifiés comme la même personne",
        linkedLeadId: {
          content: "ID du lead lié",
        },
        linkReason: {
          content: "Motif du lien",
        },
        linkedAt: {
          content: "Lié le",
        },
        email: {
          content: "E-mail",
        },
        businessName: {
          content: "Entreprise",
        },
        status: {
          content: "Statut",
        },
        ipAddress: {
          content: "Adresse IP",
        },
        userAgent: {
          content: "User agent",
        },
        createdAt: {
          content: "Créé le",
        },
      },
      linkedUsers: {
        title: "Comptes utilisateur liés",
        description: "Comptes utilisateur associés à ce lead",
        userId: {
          content: "ID utilisateur",
        },
        linkReason: {
          content: "Motif du lien",
        },
        linkedAt: {
          content: "Lié le",
        },
        email: {
          content: "E-mail",
        },
        publicName: {
          content: "Nom affiché",
        },
      },
      referralHistory: {
        title: "Historique de parrainage",
        description:
          "Codes de parrainage cliqués par ce lead avant son inscription",
        code: {
          content: "Code de parrainage",
        },
        ownerUserId: {
          content: "Propriétaire du code",
        },
        clickedAt: {
          content: "Cliqué le",
        },
      },
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "L'ID de lead fourni est invalide",
      },
      unauthorized: {
        title: "Non autorisé",
        description:
          "Authentification requise pour consulter les détails du lead",
      },
      forbidden: {
        title: "Accès refusé",
        description: "Vous n'avez pas l'autorisation de consulter ce lead",
      },
      notFound: {
        title: "Lead introuvable",
        description: "Aucun lead trouvé avec cet ID",
      },
      server: {
        title: "Erreur serveur",
        description:
          "Une erreur s'est produite lors de la récupération du lead",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inattendue s'est produite",
      },
      network: {
        title: "Erreur réseau",
        description: "Impossible de joindre le serveur",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Vous avez des modifications non enregistrées",
      },
      conflict: {
        title: "Conflit de données",
        description: "Les données du lead ont été modifiées",
      },
    },
    success: {
      title: "Succès",
      description: "Détails du lead récupérés",
    },
  },
  patch: {
    title: "Mettre à jour le lead",
    titleShort: "Modifier le lead",
    description: "Mettre à jour les informations et le statut du lead",
    backButton: {
      label: "Retour au lead",
    },
    deleteButton: {
      label: "Supprimer le lead",
    },
    submitButton: {
      label: "Mettre à jour le lead",
      loadingText: "Mise à jour du lead...",
    },
    id: {
      label: "ID du lead",
      description: "Identifiant unique du lead à mettre à jour",
    },
    form: {
      title: "Mettre à jour le lead",
      description: "Modifier les informations du lead",
    },
    updates: {
      title: "Modifications du lead",
      description: "Champs à mettre à jour",
    },
    basicInfo: {
      title: "Informations de base",
      description: "Mettre à jour les informations principales du lead",
    },
    email: {
      label: "Adresse e-mail",
      description: "Adresse e-mail du lead",
      placeholder: "email@example.com",
    },
    businessName: {
      label: "Entreprise",
      description: "Nom de l'entreprise",
      placeholder: "Acme Corporation",
    },
    contactName: {
      label: "Nom du contact",
      description: "Personne de contact principale",
      placeholder: "Jean Dupont",
    },
    status: {
      label: "Statut du lead",
      description: "Statut actuel du lead",
      placeholder: "Choisir un statut",
    },
    contactDetails: {
      title: "Coordonnées",
      description: "Mettre à jour les coordonnées",
    },
    phone: {
      label: "Numéro de téléphone",
      description: "Numéro de téléphone du contact",
      placeholder: "+33612345678",
    },
    website: {
      label: "Site web",
      description: "URL du site de l'entreprise",
      placeholder: "https://example.com",
    },
    country: {
      label: "Pays",
      description: "Pays de l'entreprise",
      placeholder: "Choisir un pays",
    },
    language: {
      label: "Langue",
      description: "Langue préférée",
      placeholder: "Choisir une langue",
    },
    campaignManagement: {
      title: "Gestion de campagne",
      description: "Gérer les paramètres de campagne",
    },
    source: {
      label: "Source du lead",
      description: "Origine du lead",
      placeholder: "Choisir une source",
    },
    currentCampaignStage: {
      label: "Étape de campagne",
      description: "Étape actuelle de la campagne e-mail",
      placeholder: "Choisir une étape",
    },
    additionalDetails: {
      title: "Détails complémentaires",
      description: "Notes et métadonnées",
    },
    notes: {
      label: "Notes",
      description: "Notes internes sur le lead",
      placeholder: "Ajoutez vos notes ici",
    },
    metadata: {
      label: "Métadonnées",
      description: "Métadonnées supplémentaires (JSON)",
      placeholder: '{"key": "value"}',
    },
    convertedUserId: {
      label: "ID de l'utilisateur converti",
      description: "ID du compte utilisateur converti",
      placeholder: "ID utilisateur",
    },
    subscriptionConfirmedAt: {
      label: "Abonnement confirmé le",
      description: "Date de confirmation de l'abonnement",
      placeholder: "Choisir une date",
    },
    response: {
      title: "Lead mis à jour",
      description: "Informations du lead mises à jour",
      basicInfo: {
        title: "Informations de base",
        description: "Informations principales mises à jour",
      },
      id: {
        content: "ID du lead",
      },
      email: {
        content: "Adresse e-mail",
      },
      businessName: {
        content: "Entreprise",
      },
      contactName: {
        content: "Nom du contact",
      },
      status: {
        content: "Statut du lead",
      },
      contactDetails: {
        title: "Coordonnées",
        description: "Coordonnées mises à jour",
      },
      phone: {
        content: "Numéro de téléphone",
      },
      website: {
        content: "URL du site web",
      },
      country: {
        content: "Pays",
      },
      language: {
        content: "Langue",
      },
      campaignTracking: {
        title: "Suivi de campagne",
        description: "Informations de campagne mises à jour",
      },
      source: {
        content: "Source du lead",
      },
      currentCampaignStage: {
        content: "Étape de campagne actuelle",
      },
      emailJourneyVariant: {
        content: "Variante du parcours e-mail",
      },
      emailsSent: {
        content: "E-mails envoyés",
      },
      lastEmailSentAt: {
        content: "Dernier e-mail envoyé",
      },
      engagement: {
        title: "Indicateurs d'engagement",
        description: "Données d'engagement e-mail",
      },
      emailsOpened: {
        content: "E-mails ouverts",
      },
      emailsClicked: {
        content: "E-mails cliqués",
      },
      lastEngagementAt: {
        content: "Dernier engagement",
      },
      unsubscribedAt: {
        content: "Désabonné le",
      },
      conversion: {
        title: "Suivi de conversion",
        description: "Suivi des étapes de conversion",
      },
      convertedUserId: {
        content: "ID de l'utilisateur converti",
      },
      convertedAt: {
        content: "Converti le",
      },
      signedUpAt: {
        content: "Inscrit le",
      },
      subscriptionConfirmedAt: {
        content: "Abonnement confirmé le",
      },
      metadata: {
        title: "Informations complémentaires",
        description: "Notes et métadonnées",
        content: "Métadonnées",
      },
      notes: {
        content: "Notes",
      },
      createdAt: {
        content: "Créé le",
      },
      updatedAt: {
        content: "Mis à jour le",
      },
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Les données fournies sont invalides",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Authentification requise pour mettre à jour des leads",
      },
      forbidden: {
        title: "Accès refusé",
        description: "Vous n'avez pas l'autorisation de modifier ce lead",
      },
      notFound: {
        title: "Lead introuvable",
        description: "Aucun lead trouvé avec cet ID",
      },
      conflict: {
        title: "Conflit de mise à jour",
        description: "Le lead a été modifié par un autre utilisateur",
      },
      server: {
        title: "Erreur serveur",
        description: "Une erreur s'est produite lors de la mise à jour du lead",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inattendue s'est produite",
      },
      network: {
        title: "Erreur réseau",
        description: "Impossible de joindre le serveur",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Vous avez des modifications non enregistrées",
      },
    },
    success: {
      title: "Succès",
      description: "Lead mis à jour",
    },
  },
  post: {
    title: "[id]",
    description: "Endpoint [id]",
    form: {
      title: "Configuration [id]",
      description: "Configurer les paramètres [id]",
    },
    response: {
      title: "Réponse",
      description: "Données de réponse [id]",
    },
    errors: {
      unauthorized: {
        title: "Non autorisé",
        description: "Authentification requise",
      },
      validation: {
        title: "Erreur de validation",
        description: "Paramètres de requête invalides",
      },
      server: {
        title: "Erreur serveur",
        description: "Erreur interne du serveur",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inconnue s'est produite",
      },
      network: {
        title: "Erreur réseau",
        description: "Une erreur réseau s'est produite",
      },
      forbidden: {
        title: "Interdit",
        description: "Accès interdit",
      },
      notFound: {
        title: "Introuvable",
        description: "Ressource introuvable",
      },
      conflict: {
        title: "Conflit",
        description: "Conflit de données",
      },
    },
    success: {
      title: "Succès",
      description: "Opération réussie",
    },
  },
  enums: {
    leadStatus: {
      new: "Nouveau",
      pending: "En attente",
      campaignRunning: "Campagne en cours",
      websiteUser: "Utilisateur du site",
      newsletterSubscriber: "Abonné à la newsletter",
      inContact: "En contact",
      signedUp: "Inscrit",
      subscriptionConfirmed: "Abonnement confirmé",
      unsubscribed: "Désabonné",
      bounced: "Rejeté (bounce)",
      invalid: "Invalide",
    },
    leadSource: {
      website: "Site web",
      referral: "Parrainage",
      socialMedia: "Réseaux sociaux",
      emailCampaign: "Campagne e-mail",
      csvImport: "Import CSV",
      api: "API",
      manual: "Manuel",
      other: "Autre",
    },
    emailCampaignStage: {
      notStarted: "Non démarrée",
      initial: "Premier contact",
      followup1: "Relance 1",
      followup2: "Relance 2",
      followup3: "Relance 3",
      nurture: "Nurturing",
      reactivation: "Réactivation",
    },
    emailJourneyVariant: {
      uncensoredConvert: "Converti au non censuré",
      sideHustle: "Revenu complémentaire",
      quietRecommendation: "Recommandation discrète",
    },
  },
  journey: {
    reviewUnavailable:
      "Impossible de charger les portefeuilles, les consentements et l’historique du contact.",
    title: "Parcours du lead",
    subtitle:
      "Du plus ancien au plus récent · activité récente et jalons enregistrés",
    unavailable: "Impossible de charger les données du parcours",
    campaign: "File des campagnes",
    emailScheduled: "Prochain e-mail planifié",
    campaignRunning: "Campagne en cours",
    noQueue: "Aucun e-mail planifié",
    openQueue: "Ouvrir la file du lead",
    openAccount: "Ouvrir le compte",
    openLead: "Ouvrir le lead",
    attributionOnly:
      "Les liens d’attribution donnent des indices. Plusieurs personnes peuvent partager une adresse IP ou un lien suivi.",
    recordedAccountLink: "Lien de compte enregistré",
    recordedConversion: "Compte enregistré lors de la conversion",
    attributedAccount: "Compte associé à l’attribution d’acquisition",
    previewIpMatches: "Prévisualiser les correspondances IP des leads",
    wallets: "Portefeuilles",
    noWallets: "Aucun portefeuille trouvé",
    thisLeadWallet: "Portefeuille de ce lead",
    accountWallet: "Portefeuille du compte",
    relatedLeadWallet: "Portefeuille d’un lead lié",
    newsletterConsent: "Consentements à la newsletter",
    noNewsletter: "Aucune inscription liée à la newsletter",
    consentRecorded: "Consentement enregistré",
    consentAbsent: "Aucun consentement enregistré",
    confirmedOn: "Confirmé le {{date}}",
    confirmationMissing: "Date de confirmation manquante",
    guestConsent: "Consentement invité pour les modèles non censurés",
    consentVersion: "Version du consentement {{version}}",
    leadReference: "Identifiant du lead {{id}}",
    accountReference: "Identifiant du compte {{id}}",
    leadSource: "Source du lead · {{source}}",
    guestConsentOn:
      "Consentement aux modèles non censurés enregistré le {{date}}",
    guestConsentMissing:
      "Aucun consentement enregistré pour les modèles non censurés",
    consentVersionMissing: "Version du consentement manquante",
    firstTouch: "Première visite · {{touch}}",
    lastTouch: "Dernière visite attribuée · {{touch}}",
    attributionMissing: "Aucune attribution d’acquisition enregistrée",
    linkEvidenceUnavailable:
      "Données de consentement et d’attribution indisponibles",
    optedOutOn: "Désinscription enregistrée le {{date}}",
    optOutDateMissing: "Aucune date de désinscription enregistrée",
    events: {
      created: "Lead créé",
      campaignStarted: "Campagne démarrée",
      emailSent: "E-mail de campagne envoyé",
      emailBounced: "E-mail de campagne rejeté",
      bounced: "Lead marqué comme non joignable par e-mail",
      unsubscribed: "Lead désinscrit",
      invalid: "Lead marqué comme invalide",
      signup: "Compte créé",
      converted: "Conversion enregistrée",
      subscriptionConfirmed: "Abonnement confirmé",
      firstTouch: "Première visite enregistrée",
      lastTouch: "Dernière visite attribuée",
      firstChat: "Première conversation",
      firstPayment: "Première conversion payante",
      leadLink: "Lien vers un lead enregistré",
      accountLink: "Lien vers un compte enregistré",
      referral: "Code de parrainage utilisé",
      interaction: "Interaction enregistrée",
      newsletterSubscribed: "Inscription à la newsletter enregistrée",
      newsletterConfirmed: "Adresse confirmée pour la newsletter",
      newsletterUnsubscribed: "Désinscription de la newsletter",
    },
    evidence: {
      ipMatch: "Adresse IP partagée",
      trackPage: "Visite suivie et cookie visiteur",
      referral: "Lien de parrainage",
      manual: "Lien manuel",
      test: "Lien de test",
      login: "Lié à la connexion",
      signup: "Lié à l’inscription",
      merge: "Lien historique de fusion",
    },
  },
  widget: {
    loading: "Chargement du lead...",
    notFound: "Lead introuvable.",
    back: "Retour",
    leadFallbackTitle: "Lead",
    edit: "Modifier",
    delete: "Supprimer",
    converted: "Converti",
    quickActions: "Actions rapides",
    editLead: "Modifier le lead",
    sendTestEmail: "Envoyer un e-mail de test",
    viewInSearch: "Voir dans la recherche",
    userProfile: "Profil utilisateur",
    userDetail: "Détail utilisateur",
    creditHistory: "Historique des crédits",
    campaignFunnel: "Funnel de campagne",
    sourceLabel: "Source :",
    lastEmailLabel: "Dernier e-mail :",
    campaignPerformance: "Performance de la campagne",
    emailsSent: "E-mails envoyés",
    opened: "Ouverts",
    clicked: "Cliqués",
    openRate: "Taux d'ouverture",
    clickRate: "Taux de clic",
    clickToOpenRate: "Taux de clic sur ouverture",
    contactDetails: "Coordonnées",
    country: "Pays",
    language: "Langue",
    engagement: "Engagement",
    emailsOpened: "E-mails ouverts",
    emailsClicked: "E-mails cliqués",
    lastEngagement: "Dernier engagement",
    unsubscribed: "Désabonné",
    conversion: "Conversion",
    signedUp: "Inscrit",
    convertedAt: "Converti le",
    subscriptionConfirmed: "Abonnement confirmé",
    convertedUserId: "ID de l'utilisateur converti",
    activeSubscriberSince: "Abonné actif depuis",
    viewUserProfile: "Voir le profil utilisateur",
    viewUserDetail: "Voir le détail utilisateur",
    notesAndMetadata: "Notes et métadonnées",
    notes: "Notes",
    metadata: "Métadonnées",
    created: "Créé",
    lastUpdated: "Dernière mise à jour",
    daysOld: "jours d'ancienneté",
    lastEngaged: "Dernière interaction :",
    ago: "auparavant",
    variant: "Variante :",
    copyEmail: "e-mail",
    copyId: "ID",
    copyPhone: "téléphone",
    copyUserId: "ID utilisateur",
    stageNotStarted: "Non démarrée",
    stageInitial: "Premier contact",
    stageFollowup1: "Relance 1",
    stageFollowup2: "Relance 2",
    stageFollowup3: "Relance 3",
    stageNurture: "Nurturing",
    stageReactivation: "Réactivation",
    tabOverview: "Vue d'ensemble",
    tabDetails: "Détails",
    tabIdentity: "Identité",
    tabBasic: "Base",
    tabCampaign: "Campagne",
    tabAdvanced: "Avancé",
    deviceIdentity: "Appareil et identité",
    ipAddress: "Adresse IP",
    userAgent: "User agent",
    deviceType: "Type d'appareil",
    browser: "Navigateur",
    os: "Système d'exploitation",
    referralCode: "Code de parrainage",
    lifecycleTimestamps: "Cycle de vie",
    bouncedAt: "Rejeté le",
    invalidAt: "Invalidé le",
    campaignStartedAt: "Campagne démarrée le",
    linkedLeadsSection: "Leads liés",
    linkedLeadsEmpty: "Aucun lead lié",
    linkedUsersSection: "Comptes utilisateur liés",
    linkedUsersEmpty: "Aucun compte utilisateur lié",
    linkReason: "Motif du lien :",
    linkedAt: "Lié le :",
    copyIp: "IP",
    copyLinkedLeadId: "ID du lead",
    copyUserId2: "ID utilisateur",
    selectLead: "Choisir un lead",
  },
  delete: {
    title: "Supprimer le lead",
    titleShort: "Supprimer le lead",
    description: "Supprimer un lead du système",
    container: {
      title: "Supprimer le lead",
      description: "Voulez-vous vraiment supprimer définitivement ce lead ?",
    },
    backButton: {
      label: "Retour au lead",
    },
    submitButton: {
      label: "Supprimer le lead",
      loadingText: "Suppression du lead...",
    },
    actions: {
      delete: "Supprimer le lead",
      deleting: "Suppression du lead...",
    },
    id: {
      label: "ID du lead",
      description: "Identifiant unique du lead à supprimer",
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "L'ID de lead fourni est invalide",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Authentification requise pour supprimer des leads",
      },
      forbidden: {
        title: "Accès refusé",
        description: "Vous n'avez pas l'autorisation de supprimer ce lead",
      },
      notFound: {
        title: "Lead introuvable",
        description: "Aucun lead trouvé avec cet ID",
      },
      conflict: {
        title: "Conflit de suppression",
        description:
          "Impossible de supprimer le lead : des dépendances existent",
      },
      server: {
        title: "Erreur serveur",
        description: "Une erreur s'est produite lors de la suppression du lead",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inattendue s'est produite",
      },
      network: {
        title: "Erreur réseau",
        description: "Impossible de joindre le serveur",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Vous avez des modifications non enregistrées",
      },
    },
    success: {
      title: "Lead supprimé",
      description: "Le lead a été supprimé",
    },
  },
  countries: {
    ...regionalCountryNames("fr"),
    global: "International",
    de: "Allemagne",
    pl: "Pologne",
    fr: "France",
    us: "États-Unis",
  },
  languages: {
    it: "Italien",
    es: "Espagnol",
    en: "Anglais",
    de: "Allemand",
    pl: "Polonais",
    fr: "Français",
  },
};
