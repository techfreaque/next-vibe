import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Devis",
  tags: { payment: "paiement", estimate: "devis", lines: "lignes" },
  post: {
    title: "Supprimer une ligne du devis",
    titleShort: "Supprimer la ligne",
    description: "Supprimer une ligne d'un devis en brouillon",
    form: {
      title: "Supprimer une ligne du devis",
      description: "Supprimer cette ligne du devis",
    },
    response: {
      estimateId: "Devis",
      success: "Succès",
      message: "Message de statut",
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
      notFound: { title: "Introuvable", description: "Ligne introuvable" },
      conflict: {
        title: "Conflit",
        description:
          "Le devis doit être au statut DRAFT pour supprimer des lignes",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Des modifications ne sont pas enregistrées",
      },
    },
    success: {
      title: "Ligne supprimée",
      description: "Ligne supprimée du devis",
    },
  },
  lineId: { label: "ID de la ligne", description: "La ligne à supprimer" },
  widget: {
    lineTotal: "Total de la ligne",
    back: "Retour",
    submit: "Supprimer la ligne",
    removed: "Ligne supprimée du devis.",
    confirmTitle: "Supprimer cette ligne ?",
    confirmDescription:
      "La ligne sera définitivement supprimée du devis. Les totaux seront recalculés.",
    confirmButton: "Supprimer",
    cancelButton: "Annuler",
  },
};
