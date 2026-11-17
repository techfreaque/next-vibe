import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { antiFarming: "anti-farming", admin: "admin" },
  get: {
    title: "Rapport de farming des crédits gratuits",
    titleShort: "Rapport de farming",
    description:
      "Qui farme les crédits gratuits. Principaux sous-réseaux par tentatives bloquées et par quotas gratuits réclamés, principaux domaines e-mail parmi les inscriptions en double et jetables, et les limites actives.",
    fields: {
      days: {
        label: "Fenêtre (jours)",
        description:
          "Nombre de jours à remonter pour les tentatives bloquées, les quotas invités et les domaines e-mail. Les quotas des comptes portent toujours sur le mois UTC en cours.",
      },
    },
    response: {
      window: "Fenêtre",
      thresholds: "Limites actives",
      totals: "Tentatives bloquées",
      subnetsByBlocked: "Principaux sous-réseaux par tentatives bloquées",
      subnetsByClaims: "Principaux sous-réseaux par quotas gratuits réclamés",
      emailDomains: "Principaux domaines e-mail",
    },
    success: {
      title: "Rapport de farming prêt",
      description: "Rapport anti-farming généré",
    },
    errors: {
      unauthorized: {
        title: "Non autorisé",
        description: "Connectez-vous d'abord",
      },
      forbidden: { title: "Interdit", description: "Réservé aux admins" },
      server: {
        title: "Erreur serveur",
        description: "Impossible de générer le rapport de farming",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur est survenue",
      },
      validation: {
        title: "Requête invalide",
        description: "Le nombre de jours doit être compris entre 1 et 365",
      },
      notFound: { title: "Introuvable", description: "Aucun résultat" },
      conflict: { title: "Conflit", description: "La requête est en conflit" },
      network: {
        title: "Erreur réseau",
        description: "La requête n'a pas atteint le serveur",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Enregistrez d'abord vos modifications",
      },
    },
  },
  widget: {
    refresh: "Actualiser",
    loading: "Chargement du rapport de farming...",
    windowLine:
      "{{days}} derniers jours (depuis le {{from}}). Quotas des comptes : {{month}} (UTC).",
    kpi: {
      total: "Total bloqué",
      subnetAccountLimit: "Limite comptes atteinte",
      subnetGuestLimit: "Limite invités atteinte",
      duplicateEmail: "E-mail en double",
      disposableEmail: "E-mail jetable",
      subnetSignupLimit: "Limite inscriptions atteinte",
    },
    col: {
      subnet: "Sous-réseau",
      blocked: "Bloqués",
      accountGranted: "Cpt ok",
      accountBlocked: "Cpt non",
      guestGranted: "Inv. ok",
      guestBlocked: "Inv. non",
      lastSeen: "Vu en dernier",
      domain: "Domaine",
      duplicate: "En double",
      disposable: "Jetable",
      total: "Total",
    },
    colHint:
      "Cpt = quotas des comptes ce mois-ci, Inv. = quotas invités sur la fenêtre. ok = crédits gratuits obtenus, non = budget du sous-réseau épuisé.",
    empty: {
      subnets: "Aucune activité de sous-réseau sur cette fenêtre.",
      domains: "Aucune inscription en double ou jetable sur cette fenêtre.",
    },
    limits: {
      accountPerSubnet: "Quotas de comptes par sous-réseau et par mois",
      guestPerSubnet: "Quotas invités par sous-réseau et par jour",
      guestIpWindow:
        "Les invités d'une même IP partagent un quota pendant (heures)",
      signupLookback:
        "Dépenses invité reportées à l'inscription depuis (heures)",
      subnetPrefix: "Taille du sous-réseau",
      signupsPerSubnet: "Nouveaux comptes par sous-réseau sur 24 h",
    },
  },
};
