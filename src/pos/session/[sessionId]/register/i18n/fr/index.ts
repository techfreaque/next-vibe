import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    pos: "Caisse",
    register: "Écran de caisse",
  },
  enums: {
    sessionStatus: {
      open: "Ouverte",
      closed: "Fermée",
    },
  },
  get: {
    title: "Caisse",
    titleShort: "Caisse",
    description:
      "Encaissez sur une caisse ouverte : scannez ou touchez les produits, encaissez, remettez le ticket.",
    sessionId: {
      label: "Session de caisse",
      description: "La session ouverte sur laquelle vous vendez",
    },
    response: {
      status: "État de la caisse",
      terminalName: "Caisse",
      companyName: "Entreprise",
      currency: "Devise",
      openedAt: "Ouverte",
      openingFloat: "Fond de caisse",
      salesCount: "Ventes",
      salesTotal: "Recette",
      openOrders: "Ventes en attente",
      orderNumber: "Vente",
      itemCount: "Articles",
      total: "Total",
      createdAt: "Commencée",
    },
    errors: {
      validation: {
        title: "Session de caisse invalide",
        description:
          "Ouvrez la caisse depuis le tableau de bord du point de vente.",
      },
      unauthorized: {
        title: "Connexion requise",
        description: "Connectez-vous pour utiliser la caisse.",
      },
      forbidden: {
        title: "Pas d'accès à cette caisse",
        description:
          "Vous n'êtes pas membre de l'entreprise propriétaire de cette caisse.",
      },
      conflict: {
        title: "Caisse modifiée",
        description:
          "Cette caisse a été modifiée ailleurs. Rechargez et réessayez.",
      },
      server: {
        title: "Impossible de charger la caisse",
        description:
          "Un problème est survenu de notre côté. Réessayez dans un instant.",
      },
      unknown: {
        title: "Impossible de charger la caisse",
        description: "Une erreur inattendue est survenue. Réessayez.",
      },
      network: {
        title: "Pas de connexion",
        description: "Vérifiez votre connexion et réessayez.",
      },
      notFound: {
        title: "Session introuvable",
        description: "Cette session n'existe plus.",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Terminez ou abandonnez d'abord la vente en cours.",
      },
    },
    success: {
      title: "Caisse prête",
      description: "La caisse est chargée.",
    },
  },
  widget: {
    back: "Retour",
    subtitle: "{{company}} · ouverte depuis {{time}}",
    takings: "Recette du service : {{total}} · Ventes : {{count}}",
    sales: "Ventes",
    closeTill: "Fermer la caisse",
    search: {
      label: "Rechercher des produits",
      placeholder: "Scannez un code-barres ou cherchez un produit",
      hint: "pour chercher, Entrée ajoute l'article",
      clear: "Effacer la recherche",
    },
    products: {
      title: "Produits",
      none: "Aucun résultat pour « {{query}} ».",
      emptyCatalog: "Aucun produit actif n'est vendu en {{currency}}.",
      addProducts: "Ajouter des produits",
      inCart: "Dans la vente : {{count}}",
      loading: "Chargement des produits",
    },
    custom: {
      tile: "Article libre",
      tileHint: "Montant libre",
      title: "Article libre",
      description: "Libellé",
      descriptionPlaceholder: "Emballage cadeau",
      price: "Prix",
      vat: "TVA %",
      add: "Ajouter à la vente",
      cancel: "Annuler",
    },
    cart: {
      title: "Vente {{number}}",
      newTitle: "Nouvelle vente",
      empty: "Scannez ou touchez un produit pour démarrer une vente.",
      items: "Articles : {{count}}",
      increase: "Un {{name}} de plus",
      decrease: "Un {{name}} de moins",
      remove: "Retirer {{name}}",
      each: "{{price}} l'unité",
      locked: "Paiement encaissé. Les articles sont verrouillés.",
      subtotal: "HT",
      vat: "TVA",
      total: "Total",
      paid: "Payé",
      due: "Reste à payer",
      change: "Monnaie",
      removePayment: "Retirer le paiement {{method}}",
      parked: "En attente",
      park: "Mettre en attente",
      resume: "Reprendre {{number}}",
    },
    tender: {
      title: "Paiement",
      cash: "Espèces",
      card: "Carte",
      transfer: "Virement",
      other: "Autre",
      amount: "Montant reçu",
      reference: "Référence (facultatif)",
      referencePlaceholder: "Ticket carte ou référence de virement",
      exact: "Compte juste",
      take: "Encaisser {{amount}}",
      takeShort: "Encaisser",
      changeHint: "Monnaie à rendre : {{amount}}",
      complete: "Terminer la vente",
      retryComplete: "Terminer la vente",
      pay: "Encaisser {{amount}}",
      shortcut: "Ctrl+Entrée",
    },
    void: {
      action: "Annuler la vente",
      title: "Annuler cette vente ?",
      message:
        "Le panier est vidé. La vente reste dans l'historique comme annulée.",
      confirm: "Annuler la vente",
      cancel: "Garder la vente",
      blocked: "Paiement encaissé. Retirez le paiement avant d'annuler.",
    },
    receipt: {
      title: "Vente terminée",
      number: "Ticket {{number}}",
      giveChange: "Rendre la monnaie",
      newSale: "Nouvelle vente",
      refund: "Rembourser",
      open: "Ouvrir le ticket",
      paidWith: "Payé par {{method}}",
    },
    closed: {
      title: "Cette caisse est fermée",
      message:
        "Ouvrez une nouvelle session depuis le tableau de bord pour vendre à nouveau.",
      backToPos: "Retour au point de vente",
      sales: "Ventes de cette session",
    },
    error: {
      title: "L'opération n'a pas abouti",
      dismiss: "Fermer",
    },
  },
};
