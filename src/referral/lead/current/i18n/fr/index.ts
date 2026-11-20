import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Parrainage du lead actuel",
  titleShort: "Parrainage du lead",
  description:
    "Renvoie le code de parrainage associé au lead actuel, s'il y en a un",
  tag: "Parrainage",
  noReferral: "Aucun parrainage associé à ce prospect",
  response: {
    referralCode: "Code de parrainage",
    referralLabel: "Libellé du parrainage",
    subscriptionBonusCredits: "Crédits bonus avec votre première formule",
  },
  errors: {
    validation: {
      title: "Erreur de validation",
      description: "Requête invalide",
    },
    unauthorized: {
      title: "Non autorisé",
      description: "Authentification requise",
    },
    forbidden: { title: "Interdit", description: "Accès refusé" },
    notFound: { title: "Introuvable", description: "Ressource introuvable" },
    conflict: { title: "Conflit", description: "Conflit de données" },
    serverError: {
      title: "Erreur serveur",
      description: "Erreur interne du serveur",
    },
    unknown: {
      title: "Erreur inconnue",
      description: "Une erreur inattendue est survenue",
    },
    network: {
      title: "Erreur réseau",
      description: "Une erreur réseau est survenue",
    },
    unsavedChanges: {
      title: "Modifications non enregistrées",
      description: "Vous avez des modifications non enregistrées",
    },
  },
  success: {
    title: "Code de parrainage récupéré",
    description: "Code de parrainage du lead actuel récupéré",
  },
};
