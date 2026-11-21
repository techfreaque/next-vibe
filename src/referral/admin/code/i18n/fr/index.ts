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
  get: {
    title: "Rapport de code de parrainage",
    titleShort: "Rapport du code",
    description:
      "Un code de parrainage de bout en bout : son titulaire, comment les clics deviennent leads, inscriptions et utilisateurs payants, le chiffre d'affaires généré, les commissions déclenchées et les versements au titulaire.",
    fields: {
      code: {
        label: "Code de parrainage",
        description:
          "Le code à analyser (majuscules et minuscules indifférentes)",
        placeholder: "moemoe",
      },
    },
    response: {
      window: "Période",
      header: "Code",
      kpis: "Chiffres clés",
      funnel: "Entonnoir",
      trend: "Tendance",
      balance: "Solde du titulaire",
      earningsByLevel: "Commissions par niveau",
      referredUsers: "Filleuls",
      referredTotal: "Total des filleuls",
      payouts: "Versements au titulaire",
    },
    widget: {
      periodTitle: "Cette période",
      owner: "Titulaire",
      ownerEmail: "E-mail du titulaire",
      openOwner: "Ouvrir le titulaire",
      label: "Libellé",
      noLabel: "Aucun libellé",
      bonus: "Bonus d'inscription",
      bonusValue: "+{{credits}} crédits avec le premier forfait",
      noBonus: "Aucun",
      status: "Statut",
      active: "Actif",
      inactive: "Inactif",
      created: "Créé le",
      uses: "Inscriptions attribuées",
      editBonus: "Modifier le bonus",
      reassign: "Réattribuer le code",
      kpi: {
        clicks: "Clics",
        leads: "Leads",
        signups: "Inscriptions",
        signupsHint: "{{rate}} des clics",
        payers: "Utilisateurs payants",
        payersHint: "Filleuls ayant payé sur la période",
        revenue: "Chiffre d'affaires",
        commission: "Commissions déclenchées",
        commissionHint:
          "{{pending}} en attente jusqu'à la fin du délai de remboursement, {{confirmed}} confirmées",
      },
      funnel: {
        title: "Entonnoir",
        subtitle: "Cette période",
        clicks: "Clics",
        leads: "Leads",
        signups: "Inscriptions",
        payers: "Utilisateurs payants",
      },
      chart: {
        conversions: "Conversions",
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
      balance: {
        title: "Solde du titulaire (depuis le début)",
        confirmed: "Gains confirmés",
        pending: "En attente (délai de remboursement)",
        paidOut: "Versé",
        open: "Dans la file des versements",
        available: "Disponible avant la file",
        free: "Libre à verser après la file",
        overCommitted:
          "Les demandes ouvertes dépassent le solde confirmé. Ne les approuvez pas toutes.",
      },
      levels: {
        title: "Commissions par niveau",
        subtitle: "Générées par les utilisateurs de ce code, sur cette période",
        dimension: "Niveau",
        direct: "Direct (titulaire du code)",
        upline: "Upline {{level}}",
        count: "Paiements",
        total: "Gagné",
        pending: "En attente",
        confirmed: "Confirmés",
        canceled: "Annulés",
        empty: "Aucune commission sur cette période.",
      },
      users: {
        title: "Filleuls",
        subtitle:
          "Depuis le début, plus gros payeurs en premier. {{shown}} sur {{total}}.",
        dimension: "Utilisateur",
        signedUp: "inscrit le {{date}}",
        payments: "Paiements",
        revenue: "CA",
        commission: "Commission",
        unpaid: "aucun paiement",
        empty: "Personne ne s'est encore inscrit avec ce code.",
      },
      payouts: {
        title: "Versements au titulaire",
        subtitle: "Toutes les demandes de ce partenaire",
        dimension: "Demande",
        amount: "Montant",
        requested: "demandé le {{date}}",
        processed: "traité le {{date}}",
        openAll: "Ouvrir dans les versements",
        empty: "Ce partenaire n'a jamais demandé de versement.",
      },
      notFound: "Le code {{code}} n'existe pas.",
      pickCode: "Saisissez un code de parrainage pour voir son rapport.",
      loading: "Chargement du rapport du code",
    },
  },
  errors: {
    validation: {
      title: "Saisie invalide",
      description: "Vérifiez le code et la période",
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
      title: "Code introuvable",
      description: "Aucun code de parrainage ne correspond",
    },
    conflict: {
      title: "Conflit",
      description: "Les données ont changé pendant le chargement, réessayez",
    },
    server: {
      title: "Erreur serveur",
      description: "Impossible de générer le rapport du code",
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
    codeNotFound: "Le code de parrainage {{code}} n'existe pas",
  },
  success: {
    title: "Chargé",
    description: "Rapport du code chargé",
  },
};
