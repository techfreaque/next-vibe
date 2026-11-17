import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Newsletter",
  tags: {
    newsletter: "Newsletter",
    credits: "Crédits",
  },
  enum: {
    offer: {
      available: "Disponible",
      pendingConfirmation: "En attente de confirmation de l'e-mail",
      active: "Bonus actif",
      notEligible: "Non disponible",
    },
  },
  response: {
    offer: "Bonus newsletter",
    email: "E-mail du compte",
    bonusCredits: "Crédits bonus par mois",
    freeRefillAt: "Recharge des crédits gratuits le",
  },
  get: {
    title: "Bonus de crédits newsletter",
    titleShort: "Bonus newsletter",
    description:
      "Indique si votre compte peut encore obtenir le bonus mensuel de crédits newsletter. Réservé aux comptes.",
  },
  post: {
    title: "Obtenir le bonus de crédits newsletter",
    titleShort: "Obtenir le bonus newsletter",
    description:
      "Abonnez l'e-mail de votre compte à la newsletter pour recevoir des crédits gratuits en plus chaque mois. Réservé aux comptes, une fois par compte.",
  },
  errors: {
    validation: {
      title: "Requête invalide",
      description: "La requête n'a pas pu être traitée",
    },
    unauthorized: {
      title: "Compte requis",
      description:
        "Le bonus de crédits newsletter est réservé aux comptes. Inscrivez-vous gratuitement ou connectez-vous d'abord.",
    },
    forbidden: {
      title: "Non autorisé",
      description: "Vous ne pouvez pas obtenir ce bonus",
    },
    notFound: {
      title: "Compte introuvable",
      description: "Nous n'avons pas trouvé votre compte",
    },
    internal: {
      title: "Un problème est survenu",
      description: "Impossible de vérifier le bonus newsletter. Réessayez.",
    },
  },
  success: {
    title: "C'est fait",
    description: "Statut du bonus newsletter chargé",
  },
  widget: {
    available: "+{{bonusCredits}} crédits gratuits chaque mois",
    availableHint:
      "Abonnez {{email}} à la newsletter. Nous envoyons d'abord un lien de confirmation.",
    claim: "Obtenir +{{bonusCredits}} crédits/mois",
    pending:
      "Consultez {{email}}. Cliquez sur le lien de confirmation pour débloquer +{{bonusCredits}} crédits/mois.",
    active: "Bonus newsletter actif : +{{bonusCredits}} crédits/mois.",
    notEligible: "Bonus newsletter non disponible pour ce compte.",
    refill: "Recharge des crédits gratuits le {{date}}.",
  },
};
