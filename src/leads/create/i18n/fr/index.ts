import { regionalCountryNames } from "next-vibe/core/i18n/core/regions";

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Leads",
  tags: {
    leads: "Leads",
    create: "Créer",
  },

  enums: {
    leadSource: {
      website: "Site web",
      socialMedia: "Réseaux sociaux",
      emailCampaign: "Campagne e-mail",
      referral: "Parrainage",
      csvImport: "Import CSV",
    },
  },
  widget: {
    headerLeadCreated: "Lead créé",
    headerCreateLead: "Créer un lead",
    subheaderFillDetails: "Renseignez les informations ci-dessous",
    fallbackLeadName: "Lead",
    buttonCopyId: "Copier l'ID",
    buttonViewLead: "Voir le lead",
    buttonEditLead: "Modifier le lead",
    buttonBackToList: "Retour à la liste",
  },
  post: {
    title: "Créer un lead",
    titleShort: "Nouveau lead",
    description: "Créer un nouveau lead dans le système",
    backButton: {
      label: "Retour aux leads",
    },
    submitButton: {
      label: "Créer le lead",
      loadingText: "Création du lead...",
    },
    form: {
      title: "Formulaire de nouveau lead",
      description: "Saisissez les informations du lead pour le créer",
    },
    contactInfo: {
      title: "Coordonnées",
      description: "Coordonnées principales du lead",
    },
    email: {
      label: "Adresse e-mail",
      description: "Adresse e-mail principale pour les échanges",
      placeholder: "jean@example.com",
    },
    businessName: {
      label: "Nom de l'entreprise",
      description: "Nom de la société ou de l'entreprise",
      placeholder: "Exemple SARL",
    },
    phone: {
      label: "Numéro de téléphone",
      description: "Numéro de téléphone avec indicatif pays",
      placeholder: "+1234567890",
    },
    website: {
      label: "Site web",
      description: "URL du site web de l'entreprise",
      placeholder: "https://example.com",
    },
    locationPreferences: {
      title: "Localisation et préférences",
      description: "Préférences géographiques et linguistiques",
    },
    country: {
      label: "Pays",
      description: "Localisation de l'entreprise ou marché cible",
      placeholder: "Sélectionnez un pays",
    },
    language: {
      label: "Langue",
      description: "Langue de communication préférée",
      placeholder: "Sélectionnez une langue",
    },
    leadDetails: {
      title: "Détails du lead",
      description: "Informations complémentaires sur le lead",
    },
    source: {
      label: "Source du lead",
      description: "Comment le lead a été acquis",
      placeholder: "Sélectionnez une source",
    },
    notes: {
      label: "Notes",
      description: "Notes ou commentaires supplémentaires",
      placeholder: "Saisissez des informations supplémentaires...",
    },
    response: {
      title: "Lead créé",
      description: "Détails du lead nouvellement créé",
      summary: {
        title: "Résumé du lead",
        id: "ID du lead",
        businessName: "Nom de l'entreprise",
        email: "Adresse e-mail",
        status: "Statut du lead",
      },
      contactDetails: {
        title: "Coordonnées",
        phone: "Numéro de téléphone",
        website: "URL du site web",
        country: "Pays",
        language: "Langue",
      },
      trackingInfo: {
        title: "Informations de suivi",
        source: "Source du lead",
        emailsSent: "Nombre d'e-mails",
        currentCampaignStage: "Étape de campagne",
      },
      metadata: {
        title: "Métadonnées",
        notes: "Notes",
        createdAt: "Date de création",
        updatedAt: "Dernière modification",
      },
    },
    errors: {
      unauthorized: {
        title: "Non autorisé",
        description: "Authentification requise pour créer des leads",
      },
      validation: {
        title: "Erreur de validation",
        description: "Informations du lead invalides",
      },
      server: {
        title: "Erreur serveur",
        description:
          "Une erreur interne du serveur s'est produite lors de la création du lead",
      },
      unknown: {
        title: "Erreur inconnue",
        description:
          "Une erreur inconnue s'est produite lors de la création du lead",
      },
      network: {
        title: "Erreur réseau",
        description:
          "Une erreur réseau s'est produite lors de la création du lead",
      },
      forbidden: {
        title: "Interdit",
        description: "Accès interdit à la création de leads",
      },
      notFound: {
        title: "Introuvable",
        description: "Ressource nécessaire à la création du lead introuvable",
      },
      conflict: {
        title: "Conflit",
        description:
          "Le lead existe déjà ou un conflit de données s'est produit",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description:
          "Le formulaire du lead contient des modifications non enregistrées",
      },
    },
    success: {
      title: "Lead créé",
      description: "Lead créé",
    },
  },
  email: {
    welcome: {
      subject: "Bienvenue chez {{companyName}}",
      title: "Bienvenue chez {{companyName}}, {{businessName}} !",
      preview: "Bienvenue : voici comment démarrer",
      greeting:
        "Bienvenue chez {{companyName}}, {{businessName}} ! Ravis de vous compter parmi nous.",
      defaultName: "à vous",
      introduction:
        "Merci de votre intérêt. Vos informations nous sont bien parvenues, et c'est un humain qui les lit.",
      nextSteps: {
        title: "Et maintenant ?",
        step1Number: "1.",
        step1:
          "Lancez une discussion tout de suite. Sans configuration, sans carte bancaire.",
        step2Number: "2.",
        step2: "Une question ? Répondez à cet e-mail. Un humain le lit.",
        step3Number: "3.",
        step3: "Nous répondons dès que possible.",
      },
      cta: {
        getStarted: "Commencer à discuter",
      },
      support:
        "Des questions ? Répondez à cet e-mail ou contactez-nous à {{supportEmail}}",
      error: {
        noEmail:
          "Impossible d'envoyer l'e-mail de bienvenue : aucune adresse e-mail fournie",
      },
    },
    admin: {
      newLead: {
        subject: "Nouveau lead : {{businessName}}",
        title: "Nouveau lead créé",
        preview: "Nouveau lead de {{businessName}} à relancer",
        message:
          "Un nouveau lead de {{businessName}} a été créé dans le système et requiert votre attention.",
        leadDetails: "Détails du lead",
        businessName: "Nom de l'entreprise",
        email: "E-mail",
        phone: "Téléphone",
        website: "Site web",
        source: "Source",
        status: "Statut",
        notes: "Notes",
        notProvided: "Non renseigné",
        viewLead: "Voir les détails du lead",
        viewAllLeads: "Voir tous les leads",
        error: {
          noData:
            "Impossible d'envoyer la notification admin : aucune donnée de lead fournie",
        },
        defaultName: "Nouveau lead",
      },
    },
    error: {
      general: {
        internal_server_error: "Une erreur interne du serveur s'est produite",
      },
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
    sk: "Slovaque",
    en: "Anglais",
    de: "Allemand",
    pl: "Polonais",
    fr: "Français",
  },
};
