import { translations as analyticsTranslations } from "next-vibe/unified-ui/analytics/i18n/fr";

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  ...analyticsTranslations,
  category: "Gestion des tâches",

  errors: {
    fetchCronTaskStats: "Impossible de charger l'état des tâches : {{error}}",
  },

  enums: {
    taskHealth: {
      stuck: "Bloquée",
      failing: "En échec",
      overdue: "En retard",
      flaky: "Instable",
      recovering: "En rétablissement",
      lowData: "Peu de données",
      running: "En cours",
      neverRan: "Jamais lancée",
      healthy: "Saine",
      disabled: "Désactivée",
    },
    healthFilter: {
      all: "Tous les états",
      attention: "À traiter",
    },
  },

  get: {
    title: "État des tâches",
    titleShort: "État des tâches",
    description:
      "L'état du cron d'un coup d'œil : tâches en échec, bloquées, en retard, désactivées et jamais lancées, volume d'exécutions, taux de réussite et durée dans le temps. Cliquez sur une tâche pour son historique.",
    tag: "État du cron",
    fields: {
      taskId: {
        title: "Tâche",
        description: "Limiter le rapport à un ID de tâche",
      },
      health: {
        title: "État",
        description:
          "N'afficher dans le tableau que les tâches dans cet état (la liste à traiter montre toujours toutes les tâches en échec, bloquées et en retard)",
      },
      includeDisabled: {
        title: "Inclure les tâches désactivées",
        description:
          "Compter les exécutions des tâches désactivées dans les indicateurs et graphiques de la période. Désactivé par défaut : les anciens échecs d'une tâche coupée ne disent rien de l'état actuel.",
      },
      days: {
        title: "Afficher les tableaux par jour",
        description:
          "Imprimer le détail par jour sous chaque graphique (CLI). Désactivé par défaut : les sparklines montrent déjà la tendance.",
      },
      includeParked: {
        title: "Afficher les tâches en veille",
        description:
          "Inclure les tâches ponctuelles terminées et les tâches désactivées jamais lancées. Masquées par défaut.",
      },
    },
    response: {
      generatedAt: { title: "État au" },
      window: { title: "Période" },
      summary: { title: "États des tâches maintenant" },
      kpis: { title: "Indicateurs d'exécution sur la période" },
      runsTrend: { title: "Exécutions dans le temps" },
      successTrend: { title: "Taux de réussite dans le temps" },
      durationTrend: { title: "Durée dans le temps" },
      attention: { title: "À traiter" },
      tasks: { title: "Tâches" },
      recentRuns: { title: "Dernières exécutions" },
      inFlight: { title: "Exécution en cours" },
      watchdog: { title: "État du watchdog" },
      failuresByTask: { title: "Échecs par tâche" },
      tasksWithFailures: { title: "Tâches avec échecs" },
      disabledIncluded: { title: "Tâches désactivées incluses" },
      taskOptions: { title: "Liste des tâches" },
    },
    errors: {
      server: {
        title: "Erreur serveur",
        description: "Impossible de charger l'état des tâches",
      },
      validation: {
        title: "Requête invalide",
        description: "Vérifiez la période et les filtres",
      },
      unauthorized: {
        title: "Non connecté",
        description: "Connectez-vous pour voir l'état des tâches",
      },
      forbidden: {
        title: "Accès refusé",
        description: "Vous n'avez pas accès à l'état des tâches",
      },
      notFound: {
        title: "Introuvable",
        description: "Aucune tâche avec cet ID",
      },
      conflict: {
        title: "Conflit",
        description: "La requête contredit l'état actuel",
      },
      network: {
        title: "Erreur réseau",
        description: "État des tâches injoignable",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Le chargement de l'état des tâches a échoué",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Enregistrez ou annulez d'abord vos modifications",
      },
    },
    success: {
      title: "État des tâches chargé",
      description: "Le rapport d'état des tâches est prêt",
    },
  },

  widget: {
    watchdogBanner:
      "Le watchdog des tâches est lui-même {{state}}. Les verdicts bloqué et en retard peuvent être périmés jusqu'à ce qu'il tourne de nouveau proprement.",
    inFlight: {
      title: "En cours",
      line: "Lancée il y a {{age}} · bloquée après {{limit}} (délai {{timeout}} + marge)",
      stuck: "au-delà de la limite du watchdog",
      run: "exécution",
      noRun: "aucune exécution enregistrée",
    },
    title: "État des tâches",
    viewTasks: "Tâches",
    viewHistory: "Historique",
    refresh: "Actualiser",
    now: "Maintenant",
    inPeriod: "Sur la période",
    allHealthy: "Les {{count}} tâches actives sont saines",
    tile: {
      failing: "En échec",
      failingHint: "Active, dernière exécution en échec",
      stuck: "Bloquées",
      stuckHint: "Dépasse son délai",
      overdue: "En retard",
      overdueHint: "Exécution planifiée manquée",
      flaky: "Instables",
      flakyHint: "Moins de 80 % de réussite sur la période",
      flakyRecovering: "{{count}} de plus en rétablissement",
      neverRan: "Jamais lancées",
      neverRanHint: "Active, jamais démarrée",
      disabled: "Désactivées",
      disabledHint: "Coupée, pas cassée",
      disabledOrphans: "{{count}} avec une exécution orpheline",
      parked: "En veille",
      parkedHint: "Ponctuelles et désactivées jamais lancées, masquées",
      parkedShownHint: "Ponctuelles et désactivées jamais lancées, affichées",
      lowData: "Peu de données",
      lowDataHint: "Échecs, moins de 3 exécutions terminées",
      timedOutExcluded: "Hors {{count}} exécutions en timeout",
      healthy: "Saines",
      healthyHint: "sur {{total}} actives",
      runs: "Exécutions",
      failedRuns: "Échecs",
      successRate: "Taux de réussite (des exécutions)",
      successRateHint: "Réussies parmi les exécutions terminées",
      tasksWithFailures: "Tâches avec échecs",
      tasksWithFailuresHint: "sur {{total}} tâches exécutées",
      completedOnly: "Exécutions réussies uniquement",
      noCompleted: "Aucune exécution réussie",
      recovering: "En rétablissement",
      recoveringHint: "De nouveau propre, 3 dernières exécutions réussies",
      stuckDisabled: "{{count}} sur une tâche désactivée",
      p50Duration: "Durée médiane",
      p95Duration: "Durée p95",
    },
    attention: {
      title: "À traiter",
      subtitle:
        "Tâches en échec, bloquées, instables et en retard. À corriger en premier.",
      empty: "Rien en échec, bloqué ou en retard.",
      lastError: "Dernière erreur",
      noError: "Aucun message d'erreur enregistré",
      failedAgo: "{{status}} il y a {{age}}",
      runningFor:
        "En cours depuis {{age}} · bloquée après {{limit}} (délai {{timeout}} + marge)",
      missed: "Prévue il y a {{due}}, dernière exécution {{last}}",
      lastNever: "jamais",
      lastAgo: "il y a {{age}}",
      streak: "{{count}} échecs d'affilée (au total)",
      failuresInPeriod: "{{count}} échecs sur la période",
      flakyDetail: "{{rate}} de réussite sur {{runs}} exécutions terminées",
      recoveringDetail:
        "{{count}} dernières exécutions réussies · {{rate}} de réussite sur {{runs}} exécutions terminées",
      neverCompleted: "aucune exécution terminée",
      disabledToo: "désactivée",
      openFailures: "Échecs",
      openRuns: "Toutes les exécutions",
      openRunning: "Exécution en cours",
      orphaned: "exécution orpheline, tâche désactivée",
    },
    chart: {
      runs: "Exécutions",
      runsSubtitle:
        "Cliquez sur une barre pour voir les exécutions de la période",
      completed: "Réussies",
      failed: "Échouées",
      other: "Autres",
      successRate: "Taux de réussite",
      successRateSubtitle:
        "Réussies parmi les exécutions terminées. Les jours sans exécution restent vides.",
      duration: "Durée",
      durationSubtitle:
        "Médiane et p95 des exécutions réussies. Les jours sans exécution restent vides.",
      durationSplitSubtitle:
        "Exécutions réussies uniquement. Les jours sans exécution restent vides.",
      byTask: "Échecs par tâche",
      byTaskSubtitle: "Top 5 des tâches, le reste regroupé",
      otherTasks: "Autres tâches",
      p50: "Médiane",
      p95: "p95",
    },
    table: {
      title: "Par tâche",
      subtitle:
        "Les plus urgentes en premier. Cliquez sur une tâche pour son historique.",
      dimension: "Tâche",
      runs: "Exécutions",
      failures: "Échecs",
      successRate: "Réussite",
      p50: "Médiane",
      lastRun: "Dernière",
      p95: "p95",
      trendCol: "Tendance de réussite",
      state: "État",
      nextRun: "Prochaine",
      orphaned: "exécution orpheline, lancée il y a {{age}}",
      oneOff: "ponctuelle",
      last: "Dernière {{status}} il y a {{age}}",
      lastNever: "Jamais lancée",
      next: "prochaine dans {{age}}",
      nextNone: "pas de prochaine exécution",
      runningTooLong: "tourne trop longtemps",
      skippedHint: "ignorée : crédits insuffisants",
      failedCount: "{{count}} en échec",
      lastLine: "Dernière : {{last}} · {{next}}",
      blocked: "bloquée par l'exécution en cours",
      trend: "réussite",
      nextNow: "imminente",
      empty: "Aucune tâche dans cet état.",
    },
    filter: {
      task: "Tâche",
      state: "État",
      allTasks: "Toutes les tâches",
      includeDisabled: "Inclure les désactivées",
      scopeEnabled: "Tâches actives uniquement",
      scopeAll: "Désactivées incluses",
    },
    cli: {
      states: "États",
      state: "État",
      runId: "exécution",
      trendHeader: "PÉRIODE | TERMINÉES | RÉUSSITE | MÉDIANE | P95",
      attention: "À TRAITER",
      noAttention: "À traiter : rien",
      daysHint: "Tableaux par jour : --days=true",
      drillRunning:
        "Ouvrir l'exécution en cours : vibe cron-history --taskId={{id}} --status=status.running",
      byDay: "par jour",
      runningOnTime: "En cours dans les délais",
      scope:
        "Indicateurs de la période : tâches actives uniquement. Inclure les désactivées : --includeDisabled=true",
      parkedHidden:
        "{{count}} tâches en veille masquées (ponctuelles terminées, désactivées jamais lancées). Les afficher : --includeParked=true",
      recentRuns: "{{count}} dernières exécutions",
      noRuns: "Aucune exécution enregistrée",
      tasks: "Tâches",
      header:
        "ÉTAT | TÂCHE | EXÉCUTIONS | ÉCHECS | RÉUSSITE | MÉDIANE | P95 | DERNIÈRE | PROCHAINE",
      drill:
        "Détail : vibe cron-history --taskId=<id> --status=status.failed,status.error,status.timeout",
    },
    age: {
      justNow: "à l'instant",
      seconds: "{{n}} s",
      minutes: "{{n}} min",
      hours: "{{n}} h",
      days: "{{n}} j",
    },
  },
};
