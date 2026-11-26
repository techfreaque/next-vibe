import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  enums: {
    country: {
      AT: "Autriche (AT)",
      DE: "Allemagne (DE)",
      XX: "Plan générique (taux de taxe à configurer)",
      SK: "Slovaquie (SK)",
    },
  },
  tags: {
    companies: "entreprises",
    onboard: "intégration",
    setup: "configuration",
  },
  post: {
    title: "Configurer la comptabilité",
    titleShort: "Configurer la comptabilité",
    description:
      "Installez le plan comptable et préparez les comptes de caisse et de banque.",
    companyId: { label: "Entreprise", description: "Entreprise" },
    country: {
      genericPreview:
        "Ajoute un plan générique. Configurez les taux de taxe avant d’émettre des factures.",
      regionalPreview:
        "Utilise le plan comptable et les taux de TVA du pays sélectionné.",
      label: "Modèle de plan comptable",
      description:
        "Pour une entreprise immatriculée en Autriche ou en Allemagne, choisissez le modèle du pays. Pour les autres pays, choisissez le plan générique.",
      placeholder: "Choisir un modèle",
    },
    period: {
      title: "Première période comptable",
      open: "Ouvrir cette période pendant la configuration",
      description:
        "Le mois en cours est proposé. Modifiez les dates pour une période personnalisée ou annuelle.",
      name: "Nom de la période",
      start: "Date de début",
      end: "Date de fin",
      proposal: "Période proposée {{name}}, du {{start}} au {{end}}",
      kept: "Votre calendrier comptable existant est conservé.",
      invalid:
        "Indiquez un nom de période et une date de fin égale ou postérieure au début.",
      opened: "La période {{name}} est ouverte aux écritures.",
      view: "Voir les périodes comptables",
      viewHint: "Consultez votre calendrier comptable.",
      createHint:
        "Choisissez les dates avant de comptabiliser la première écriture.",
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Vérifiez tous les champs",
      },
      unauthorized: {
        title: "Non connecté",
        description: "Connectez-vous pour configurer une entreprise",
      },
      forbidden: {
        title: "Accès refusé",
        description: "Rôle Administrateur requis",
      },
      conflict: {
        title: "Le plan comptable existant utilise le modèle d’un autre pays",
        description:
          "Vérifiez le plan comptable existant avant de changer de modèle.",
      },
      profileMismatch:
        "Choisissez le modèle qui correspond au pays du profil de l’entreprise.",
      server: {
        title: "Erreur serveur",
        description: "Impossible de terminer la configuration",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inattendue s'est produite",
      },
      network: {
        title: "Erreur réseau",
        description: "Vérifiez votre connexion",
      },
      notFound: {
        title: "Entreprise introuvable",
        description: "Cette entreprise n'existe pas",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Vous avez des modifications non enregistrées",
      },
    },
    success: {
      title: "Configuration comptable terminée",
      description:
        "Le plan comptable est prêt. Vous pouvez ouvrir une période et créer des documents.",
    },
    widget: {
      books: "Configuration des comptes",
      setupCounts: "Comptes prêts  {{accounts}} · Taux ajoutés  {{rates}}",
      invoiceHint:
        "Préparez un brouillon pour cette entreprise et vérifiez-le avant de l’émettre.",
      submit: "Configurer la comptabilité",
      company: "Entreprise : {{name}}",
      back: "Retour",
      cashAndBankReady:
        "Les comptes de caisse et de banque sont prêts pour la saisie d’écritures.",
      nextHint:
        "Ouvrez une période comptable avant de comptabiliser des écritures.",
      period: "Créer une période",
      invoice: "Préparer une facture",
    },
    response: {
      accountsCreated: "Comptes ajoutés",
      accountsSkipped: "Comptes déjà présents",
      taxRatesCreated: "Taux de taxe ajoutés",
      cashAccountId: "ID du compte de caisse",
      bankAccountId: "ID du compte bancaire",
      success: "Succès",
    },
  },
};
