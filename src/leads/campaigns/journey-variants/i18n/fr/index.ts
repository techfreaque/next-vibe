import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Variantes de parcours",
  description: "Gérer les variantes de parcours e-mail enregistrées",
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
  },
  get: {
    title: "Variantes de parcours",
    titleShort: "Variantes de parcours",
    description: "Lister toutes les variantes de parcours e-mail enregistrées",
    response: {
      id: "ID",
      variantKey: "Clé de variante",
      displayName: "Nom affiché",
      description: "Description",
      weight: "Poids",
      active: "Active",
      campaignType: "Type de campagne",
      sourceFilePath: "Chemin du fichier source",
      senderName: "Nom de l'expéditeur",
      companyName: "Nom de l'entreprise",
      companyEmail: "E-mail de l'entreprise",
      checkErrors: "Erreurs de vérification",
      createdAt: "Créée le",
      updatedAt: "Modifiée le",
      items: "Variantes",
      total: "Total des variantes",
    },
    errors: {
      unauthorized: {
        title: "Non autorisé",
        description: "Accès administrateur requis",
      },
      forbidden: { title: "Interdit", description: "Permission refusée" },
      server: {
        title: "Erreur serveur",
        description: "Impossible de charger les variantes de parcours",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inconnue s'est produite",
      },
      validation: {
        title: "Erreur de validation",
        description: "Paramètres de requête invalides",
      },
      notFound: { title: "Introuvable", description: "Introuvable" },
      conflict: { title: "Conflit", description: "Conflit" },
      network: { title: "Erreur réseau", description: "Erreur réseau" },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Modifications non enregistrées",
      },
    },
    success: {
      title: "Variantes chargées",
      description: "Variantes de parcours chargées",
    },
  },
  post: {
    title: "Enregistrer une variante de parcours",
    titleShort: "Nouvelle variante",
    description: "Enregistrer une nouvelle variante de parcours e-mail",
    fields: {
      variantKey: {
        label: "Clé de variante",
        description:
          "Identifiant unique (ex. MY_VARIANT). Doit correspondre à une clé de l'enum EmailJourneyVariant.",
      },
      displayName: {
        label: "Nom affiché",
        description: "Nom lisible de cette variante",
      },
      description: {
        label: "Description",
        description: "Le sujet de ce parcours",
      },
      weight: {
        label: "Poids",
        description:
          "Poids du test A/B (1-100). Utilisé uniquement pour les campagnes de leads froids.",
      },
      campaignType: {
        label: "Type de campagne",
        description:
          "Type de campagne auquel cette variante est destinée (facultatif)",
      },
      sourceFilePath: {
        label: "Chemin du fichier source",
        description:
          "Chemin relatif du fichier .email.tsx (ex. journeys/my-variant.email)",
      },
      senderName: {
        label: "Nom de l'expéditeur",
        description:
          "Nom d'expéditeur affiché dans le client e-mail (ex. Alex de Unbottled)",
      },
      companyName: {
        label: "Nom de l'entreprise",
        description:
          "Nom de l'entreprise affiché dans le pied de page ou le modèle de l'e-mail",
      },
      companyEmail: {
        label: "E-mail de l'entreprise",
        description:
          "E-mail de contact de l'entreprise affiché dans le pied de page ou le modèle de l'e-mail",
      },
    },
    errors: {
      unauthorized: {
        title: "Non autorisé",
        description: "Accès administrateur requis",
      },
      forbidden: { title: "Interdit", description: "Permission refusée" },
      server: {
        title: "Erreur serveur",
        description: "Impossible d'enregistrer la variante de parcours",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inconnue s'est produite",
      },
      validation: {
        title: "Erreur de validation",
        description: "Clé de variante ou données invalides",
      },
      notFound: {
        title: "Introuvable",
        description: "Clé de variante absente de l'enum",
      },
      conflict: {
        title: "Conflit",
        description: "Clé de variante déjà enregistrée",
      },
      network: { title: "Erreur réseau", description: "Erreur réseau" },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Modifications non enregistrées",
      },
    },
    success: {
      title: "Variante enregistrée",
      description: "Variante de parcours enregistrée",
    },
  },
  patch: {
    title: "Modifier une variante de parcours",
    titleShort: "Modifier la variante",
    description: "Modifier une variante de parcours e-mail enregistrée",
    fields: {
      id: {
        label: "ID de la variante",
        description: "ID de la variante à modifier",
      },
      active: {
        label: "Active",
        description: "Activer ou désactiver cette variante",
      },
      weight: {
        label: "Poids",
        description: "Poids du test A/B (1-100)",
      },
      displayName: {
        label: "Nom affiché",
        description: "Nom lisible de cette variante",
      },
      description: {
        label: "Description",
        description: "Le sujet de ce parcours",
      },
      senderName: {
        label: "Nom de l'expéditeur",
        description: "Nom d'expéditeur affiché dans le client e-mail",
      },
      companyName: {
        label: "Nom de l'entreprise",
        description:
          "Nom de l'entreprise affiché dans le pied de page ou le modèle de l'e-mail",
      },
      companyEmail: {
        label: "E-mail de l'entreprise",
        description:
          "E-mail de contact de l'entreprise affiché dans le pied de page ou le modèle de l'e-mail",
      },
    },
    errors: {
      unauthorized: {
        title: "Non autorisé",
        description: "Accès administrateur requis",
      },
      forbidden: { title: "Interdit", description: "Permission refusée" },
      server: {
        title: "Erreur serveur",
        description: "Impossible de modifier la variante de parcours",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inconnue s'est produite",
      },
      validation: {
        title: "Erreur de validation",
        description: "Données de modification invalides",
      },
      notFound: { title: "Introuvable", description: "Variante introuvable" },
      conflict: { title: "Conflit", description: "Conflit" },
      network: { title: "Erreur réseau", description: "Erreur réseau" },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Modifications non enregistrées",
      },
    },
    success: {
      title: "Variante modifiée",
      description: "Variante de parcours modifiée",
    },
  },
  widget: {
    title: "Variantes de parcours",
    refresh: "Actualiser",
    register: "Enregistrer une variante",
    noVariants: "Aucune variante enregistrée pour l'instant",
    activeLabel: "Active",
    inactiveLabel: "Inactive",
    weightLabel: "Poids",
    campaignTypeLabel: "Type de campagne",
    sourceFileLabel: "Fichier source",
    toggleActivate: "Activer",
    toggleDeactivate: "Désactiver",
    checkErrorsLabel: "Erreurs de vérification :",
    unsavedChanges: "modifications non enregistrées",
    saving: "Enregistrement…",
    saveChanges: "Enregistrer les modifications",
  },
};
