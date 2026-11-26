import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    pos: "Caisse",
    order: "Commande",
    refund: "Remboursement",
  },
  enums: {
    paymentMethod: {
      cash: "Espèces",
      card: "Carte",
      transfer: "Virement",
      other: "Autre",
    },
  },
  get: {
    title: "Remboursements de ventes",
    titleShort: "Remboursements",
    description:
      "Ce qui a été vendu, ce qui est revenu et ce qui peut encore être remboursé.",
    orderId: {
      label: "Vente",
      description: "La vente terminée",
    },
    response: {
      orderId: "Vente",
      orderNumber: "Numéro de vente",
      status: "Statut",
      currency: "Devise",
      total: "Total de la vente",
      refundedTotal: "Remboursé",
      refundableTotal: "Reste remboursable",
      journalPosted: "Comptabilisé",
      lines: "Articles",
      orderItemId: "Ligne",
      description: "Article",
      quantity: "Vendu",
      refundedQuantity: "Remboursé",
      refundableQuantity: "Remboursable",
      unitPrice: "Prix unitaire",
      lineTotal: "Total de la ligne",
      taxRate: "Taux de TVA",
      refunds: "Remboursements",
      refundId: "Remboursement",
      refundNumber: "Numéro de remboursement",
      method: "Remboursé par",
      reason: "Motif",
      createdAt: "Date",
      cashSession: "Tiroir-caisse",
      sessionId: "Session",
      terminalName: "Caisse",
      available: "Espèces dans le tiroir",
    },
    widget: {
      back: "Retour",
      startRefund: "Rembourser des articles",
      fullyRefunded: "Tout a été remboursé sur cette vente.",
      notCompleted: "Seules les ventes terminées peuvent être remboursées.",
      history: "Historique des remboursements",
      noRefunds: "Aucun remboursement sur cette vente pour l'instant.",
      loading: "Chargement de la vente",
    },
    success: {
      title: "Remboursements chargés",
      description: "La vente et l'historique des remboursements sont à jour.",
    },
  },
  post: {
    title: "Rembourser la vente",
    titleShort: "Rembourser",
    description:
      "Rendez l'argent d'une vente terminée, en totalité ou ligne par ligne. Le stock retourne en rayon et la comptabilité suit.",
    orderId: {
      label: "Vente",
      description: "La vente terminée à rembourser",
    },
    lines: {
      label: "Articles à rembourser",
      description:
        "Ligne et quantité par article. Laissez vide pour rembourser tout ce qui reste.",
    },
    method: {
      label: "Rembourser par",
      description:
        "Comment l'argent est rendu. Les espèces sortent d'un tiroir-caisse ouvert.",
      placeholder: "Choisir le mode de remboursement",
    },
    sessionId: {
      label: "Tiroir-caisse",
      description:
        "Session ouverte qui paie les espèces. Par défaut, votre session ouverte sur une caisse dans la devise de la vente.",
    },
    reason: {
      label: "Motif",
      description:
        "Pourquoi l'argent est rendu. Conservé avec le remboursement.",
      placeholder: "Par exemple : article endommagé retourné",
    },
    response: {
      refundId: "Remboursement",
      refundNumber: "Numéro de remboursement",
      orderId: "Vente",
      sessionId: "Session",
      method: "Remboursé par",
      currency: "Devise",
      subtotal: "HT",
      taxAmount: "TVA",
      total: "Remboursé maintenant",
      refundedTotal: "Total remboursé",
      fullyRefunded: "Entièrement remboursé",
      journalEntryId: "Écriture comptable",
      stockReturned: "Produits remis en stock",
    },
    widget: {
      back: "Retour à la vente",
      items: "Ce qui revient",
      selectAll: "Tout rembourser",
      clear: "Effacer",
      decrease: "{{item}} : un de moins",
      increase: "{{item}} : un de plus",
      all: "Tout",
      sold: "{{quantity}} vendu(s)",
      alreadyRefunded: "{{quantity}} déjà remboursé(s)",
      nothingLeft: "Entièrement remboursé",
      summary: "Remboursement",
      net: "HT",
      vat: "TVA",
      total: "Total du remboursement",
      cashFrom: "Payé depuis le tiroir de {{terminal}}",
      drawerAvailable: "Dans le tiroir : {{amount}}",
      noCashSession:
        "Ouvrez une session sur une caisse en {{currency}} pour rembourser en espèces.",
      drawerShort: "Le tiroir contient moins d'espèces que ce remboursement.",
      confirmTitle: "Rembourser {{amount}} ?",
      confirmDescription:
        "L'argent est rendu par {{method}}. Le stock et la comptabilité sont mis à jour. Un remboursement ne peut pas être annulé.",
      confirm: "Rembourser",
      cancel: "Annuler",
      pickItems: "Choisissez au moins un article.",
      reasonMissing: "Ajoutez un motif.",
      loading: "Chargement de la vente",
      viewRefunds: "Voir les remboursements",
      newSale: "Retour à la vente",
    },
    success: {
      title: "Remboursement effectué",
      description: "L'argent est en route vers le client.",
    },
  },
  messages: {
    notCompleted: "Seules les ventes terminées peuvent être remboursées.",
    invalidLine:
      "Choisissez des articles de cette vente avec une quantité supérieure à zéro.",
    nothingLeft: "Il ne reste rien à rembourser sur cette vente.",
    overRefund:
      "C'est plus que ce qui a été vendu, remboursements précédents déduits.",
    rounding:
      "Ce remboursement est trop faible pour être payé. Ajoutez des articles.",
    cashSessionRequired:
      "Les remboursements en espèces exigent une session ouverte sur une caisse dans la devise de la vente.",
    sessionInvalid: "Choisissez une session ouverte de cette entreprise.",
    cashCurrencyMismatch:
      "Cette caisse travaille dans une autre devise que la vente.",
    drawerShort: "Le tiroir contient moins d'espèces que ce remboursement.",
    postingUnavailable:
      "Le remboursement n'a pas pu être comptabilisé. Vérifiez qu'une période comptable est ouverte.",
    stockUnavailable:
      "Le stock n'a pas pu être remis. Vérifiez que l'entrepôt est actif.",
  },
  errors: {
    validation: {
      title: "Vérifiez le remboursement",
      description:
        "Choisissez des articles, un mode de remboursement et un motif.",
    },
    unauthorized: {
      title: "Connexion requise",
      description: "Connectez-vous pour rembourser des ventes.",
    },
    forbidden: {
      title: "Accès refusé",
      description:
        "Vous ne pouvez pas rembourser les ventes de cette entreprise.",
    },
    notFound: {
      title: "Vente introuvable",
      description:
        "Cette vente n'existe pas ou appartient à une autre entreprise.",
    },
    conflict: {
      title: "Remboursement impossible",
      description: "La vente ou le tiroir n'autorise pas ce remboursement.",
    },
    server: {
      title: "Remboursement échoué",
      description: "Rien n'a été remboursé. Réessayez.",
    },
    unknown: {
      title: "Remboursement échoué",
      description: "Rien n'a été remboursé. Réessayez.",
    },
    network: {
      title: "Pas de connexion",
      description: "Vérifiez votre connexion et réessayez.",
    },
    unsavedChanges: {
      title: "Modifications non enregistrées",
      description: "Terminez ou annulez d'abord vos modifications.",
    },
  },
};
