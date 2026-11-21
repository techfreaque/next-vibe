import { translations as analyticsTranslations } from "next-vibe/unified-ui/analytics/i18n/fr";

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  ...analyticsTranslations,
  category: "Parrainage",
  tags: {
    referral: "referral",
    admin: "admin",
    analytics: "analytics",
  },
  enums: {
    sort: {
      revenue: "Chiffre d'affaires",
      commission: "Commission",
      payers: "Utilisateurs payants",
      signups: "Inscriptions",
      leads: "Leads",
      clicks: "Clics",
      conversion: "Clic vers inscription",
      ownerQueue: "File de versements du titulaire",
      ownerFree: "Libre à verser (le plus bas d'abord)",
      newest: "Codes les plus récents",
    },
  },
  get: {
    title: "Vue d'ensemble du parrainage",
    titleShort: "Vue d'ensemble",
    description:
      "Tous les codes de parrainage et partenaires en un seul écran : clics, leads, inscriptions, utilisateurs payants, chiffre d'affaires, commissions et file des versements, comparés à la période précédente.",
    fields: {
      search: {
        label: "Recherche",
        description: "Code, libellé ou e-mail du titulaire",
        placeholder: "Code, libellé ou e-mail du titulaire",
      },
      ownerUserId: {
        label: "Titulaire",
        description: "Uniquement les codes de ce partenaire (ID utilisateur)",
      },
      activeOnly: {
        label: "Codes actifs uniquement",
        description: "Masquer les codes désactivés",
      },
      sortBy: {
        label: "Trier les codes par",
        description: "Ordre du tableau des codes",
      },
      limit: {
        label: "Codes affichés",
        description: "Nombre maximal de lignes du tableau des codes",
      },
    },
    response: {
      window: "Période",
      kpis: "Chiffres clés",
      trend: "Tendance",
      codes: "Codes",
      codesTotal: "Codes dans le périmètre",
      overCommittedOwners: "Titulaires en dépassement",
      payouts: "File des versements",
    },
    widget: {
      kpi: {
        clicks: "Clics",
        clicksHint: "Arrivées navigateur avec un code",
        leads: "Leads",
        leadsHint: "Visiteurs attribués à un code",
        signups: "Inscriptions",
        signupsHint: "{{rate}} des clics",
        payers: "Utilisateurs payants",
        payersHint: "Filleuls ayant payé sur la période",
        revenue: "Chiffre d'affaires",
        revenueHint: "Payé par les filleuls",
        commission: "Commissions gagnées",
        commissionHint: "{{pending}} en attente, {{confirmed}} confirmées",
        payoutsPaid: "Versements effectués",
        payoutsPaidHint: "Finalisés sur cette période",
        queue: "File des versements",
        queueHint: "{{count}} demandes ouvertes",
        queueEmpty: "Rien en attente",
      },
      chart: {
        traffic: "Trafic",
        trafficSub: "Clics et leads attribués",
        conversions: "Conversions",
        conversionsSub: "Nouvelles inscriptions et utilisateurs payants",
        money: "Chiffre d'affaires et commissions",
        moneySub: "USD, par date de paiement",
      },
      series: {
        clicks: "Clics",
        leads: "Leads",
        signups: "Inscriptions",
        payers: "Utilisateurs payants",
        revenue: "Chiffre d'affaires",
        commission: "Commission",
      },
      table: {
        title: "Codes",
        subtitle:
          "{{shown}} codes sur {{total}}. Cliquez sur un code pour ouvrir son rapport.",
        dimension: "Code",
        clicks: "Clics",
        leads: "Leads",
        signups: "Inscriptions",
        payers: "Payants",
        conversion: "Clic vers inscription",
        revenue: "CA",
        commission: "Commission",
        signupsChange: "Inscriptions vs préc.",
        ownerQueue: "File du titulaire",
        ownerFree: "Libre à verser",
        inactive: "inactif",
        overCommitted: "solde dépassé",
        overCommittedOwners: "{{count}} titulaires en dépassement",
        empty: "Aucun code ne correspond à ces filtres.",
        sort: "Tri",
      },
      payouts: {
        title: "Versements par statut",
        subtitle:
          "Statut actuel de toutes les demandes. Cliquez sur un statut pour traiter la liste.",
        dimension: "Statut",
        count: "Demandes",
        amount: "Montant",
        open: "Ouvrir les versements",
        empty: "Aucune demande de versement pour l'instant.",
      },
      filters: {
        search: "Recherche",
        owner: "Titulaire",
        activeOnly: "Actifs uniquement",
        searchPlaceholder: "Code, libellé ou e-mail du titulaire",
      },
      loading: "Chargement de la vue d'ensemble du parrainage",
      cli: {
        payouts: "File des versements : {{count}} ouvertes, {{amount}}",
      },
    },
  },
  errors: {
    validation: {
      title: "Filtres invalides",
      description: "Vérifiez la période et les filtres",
    },
    unauthorized: {
      title: "Non connecté",
      description:
        "Connectez-vous en tant qu'admin pour voir les statistiques de parrainage",
    },
    forbidden: {
      title: "Réservé aux admins",
      description: "Seuls les admins voient les statistiques de parrainage",
    },
    notFound: {
      title: "Introuvable",
      description: "Rien ne correspond à ces filtres",
    },
    conflict: {
      title: "Conflit",
      description: "Les données ont changé pendant le chargement, réessayez",
    },
    server: {
      title: "Erreur serveur",
      description: "Impossible de générer la vue d'ensemble du parrainage",
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
  },
  success: {
    title: "Chargé",
    description: "Vue d'ensemble du parrainage chargée",
  },
};
