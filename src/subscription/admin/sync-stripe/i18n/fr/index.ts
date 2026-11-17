import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  post: {
    title: "Synchroniser les abonnements depuis Stripe",
    titleShort: "Synchro Stripe",
    description:
      "Récupère depuis Stripe le statut, la période de facturation et les champs d'annulation dans nos lignes d'abonnement. Fait expirer les anciennes lignes sans id Stripe dont la période est terminée. N'attribue ni ne retire jamais de crédits. Simulation par défaut.",
    fields: {
      subscriptionId: {
        label: "Abonnement",
        description:
          "Notre id d'abonnement (uuid) ou l'id d'abonnement Stripe (sub_...). Laisser vide avec « Tous » activé.",
        placeholder: "sub_... ou uuid d'abonnement",
      },
      all: {
        label: "Tous",
        description:
          "Vérifier tous les abonnements qui ne sont pas déjà annulés ou expirés.",
      },
      dryRun: {
        label: "Simulation",
        description: "Prévisualiser les changements sans rien écrire.",
      },
    },
    response: {
      dryRun: "Simulation",
      scanned: "Vérifiés",
      changed: "Modifiés",
      failed: "Échoués",
      items: "Abonnements",
      item: {
        subscriptionId: "Abonnement",
        userEmail: "Utilisateur",
        providerSubscriptionId: "Id Stripe",
        action: "Action",
        statusBefore: "Statut avant",
        statusAfter: "Statut après",
        periodEndBefore: "Fin de période avant",
        periodEndAfter: "Fin de période après",
        note: "Note",
      },
    },
    errors: {
      unauthorized: {
        title: "Non autorisé",
        description: "Connexion requise",
      },
      validation: {
        title: "Cible manquante",
        description: "Indiquez un id d'abonnement, un id Stripe ou all=true.",
      },
      forbidden: {
        title: "Interdit",
        description: "Accès admin requis",
      },
      server: {
        title: "Échec de la synchro",
        description: "Impossible de synchroniser les abonnements depuis Stripe",
        detail: "La synchronisation des abonnements a échoué : {{error}}",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Erreur inattendue pendant la synchro",
      },
      conflict: {
        title: "Conflit",
        description: "L'abonnement a changé pendant la synchro",
      },
      network: {
        title: "Erreur réseau",
        description: "Impossible de joindre Stripe",
      },
      notFound: {
        title: "Introuvable",
        description: "Aucun abonnement ne correspond à cet id",
        detail: "Aucun abonnement ne correspond à {{id}}",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Lancez ou abandonnez d'abord la synchro en attente",
      },
      notConfigured: "Stripe n'est pas configuré sur cette instance.",
    },
    success: {
      title: "Synchro terminée",
      description: "Abonnements vérifiés auprès de Stripe",
    },
    notes: {
      keptCanceled:
        "Stripe indique {{stripeStatus}} ; conservé comme annulé (un abonnement annulé n'est jamais rétrogradé).",
      missingInStripe:
        "Introuvable dans Stripe ; marqué comme annulé et id Stripe effacé.",
      expiredLegacy:
        "Pas d'id Stripe et période terminée le {{date}} ; marqué comme annulé.",
      noStripeIdActivePeriod:
        "Pas d'id Stripe, période toujours en cours ; laissé tel quel.",
      notStripe: "Le prestataire n'est pas Stripe ; ignoré.",
      stripeError: "Erreur Stripe : {{error}}",
    },
    widget: {
      submit: "Lancer la synchro",
      submitting: "Synchronisation...",
      preview: "Aperçu : rien n'a été écrit",
      applied: "Appliqué",
      empty: "Rien à synchroniser.",
      none: "aucun",
    },
  },
  enums: {
    action: {
      updated: "Mis à jour",
      unchanged: "Synchronisé",
      expired: "Expiré",
      missingInStripe: "Absent de Stripe",
      skipped: "Ignoré",
      error: "Erreur",
    },
  },
};
