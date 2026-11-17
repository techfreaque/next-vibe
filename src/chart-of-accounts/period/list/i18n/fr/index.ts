import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  get: {
    title: "Périodes comptables",
    titleShort: "Périodes",
    description: "Liste de toutes les périodes comptables d'une entreprise",
    companyId: {
      label: "ID de l'entreprise",
      description: "Entreprise dont vous voulez lister les périodes",
      placeholder: "Saisissez l'UUID de l'entreprise",
    },
    response: {
      periods: "Périodes",
      id: "ID",
      name: "Nom",
      startDate: "Début",
      endDate: "Fin",
      status: "Statut",
      closedAt: "Clôturée le",
    },
    errors: {
      unauthorized: {
        title: "Non autorisé",
        description: "Connexion requise",
      },
      validation: {
        title: "Erreur de validation",
        description: "ID d'entreprise invalide",
      },
      forbidden: {
        title: "Accès refusé",
        description: "Permissions insuffisantes",
      },
      server: {
        title: "Erreur serveur",
        description: "Impossible de charger les périodes",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inattendue s'est produite",
      },
      conflict: { title: "Conflit", description: "Conflit de données" },
      network: {
        title: "Erreur réseau",
        description: "Impossible de joindre le serveur",
      },
      notFound: { title: "Introuvable", description: "Aucune période trouvée" },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Vous avez des modifications non enregistrées",
      },
    },
    success: {
      title: "Périodes chargées",
      description: "Périodes comptables récupérées",
    },
    widget: {
      loading: "Chargement des périodes...",
      empty: "Aucune période comptable trouvée.",
      createButton: "Créer une période",
    },
  },
  enums: {
    periodStatus: {
      OPEN: "Ouverte",
      CLOSED: "Clôturée",
      LOCKED: "Verrouillée",
    },
  },
  title: "Liste des périodes",
  description: "Lister les périodes comptables",
  category: "Plan comptable",
  tag: "Période",
};
