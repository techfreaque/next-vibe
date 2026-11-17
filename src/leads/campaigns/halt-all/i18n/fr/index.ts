import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Arrêter toutes les campagnes",
  description: "Stopper toutes les campagnes e-mail actives",
  post: {
    title: "Arrêter toutes les campagnes",
    titleShort: "Arrêter campagnes",
    description:
      "Arrêter immédiatement toutes les campagnes e-mail actives et annuler les envois en attente",
    fields: {
      confirm: {
        label: "Confirmer l'arrêt",
        description: "Cochez pour confirmer l'arrêt de toutes les campagnes",
      },
      reason: {
        label: "Motif",
        description: "Motif de l'arrêt (facultatif)",
      },
    },
    response: {
      halted: "Campagnes arrêtées",
      emailsCancelled: "E-mails annulés",
    },
    errors: {
      unauthorized: {
        title: "Non autorisé",
        description: "Accès administrateur requis",
      },
      forbidden: { title: "Interdit", description: "Permission refusée" },
      server: {
        title: "Erreur serveur",
        description: "Impossible d'arrêter les campagnes",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inconnue s'est produite",
      },
      validation: {
        title: "Erreur de validation",
        description: "La confirmation doit être cochée",
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
      title: "Campagnes arrêtées",
      description: "Toutes les campagnes ont été arrêtées",
    },
  },
  widget: {
    title: "Arrêt d'urgence",
    description:
      "Stopper immédiatement toutes les campagnes e-mail actives. À utiliser en cas d'erreur ou de problème urgent.",
    haltButton: "Arrêter toutes les campagnes",
    halting: "Arrêt en cours...",
    confirmTitle: "Arrêter toutes les campagnes ?",
    confirmDescription:
      "Toutes les campagnes e-mail actives seront stoppées immédiatement et les e-mails en attente annulés. Cette action est irréversible.",
    confirmButton: "Oui, tout arrêter",
    cancelButton: "Annuler",
    done: "Arrêté",
  },
};
