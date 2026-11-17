import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title:
      "Hermes et Thea : des fils distants dans les deux sens | {{appName}}",
    description:
      "Votre IA locale et votre IA dans le cloud exécutent désormais des fils l'une pour l'autre, dans les deux sens. Pas de clé API sur l'instance qui exécute le tour ? L'appelant reprend la boucle et la termine.",
    category: "Hermes & Thea",
    imageAlt: "Hermes et Thea : deux instances next-vibe connectées",
    keywords:
      "Hermes, Thea, next-vibe, fils distants, IA auto-hébergée, websocket inversé, clé API de secours, {{appName}}",
  },
  hero: {
    backToBlog: "Retour au blog",
    category: "Hermes & Thea",
    readTime: "6 min de lecture",
    title: "Deux IA. Une conversation. Dans les deux sens.",
    subtitle:
      "Hermes tourne sur votre machine. Thea tourne sur un serveur. Désormais, chacune peut confier un fil à l'autre, et une clé API manquante ne fait plus échouer le tour.",
  },
  intro: {
    p1: "next-vibe tourne partout : sur votre portable, sur un VPS, sur les deux à la fois. Connectez deux instances et elles forment un seul système. Les nôtres s'appellent Hermes et Thea.",
    p2: "Cette version boucle la boucle : les fils distants s'exécutent désormais dans les deux sens, et l'instance sans clé de fournisseur ne bloque plus rien.",
  },
  who: {
    title: "Le duo",
    intro: "Même base de code. Des rôles différents.",
    hermes: {
      label: "Local",
      title: "Hermes",
      body: "Tourne sur votre propre ordinateur. À côté de vos fichiers, de votre terminal et de vos agents de code. Votre outil de tous les jours.",
    },
    thea: {
      label: "Cloud",
      title: "Thea",
      body: "Tourne sur un serveur. Toujours en ligne, joignable de partout. Surveille la plateforme et délègue le travail.",
    },
    note: "Chaque instance possède ses propres données et ses propres tâches. La connexion relaie les événements entre elles. Ni plus, ni moins.",
  },
  twoWay: {
    title: "Les fils circulent maintenant dans les deux sens",
    intro:
      "Les fils des dossiers distants et privés s'exécutent sur l'autre instance : de Thea vers Hermes et de Hermes vers Thea.",
    p1: "Placez un fil dans un dossier distant et l'instance d'en face exécute le tour IA complet : modèle, prompt système, outils. Vous continuez d'écrire là où vous êtes. La conversation vous revient en miroir.",
    stepsTitle: "Un tour, de bout en bout",
    step1Title: "Vous écrivez",
    step1Body: "Un message dans un fil distant sur Hermes.",
    step2Title: "La connexion le relaie",
    step2Body:
      "Via un WebSocket persistant, ou un appel HTTP direct quand le pair est joignable publiquement.",
    step3Title: "Thea exécute la boucle",
    step3Body: "Avec son modèle, son prompt, ses outils.",
    step4Title: "Les outils s'exécutent là où ils vivent",
    step4Body:
      "Un outil qui n'existe que sur Hermes est rappelé sur Hermes. Le résultat revient dans la boucle de Thea.",
    step5Title: "Le tour arrive des deux côtés",
    step5Body: "La conversation terminée se synchronise vers votre miroir.",
  },
  keyless: {
    title: "Pas de clé API ? Le tour se termine quand même.",
    intro:
      "L'instance qui exécute un tour a besoin de la clé API du fournisseur du modèle. Toutes les instances n'en ont pas.",
    p1: "Avant de prendre en charge un tour, une instance vérifie la présence de la clé du fournisseur sur son propre nœud. Absente ? Elle échoue tout de suite avec un marqueur clair : elle ne reste pas bloquée et n'écrit pas le fil à moitié.",
    p2: "Le côté appelant reconnaît le marqueur, annule sa comptabilité de relais et exécute la boucle lui-même. Le prompt et les outils de l'instance distante s'appliquent toujours ; les appels d'outils font l'aller-retour via la connexion.",
    calloutTitle: "Le mode fournisseur d'inférence n'a besoin d'aucune clé.",
    calloutBody:
      "Utilisez l'instance connectée comme fournisseur de modèles et votre côté ne touche jamais à une clé de fournisseur. La connexion sert de tuyau vers le modèle.",
    scenarioTitle: "Qui exécute la boucle ?",
    scenario1Label: "L'instance distante a la clé",
    scenario1Body:
      "L'instance distante exécute le tour. Les outils font l'aller-retour.",
    scenario2Label: "L'instance distante n'a pas de clé",
    scenario2Body:
      "L'instance distante échoue tout de suite. L'appelant exécute le tour avec le prompt et les outils de l'instance distante.",
    scenario3Label: "Mode fournisseur d'inférence",
    scenario3Body:
      "L'instance fournisseur exécute le modèle. L'appelant n'a besoin d'aucune clé.",
  },
  underTheHood: {
    title: "Sous le capot",
    intro: "Pour ceux qui lisent le diff.",
    transport:
      "Le transport est négocié à la connexion, jamais configuré à la main. La cible envoie au demandeur un health check authentifié (5 secondes max). Joignable : HTTP direct. Derrière un NAT : le côté masqué ouvre un seul WebSocket sortant et tous les relais sont multiplexés dessus.",
    reconnect:
      "Le connecteur se reconnecte avec un backoff exponentiel de 1 à 30 secondes et relit la connexion à chaque nouvelle tentative. Cette version renforce ce chemin.",
    fixesTitle: "Aussi dans cette version",
    fix1: "Avertissement de lead obsolète : une trame adressée à un lead que cette instance ne connaît plus est rejetée avec un avertissement au lieu d'être ignorée en silence. Réauthentifier la connexion règle le problème.",
    fix2: "Horodatages de la base en UTC, pour Postgres en pool comme pour PGlite : les lignes horodatées par défaut se trient correctement d'une instance à l'autre.",
    fix3: "Le stream writer initialise l'id du fil : les pairs ne rejettent plus d'événements avec un id de fil vide.",
    fix4: "Les tours de reprise se synchronisent avec le pair : les résultats d'outils complétés sur place arrivent jusqu'au miroir.",
    codeCaption: "Le marqueur que renvoie un destinataire sans clé :",
  },
  tryIt: {
    title: "Essayez",
    p1: "Auto-hébergez une instance, puis ajoutez la connexion dans Admin → Remote Connections. Seuls les admins peuvent en créer une ; l'autre côté reçoit automatiquement son entrée.",
  },
  cta: {
    title: "Faites tourner votre propre Hermes.",
    subtitle:
      "Auto-hébergez next-vibe sur votre machine, connectez-le à un serveur, et laissez-les se partager le travail.",
    selfHost: "Guide d'auto-hébergement",
    github: "Lire le code",
  },
};
