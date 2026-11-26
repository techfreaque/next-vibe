import { translations as analyticsTranslations } from "next-vibe/unified-ui/analytics/i18n/fr";

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  ...analyticsTranslations,
  category: "Système",

  errors: {
    repositoryInternalError: "Une erreur interne s'est produite",
    fetchErrorLogs:
      "Impossible de récupérer les journaux d'erreurs : {{error}}",
    updateErrorLog:
      "Impossible de mettre à jour le statut du journal d'erreurs : {{error}}",
    missingTarget: "Passez fingerprint ou id.",
    idNotUnique:
      "Le préfixe d'id {{id}} correspond à {{count}} lignes. Utilisez l'empreinte ou l'id complet.",
  },

  statusFilter: {
    all: "Tous",
    active: "Non résolues",
    resolved: "Résolus",
  },
  levelFilter: {
    all: "Tous niveaux",
    error: "Erreurs",
    warn: "Avertissements",
  },
  sourceFilter: {
    all: "Toutes sources",
    client: "Navigateur",
    server: "Serveur",
  },
  trendSplit: {
    newVsRecurring: "Nouvelles vs récurrentes",
    level: "Niveau",
    source: "Source",
  },
  sort: {
    windowOccurrences: "Plus d'occurrences sur la période",
    lastSeen: "Vu en dernier",
    firstSeen: "Plus récentes",
    totalOccurrences: "Plus d'occurrences au total",
  },

  get: {
    title: "Journaux d'erreurs",
    titleShort: "Journaux d'erreurs",
    description:
      "Classes d'erreurs avec le nombre exact de non résolues, les occurrences dans le temps, les pires coupables et les utilisateurs touchés. Filtrez par période, statut, niveau, source, endpoint ou texte ; résolvez en un clic.",
    tags: {
      monitoring: "Surveillance",
    },
    fields: {
      group: {
        label: "Regrouper les similaires",
        description:
          "Une ligne par message : les variantes sur différentes routes comptent ensemble",
      },
      status: {
        label: "Statut",
        description: "Filtrer par statut de résolution",
      },
      search: {
        label: "Rechercher une erreur",
        description:
          "Rechercher par message, empreinte ou identifiant du journal",
        placeholder:
          "Rechercher par message, empreinte ou identifiant du journal",
      },
      errorType: {
        label: "Type d'erreur",
        description: "Filtrer par type d'erreur",
        placeholder: "ex. INTERNAL_ERROR",
      },
      level: {
        label: "Niveau",
        description: "Erreurs ou avertissements",
      },
      source: {
        label: "Source",
        description: "Levée dans le navigateur (client log) ou sur le serveur",
      },
      endpoint: {
        label: "Endpoint ou route",
        description:
          "Le chemin d'endpoint, l'alias ou la route de page contient ce texte",
        placeholder: "ex. payment/providers",
      },
      fingerprint: {
        label: "Empreinte",
        description: "Afficher une seule classe d'erreur",
        placeholder: "Empreinte",
      },
      split: {
        label: "Découpage du graphique",
        description: "Comment le graphique des occurrences empile",
      },
      sort: {
        label: "Tri",
        description: "Ordre de la liste",
      },
      limit: {
        label: "Limite",
        description: "Nombre de résultats à renvoyer",
        placeholder: "50",
      },
      offset: {
        label: "Décalage",
        description: "Nombre de résultats à ignorer",
        placeholder: "0",
      },
    },
    response: {
      logs: {
        title: "Entrées du journal d'erreurs",
      },
      totalCount: {
        title: "Nombre total",
      },
      hasMore: {
        title: "Suite disponible",
      },
      unresolvedCount: {
        title: "Non résolues",
      },
      window: {
        title: "Période",
      },
      kpis: {
        title: "Chiffres clés",
      },
      trend: {
        title: "Occurrences dans le temps",
      },
      byEndpoint: {
        title: "Par endpoint",
      },
      historySince: {
        title: "Historique depuis",
      },
    },
    success: {
      title: "Journaux récupérés",
      description: "Les journaux d'erreurs ont été récupérés",
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Paramètres de requête invalides",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Authentification requise",
      },
      forbidden: {
        title: "Accès refusé",
        description: "Accès refusé",
      },
      notFound: {
        title: "Introuvable",
        description: "Aucun journal trouvé",
      },
      network: {
        title: "Erreur réseau",
        description: "Une erreur réseau s'est produite",
      },
      server: {
        title: "Erreur serveur",
        description: "Impossible de récupérer les journaux d'erreurs",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inconnue s'est produite",
      },
      unsavedChanges: {
        titleChanges: "Modifications non enregistrées",
        title: "Modifications non enregistrées",
        description: "Vous avez des modifications non enregistrées",
      },
      conflict: {
        title: "Conflit",
        description: "Un conflit de données s'est produit",
      },
    },
  },

  patch: {
    title: "Mettre à jour un journal d'erreurs",
    titleShort: "Mettre à jour le journal",
    description: "Résoudre ou rouvrir un journal d'erreurs par empreinte",
    tags: {
      monitoring: "Surveillance",
    },
    fields: {
      similarTo: {
        label: "Même message que",
        description:
          "Résoudre ou rouvrir chaque classe ayant le même message que cette empreinte",
      },
      fingerprints: {
        label: "Empreintes",
        description:
          "Plusieurs empreintes à la fois (résolution ou réouverture groupée, 200 max.)",
      },
      fingerprint: {
        label: "Empreinte",
        description:
          "L'empreinte du journal d'erreurs (colonne `fingerprint` de la liste). Passez-la, ou l'id.",
        placeholder: "Saisissez l'empreinte",
      },
      id: {
        label: "ID du journal",
        description:
          "L'id de la ligne dans la liste (uuid complet ou ses 8+ premiers caractères). À la place de l'empreinte.",
        placeholder: "ex. c21bd4c7",
      },
      resolved: {
        label: "Résolu",
        description: "true pour résoudre, false pour rouvrir",
      },
    },
    response: {
      fingerprint: {
        title: "Empreinte",
      },
      resolved: {
        title: "Résolu",
      },
      affectedRows: {
        title: "Lignes modifiées",
      },
    },
    success: {
      title: "Journal mis à jour",
      description: "Le statut du journal d'erreurs a été mis à jour",
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Paramètres de requête invalides",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Authentification requise",
      },
      forbidden: {
        title: "Accès refusé",
        description: "Accès refusé",
      },
      notFound: {
        title: "Introuvable",
        description: "Journal d'erreurs introuvable",
      },
      network: {
        title: "Erreur réseau",
        description: "Une erreur réseau s'est produite",
      },
      server: {
        title: "Erreur serveur",
        description: "Impossible de mettre à jour le journal d'erreurs",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inconnue s'est produite",
      },
      unsavedChanges: {
        titleChanges: "Modifications non enregistrées",
        title: "Modifications non enregistrées",
        description: "Vous avez des modifications non enregistrées",
      },
      conflict: {
        title: "Conflit",
        description: "Un conflit de données s'est produit",
      },
    },
  },

  post: {
    title: "Lancer une analyse du moniteur d'erreurs",
    description:
      "Analyser les messages de chat et les logs du backend à la recherche de motifs d'erreur",
    tags: {
      monitoring: "Surveillance",
    },
    response: {
      errorsFound: "Erreurs trouvées",
      threadsScanned: "Fils analysés",
      scanWindowFrom: "Début de la fenêtre d'analyse",
      scanWindowTo: "Fin de la fenêtre d'analyse",
      patterns: "Motifs d'erreur",
    },
    success: {
      title: "Analyse terminée",
      description: "L'analyse du moniteur d'erreurs est terminée",
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Requête invalide",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Authentification requise",
      },
      forbidden: {
        title: "Accès refusé",
        description: "Accès refusé",
      },
      notFound: {
        title: "Introuvable",
        description: "Ressource introuvable",
      },
      network: {
        title: "Erreur réseau",
        description: "Une erreur réseau s'est produite",
      },
      server: {
        title: "Erreur serveur",
        description: "Impossible de lancer l'analyse du moniteur d'erreurs",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inconnue s'est produite",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Vous avez des modifications non enregistrées",
      },
      conflict: {
        title: "Conflit",
        description: "Un conflit de données s'est produit",
      },
    },
  },

  errorMonitor: {
    name: "Moniteur d'erreurs",
    description: "Recherche des motifs d'erreur toutes les 3 heures",
  },

  widget: {
    kpi: {
      unresolvedInScope: "Non résolues dans cette vue",
      unresolvedAllTimeLink: "Non résolues depuis le début : {{count}}",
      unresolvedMessages: "{{messages}} messages · {{occurrences}} occurrences",
      unresolvedMatching: "{{count}} non résolues correspondent aux filtres",
      unresolved: "Classes non résolues (total)",
      unresolvedHint: "{{occurrences}} occurrences au total",
      unresolvedOutside: "{{count}} non vues sur cette période",
      occurrences: "Occurrences",
      newClasses: "Nouvelles classes",
      activeClasses: "Classes touchées",
      affectedUsers: "Utilisateurs touchés",
      affectedLeads: "Visiteurs touchés",
    },
    chart: {
      noEndpoint: "Aucun endpoint enregistré",
      emptyFiltered:
        "Aucune occurrence ne correspond à ces filtres sur cette période.",
      trendTitle: "Occurrences",
      trendSubtitle: "Cliquez une barre pour resserrer la période",
      endpointTitle: "Où ça casse",
      endpointSubtitle:
        "Endpoints et routes par occurrences. Cliquez une ligne pour filtrer.",
      endpoint: "Endpoint / route",
      occurrences: "Occurrences",
      classes: "Classes",
      unresolved: "Ouvertes",
      historyNote:
        "Historique quotidien depuis le {{date}}. Les occurrences antérieures ne comptent que dans les totaux.",
      historyNone:
        "Aucun historique quotidien pour l'instant. Les totaux par classe restent exacts.",
    },
    series: {
      new: "Nouvelles",
      recurring: "Récurrentes",
      error: "Erreurs",
      warn: "Avertissements",
      client: "Navigateur",
      server: "Serveur",
    },
    list: {
      viewGroup: "Voir {{count}}",
      noSession: "Sans contexte de session",
      cliAct:
        "action : vibe update-error-log --fingerprint={{fingerprint}} --resolved={{resolved}}",
      cliStatus: "Statut : {{status}}",
      groupSize: "{{count}} classes",
      resolveGroup: "Tout résoudre ({{count}})",
      reopenGroup: "Tout rouvrir ({{count}})",
      groupHint: "Regroupé par message",
      subtitleGrouped: "{{count}} messages vus sur cette période",
      bulkResolveOf: "Résoudre {{shown}} sur {{total}} correspondantes",
      cliGroup:
        '{{count}} classes. Lister : vibe error-logs --group=false --search="{{search}}" · Toutes : vibe update-error-log --similarTo={{fingerprint}} --resolved=true',
      allClear: "Rien d'ouvert ne correspond à ces filtres.",
      allClearHint: "Effacez les filtres pour voir le reste.",
      similar: "+{{count}} similaires",
      cliFilters:
        "Filtres (les valeurs sont les clés d'enum indiquées) : --range=analytics.range.last7Days --status=statusFilter.all --level=levelFilter.error --source=sourceFilter.server --endpoint=<texte> --search=<texte>. En lot : vibe update-error-log --fingerprints=<a>,<b> --resolved=true",
      more: "+{{count}} de plus",
      doneResolved: "Résolue : {{label}}",
      doneReopened: "Rouverte : {{label}}",
      doneResolvedMany: "{{count}} classes résolues",
      doneReopenedMany: "{{count}} classes rouvertes",
      undo: "Annuler",
      dismiss: "Masquer",
      bulkResolve: "Résoudre les {{count}} affichées",
      bulkConfirm: "Confirmer : résoudre {{count}}",
      cliHits: "{{period}} sur la période / {{total}} au total",
      resolveFailed: "Non enregistré. Réessayez.",
      cliResolve:
        "Action : vibe update-error-log --fingerprint={{fingerprint}} --resolved={{resolved}}",
      cliHint:
        "Résoudre : vibe update-error-log --fingerprint=<fingerprint> --resolved=true. Détail : --fingerprint=<fingerprint>. Page suivante : --offset={{next}}",
      title: "Classes d'erreurs",
      subtitle: "{{count}} vues sur cette période",
      hitsPeriod: "{{count}} sur la période",
      hitsTotal: "{{count}} au total",
      users: "Utilisateurs {{count}}",
      leads: "Visiteurs {{count}}",
      firstSeen: "première {{date}}",
      lastSeen: "dernière {{date}}",
      open: "Détails",
      close: "Masquer",
      focus: "Seulement celle-ci",
      affected: "Utilisateurs touchés",
      affectedLeads: "Visiteurs touchés",
      resolving: "Enregistrement...",
    },
    filter: {
      apply: "Appliquer les filtres",
      more: "Filtres",
      moreCount: "Filtres ({{count}})",
      moreDescription: "Filtrez par statut, gravité ou origine.",
      fingerprint: "Classe",
      endpoint: "Endpoint",
      search: "Recherche",
      errorType: "Type",
      status: "Statut",
      level: "Niveau",
      source: "Source",
    },
    emptyFiltered:
      "Aucun groupe ne correspond. Retirez un filtre et relancez la recherche.",
    emptyActive:
      "Aucun groupe actif. Choisissez « Tous » pour revoir les erreurs résolues.",
    severity: {
      error: "Erreur",
      warning: "Avertissement",
    },
    title: "Journaux d'erreurs",
    loading: "Chargement des journaux...",
    empty: "Aucun journal d'erreurs trouvé",
    header: {
      refresh: "Actualiser",
      runScan: "Lancer l'analyse",
      back: "Retour",
      activeCount: "{{count}} groupes ouverts au total",
    },
    col: {
      message: "Message",
      errorType: "Type d'erreur",
      occurrences: "Occurrences",
      firstSeen: "Première apparition",
      createdAt: "Dernière apparition",
    },
    status: {
      active: "Non résolues",
      resolved: "Résolue",
    },
    action: {
      confirm: "Enregistrer le statut",
      clear: "Effacer les filtres",
      resolve: "Résoudre",
      reopen: "Rouvrir",
    },
    detail: {
      context: "Contexte de l’erreur",
      stackTrace: "Pile d'appels",
      metadata: "Métadonnées",
      collapse: "Replier",
      resolved: "Résolue",
    },
    source: {
      client: "Navigateur",
      server: "Serveur",
    },
    pagination: {
      matches: "Groupes trouvés : {{count}}",
      info: "Page {{page}} sur {{totalPages}} ({{total}} au total)",
      prev: "Précédent",
      next: "Suivant",
    },
  },
};
