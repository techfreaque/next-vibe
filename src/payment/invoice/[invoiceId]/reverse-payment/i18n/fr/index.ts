import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Contrepasser un encaissement",
  description:
    "Indiquez le motif de la correction. L’écriture d’origine reste dans le journal.",
  invoiceId: "Référence de la facture",
  entryId: "Référence de l’écriture d’encaissement",
  date: "Date de contrepassation",
  reason: "Motif de la contrepassation",
  reasonPlaceholder: "Par exemple, la banque a rejeté le paiement",
  datePlaceholder: "Aujourd’hui",
  viewInvoice: "Voir la facture",
  reversal: "Écriture de contrepassation",
  originalDate: "Date de l’encaissement",
  receiptAmount: "Montant encaissé",
  postingStatus: "État de l’écriture",
  viewReversal: "Voir la contrepassation",
  cancel: "Annuler",
  confirmTitle: "Comptabiliser cette contrepassation ?",
  confirm: "Comptabiliser la contrepassation",
  success: {
    title: "Encaissement contrepassé",
    description: "Le solde de la facture tient compte de la contrepassation.",
  },
  invalidDate:
    "Choisissez une date comprise entre la date d’encaissement et aujourd’hui.",
  noPeriod: "Aucune période comptable ouverte ne couvre cette date.",
  invalidReceipt:
    "Cet encaissement ne peut pas être contrepassé pour cette facture.",
  invalidLines:
    "Les lignes enregistrées sont incomplètes ou concernent une autre devise ou entreprise.",
  errors: {
    unauthorized: {
      title: "Non autorisé",
      description: "Authentification requise",
    },
    validation: {
      title: "Erreur de validation",
      description: "Paramètres de paiement invalides",
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
      description: "Facture introuvable",
    },
    conflict: {
      title: "Conflit",
      description: "La facture est déjà payée ou annulée",
    },
    unsavedChanges: {
      title: "Modifications non enregistrées",
      description: "Des modifications ne sont pas enregistrées",
    },
  },
  tags: { payment: "payment", invoice: "invoice" },
};
