import { translations as analyticsTranslations } from "next-vibe/unified-ui/analytics/i18n/fr";

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  ...analyticsTranslations,
  get: {
    title: "Consommation de crédits",
    titleShort: "Consommation",
    description:
      "Dépense de crédits dans le temps : comptes vs invités, crédits gratuits vs packs, par modèle, fonction et fournisseur, avec coût fournisseur, marge et plus gros consommateurs.",
    tags: {
      usage: "consommation de crédits",
      margin: "marge",
    },
    fields: {
      actor: {
        label: "Consommateur",
        description: "Comptes, invités (sans compte) ou les deux",
      },
      creditKind: {
        label: "Crédits",
        description: "Quota mensuel gratuit, crédits de packs ou les deux",
      },
      model: {
        label: "Modèle",
        description: "Uniquement la dépense sur cet ID de modèle",
      },
      feature: {
        label: "Fonction",
        description:
          "Uniquement la dépense sur cette fonction (chat, Generate Image, ...)",
      },
      provider: {
        label: "Fournisseur amont",
        description: "Uniquement la dépense servie par ce fournisseur amont",
      },
      includeInternal: {
        label: "Inclure les comptes admin",
        description: "Compter aussi la dépense des comptes admin",
      },
    },
    response: {
      window: "Période",
      appliedFilters: "Filtres appliqués",
      kpis: "Chiffres clés",
      spendByActor: "Dépense par consommateur",
      spendByKind: "Dépense par type de crédit",
      costVsSpend: "Valeur dépensée vs coût fournisseur",
      byModel: "Par modèle",
      byFeature: "Par fonction",
      byProvider: "Par fournisseur amont",
      topSpenders: "Plus gros consommateurs",
    },
    errors: {
      validation: {
        title: "Filtres invalides",
        description: "Vérifiez la période et les filtres, puis réessayez.",
      },
      unauthorized: {
        title: "Connexion requise",
        description:
          "Connectez-vous en admin pour voir la consommation de crédits.",
      },
      forbidden: {
        title: "Réservé aux admins",
        description: "Seuls les admins voient la consommation de crédits.",
      },
      notFound: {
        title: "Aucun résultat",
        description: "Aucune donnée de consommation pour cette requête.",
      },
      server: {
        title: "Échec du rapport",
        description:
          "Impossible de générer le rapport de consommation. Réessayez.",
      },
      unknown: {
        title: "Erreur inattendue",
        description:
          "Un problème est survenu pendant le chargement du rapport.",
      },
      network: {
        title: "Erreur de connexion",
        description: "Le serveur est injoignable.",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Appliquez ou annulez d'abord vos changements de filtres.",
      },
      conflict: {
        title: "Conflit de données",
        description:
          "Les données ont changé pendant le chargement. Actualisez le rapport.",
      },
    },
    success: {
      title: "Rapport prêt",
      description: "Consommation de crédits chargée",
    },
  },
  widget: {
    extra: {
      nothingRecorded: "Rien d’enregistré",
      paidShareHint2:
        "Packs achetés et abonnements, sur la consommation au financement connu ; {{missing}} sans origine",
      costedPct: "Coût connu %",
      paidShare: "Part payée",
      paidShareHint:
        "Consommation issue des packs achetés et abonnements ; valeur totale {{value}}",
      freeCostHint3:
        "Coût fournisseur de {{credits}} crédits gratuits ; coût connu sur {{coverage}} de la consommation",
      fundGrants: "Dotations",
      boughtPct: "Achetés %",
      subPct: "Abo %",
      grantsPct: "Dotations %",
      unknownPct: "Origine inconnue %",
      fundingChart: "Consommation par financement",
      fundingNote:
        "Quelle réserve a payé chaque débit : quota gratuit, bonus compte / newsletter, packs achetés, abonnement, crédits de parrainage ou attributions admin. Enregistré au débit ; origine inconnue seulement pour les débits plus anciens.",
      fundAllowance: "Quota gratuit",
      fundPurchased: "Achetés",
      fundSubscription: "Abonnement",
      fundBonus: "Bonus accordés",
      fundEarned: "Gains de parrainage",
      fundUnknown: "Origine inconnue",
      fundFreeBonus: "Bonus compte / newsletter",
      fundFreeUnknown: "Gratuit, palier non enregistré",
      fundAdminGrant: "Attribution admin",
      change: "vs préc.",
      paidPct: "Payé %",
      topModel: "surtout {{model}}",
      spendersHint: "par {{count}} utilisateurs",
      accountTag: "compte",
      freeCostHint2:
        "Coût fournisseur de l’usage gratuit ; coût connu sur {{coverage}} de la consommation",
      notLoaded: "Rapport non chargé. Actualisez pour réessayer.",
      freeCost: "Coût de l’usage gratuit",
      freeCostHint:
        "Coût fournisseur de l’usage du quota gratuit, quand il est enregistré",
      markup: "Profit brut (coût connu)",
      markupPct: "Marge",
      markupPctHint:
        "Reste après le coût fournisseur, à la valeur catalogue (0,01 $/crédit), pas en cash",
      kindNote2:
        "Les crédits de pack regroupent achats, abonnements et dotations admin ; la consommation n’indique pas lesquels.",
      modelNotRecorded: "modèle non enregistré",
      costedSpend: "Consommation au coût connu",
      costChart: "Consommation au coût connu vs coût fournisseur",
      marginHint2: "Sur {{value}} de consommation au coût connu",
      marginHint:
        "{{value}} de la valeur consommée a des coûts connus ; marge = ce montant moins le coût fournisseur",
      guestPct: "Invités %",
      freePct: "Gratuit %",
      noCost: "coût inconnu",
    },
    kpi: {
      creditsSpent: "Crédits dépensés",
      spendUsd: "Valeur dépensée",
      guestShare: "Part invités",
      freeShare: "Part gratuite",
      upstreamCostUsd: "Coût fournisseur",
      marginUsd: "Marge brute",
      marginPct: "Marge",
      activeSpenders: "Consommateurs actifs",
    },
    hint: {
      spendUsd: "Valeur catalogue à $0.01 par crédit, pas d'encaissement",
      guestShare: "Dépensé par des visiteurs sans compte",
      freeShare: "Payé avec le quota mensuel gratuit",
      upstreamCostUsd: "Enregistré sur {{coverage}} de la dépense",
      marginUsd: "Valeur moins coût fournisseur, lignes avec coût uniquement",
      marginPct: "De la valeur dépensée avec données de coût",
      activeSpenders: "Comptes et invités ayant dépensé",
    },
    chart: {
      actor: "Dépense : comptes vs invités",
      kind: "Dépense : quota gratuit vs crédits de packs",
      kindNote:
        "Les crédits de packs couvrent achats, abonnements et dotations admin.",
      cost: "Valeur dépensée vs coût fournisseur",
      costNote: "Le coût fournisseur n'existe que si le débit l'a enregistré.",
    },
    series: {
      users: "Comptes",
      guests: "Invités",
      free: "Quota gratuit",
      pack: "Crédits de packs",
      spendUsd: "Valeur dépensée",
      upstreamCostUsd: "Coût fournisseur",
    },
    breakdown: {
      model: "Modèle",
      feature: "Fonction",
      provider: "Fournisseur",
      spender: "Consommateur",
      byModel: "Par modèle",
      byFeature: "Par fonction",
      byProvider: "Par fournisseur amont",
      topSpenders: "Plus gros consommateurs",
      topSpendersHint:
        "Cliquez sur une ligne pour ouvrir le compte ou l'invité.",
      drillHint: "Cliquez sur une ligne pour filtrer le rapport.",
    },
    column: {
      credits: "Crédits",
      usd: "Valeur",
      costUsd: "Coût",
      marginPct: "Marge",
      spenders: "Consommateurs",
      guestShare: "Invités",
      freeShare: "Gratuit",
      transactions: "Débits",
    },
    label: {
      noModel: "Outils et médias",
      noFeature: "Non enregistré",
      noProvider: "Non enregistré",
      chat: "Chat",
      guest: "Invité {{id}}",
      guestTag: "invité",
      lastActivity: "dernière dépense {{date}}",
    },
    filter: {
      actor: "Consommateur",
      creditKind: "Crédits",
      model: "Modèle",
      feature: "Fonction",
      provider: "Fournisseur",
      internal: "Admins inclus",
    },
    empty: "Aucune dépense de crédits sur cette période.",
    includeInternal: "Inclure les admins",
  },
  enums: {
    actor: {
      all: "Tous",
      users: "Comptes",
      guests: "Invités",
    },
    creditKind: {
      all: "Tous les crédits",
      free: "Gratuits",
      pack: "Tous les packs",
      purchased: "Achetés",
      subscription: "Abonnement",
      grants: "Dotations",
    },
  },
};
