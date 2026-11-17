import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  list: {
    title: "Leads capturés",
    titleShort: "Leads capturés",
    description:
      "Toutes les personnes qui ont rempli votre formulaire d'abonnement",
    tag: "lead-magnet-captures",
    response: {
      items: "Leads",
      total: "Total",
      page: "Page",
      pageSize: "Taille de page",
    },
    success: {
      title: "Leads chargés",
      description: "Vos leads capturés",
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Vérifiez votre saisie",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Connectez-vous pour continuer",
      },
      forbidden: { title: "Interdit", description: "Accès refusé" },
      notFound: { title: "Introuvable", description: "Aucun lead trouvé" },
      conflict: { title: "Conflit", description: "Un conflit est survenu" },
      network: {
        title: "Erreur réseau",
        description: "Une erreur réseau est survenue",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Vous avez des modifications non enregistrées",
      },
      internal: {
        title: "Erreur serveur",
        description: "Une erreur interne est survenue",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inconnue est survenue",
      },
    },
  },
  widget: {
    empty:
      "Aucun abonné pour l'instant. Partagez la page de votre compétence : chaque visite peut faire grandir votre liste.",
    exportCsv: "Exporter en CSV",
    columns: {
      date: "Date",
      name: "Nom",
      email: "E-mail",
      status: "Statut",
    },
    statusSuccess: "Capturé",
    statusFailed: "Échec",
  },
};
