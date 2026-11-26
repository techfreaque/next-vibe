import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Facturation",
  tags: {
    payment: "paiement",
    bill: "facture fournisseur",
    lines: "lignes",
  },
  post: {
    title: "Supprimer une ligne de facture",
    titleShort: "Supprimer la ligne",
    description: "Supprime une ligne d’un brouillon de facture fournisseur",
    form: {
      title: "Supprimer la ligne",
      description: "Supprime cette ligne du brouillon.",
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
        description:
          "Vous pouvez supprimer une ligne uniquement dans un brouillon modifiable.",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Des modifications ne sont pas enregistrées",
      },
    },
    success: {
      title: "Succès",
      description: "La ligne a été supprimée.",
    },
  },
  billId: {
    label: "Facture fournisseur",
    description: "Facture fournisseur contenant la ligne à supprimer",
  },
  lineId: {
    label: "ID de ligne",
    description: "ID de la ligne à supprimer",
    placeholder: "Saisir l'ID de ligne",
  },
  widget: {
    verifying: "Vérification de la ligne sélectionnée…",
    unavailable:
      "Cette ligne ne peut plus être supprimée. Rouvrez le brouillon et vérifiez les lignes actuelles.",
    lineGross: "Montant TTC de la ligne : {{amount}}",

    back: "Retour",
    submit: "Supprimer la ligne",
    warning:
      "La ligne sera supprimée définitivement et le total du brouillon sera recalculé.",
    confirm: "Supprimer la ligne",
    removed: "Ligne supprimée",
  },
};
