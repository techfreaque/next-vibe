import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Devis",
  tags: { payment: "paiement", estimate: "devis" },
  post: {
    title: "Accepter le devis",
    titleShort: "Accepter le devis",
    description: "Marquer le devis comme accepté par le client",
    form: {
      title: "Accepter le devis",
      description: "Marquer le devis comme accepté par le client",
    },
    response: { success: "Succès", message: "Message de statut" },
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
      title: "Succès",
      description: "Devis marqué comme accepté par le client",
    },
  },
  estimateId: { label: "ID du devis", description: "Le devis concerné" },
  widget: {
    cancel: "Annuler",
    loading: "Chargement du devis",
    unavailable: "Seuls les devis envoyés peuvent être acceptés.",
    total: "Total",
    back: "Retour",
    submit: "Accepter le devis",
    accepted: "Devis marqué comme accepté.",
    confirmMessage: "Le devis sera marqué comme accepté par le client.",
  },
};
