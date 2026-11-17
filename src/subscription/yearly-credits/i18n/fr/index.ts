import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Abonnements",
  tags: {
    subscription: "subscription",
    admin: "admin",
  },
  post: {
    title: "Formules annuelles : crédits mensuels",
    titleShort: "Crédits annuels",
    description:
      "Donne à chaque formule annuelle les crédits du mois en cours. Tourne chaque jour ; chaque mois est accordé une seule fois et expire à la fin du mois.",
    response: {
      scanned: "Formules annuelles vérifiées",
      granted: "Mois accordés maintenant",
      credits: "Crédits accordés",
    },
    widget: {
      hint: "Tourne chaque jour tout seul. Le lancer à la main est sans risque : aucun mois n'est accordé deux fois.",
      submit: "Accorder ce mois",
      summary:
        "{{scanned}} formules annuelles vérifiées, {{granted}} mois accordés, {{credits}} crédits",
    },
  },
  task: {
    description: "Accorde aux formules annuelles leurs crédits mensuels",
  },
  backfill: {
    title: "Formules annuelles : rattraper les mois manqués",
    titleShort: "Rattrapage annuel",
    description:
      "Mois de la période annuelle en cours passés sans crédits mensuels. Le test à blanc les liste ; sans lui, ils sont accordés une fois, en un seul pack valable jusqu'à la fin de la période.",
    fields: {
      dryRun: {
        label: "Test à blanc",
        description: "Lister sans rien accorder",
      },
    },
    response: {
      dryRun: "Test à blanc",
      subscriptions: "Abonnements",
      months: "Mois manqués",
      credits: "Crédits",
      rows: "Abonnements",
      subscriptionId: "Abonnement",
      userEmail: "Utilisateur",
      plan: "Formule",
      periodStart: "Début de période",
      periodEnd: "Fin de période",
      currentMonth: "Mois en cours",
      missedMonths: "Mois manqués",
      status: "Statut",
    },
    widget: {
      hint: "Vérifiez d'abord le test à blanc. L'octroi se fait une fois par abonnement et par période ; le relancer n'ajoute rien.",
      submit: "Lancer le rattrapage",
      preview:
        "Test à blanc : {{subscriptions}} abonnements, {{months}} mois manqués, {{credits}} crédits seraient accordés.",
      done: "Accordé : {{subscriptions}} abonnements, {{months}} mois, {{credits}} crédits.",
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
      description: "Seuls les admins accordent des crédits de formule",
    },
    notFound: {
      title: "Introuvable",
      description: "Ressource introuvable",
    },
    conflict: {
      title: "Conflit",
      description: "Les données ont changé entre-temps, relancez",
    },
    server: {
      title: "Erreur serveur",
      description: "Impossible d'accorder les crédits annuels",
      detail: "Échec des crédits annuels : {{error}}",
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
    title: "Terminé",
    description: "Crédits annuels traités",
  },
};
