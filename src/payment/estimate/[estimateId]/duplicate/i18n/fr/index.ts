import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Devis",
  tags: { payment: "paiement", estimate: "devis" },
  post: {
    title: "Dupliquer le devis",
    titleShort: "Dupliquer le devis",
    description: "Copier ce devis dans un nouveau brouillon",
    form: {
      title: "Dupliquer le devis",
      description: "Copier ce devis dans un nouveau brouillon",
    },
    response: {
      success: "Succès",
      message: "Message de statut",
      newEstimateId: "ID du nouveau devis",
      estimateNumber: "N° du nouveau devis",
    },
    errors: {
      unauthorized: {
        title: "Non autorisé",
        description: "Authentification requise",
      },
      validation: {
        title: "Erreur de validation",
        description: "Paramètres invalides",
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
      forbidden: { title: "Accès interdit", description: "Accès refusé" },
      notFound: { title: "Introuvable", description: "Devis introuvable" },
      conflict: {
        title: "Conflit",
        description: "Action impossible avec le statut actuel",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Des modifications ne sont pas enregistrées",
      },
    },
    success: {
      title: "Devis dupliqué",
      description: "Un nouveau devis brouillon a été créé",
    },
  },
  estimateId: {
    label: "ID du devis",
    description: "Le devis à dupliquer",
  },
  widget: {
    cancel: "Annuler",
    loading: "Chargement du devis",
    total: "Total",
    created: "Brouillon {{number}} créé avec les mêmes lignes.",
    back: "Retour",
    submit: "Dupliquer le devis",
    viewDuplicate: "Voir la copie",
    duplicateNote:
      "Un nouveau devis brouillon sera créé avec les mêmes lignes et informations.",
  },
};
