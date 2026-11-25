import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Les nouveautés : six mois en une page | {{appName}}",
    description:
      "Stop veut dire stop. La voix marche sur iPhone. Votre IA tourne sur toutes vos machines. Auto-hébergement sans Docker. Un robot de test a fermé huit failles.",
    category: "Mise à jour produit",
    imageAlt: "{{appName}} : mise à jour produit de novembre 2026",
    keywords:
      "{{appName}}, mise à jour produit, Hermes, Thea, PGlite, auto-hébergement, reconnaissance vocale, tests E2E, sécurité",
  },
  hero: {
    backToBlog: "Retour au blog",
    category: "Mise à jour produit",
    readTime: "6 min de lecture",
    title: "Six mois en une page : plus rapide, plus sûr, tourne partout.",
    subtitle:
      "Stop veut dire stop. La voix fonctionne sur iPhone. Votre IA vous suit d'une machine à l'autre. L'auto-hébergement se passe de Docker. Et un robot de test a fermé huit failles de sécurité.",
  },
  intro: {
    lead: "Notre dernière mise à jour date de mai. Depuis, nous avons mis le code à nu, l'avons reconstruit plus à plat et passé des mois à corriger ce que de vrais utilisateurs ont rencontré en production.",
    p1: "Pas de liste creuse de 200 puces. Voici ce que vous allez vraiment sentir, regroupé par endroit où vous le sentirez.",
  },
  chat: {
    title: "Un chat qui obéit",
    intro: "Les petites choses qui rendaient le chat lent ou têtu.",
    stop: {
      title: "Stop veut dire stop",
      body: "Appuyez sur stop et les tokens cessent d'apparaître à l'instant même, sans attendre que le serveur ferme tout. Stop fonctionne désormais aussi dans les discussions incognito et hors connexion, où il ne faisait rien jusqu'ici.",
    },
    input: {
      title: "Une saisie à la taille de votre modèle",
      body: "La zone de message sait combien de place il reste au modèle sélectionné dans ce fil, au lieu d'appliquer une limite unique à tous les modèles.",
    },
    reasoning: {
      title: "Les modèles gardent le fil de leur pensée",
      body: "Les blocs de raisonnement sont renvoyés au modèle au tour suivant au lieu d'être supprimés : les modèles qui réfléchissent s'appuient donc sur ce qu'ils ont déjà établi.",
    },
    queue: {
      title: "Écrivez pendant qu'il travaille",
      body: "Envoyez des messages pendant que l'IA répond : ils se mettent en file, dans l'ordre. Les longues séries d'outils compactent leur contexte en plein stream au lieu de se heurter au mur.",
    },
  },
  voice: {
    title: "Une voix qui fonctionne partout",
    intro: "La reconnaissance vocale a reçu l'attention qu'elle méritait.",
    ios: {
      title: "iPhone et iPad corrigés",
      body: "Safari sur iOS suspendait le moteur audio, et la dictée mourait en silence. Elle reprend maintenant correctement.",
    },
    long: {
      title: "Enregistrez aussi longtemps que vous voulez",
      body: "Les enregistrements sont découpés en morceaux : la dictée n'est plus limitée par un seul envoi.",
    },
    windows: {
      title: "Windows corrigé",
      body: "Une série de correctifs fait fonctionner la reconnaissance vocale sur les PC Windows.",
    },
  },
  agents: {
    title: "Votre IA, sur toutes vos machines",
    intro:
      "Thea tourne dans le cloud. Hermes tourne sur votre ordinateur. Désormais, ils travaillent vraiment ensemble.",
    twoWay: {
      title: "Fils distants dans les deux sens",
      body: "Passez un fil du cloud à votre machine ou l'inverse, dans les deux sens. Si l'autre côté n'a pas de clé d'API, votre côté prend le relais et l'exécute en local.",
      link: "Comment Hermes et Thea communiquent",
    },
    coding: {
      title: "Un agent de code que vous pouvez regarder",
      body: "Thea peut lancer un agent de code interactif sur votre machine, dans une vraie fenêtre de console visible, suivi comme une tâche, avec le résultat renvoyé.",
      link: "Découvrir l'agent de code",
    },
    tools: {
      title: "Des outils plus affûtés",
      body: "Une meilleure automatisation du navigateur avec émulation d'appareils, des outils de bureau sous Windows et des outils SSH pour tous les clients, pas seulement les admins.",
    },
  },
  selfHost: {
    title: "L'auto-hébergement devient simple",
    intro:
      "Faire tourner votre propre instance demandait Docker et une chaîne de compilation C++. Plus maintenant.",
    pglite: {
      title: "Plus besoin de Docker",
      body: "Pointez DATABASE_URL vers un fichier et le serveur tourne sur un Postgres embarqué (PGlite). Migrations et seeds fonctionnent tout simplement.",
    },
    windows: {
      title: "Windows de première classe",
      body: "Des mois de correctifs Windows : chemins, verrous de fichiers, création des utilisateurs, fonctions de base de données. Clonez, installez, lancez.",
    },
    native: {
      title: "Aucun compilateur requis",
      body: "Le hachage des mots de passe passe par des binaires précompilés : pas de node-gyp, pas d'outils de build. Même algorithme, les hachages existants restent valides.",
    },
    revive: {
      title: "Redémarre tout seul",
      body: "Le serveur de production redémarre après un crash, et un redémarrage de la base de données ne peut plus emporter l'application avec lui.",
    },
  },
  security: {
    title: "Plus sûr par défaut",
    intro:
      "Un travail de sécurité que vous ne verrez jamais, et c'est bien le but.",
    e2e: {
      title: "Un robot teste chaque page",
      body: "60 suites de tests de bout en bout pilotent désormais les vraies pages dans un vrai navigateur. Elles ont trouvé huit failles de sécurité, que nous avons fermées, d'une redirection ouverte à des fichiers privés mis en cache publiquement.",
      link: "Lire ce qu'il a trouvé",
    },
    patches: {
      title: "Image de base corrigée",
      body: "Notre conteneur récupère les derniers correctifs de sécurité d'Alpine, dont celui de la CVE-2026-111497.",
    },
    toolCalls: {
      title: "Moins d'appels d'outils cassés",
      body: "Quand un modèle envoie un JSON d'appel d'outil mal formé, il est réparé au lieu de faire échouer tout le tour.",
    },
  },
  cta: {
    title: "Voyez par vous-même.",
    subtitle:
      "Tous les changements ci-dessus sont en ligne sur {{appName}} dès aujourd'hui, et dans le code open source si vous faites tourner votre propre instance.",
    chat: "Commencer à discuter",
    selfHost: "L'auto-héberger",
  },
};
