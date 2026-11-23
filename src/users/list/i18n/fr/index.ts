import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tag: "Utilisateurs",
  get: {
    title: "Utilisateurs",
    titleShort: "Utilisateurs",
    description:
      "Chaque compte avec ce qu'il a payé, ce qu'il dépense et sa dernière activité. Recherchez, filtrez par revenu, activité, date d'inscription ou source, triez par n'importe quelle colonne financière.",
    fields: {
      hasSpentCredits: "Crédits utilisés",
      requiredState: {
        label: "État requis",
        description: "Le compte doit aussi avoir cet état",
      },
      accountLocale: {
        label: "Langue du compte",
        description: "Paramètre régional exact, par exemple fr-FR",
      },
      attributedRefCode: {
        label: "Code de parrainage attribué",
        description: "Code de parrainage crédité ou code de la première visite",
      },
      search: {
        label: "Rechercher des comptes",
        description: "E-mail, nom ou début d'un ID utilisateur",
        placeholder: "Rechercher un e-mail, un nom ou un ID...",
      },
      roles: {
        label: "Rôles",
        description: "Utilisateurs ayant au moins un de ces rôles",
        placeholder: "Tous les rôles",
      },
      accountState: {
        label: "État du compte",
        description: "Actif, inactif, banni, vérifié ou non vérifié",
        placeholder: "Tous les états",
      },
      payer: {
        label: "Payant ou gratuit",
        description: "Payant = au moins un paiement réussi",
        placeholder: "Payant ou gratuit",
      },
      subscription: {
        label: "Abonnement",
        description: "Abonnement actif, déjà abonné ou jamais abonné",
        placeholder: "Tous les abonnements",
      },
      lastActive: {
        label: "Dernière activité",
        description: "Activité = crédits dépensés, connexion ou paiement",
        placeholder: "Toute période",
      },
      signupFrom: {
        label: "Inscrit depuis",
        description: "Premier jour d'inscription inclus",
      },
      signupTo: {
        label: "Inscrit jusqu'au",
        description: "Dernier jour d'inscription inclus",
      },
      creditsMin: {
        label: "Crédits minimum",
        description: "Solde minimum du portefeuille",
      },
      creditsMax: {
        label: "Crédits maximum",
        description: "Solde maximum du portefeuille",
      },
      source: {
        label: "Source",
        description:
          "Canal de premier contact, source/medium/campagne UTM, domaine référent ou code de parrainage",
        placeholder: "google, ref:, newsletter...",
      },
      referralActivity: {
        label: "En tant que parrain",
        description:
          "Utilisateurs qui partagent un lien de parrainage et ce qu'il a rapporté",
        placeholder: "Tous",
      },
      audience: {
        label: "Public",
        description:
          "Humains seulement exclut les admins et les adresses de test (example.com, .invalid, fixtures .test)",
        placeholder: "Tout le monde",
      },
      channel: {
        label: "Canal",
        description:
          "Canal du premier contact, exact (google, youtube, direct). none = comptes sans parcours",
        placeholder: "youtube",
      },
      channelType: {
        label: "Type de canal",
        description: "Comment le premier contact est arrivé",
        placeholder: "Tous types",
      },
      refCode: {
        label: "Code de parrainage",
        description:
          "Code de la première visite ou du parrainage crédité, exact",
        placeholder: "FRIEND2024",
      },
      plan: {
        label: "Formule",
        description: "Abonnement actif ou en essai sur cette formule",
        placeholder: "Toute formule",
      },
      activeFrom: {
        label: "Crédits utilisés depuis",
        description: "Consommation de crédits ce jour ou après",
      },
      activeTo: {
        label: "Crédits utilisés jusqu'au",
        description: "Consommation de crédits ce jour ou avant",
      },
      spentMin: {
        label: "Dépensé au moins",
        description:
          "Crédits dépensés au total. Avec Jamais payé, repère les gros consommateurs gratuits",
      },
      paidFrom: {
        label: "Payé depuis",
        description: "Paiement réussi ce jour ou après",
      },
      paidTo: {
        label: "Payé jusqu'au",
        description: "Paiement réussi ce jour ou avant",
      },
      sortBy: {
        label: "Trier par",
        description: "Colonne de tri",
      },
      sortOrder: {
        label: "Ordre",
        description: "Croissant ou décroissant",
      },
      page: {
        label: "Page",
        description: "Numéro de page, commence à 1",
      },
      limit: {
        label: "Par page",
        description: "Utilisateurs par page (200 max.)",
      },
    },
    response: {
      users: "Utilisateurs",
      summary: "Résumé",
    },
    errors: {
      unauthorized: {
        title: "Non autorisé",
        description: "Connectez-vous pour voir les utilisateurs",
      },
      validation: {
        title: "Filtres invalides",
        description: "Vérifiez les valeurs des filtres et réessayez",
      },
      forbidden: {
        title: "Réservé aux admins",
        description: "Le rôle admin est requis pour voir les utilisateurs",
      },
      server: {
        title: "Impossible de charger les utilisateurs",
        description: "Le serveur n'a pas pu charger la liste des utilisateurs",
      },
      unknown: {
        title: "Erreur inattendue",
        description: "Un problème est survenu au chargement des utilisateurs",
      },
      conflict: {
        title: "Conflit",
        description: "La requête est en conflit avec les données actuelles",
      },
      network: {
        title: "Erreur réseau",
        description: "Impossible de joindre le serveur",
      },
      notFound: {
        title: "Aucun utilisateur",
        description: "Aucun utilisateur ne correspond à ces filtres",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Vous avez des modifications non enregistrées",
      },
    },
    success: {
      title: "Utilisateurs chargés",
      description: "Liste des utilisateurs chargée",
    },
  },
  enums: {
    audience: {
      all: "Tout le monde",
      humans: "Humains seulement",
    },
    channelType: {
      campaign: "Campagne",
      referral: "Parrainage",
      organic: "Organique",
      direct: "Direct",
    },
    plan: {
      subscription: "Starter",
      plus: "Plus",
      pro: "Pro",
      ultra: "Ultra",
    },
    sortOrder: {
      asc: "Croissant",
      desc: "Décroissant",
    },
    role: {
      admin: "Admin",
      customer: "Client",
      partnerAdmin: "Admin partenaire",
      partnerEmployee: "Employé partenaire",
      public: "Public",
    },
    subscription: {
      any: "Tous",
      hasActive: "Actif maintenant",
      hadAny: "Déjà abonné",
      never: "Jamais abonné",
    },
    referrer: {
      any: "Tous",
      hasCode: "A un lien de parrainage",
      hasClicks: "Lien cliqué",
      hasSignups: "Lien avec inscriptions",
      hasSubscribers: "Lien avec abonnés payants",
    },
    sortField: {
      createdAt: "Date d'inscription",
      lastActive: "Dernière activité",
      credits: "Solde de crédits",
      totalPaid: "Total payé",
      creditsSpent: "Crédits dépensés",
      email: "E-mail",
      name: "Nom",
    },
    accountState: {
      active: "Actif",
      inactive: "Inactif",
      banned: "Banni",
      verified: "E-mail vérifié",
      unverified: "E-mail non vérifié",
    },
    payer: {
      any: "Payant ou gratuit",
      paid: "Payant",
      free: "Jamais payé",
    },
    lastActive: {
      any: "Toute période",
      day: "Dernières 24 heures",
      week: "7 derniers jours",
      month: "30 derniers jours",
      dormant: "Inactif depuis 30 j+",
      never: "Jamais actif",
    },
  },
  widget: {
    spent30d: "{{count}} sur 30 j",
    notTracked: "non suivi",
    oneOff: "Crédits seuls",
    refCode: "ref:{{code}}",
    chips: {
      paid: "Payé",
      signedUp: "Inscrit",
      spentCredits: "Crédits utilisés",
      remove: "Retirer le filtre {{label}}",
    },
    creditsAny: "Tous",
    titleWithCount: "Utilisateurs ({{count}})",
    loading: "Chargement des utilisateurs...",
    never: "Jamais",
    referredBy: "via {{email}}",
    actions: {
      open: "Ouvrir",
      select: "Sélectionner",
      openUser: "Ouvrir le compte de {{email}}",
      selectUser: "Sélectionner {{email}}",
      stats: "Rapport inscriptions",
      refresh: "Actualiser",
      newUser: "Nouvel utilisateur",
      clearFilters: "Effacer les filtres",
      moreFilters: "Filtres",
    },
    kpi: {
      activeSpentHint: "{{credits}} crédits dépensés en 30 jours",
      matchingHint:
        "Inscriptions par semaine, 12 dernières semaines complètes. Semaine passée : {{last}}, cette semaine pour l'instant : {{count}}",
      verified: "E-mail vérifié",
      verifiedHint: "{{count}} comptes",
      active: "Actifs 30 j",
      matching: "Utilisateurs correspondants",
      paying: "Payants",
      payingShare: "{{percent}} % des correspondants",
      revenue: "Revenu cumulé",
      revenueHint: "Paiements réussis, USD",
      credits: "Crédits détenus",
      creditsHint: "Somme des soldes de portefeuille",
    },
    quick: {
      freeBurn: "Conso gratuite {{min}}+ ({{count}})",
      banned: "Bannis ({{count}})",
      humans: "Humains seulement",
      paying: "Payants ({{count}})",
      free: "Jamais payé",
      activeWeek: "Actifs 7 j",
      dormant: "Inactifs 30 j+",
      never: "Jamais actifs",
    },
    columns: {
      flags: "Signaux",
      user: "Utilisateur",
      joined: "Inscrit",
      lastActive: "Dernière activité",
      credits: "Solde",
      spent: "Dépensé (total)",
      paid: "Payé",
      subscription: "Formule",
      source: "Source",
      id: "ID",
    },
    compact: {
      joined: "inscrit le {{date}}",
      active: "actif {{when}}",
      neverActive: "jamais actif",
      paid: "a payé {{amount}}",
      free: "jamais payé",
      spent: "{{count}} crédits dépensés",
    },
    flags: {
      freeBurn: "Conso gratuite",
      admin: "admin",
      banned: "Banni",
      unverified: "Non vérifié",
    },
    empty: {
      none: "Aucun utilisateur pour l'instant",
      filtered: "Aucun utilisateur ne correspond à ces filtres",
      filteredHint: "Assouplissez un filtre ou effacez-les tous.",
    },
    pagination: {
      previous: "Page précédente",
      next: "Page suivante",
      showing: "{{start}}-{{end}} sur {{total}}",
    },
    text: {
      subheader:
        "{{verified}} vérifiés | {{active}} actifs 30 j | {{banned}} bannis | inscriptions/semaine (12 sem.) : {{weekly}}",
      header:
        "{{total}} utilisateurs | {{paying}} payants | {{paid}} de revenu cumulé",
      pageHint: "Page {{page}}/{{pages}}. Suivante : --page={{next}}",
      detailHint: "Détails : vibe users-view --userId=<ID>",
    },
  },
};
