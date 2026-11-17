import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Devis",
  tags: { payment: "paiement", estimate: "devis" },
  post: {
    title: "Refuser le devis",
    titleShort: "Refuser le devis",
    description: "Marquer le devis comme refusé par le client",
    form: {
      title: "Refuser le devis",
      description: "Marquer le devis comme refusé par le client",
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
      description: "Devis marqué comme refusé par le client",
    },
  },
  estimateId: { label: "ID du devis", description: "Le devis concerné" },
  widget: {
    back: "Retour",
    submit: "Refuser le devis",
    declined: "Devis marqué comme refusé.",
    confirmTitle: "Refuser ce devis ?",
    confirmDescription:
      "Le devis sera marqué comme refusé. Cette action est irréversible.",
    confirmButton: "Refuser",
    cancelButton: "Annuler",
  },
};
