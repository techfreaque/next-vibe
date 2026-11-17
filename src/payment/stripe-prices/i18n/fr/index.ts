import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Paiements",
  tags: {
    payment: "payment",
    admin: "admin",
  },
  post: {
    title: "Créer les prix Stripe",
    titleShort: "Prix Stripe",
    description:
      "Crée chaque prix de formule et de pack de crédits dans le compte Stripe connecté (par devise et par langue), retrouvé par clé de recherche. Idempotent, aucun ID de prix dans le .env. Le test à blanc liste ce qui existe et ce qui manque.",
    fields: {
      dryRun: {
        label: "Test à blanc",
        description: "Lister les prix sans rien créer",
      },
    },
    response: {
      dryRun: "Test à blanc",
      stripeMode: "Mode Stripe",
      existing: "Déjà là",
      created: "Créés maintenant",
      missing: "Manquants",
      prices: "Prix",
      lookupKey: "Clé de recherche",
      priceId: "ID du prix",
      productId: "ID du produit",
      amount: "Montant",
      status: "Statut",
    },
    widget: {
      hint: "À lancer une fois par compte Stripe après un changement de prix. Le paiement crée aussi un prix manquant au premier achat.",
      submit: "Créer les prix",
      summary:
        "Stripe {{mode}} : {{existing}} existants, {{created}} créés, {{missing}} manquants",
    },
  },
  errors: {
    validation: {
      title: "Saisie invalide",
      description: "Vérifiez la requête",
    },
    unauthorized: {
      title: "Non connecté",
      description: "Connectez-vous en admin",
    },
    forbidden: {
      title: "Réservé aux admins",
      description: "Seuls les admins gèrent les prix Stripe",
    },
    notFound: {
      title: "Introuvable",
      description: "Ressource introuvable",
    },
    conflict: {
      title: "Conflit",
      description: "Stripe a changé entre-temps, relancez",
    },
    server: {
      title: "Erreur serveur",
      description: "Impossible de créer les prix Stripe",
    },
    network: {
      title: "Erreur réseau",
      description: "La requête n'a pas atteint le serveur",
    },
    unknown: {
      title: "Erreur inconnue",
      description: "Une erreur inattendue s'est produite",
    },
    unsavedChanges: {
      title: "Modifications non enregistrées",
      description: "Enregistrez ou annulez d'abord vos modifications",
    },
    notConfigured: "Stripe n'est pas configuré (STRIPE_SECRET_KEY manquant)",
  },
  success: {
    title: "Terminé",
    description: "Prix Stripe vérifiés",
  },
};
