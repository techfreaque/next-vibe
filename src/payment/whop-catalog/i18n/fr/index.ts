import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Paiements",
  tags: {
    payment: "payment",
    admin: "admin",
  },
  post: {
    title: "Synchroniser le catalogue Whop",
    titleShort: "Catalogue Whop",
    description:
      "Crée chaque offre et chaque pack de crédits dans le compte Whop connecté : un produit par offre, une variante par période, devise et prix, retrouvée grâce à notre clé dans les métadonnées. Idempotent. Le test à blanc liste ce qui existe et ce qui manque.",
    fields: {
      dryRun: {
        label: "Test à blanc",
        description: "Lister les variantes sans rien créer",
      },
    },
    response: {
      dryRun: "Test à blanc",
      environment: "Environnement Whop",
      accountId: "Compte Whop",
      existing: "Déjà là",
      created: "Créées maintenant",
      missing: "Manquantes",
      variants: "Variantes",
      key: "Clé",
      variantId: "ID de variante",
      productId: "Produit Whop",
      amount: "Montant",
      status: "Statut",
      purchaseUrl: "Lien d'achat",
    },
    widget: {
      hint: "À lancer une fois par compte Whop après un changement de prix. Le paiement crée aussi la variante manquante au premier achat.",
      submit: "Synchroniser le catalogue",
      summary:
        "Whop {{environment}} ({{accountId}}) : {{existing}} existantes, {{created}} créées, {{missing}} manquantes",
    },
  },
  errors: {
    validation: {
      title: "Saisie invalide",
      description: "Vérifiez la requête",
    },
    unauthorized: {
      title: "Non connecté",
      description: "Connectez-vous en tant qu'admin",
    },
    forbidden: {
      title: "Réservé aux admins",
      description: "Seuls les admins synchronisent le catalogue Whop",
    },
    notFound: { title: "Introuvable", description: "Ressource introuvable" },
    conflict: {
      title: "Conflit",
      description: "Whop a changé entre-temps. Relancez.",
    },
    server: {
      title: "Erreur serveur",
      description: "Le catalogue Whop n'a pas pu être synchronisé",
    },
    network: {
      title: "Erreur réseau",
      description: "La requête n'a pas atteint le serveur",
    },
    unknown: {
      title: "Erreur inconnue",
      description: "Un problème inattendu est survenu",
    },
    unsavedChanges: {
      title: "Modifications non enregistrées",
      description: "Enregistrez ou annulez d'abord vos modifications",
    },
    notConfigured:
      "Whop n'est pas configuré (clé API du WHOP_ENVIRONMENT actif manquante)",
    syncFailed: "Échec de la synchronisation du catalogue Whop : {{error}}",
  },
  success: {
    title: "Terminé",
    description: "Catalogue Whop vérifié",
  },
};
