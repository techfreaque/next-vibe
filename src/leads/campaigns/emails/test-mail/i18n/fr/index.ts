import { regionalCountryNames } from "next-vibe/core/i18n/core/regions";

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Leads",
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
    hi: "Hindi",
    en: "Anglais",
    de: "Allemand",
    pl: "Polonais",
    fr: "Français",
  },
  enums: {
    campaignType: {
      leadCampaign: "Campagne leads",
      newsletter: "Newsletter",
      signupNurture: "Accompagnement inscription",
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
      signupNurture: "Accompagnement inscription",
      retention: "Fidélisation",
      winback: "Reconquête",
      newsletterMay2026: "Newsletter mai 2026",
      newsletterNov2026: "Newsletter novembre 2026",
    },
    emailCampaignStage: {
      notStarted: "Non démarrée",
      initial: "Initiale",
      followup1: "Relance 1",
      followup2: "Relance 2",
      followup3: "Relance 3",
      nurture: "Accompagnement",
      reactivation: "Réactivation",
    },
    leadStatus: {
      new: "Nouveau",
      pending: "En attente",
      campaignRunning: "Campagne en cours",
      websiteUser: "Utilisateur du site",
      newsletterSubscriber: "Abonné newsletter",
      inContact: "En contact",
      signedUp: "Inscrit",
      subscriptionConfirmed: "Abonnement confirmé",
      unsubscribed: "Désinscrit",
      bounced: "Rejeté",
      invalid: "Invalide",
    },
    leadSource: {
      website: "Site web",
      socialMedia: "Réseaux sociaux",
      emailCampaign: "Campagne e-mail",
      referral: "Parrainage",
      csvImport: "Import CSV",
    },
  },
  tags: {
    campaigns: "Campagnes",
    leads: "Leads",
  },
  post: {
    title: "E-mail de test",
    titleShort: "E-mail de test",
    description:
      "Envoyer un e-mail de test avec des données de lead personnalisées",
    form: {
      title: "Configuration de l'e-mail de test",
      description:
        "Configurer les paramètres de l'e-mail de test et les données du lead",
    },
    campaignType: {
      label: "Type de campagne",
      description: "Type de campagne e-mail",
      placeholder: "Saisissez le type de campagne",
    },
    emailJourneyVariant: {
      label: "Variante de parcours e-mail",
      description: "Variante de test A/B du parcours e-mail",
      placeholder: "Sélectionnez une variante de parcours",
    },
    emailCampaignStage: {
      label: "Étape de la campagne e-mail",
      description: "Étape actuelle dans la campagne e-mail",
      placeholder: "Sélectionnez une étape de campagne",
    },
    testEmail: {
      label: "Adresse e-mail de test",
      description: "Adresse e-mail à laquelle envoyer l'e-mail de test",
      placeholder: "test@example.com",
    },
    leadData: {
      title: "Données du lead",
      description: "Informations du lead pour le rendu du modèle",
      businessName: {
        label: "Nom de l'entreprise",
        description: "Nom de l'entreprise",
        placeholder: "Acme Corporation",
      },
      contactName: {
        label: "Nom du contact",
        description: "Nom de la personne à contacter",
        placeholder: "Jean Dupont",
      },
      website: {
        label: "Site web",
        description: "URL du site web de l'entreprise",
        placeholder: "https://example.com",
      },
      country: {
        label: "Pays",
        description: "Code pays",
        placeholder: "GLOBAL",
      },
      language: {
        label: "Langue",
        description: "Code de la langue préférée",
        placeholder: "en",
      },
      status: {
        label: "Statut",
        description: "Statut du lead",
        placeholder: "NEW",
      },
      source: {
        label: "Source",
        description: "Source du lead",
        placeholder: "WEBSITE",
      },
      notes: {
        label: "Notes",
        description: "Notes supplémentaires sur le lead",
        placeholder: "Saisissez des notes supplémentaires",
      },
    },
    response: {
      title: "Résultat de l'e-mail de test",
      description: "Résultat de l'envoi de l'e-mail de test",
      success: {
        content: "Succès",
      },
      messageId: {
        content: "ID du message",
      },
      testEmail: {
        content: "E-mail de test",
      },
      subject: {
        content: "Objet de l'e-mail",
      },
      sentAt: {
        content: "Envoyé le",
      },
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
        description: "Une erreur interne du serveur s'est produite",
        detail: "Échec de l'envoi de test : {{error}}",
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
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Des modifications ne sont pas enregistrées",
      },
      conflict: {
        title: "Conflit",
        description: "Un conflit de données s'est produit",
      },
      templateNotFound: {
        title:
          "Aucun modèle pour {{emailJourneyVariant}} / {{emailCampaignStage}}",
        description: "Modèle d'e-mail introuvable pour ces paramètres",
      },
      sendingFailed: {
        title: "Échec de l'envoi à {{recipient}} ({{subject}}) : {{error}}",
        description: "Impossible d'envoyer l'e-mail de test",
      },
    },
    success: {
      title: "Succès",
      description: "E-mail de test envoyé",
    },
    selectionCriteria: "Critères de sélection SMTP",
    widget: {
      title: "Envoyer un e-mail de test",
      send: "Envoyer l'e-mail de test",
      sending: "Envoi...",
      successMessage: "E-mail de test envoyé",
      sentTo: "Envoyé à : ",
      subject: "Objet : ",
      sentAt: "Envoyé le : ",
      campaignConfig: "Configuration de la campagne",
      sendAnother: "En envoyer un autre",
    },
  },
};
