import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Facturation",
  tags: {
    payment: "paiement",
    invoice: "facture",
    lines: "lignes",
  },
  post: {
    title: "Supprimer une ligne de facture",
    titleShort: "Supprimer la ligne",
    description: "Supprime une ligne d'un brouillon de facture",
    form: {
      title: "Supprimer la ligne",
      description: "Supprime définitivement cette ligne de la facture",
    },
    response: {
      success: "Ligne supprimée",
      message: "Message d'état",
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
        description: "Une erreur interne du serveur s'est produite",
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
        description: "Ligne introuvable",
      },
      conflict: {
        title: "Conflit",
        description: "La facture n'est pas à l'état de brouillon",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Des modifications ne sont pas enregistrées",
      },
    },
    success: {
      title: "Succès",
      description: "Ligne supprimée de la facture",
    },
  },
  lineId: {
    label: "ID de ligne",
    description: "ID de la ligne à supprimer",
    placeholder: "Saisir l'ID de ligne",
  },
  widget: {
    back: "Retour",
    submit: "Supprimer la ligne",
    warning: "Cette ligne sera définitivement supprimée de la facture.",
    confirm: "Supprimer la ligne",
    removed: "Ligne supprimée",
  },
};
