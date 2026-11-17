import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  post: {
    title: "Ouvrir une période comptable",
    titleShort: "Nouvelle période",
    description: "Créez une nouvelle période comptable pour une entreprise",
    companyId: {
      label: "ID de l'entreprise",
      description: "Entreprise pour laquelle ouvrir la période",
      placeholder: "UUID de l'entreprise",
    },
    name: {
      label: "Nom de la période",
      description: "ex. Janvier 2026",
      placeholder: "Janvier 2026",
    },
    startDate: {
      label: "Date de début",
      description: "Date de début de la période",
      placeholder: "",
    },
    endDate: {
      label: "Date de fin",
      description: "Date de fin de la période",
      placeholder: "",
    },
    response: { id: "ID de la période", name: "Nom" },
    errors: {
      unauthorized: {
        title: "Non autorisé",
        description: "Connexion requise",
      },
      validation: {
        title: "Erreur de validation",
        description: "Vérifiez les dates de début et de fin",
      },
      forbidden: {
        title: "Accès refusé",
        description: "Permissions insuffisantes",
      },
      server: {
        title: "Erreur serveur",
        description: "Impossible de créer la période",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inattendue s'est produite",
      },
      conflict: {
        title: "Chevauchement",
        description: "Ces dates chevauchent une période existante",
      },
      network: {
        title: "Erreur réseau",
        description: "Impossible de joindre le serveur",
      },
      notFound: {
        title: "Introuvable",
        description: "Entreprise introuvable",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Vous avez des modifications non enregistrées",
      },
    },
    success: {
      title: "Période créée",
      description: "Période comptable ouverte",
    },
    widget: {
      viewButton: "Voir la période",
      back: "Retour",
    },
  },
  title: "Créer une période",
  description: "Ouvrir une nouvelle période comptable",
  category: "Plan comptable",
  tag: "Période",
};
