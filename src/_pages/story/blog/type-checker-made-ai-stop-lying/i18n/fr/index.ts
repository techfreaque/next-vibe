import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title:
      "J'ai créé un vérificateur de types qui empêche l'IA de me mentir | next-vibe",
    description:
      "L'IA utilisera `any` pour échapper à une erreur de type. Elle ajoutera eslint-disable. Elle vous mentira. Voici comment nous avons réparé la boucle de feedback avec @next-vibe/checker.",
    category: "TypeScript",
    imageAlt: "Le vérificateur de types qui a empêché l'IA de mentir",
    keywords:
      "TypeScript, vérificateur de types, codage avec l'IA, ESLint, Oxlint, type any, sûreté des types, Claude Code, next-vibe",
  },
  hero: {
    label: "TypeScript",
    readTime: "10 min de lecture",
    title: "J'ai créé un vérificateur de types qui empêche l'IA de me mentir",
    subtitle:
      "L'IA utilisera `any` pour échapper à une erreur de type. Elle ajoutera eslint-disable. Elle vous mentira. Voici comment nous avons réparé la boucle de feedback.",
    quoteAiLies:
      "L'IA ne vous ment pas parce qu'elle le veut. Elle vous ment parce que vous la laissez faire.",
  },
  problem: {
    title: "La boucle de feedback cassée",
    description:
      "Demandez à Claude Code d'ajouter une fonctionnalité. Il le fait. Lancez ESLint : ça passe. Lancez TypeScript : erreurs. Demandez à Claude Code de corriger le TypeScript. Il le fait. Relancez ESLint : maintenant c'est lui qui échoue. Des allers-retours. Trois itérations. L'IA est sûre d'elle à chaque étape. À chaque fois : « C'est corrigé. »",
    fixLabel: "Ça n'a jamais été corrigé.",
    fixDescription:
      "C'était un jeu de la taupe avec un outil qui lance un linter à la fois et ne voit jamais l'ensemble.",
    escapeHatch:
      "L'IA corrige l'erreur TypeScript en écrivant une seule ligne et vous dit : « L'erreur de type est résolue. »",
    smokeDetector:
      "Oui. Techniquement. Comme on « résout » une alarme incendie en scotchant le détecteur de fumée.",
    introducingChecker:
      "C'est exactement ce que @next-vibe/checker est là pour empêcher.",
  },
  anyProblem: {
    title: "Le problème de `any`",
    subtitle: "Pourquoi 98 % de sûreté des types revient à 0 %",
    graphDescription:
      "Le système de types de TypeScript est un graphe. Chaque type circule de sa définition à son usage. Si une fonction renvoie `string`, l'appelant sait que c'est une string. Toute la chaîne est vérifiée.",
    holeInGraph: "`any` est un trou dans le graphe.",
    holeDescription:
      "Une variable typée `any` dit au compilateur : arrête de vérifier ici. Pas seulement pour cette variable, mais pour tout ce qui la touche. L'erreur n'apparaît pas au niveau du `any`. Elle apparaît trois fichiers plus loin, quand un refactoring sans rapport casse une hypothèse qui n'a jamais été vérifiée.",
    zeroErrors:
      "Zéro erreur TypeScript ne veut rien dire si vous avez 47 usages de `any` non vérifiés.",
    doubleAssertion:
      "`as unknown as Whatever`, c'est pire. C'est une double assertion de type. Vous dites au compilateur : je sais que c'est faux, et je force le passage quand même. C'est l'échappatoire préférée de l'IA.",
    bannedTitle: "Les motifs interdits dans ce code :",
    bannedNotWarnings:
      "Pas des avertissements. Des erreurs. La vérification échoue. Claude Code doit corriger la cause profonde, sinon il ne peut pas livrer.",
    psychologyNote:
      "Si ce sont des erreurs et non des avertissements, c'est autant pour des raisons psychologiques que techniques. Les modèles d'IA traitent les avertissements comme facultatifs. Les erreurs ferment la boucle.",
    infectionDiagramSubtitle:
      "Un seul type `any` se propage dans le graphe et corrompt l'inférence de types en aval",
    counterZeroErrors: "Erreurs TypeScript",
    counterAnyUsages: "Usages de `any`",
  },
  checker: {
    title: "Voici @next-vibe/checker",
    subtitle: "Une commande. Trois outils. Aucune échappatoire.",
    commandDescription:
      "Voilà la commande. Une seule. Elle lance trois outils en parallèle et vous donne une liste d'erreurs unifiée.",
    oxlintDescription:
      "Linter écrit en Rust. Des centaines de règles. S'exécute en quelques millisecondes, même sur de grosses codebases.",
    eslintDescription:
      "Ce qu'Oxlint ne fait pas encore : lint des hooks React, règles du React Compiler, tri des imports.",
    tsDescription:
      "Vérification de types complète. Pas seulement le fichier que vous éditez : tout le graphe.",
    timingNote:
      "Sur ce code (4 400 fichiers), TypeScript complet prend environ 12 secondes. Oxlint, moins d'une seconde. ESLint, quelques secondes. En parallèle, on tombe à 12.",
    mcpNote:
      "Il propose aussi une commande `vibe-check mcp` qui démarre un serveur MCP avec un outil `check`. L'IA ne lance pas de commande shell : elle appelle un outil qui renvoie des erreurs structurées. Pagination intégrée. Filtrage par chemin.",
    parallel: "en parallèle",
    unifiedErrors: "Liste d'erreurs unifiée",
    unifiedErrorsDescription:
      "Une seule sortie. On corrige jusqu'à ce que ce soit propre.",
  },
  plugins: {
    title: "Plugins maison",
    linterIsDocumentation:
      "Le linter, c'est la documentation. Et elle est appliquée.",
    jsxPluginTitle: "Plugin jsx-capitalization",
    jsxPluginDescription:
      "Il signale les éléments JSX en minuscules, et le message d'erreur dit exactement quoi importer à la place :",
    jsxPluginInsight:
      "Je n'ai écrit aucune documentation pour dire à Claude Code d'utiliser `next-vibe-ui`. Je ne l'ai pas mis dans le prompt système. La première fois que Claude Code écrit `<div>` dans un composant, le vérificateur lève une erreur. Le message contient le chemin d'import exact. Claude Code lit l'erreur, applique la correction et retient la convention.",
    restrictedSyntaxTitle: "Plugin restricted-syntax",
    restrictedSyntaxDescription: "Il interdit trois choses :",
    throwBanTitle: "Les instructions `throw`",
    throwBanDescription:
      "Le message d'erreur dit : « Use proper `ResponseType<T>` patterns instead. » Claude Code tombe dessus, le lit, va voir `ResponseType` et adopte le bon modèle de gestion d'erreurs pour tout le reste de la tâche.",
    unknownBanTitle: "Le type `unknown` nu",
    unknownBanDescription:
      "« Replace 'unknown' with existing typed interface. Align with codebase types rather than converting or recreating. » Cela empêche Claude Code d'écrire des échappatoires de type génériques.",
    objectBanTitle: "Le type `object` nu",
    objectBanDescription:
      "`object` est presque toujours faux. Soit vous connaissez la forme, et vous écrivez l'interface, soit vous avez un `Record<string, SomeType>`. Un `object` brut, c'est le signe que l'IA a abandonné.",
    bannedPatternsTitle: "Motifs interdits",
    bannedLabel: "INTERDIT",
    correctLabel: "CORRECT",
  },
  demo: {
    title: "Démo en direct : le schéma en 3 tours",
    subtitle:
      "Regardez Claude Code buter trois fois sur le vérificateur avant de trouver le bon type",
    round1Title: "Tour 1 : l'IA écrit `any`",
    round1Description:
      "Demandez à Claude Code : « Écris une fonction utilitaire qui prend un objet de réponse d'API brut et en extrait le champ data. La réponse peut avoir différentes formes : utilise le type qu'il faut pour que ça marche. »",
    round1Result: "Claude Code écrit la solution facile :",
    round2Title: "Tour 2 : l'IA tente `unknown`",
    round2Description:
      "Regardez ce qu'il fait ensuite. C'est le moment important. Il tente la sortie de secours suivante :",
    round2Result: "Le vérificateur connaît ce tour-là.",
    round3Title: "Tour 3 : l'IA trouve le vrai type",
    round3Description:
      "Claude Code fait enfin ce qu'il aurait dû faire d'emblée. Il regarde comment les réponses d'API existantes sont typées dans ce code. Il trouve `ResponseType<T>`.",
    round3Result:
      "Zéro erreur. Et la fonction est maintenant vraiment correcte.",
    round3Insight:
      "Ce n'est pas le vérificateur qui l'a écrite. Mais il a bloqué le raccourci, deux fois, jusqu'à ce que Claude Code doive s'attaquer au vrai problème.",
  },
  endpoint: {
    title: "Le lien avec les endpoints",
    subtitle: "Un schéma Zod, quatre consommateurs en aval",
    description:
      "Chaque endpoint a un fichier de définition. Ce fichier contient un schéma Zod pour la requête et un pour la réponse.",
    schemaBecomes:
      "La clé `schema` est un validateur Zod. Ce même schéma Zod devient :",
    webApiValidation: "La règle de validation de l'endpoint de l'API web",
    reactHookTypes: "Le type TypeScript du paramètre d'entrée du hook React",
    cliFlagsDescription:
      "Le flag `--name` de la CLI, avec les contraintes min/max appliquées",
    aiToolSchema: "La description du paramètre dans le schéma de l'outil IA",
    driftProblem:
      "C'est là que la dérive vous tue d'habitude. Vous mettez à jour l'API. Vous oubliez le schéma de l'outil IA. L'IA appelle l'endpoint avec les anciens noms de paramètres. Ça échoue en silence.",
    oneSchemaSolution: "Avec un seul schéma, il n'y a rien à synchroniser.",
    typecheckedNote:
      "Et comme le vérificateur TypeScript tourne aussi là-dessus, si vous modifiez le schéma d'une façon qui casse le type inféré en aval, vous obtenez une erreur de compilation. Le schéma de l'outil IA est vérifié. Les flags de la CLI sont vérifiés. Le hook React est vérifié.",
    stat245: "245 endpoints",
    stat0any: "Zéro `any`",
    stat0unknown: "Zéro cast `unknown`",
    stat0tsExpect: "Zéro `@ts-expect-error`",
    statNote: "Pas par convention. Par le vérificateur.",
  },
  install: {
    title: "Obtenir @next-vibe/checker",
    subtitle:
      "Fonctionne sur n'importe quel projet TypeScript. Pas seulement next-vibe.",
    installDescription:
      "Le vérificateur existe en paquet npm autonome. Il fonctionne sur n'importe quel projet TypeScript, pas seulement NextVibe. Vous n'avez besoin d'aucune autre partie du framework.",
    thenRun: "Puis lancez :",
    mcpTitle: "Intégration MCP",
    mcpDescription:
      "Ajoutez-le à votre config MCP de Claude Code ou de Cursor. Claude Code appelle alors `check` comme un outil, pas comme une commande shell. Erreurs structurées. Paginées. Filtrables par chemin.",
    migrationNote:
      "La page npm propose aussi un prompt de migration. Copiez-le dans Claude Code ou Cursor : il audite votre code, configure le vérificateur et vous fait migrer vers les règles d'interdiction.",
    openSourceNote:
      "C'est open source. GPL-3.0 pour le framework, MIT pour le paquet du vérificateur.",
  },
  closing: {
    title: "Construisez le système pour que mentir soit impossible",
    beforeTitle: "Avant :",
    beforeDescription:
      "Le développement assisté par IA était une négociation. Corriger le lint. Ah, maintenant les types cassent. Corriger les types. Maintenant il y a un `any` que vous n'aviez pas vu. Le corriger. Trois outils séparés à lancer. Trois avis séparés. Jamais sûr que ce soit vraiment propre.",
    afterTitle: "Après :",
    afterDescription:
      "Une commande. Un seul mode d'échec. Soit ça passe, soit non. L'IA sait exactement quoi corriger, parce que les erreurs lui disent précisément ce qui ne va pas et quoi faire à la place. Aucune négociation.",
    finalQuote:
      "Construisez le système pour que mentir soit impossible. C'est à ça que sert un vérificateur de types.",
    ctaGitHub: "Voir sur GitHub",
    ctaInstall: "Installer @next-vibe/checker",
    backToBlog: "Retour au blog",
  },
};
