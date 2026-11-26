import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Devis",
  tags: { payment: "paiement", estimate: "devis" },
  post: {
    title: "Marquer le devis comme envoyé",
    titleShort: "Marquer le devis comme envoyé",
    description: "Marquer le devis comme envoyé au client",
    form: {
      title: "Marquer le devis comme envoyé",
      description: "Marquer le devis comme envoyé au client",
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
      description: "Devis marqué comme envoyé au client",
    },
  },
  estimateId: { label: "ID du devis", description: "Le devis concerné" },
  widget: {
    back: "Retour",
    submit: "Marquer comme envoyé",
    sent: "Devis marqué comme envoyé au client.",
    sendNote: "Confirmez que vous avez envoyé ce devis au client.",
  },
};
