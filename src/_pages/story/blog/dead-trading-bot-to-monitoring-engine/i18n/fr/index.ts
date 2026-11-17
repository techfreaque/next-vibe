import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title:
      "Mon bot de trading abandonné est devenu un moteur de monitoring de plateforme | next-vibe",
    description:
      "J'ai abandonné un bot de trading il y a des années. Puis j'ai compris que son architecture (DataSource, Indicator, Evaluator, Action) s'applique à n'importe quelle activité. Alors je l'ai reconstruit dans next-vibe. Chaque nœud est un endpoint.",
    category: "Vibe Sense",
    imageAlt: "Pipeline de monitoring Vibe Sense, next-vibe",
    keywords:
      "vibe sense, monitoring, supervision, bot de trading, endpoints, EMA, pipeline, next-vibe, TypeScript",
    ogTitle:
      "Mon bot de trading abandonné est devenu un moteur de monitoring de plateforme",
    ogDescription:
      "Le bot de trading avait la bonne architecture. C'est l'endroit où je l'avais construit qui n'allait pas.",
    twitterTitle:
      "Bot de trading abandonné → moteur de monitoring en production",
    twitterDescription:
      "Chaque nœud est un endpoint. Le pipeline, ce sont juste des endpoints qui appellent des endpoints.",
  },
  backToBlog: "Retour au blog",
  hero: {
    eyebrow: "Vibe Sense",
    title: "Votre plateforme qui se surveille elle-même.",
    subtitle:
      "J'ai abandonné un bot de trading il y a des années. Son architecture est devenue la partie la plus intéressante de next-vibe. Chaque nœud du graphe est un endpoint : appelable depuis la CLI, découvrable par l'IA, branché sur votre plateforme.",
    readTime: "14 min de lecture",
  },
  origin: {
    title: "Le bot de trading que j'ai abandonné",
    paragraph1:
      "Il y a quelques années, j'ai forké OctoBot et construit quelque chose que j'ai appelé Octane. Backend Python, frontend React. On pouvait glisser des indicateurs techniques sur un canevas, enchaîner des évaluateurs, configurer des règles d'exécution, créer des alertes, passer des ordres. Un vrai constructeur visuel de stratégies. Je m'en sers encore pour mon propre portefeuille.",
    paragraph2:
      "Je l'ai abandonné en tant que base de code. Le Python partait dans tous les sens, l'architecture avait accumulé assez de dette pour que chaque modification paraisse coûteuse, et j'avais d'autres choses à construire.",
    paragraph3:
      "Mais j'y repensais sans cesse. Surtout à ce qui le faisait fonctionner en tant que système.",
    quoteText:
      "Le bot de trading avait la bonne architecture. Mon erreur, c'était de l'avoir construit en vase clos.",
    timeline: {
      octane: {
        label: "Octane (fork d'OctoBot)",
        description:
          "Constructeur visuel de stratégies, indicateurs en glisser-déposer, backend Python. Abandonné en tant que base de code.",
      },
      insight: {
        label: "Le déclic",
        description:
          "Cette structure ne décrit pas le trading. Elle décrit n'importe quel processus métier avec des données dans le temps.",
      },
      rebuilt: {
        label: "Reconstruit dans next-vibe",
        description:
          "Typé proprement. Chaque nœud est un endpoint standard. Accessible partout où la plateforme l'est.",
      },
    },
  },
  insight: {
    title: "Toute activité est une série temporelle",
    intro:
      "Dans un bot de trading, les briques sont simples. Une source de données : prix, volume, ce que vous lisez. Un indicateur : moyenne mobile, RSI, MACD, qui transforme les données brutes en signal dérivé. Un évaluateur : la moyenne mobile rapide est-elle au-dessus de la lente ? Une condition booléenne. Une action : quand l'évaluateur se déclenche, on fait quelque chose.",
    realization:
      "Cette structure ne décrit pas le trading. Elle décrit n'importe quel processus métier où vous avez des données dans le temps, des conditions qui comptent pour vous, et des actions à lancer quand ces conditions sont remplies.",
    examples: {
      userGrowth: {
        label: "Croissance des utilisateurs",
        description:
          "C'est une série temporelle. Est-elle en baisse ? C'est un évaluateur. Envoyer une campagne de reconquête ? C'est une action.",
      },
      emailHealth: {
        label: "Santé des campagnes e-mail",
        description:
          "Taux d'ouverture, de rebond, de désinscription. Que des séries temporelles. Que des conditions évaluables. Toutes déclenchables.",
      },
      creditEconomy: {
        label: "Économie des crédits",
        description:
          "Vitesse de dépense. Rythme de consommation face au rythme d'achat. Tout ça.",
      },
      revenueAnomaly: {
        label: "Anomalies de revenus",
        description:
          "Le taux de remboursement dépasse 20 % en une journée : Thea est prévenue avant que vous ne le voyiez sur un tableau de bord.",
      },
    },
  },
  architecture: {
    title: "Les quatre types de nœuds",
    subtitle:
      "Trois types de nœuds à comprendre pour lire n'importe quel graphe. Plus un quatrième qui boucle la boucle.",
    dataSource: {
      label: "DataSource",
      description:
        "Un endpoint propre à un domaine qui interroge votre base de données et renvoie { timestamp, value }[] pour une plage de temps et une résolution données. Il vit avec son domaine. Il connaît son propre schéma.",
    },
    indicator: {
      label: "Indicator",
      description:
        "Un endpoint de calcul pur et réutilisable : EMA, RSI, MACD, bandes de Bollinger, clamp, delta, moyenne glissante. Pas de SQL. Aucune connaissance métier. Appelez-le sur n'importe quelle source de données.",
    },
    evaluator: {
      label: "Evaluator",
      description:
        "Un seuil ou une condition. Il prend une série et pose une question. Cette valeur est-elle sous 0,7 ? Ce ratio a-t-il dépassé 20 % ? Il produit un signal : déclenché ou non.",
    },
    action: {
      label: "Action",
      description:
        "Quand l'évaluateur en amont se déclenche, un endpoint précis est appelé. Dans le même processus. Sans HTTP. Même validation, même authentification, même type de réponse que n'importe quel autre appel du système.",
    },
    connector: "alimente",
  },
  unified: {
    title: "Chaque nœud est un endpoint",
    intro:
      "Voici le point que je veux faire passer tout de suite, avant d'aller plus loin.",
    oldApproach: {
      label: "Ancienne approche (Octane)",
      description:
        "L'EMA n'existe que comme nœud dans un graphe. Impossible de l'appeler depuis la CLI. Elle n'apparaît pas comme outil pour l'IA. C'est un détail d'implémentation privé.",
    },
    newApproach: {
      label: "L'approche next-vibe",
      description:
        "Chaque nœud Vibe Sense est un endpoint standard, défini avec createEndpoint(), enregistré dans le même registre d'endpoints que tout le reste de la plateforme.",
    },
    cliCaption:
      "Le même endpoint EMA qui tournait comme nœud dans le graphe du funnel de leads (même définition, même validation, même authentification) s'appelle seul depuis la CLI.",
    insight:
      "Le MÊME endpoint qui sert de nœud dans votre graphe de funnel de leads est aussi un outil autonome sur 13 plateformes.",
    keyLine:
      "Le pipeline, ce sont juste des endpoints qui appellent des endpoints.",
  },
  actionCallout: {
    title: "Mais les actions ne sont pas des ordres de bourse",
    body: "Quand un signal se déclenche, le moteur appelle n'importe quel endpoint. Dans le même processus. Sans aller-retour HTTP. Une alerte. Le lancement d'une campagne. Une escalade vers l'IA avec un contexte pré-rempli. Thea est prévenue. Une séquence de reconquête démarre. Tout ce qui est branché sur cet évaluateur.",
    noWebhook: "Pas de webhook.",
    noAlerting: "Pas de service d'alerte maison.",
    noZapier: "Pas de Zapier.",
    punchline: "La plateforme s'appelle elle-même.",
    examples: {
      alert: {
        label: "Alerte",
        description:
          "Appel de complete-task : Thea le prend en charge immédiatement.",
      },
      campaign: {
        label: "Campagne",
        description:
          "Lancer une séquence de conversion quand la vitesse d'arrivée des leads franchit un seuil.",
      },
      ai: {
        label: "Escalade vers l'IA",
        description:
          "Lancer une exécution IA avec un contexte pré-rempli sur le signal qui l'a déclenchée.",
      },
    },
  },
  funnel: {
    title: "Parcourir le graphe du funnel de leads",
    subtitle:
      "Voici le Lead Acquisition Funnel. Il tourne toutes les six heures. Suivons-le de haut en bas.",
    column1: {
      label: "Colonne 1 : sources de données",
      description:
        "De vrais endpoints. Chacun vit dans leads/data-sources/. Ils acceptent une plage de temps et une résolution, exécutent leur requête SQL et renvoient { timestamp, value }[].",
      nodes: {
        created: {
          name: "leads.created",
          description:
            "Interroge les leads par created_at. Données éparses : une heure sans nouveau lead ne produit aucun point.",
        },
        converted: {
          name: "leads.converted",
          description:
            "Groupé par converted_at, compte les leads arrivés au statut SIGNED_UP.",
        },
        bounced: {
          name: "leads.bounced",
          description: "Leads dont l'e-mail a rebondi, par tranche de temps.",
        },
        active: {
          name: "leads.active",
          description:
            "Indicateur instantané en résolution ONE_DAY. Compte le total des leads qui ne sont pas dans un état final.",
        },
      },
    },
    column2: {
      label: "Colonne 2 : indicateurs",
      description:
        'Du calcul pur. L\'endpoint EMA vit dans analytics/indicators/ema. Sa config de graphe se résume à { type: "indicator", indicatorId: "ema", params: { period: 7 } }.',
      nodes: {
        ema7: {
          name: "leads_created_ema7",
          description:
            "Indicateur EMA, period=7. Étend automatiquement la plage récupérée en amont pour la période de chauffe.",
        },
        conversionRate: {
          name: "conversion_rate",
          description:
            "Transformateur : divise leads.converted par leads.created pour chaque tranche de temps. Borné entre 0 et 1.",
        },
      },
    },
    column3: {
      label: "Colonne 3 : évaluateurs",
      description:
        "Des conditions de seuil. Chacune produit un signal : déclenché ou non.",
      nodes: {
        leadDrop: {
          name: "eval_lead_drop",
          description:
            "EMA(7) < 0.7 en résolution ONE_WEEK. La vitesse de création de leads, lissée sur 7 périodes, tombe sous 70 %.",
        },
        zeroLeads: {
          name: "eval_zero_leads",
          description:
            "leads.created < 1/jour. Une journée entière passe sans aucun nouveau lead.",
        },
        lowConversion: {
          name: "eval_low_conversion",
          description:
            "conversion_rate < 5 %/semaine. La conversion du funnel passe sous 5 %.",
        },
      },
    },
  },
  domainOwned: {
    title: "Des sources de données propres à chaque domaine",
    subtitle:
      "Un des choix d'architecture dont je suis le plus satisfait : les sources de données vivent avec leur domaine, pas dans un répertoire central vibe-sense/.",
    leadsLabel: "Domaine leads",
    leadsCount: "... 15 sources de données au total",
    creditsLabel: "Domaine crédits",
    creditsCount: "... 17 sources de données au total",
    explanation:
      "leads/data-sources/leads-created connaît la table leads. Il importe depuis leads/db. Il utilise LeadStatus depuis leads/enum. Si vous supprimez le module leads, ses sources de données partent avec lui. Rien d'orphelin.",
    indicators: {
      label: "Les indicateurs dans analytics/indicators/",
      description:
        "Du calcul pur : EMA, RSI, MACD, bandes de Bollinger, clamp, delta, moyenne glissante. Aucune connaissance métier. Appelez-les sur n'importe quelle source de données.",
    },
    registration:
      "Au démarrage, le registre d'indicateurs découvre automatiquement les deux. Les endpoints de sources de données s'enregistrent comme définitions de nœuds. Les endpoints d'indicateurs aussi. Vous ajoutez un domaine, vous ajoutez des endpoints data-sources/, vous exportez des graphSeeds. Ils apparaissent.",
    keyLine: "Le domaine gère sa propre observabilité.",
  },
  safety: {
    title: "Versionnage, backtest, persistance",
    subtitle:
      "Trois éléments qui permettent de faire tourner Vibe Sense en production sans risque.",
    versioning: {
      label: "Versionnage",
      description:
        "Les graphes sont versionnés. Modifier un graphe crée une nouvelle version, jamais de modification de la version active. La nouvelle version est un brouillon. Vous la promouvez explicitement. Le retour arrière est trivial.",
    },
    backtest: {
      label: "Backtest",
      description:
        "Avant de promouvoir, vous pouvez lancer un backtest sur une période historique. Les conditions sont évaluées. Les signaux sont enregistrés. Les endpoints ne sont jamais appelés. Vanne fermée.",
    },
    persist: {
      label: "Modes de persistance",
      always: {
        label: "always",
        description:
          "Chaque point calculé est écrit dans le stockage des datapoints. Pour les indicateurs basés sur des événements : leads créés par minute, crédits dépensés par minute.",
      },
      snapshot: {
        label: "snapshot",
        description:
          "Calculé à la demande, mis en cache, mais pas stocké dans la table principale. Totaux journaliers, compteurs cumulés.",
      },
      never: {
        label: "never",
        description:
          "Toujours recalculé à la volée à partir des entrées. Sorties d'EMA, ratios : aucun coût de stockage. Historique étendu automatiquement pour la période de chauffe.",
      },
    },
  },
  ships: {
    title: "Ce qui est livré, ce qui arrive",
    prodReady: {
      label: "Prêt pour la production aujourd'hui",
      items: {
        engine:
          "Moteur complet : endpoints de sources de données, endpoints d'indicateurs (EMA, RSI, MACD, Bollinger, clamp, delta, window), évaluateurs de seuil, nœuds de transformation, nœuds d'action sur endpoint.",
        execution:
          "Exécution topologique via un parcours de graphe. Prise en charge multi-résolution avec changement d'échelle automatique. Extension de plage qui tient compte de l'historique nécessaire.",
        versioning:
          "Versionnage, mode backtest avec historique complet des exécutions, persistance des signaux comme piste d'audit.",
        cli: "Accès CLI : vibe vibe-sense-ema, vibe vibe-sense-rsi, n'importe quel endpoint d'indicateur, appelable seul.",
        mcp: "Enregistrement MCP : les endpoints d'indicateurs apparaissent dans la liste des outils. Thea peut appeler les indicateurs directement.",
        seeds:
          "Graphes de départ : 29 graphes sur 9 domaines (leads, crédits, utilisateurs, abonnements, parrainages, newsletters, paiements, messagerie, chat IA et santé du système). Tous tournent dès le départ avec vibe dev.",
      },
    },
    coming: {
      label: "Prochaine étape",
      items: {
        builder:
          "Constructeur visuel de graphes en glisser-déposer. Le moteur est entièrement construit. L'éditeur de canevas, c'est le prochain chapitre.",
        trading:
          "Endpoints de trading. Endpoints de sources de prix, endpoints d'API d'échange, exécution d'ordres branchée comme nœuds d'endpoint. Un graphe de trading n'est qu'un graphe de plus.",
        marketplace:
          "Marketplace de stratégies. Dès qu'on peut construire des graphes visuellement, on peut les partager. Importez une stratégie de suivi des leads toute prête. Forkez-la, modifiez-la.",
      },
    },
  },
  vision: {
    title: "Ce que c'est vraiment",
    paragraph1:
      "Tout processus métier qui se décrit comme « avec ces données, quand ces conditions sont remplies, fais ceci » est un graphe Vibe Sense. Du monitoring, oui. De l'alerte, oui. Mais aussi : qualification automatique des leads, détection d'anomalies de revenus, équilibrage de l'économie des crédits, automatisation marketing.",
    paragraph2:
      "Le bot de trading avait la bonne architecture. Indicateurs, évaluateurs, actions, mode backtest. Mon erreur, c'était de l'avoir construit en vase clos. Dans Octane, l'EMA était enfermée dans le pipeline. Dans next-vibe, l'EMA est un endpoint à part entière.",
    keyLine:
      "Vous ne construisez pas un système de monitoring. Vous construisez votre plateforme. Le système de monitoring est déjà là.",
    closeTagline:
      "Définissez-le une fois. Il existe partout. Le pipeline, ce sont juste des endpoints qui appellent des endpoints.",
    cta: {
      primary: "Voir sur GitHub",
      secondary: "Retour au blog",
    },
    quickstart: {
      label: "Démarrage rapide",
      description:
        "vibe dev lance PostgreSQL dans Docker, exécute les migrations, insère les données de départ, crée les graphes Vibe Sense, remplit 365 jours d'historique et démarre le serveur de dev. Ouvrez localhost:3000. Les graphes tournent.",
    },
  },
  ui: {
    emaFunctionLabel: "computeEma()",
  },
};
