import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Lead Magnet",
  tags: {
    leadMagnet: "lead-magnet",
    config: "config",
    capture: "capture",
  },
  enums: {
    captureStatus: {
      success: "Réussi",
      failed: "Échec",
    },
    provider: {
      getresponse: "GetResponse",
      klaviyo: "Klaviyo",
      emarsys: "Emarsys",
      acumbamail: "Acumbamail",
      cleverreach: "CleverReach",
      connectif: "Connectif",
      datanext: "DataNext",
      edrone: "Edrone",
      expertsender: "ExpertSender",
      freshmail: "FreshMail",
      mailup: "MailUp",
      mapp: "Mapp",
      sailthru: "Sailthru",
      salesmanago: "SALESmanago",
      shopify: "Shopify",
      spotler: "Spotler",
      youlead: "YouLead",
      adobecampaign: "Adobe Campaign",
      googleSheets: "Google Sheets",
      platformEmail: "E-mail (via la plateforme)",
    },
  },
  config: {
    title: "Configuration du lead magnet",
    description: "Configurez l'intégration e-mail de votre lead magnet",
    form: {
      title: "Paramètres du lead magnet",
      description:
        "Connectez votre plateforme e-mail pour capturer des leads depuis la page de votre compétence",
      provider: {
        label: "Plateforme e-mail",
        description: "Quelle plateforme d'e-mail marketing utilisez-vous ?",
      },
      listId: {
        label: "ID de liste / groupe",
        description:
          "ID de la liste ou du segment où ajouter les leads (facultatif)",
      },
      headline: {
        label: "Titre du formulaire",
        description: "Le titre affiché au-dessus du formulaire de capture",
        placeholder: "Recevez mon pack de prompts IA gratuit",
      },
      buttonText: {
        label: "Texte du bouton",
        description: "Le texte du bouton d'envoi",
        placeholder: "Accéder →",
      },
      isActive: {
        label: "Actif",
        description:
          "Activer ou désactiver le formulaire de capture sur la page de votre compétence",
      },
      credentials: {
        label: "Identifiants API",
        description:
          "Les identifiants API de votre plateforme e-mail (stockés chiffrés)",
      },
    },
    success: {
      saved: "Configuration du lead magnet enregistrée",
      deleted: "Configuration du lead magnet supprimée",
    },
  },
  capture: {
    title: "Rejoindre la liste",
    description: "Abonnez-vous et accédez au contenu",
    form: {
      title: "Accéder",
      description: "Renseignez vos coordonnées pour accéder au contenu",
      firstName: {
        label: "Prénom",
        description: "Votre prénom",
      },
      email: {
        label: "Adresse e-mail",
        description: "Votre adresse e-mail",
      },
      skillId: {
        label: "ID de la compétence",
        description: "Référence interne de la compétence",
      },
    },
    success: {
      submitted: "C'est fait ! Consultez votre boîte de réception.",
    },
  },
  errors: {
    providerError: "Erreur du fournisseur e-mail",
  },
  providers: {
    shared: {
      listId: {
        label: "ID de liste / groupe",
        description: "ID de la liste ou du segment où ajouter les leads",
        placeholder: "ex. abc123",
      },
      headline: {
        label: "Titre du formulaire",
        description:
          "Le titre affiché au-dessus du formulaire de capture sur la page de votre compétence",
        placeholder: "Recevez mon pack de prompts IA gratuit",
      },
      buttonText: {
        label: "Texte du bouton",
        description: "Le texte du bouton d'envoi",
        placeholder: "Accéder →",
      },
      isActive: {
        label: "Actif",
        description:
          "Activer le formulaire de capture sur la page de votre compétence",
      },
      secretKeepExisting: "Laissez vide pour conserver votre clé actuelle",
      saveTitle: "Enregistrer la configuration",
      saveDescription:
        "Connectez votre plateforme e-mail pour capturer des leads",
      saveTag: "lead-magnet-provider",
      saveSuccess: {
        title: "Configuration enregistrée",
        description:
          "Votre plateforme e-mail est connectée. Les leads vont arriver.",
      },
      errors: {
        validation: {
          title: "Erreur de validation",
          description: "Vérifiez votre saisie",
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
          description: "Ressource introuvable",
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
      response: {
        provider: "Fournisseur",
        isActive: "Actif",
        headline: "Titre",
        buttonText: "Texte du bouton",
        listId: "ID de liste",
      },
    },
    klaviyo: {
      title: "Connecter Klaviyo",
      titleShort: "Klaviyo",
      description:
        "Connectez votre compte Klaviyo pour capturer des leads depuis la page de votre compétence",
      klaviyoApiKey: {
        label: "Clé API Klaviyo",
        description: "Votre clé API privée Klaviyo",
        placeholder: "pk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
    },
    getresponse: {
      title: "Connecter GetResponse",
      titleShort: "GetResponse",
      description:
        "Connectez votre compte GetResponse pour capturer des leads depuis la page de votre compétence",
      getresponseApiKey: {
        label: "Clé API GetResponse",
        description: "Votre clé API GetResponse, dans les paramètres du compte",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
    },
    emarsys: {
      title: "Connecter Emarsys",
      titleShort: "Emarsys",
      description:
        "Connectez votre compte Emarsys pour capturer des leads depuis la page de votre compétence",
      emarsysUserName: {
        label: "Nom d'utilisateur",
        description: "Votre nom d'utilisateur API Emarsys",
        placeholder: "account123",
      },
      emarsysApiKey: {
        label: "Clé API",
        description: "Votre clé secrète API Emarsys",
        placeholder: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      },
      emarsysSubDomain: {
        label: "Sous-domaine",
        description: "Votre sous-domaine API Emarsys (ex. suite.emarsys.net)",
        placeholder: "suite.emarsys.net",
      },
    },
    acumbamail: {
      title: "Connecter Acumbamail",
      titleShort: "Acumbamail",
      description:
        "Connectez votre compte Acumbamail pour capturer des leads depuis la page de votre compétence",
      acumbamailApiKey: {
        label: "Clé API",
        description: "Votre clé API Acumbamail",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
    },
    cleverreach: {
      title: "Connecter CleverReach",
      titleShort: "CleverReach",
      description:
        "Connectez votre compte CleverReach pour capturer des leads depuis la page de votre compétence",
      cleverreachClientId: {
        label: "Client ID",
        description: "Votre client ID OAuth CleverReach",
        placeholder: "xxxxxxxx",
      },
      cleverreachClientSecret: {
        label: "Client secret",
        description: "Votre client secret OAuth CleverReach",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      cleverreachListId: {
        label: "ID de groupe / liste",
        description: "ID du groupe CleverReach où ajouter les contacts",
        placeholder: "123456",
      },
      cleverreachFormId: {
        label: "ID du formulaire DOI (facultatif)",
        description:
          "ID du formulaire pour le double opt-in. Laissez vide pour ignorer le DOI.",
        placeholder: "123456",
      },
      cleverreachSource: {
        label: "Source (facultatif)",
        description: "Libellé de la source du contact, pour le suivi",
        placeholder: "unbottled.ai",
      },
    },
    connectif: {
      title: "Connecter Connectif",
      titleShort: "Connectif",
      description:
        "Connectez votre compte Connectif pour capturer des leads depuis la page de votre compétence",
      connectifApiKey: {
        label: "Clé API",
        description: "Votre clé API Connectif",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
    },
    datanext: {
      title: "Connecter DataNext",
      titleShort: "DataNext",
      description:
        "Connectez votre compte DataNext pour capturer des leads depuis la page de votre compétence",
      datanextApiKey: {
        label: "Clé API",
        description: "Votre clé API DataNext",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      datanextApiSecret: {
        label: "Secret API",
        description: "Votre secret API DataNext",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      datanextFormId: {
        label: "ID du formulaire",
        description: "ID du formulaire DataNext pour l'opt-in",
        placeholder: "123456",
      },
      datanextCampaignId: {
        label: "ID de campagne",
        description: "ID de la campagne à associer aux leads",
        placeholder: "123456",
      },
    },
    edrone: {
      title: "Connecter Edrone",
      titleShort: "Edrone",
      description:
        "Connectez votre compte Edrone pour capturer des leads depuis la page de votre compétence",
      edroneAppId: {
        label: "App ID",
        description: "Votre app ID Edrone",
        placeholder: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      },
    },
    expertsender: {
      title: "Connecter ExpertSender",
      titleShort: "ExpertSender",
      description:
        "Connectez votre compte ExpertSender pour capturer des leads depuis la page de votre compétence",
      expertSenderApiDomain: {
        label: "Domaine API",
        description: "Votre domaine API ExpertSender",
        placeholder: "api3.esv2.com",
      },
      expertSenderApiKey: {
        label: "Clé API",
        description: "Votre clé API ExpertSender",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
    },
    freshmail: {
      title: "Connecter FreshMail",
      titleShort: "FreshMail",
      description:
        "Connectez votre compte FreshMail pour capturer des leads depuis la page de votre compétence",
      freshmailApiKey: {
        label: "Clé API",
        description: "Votre clé API FreshMail",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      freshmailApiSecret: {
        label: "Secret API",
        description: "Votre secret API FreshMail",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      listHash: {
        label: "Hash de la liste",
        description: "Le hash de la liste d'abonnés où ajouter les leads",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
    },
    mailup: {
      title: "Connecter MailUp",
      titleShort: "MailUp",
      description:
        "Connectez votre compte MailUp pour capturer des leads depuis la page de votre compétence",
      mailupClientId: {
        label: "Client ID",
        description: "Votre client ID OAuth MailUp",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      mailupClientSecret: {
        label: "Client secret",
        description: "Votre client secret OAuth MailUp",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      mailupUsername: {
        label: "Nom d'utilisateur",
        description: "Le nom d'utilisateur de votre compte MailUp",
        placeholder: "m12345",
      },
      mailupPassword: {
        label: "Mot de passe",
        description: "Le mot de passe de votre compte MailUp",
        placeholder: "••••••••",
      },
      mailupListId: {
        label: "ID de liste",
        description: "ID numérique de la liste où inscrire les contacts",
        placeholder: "1",
      },
    },
    mapp: {
      title: "Connecter Mapp",
      titleShort: "Mapp",
      description:
        "Connectez votre compte Mapp pour capturer des leads depuis la page de votre compétence",
      mappUsername: {
        label: "Nom d'utilisateur",
        description: "Votre nom d'utilisateur API Mapp",
        placeholder: "utilisateur",
      },
      mappPassword: {
        label: "Mot de passe",
        description: "Votre mot de passe API Mapp",
        placeholder: "••••••••",
      },
      mappDomain: {
        label: "Domaine",
        description: "Votre domaine API Mapp",
        placeholder: "api.mapp.com",
      },
    },
    sailthru: {
      title: "Connecter Sailthru",
      titleShort: "Sailthru",
      description:
        "Connectez votre compte Sailthru pour capturer des leads depuis la page de votre compétence",
      sailthruApiKey: {
        label: "Clé API",
        description: "Votre clé API Sailthru",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      sailthruSecret: {
        label: "Secret API",
        description: "Votre secret API Sailthru",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      listName: {
        label: "Nom de la liste",
        description: "Nom de la liste Sailthru où inscrire les contacts",
        placeholder: "Mes abonnés",
      },
    },
    salesmanago: {
      title: "Connecter SALESmanago",
      titleShort: "SALESmanago",
      description:
        "Connectez votre compte SALESmanago pour capturer des leads depuis la page de votre compétence",
      salesManagoClientId: {
        label: "Client ID",
        description: "Votre client ID SALESmanago",
        placeholder: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      },
      salesManagoApiKey: {
        label: "Clé API",
        description: "Votre clé API SALESmanago",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      salesManagoSha: {
        label: "SHA",
        description: "Votre hash SHA SALESmanago pour l'authentification",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      salesManagoDomain: {
        label: "Domaine",
        description: "Votre domaine API SALESmanago",
        placeholder: "app3.salesmanago.pl",
      },
      salesManagoOwner: {
        label: "E-mail du propriétaire",
        description: "L'e-mail du propriétaire de votre compte SALESmanago",
        placeholder: "owner@example.com",
      },
    },
    shopify: {
      title: "Connecter Shopify",
      titleShort: "Shopify",
      description:
        "Connectez votre boutique Shopify pour capturer des leads depuis la page de votre compétence",
      shopifyDomain: {
        label: "Domaine de la boutique",
        description: "Le domaine de votre boutique Shopify",
        placeholder: "mystore.myshopify.com",
      },
      shopifyAccessToken: {
        label: "Jeton d'accès",
        description: "Votre jeton d'accès à l'Admin API Shopify",
        placeholder: "shpat_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
    },
    spotler: {
      title: "Connecter Spotler",
      titleShort: "Spotler",
      description:
        "Connectez votre compte Spotler pour capturer des leads depuis la page de votre compétence",
      spotlerConsumerKey: {
        label: "Consumer key",
        description: "Votre consumer key API Spotler",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      spotlerConsumerSecret: {
        label: "Consumer secret",
        description: "Votre consumer secret API Spotler",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
    },
    youlead: {
      title: "Connecter YouLead",
      titleShort: "YouLead",
      description:
        "Connectez votre compte YouLead pour capturer des leads depuis la page de votre compétence",
      youLeadAppId: {
        label: "App ID",
        description: "L'ID de votre application YouLead",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      youLeadClientId: {
        label: "Client ID",
        description: "Votre client ID YouLead",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      youLeadAppSecretKey: {
        label: "Clé secrète de l'application",
        description: "La clé secrète de votre application YouLead",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
    },
    adobecampaign: {
      title: "Connecter Adobe Campaign",
      titleShort: "Adobe Campaign",
      description:
        "Connectez votre compte Adobe Campaign pour capturer des leads depuis la page de votre compétence",
      adobeCampaignOrganizationId: {
        label: "ID d'organisation",
        description: "Votre ID d'organisation Adobe IMS",
        placeholder: "XXXXXXXXXXXXXXXXXXXXXXXX@AdobeOrg",
      },
      adobeCampaignClientId: {
        label: "Client ID",
        description: "Votre client ID API Adobe Campaign",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      adobeCampaignClientSecret: {
        label: "Client secret",
        description: "Votre client secret API Adobe Campaign",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      adobeCampaignApiKey: {
        label: "Clé API",
        description: "Votre clé API Adobe Campaign",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      adobeCampaignListId: {
        label: "ID de liste",
        description:
          "ID de la liste de profils Adobe Campaign où ajouter les leads",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
    },
    platformEmail: {
      title: "Notification par e-mail de la plateforme",
      titleShort: "Platform Email",
      description:
        "Recevez un e-mail à chaque nouvelle inscription via votre lead magnet",
      notifyEmail: {
        label: "E-mail de notification",
        description: "L'adresse qui reçoit les notifications de leads",
        placeholder: "vous@exemple.fr",
      },
      notifyEmailName: {
        label: "Votre nom",
        description: "Le nom affiché dans l'e-mail de notification",
        placeholder: "Camille",
      },
    },
    googleSheets: {
      title: "Connecter Google Sheets",
      titleShort: "Google Sheets",
      description:
        "Ajoutez une ligne à votre Google Sheet à chaque nouvelle inscription",
      saveTitle: "Enregistrer la configuration Google Sheets",
      connect: {
        label: "Connecter un compte Google",
      },
      connected: {
        description: "Votre compte Google est connecté",
      },
      spreadsheetId: {
        label: "Feuille de calcul",
        description: "Choisissez la feuille de calcul où ajouter les leads",
        placeholder: "Choisir une feuille de calcul…",
      },
      sheetTab: {
        label: "Onglet (facultatif)",
        description:
          "Nom de l'onglet dans la feuille de calcul. Laissez vide pour utiliser le premier onglet.",
        placeholder: "ex. Leads",
      },
      widget: {
        connectTitle: "Connecter Google Sheets",
        connectDescription:
          "Connectez-vous avec Google pour ajouter automatiquement chaque nouveau lead comme ligne dans votre feuille de calcul.",
        redirectNote:
          "Vous serez redirigé vers Google pour autoriser l'accès à vos feuilles de calcul.",
        reconnect: "Reconnecter",
        loading: "Chargement des feuilles de calcul…",
        noSheets: "Aucune feuille de calcul trouvée",
        refresh: "Actualiser la liste",
        selectRequired: "Choisissez une feuille de calcul",
        saveFailed: "Échec de l'enregistrement. Réessayez.",
        saving: "Enregistrement…",
      },
    },
  },
};
