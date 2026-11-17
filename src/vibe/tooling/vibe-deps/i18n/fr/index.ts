import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Vibe Deps",
  titleShort: "Deps",
  description:
    "Analyseur de dépendances tout-en-un. Cartographie le graphe d'imports de toute la codebase et fait respecter les frontières des packages. --mode=files / categories / unused pour le graphe d'imports et le code mort. --mode=boundaries montre chaque import d'un package vers le code applicatif (les déplacements à faire avant l'extraction). --mode=layers signale les directions illégales entre packages. --mode=shared-candidates classe les primitives applicatives dont les packages dépendent déjà. --mode=importers --focus=X ventile les importeurs d'un fichier par package.",
  category: "Outils de développement",
  tag: "analyse",

  mode: {
    report: "Rapport",
    files: "Fichiers",
    categories: "Catégories",
    unused: "Inutilisés",
    boundaries: "Frontières",
    layers: "Couches",
    sharedCandidates: "Candidats partagés",
    importers: "Importeurs",
    needsMove: "À déplacer",
    unusedSymbols: "Symboles inutilisés",
    unusedI18n: "Clés i18n inutilisées",
    crossDomain: "Inter-domaines",
    pageViolations: "Violations de pages",
  },

  container: {
    title: "Analyse des dépendances",
    description: "Définir la portée et le mode de l'analyse des dépendances",
  },

  fields: {
    focus: {
      label: "Chemin ciblé",
      description:
        "Restreindre à un fichier ou répertoire précis (ex. 'agent/ai-stream' ou 'user'). Laissez vide pour analyser toute la codebase.",
      placeholder: "ex. agent/ai-stream ou user",
    },
    mode: {
      label: "Mode",
      description:
        "files : graphe d'imports par fichier. categories : agrégé par répertoire de premier niveau. unused : fichiers sans importeur. boundaries : imports des packages vers le code applicatif. layers : directions illégales entre packages. shared-candidates : primitives applicatives dont dépendent les packages. importers : importeurs d'un fichier par package (exige --focus).",
    },
    package: {
      label: "Package",
      description:
        "Restreindre boundaries/layers à un seul package déclaré (ex. vibe-ui, vibe-unified-ui). Laissez vide pour tous les packages.",
      placeholder: "ex. vibe-unified-ui",
    },
    depth: {
      label: "Profondeur",
      description:
        "Nombre de niveaux de dépendances transitives à inclure (par défaut : 1, directes uniquement). 0 = illimité.",
    },
    limit: {
      label: "Limite",
      description: "Nombre maximal d'entrées renvoyées (par défaut : 100).",
    },
  },

  response: {
    success: "Analyse des dépendances terminée",
    entries: {
      title: "Entrées de dépendances",
      emptyState: {
        description: "Aucun fichier ne correspond au filtre.",
      },
      importedBy: "importé par",
    },
    summary: {
      title: "Résumé",
      totalFiles: "Fichiers analysés",
      totalEdges: "Arêtes d'import",
      unusedCount: "Exports inutilisés",
    },
    boundaries: {
      title: "Frontières des packages",
      cleanState: "Aucune violation de frontière. Les packages sont autonomes.",
      legendTitle: "Légende",
      legendOut: "hors package (le package puise dans le code applicatif)",
      legendCross: "inter-packages (dépendance illégale)",
      legendReverse:
        "direction inversée (une couche basse importe une couche haute)",
      legendHot:
        "cible chaude (10+ importeurs : candidate prioritaire pour le core)",
      colTarget: "cible",
      colCount: "usages",
      colKind: "type",
      packageHeader: "package",
      violationsAcross: "violations dans",
      packagesWord: "packages",
    },
    layers: {
      title: "Direction des couches",
      cleanState: "Direction propre. Aucun import illégal entre packages.",
      edge: "importe",
    },
    sharedCandidates: {
      title: "Candidats partagés",
      description:
        "Fichiers du code applicatif importés par des packages, classés par nombre de packages importeurs. Élevé = à intégrer dans vibe-core.",
      colCount: "usages pkg",
      colPath: "chemin",
      emptyState:
        "Aucun fichier applicatif n'est importé par du code de package.",
    },
    importers: {
      title: "Importeurs par package",
      colCount: "usages",
      colGroup: "package / catégorie",
    },
    needsMove: {
      title: "Liste des déplacements",
      description:
        "Fichiers pas encore à leur emplacement final, groupés par zone de destination. Les fichiers en liste blanche (déjà placés) ne sont pas affichés. Lisez de haut en bas : c'est l'ordre des déplacements.",
      colTarget: "→ zone",
      colPath: "fichier",
      emptyState: "Tout est en place dans la portée. Rien à déplacer.",
      relocate: "déplacer",
      reorganize: "réorg",
    },
    unusedSymbols: {
      title: "Surface publique inutilisée",
      description:
        "Exports morts, méthodes statiques inutilisées et fichiers sans importeur. Signaux basés sur des regex, à vérifier : approche prudente (peut manquer des usages dynamiques).",
      colKind: "type",
      colSymbol: "symbole",
      colPath: "fichier",
      emptyState: "Aucune surface publique inutilisée dans la portée.",
      wholeFile: "(fichier entier : aucun importeur)",
    },
    unusedI18n: {
      title: "Clés i18n inutilisées",
      description:
        "Clés des traductions en scopées qu'aucun fichier source ne référence. Les préfixes de template comme t(`a.b.<x>`) protègent leur sous-arbre. Supprimez-les en même temps dans en, de et pl.",
      colKey: "clé",
      colPath: "fichier",
      emptyState:
        "Toutes les clés de traduction de la portée sont référencées.",
    },
    pageViolations: {
      title: "Violations de l'architecture des pages",
      description:
        "Fichiers page.tsx qui importent plus que repository/definition/i18n/page-client. Les pages doivent rester de fines coquilles SSR : la logique métier, l'UI, les enums et l'accès à la base vont dans repository.ts ou page-client.tsx.",
      colCount: "violations",
      colPath: "page",
      emptyState:
        "Tous les fichiers page.tsx respectent la frontière d'architecture.",
    },
    crossDomain: {
      title: "Candidats inter-domaines",
      description:
        "Imports qui franchissent une frontière de domaine sans être une primitive de framework autorisée. Chacun est candidat à une promotion dans vibe (engine/core) ou à un découplage. Les plus sollicités d'abord. Les arêtes vers des primitives autorisées sont comptées à part, pas masquées.",
      colCount: "usages",
      colTarget: "cible sollicitée",
      emptyState:
        "Aucune arête inter-domaines non vérifiée. Tout ce qui traverse est autorisé.",
      allowedTally: "arêtes vers des primitives autorisées (non listées)",
    },
    violations: {
      title: "Violations",
      outOfPackage: "Hors package",
      crossPackage: "Inter-packages",
      reverseDirection: "Direction inversée",
      total: "Total",
    },
  },

  errors: {
    validation: {
      title: "Paramètres invalides",
      description: "Les paramètres de l'analyse des dépendances sont invalides",
    },
    internal: {
      title: "Erreur interne",
      description:
        "Une erreur interne s'est produite pendant l'analyse des dépendances",
    },
    unauthorized: {
      title: "Non autorisé",
      description:
        "Vous n'avez pas la permission de lancer l'analyse des dépendances",
    },
    forbidden: {
      title: "Interdit",
      description: "L'accès à l'analyse des dépendances est interdit",
    },
    notFound: {
      title: "Introuvable",
      description: "Le chemin ciblé est introuvable",
    },
    focusNotFound: "Aucun fichier ne correspond au chemin ciblé {{focus}}",
    server: {
      title: "Erreur serveur",
      description:
        "Une erreur serveur s'est produite pendant l'analyse des dépendances",
    },
    unknown: {
      title: "Erreur inconnue",
      description:
        "Une erreur inconnue s'est produite pendant l'analyse des dépendances",
    },
    unsaved: {
      title: "Modifications non enregistrées",
      description: "Vous avez des modifications non enregistrées",
    },
    conflict: {
      title: "Conflit",
      description: "Un conflit s'est produit pendant l'analyse des dépendances",
    },
  },

  success: {
    title: "Analyse terminée",
    description: "Analyse des dépendances terminée",
  },
};
