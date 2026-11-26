import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Devis",
  tags: { payment: "paiement", estimate: "devis", invoice: "facture" },
  post: {
    title: "Convertir le devis en facture",
    titleShort: "Convertir en facture",
    description: "Convertir un devis accepté en facture brouillon",
    form: {
      title: "Convertir en facture",
      description: "Convertir ce devis en facture",
    },
    response: {
      success: "Converti en facture",
      message: "Message de statut",
      invoiceId: "ID de la facture créée",
    },
    errors: {
      reconcile:
        "La somme des lignes diffère du total du devis. Dupliquez le devis pour vérifier et corriger le brouillon.",
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
        description:
          "Le devis doit être au statut SENT ou ACCEPTED pour être converti",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Des modifications ne sont pas enregistrées",
      },
    },
    success: { title: "Succès", description: "Devis converti en facture" },
  },
  estimateId: { label: "ID du devis", description: "Le devis à convertir" },
  widget: {
    back: "Retour",
    submit: "Convertir en facture",
    converted: "Facture créée à partir de ce devis.",
    savedDraftNumber: "Brouillon de facture n° {{number}} créé",
    savedDraft: "Brouillon de facture créé",
    convertedNumber: "Créé à partir du devis {{number}}.",
    viewInvoice: "Ouvrir le brouillon",
    convertNote:
      "Une facture brouillon sera créée avec les mêmes lignes. Le devis sera marqué comme converti.",
  },
};
