import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  post: {
    title: "Clôturer la période",
    titleShort: "Clôturer la période",
    description:
      "Clôture une période comptable. Aucune écriture en brouillon (DRAFT) ne doit rester dans la période.",
    periodId: {
      label: "ID de la période",
      description: "La période à clôturer",
      placeholder: "UUID de la période",
    },
    errors: {
      unauthorized: {
        title: "Non autorisé",
        description: "Connexion requise",
      },
      validation: {
        title: "Erreur de validation",
        description: "ID de période invalide",
      },
      forbidden: {
        title: "Accès refusé",
        description: "Le rôle comptable est requis pour clôturer une période",
      },
      server: {
        title: "Erreur serveur",
        description: "Impossible de clôturer la période",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inattendue s'est produite",
      },
      conflict: {
        title: "Écritures en brouillon",
        description:
          "Toutes les écritures doivent être comptabilisées avant la clôture",
      },
      network: {
        title: "Erreur réseau",
        description: "Impossible de joindre le serveur",
      },
      notFound: { title: "Introuvable", description: "Période introuvable" },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Vous avez des modifications non enregistrées",
      },
    },
    success: {
      title: "Période clôturée",
      description: "La période comptable a été clôturée",
    },
    widget: {
      closedLabel: "Clôturée",
      failedLabel: "Échec",
      confirmTitle: "Clôturer la période comptable ?",
      confirmDescription:
        "La clôture est définitive. Plus aucune écriture ne pourra être comptabilisée sur une période clôturée.",
      confirmButton: "Oui, clôturer",
      cancelButton: "Annuler",
    },
  },
  title: "Clôturer la période",
  description: "Clôturer une période comptable",
  category: "Plan comptable",
  tag: "Période",
};
